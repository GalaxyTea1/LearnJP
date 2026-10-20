import columns from './columns.json';
import { Content, decode, positive } from './content';
import { type AuthUser, requireRole } from './auth';
import { HttpError } from './http';
import { isGuardError, type Row } from './learning-db';
import { contentInput, parse, schemas, setting, userStatus, type Kind } from './admin-validation';
import { z } from 'zod';

const tables:Record<Kind,string>={levels:'jlpt_levels',modules:'learning_modules',vocabulary:'vocabulary',kanji:'kanji',grammar:'grammar_patterns',quizzes:'quiz_questions',announcements:'announcements'};
const fields:Record<string,{name:string;column:string;type:string}[]>=columns;
const searchFields:Partial<Record<Kind,string[]>>={vocabulary:['japanese','hiragana','romaji','english'],kanji:['character','meaning','onyomi','kunyomi'],grammar:['pattern','meaning','explanation']};
const safeUser = (r:Row) => ({id:r.id,email:r.email,username:r.username,displayName:r.display_name,avatarUrl:r.avatar_url,role:r.role,currentStreak:r.current_streak,isActive:Boolean(r.is_active),createdAt:r.created_at});
const publicUser = (r:Row|null) => r ? {id:r.id,username:r.username,displayName:r.display_name,role:r.role} : null;
const now=()=>new Date().toISOString();

export class Admin {
  constructor(private db:D1Database,private user:AuthUser) {requireRole(user,['ADMIN','MODERATOR']);}
  sql(query:string,...args:any[]) {return this.db.prepare(query).bind(...args);}
  guard(condition:string,...args:any[]) {return this.sql(`INSERT INTO mutation_guards(id,ok) VALUES (?,CASE WHEN (${condition}) THEN 1 ELSE 0 END)`,crypto.randomUUID(),...args);}
  async commit(statements:D1PreparedStatement[],adminOnly=false) {
    try {
      return await this.db.batch<Row>([
        this.guard(`EXISTS(SELECT 1 FROM users WHERE id=? AND is_active=1 AND role IN (${adminOnly?"'ADMIN'":"'ADMIN','MODERATOR'"}))`,this.user.id),
        ...statements,this.sql('DELETE FROM mutation_guards'),
      ]);
    } catch(e) {
      if(isGuardError(e))throw new HttpError(409,'Data or permissions changed; reload and retry. Protected learning history cannot be deleted.');
      if(/UNIQUE constraint/.test(String(e)))throw new HttpError(409,'This record already exists');
      if(/FOREIGN KEY constraint/.test(String(e)))throw new HttpError(400,'Referenced content does not exist');
      throw e;
    }
  }
  log(action:string,table:string,idSql:string,changed:string[]) {
    // Store field names only: never passwords, setting values or learner data.
    return this.sql(`INSERT INTO activity_logs(user_id,action,entity_type,entity_id,details) VALUES (?,?,?,${idSql},?)`,this.user.id,action,table,JSON.stringify({fields:changed}));
  }
  async row(table:string,id:number) {
    const row=await this.sql(`SELECT * FROM ${table} WHERE id=?`,id).first<Row>();
    if(!row)throw new HttpError(404,'Record not found');return row;
  }
  snapshot(table:string,row:Row) {
    return this.guard(`EXISTS(SELECT 1 FROM ${table} WHERE ${Object.keys(row).map(k=>`"${k}" IS ?`).join(' AND ')})`,...Object.values(row));
  }
  insert(table:string,input:Row) {
    const entries=fields[table].filter(f=>Object.hasOwn(input,f.name));
    return this.sql(`INSERT INTO ${table} (${entries.map(f=>f.column).join(',')}) VALUES (${entries.map(()=>'?').join(',')}) RETURNING *`,...entries.map(f=>input[f.name]==null?null:f.type==='Json'?JSON.stringify(input[f.name]):f.type==='Boolean'?Number(input[f.name]):input[f.name]));
  }
  update(table:string,id:number,input:Row) {
    const entries=fields[table].filter(f=>Object.hasOwn(input,f.name));
    return this.sql(`UPDATE ${table} SET ${entries.map(f=>`${f.column}=?`).join(',')} WHERE id=? RETURNING *`,...entries.map(f=>input[f.name]==null?null:f.type==='Json'?JSON.stringify(input[f.name]):f.type==='Boolean'?Number(input[f.name]):input[f.name]),id);
  }
  related(kind:Kind,idSql:string,input:Row,remove=false):D1PreparedStatement[] {
    const statements:D1PreparedStatement[]=[];
    if(searchFields[kind])statements.push(remove ? this.sql(`DELETE FROM content_search WHERE kind=? AND item_id=${idSql}`,kind) : this.sql(`INSERT INTO content_search(kind,item_id,search_text) VALUES (?,${idSql},?) ON CONFLICT(kind,item_id) DO UPDATE SET search_text=excluded.search_text`,kind,searchFields[kind]!.map(f=>input[f]||'').join('\u001f').toLowerCase()));
    if(kind==='grammar' && input.examples!==undefined && !remove) {
      statements.push(this.sql(`DELETE FROM grammar_examples WHERE grammar_pattern_id=${idSql}`));
      // One statement for all examples; the parent sequence is unaffected by child inserts.
      statements.push(this.sql(`INSERT INTO grammar_examples(grammar_pattern_id,japanese,romaji,english,sort_order) SELECT ${idSql},json_extract(value,'$.japanese'),json_extract(value,'$.romaji'),json_extract(value,'$.english'),COALESCE(json_extract(value,'$.sortOrder'),0) FROM json_each(?)`,JSON.stringify(input.examples)));
    }
    return statements;
  }
  bumpModules(ids:(number|null|undefined)[]) {
    return [...new Set(ids.filter((n):n is number=>typeof n==='number'))].map(id=>this.sql('UPDATE learning_modules SET version=version+1,updated_at=? WHERE id=?',now(),id));
  }
  async create(kind:Kind,raw:unknown) {
    const input=contentInput(kind,raw),table=tables[kind];
    if(kind==='levels'||kind==='modules')input.sortOrder ??= 1;
    if(kind==='announcements')input.createdBy=this.user.id;
    // Each table uses AUTOINCREMENT. Its sequence is read only inside this atomic batch,
    // before another insertion into that table; unrelated child/log inserts cannot change it.
    const idSql=`(SELECT seq FROM sqlite_sequence WHERE name='${table}')`;
    const statements=[this.insert(table,input),...this.related(kind,idSql,input),...this.bumpModules([input.moduleId]),this.log('CREATE',table,idSql,Object.keys(input))];
    if(kind==='grammar')statements.push(this.sql(`SELECT * FROM grammar_examples WHERE grammar_pattern_id=${idSql} ORDER BY sort_order,id`));
    const result=await this.commit(statements);
    const row=decode(table,result[1].results[0]);return kind==='grammar'?{...row,examples:result[result.length-2].results.map(r=>decode('grammar_examples',r))}:row;
  }
  async bulk(raw:unknown) {
    const {items}=parse(z.strictObject({items:z.array(schemas.vocabulary).min(1).max(10)}),raw);
    const statements:D1PreparedStatement[]=[];
    const idSql="(SELECT seq FROM sqlite_sequence WHERE name='vocabulary')";
    for(const input of items)statements.push(this.insert('vocabulary',input),...this.related('vocabulary',idSql,input));
    statements.push(...this.bumpModules(items.map(i=>i.moduleId)),this.log('BULK_CREATE','vocabulary','NULL',['items']));
    await this.commit(statements);return {count:items.length};
  }
  async edit(kind:Kind,id:number,raw:unknown) {
    const input=contentInput(kind,raw,true),table=tables[kind],old=await this.row(table,id),previous=decode(table,old);
    const statements=[this.snapshot(table,old)];
    if(kind==='grammar' && input.examples!==undefined) {
      // Replacing only examples may leave every parent column unchanged. Guard the
      // child snapshot as well so a concurrent replacement cannot silently win.
      const query='SELECT json_group_array(json_array(id,japanese,romaji,english,sort_order)) AS snapshot FROM (SELECT * FROM grammar_examples WHERE grammar_pattern_id=? ORDER BY id)';
      const saved=await this.sql(query,id).first<{snapshot:string}>();
      statements.push(this.guard(`(${query}) IS ?`,id,saved!.snapshot));
    }
    if(kind==='modules') {
      if(input.version!==old.version)throw new HttpError(409,'Module changed; reload before saving');
      input.version=old.version+1;input.updatedAt=now();
      if(input.contentStatus==='PUBLISHED') {
        if(!(await this.sql(`SELECT (${this.publishCondition()}) AS ready`,id,id,id,id,id,id).first<{ready:number}>())?.ready)throw new HttpError(422,'Chưa đủ điều kiện xuất bản: cần 10 mục đã xuất bản, 45 từ vựng, 8 kanji, 5 ngữ pháp, 15 câu quiz và bản thu âm hoặc TTS có lời thoại.');
        statements.push(this.guardPublish(id));
        input.publishedAt=old.published_at||now();
      }
    }
    if(kind==='levels') {
      // The JLPT code is an identity, not a label; renaming would expose another level as N5.
      if(input.level && input.level!==old.level)throw new HttpError(400,'JLPT level code cannot be changed');
    }
    const merged={...previous,...input};
    const mutationIndex=statements.length+1;
    // A grammar-only examples patch still performs a guarded update of its parent.
    statements.push(this.update(table,id,kind==='grammar'?{pattern:old.pattern,...input}:input),...this.related(kind,String(id),merged),...this.bumpModules([previous.moduleId,input.moduleId]),this.log('UPDATE',table,String(id),Object.keys(input)));
    const result=await this.commit(statements),row=decode(table,result[mutationIndex].results[0]);
    return kind==='grammar'?{...row,examples:await new Content(this.db,'').rows('grammar_examples','grammar_pattern_id=?',[id],'sort_order,id')}:row;
  }
  publishCondition() {
    // Same minimum content policy as the admin UI, checked at commit time.
    return `(SELECT count(*) FROM lesson_sections WHERE module_id=? AND status='PUBLISHED')>=10
      AND (SELECT count(*) FROM vocabulary WHERE module_id=?)>=45
      AND (SELECT count(*) FROM kanji WHERE module_id=?)>=8
      AND (SELECT count(*) FROM grammar_patterns WHERE module_id=?)>=5
      AND (SELECT count(*) FROM quiz_questions WHERE module_id=?)>=15
      AND NOT EXISTS(SELECT 1 FROM listening_content l JOIN lesson_sections s ON s.id=l.section_id WHERE s.module_id=? AND s.status='PUBLISHED' AND l.status='PUBLISHED' AND (l.audio_url IS NULL OR trim(l.audio_url)='' OR l.audio_url LIKE 'PENDING_AUDIO%' OR (trim(l.audio_url) LIKE 'TTS:%' AND (trim(l.audio_url)!='TTS:ja-JP' OR length(trim(COALESCE(l.transcript,''),char(9)||char(10)||char(13)||' '))=0))))`;
  }
  guardPublish(id:number) {return this.guard(this.publishCondition(),id,id,id,id,id,id);}
  async remove(kind:Kind,id:number) {
    const table=tables[kind],old=await this.row(table,id),statements=[this.snapshot(table,old)];
    if(kind==='modules')statements.push(this.guard(`NOT EXISTS(SELECT 1 FROM user_module_progress WHERE module_id=?) AND NOT EXISTS(SELECT 1 FROM user_quiz_attempts WHERE module_id=?)`,id,id));
    const itemType: string|undefined=({vocabulary:'VOCAB',kanji:'KANJI',grammar:'GRAMMAR'} as Partial<Record<Kind,string>>)[kind];
    if(itemType)statements.push(this.guard('NOT EXISTS(SELECT 1 FROM user_flashcard_progress WHERE item_type=? AND item_id=?)',itemType,id));
    if(kind==='vocabulary')statements.push(this.guard('NOT EXISTS(SELECT 1 FROM study_mastered_vocabulary WHERE vocabulary_id=?)',id));
    statements.push(...this.related(kind,String(id),{},true),this.sql(`DELETE FROM ${table} WHERE id=?`,id),...this.bumpModules([old.module_id]),this.log('DELETE',table,String(id),[]));
    await this.commit(statements);return {id};
  }
  async users(p:URLSearchParams) {
    const page=positive(p.get('page'),1,100000),limit=positive(p.get('limit'),20,100),search=p.get('search')?.trim()||'';
    if(search.length>100)throw new HttpError(400,'Search is too long');
    const where="(?='' OR instr(lower(email),lower(?))>0 OR instr(lower(username),lower(?))>0 OR instr(lower(COALESCE(display_name,'')),lower(?))>0)";
    const args=[search,search,search,search];
    const [rows,total]=await this.db.batch<Row>([this.sql(`SELECT id,email,username,display_name,avatar_url,role,current_streak,is_active,created_at FROM users WHERE ${where} ORDER BY created_at DESC,id DESC LIMIT ? OFFSET ?`,...args,limit,(page-1)*limit),this.sql(`SELECT count(*) n FROM users WHERE ${where}`,...args)]);
    return {users:rows.results.map(safeUser),pagination:{page,limit,total:total.results[0].n,totalPages:Math.ceil(total.results[0].n/limit)}};
  }
  async updateUser(id:number,raw:unknown) {
    requireRole(this.user,['ADMIN']);const input=parse(userStatus,raw);
    if(!Object.keys(input).length)throw new HttpError(400,'No changes supplied');
    const old=await this.row('users',id);
    const statements=[this.snapshot('users',old),this.update('users',id,{...input,updatedAt:now()}),
      this.guard("EXISTS(SELECT 1 FROM users WHERE role='ADMIN' AND is_active=1)"),
      this.log('UPDATE_USER','users',String(id),Object.keys(input))];
    // Revocation must survive a later reactivation or restoration of privileges.
    if(input.isActive===false || (input.role && input.role!==old.role))statements.push(this.sql('DELETE FROM refresh_tokens WHERE user_id=?',id));
    const result=await this.commit(statements,true);return safeUser(result[2].results[0]);
  }
  async settings(raw?:unknown) {
    if(raw===undefined)return new Content(this.db,'').rows('site_settings','1=1',[],'key');
    requireRole(this.user,['ADMIN']);const input=parse(setting,raw);
    const result=await this.commit([this.sql(`INSERT INTO site_settings(key,value,description,updated_at) VALUES (?,?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,description=CASE WHEN ? THEN excluded.description ELSE site_settings.description END,updated_at=excluded.updated_at RETURNING *`,input.key,input.value,input.description??null,now(),Number(Object.hasOwn(input,'description'))),this.log('UPDATE_SETTING','site_settings','NULL',['key','value'])],true);
    return decode('site_settings',result[1].results[0]);
  }
  async logs(p:URLSearchParams) {
    const page=positive(p.get('page'),1,100000),limit=positive(p.get('limit'),50,100),where=['1=1'],args:any[]=[];
    if(p.has('userId')){where.push('user_id=?');args.push(positive(p.get('userId')));}
    if(p.has('action')){if(p.get('action')!.length>100)throw new HttpError(400,'Invalid action');where.push('action=?');args.push(p.get('action'));}
    const [rows,total]=await this.db.batch<Row>([this.sql(`SELECT l.*,u.id AS actor_id,u.username AS actor_username,u.display_name AS actor_display_name,u.role AS actor_role FROM activity_logs l LEFT JOIN users u ON u.id=l.user_id WHERE ${where.join(' AND ')} ORDER BY l.created_at DESC,l.id DESC LIMIT ? OFFSET ?`,...args,limit,(page-1)*limit),this.sql(`SELECT count(*) n FROM activity_logs WHERE ${where.join(' AND ')}`,...args)]);
    const logs=rows.results.map(r=>({...decode('activity_logs',r),user:publicUser(r.actor_id===null?null:{id:r.actor_id,username:r.actor_username,display_name:r.actor_display_name,role:r.actor_role})}));
    return {logs,pagination:{page,limit,total:total.results[0].n,totalPages:Math.ceil(total.results[0].n/limit)}};
  }
  async dashboard() {
    const r=await this.sql(`SELECT (SELECT count(*) FROM users) totalUsers,(SELECT count(*) FROM users WHERE is_active=1) activeUsers,
      (SELECT count(*) FROM jlpt_levels) totalLevels,(SELECT count(*) FROM learning_modules) totalModules,
      (SELECT count(*) FROM vocabulary) totalVocab,(SELECT count(*) FROM kanji) totalKanji,
      (SELECT count(*) FROM grammar_patterns) totalGrammar,(SELECT count(*) FROM quiz_questions) totalQuizzes,
      (SELECT count(*) FROM user_test_attempts) totalTestAttempts`).first<Row>();
    const {totalUsers,activeUsers,totalTestAttempts,...content}=r!;
    return {stats:{totalUsers,activeUsers,content,activity:{totalTestAttempts}},recentActivity:(await this.logs(new URLSearchParams({limit:'10'}))).logs};
  }
}
