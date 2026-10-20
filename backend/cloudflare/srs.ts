import { z } from 'zod';
import { decode } from './content';
import { LearningDB, PUBLIC_MODULES, utcNow, isGuardError, type Row } from './learning-db';
import { HttpError } from './http';

export const itemTypes=z.enum(['VOCAB','KANJI','GRAMMAR']);
const tables={VOCAB:'vocabulary',KANJI:'kanji',GRAMMAR:'grammar_patterns'} as const;
export const publicSrs=`((item_type='VOCAB' AND item_id IN (SELECT id FROM vocabulary WHERE module_id IN (${PUBLIC_MODULES}))) OR (item_type='KANJI' AND item_id IN (SELECT id FROM kanji WHERE module_id IN (${PUBLIC_MODULES}))) OR (item_type='GRAMMAR' AND item_id IN (SELECT id FROM grammar_patterns WHERE module_id IN (${PUBLIC_MODULES}))))`;
export function sm2(quality:number,previous:Row|null,stamp:string) {
  let repetitions=previous?.repetitions||0,interval=previous?.interval||0,ease=previous?.ease_factor||2.5;
  if(quality>=3){interval=repetitions===0?1:repetitions===1?6:Math.round(interval*ease);repetitions++;}else{repetitions=0;interval=1;}
  ease=Number(Math.max(1.3,ease+0.1-(5-quality)*(0.08+(5-quality)*0.02)).toFixed(2));
  const next=new Date(stamp);next.setUTCDate(next.getUTCDate()+interval);
  return {repetitions,interval,ease,next:next.toISOString(),status:repetitions>5&&interval>=21?'MASTERED':repetitions>1?'REVIEWING':'LEARNING'};
}
export class Srs extends LearningDB {
  async review(input:unknown) {
    const p=z.object({itemType:itemTypes,itemId:z.number().int().positive(),quality:z.number().int().min(0).max(5)}).strict().safeParse(input);
    if(!p.success)throw new HttpError(400,'Invalid SRS review');const d=p.data;
    const condition=`EXISTS(SELECT 1 FROM ${tables[d.itemType]} WHERE id=? AND module_id IN (${PUBLIC_MODULES}))`;
    if(!await this.sql(`SELECT 1 WHERE ${condition}`,d.itemId).first())throw new HttpError(404,'Review item not found');
    const select=()=>this.sql('SELECT * FROM user_flashcard_progress WHERE user_id=? AND item_type=? AND item_id=?',this.userId,d.itemType,d.itemId).first<Row>();
    const previous=await select(),stamp=utcNow();
    if(previous&&previous.next_review>stamp)return {...decode('user_flashcard_progress',previous),xpEarned:0};
    const next=sm2(d.quality,previous,stamp),version=previous?.version??-1,operation=crypto.randomUUID();
    try {
      const r=await this.batch([this.guard(condition,d.itemId),
        this.guard('coalesce((SELECT version FROM user_flashcard_progress WHERE user_id=? AND item_type=? AND item_id=?),-1)=?',this.userId,d.itemType,d.itemId,version),
        this.sql(`INSERT INTO user_flashcard_progress(user_id,item_type,item_id,repetitions,interval,ease_factor,next_review,last_review,status,version) VALUES (?,?,?,?,?,?,?,?,?,0)
          ON CONFLICT(user_id,item_type,item_id) DO UPDATE SET repetitions=excluded.repetitions,interval=excluded.interval,ease_factor=excluded.ease_factor,next_review=excluded.next_review,last_review=excluded.last_review,status=excluded.status,version=version+1,updated_at=excluded.last_review RETURNING *`,this.userId,d.itemType,d.itemId,next.repetitions,next.interval,next.ease,next.next,stamp,next.status),
        this.xp(`srs:${this.userId}:${d.itemType}:${d.itemId}:${version+1}`,operation,2,'srs'),
      ]);
      return {...decode('user_flashcard_progress',r[3].results[0]),xpEarned:2};
    }catch(e){if(isGuardError(e)){const current=await select();if(current&&current.next_review>utcNow())return {...decode('user_flashcard_progress',current),xpEarned:0};throw new HttpError(409,'Review changed; reload');}throw e;}
  }
  async due(type:string|undefined,limit:number) {
    const rows=(await this.sql(`SELECT * FROM user_flashcard_progress WHERE user_id=? AND next_review<=? AND ${publicSrs}${type?' AND item_type=?':''} ORDER BY next_review,id LIMIT ?`,this.userId,utcNow(),...(type?[type]:[]),limit).all()).results;
    return Promise.all(rows.map(async r=>({...decode('user_flashcard_progress',r),itemData:decode(tables[r.item_type as keyof typeof tables],(await this.sql(`SELECT * FROM ${tables[r.item_type as keyof typeof tables]} WHERE id=?`,r.item_id).first<Row>())!)})));
  }
  async stats() {
    const rows=(await this.sql(`SELECT status,count(*) n,sum(CASE WHEN next_review<=? THEN 1 ELSE 0 END) due FROM user_flashcard_progress WHERE user_id=? AND ${publicSrs} GROUP BY status`,utcNow(),this.userId).all()).results;
    return {dueCount:rows.reduce((n,r)=>n+Number(r.due),0),learning:Number(rows.find(r=>r.status==='LEARNING')?.n||0),reviewing:Number(rows.find(r=>r.status==='REVIEWING')?.n||0),mastered:Number(rows.find(r=>r.status==='MASTERED')?.n||0),totalTracked:rows.reduce((n,r)=>n+Number(r.n),0)};
  }
}
