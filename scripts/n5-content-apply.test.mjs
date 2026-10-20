import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {getPlatformProxy} from 'wrangler';
import {migrate,load} from './learning-fixture.mjs';
import {reviewedPackage,encodeRow,readContentSnapshot,planContentUpdate,applyContentPatches,reverseContentPatches} from './n5-content-package.mjs';
import {searchIndexRows,verifySearchIndex} from './n5-search-index.mjs';
const pkg=await reviewedPackage();
async function fixture(run,data=pkg.source) {
  const proxy=await getPlatformProxy({configPath:fileURLToPath(new URL('../wrangler.local.jsonc',import.meta.url)),persist:false,remoteBindings:false,envFiles:[]});
  try {
    const db=proxy.env.DB;await migrate(db);
    for(const [t,rows] of Object.entries(data))for(let i=0;i<rows.length;i+=40)await db.batch(rows.slice(i,i+40).map(r=>{
      const row=encodeRow(r,pkg.columns[t]);
      return db.prepare(`INSERT INTO "${t}" (${Object.keys(row).join(',')}) VALUES (${Object.keys(row).map(()=>'?').join(',')})`).bind(...Object.values(row));
    }));
    const indexRows=searchIndexRows(data);
    for(let i=0;i<indexRows.length;i+=40)await db.batch(indexRows.slice(i,i+40).map(r=>db.prepare('INSERT INTO content_search(kind,item_id,search_text) VALUES (?,?,?)').bind(r.kind,r.item_id,r.search_text)));
    await db.prepare("INSERT INTO users(id,email,username,password_hash) VALUES (1,'preserve@test.invalid','preserve','test-hash')").run();
    await db.prepare("INSERT INTO user_module_progress(user_id,module_id,status,progress_percent) VALUES (1,6,'IN_PROGRESS',25)").run();
    await run(db);
  } catch(error) {
    if(error.cause)console.error('D1 runtime cause:',error.cause);
    throw error;
  } finally {await proxy.dispose();}
}
test('applies reviewed rows atomically, preserves accounts/progress, replays safely and reverses',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,pkg);
  const protectedRows=async()=>Promise.all(['users','user_module_progress'].map(async t=>(await db.prepare(`SELECT * FROM ${t}`).all()).results));
  const protectedBefore=await protectedRows();
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  assert.equal(patches.length,385);
  await applyContentPatches(db,patches);
  await verifySearchIndex(db,pkg.candidate);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),pkg).length,0);
  assert.equal((await db.prepare('SELECT correct_index FROM quiz_questions WHERE id=42').first()).correct_index,1);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+66);
  assert.deepEqual(await protectedRows(),protectedBefore);
  assert.equal((await db.prepare('SELECT count(*) n FROM mutation_guards').first()).n,0);
  await applyContentPatches(db,[]);
  const reverse=reverseContentPatches(patches);
  await applyContentPatches(db,reverse);
  const restored=await readContentSnapshot(db,pkg);
  for(const p of reverse) {
    const row=restored[p.table].find(r=>r.id===p.id);
    if('version' in row)assert.equal(row.version,p.before.version+1,'Rollback must invalidate old edit versions');
    // Business content is restored; version and modification timestamp must advance.
    if('version' in row)row.version=before[p.table].find(r=>r.id===p.id).version;
    if('updated_at' in row)row.updated_at=before[p.table].find(r=>r.id===p.id).updated_at;
  }
  assert.deepEqual(restored,before);
  await verifySearchIndex(db,pkg.source);
  assert.deepEqual(await protectedRows(),protectedBefore);
  assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results,[]);
}));
test('upgrades the applied quiz release with only 22 exercise/reading edits and preserves quiz revisions',async()=>fixture(async db=>{
  const target={...pkg,candidate:pkg.exerciseCandidate};
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,target);
  assert.equal(patches.length,22);assert.ok(patches.every(p=>p.table!=='quiz_questions'));
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await applyContentPatches(db,patches);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),target).length,0);
  assert.deepEqual(await db.prepare('SELECT version FROM assessment_revision').first(),revision);
  assert.equal((await db.prepare('SELECT version FROM listening_content WHERE id=7').first()).version,3);
  const {Content}=await load('content');
  const preview=new Content(db,'exercise-review-local-only-secret-key',undefined,true);
  const publicApi=new Content(db,'exercise-review-local-only-secret-key');
  const modules=await Promise.all(pkg.candidate.learning_modules.filter(m=>m.contentStatus==='PUBLISHED').map(m=>preview.full(m.id,true)));
  const exercises=modules.flatMap(m=>m.sections.flatMap(s=>s.exercises));
  const expected=new Map([[89,'人'],[102,'おいくつ'],[171,'から'],[176,'曜日'],[177,'何時'],[212,'ぜんぜん'],[233,'間'],[243,'が'],[245,'が'],[281,'飲みましょう'],[282,'どんな'],[284,'辛い'],[322,'そのシャツを見せてください。'],[353,'しませんか'],[413,'呼んで'],[441,'フランス'],[461,'前に'],[485,'払って'],[502,'休みの日に、どこへ行きましたか。']]);
  for(const [id,answer] of expected) {
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer,String(id));
    assert.equal(e.options.filter(o=>o===answer).length,1);
    assert.equal(e.status,'DRAFT');assert.equal(e.version,2);
  }
  const readings=modules.flatMap(m=>m.sections.flatMap(s=>s.readingPassages));
  assert.match(readings.find(r=>r.id===28).reading,/かうつもり/);
  assert.doesNotMatch(readings.find(r=>r.id===28).reading,/かいくつもり/);
  assert.match(readings.find(r=>r.id===29).reading,/りょこうにいきました/);
  const listening=modules.flatMap(m=>m.sections.flatMap(s=>s.listeningContent)).find(r=>r.id===7);
  assert.match(listening.transcriptReading,/Nijuunisai/);assert.equal(listening.audioUrl,'TTS:ja-JP');
  assert.equal((await publicApi.full(6,true)).sections.length,0,'Review must not publish hidden sections');
  const stale=structuredClone(before);stale.lesson_exercises.find(e=>e.id===102).prompt='Admin edited';
  assert.throws(()=>planContentUpdate(stale,pkg),/unexpected content/);
},pkg.previousCandidate));
test('Unit 1 release upgrades 10 rows, retains parent links and never publishes draft content',async()=>fixture(async db=>{
  const target={...pkg,candidate:pkg.unit1Candidate};
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,target);
  assert.equal(patches.length,10);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,4);
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await applyContentPatches(db,patches);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+4);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),target).length,0);
  const {Content}=await load('content');
  const key='unit1-review-local-only-revision-key';
  const preview=await new Content(db,key,undefined,true).full(7,true);
  const publicModule=await new Content(db,key).full(7,true);
  assert.equal(publicModule.sections.length,0);
  assert.equal(publicModule.vocabulary.find(v=>v.id===264).exampleJp,'東京に住んでいます。');
  const readings=preview.sections.flatMap(s=>s.readingPassages);
  assert.match(readings.find(r=>r.id===9).reading,/はたち/);
  assert.match(readings.find(r=>r.id===10).reading,/にじゅうごさい/);
  for(const r of readings)assert.equal(r.version,3);
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[118,'アメリカ'],[119,'エンジニア'],[126,'Giáo viên']]) {
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer);assert.equal(e.status,'DRAFT');
    if(id!==126)assert.equal(e.readingPassageId,10);
  }
  const reverse=reverseContentPatches(patches);
  await applyContentPatches(db,reverse);
  assert.equal((await db.prepare('SELECT example_jp FROM vocabulary WHERE id=264').first()).example_jp,'東京に住みます。');
  assert.equal((await db.prepare('SELECT version FROM reading_passages WHERE id=9').first()).version,4);
},pkg.exerciseCandidate));

test('Unit 2 upgrades 16 rows, restores dialogue and writing requirements, retains publication and supports rollback',async()=>fixture(async db=>{
  const target={...pkg,candidate:pkg.unit2Candidate};
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,target);
  assert.equal(patches.length,16);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,4);
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await applyContentPatches(db,patches);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+4);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),target).length,0);
  const {Content}=await load('content'),secret='unit2-review-test-only-revision-secret';
  const preview=await new Content(db,secret,undefined,true).full(6,true);
  assert.deepEqual(preview.topics,['Family members','People and relationships','Asking about age']);
  assert.equal((await new Content(db,secret).full(6,true)).sections.length,0);
  const conversation=preview.sections.flatMap(s=>s.conversations).find(c=>c.id===7);
  assert.equal(conversation.version,2);
  assert.deepEqual(conversation.lines.map(l=>l.japanese),['この人は誰ですか。','私の父です。']);
  const readings=preview.sections.flatMap(s=>s.readingPassages);
  assert.match(readings.find(r=>r.id===7).reading,/ちちはかいしゃいんです。はははせんせいです。いもうとは/);
  for(const w of preview.sections.flatMap(s=>s.writingTasks)) {
    const expected=w.id===7?[3,4]:[2,3];
    assert.deepEqual([w.minLength,w.maxLength],expected);
    assert.match(w.instructions,/câu, không phải số ký tự/);
    const sentences=w.sampleAnswer.split('。').filter(Boolean).length;
    assert.ok(sentences>=w.minLength&&sentences<=w.maxLength);
  }
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[90,'はたち'],[91,'何歳'],[99,'の'],[106,'だれ']]) {
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer);
  }
  assert.match(exercises.find(e=>e.id===90).explanation,/にじゅっさい cũng là cách nói đúng/);
  assert.match(preview.quizQuestions.find(q=>q.id===45).question,/マイクさんのお兄さんは先生です/);
  const reverse=reverseContentPatches(patches);await applyContentPatches(db,reverse);
  const restored=await readContentSnapshot(db,pkg);
  for(const p of reverse) {
    const row=restored[p.table].find(r=>r.id===p.id),original=before[p.table].find(r=>r.id===p.id);
    if('version' in row){assert.equal(row.version,p.before.version+1);row.version=original.version;}
    if('updated_at' in row)row.updated_at=original.updated_at;
  }
  assert.deepEqual(restored,before);
},pkg.unit1Candidate));

test('Unit 2 guards prevent lost dialogue edits and publication changes',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,pkg);
  const module=patches.find(p=>p.table==='learning_modules');
  await assert.rejects(applyContentPatches(db,[{...module,after:{...module.after,content_status:'DRAFT'}}]),/Unsupported editorial field|publication/);
  await db.prepare("UPDATE conversation_lines SET japanese='編集済み' WHERE id=29").run();
  const changed=await readContentSnapshot(db,pkg);
  assert.throws(()=>planContentUpdate(changed,pkg),/unexpected content/);
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),changed);
},pkg.unit1Candidate));
test('preflight refuses editorial drift and batch rejects a concurrent version change',async()=>fixture(async db=>{
  const original=await readContentSnapshot(db,pkg),patches=planContentUpdate(original,pkg);
  await db.prepare('UPDATE reading_passages SET version=version+1 WHERE id=9').run();
  const changed=await readContentSnapshot(db,pkg);
  assert.throws(()=>planContentUpdate(changed,pkg),/unexpected content/);
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),changed,'Other writes must roll back when a row changes');
  assert.equal((await db.prepare('SELECT count(*) n FROM mutation_guards').first()).n,0);
}));
test('failure late in the batch rolls back content and quiz revisions',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,pkg);
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await db.exec("CREATE TRIGGER fail_review BEFORE UPDATE ON quiz_questions WHEN NEW.id=206 BEGIN SELECT RAISE(ABORT,'injected review failure'); END;");
  await assert.rejects(applyContentPatches(db,patches),/injected review failure/);
  assert.deepEqual(await readContentSnapshot(db,pkg),before);
  assert.deepEqual(await db.prepare('SELECT version FROM assessment_revision').first(),revision);
  await verifySearchIndex(db,pkg.source);
  assert.equal((await db.prepare('SELECT count(*) n FROM mutation_guards').first()).n,0);
}));

test('Unit 3 upgrades 19 rows and three search entries together, then restores both on rollback',async()=>fixture(async db=>{
  const target={...pkg,candidate:pkg.unit3Candidate};
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,target);
  assert.equal(patches.length,19);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,4);
  const oldSearch=await verifySearchIndex(db,before);
  await applyContentPatches(db,patches);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),target).length,0);
  const newSearch=await verifySearchIndex(db,pkg.unit3Candidate);
  assert.equal(newSearch.filter((r,i)=>r.search_text!==oldSearch[i].search_text).length,3);
  assert.equal(newSearch.find(r=>r.kind==='vocabulary'&&r.item_id===300).search_text,"何曜日\u001fなんようび\u001fnan'youbi\u001fwhat day of the week");
  const {Content}=await load('content'),key='unit3-review-test-only-revision-secret';
  const api=new Content(db,key),preview=await new Content(db,key,undefined,true).full(8,true);
  assert.equal(preview.title,'Numbers, Days and Time');
  assert.equal((await api.full(8,true)).sections.length,0);
  assert.ok((await api.items('vocabulary',new URLSearchParams({moduleId:'8',search:"nan'youbi"}))).data.some(r=>r.id===300));
  assert.equal((await api.items('vocabulary',new URLSearchParams({moduleId:'8',search:'naniyoubi'}))).data.length,0);
  assert.ok((await api.items('vocabulary',new URLSearchParams({moduleId:'8',search:'how many minutes'}))).data.some(r=>r.id===286));
  assert.ok((await api.items('grammar',new URLSearchParams({moduleId:'8',search:'月曜日に'}))).data.some(r=>r.id===28));
  const conversation=preview.sections.flatMap(s=>s.conversations).find(c=>c.id===12);
  assert.equal(conversation.title,'Bank business hours');assert.equal(conversation.version,2);
  assert.equal(conversation.lines.find(l=>l.id===56).romaji,"Yasumi wa nan'youbi desu ka.");
  assert.ok(conversation.lines.filter(l=>[55,57].includes(l.id)).every(l=>l.speaker==='銀行員'));
  for(const w of preview.sections.flatMap(s=>s.writingTasks)) {
    const count=w.sampleAnswer.split('。').filter(Boolean).length;
    assert.ok(count>=w.minLength&&count<=w.maxLength);assert.match(w.instructions,/câu, không phải ký tự/);
    if(w.id===11){assert.equal(w.maxLength,3);assert.match(w.sampleAnswer,/午前９時から午後５時/);}
  }
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[161,'今'],[172,'と'],[173,'に'],[178,'何時に始まりますか。']]) {
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer);
  }
  await applyContentPatches(db,reverseContentPatches(patches));
  await verifySearchIndex(db,pkg.unit2Candidate);
  assert.deepEqual(await db.prepare('SELECT * FROM vocabulary WHERE id=300').first(),before.vocabulary.find(v=>v.id===300));
  assert.deepEqual(await db.prepare('SELECT * FROM grammar_patterns WHERE id=28').first(),before.grammar_patterns.find(g=>g.id===28));
},pkg.unit2Candidate));

test('search drift or missing entry rejects the whole Unit 3 batch without content or revision changes',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,pkg);
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  for(const query of ["UPDATE content_search SET search_text='editor change' WHERE kind='grammar' AND item_id=28","DELETE FROM content_search WHERE kind='grammar' AND item_id=28"]) {
    await db.exec(query);
    await assert.rejects(verifySearchIndex(db,before),/Search index differs/);
    await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
    assert.deepEqual(await readContentSnapshot(db,pkg),before);
    assert.deepEqual(await db.prepare('SELECT version FROM assessment_revision').first(),revision);
    assert.equal((await db.prepare("SELECT search_text FROM content_search WHERE kind='vocabulary' AND item_id=300").first()).search_text,'何曜日\u001fなんようび\u001fnaniyoubi\u001fwhat day of the week');
    assert.equal((await db.prepare('SELECT count(*) n FROM mutation_guards').first()).n,0);
  }
},pkg.unit2Candidate));

test('Unit 4 upgrades 21 rows, preserves listening links and restores content and search on rollback',async()=>fixture(async db=>{
  const target={...pkg,candidate:pkg.unit4Candidate};
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,target);
  assert.equal(patches.length,21);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,4);
  const oldSearch=await verifySearchIndex(db,before);
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await applyContentPatches(db,patches);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+4);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),target).length,0);
  const newSearch=await verifySearchIndex(db,pkg.unit4Candidate);
  assert.equal(newSearch.filter((r,i)=>r.search_text!==oldSearch[i].search_text).length,2);
  const {Content}=await load('content'),key='unit4-review-test-only-revision-secret';
  const api=new Content(db,key),preview=await new Content(db,key,undefined,true).full(9,true);
  assert.equal((await api.full(9,true)).sections.length,0);
  assert.deepEqual(preview.topics,['Daily activities','Meals and drinks','Places and frequency']);
  assert.equal(preview.vocabulary.find(v=>v.id===337).english,'tea (often green tea)');
  assert.ok((await api.items('grammar',new URLSearchParams({moduleId:'9',search:'Vない'}))).data.some(r=>r.id===35));
  const conversation=preview.sections.flatMap(s=>s.conversations).find(c=>c.id===13);
  assert.equal(conversation.version,2);assert.match(conversation.lines.find(l=>l.id===60).translation,/Would you like to go together/);
  const listening=preview.sections.flatMap(s=>s.listeningContent);
  assert.equal(listening.find(l=>l.id===13).title,'Plans for this afternoon');
  for(const l of listening){assert.equal(l.audioUrl,'TTS:ja-JP');assert.equal(l.version,3);assert.equal(l.transcript,pkg.unit3Candidate.listening_content.find(r=>r.id===l.id).transcript);}
  for(const w of preview.sections.flatMap(s=>s.writingTasks)){
    assert.deepEqual([w.minLength,w.maxLength],[2,3]);assert.match(w.instructions,/câu, không phải ký tự/);
    const count=w.sampleAnswer.split('。').filter(Boolean).length;assert.ok(count>=2&&count<=3);
  }
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[197,'撮ります'],[207,'を'],[209,'飲みません'],[210,'を'],[211,'本を読みます。'],[215,'Chụp ảnh'],[220,'Sai']]) {
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer);
  }
  const e215=exercises.find(e=>e.id===215);assert.match(e215.prompt,/Người B/);assert.equal(e215.listeningId,13);
  assert.match(exercises.find(e=>e.id===220).explanation,/không nói chỉ chơi/);
  const quiz=preview.quizQuestions.find(q=>q.id===87);assert.equal(quiz.options[quiz.correctIndex],'Đồng ý và thấy lời rủ là ý hay.');
  const reverse=reverseContentPatches(patches);await applyContentPatches(db,reverse);
  await verifySearchIndex(db,pkg.unit3Candidate);
  const restored=await readContentSnapshot(db,pkg);
  for(const p of reverse){const row=restored[p.table].find(r=>r.id===p.id),original=before[p.table].find(r=>r.id===p.id);
    if('version' in row){assert.equal(row.version,p.before.version+1);row.version=original.version;}
    if('updated_at' in row)row.updated_at=original.updated_at;
  }
  assert.deepEqual(restored,before);
},pkg.unit3Candidate));

test('Unit 5 upgrades 19 rows with clear location answers, preserves draft context and rolls back',async()=>fixture(async db=>{
  const target={...pkg,candidate:pkg.unit5Candidate};
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,target);
  assert.equal(patches.length,19);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,4);
  const oldSearch=await verifySearchIndex(db,before),revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await applyContentPatches(db,patches);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+4);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),target).length,0);
  const newSearch=await verifySearchIndex(db,pkg.unit5Candidate);
  assert.equal(newSearch.filter((r,i)=>r.search_text!==oldSearch[i].search_text).length,4);
  const {Content}=await load('content'),key='unit5-review-test-only-revision-secret';
  const api=new Content(db,key),preview=await new Content(db,key,undefined,true).full(10,true);
  assert.equal((await api.full(10,true)).sections.length,0);
  assert.deepEqual(preview.topics,['Places and positions','Existence of people and things','Describing rooms']);
  assert.equal(preview.vocabulary.find(v=>v.id===361).english,'to be; to exist (things and plants)');
  assert.equal(preview.vocabulary.find(v=>v.id===362).english,'to be; to exist (people and animals)');
  assert.equal(preview.vocabulary.find(v=>v.id===367).exampleEn,'I turn right.');
  assert.ok((await api.items('grammar',new URLSearchParams({moduleId:'10',search:'phân loại sinh học'}))).data.some(r=>r.id===36));
  for(const w of preview.sections.flatMap(s=>s.writingTasks)){
    const bounds=w.id===15?[2,3]:[1,2];assert.deepEqual([w.minLength,w.maxLength],bounds);
    assert.match(w.instructions,/câu, không phải ký tự/);
    const count=w.sampleAnswer.split('。').filter(Boolean).length;assert.ok(count>=bounds[0]&&count<=bounds[1]);
  }
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[238,'なか'],[241,'そと'],[242,'まえ'],[246,'中'],[248,'や'],[252,'Dưới xe ô tô'],[256,'Sai']]){
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer);
  }
  assert.equal(exercises.find(e=>e.id===252).listeningId,15);
  assert.equal(exercises.find(e=>e.id===256).readingPassageId,16);
  assert.ok(!exercises.find(e=>e.id===248).options.includes('と'));
  assert.match(exercises.find(e=>e.id===256).explanation,/ghế băng/);
  // Reading/listening/dialogue text has no editorial changes in this release.
  const after=await readContentSnapshot(db,pkg);
  for(const table of ['kanji','grammar_examples','reading_passages','listening_content','conversations','conversation_lines'])assert.deepEqual(after[table],before[table]);
  const reverse=reverseContentPatches(patches);await applyContentPatches(db,reverse);await verifySearchIndex(db,pkg.unit4Candidate);
  const restored=await readContentSnapshot(db,pkg);
  for(const p of reverse){const row=restored[p.table].find(r=>r.id===p.id),original=before[p.table].find(r=>r.id===p.id);
    if('version' in row){assert.equal(row.version,p.before.version+1);row.version=original.version;}
    if('updated_at' in row)row.updated_at=original.updated_at;
  }
  assert.deepEqual(restored,before);
},pkg.unit4Candidate));

test('Unit 6 upgrades 24 rows, fixes On/Kun classification and restores content and search',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit6Candidate});
  assert.equal(patches.length,24);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,4);
  const oldSearch=await verifySearchIndex(db,before),revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await applyContentPatches(db,patches);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+4);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),{...pkg,candidate:pkg.unit6Candidate}).length,0);
  const newSearch=await verifySearchIndex(db,pkg.unit6Candidate);
  assert.equal(newSearch.filter((r,i)=>r.search_text!==oldSearch[i].search_text).length,6);
  const {Content}=await load('content'),key='unit6-review-test-only-revision-secret';
  const api=new Content(db,key),preview=await new Content(db,key,undefined,true).full(11,true);
  assert.equal((await api.full(11,true)).sections.length,0);
  assert.deepEqual(preview.topics,['Food and drink','Tastes and preferences','Ordering and invitations']);
  for(const [id,on] of [[67,'ニク'],[68,'チャ、サ']]){
    const k=preview.kanji.find(r=>r.id===id);assert.equal(k.kunyomi,'');assert.equal(k.onyomi,on);
    assert.ok((await api.items('kanji',new URLSearchParams({moduleId:'11',q:on.split('、')[0]}))).data.some(r=>r.id===id));
  }
  assert.equal(newSearch.find(r=>r.kind==='kanji'&&r.item_id===67).search_text,'肉\u001fmeat\u001fニク\u001f');
  assert.equal(newSearch.find(r=>r.kind==='kanji'&&r.item_id===68).search_text,'茶\u001ftea\u001fチャ、サ\u001f');
  assert.equal(preview.kanji.find(r=>r.id===68).exampleWords[0].en,'tea');
  assert.match(preview.vocabulary.find(r=>r.id===440).exampleEn,/gratitude/);
  assert.ok((await api.items('grammar',new URLSearchParams({moduleId:'11',search:'手伝いましょうか'}))).data.some(r=>r.id===43));
  const listening=preview.sections.flatMap(s=>s.listeningContent);
  for(const l of listening){assert.equal(l.audioUrl,'TTS:ja-JP');assert.equal(l.version,3);assert.equal(l.transcript,pkg.unit5Candidate.listening_content.find(r=>r.id===l.id).transcript);assert.doesNotMatch(l.instructions,/couple|man\b/);}
  assert.match(listening.find(l=>l.id===17).transcriptTranslation,/Which would you prefer/);
  for(const w of preview.sections.flatMap(s=>s.writingTasks)){
    const bounds=w.id===17?[2,3]:[1,2];assert.deepEqual([w.minLength,w.maxLength],bounds);
    assert.match(w.instructions,/câu, không phải ký tự/);
    const count=w.sampleAnswer.split('。').filter(Boolean).length;assert.ok(count>=bounds[0]&&count<=bounds[1]);
  }
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[269,'お会計'],[274,'さかな'],[279,'を'],[280,'が'],[283,'水をください。'],[289,'Sai']]){
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer);
  }
  const e=exercises.find(e=>e.id===289);assert.equal(e.listeningId,18);assert.doesNotMatch(e.prompt,/đàn ông/);
  const after=await readContentSnapshot(db,pkg);
  for(const table of ['grammar_examples','reading_passages','conversations','conversation_lines'])assert.deepEqual(after[table],before[table]);
  const reverse=reverseContentPatches(patches);await applyContentPatches(db,reverse);await verifySearchIndex(db,pkg.unit5Candidate);
  const restored=await readContentSnapshot(db,pkg);
  for(const p of reverse){const row=restored[p.table].find(r=>r.id===p.id),original=before[p.table].find(r=>r.id===p.id);
    if('version' in row){assert.equal(row.version,p.before.version+1);row.version=original.version;}
    if('updated_at' in row)row.updated_at=original.updated_at;
  }
  assert.deepEqual(restored,before);
},pkg.unit5Candidate));

test('Unit 6 kanji edits reject identity changes and concurrent content or index drift',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit6Candidate}),p=patches.find(p=>p.table==='kanji');
  await assert.rejects(applyContentPatches(db,[{...p,after:{...p.after,character:'別'}}]),/Unsupported editorial field/);
  await assert.rejects(applyContentPatches(db,[{...p,after:{...p.after,module_id:999}}]),/Unsupported editorial field|publication/);
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await db.prepare("UPDATE kanji SET mnemonic='editor change' WHERE id=67").run();
  const changed=await readContentSnapshot(db,pkg);
  assert.throws(()=>planContentUpdate(changed,{...pkg,candidate:pkg.unit6Candidate}),/unexpected content/);
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),changed);await verifySearchIndex(db,pkg.unit5Candidate);
  await db.prepare('UPDATE kanji SET mnemonic=? WHERE id=67').bind(before.kanji.find(k=>k.id===67).mnemonic).run();
  await db.exec("DELETE FROM content_search WHERE kind='kanji' AND item_id=68");
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),before);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version);
  assert.equal((await db.prepare('SELECT count(*) n FROM mutation_guards').first()).n,0);
},pkg.unit5Candidate));

test('Unit 7 upgrades 18 rows, preserves context and restores content and search',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit7Candidate});
  assert.equal(patches.length,18);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,3);
  const oldSearch=await verifySearchIndex(db,before),revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await applyContentPatches(db,patches);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+3);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),{...pkg,candidate:pkg.unit7Candidate}).length,0);
  const newSearch=await verifySearchIndex(db,pkg.unit7Candidate);
  assert.equal(newSearch.filter((r,i)=>r.search_text!==oldSearch[i].search_text).length,3);
  const {Content}=await load('content'),key='unit7-review-test-only-revision-secret';
  const api=new Content(db,key),preview=await new Content(db,key,undefined,true).full(12,true);
  assert.equal((await api.full(12,true)).sections.length,0);
  assert.deepEqual(preview.topics,['Shopping and prices','Colors and descriptions','Counting items and expressing wants']);
  const socks=preview.vocabulary.find(r=>r.id===462);
  assert.equal(socks.exampleJp,'靴下を三足買います。');assert.equal(socks.exampleEn,'I buy three pairs of socks.');
  for(const [id,q] of [[47,'Vたいです'],[49,'さんぞく'],[50,'その青いシャツ']]){
    assert.ok((await api.items('grammar',new URLSearchParams({moduleId:'12',search:q}))).data.some(r=>r.id===id));
  }
  const listening=preview.sections.flatMap(s=>s.listeningContent);
  for(const l of listening){assert.equal(l.audioUrl,'TTS:ja-JP');assert.equal(l.version,3);assert.equal(l.transcript,pkg.unit6Candidate.listening_content.find(r=>r.id===l.id).transcript);}
  assert.doesNotMatch(listening.find(l=>l.id===20).instructions,/\bman\b/);
  assert.match(listening.find(l=>l.id===19).transcriptTranslation,/one of these black hats and two white shirts/);
  for(const w of preview.sections.flatMap(s=>s.writingTasks)){
    const bounds=w.id===19?[1,2]:[2,3];assert.deepEqual([w.minLength,w.maxLength],bounds);
    assert.match(w.instructions,/câu, không phải ký tự/);
    const count=w.sampleAnswer.split('。').filter(Boolean).length;assert.ok(count>=bounds[0]&&count<=bounds[1]);
  }
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[305,'服'],[310,'ひゃく'],[315,'が'],[318,'いくら'],[319,'赤いカバンを買います。'],[320,'二枚'],[297,'二千円'],[298,'一階'],[323,'1 mũ đen, 2 áo trắng'],[324,'5000 yên'],[325,'Sai'],[328,'Sai']]){
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer,String(id));
  }
  // Different stores: the guide has shoes on floor 1; the audio says floor 2.
  assert.equal(exercises.find(e=>e.id===298).readingPassageId,20);
  assert.equal(exercises.find(e=>e.id===325).listeningId,20);
  const after=await readContentSnapshot(db,pkg);
  for(const table of ['kanji','grammar_examples','reading_passages','conversations','conversation_lines'])assert.deepEqual(after[table],before[table]);
  for(const p of patches)assert.equal(p.table==='learning_modules'?p.id:p.after.module_id??before.lesson_sections.find(s=>s.id===p.after.section_id)?.module_id,12);
  const reverse=reverseContentPatches(patches);await applyContentPatches(db,reverse);await verifySearchIndex(db,pkg.unit6Candidate);
  const restored=await readContentSnapshot(db,pkg);
  for(const p of reverse){const row=restored[p.table].find(r=>r.id===p.id),original=before[p.table].find(r=>r.id===p.id);
    if('version' in row){assert.equal(row.version,p.before.version+1);row.version=original.version;}
    if('updated_at' in row)row.updated_at=original.updated_at;
  }
  assert.deepEqual(restored,before);
},pkg.unit6Candidate));

test('Unit 7 refuses concurrent changes or missing search entries without partial writes',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit7Candidate});
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await db.prepare("UPDATE vocabulary SET example_jp='editor change' WHERE id=462").run();
  const changed=await readContentSnapshot(db,pkg);
  assert.throws(()=>planContentUpdate(changed,{...pkg,candidate:pkg.unit7Candidate}),/unexpected content/);
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),changed);await verifySearchIndex(db,pkg.unit6Candidate);
  await db.prepare('UPDATE vocabulary SET example_jp=? WHERE id=462').bind(before.vocabulary.find(v=>v.id===462).example_jp).run();
  await db.exec("DELETE FROM content_search WHERE kind='grammar' AND item_id=49");
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),before);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version);
  assert.equal((await db.prepare('SELECT count(*) n FROM mutation_guards').first()).n,0);
},pkg.unit6Candidate));

test('Unit 8 upgrades 26 rows, preserves transcripts and grades contextual answers before rollback',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit8Candidate});
  assert.equal(patches.length,26);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,3);
  const oldSearch=await verifySearchIndex(db,before),revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await applyContentPatches(db,patches);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+3);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),{...pkg,candidate:pkg.unit8Candidate}).length,0);
  const newSearch=await verifySearchIndex(db,pkg.unit8Candidate);
  assert.equal(newSearch.filter((r,i)=>r.search_text!==oldSearch[i].search_text).length,7);
  const {Content}=await load('content'),key='unit8-review-test-only-revision-secret';
  const api=new Content(db,key),preview=await new Content(db,key,undefined,true).full(13,true);
  assert.equal((await api.full(13,true)).sections.length,0);
  assert.deepEqual(preview.topics,['Weekend plans','Invitations and wishes','Purpose of travel and reasons']);
  assert.equal(preview.vocabulary.find(r=>r.id===496).exampleEn,'I have the weekend off.');
  assert.equal(preview.vocabulary.find(r=>r.id===497).exampleEn,'I have a day off tomorrow.');
  assert.equal(preview.vocabulary.find(r=>r.id===532).exampleEn,'I walk every day.');
  assert.match(preview.vocabulary.find(r=>r.id===535).english,/keyboard/);
  for(const [id,q] of [[51,'水が飲みたいです'],[52,'日曜日はちょっと'],[53,'しに行きます'],[54,'食べないんですか'],[55,'休みだからです']]){
    assert.ok((await api.items('grammar',new URLSearchParams({moduleId:'13',search:q}))).data.some(r=>r.id===id));
  }
  const listening=preview.sections.flatMap(s=>s.listeningContent);
  for(const l of listening){assert.equal(l.audioUrl,'TTS:ja-JP');assert.equal(l.version,l.id===21?3:2);assert.equal(l.transcript,pkg.unit7Candidate.listening_content.find(r=>r.id===l.id).transcript);}
  assert.doesNotMatch(listening.find(l=>l.id===21).instructions,/\bman\b/);
  const readings=preview.sections.flatMap(s=>s.readingPassages);
  assert.equal(readings.find(r=>r.id===21).version,2);
  assert.match(readings.find(r=>r.id===21).translation,/^I have a day off tomorrow\./);
  for(const r of readings)for(const field of ['content','reading'])assert.equal(r[field],pkg.unit7Candidate.reading_passages.find(x=>x.id===r.id)[field]);
  for(const w of preview.sections.flatMap(s=>s.writingTasks)){
    const length=w.id===21?2:1;assert.deepEqual([w.minLength,w.maxLength],[length,length]);assert.equal(w.version,2);
    assert.match(w.instructions,/câu, không phải ký tự/);
    assert.equal(w.sampleAnswer.split('。').filter(Boolean).length,length);
  }
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[342,'から'],[345,'Sự nghỉ ngơi / Ngày nghỉ'],[349,'やま'],[350,'Tuần này'],[354,'痛い'],[358,'どうして食べないんですか。'],[359,'Chơi tennis'],[360,'Xe ô tô'],[361,'Sai'],[331,'図書館へ本を借りに行きます'],[335,'泳いで、魚を食べたいです'],[336,'用事があるからです'],[364,'Sai']]){
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer,String(id));
  }
  assert.match(exercises.find(e=>e.id===354).prompt,/今日/);
  for(const id of [359,360]){assert.equal(exercises.find(e=>e.id===id).listeningId,21);assert.doesNotMatch(exercises.find(e=>e.id===id).prompt,/đàn ông/);}
  const e=exercises.find(e=>e.id===361);assert.equal(e.listeningId,22);assert.match(e.prompt,/B nói câu.*借りたいです/);
  assert.match(listening.find(l=>l.id===22).transcript,/B:.*私も本を読みたいです/);
  assert.doesNotMatch(listening.find(l=>l.id===22).transcript,/B:.*借りたいです/);
  assert.equal(exercises.find(e=>e.id===364).readingPassageId,22);
  const after=await readContentSnapshot(db,pkg);
  for(const table of ['kanji','grammar_examples','conversations','conversation_lines'])assert.deepEqual(after[table],before[table]);
  for(const p of patches)assert.equal(p.table==='learning_modules'?p.id:p.after.module_id??before.lesson_sections.find(s=>s.id===p.after.section_id)?.module_id,13);
  const reverse=reverseContentPatches(patches);await applyContentPatches(db,reverse);await verifySearchIndex(db,pkg.unit7Candidate);
  const restored=await readContentSnapshot(db,pkg);
  for(const p of reverse){const row=restored[p.table].find(r=>r.id===p.id),original=before[p.table].find(r=>r.id===p.id);
    if('version' in row){assert.equal(row.version,p.before.version+1);row.version=original.version;}
    if('updated_at' in row)row.updated_at=original.updated_at;
  }
  assert.deepEqual(restored,before);
},pkg.unit7Candidate));

test('Unit 8 refuses changed writing bounds or missing grammar search without partial writes',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit8Candidate});
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await db.prepare('UPDATE writing_tasks SET max_length=4 WHERE id=21').run();
  const changed=await readContentSnapshot(db,pkg);
  assert.throws(()=>planContentUpdate(changed,{...pkg,candidate:pkg.unit8Candidate}),/unexpected content/);
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),changed);await verifySearchIndex(db,pkg.unit7Candidate);
  await db.prepare('UPDATE writing_tasks SET max_length=? WHERE id=21').bind(before.writing_tasks.find(w=>w.id===21).max_length).run();
  await db.exec("DELETE FROM content_search WHERE kind='grammar' AND item_id=55");
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),before);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version);
  assert.equal((await db.prepare('SELECT count(*) n FROM mutation_guards').first()).n,0);
},pkg.unit7Candidate));

test('Unit 9 upgrades 23 rows, preserves source context and restores content/search on rollback',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit9Candidate});
  assert.equal(patches.length,23);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,5);
  const oldSearch=await verifySearchIndex(db,before),revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await applyContentPatches(db,patches);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+5);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),{...pkg,candidate:pkg.unit9Candidate}).length,0);
  const newSearch=await verifySearchIndex(db,pkg.unit9Candidate);
  assert.equal(newSearch.filter((r,i)=>r.search_text!==oldSearch[i].search_text).length,5);
  const {Content}=await load('content'),key='unit9-review-test-only-revision-secret';
  const api=new Content(db,key),preview=await new Content(db,key,undefined,true).full(14,true);
  assert.equal((await api.full(14,true)).sections.length,0);
  assert.deepEqual(preview.topics,['Weather and seasons','Past adjectives and nouns','Comparisons and preferences']);
  assert.equal(preview.vocabulary.find(r=>r.id===576).exampleJp,'私のほうが背が高いです。');
  assert.equal(preview.vocabulary.find(r=>r.id===577).exampleEn,'Today is much colder than yesterday.');
  const sky=await db.prepare('SELECT * FROM kanji WHERE id=90').first();
  assert.equal(sky.kunyomi,'あめ、あま');assert.equal(sky.onyomi,'テン');
  const spirit=await db.prepare('SELECT * FROM kanji WHERE id=91').first();
  assert.equal(spirit.kunyomi,'いき');assert.match(spirit.mnemonic,/ngoài bảng âm đọc thường dụng/);
  for(const [route,id,q] of [['kanji',90,'あめ'],['vocabulary',577,'in comparisons'],['grammar',56,'よかったです'],['grammar',57,'きれいでした'],['grammar',60,'背が高いです']]){
    assert.ok((await api.items(route,new URLSearchParams({moduleId:'14',search:q}))).data.some(r=>r.id===id));
  }
  const listening=preview.sections.flatMap(s=>s.listeningContent);
  for(const l of listening){assert.equal(l.audioUrl,'TTS:ja-JP');assert.equal(l.version,l.id===23?3:2);assert.equal(l.transcript,pkg.unit8Candidate.listening_content.find(r=>r.id===l.id).transcript);}
  assert.doesNotMatch(listening.find(l=>l.id===23).instructions,/\bman\b/);
  for(const w of preview.sections.flatMap(s=>s.writingTasks)){
    const length=w.id===23?2:1;assert.deepEqual([w.minLength,w.maxLength],[length,length]);assert.equal(w.version,2);
    assert.match(w.instructions,/câu, không phải ký tự/);assert.equal(w.sampleAnswer.split('。').filter(Boolean).length,length);
  }
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[380,'賑やか'],[383,'ゆき'],[389,'難しくないです'],[392,'のほう'],[393,'一番'],[396,'Ở nhà đọc sách, nghe nhạc'],[397,'Sai']]){
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer,String(id));
  }
  assert.match(exercises.find(e=>e.id===389).prompt,/hiện tại lịch sự/);
  assert.match(exercises.find(e=>e.id===392).prompt,/肉と魚/);
  assert.equal(exercises.find(e=>e.id===396).listeningId,23);
  const preference=exercises.find(e=>e.id===397);assert.equal(preference.listeningId,24);assert.match(preference.prompt,/B nói/);
  assert.match(listening.find(l=>l.id===24).transcript,/B:.*京都のほうが好きです/);
  const after=await readContentSnapshot(db,pkg);
  for(const table of ['grammar_examples','reading_passages','conversations','conversation_lines'])assert.deepEqual(after[table],before[table]);
  for(const p of patches)assert.equal(p.table==='learning_modules'?p.id:p.after.module_id??before.lesson_sections.find(s=>s.id===p.after.section_id)?.module_id,14);
  const reverse=reverseContentPatches(patches);await applyContentPatches(db,reverse);await verifySearchIndex(db,pkg.unit8Candidate);
  const restored=await readContentSnapshot(db,pkg);
  for(const p of reverse){const row=restored[p.table].find(r=>r.id===p.id),original=before[p.table].find(r=>r.id===p.id);
    if('version' in row){assert.equal(row.version,p.before.version+1);row.version=original.version;}
    if('updated_at' in row)row.updated_at=original.updated_at;
  }
  assert.deepEqual(restored,before);
},pkg.unit8Candidate));

test('Unit 9 refuses concurrent writing edits or missing Kanji search without partial writes',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit9Candidate});
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await db.prepare('UPDATE writing_tasks SET max_length=4 WHERE id=23').run();
  const changed=await readContentSnapshot(db,pkg);
  assert.throws(()=>planContentUpdate(changed,{...pkg,candidate:pkg.unit9Candidate}),/unexpected content/);
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),changed);await verifySearchIndex(db,pkg.unit8Candidate);
  await db.prepare('UPDATE writing_tasks SET max_length=? WHERE id=23').bind(before.writing_tasks.find(w=>w.id===23).max_length).run();
  await db.exec("DELETE FROM content_search WHERE kind='kanji' AND item_id=90");
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),before);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version);
  assert.equal((await db.prepare('SELECT count(*) n FROM mutation_guards').first()).n,0);
},pkg.unit8Candidate));

test('Unit 10 upgrades 25 rows, fixes kana and permission context, preserves draft state and rolls back',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit10Candidate});
  assert.equal(patches.length,25);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,5);
  const oldSearch=await verifySearchIndex(db,before),revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await applyContentPatches(db,patches);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+5);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),{...pkg,candidate:pkg.unit10Candidate}).length,0);
  const newSearch=await verifySearchIndex(db,pkg.unit10Candidate);
  assert.equal(newSearch.filter((r,i)=>r.search_text!==oldSearch[i].search_text).length,5);
  const {Content}=await load('content'),key='unit10-review-test-only-revision-secret';
  const api=new Content(db,key),preview=await new Content(db,key,undefined,true).full(15,true);
  assert.equal((await api.full(15,true)).sections.length,0);
  assert.deepEqual(preview.topics,['Te-form of verbs','Requests, permission and rules','Ongoing actions and states']);
  for(const [route,id,q] of [['vocabulary',600,'find out'],['grammar',61,'起きます'],['grammar',62,'くださいませんか'],['grammar',63,'知りません']]){
    assert.ok((await api.items(route,new URLSearchParams({moduleId:'15',search:q}))).data.some(r=>r.id===id));
  }
  assert.ok((await api.items('grammar',new URLSearchParams({moduleId:'15',search:'どうぞ'}))).data.some(r=>r.id===64));
  const conversation=preview.sections.flatMap(s=>s.conversations).find(c=>c.id===25);
  assert.equal(conversation.version,2);assert.match(conversation.context,/vì trời nóng/);
  const line=conversation.lines.find(l=>l.id===112);
  assert.equal(line.hiragana,'あ、やまださん、まどをあけてください。あついですから。');
  assert.match(line.japanese,/暑いですから。$/);assert.match(line.romaji,/Atsui desu kara\.$/);
  const listening=preview.sections.flatMap(s=>s.listeningContent);
  for(const l of listening){assert.equal(l.audioUrl,'TTS:ja-JP');assert.equal(l.version,l.id===25?3:2);for(const f of ['transcript','transcriptReading','transcriptTranslation'])assert.equal(l[f],pkg.unit9Candidate.listening_content.find(r=>r.id===l.id)[f]);}
  assert.doesNotMatch(listening.find(l=>l.id===25).instructions,/\bman\b/);
  const readings=preview.sections.flatMap(s=>s.readingPassages);
  assert.match(readings.find(r=>r.id===26).translation,/Every day,/);
  assert.equal(readings.find(r=>r.id===26).version,2);
  for(const r of readings)for(const f of ['content','reading'])assert.equal(r[f],pkg.unit9Candidate.reading_passages.find(x=>x.id===r.id)[f]);
  for(const w of preview.sections.flatMap(s=>s.writingTasks)){
    assert.deepEqual([w.minLength,w.maxLength],[1,1]);assert.equal(w.version,2);
    assert.match(w.instructions,/câu, không phải ký tự/);assert.equal(w.sampleAnswer.split('。').filter(Boolean).length,1);
    if(w.id===26)assert.equal(w.sampleAnswer,'この椅子に座ってもいいですか。');
  }
  const opening=preview.quizQuestions.find(q=>q.id===171);assert.match(opening.question,/開けます（あけます）/);assert.match(opening.explanation,/ひらく/);assert.equal(opening.options[3],'開けて');
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[408,'公園で写真を撮っています'],[416,'知ります'],[419,'まって'],[424,'撮って'],[428,'降っています'],[430,'ペンを使ってもいいですか。'],[431,'Rẽ phải'],[432,'Viết tên vào bài thi'],[433,'Đúng'],[434,'Nói chuyện điện thoại'],[435,'Học tiếng Nhật ở trường đại học'],[436,'Sai']]){
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer,String(id));
  }
  assert.ok(!exercises.find(e=>e.id===424).options.includes('撮ってて'));
  assert.match(exercises.find(e=>e.id===430).prompt,/Vてもいいですか/);
  assert.doesNotMatch(exercises.find(e=>e.id===431).prompt,/đỏ/);
  assert.match(exercises.find(e=>e.id===432).prompt,/yêu cầu/);
  assert.equal(exercises.find(e=>e.id===431).listeningId,25);assert.equal(exercises.find(e=>e.id===432).listeningId,26);
  assert.equal(exercises.find(e=>e.id===408).readingPassageId,26);
  const after=await readContentSnapshot(db,pkg);
  for(const table of ['kanji','grammar_examples'])assert.deepEqual(after[table],before[table]);
  for(const p of patches){const sectionId=p.after.section_id??before.conversations.find(c=>c.id===p.after.conversation_id)?.section_id;assert.equal(p.table==='learning_modules'?p.id:p.after.module_id??before.lesson_sections.find(s=>s.id===sectionId)?.module_id,15);}
  const reverse=reverseContentPatches(patches);await applyContentPatches(db,reverse);await verifySearchIndex(db,pkg.unit9Candidate);
  const restored=await readContentSnapshot(db,pkg);
  for(const p of reverse){const row=restored[p.table].find(r=>r.id===p.id),original=before[p.table].find(r=>r.id===p.id);
    if('version' in row){assert.equal(row.version,p.before.version+1);row.version=original.version;}
    if('updated_at' in row)row.updated_at=original.updated_at;
  }
  assert.deepEqual(restored,before);
},pkg.unit9Candidate));

test('Unit 10 rejects concurrent dialogue edits and missing vocabulary search atomically',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit10Candidate});
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await db.prepare("UPDATE conversation_lines SET hiragana='editor change' WHERE id=112").run();
  const changed=await readContentSnapshot(db,pkg);
  assert.throws(()=>planContentUpdate(changed,{...pkg,candidate:pkg.unit10Candidate}),/unexpected content/);
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),changed);await verifySearchIndex(db,pkg.unit9Candidate);
  await db.prepare('UPDATE conversation_lines SET hiragana=? WHERE id=112').bind(before.conversation_lines.find(r=>r.id===112).hiragana).run();
  await db.exec("DELETE FROM content_search WHERE kind='vocabulary' AND item_id=600");
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),before);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version);
  assert.equal((await db.prepare('SELECT count(*) n FROM mutation_guards').first()).n,0);
},pkg.unit9Candidate));

test('Unit 11 upgrades 29 rows, clarifies single-answer tasks and preserves drafts with rollback',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit11Candidate});
  assert.equal(patches.length,29);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,4);
  const oldSearch=await verifySearchIndex(db,before),revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await applyContentPatches(db,patches);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+4);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),{...pkg,candidate:pkg.unit11Candidate}).length,0);
  const newSearch=await verifySearchIndex(db,pkg.unit11Candidate);
  assert.equal(newSearch.filter((r,i)=>r.search_text!==oldSearch[i].search_text).length,7);
  const {Content}=await load('content'),key='unit11-review-test-only-revision-secret';
  const api=new Content(db,key),preview=await new Content(db,key,undefined,true).full(16,true);
  assert.equal((await api.full(16,true)).sections.length,0);
  assert.equal(preview.kanji.find(k=>k.id===107).radical,'巾');
  assert.equal(preview.grammarPatterns.find(g=>g.id===67).examples.find(e=>e.id===123).japanese,'私の趣味は絵を描くことです。');
  assert.equal(preview.vocabulary.find(v=>v.id===654).exampleJp,'手紙を書きます。');
  for(const [route,id,q] of [['vocabulary',652,'keyboard'],['grammar',66,'待つ'],['grammar',67,'描く'],['grammar',68,'lược'],['grammar',69,'行きたいです'],['grammar',70,'だれかと']]){
    assert.ok((await api.items(route,new URLSearchParams({moduleId:'16',search:q}))).data.some(r=>r.id===id));
  }
  const conversation=preview.sections.flatMap(s=>s.conversations).find(c=>c.id===28);
  assert.equal(conversation.version,2);assert.match(conversation.lines.find(l=>l.id===122).translation,/consecutive days off/);
  for(const l of preview.sections.flatMap(s=>s.listeningContent)){
    assert.equal(l.audioUrl,'TTS:ja-JP');assert.equal(l.version,3);assert.doesNotMatch(l.instructions,/\b(man|woman)\b/);
    for(const f of ['transcript','transcriptReading','transcriptTranslation'])assert.equal(l[f],pkg.unit10Candidate.listening_content.find(r=>r.id===l.id)[f]);
  }
  const reading=preview.sections.flatMap(s=>s.readingPassages).find(r=>r.id===28);
  assert.equal(reading.version,3);assert.match(reading.translation,/bathe in a hot spring/);
  for(const w of preview.sections.flatMap(s=>s.writingTasks)){
    assert.deepEqual([w.minLength,w.maxLength],w.id===27?[1,1]:[1,2]);assert.equal(w.version,2);
    assert.match(w.instructions,/câu, không phải ký tự/);
  }
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[452,'連休'],[460,'前に'],[461,'前に'],[467,'Leo núi và ăn cá ngon'],[469,'Sai']]){
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer,String(id));
  }
  for(const id of [460,461])assert.match(exercises.find(e=>e.id===id).prompt,/Dùng đúng mẫu/);
  assert.equal(exercises.find(e=>e.id===469).listeningId,28);assert.match(exercises.find(e=>e.id===469).prompt,/lịch buổi sáng/);
  for(const id of [187,190])assert.match(preview.quizQuestions.find(q=>q.id===id).question,/đúng mẫu/);
  const after=await readContentSnapshot(db,pkg);
  assert.deepEqual(after.lesson_sections,before.lesson_sections);
  for(const p of patches){
    const parent=p.table==='grammar_examples'?before.grammar_patterns.find(g=>g.id===p.after.grammar_pattern_id):p.table==='conversation_lines'?before.conversations.find(c=>c.id===p.after.conversation_id):p.after;
    assert.equal(p.table==='learning_modules'?p.id:parent.module_id??before.lesson_sections.find(s=>s.id===parent.section_id)?.module_id,16);
  }
  const reverse=reverseContentPatches(patches);await applyContentPatches(db,reverse);await verifySearchIndex(db,pkg.unit10Candidate);
  const restored=await readContentSnapshot(db,pkg);
  for(const p of reverse){const row=restored[p.table].find(r=>r.id===p.id),original=before[p.table].find(r=>r.id===p.id);
    if('version' in row){assert.equal(row.version,p.before.version+1);row.version=original.version;}
    if('updated_at' in row)row.updated_at=original.updated_at;
  }
  assert.deepEqual(restored,before);
},pkg.unit10Candidate));

test('Unit 11 rejects example reassignment, concurrent edits and missing search without partial writes',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,{...pkg,candidate:pkg.unit11Candidate}),p=patches.find(p=>p.table==='grammar_examples');
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await assert.rejects(applyContentPatches(db,[{...p,after:{...p.after,grammar_pattern_id:66}}]),/Unsupported editorial field|identity/);
  assert.deepEqual(await readContentSnapshot(db,pkg),before);
  await db.prepare("UPDATE grammar_examples SET japanese='editor change' WHERE id=123").run();
  const changed=await readContentSnapshot(db,pkg);
  assert.throws(()=>planContentUpdate(changed,{...pkg,candidate:pkg.unit11Candidate}),/unexpected content/);
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),changed);await verifySearchIndex(db,pkg.unit10Candidate);
  await db.prepare('UPDATE grammar_examples SET japanese=? WHERE id=123').bind(p.before.japanese).run();
  await db.exec("DELETE FROM content_search WHERE kind='vocabulary' AND item_id=652");
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),before);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version);
  assert.equal((await db.prepare('SELECT count(*) n FROM mutation_guards').first()).n,0);
},pkg.unit10Candidate));

test('Unit 12 upgrades 21 rows, aligns review tasks with sources and restores content/search on rollback',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,pkg);
  assert.equal(patches.length,21);assert.equal(patches.filter(p=>p.table==='quiz_questions').length,4);
  const oldSearch=await verifySearchIndex(db,before),revision=await db.prepare('SELECT version FROM assessment_revision').first();
  const protectedState=async()=>Promise.all(['users','user_module_progress'].map(async t=>(await db.prepare(`SELECT * FROM ${t}`).all()).results));
  const protectedBefore=await protectedState();
  await applyContentPatches(db,patches);
  assert.deepEqual(await protectedState(),protectedBefore);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version+4);
  assert.equal(planContentUpdate(await readContentSnapshot(db,pkg),pkg).length,0);
  const newSearch=await verifySearchIndex(db,pkg.candidate);
  assert.equal(newSearch.filter((r,i)=>r.search_text!==oldSearch[i].search_text).length,5);
  const {Content}=await load('content'),key='unit12-review-test-only-revision-secret';
  const api=new Content(db,key),preview=await new Content(db,key,undefined,true).full(19,true);
  assert.equal((await api.full(19,true)).sections.length,0);
  assert.match(preview.description,/not a full-length official JLPT mock exam/);
  assert.equal(preview.version,2);
  for(const [id,q] of [[71,'この本は高いです'],[72,'食べませんでした'],[73,'借りてもいいですか'],[74,'飲みますたい'],[75,'Aのほうが']]){
    assert.ok((await api.items('grammar',new URLSearchParams({moduleId:'19',search:q}))).data.some(r=>r.id===id));
  }
  const conversation=preview.sections.flatMap(s=>s.conversations).find(c=>c.id===29);
  assert.equal(conversation.title,'Weekend Trip Plans');assert.equal(conversation.version,2);
  for(const l of preview.sections.flatMap(s=>s.listeningContent)){
    assert.equal(l.audioUrl,'TTS:ja-JP');assert.equal(l.version,l.id===30?3:2);
    for(const f of ['transcript','transcriptReading'])assert.equal(l[f],pkg.unit11Candidate.listening_content.find(r=>r.id===l.id)[f]);
  }
  for(const w of preview.sections.flatMap(s=>s.writingTasks)){
    assert.deepEqual([w.minLength,w.maxLength],[1,1]);assert.equal(w.version,2);assert.match(w.instructions,/câu, không phải ký tự/);
    assert.equal(w.sampleAnswer.split('。').filter(Boolean).length,1);
    if(w.id===30){assert.match(w.instructions,/dùng から/);assert.equal(w.sampleAnswer,'雨が降りましたから、どこへも行きませんでした。');assert.match(w.rubric,/どこへも／どこにも／どこも/);}
  }
  const exercises=preview.sections.flatMap(s=>s.exercises);
  for(const [id,answer] of [[478,'９時前に'],[488,'旅行'],[489,'ぜひ'],[500,'どちら'],[501,'から'],[505,'Khi định trả tiền ở cửa hàng lưu niệm'],[506,'Đen / Tiền và hộ chiếu'],[507,'Sai'],[508,'Sushi / Ngon nhưng đắt'],[509,'Bút chì và tẩy']]){
    const e=exercises.find(e=>e.id===id);assert.equal(e.options[e.correctAnswer],answer,String(id));
  }
  assert.match(exercises.find(e=>e.id===501).prompt,/Vì trời/);
  assert.equal(exercises.find(e=>e.id===507).listeningId,30);assert.match(exercises.find(e=>e.id===507).prompt,/trong lúc làm bài/);
  assert.equal(exercises.find(e=>e.id===509).readingPassageId,30);assert.match(exercises.find(e=>e.id===509).prompt,/yêu cầu/);
  assert.equal(exercises.find(e=>e.id===510).correctAnswer,'私は学校に本を忘れました。');
  const q=preview.quizQuestions.find(q=>q.id===208);assert.equal(q.options[0],'昨日、宿題をしませんでした。');assert.doesNotMatch(q.explanation,/N4|と思います/);
  assert.match(preview.quizQuestions.find(q=>q.id===203).question,/dạng ます bỏ ます/);
  const after=await readContentSnapshot(db,pkg);
  for(const table of ['vocabulary','kanji','grammar_examples','reading_passages','conversation_lines','lesson_sections','test_templates','test_sections','test_questions'])assert.deepEqual(after[table],before[table]);
  for(const p of patches)assert.equal(p.table==='learning_modules'?p.id:p.after.module_id??before.lesson_sections.find(s=>s.id===p.after.section_id)?.module_id,19);
  const reverse=reverseContentPatches(patches);await applyContentPatches(db,reverse);await verifySearchIndex(db,pkg.unit11Candidate);
  const restored=await readContentSnapshot(db,pkg);
  for(const p of reverse){const row=restored[p.table].find(r=>r.id===p.id),original=before[p.table].find(r=>r.id===p.id);
    if('version' in row){assert.equal(row.version,p.before.version+1);row.version=original.version;}
    if('updated_at' in row)row.updated_at=original.updated_at;
  }
  assert.deepEqual(restored,before);assert.deepEqual(await protectedState(),protectedBefore);
},pkg.unit11Candidate));

test('Unit 12 rejects publication changes, concurrent descriptions and missing grammar search atomically',async()=>fixture(async db=>{
  const before=await readContentSnapshot(db,pkg),patches=planContentUpdate(before,pkg),p=patches.find(p=>p.table==='learning_modules');
  const revision=await db.prepare('SELECT version FROM assessment_revision').first();
  await assert.rejects(applyContentPatches(db,[{...p,after:{...p.after,content_status:'DRAFT'}}]),/Unsupported editorial field|publication/);
  assert.deepEqual(await readContentSnapshot(db,pkg),before);
  await db.prepare("UPDATE learning_modules SET description='editor change' WHERE id=19").run();
  const changed=await readContentSnapshot(db,pkg);
  assert.throws(()=>planContentUpdate(changed,pkg),/unexpected content/);
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),changed);await verifySearchIndex(db,pkg.unit11Candidate);
  await db.prepare('UPDATE learning_modules SET description=? WHERE id=19').bind(p.before.description).run();
  await db.exec("DELETE FROM content_search WHERE kind='grammar' AND item_id=75");
  await assert.rejects(applyContentPatches(db,patches),/mutation_check|constraint/i);
  assert.deepEqual(await readContentSnapshot(db,pkg),before);
  assert.equal((await db.prepare('SELECT version FROM assessment_revision').first()).version,revision.version);
  assert.equal((await db.prepare('SELECT count(*) n FROM mutation_guards').first()).n,0);
},pkg.unit11Candidate));
