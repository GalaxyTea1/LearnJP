import assert from 'node:assert/strict';
import test from 'node:test';
import { createHmac } from 'node:crypto';
import {reviewedPackage} from './n5-content-package.mjs';

const {candidate:data}=await reviewedPackage();
const publicModules=data.learning_modules.filter(m=>m.contentStatus==='PUBLISHED');
const get=async path=>{
  const r=await fetch('http://127.0.0.1:8787/api/v1'+path,{signal:AbortSignal.timeout(15000)});
  return {status:r.status,body:await r.json()};
};
const sort=rows=>[...rows].sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0)||a.id-b.id);
const revision=(id,qs)=>createHmac('sha256','local-only-quiz-revision-key-not-for-production').update(JSON.stringify(['quiz-v1',id,qs.map(q=>[q.id,q.question,q.options,q.correctIndex,q.explanation,q.questionType,q.points])])).digest('hex');

test('catalog contains exactly the published N5 modules and correct counts',async()=>{
  const {status,body}=await get('/modules'); assert.equal(status,200);
  assert.deepEqual(body.data.map(m=>m.id),[...publicModules].sort((a,b)=>a.levelId-b.levelId||a.unitNumber-b.unitNumber).map(m=>m.id));
  for(const m of body.data) {
    assert.equal(m.status,'NOT_STARTED');
    assert.equal(m._count.vocabulary,data.vocabulary.filter(v=>v.moduleId===m.id).length);
    assert.equal(m._count.quizQuestions,data.quiz_questions.filter(q=>q.moduleId===m.id).length);
  }
  assert.equal((await get('/modules?level=N4')).body.data.length,0);
  const levels=(await get('/levels')).body.data;
  assert.equal(levels.find(l=>l.level==='N5')._count.modules,publicModules.length);
});

for(const module of publicModules) test(`full module ${module.id} matches source content and publication ancestry`,async()=>{
  const {status,body}=await get(`/modules/${module.id}/full`); assert.equal(status,200);
  const m=body.data;
  for(const [key,value] of Object.entries(module)) assert.deepEqual(m[key],value);
  for(const [key,table] of [['vocabulary','vocabulary'],['kanji','kanji']]) assert.deepEqual(m[key],data[table].filter(r=>r.moduleId===module.id));
  assert.deepEqual(m.grammarPatterns,data.grammar_patterns.filter(g=>g.moduleId===module.id).map(g=>({...g,examples:sort(data.grammar_examples.filter(e=>e.grammarPatternId===g.id))})));
  const sections=sort(data.lesson_sections.filter(s=>s.moduleId===module.id&&s.status==='PUBLISHED'));
  assert.deepEqual(m.sections.map(s=>s.id),sections.map(s=>s.id));
  const publicSections=new Set(sections.map(s=>s.id));
  const allowed=(table,id)=>data[table].some(r=>r.id===id&&r.status==='PUBLISHED'&&publicSections.has(r.sectionId));
  const exercises=data.lesson_exercises.filter(e=>e.status==='PUBLISHED'&&publicSections.has(e.sectionId)&&
    (e.readingPassageId===null||allowed('reading_passages',e.readingPassageId))&&(e.listeningId===null||allowed('listening_content',e.listeningId)));
  for(const s of m.sections) {
    assert.deepEqual(s.exercises,sort(exercises.filter(e=>e.sectionId===s.id)));
    assert.deepEqual(s.conversations,sort(data.conversations.filter(c=>c.sectionId===s.id&&c.status==='PUBLISHED')).map(c=>({...c,lines:sort(data.conversation_lines.filter(l=>l.conversationId===c.id))})));
    assert.deepEqual(s.listeningContent,sort(data.listening_content.filter(r=>r.sectionId===s.id&&r.status==='PUBLISHED')));
    assert.deepEqual(s.readingPassages,sort(data.reading_passages.filter(r=>r.sectionId===s.id&&r.status==='PUBLISHED')).map(r=>({...r,exercises:sort(exercises.filter(e=>e.readingPassageId===r.id))})));
    assert.deepEqual(s.writingTasks,sort(data.writing_tasks.filter(r=>r.sectionId===s.id&&r.status==='PUBLISHED')));
  }
  const qs=data.quiz_questions.filter(q=>q.moduleId===module.id);
  assert.equal(m.quizRevision,revision(module.id,qs));
  assert.deepEqual(m.quizQuestions,qs.map(q=>({id:q.id,question:q.question,options:q.options,questionType:q.questionType,points:q.points})));
  const quiz=await get(`/quizzes/module/${module.id}`);
  assert.equal(quiz.body.meta.quizRevision,m.quizRevision);
  for(const q of quiz.body.data) {assert.equal('correctIndex' in q,false);assert.equal('explanation' in q,false);}
});

test('draft module IDs, preview bypass, invalid input and invalid auth fail safely',async()=>{
  for(const m of data.learning_modules.filter(m=>m.contentStatus!=='PUBLISHED')) {
    assert.equal((await get(`/modules/${m.id}/full`)).status,404);
    assert.equal((await get(`/quizzes/module/${m.id}`)).status,404);
    assert.deepEqual((await get(`/vocabulary?moduleId=${m.id}`)).body.data,[]);
  }
  for(const path of ['/modules?preview=true','modules/7/full?preview=true'].map(p=>p.startsWith('/')?p:'/'+p)) assert.equal((await get(path)).status,403);
  for(const path of ['/modules/nope/full','/modules/0','/modules?levelId=-1','/vocabulary?limit=101','/kanji?page=1.2','/dictionary/search?q=']) assert.equal((await get(path)).status,400);
  const r=await fetch('http://127.0.0.1:8787/api/v1/modules',{headers:{Authorization:'Bearer fake'}});
  assert.equal(r.status,401);
  assert.equal((await get('/announcements/all')).status,401);
});

test('pagination, item detail and Unicode search preserve N5 source data',async()=>{
  for(const [route,table] of [['vocabulary','vocabulary'],['kanji','kanji'],['grammar','grammar_patterns']]) {
    const expected=data[table].filter(r=>publicModules.some(m=>m.id===r.moduleId));
    const ids=[];
    for(let page=1;page<=Math.ceil(expected.length/100);page++) {
      const {status,body}=await get(`/${route}?page=${page}&limit=100`);assert.equal(status,200);assert.equal(body.meta.total,expected.length);ids.push(...body.data.map(r=>r.id));
    }
    assert.deepEqual(ids,expected.map(r=>r.id));
    const detail=(await get(`/${route}/${expected[0].id}`)).body.data;
    for(const [k,v] of Object.entries(expected[0])) assert.deepEqual(detail[k],v);
  }
  const word=data.vocabulary.find(v=>/[^\x00-\x7f]/.test(v.english));
  if(word) assert.ok((await get('/vocabulary?search='+encodeURIComponent(word.english.toUpperCase())+'&limit=100')).body.data.some(v=>v.id===word.id));
  for(const [route,table,field] of [['vocabulary','vocabulary','japanese'],['kanji','kanji','character'],['grammar','grammar_patterns','pattern']]) {
    const sample=data[table].find(r=>publicModules.some(m=>m.id===r.moduleId));
    const q=encodeURIComponent(sample[field]);
    const result=await get(`/${route}?q=${q}&limit=100`);
    assert.equal(result.status,200);assert.ok(result.body.data.some(r=>r.id===sample.id));
    assert.deepEqual(result.body, (await get(`/${route}?search=${q}&limit=100`)).body);
    assert.deepEqual((await get(`/${route}?q=CF5_NONEXISTENT_123`)).body.data,[]);
    assert.equal((await get(`/${route}?q=${'x'.repeat(101)}`)).status,400);
  }
  const attack=await get('/vocabulary?search='+encodeURIComponent("' OR 1=1 --"));assert.equal(attack.status,200);assert.deepEqual(attack.body.data,[]);
  assert.equal((await get('/tests/templates')).status,200);
  assert.equal((await get('/tests/templates/999999')).status,404);
  assert.equal((await get('/dictionary/search?q=test')).status,200);
});

test('Unit 3 search reflects reviewed romaji, meaning and grammar',async()=>{
  for(const [route,query,id] of [['vocabulary',"nan'youbi",300],['vocabulary','how many minutes',286],['grammar','月曜日に',28]]) {
    const {status,body}=await get(`/${route}?moduleId=8&search=${encodeURIComponent(query)}`);
    assert.equal(status,200);assert.ok(body.data.some(row=>row.id===id));
  }
  assert.deepEqual((await get('/vocabulary?moduleId=8&search=naniyoubi')).body.data,[]);
});

test('Unit 4 search reflects reviewed tea meaning and frequency explanation',async()=>{
  for(const [route,query,id] of [['vocabulary','tea (often green tea)',337],['grammar','Vない',35]]) {
    const {status,body}=await get(`/${route}?moduleId=9&search=${encodeURIComponent(query)}`);
    assert.equal(status,200);assert.ok(body.data.some(row=>row.id===id));
  }
});

test('Unit 5 search reflects people, plants and revised existence grammar',async()=>{
  for(const [route,query,id] of [['vocabulary','things and plants',361],['vocabulary','people and animals',362],['grammar','phân loại sinh học',36],['grammar','người hoặc vật',40]]){
    const {status,body}=await get(`/${route}?moduleId=10&search=${encodeURIComponent(query)}`);
    assert.equal(status,200);assert.ok(body.data.some(row=>row.id===id));
  }
  assert.deepEqual((await get('/vocabulary?moduleId=10&search=living%20things')).body.data,[]);
});

test('Unit 6 API preserves corrected Kanji readings and updated search',async()=>{
  for(const [id,on] of [[67,'ニク'],[68,'チャ、サ']]) {
    const {status,body}=await get(`/kanji/${id}`);assert.equal(status,200);
    assert.equal(body.data.kunyomi,'');assert.equal(body.data.onyomi,on);
    assert.ok((await get(`/kanji?moduleId=11&search=${encodeURIComponent(on.split('、')[0])}`)).body.data.some(r=>r.id===id));
  }
  for(const [route,query,id] of [['vocabulary','tea (often green tea)',437],['vocabulary','shall I',446],['grammar','手伝いましょうか',43]]){
    const {status,body}=await get(`/${route}?moduleId=11&search=${encodeURIComponent(query)}`);
    assert.equal(status,200);assert.ok(body.data.some(row=>row.id===id));
  }
});

test('Unit 7 API returns corrected quantities and searchable shopping grammar',async()=>{
  const {status,body}=await get('/vocabulary/462');assert.equal(status,200);
  assert.equal(body.data.exampleJp,'靴下を三足買います。');
  assert.equal(body.data.exampleEn,'I buy three pairs of socks.');
  for(const [query,id] of [['Vたいです',47],['さんぞく',49],['その青いシャツ',50]]){
    const {status,body}=await get('/grammar?moduleId=12&search='+encodeURIComponent(query));
    assert.equal(status,200);assert.ok(body.data.some(row=>row.id===id));
  }
});

test('Unit 8 API exposes revised meanings and searchable invitations, purpose and reasons',async()=>{
  for(const [query,id] of [['day off',497],['keyboard',535]]){
    const {status,body}=await get('/vocabulary?moduleId=13&search='+encodeURIComponent(query));
    assert.equal(status,200);assert.ok(body.data.some(row=>row.id===id));
  }
  assert.equal((await get('/vocabulary/532')).body.data.exampleEn,'I walk every day.');
  for(const [query,id] of [['水が飲みたいです',51],['日曜日はちょっと',52],['しに行きます',53],['食べないんですか',54],['休みだからです',55]]){
    const {status,body}=await get('/grammar?moduleId=13&search='+encodeURIComponent(query));
    assert.equal(status,200);assert.ok(body.data.some(row=>row.id===id));
  }
});

test('Unit 9 API returns reviewed readings, height comparison and searchable past adjectives',async()=>{
  const {status,body}=await get('/kanji/90');assert.equal(status,200);
  assert.equal(body.data.kunyomi,'あめ、あま');assert.equal(body.data.onyomi,'テン');
  assert.equal((await get('/kanji/91')).body.data.kunyomi,'いき');
  assert.equal((await get('/vocabulary/576')).body.data.exampleJp,'私のほうが背が高いです。');
  assert.equal((await get('/vocabulary/577')).body.data.exampleEn,'Today is much colder than yesterday.');
  for(const [route,query,id] of [['kanji','あめ',90],['vocabulary','in comparisons',577],['grammar','よかったです',56],['grammar','きれいでした',57],['grammar','背が高いです',60]]){
    const {status,body}=await get(`/${route}?moduleId=14&search=${encodeURIComponent(query)}`);
    assert.equal(status,200);assert.ok(body.data.some(row=>row.id===id));
  }
});

test('Unit 10 API exposes clarified knowing, verb groups and requests through search',async()=>{
  for(const [route,query,id] of [['vocabulary','find out',600],['grammar','起きます',61],['grammar','くださいませんか',62],['grammar','知りません',63],['grammar','どうぞ',64]]){
    const {status,body}=await get(`/${route}?moduleId=15&search=${encodeURIComponent(query)}`);
    assert.equal(status,200);assert.ok(body.data.some(row=>row.id===id));
  }
  const {status,body}=await get('/vocabulary/600');assert.equal(status,200);
  assert.equal(body.data.exampleJp,'田中さんの住所を知っています。');
});

test('Unit 11 API returns consistent drawing example, radical and searchable grammar',async()=>{
  assert.equal((await get('/kanji/107')).body.data.radical,'巾');
  assert.equal((await get('/vocabulary/654')).body.data.exampleJp,'手紙を書きます。');
  const {status,body}=await get('/modules/16/full');assert.equal(status,200);
  assert.equal(body.data.grammarPatterns.find(g=>g.id===67).examples.find(e=>e.id===123).japanese,'私の趣味は絵を描くことです。');
  assert.equal(body.data.sections.length,0);
  for(const [route,query,id] of [['vocabulary','keyboard',652],['grammar','待つ',66],['grammar','描く',67],['grammar','行きたいです',69],['grammar','だれかと',70]]){
    const {status,body}=await get(`/${route}?moduleId=16&search=${encodeURIComponent(query)}`);
    assert.equal(status,200);assert.ok(body.data.some(row=>row.id===id));
  }
});

test('Unit 12 API exposes revised course review and searchable grammar without draft sections',async()=>{
  const {status,body}=await get('/modules/19/full');assert.equal(status,200);
  assert.match(body.data.description,/not a full-length official JLPT mock exam/);assert.equal(body.data.sections.length,0);
  const q=body.data.quizQuestions.find(q=>q.id===208);assert.equal(q.options[0],'昨日、宿題をしませんでした。');
  assert.match(body.data.quizQuestions.find(q=>q.id===203).question,/dạng ます bỏ ます/);
  for(const [query,id] of [['この本は高いです',71],['食べませんでした',72],['借りてもいいですか',73],['飲みますたい',74],['Aのほうが',75]]){
    const {status,body}=await get(`/grammar?moduleId=19&search=${encodeURIComponent(query)}`);
    assert.equal(status,200);assert.ok(body.data.some(row=>row.id===id));
  }
});
