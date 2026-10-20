import { z } from 'zod';
import { Content, decode } from './content';
import { LearningDB, utcNow, type Row } from './learning-db';
import { Study } from './study';
import { Srs } from './srs';
import { HttpError } from './http';

export const gameTypes=z.enum(['QUIZ','MATCH','SPEED']);
export const kanaTypes=z.enum(['HIRAGANA','KATAKANA']);
function parsed<T>(schema:z.ZodType<T>,input:unknown):T {const r=schema.safeParse(input);if(!r.success)throw new HttpError(400,'Invalid request data');return r.data;}
export class Learner extends LearningDB {
  async settings(input?:unknown) {
    if(input!==undefined){
      const d=parsed(z.object({weeklyGoalTarget:z.number().int().min(1).max(1000).optional(),dailyReminderTime:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable().optional(),preferredLevel:z.enum(['N5','N4','N3','N2','N1']).nullable().optional()}).strict(),input);
      const mapping={weeklyGoalTarget:'weekly_goal_target',dailyReminderTime:'daily_reminder_time',preferredLevel:'preferred_level'};
      const entries=Object.entries(d);
      if(entries.length)await this.batch([this.sql('INSERT INTO user_learning_settings(user_id) VALUES (?) ON CONFLICT DO NOTHING',this.userId),this.sql(`UPDATE user_learning_settings SET ${entries.map(([k])=>mapping[k as keyof typeof mapping]+'=?').join(',')},updated_at=? WHERE user_id=?`,...entries.map(([,v])=>v),utcNow(),this.userId)]);
    }
    const row=await this.sql('SELECT * FROM user_learning_settings WHERE user_id=?',this.userId).first<Row>();
    return row?decode('user_learning_settings',row):{userId:this.userId,weeklyGoalTarget:20,dailyReminderTime:null,preferredLevel:null};
  }
  async stats() {
    const [game,user]=await this.db.batch<Row>([this.sql('SELECT * FROM user_gamification WHERE user_id=?',this.userId),this.sql('SELECT current_streak,last_study_date FROM users WHERE id=?',this.userId)]);
    const row=game.results[0],u=user.results[0];
    const stats=row?decode('user_gamification',row):{xp:0,totalXpEarned:0,dailyXp:0,streak:0,badges:[],stats:{}};
    if(String(stats.dailyXpDate||'').slice(0,10)!==utcNow().slice(0,10))stats.dailyXp=0;
    return {...stats,currentStreak:u?.current_streak||0,lastStudyDate:u?.last_study_date||null};
  }
  async checkin() {
    const stamp=utcNow(),today=stamp.slice(0,10),yesterday=new Date(Date.parse(stamp)-86400000).toISOString().slice(0,10);
    const r=await this.batch([
      this.sql(`UPDATE users SET current_streak=CASE WHEN substr(last_study_date,1,10)=? THEN current_streak+1 ELSE 1 END,last_study_date=?,updated_at=? WHERE id=? AND (last_study_date IS NULL OR substr(last_study_date,1,10)<?) RETURNING current_streak`,yesterday,stamp,stamp,this.userId,today),
      this.sql('INSERT INTO user_gamification(user_id,streak,last_active_date) SELECT id,current_streak,last_study_date FROM users WHERE id=? ON CONFLICT(user_id) DO UPDATE SET streak=excluded.streak,last_active_date=excluded.last_active_date,updated_at=excluded.last_active_date',this.userId),
      this.sql('SELECT current_streak FROM users WHERE id=?',this.userId),
    ]);
    return {streak:r[3].results[0].current_streak,streakUpdated:r[1].results.length===1};
  }
  async dashboard() {
    const user=await this.sql('SELECT id,username,display_name,avatar_url,current_streak FROM users WHERE id=?',this.userId).first<Row>();
    const [settings,gamification,srs,progress]=await Promise.all([this.settings(),this.stats(),new Srs(this.db,this.userId).stats(),new Study(this.db,this.userId).summary()]);
    return {user:{id:user!.id,username:user!.username,displayName:user!.display_name,avatarUrl:user!.avatar_url,currentStreak:user!.current_streak},settings,gamification,dueReviewsCount:srs.dueCount,inProgressModules:progress.allModuleProgress.filter(r=>r.status==='IN_PROGRESS').slice(0,3)};
  }
  async kana(type?:string,input?:unknown) {
    if(input!==undefined){
      const d=parsed(z.object({character:z.string().min(1).max(3),kanaType:kanaTypes,status:z.enum(['LEARNING','MASTERED']).optional(),incrementReview:z.boolean().optional()}).strict(),input);
      if(!(d.kanaType==='HIRAGANA'?/^[\u3041-\u3096ー]{1,3}$/:/^[\u30a1-\u30faー]{1,3}$/).test(d.character))throw new HttpError(400,'Invalid kana character');
      const stamp=utcNow();
      const r=await this.batch([this.sql(`INSERT INTO user_kana_progress(user_id,kana_type,character,status,review_count,last_reviewed) VALUES (?,?,?,?,?,?) ON CONFLICT(user_id,kana_type,character) DO UPDATE SET status=coalesce(?,status),review_count=review_count+excluded.review_count,last_reviewed=coalesce(excluded.last_reviewed,last_reviewed),updated_at=? RETURNING *`,this.userId,d.kanaType,d.character,d.status||'LEARNING',d.incrementReview?1:0,d.incrementReview?stamp:null,d.status??null,stamp)]);
      return decode('user_kana_progress',r[1].results[0]);
    }
    return new Content(this.db,'').rows('user_kana_progress','user_id=?'+(type?' AND kana_type=?':''),[this.userId,...(type?[type]:[])],'character');
  }
  async game(input:unknown) {
    const d=parsed(z.object({gameType:gameTypes,score:z.number().int().min(0).max(100000),streak:z.number().int().min(0).max(10000).optional(),details:z.record(z.string(),z.unknown()).optional()}).strict(),input);
    const r=await this.batch([this.sql('INSERT INTO user_game_scores(user_id,game_type,score,streak,details) VALUES (?,?,?,?,?) RETURNING *',this.userId,d.gameType,d.score,d.streak||0,d.details?JSON.stringify(d.details):null)]);
    return {scoreRecord:decode('user_game_scores',r[1].results[0]),xpEarned:0};
  }
  async games(type:string|undefined,limit:number) {return new Content(this.db,'').rows('user_game_scores','user_id=?'+(type?' AND game_type=?':''),[this.userId,...(type?[type]:[])],'played_at DESC,id DESC',[limit,0]);}
  async leaderboard(kind:'games'|'gamification',limit:number,type?:string) {
    const table=kind==='games'?'user_game_scores':'user_gamification';
    const r=await this.sql(`SELECT g.*,u.username,u.display_name,u.avatar_url,u.current_streak FROM ${table} g JOIN users u ON u.id=g.user_id WHERE u.is_active=1${type?' AND g.game_type=?':''} ORDER BY ${kind==='games'?'g.score':'g.total_xp_earned'} DESC,g.user_id LIMIT ?`,...(type?[type]:[]),limit).all();
    return r.results.map(row=>({...decode(table,row),user:{id:row.user_id,username:row.username,displayName:row.display_name,avatarUrl:row.avatar_url,currentStreak:row.current_streak}}));
  }
  async history(kind:'search'|'translation',limit:number,action:'read'|'delete'|'write',input?:unknown) {
    const table=kind==='search'?'search_history':'translation_history';
    if(action==='delete'){const r=await this.batch([this.sql(`DELETE FROM ${table} WHERE user_id=? RETURNING id`,this.userId)]);return {count:r[1].results.length};}
    if(action==='write'){
      const d=parsed(z.object({sourceText:z.string().min(1).max(5000),translatedText:z.string().min(1).max(10000),direction:z.string().min(1).max(30)}).strict(),input);
      const r=await this.batch([this.sql('INSERT INTO translation_history(user_id,source_text,translated_text,direction) VALUES (?,?,?,?) RETURNING *',this.userId,d.sourceText,d.translatedText,d.direction)]);return decode(table,r[1].results[0]);
    }
    return new Content(this.db,'').rows(table,'user_id=?',[this.userId],kind==='search'?'searched_at DESC,id DESC':'translated_at DESC,id DESC',[limit,0]);
  }
}
