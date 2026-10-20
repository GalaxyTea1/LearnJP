import test,{before,after,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { getPlatformProxy } from 'wrangler';
import { migrate,fixtures,quizQuestions,load } from './learning-fixture.mjs';

let proxy,db,Study,Assessments,Srs,Learner,Content,worker,Auth,env;
const secret='local-only-quiz-revision-key-not-for-production';
const origin='http://127.0.0.1:8787';
before(async()=>{
  proxy=await getPlatformProxy({configPath:fileURLToPath(new URL('../wrangler.local.jsonc',import.meta.url)),persist:false,remoteBindings:false,envFiles:[]});db=proxy.env.DB;
  await migrate(db);await fixtures(db);
  ({Study}=await load('study'));({Assessments}=await load('assessments'));({Srs}=await load('srs'));({Learner}=await load('learner'));({Content}=await load('content'));({Auth}=await load('auth'));worker=(await load('worker')).default;
  env={...proxy.env,APP_ENV:'local',FRONTEND_URL:origin,JWT_SECRET:'local-only-auth-key-never-use-in-production-2026'};
});
after(async()=>{await proxy?.dispose();});
beforeEach(async()=>{
  await db.batch([db.prepare('DELETE FROM users'),db.prepare('DELETE FROM auth_rate_limits'),db.prepare("UPDATE learning_modules SET content_status=CASE WHEN id=3 THEN 'DRAFT' ELSE 'PUBLISHED' END"),db.prepare("UPDATE test_templates SET is_published=1"),db.prepare("UPDATE test_questions SET correct_answer=0")]);
  for(const id of [1,2])await db.prepare('INSERT INTO users(id,email,username,password_hash) VALUES (?,?,?,?)').bind(id,`user${id}@test.invalid`,`user${id}`,'fake-password-hash').run();
  await quizQuestions(db);
});
const assess=(database=db,userId=1)=>new Assessments(database,userId,secret);
const xp=async(userId=1)=>Number((await db.prepare('SELECT total_xp_earned n FROM user_gamification WHERE user_id=?').bind(userId).first())?.n||0);
const count=async(table)=>Number((await db.prepare(`SELECT count(*) n FROM ${table}`).first()).n);
async function payload(correct=10) {
  const q=await new Content(db,secret).questions(1);
  return {moduleId:1,requestId:crypto.randomUUID(),quizRevision:q.quizRevision,answers:q.questions.map((q,i)=>({questionId:q.id,selectedIndex:i<correct?0:1})),timeTaken:30};
}
function interceptBatch(ordinal,work) {
  let n=0;return {prepare:db.prepare.bind(db),batch:async statements=>{if(++n===ordinal)await work();return db.batch(statements);}};
}
async function http(path,{method='GET',body,token,headers={}}={}){
  return worker.fetch(new Request(origin+'/api/v1'+path,{method,headers:{'Content-Type':'application/json','X-Requested-With':'SumaryJP',Origin:origin,...(token?{Authorization:'Bearer '+token}:{}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})}),env);
}

test('study merges concurrent tabs/words, removes individual words and isolates learners',async()=>{
  const study=new Study(db,1);
  assert.deepEqual(await study.read(1),{completedTabs:[],masteredVocabularyIds:[],quizCompleted:false});assert.equal(await count('user_module_progress'),0);
  await Promise.all([study.write(1,{completedTabs:['kanji'],vocabulary:[{id:1,mastered:true}]}),study.write(1,{completedTabs:['grammar'],vocabulary:[{id:2,mastered:true}]})]);
  const r=await study.read(1);assert.deepEqual(r.completedTabs,['grammar','kanji','vocab']);assert.deepEqual(r.masteredVocabularyIds,[1,2]);
  assert.equal((await db.prepare('SELECT progress_percent FROM user_module_progress').first()).progress_percent,50);
  await study.write(1,{vocabulary:[{id:1,mastered:false}]});assert.deepEqual((await study.read(1)).masteredVocabularyIds,[2]);
  assert.deepEqual((await new Study(db,2).read(1)).masteredVocabularyIds,[]);
  assert.equal(await count('mutation_guards'),0);
});

test('study rejects foreign vocabulary, draft IDs and rolls back on an injected write failure',async()=>{
  const study=new Study(db,1);
  await assert.rejects(study.write(1,{vocabulary:[{id:3,mastered:true}]}),{status:400});
  await assert.rejects(study.write(3,{completedTabs:['grammar']}),{status:404});
  await assert.rejects(study.write(1,{completedTabs:['quiz']}),{status:400});
  await db.exec("CREATE TRIGGER fail_study BEFORE INSERT ON study_mastered_vocabulary BEGIN SELECT RAISE(ABORT, 'injected'); END;");
  try{await assert.rejects(study.write(1,{completedTabs:['grammar'],vocabulary:[{id:1,mastered:true}]}));assert.equal(await count('user_module_progress'),0);assert.equal(await count('study_completed_tabs'),0);}finally{await db.exec('DROP TRIGGER fail_study');}
  const changed=interceptBatch(1,()=>db.prepare("UPDATE learning_modules SET content_status='DRAFT' WHERE id=1").run());
  await assert.rejects(new Study(changed,1).write(1,{completedTabs:['grammar']}),{status:409});assert.equal(await count('user_module_progress'),0);
});

test('quiz retry is idempotent across 12 concurrent requests; conflicting payload is rejected',async()=>{
  const p=await payload();const r=await Promise.all(Array.from({length:12},()=>assess().quiz(p)));
  r.forEach(v=>assert.deepEqual(v,r[0]));assert.equal(r[0].xpEarned,100);assert.equal(r[0].passed,true);
  assert.equal(await count('user_quiz_attempts'),1);assert.equal(await xp(),100);
  await assert.rejects(assess().quiz({...p,timeTaken:31}),{status:409});
  assert.deepEqual(await assess().quiz(p),r[0]);
});

test('different passing attempts and a study patch racing award completion XP once',async()=>{
  const p=await payload();
  const results=await Promise.all([assess().quiz(p),assess().quiz({...p,requestId:crypto.randomUUID()}),new Study(db,1).write(1,{completedTabs:['grammar']})]);
  assert.equal(results[0].xpEarned+results[1].xpEarned,100);assert.equal(await xp(),100);
  assert.equal((await new Study(db,1).read(1)).quizCompleted,true);
  await new Study(db,1).update({moduleId:1,progressPercent:0,status:'NOT_STARTED'});
  await assess().quiz(await payload(0));
  const row=await db.prepare('SELECT * FROM user_module_progress').first();assert.equal(row.status,'COMPLETED');assert.equal(row.progress_percent,100);
});

test('quiz uses all questions as denominator; strict 70% threshold, unanswered and invalid options',async()=>{
  const fail=await assess().quiz(await payload(6));assert.equal(fail.passed,false);assert.equal(fail.xpEarned,0);
  const pass=await assess().quiz(await payload(7));assert.equal(pass.passed,true);assert.equal(pass.scorePercent,70);assert.equal(pass.xpEarned,70);
  const partial=await assess(db,2).quiz({...await payload(),answers:[{questionId:1,selectedIndex:0}]});assert.equal(partial.score,1);assert.equal(partial.totalQuestions,10);assert.equal(partial.results[1].selected,null);
  const p=await payload();
  for(const answers of [[{questionId:1,selectedIndex:2}],[{questionId:9999,selectedIndex:0}],[p.answers[0],p.answers[0]]])await assert.rejects(assess().quiz({...p,requestId:crypto.randomUUID(),answers}),{status:400});
  await quizQuestions(db,23);assert.equal((await assess(db,2).quiz(await payload(16))).passed,false); // 69.56% must not round to a pass.
});

test('quiz revision is checked again inside commit, and stale/hidden content cannot write',async()=>{
  const p=await payload();
  const changed=interceptBatch(2,()=>db.prepare("UPDATE quiz_questions SET question='Edited' WHERE id=1").run());
  await assert.rejects(assess(changed).quiz(p),{status:409});
  assert.equal(await count('user_quiz_attempts'),0);assert.equal(await xp(),0);
  await assert.rejects(assess().quiz(p),{status:409});
  const current=await payload();const hidden=interceptBatch(2,()=>db.prepare("UPDATE learning_modules SET content_status='DRAFT' WHERE id=1").run());
  await assert.rejects(assess(hidden).quiz(current),{status:409});assert.equal(await count('user_module_progress'),0);
});

test('malformed assessment content and empty quiz submissions cannot create results or XP',async()=>{
  const p=await payload();await assert.rejects(assess().quiz({...p,answers:[]}),{status:400});
  await db.prepare('UPDATE quiz_questions SET correct_index=999 WHERE id=1').run();
  await assert.rejects(assess().quiz(await payload()),{status:409});
  await db.prepare('UPDATE test_questions SET points=-1 WHERE id=1').run();
  try{await assert.rejects(assess().startTest({templateId:1}),{status:409});}finally{await db.prepare('UPDATE test_questions SET points=1 WHERE id=1').run();}
  assert.equal(await count('user_quiz_attempts'),0);assert.equal(await count('user_test_attempts'),0);assert.equal(await xp(),0);
});

test('XP trigger failure rolls back quiz attempt, completion and ledger',async()=>{
  await db.exec("CREATE TRIGGER fail_xp BEFORE INSERT ON user_gamification BEGIN SELECT RAISE(ABORT, 'injected'); END;");
  const p=await payload();
  try {await assert.rejects(assess().quiz(p));for(const table of ['user_quiz_attempts','user_module_progress','xp_events','mutation_guards'])assert.equal(await count(table),0);}finally{await db.exec('DROP TRIGGER fail_xp');}
  assert.equal((await assess().quiz(p)).xpEarned,100);
});

test('SRS duplicate concurrent reviews advance SM2 once and award two XP only',async()=>{
  const srs=new Srs(db,1),p={itemType:'VOCAB',itemId:1,quality:5};
  const results=await Promise.all(Array.from({length:10},()=>srs.review(p)));
  assert.equal(results.reduce((sum,r)=>sum+r.xpEarned,0),2);assert.equal(await xp(),2);
  const row=await db.prepare('SELECT * FROM user_flashcard_progress').first();assert.equal(row.repetitions,1);assert.equal(row.interval,1);
  assert.equal((await srs.review(p)).xpEarned,0);
  await db.prepare("UPDATE user_flashcard_progress SET next_review='2000-01-01T00:00:00.000Z'").run();
  const next=await srs.review(p);assert.equal(next.interval,6);assert.equal(next.repetitions,2);assert.equal(await xp(),4);
  assert.equal((await srs.stats()).reviewing,1);assert.equal((await srs.due(undefined,20)).length,0);
});

test('SRS hides draft content and rollback keeps review due when XP fails',async()=>{
  const srs=new Srs(db,1);await assert.rejects(srs.review({itemType:'VOCAB',itemId:4,quality:4}),{status:404});
  await db.exec("CREATE TRIGGER fail_srs_xp BEFORE INSERT ON xp_events BEGIN SELECT RAISE(ABORT, 'injected'); END;");
  try{await assert.rejects(srs.review({itemType:'VOCAB',itemId:1,quality:2}));assert.equal(await count('user_flashcard_progress'),0);}finally{await db.exec('DROP TRIGGER fail_srs_xp');}
  await srs.review({itemType:'VOCAB',itemId:1,quality:2});
  await db.prepare("UPDATE learning_modules SET content_status='DRAFT' WHERE id=1").run();
  assert.equal((await srs.stats()).totalTracked,0);assert.deepEqual(await srs.due(undefined,20),[]);
});

test('test start retry is idempotent and snapshot never leaves server responses',async()=>{
  const p={templateId:1,requestId:crypto.randomUUID()};
  const rows=await Promise.all([assess().startTest(p),assess().startTest(p)]);assert.equal(rows[0].id,rows[1].id);assert.equal(await count('user_test_attempts'),1);
  assert.equal('question_snapshot' in rows[0],false);assert.equal('questionSnapshot' in rows[0],false);
  assert.equal((await assess().tests()).length,1);assert.deepEqual(await assess(db,2).tests(),[]);
});

test('test submit retry and concurrent requests award once; ownership and input are enforced',async()=>{
  const attempt=await assess().startTest({templateId:1});const body={answers:[{questionId:1,selectedAnswer:0},{questionId:2,selectedAnswer:0}]};
  await assert.rejects(assess(db,2).submitTest(attempt.id,body),{status:404});
  await assert.rejects(assess().submitTest(attempt.id,{answers:[{questionId:1,selectedAnswer:2}]}),{status:400});
  const result=await Promise.all(Array.from({length:6},()=>assess().submitTest(attempt.id,body)));
  result.forEach(r=>assert.deepEqual(r,result[0]));assert.equal(result[0].totalScore,3);assert.equal(result[0].xpEarned,150);
  assert.equal(await xp(),150);assert.equal(await count('user_test_answers'),2);
  await assert.rejects(assess().submitTest(attempt.id,{answers:[]}),{status:409});
});

test('test changed after start cannot be graded, and a failed submission rolls back all writes',async()=>{
  const a=await assess().startTest({templateId:1}),body={answers:[{questionId:1,selectedAnswer:0}]};
  await db.prepare('UPDATE test_questions SET correct_answer=1 WHERE id=1').run();
  await assert.rejects(assess().submitTest(a.id,body),{status:409});assert.equal(await count('user_test_answers'),0);
  await db.prepare('UPDATE test_questions SET correct_answer=0 WHERE id=1').run();
  await db.exec("CREATE TRIGGER fail_test_xp BEFORE INSERT ON xp_events BEGIN SELECT RAISE(ABORT, 'injected'); END;");
  try {await assert.rejects(assess().submitTest(a.id,body));assert.equal(await count('user_test_answers'),0);assert.equal((await db.prepare('SELECT status FROM user_test_attempts').first()).status,'IN_PROGRESS');}finally{await db.exec('DROP TRIGGER fail_test_xp');}
  const changed=interceptBatch(2,()=>db.prepare('UPDATE test_questions SET correct_answer=1 WHERE id=1').run());
  await assert.rejects(assess(changed).submitTest(a.id,body),{status:409});
});

test('check-in is atomic, UTC streak increments once and daily XP resets on the next award',async()=>{
  const yesterday=new Date(Date.now()-86400000).toISOString();
  await db.prepare('UPDATE users SET last_study_date=?,current_streak=4 WHERE id=1').bind(yesterday).run();
  const results=await Promise.all(Array.from({length:10},()=>new Learner(db,1).checkin()));
  assert.equal(results.filter(r=>r.streakUpdated).length,1);assert.ok(results.every(r=>r.streak===5));
  await db.prepare('UPDATE user_gamification SET daily_xp=99,daily_xp_date=? WHERE user_id=1').bind(yesterday).run();
  assert.equal((await new Learner(db,1).stats()).dailyXp,0);
  await new Srs(db,1).review({itemType:'VOCAB',itemId:1,quality:4});
  assert.equal((await new Learner(db,1).stats()).dailyXp,2);
});

test('settings reject mass assignment; kana increments merge; game claims never earn XP; history is isolated',async()=>{
  const l=new Learner(db,1);
  await assert.rejects(l.settings({userId:2,weeklyGoalTarget:5}),{status:400});
  assert.equal((await l.settings({weeklyGoalTarget:50,dailyReminderTime:'09:30'})).weeklyGoalTarget,50);
  assert.equal((await new Learner(db,2).settings()).weeklyGoalTarget,20);
  await Promise.all(Array.from({length:5},()=>l.kana(undefined,{character:'あ',kanaType:'HIRAGANA',incrementReview:true})));
  assert.equal((await l.kana())[0].reviewCount,5);
  assert.equal((await l.game({gameType:'QUIZ',score:100000})).xpEarned,0);assert.equal(await xp(),0);
  await l.history('translation',20,'write',{sourceText:'hello',translatedText:'こんにちは',direction:'en-ja'});
  assert.equal((await l.history('translation',20,'read')).length,1);assert.deepEqual(await new Learner(db,2).history('translation',20,'read'),[]);
  await new Learner(db,2).history('translation',20,'delete');assert.equal((await l.history('translation',20,'read')).length,1);
  await l.history('translation',20,'delete');assert.equal(await count('translation_history'),0);
});

test('dashboard and progress averages include untouched public modules, exclude drafts',async()=>{
  await new Study(db,1).write(1,{completedTabs:['grammar','kanji','dialogue']});
  const summary=await new Study(db,1).summary();assert.equal(summary.overview.totalModules,2);assert.equal(summary.levelStats[0].avg_progress,25);
  const dashboard=await new Learner(db,1).dashboard();assert.equal(dashboard.inProgressModules.length,1);assert.equal(dashboard.user.username,'user1');
  await db.prepare("UPDATE learning_modules SET content_status='DRAFT' WHERE id=1").run();
  assert.equal((await new Learner(db,1).dashboard()).inProgressModules.length,0);
  assert.deepEqual((await new Study(db,2).reviewItems(20)).vocab.map(v=>v.id),[3]);
});

test('HTTP routes enforce authentication, CSRF, validation and serialize learner results',async()=>{
  assert.equal((await http('/progress/me')).status,401);
  const session=await new Auth(env).register({email:'route@test.invalid',username:'route_test',password:'Test-only-password'});const token=session.data.accessToken;
  assert.equal((await http('/progress/module/1/study',{method:'PATCH',token,body:{completedTabs:['kanji']},headers:{Origin:'https://evil.invalid'}})).status,403);
  const saved=await http('/progress/module/1/study',{method:'PATCH',token,body:{completedTabs:['kanji']}});assert.equal(saved.status,200);assert.deepEqual((await saved.json()).data.completedTabs,['kanji']);
  assert.equal((await http('/progress/module',{method:'POST',token,body:{moduleId:1,status:'COMPLETED'}})).status,400);
  assert.equal((await http('/flashcards/due?itemType=INVALID',{token})).status,400);
  assert.equal((await http('/games/history?limit=500',{token})).status,400);
  assert.equal((await http('/users/dashboard',{token})).status,200);
  assert.equal((await http('/gamification/checkin',{method:'POST',token})).status,200);
  assert.equal((await http('/quizzes/submit',{method:'POST',token,body:await payload()})).status,200);
  assert.equal((await http('/gamification/leaderboard')).status,200);
  assert.equal((await http('/admin/dashboard',{token})).status,403);
  assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results,[]);
});
