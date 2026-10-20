import test,{before,after,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {getPlatformProxy} from 'wrangler';
import {migrate,fixtures,load} from './learning-fixture.mjs';

let proxy,db,env,Admin,Auth,worker,sessions;
const origin='http://127.0.0.1:8787';
const vocab={moduleId:1,japanese:'勉強',hiragana:'べんきょう',romaji:'BENKYOU',english:'HỌC 日本',type:'NOUN',level:'N5'};
const grammar={moduleId:1,pattern:'です',meaning:'LÀ',explanation:'Example',level:'N5',examples:[{japanese:'学生です',english:'Student'}]};
const level={level:'N4',title:'N4',titleJp:'日本語',color:'green',badge:'N4',description:'Draft',totalVocab:0,totalKanji:0,totalGrammar:0};
before(async()=>{
  proxy=await getPlatformProxy({configPath:fileURLToPath(new URL('../wrangler.local.jsonc',import.meta.url)),persist:false,remoteBindings:false,envFiles:[]});db=proxy.env.DB;
  await migrate(db);({Admin}=await load('admin'));({Auth}=await load('auth'));worker=(await load('worker')).default;
  env={...proxy.env,APP_ENV:'local',FRONTEND_URL:origin,JWT_SECRET:'local-only-auth-key-never-use-in-production-2026'};
});
after(async()=>{await proxy?.dispose();});
beforeEach(async()=>{
  await db.batch(['users','jlpt_levels','vocabulary','kanji','grammar_patterns','test_templates','content_search','activity_logs','announcements','site_settings','auth_rate_limits'].map(t=>db.prepare(`DELETE FROM ${t}`)));
  await fixtures(db);sessions={};
  for(const role of ['ADMIN','MODERATOR','USER']) {
    const session=await new Auth(env).register({email:role.toLowerCase()+'@test.invalid',username:role.toLowerCase(),password:'Test-only-password-123'});
    await db.prepare('UPDATE users SET role=? WHERE id=?').bind(role,session.data.user.id).run();
    sessions[role]={...session,user:{...session.data.user,role}};
  }
});
const service=(role='ADMIN',database=db)=>new Admin(database,sessions[role].user);
const count=async table=>(await db.prepare(`SELECT count(*) n FROM ${table}`).first()).n;
const record=async(table,id)=>db.prepare(`SELECT * FROM ${table} WHERE id=?`).bind(id).first();
const version=async(id=1)=>(await record('learning_modules',id)).version;
async function http(path,{method='GET',body,role,headers={}}={}) {
  return worker.fetch(new Request(origin+'/api/v1'+path,{method,headers:{'Content-Type':'application/json','X-Requested-With':'SumaryJP',Origin:origin,...(role?{Authorization:'Bearer '+sessions[role].data.accessToken}:{}),...headers},...(body===undefined?{}:{body:typeof body==='string'?body:JSON.stringify(body)})}),env);
}
function intercept(work) {return {prepare:db.prepare.bind(db),batch:async statements=>{await work();return db.batch(statements);}};}
async function publishable(id=3) {
  await db.prepare("WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<10) INSERT INTO lesson_sections(module_id,section_type,title,sort_order,status) SELECT ?,'OVERVIEW','Title',x,'PUBLISHED' FROM n").bind(id).run();
  await db.prepare("WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<45) INSERT INTO vocabulary(module_id,japanese,romaji,english,type) SELECT ?,'日本','nihon','Japan','NOUN' FROM n").bind(id).run();
  await db.prepare("WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<8) INSERT INTO kanji(module_id,character,meaning,level) SELECT ?,('字'||x),'Character','N5' FROM n").bind(id).run();
  await db.prepare("WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<5) INSERT INTO grammar_patterns(module_id,pattern,meaning,explanation,level) SELECT ?,'です','is','Example','N5' FROM n").bind(id).run();
  await db.prepare("WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<15) INSERT INTO quiz_questions(module_id,question,options,correct_index,explanation) SELECT ?,'Question','[\"a\",\"b\"]',0,'Explanation' FROM n").bind(id).run();
}

test('admin reads require roles; users and logs never expose password hashes or refresh sessions',async()=>{
  assert.equal((await service().users(new URLSearchParams())).pagination.total,3);
  for(const path of ['/admin/dashboard','/admin/users','/admin/logs','/admin/settings','/announcements/all']) {
    assert.equal((await http(path)).status,401);assert.equal((await http(path,{role:'USER'})).status,403);
    for(const role of ['ADMIN','MODERATOR'])assert.equal((await http(path,{role})).status,200,`${path} ${role}`);
  }
  await service().create('vocabulary',vocab);
  const result=await (await http('/admin/users?limit=2',{role:'ADMIN'})).json();assert.equal(result.data.users.length,2);assert.equal(result.data.pagination.total,3);
  assert.equal(JSON.stringify(result).includes('password'),false);assert.equal(JSON.stringify(result).includes('refresh'),false);
  const dashboard=await service().dashboard();assert.equal(dashboard.stats.totalUsers,3);assert.equal(dashboard.stats.content.totalVocab,5);assert.equal(dashboard.recentActivity[0].user.role,'ADMIN');
  assert.equal((await service().logs(new URLSearchParams({action:'CREATE'}))).pagination.total,1);
  assert.equal((await http('/admin/users?limit=1001',{role:'ADMIN'})).status,400);
});

test('moderator cannot elevate accounts or change site settings; requests reject mass assignment',async()=>{
  assert.equal((await http(`/admin/users/${sessions.MODERATOR.user.id}/status`,{method:'PUT',role:'MODERATOR',body:{role:'ADMIN'}})).status,403);
  assert.equal((await http('/admin/settings',{method:'PUT',role:'MODERATOR',body:{key:'test',value:'value'}})).status,403);
  await assert.rejects(service().updateUser(sessions.USER.user.id,{passwordHash:'injected'}),{status:400});
  assert.equal((await http('/vocabulary',{method:'POST',role:'USER',body:vocab})).status,403);
  assert.equal((await http('/vocabulary',{method:'POST',role:'ADMIN',body:{...vocab,id:99}})).status,400);
  assert.equal((await http('/announcements',{method:'POST',role:'ADMIN',body:{title:'Hi',content:'Hi',createdBy:sessions.USER.user.id}})).status,400);
});

test('last active administrator is protected atomically, including concurrent demotions',async()=>{
  await assert.rejects(service().updateUser(sessions.ADMIN.user.id,{isActive:false}),{status:409});
  assert.equal((await record('users',sessions.ADMIN.user.id)).is_active,1);assert.equal(await count('activity_logs'),0);
  await service().updateUser(sessions.MODERATOR.user.id,{role:'ADMIN'});
  const second=new Admin(db,{...sessions.MODERATOR.user,role:'ADMIN'});
  const result=await Promise.allSettled([service().updateUser(sessions.ADMIN.user.id,{role:'USER'}),second.updateUser(sessions.MODERATOR.user.id,{role:'USER'})]);
  assert.equal(result.filter(r=>r.status==='fulfilled').length,1);
  assert.equal((await db.prepare("SELECT count(*) n FROM users WHERE role='ADMIN' AND is_active=1").first()).n,1);
});

test('disable and role changes revoke sessions even after reactivation',async()=>{
  await service().updateUser(sessions.USER.user.id,{isActive:false});
  await service().updateUser(sessions.USER.user.id,{isActive:true});
  assert.equal((await http('/auth/me',{role:'USER'})).status,401);
  await assert.rejects(new Auth(env).refresh(sessions.USER.refresh),{status:401});
  assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens WHERE user_id=?').bind(sessions.USER.user.id).first()).n,0);
});

test('role is checked again inside the write transaction and failed logs roll back content and search',async()=>{
  const changed=intercept(()=>db.prepare("UPDATE users SET role='USER' WHERE id=?").bind(sessions.MODERATOR.user.id).run());
  await assert.rejects(service('MODERATOR',changed).create('vocabulary',vocab),{status:409});assert.equal(await count('vocabulary'),4);assert.equal(await count('content_search'),0);
  await db.exec("CREATE TRIGGER fail_log BEFORE INSERT ON activity_logs BEGIN SELECT RAISE(ABORT,'injected'); END;");
  try{await assert.rejects(service().create('vocabulary',vocab));assert.equal(await count('vocabulary'),4);assert.equal(await count('content_search'),0);}finally{await db.exec('DROP TRIGGER fail_log');}
  assert.equal(await count('mutation_guards'),0);
});

test('privileged preview includes draft/N4 and quiz answers; public and learner views stay filtered',async()=>{
  const a=service(),n4=await a.create('levels',level),module=await a.create('modules',{levelId:n4.id,unitNumber:1,title:'N4 draft',titleJp:'N4',description:'Draft',topics:['a']});
  await a.create('vocabulary',{...vocab,moduleId:module.id,level:'N4'});
  await a.create('quizzes',{moduleId:module.id,question:'Secret question',options:['a','b'],correctIndex:1,explanation:'Secret answer'});
  await db.prepare("INSERT INTO lesson_sections(module_id,section_type,title,sort_order,status) VALUES (?,'OVERVIEW','Draft section',1,'DRAFT')").bind(module.id).run();
  assert.equal((await http(`/modules/${module.id}/full`)).status,404);
  for(const role of [undefined,'USER'])assert.equal((await http(`/modules/${module.id}/full?preview=true`,{role})).status,403);
  const preview=(await (await http(`/modules/${module.id}/full?preview=true`,{role:'MODERATOR'})).json()).data;
  assert.equal(preview.sections[0].status,'DRAFT');assert.equal(preview.quizQuestions[0].correctIndex,1);assert.equal(preview.quizQuestions[0].explanation,'Secret answer');
  assert.equal((await (await http('/modules')).json()).data.length,2);assert.equal((await (await http('/modules?preview=true',{role:'ADMIN'})).json()).data.length,4);
  await a.create('quizzes',{moduleId:1,question:'Public',options:['a','b'],correctIndex:0,explanation:'Private'});
  const publicQuiz=(await (await http('/quizzes/module/1',{role:'ADMIN'})).json()).data[0];assert.equal('correctIndex' in publicQuiz,false);assert.equal('explanation' in publicQuiz,false);
  await a.create('vocabulary',{...vocab,moduleId:null});assert.equal((await http('/vocabulary?preview=true',{role:'ADMIN'})).status,200);
});

test('vocabulary CRUD and bulk keep Unicode search index in sync; invalid bulk is atomic',async()=>{
  const a=service('MODERATOR'),v=await a.create('vocabulary',vocab);
  let found=await (await http('/vocabulary?search='+encodeURIComponent('học'))).json();assert.equal(found.data[0].id,v.id);
  await a.edit('vocabulary',v.id,{english:'ĐỔI'});
  assert.equal((await (await http('/vocabulary?search='+encodeURIComponent('học'))).json()).data.length,0);
  assert.equal((await (await http('/vocabulary?search='+encodeURIComponent('đổi'))).json()).data[0].id,v.id);
  const before=await count('vocabulary');await assert.rejects(a.bulk({items:[vocab,{...vocab,moduleId:999999}]}),{status:400});assert.equal(await count('vocabulary'),before);
  assert.deepEqual(await a.bulk({items:[vocab,{...vocab,japanese:'学ぶ'}]}),{count:2});
  assert.equal(await count('content_search'),3);await a.remove('vocabulary',v.id);assert.equal(await count('content_search'),2);
  assert.equal((await record('learning_modules',1)).version,5);
  assert.equal(await count('mutation_guards'),0);assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results,[]);
});

test('grammar examples, Unicode search and parent update roll back together',async()=>{
  const a=service(),g=await a.create('grammar',grammar);
  assert.equal((await db.prepare('SELECT grammar_pattern_id FROM grammar_examples').first()).grammar_pattern_id,g.id);
  const oldExamples=(await db.prepare('SELECT * FROM grammar_examples').all()).results;
  await db.exec("CREATE TRIGGER fail_examples BEFORE INSERT ON grammar_examples BEGIN SELECT RAISE(ABORT,'injected'); END;");
  try{await assert.rejects(a.edit('grammar',g.id,{meaning:'CHANGED',examples:[{japanese:'失敗',english:'Failure'}]}));}finally{await db.exec('DROP TRIGGER fail_examples');}
  assert.equal((await record('grammar_patterns',g.id)).meaning,'LÀ');assert.deepEqual((await db.prepare('SELECT * FROM grammar_examples').all()).results,oldExamples);
  assert.equal((await db.prepare("SELECT search_text FROM content_search WHERE kind='grammar'").first()).search_text.includes('changed'),false);
  const update=await a.edit('grammar',g.id,{examples:[{japanese:'新しい',english:'New'}]});assert.equal(update.examples.length,1);assert.equal(update.examples[0].grammarPatternId,g.id);
  const changed=intercept(()=>a.edit('grammar',g.id,{examples:[{japanese:'保存済み',english:'Saved'}]}));
  await assert.rejects(service('ADMIN',changed).edit('grammar',g.id,{examples:[{japanese:'古い編集',english:'Stale'}]}),{status:409});
  assert.equal((await db.prepare('SELECT english FROM grammar_examples WHERE grammar_pattern_id=?').bind(g.id).first()).english,'Saved');
  await a.remove('grammar',g.id);assert.equal(await count('grammar_examples'),0);assert.equal(await count('content_search'),0);
});

test('kanji CRUD validates uniqueness; quiz writes invalidate quiz revision and reject bad answers',async()=>{
  const a=service(),k=await a.create('kanji',{moduleId:1,character:'日',meaning:'DAY',level:'N5',exampleWords:[{jp:'日本',en:'Japan'}]});
  await assert.rejects(a.create('kanji',{character:'日',meaning:'Sun',level:'N5'}),{status:409});
  const update=await a.edit('kanji',k.id,{meaning:'SUN'});assert.equal(update.meaning,'SUN');assert.deepEqual(update.exampleWords,[{jp:'日本',en:'Japan'}]);
  await a.remove('kanji',k.id);assert.equal(await count('content_search'),0);
  const original=(await (await http('/quizzes/module/1')).json()).meta.quizRevision;
  await assert.rejects(a.create('quizzes',{moduleId:1,question:'Q',options:['a','b'],correctIndex:2,explanation:'E'}),{status:400});
  const q=await a.create('quizzes',{moduleId:1,question:'Q',options:['a','b'],correctIndex:1,explanation:'E'});
  assert.notEqual((await (await http('/quizzes/module/1')).json()).meta.quizRevision,original);
  await a.remove('quizzes',q.id);assert.equal((await (await http('/quizzes/module/1')).json()).meta.quizRevision,original);
});

test('module versions prevent stale edits and overlapping saves; levels cannot be renamed',async()=>{
  const a=service(),v=await version();
  const first=await a.edit('modules',1,{title:'Edited',version:v});assert.equal(first.version,v+1);
  await assert.rejects(a.edit('modules',1,{title:'Stale',version:v}),{status:409});
  await assert.rejects(a.edit('modules',1,{title:'Missing version'}),{status:400});
  const raced=await Promise.allSettled([a.edit('modules',1,{title:'A',version:v+1}),a.edit('modules',1,{title:'B',version:v+1})]);assert.equal(raced.filter(r=>r.status==='fulfilled').length,1);
  await assert.rejects(a.edit('levels',1,{level:'N4'}),{status:400});assert.equal((await a.edit('levels',1,{title:'N5 title'})).title,'N5 title');
});

test('publish checks run on server and inside transaction; publish timestamp is server-owned',async()=>{
  const a=service();await assert.rejects(a.edit('modules',3,{contentStatus:'PUBLISHED',version:await version(3)}),{status:422});
  await assert.rejects(a.edit('modules',3,{contentStatus:'PUBLISHED',publishedAt:new Date().toISOString(),version:1}),{status:400});
  await publishable();
  await db.prepare("INSERT INTO listening_content(section_id,title,audio_url,transcript,sort_order,status) SELECT id,'Audio','PENDING_AUDIO_1','Transcript',1,'PUBLISHED' FROM lesson_sections WHERE module_id=3 ORDER BY id LIMIT 1").run();
  await assert.rejects(a.edit('modules',3,{contentStatus:'PUBLISHED',version:await version(3)}),{status:422});
  await db.prepare("UPDATE listening_content SET audio_url='' WHERE title='Audio'").run();
  await assert.rejects(a.edit('modules',3,{contentStatus:'PUBLISHED',version:await version(3)}),{status:422});
  await db.prepare("UPDATE listening_content SET audio_url='/audio/test.mp3' WHERE title='Audio'").run();
  await db.prepare("UPDATE listening_content SET audio_url='TTS:ja-JP',transcript='   ' WHERE title='Audio'").run();
  await assert.rejects(a.edit('modules',3,{contentStatus:'PUBLISHED',version:await version(3)}),{status:422});
  await db.prepare("UPDATE listening_content SET audio_url='TTS:en-US',transcript='日本語' WHERE title='Audio'").run();
  await assert.rejects(a.edit('modules',3,{contentStatus:'PUBLISHED',version:await version(3)}),{status:422});
  await db.prepare("UPDATE listening_content SET audio_url='TTS:ja-JP' WHERE title='Audio'").run();
  const ttsRace=intercept(()=>db.prepare("UPDATE listening_content SET transcript='' WHERE title='Audio'").run());
  await assert.rejects(service('ADMIN',ttsRace).edit('modules',3,{contentStatus:'PUBLISHED',version:await version(3)}),{status:409});
  assert.equal((await record('learning_modules',3)).content_status,'DRAFT');
  await db.prepare("UPDATE listening_content SET transcript='日本語' WHERE title='Audio'").run();
  const raced=intercept(()=>db.prepare("UPDATE lesson_sections SET status='DRAFT' WHERE module_id=3").run());
  await assert.rejects(service('ADMIN',raced).edit('modules',3,{contentStatus:'PUBLISHED',version:await version(3)}),{status:409});assert.equal((await record('learning_modules',3)).content_status,'DRAFT');
  await db.prepare("UPDATE lesson_sections SET status='PUBLISHED' WHERE module_id=3").run();
  const published=await a.edit('modules',3,{contentStatus:'PUBLISHED',version:await version(3)});assert.equal(published.contentStatus,'PUBLISHED');assert.ok(Number.isFinite(Date.parse(published.publishedAt)));
  assert.equal((await http('/modules/3')).status,200);
  await a.edit('modules',3,{contentStatus:'ARCHIVED',version:published.version});assert.equal((await http('/modules/3')).status,404);
});

test('destructive deletes preserve learning history and flashcard records',async()=>{
  const a=service(),uid=sessions.USER.user.id;
  await db.prepare('INSERT INTO user_module_progress(user_id,module_id) VALUES (?,1)').bind(uid).run();
  await assert.rejects(a.remove('modules',1),{status:409});assert.equal(await count('user_module_progress'),1);
  await db.prepare("INSERT INTO user_flashcard_progress(user_id,item_type,item_id) VALUES (?,'VOCAB',1)").bind(uid).run();
  await assert.rejects(a.remove('vocabulary',1),{status:409});assert.ok(await record('vocabulary',1));
  await a.remove('modules',3);assert.equal(await record('learning_modules',3),null);
});

test('announcements handle expiry, activation and ownership; settings logs do not contain values',async()=>{
  const a=service('MODERATOR'),active=await a.create('announcements',{title:'Update',content:'Content'});
  await a.create('announcements',{title:'Expired',content:'Old',expiresAt:'2020-01-01T01:00:00+07:00'});
  await a.create('announcements',{title:'Inactive',content:'Hidden',isActive:false});
  assert.equal(active.createdBy,sessions.MODERATOR.user.id);
  assert.equal((await (await http('/announcements/active')).json()).data.length,1);
  const all=(await (await http('/announcements/all',{role:'ADMIN'})).json()).data;assert.equal(all.length,3);assert.equal(all[0].creator.username,'moderator');
  await a.edit('announcements',active.id,{isActive:false});assert.equal((await (await http('/announcements/active')).json()).data.length,0);
  await a.remove('announcements',active.id);assert.equal(await count('announcements'),2);
  await service().settings({key:'site.title',value:'Private value',description:'Title'});await service().settings({key:'site.title',value:'New value'});
  assert.equal((await service().settings())[0].description,'Title');assert.equal(JSON.stringify(await service().logs(new URLSearchParams())).includes('Private value'),false);
});

test('write routes enforce CSRF, JSON limits, strict IDs and method contracts',async()=>{
  for(const headers of [{Origin:'https://evil.invalid'},{'X-Requested-With':''},{'Sec-Fetch-Site':'cross-site'}])assert.equal((await http('/vocabulary',{method:'POST',role:'ADMIN',body:vocab,headers})).status,403);
  assert.equal((await http('/vocabulary',{method:'POST',role:'ADMIN',body:'{bad'})).status,400);
  assert.equal((await http('/vocabulary',{method:'POST',role:'ADMIN',body:vocab,headers:{'Content-Type':'text/plain'}})).status,415);
  assert.equal((await http('/vocabulary',{method:'POST',role:'ADMIN',body:{...vocab,english:'x'.repeat(140000)}})).status,413);
  assert.equal((await http('/modules/1x',{method:'DELETE',role:'ADMIN'})).status,400);
  assert.equal((await http('/levels/1',{method:'DELETE',role:'ADMIN'})).status,405);
  assert.equal((await http('/vocabulary/99999',{method:'DELETE',role:'ADMIN'})).status,404);
});
