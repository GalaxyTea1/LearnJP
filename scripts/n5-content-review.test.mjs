import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {getPlatformProxy} from 'wrangler';
import {reviewSnapshot,auditSnapshot,digest} from './n5-content-review.mjs';
import {migrate,load} from './learning-fixture.mjs';
const source=JSON.parse(await readFile(new URL('../.local/content/n5.json',import.meta.url),'utf8'));
const fields=JSON.parse(await readFile(new URL('../backend/cloudflare/columns.json',import.meta.url),'utf8'));
const {candidate,changes}=reviewSnapshot(source);
async function insertSnapshot(db,data) {
  for(const [table,rows] of Object.entries(data))for(let i=0;i<rows.length;i+=40) {
    await db.batch(rows.slice(i,i+40).map(row=>db.prepare(`INSERT INTO ${table} (${fields[table].map(f=>f.column).join(',')}) VALUES (${fields[table].map(()=>'?').join(',')})`).bind(...fields[table].map(f=>row[f.name]==null?null:f.type==='Json'?JSON.stringify(row[f.name]):f.type==='Boolean'?Number(row[f.name]):row[f.name]))));
  }
}

test('review is deterministic, preserves source/publication and leaves mock modules untouched',()=>{
  assert.equal(digest(source),'f6179bfab8b0180c4e1a98fa6aab4fe944454593319f3ecf6c491a9c54b7788f');
  assert.equal(digest(reviewSnapshot(source).candidate),digest(candidate));
  for(const table of Object.keys(source))for(const [i,original] of source[table].entries()) {
    const row=candidate[table][i];assert.equal(row.id,original.id);assert.equal(row.status,original.status);
    assert.equal(row.contentStatus,original.contentStatus);assert.equal(row.publishedAt,original.publishedAt);
    if(!changes.some(c=>c.table===table&&c.id===row.id))assert.deepEqual(row,original);
  }
  assert.deepEqual(auditSnapshot(candidate).counts,{SECTION_NOT_PUBLIC:120,TTS_BETA:24});
});
test('sentence answers contain every provided token, including originally shuffled sets',()=>{
  const clean=text=>text.replace(/[。、\s]/gu,'');
  for(const change of changes.filter(c=>c.reason.startsWith('Đáp án sắp xếp'))) {
    const row=candidate.lesson_exercises.find(r=>r.id===change.id);
    assert.deepEqual([...clean(row.correctAnswer)].sort(),[...clean(row.options.join(''))].sort(),String(row.id));
    assert.ok(row.correctAnswer.length>Math.max(...row.options.map(o=>o.length)));
  }
  assert.equal(candidate.lesson_exercises.find(r=>r.id===365).correctAnswer,'いっしょにビールを飲みに行きませんか。');
  assert.equal(candidate.lesson_exercises.find(r=>r.id===361).correctAnswer,1);
});
test('audit detects broken context, invalid choice indexes and incomplete ordering independently',()=>{
  const broken=structuredClone(candidate);
  broken.lesson_exercises.find(r=>r.id===143).listeningId=99999;
  broken.lesson_exercises.find(r=>r.id===144).correctAnswer=99;
  broken.lesson_exercises.find(r=>r.id===149).correctAnswer=0;
  const codes=auditSnapshot(broken).findings.map(f=>f.code);
  for(const code of ['INVALID_CONTEXT','CHOICE_ANSWER','ORDER_ANSWER'])assert.ok(codes.includes(code));
});
test('review fails on source relationship drift instead of overwriting an editor change',()=>{
  const changed=structuredClone(source);changed.lesson_exercises.find(r=>r.id===143).listeningId=10;
  assert.throws(()=>reviewSnapshot(changed),/overwrite/);
});

test('quiz review preserves schema and unrelated rows, and refuses draft module edits',()=>{
  const edited=changes.filter(c=>c.table==='quiz_questions');
  assert.equal(edited.length,66);
  for(const q of candidate.quiz_questions)assert.deepEqual(Object.keys(q),Object.keys(source.quiz_questions.find(r=>r.id===q.id)));
  const changed=structuredClone(source);
  changed.quiz_questions.find(r=>r.id===42).moduleId=source.learning_modules.find(m=>m.contentStatus==='DRAFT').id;
  assert.throws(()=>reviewSnapshot(changed),/Do not change draft\/mock modules/);
});

test('reviewed quizzes grade through D1 with independent answer keys, draft readings and stale revisions',async()=>{
  const proxy=await getPlatformProxy({configPath:fileURLToPath(new URL('../wrangler.local.jsonc',import.meta.url)),persist:false,remoteBindings:false,envFiles:[]});
  try {
    const db=proxy.env.DB;await migrate(db);await insertSnapshot(db,source);
    const {Content}=await load('content'),{Assessments}=await load('assessments');
    const key='review-only-quiz-revision-key-not-production',api=new Content(db,key);
    await db.prepare("INSERT INTO users(id,email,username,password_hash) VALUES (1,'quiz-review@test.invalid','quiz_review','fake-hash')").run();
    const assessment=new Assessments(db,1,key);
    const edits=changes.filter(c=>c.table==='quiz_questions');
    const moduleIds=[...new Set(edits.map(c=>candidate.quiz_questions.find(q=>q.id===c.id).moduleId))];
    const before=new Map(await Promise.all(moduleIds.map(async id=>[id,await api.questions(id)])));
    // Exercise the actual D1 updates/revision triggers; only this ephemeral DB is modified.
    for(const c of edits) {
      const row=candidate.quiz_questions.find(q=>q.id===c.id);
      await db.prepare('UPDATE quiz_questions SET question=?,options=?,correct_index=?,explanation=? WHERE id=?').bind(row.question,JSON.stringify(row.options),row.correctIndex,row.explanation,row.id).run();
    }
    const expected=new Map([[36,'の'],[38,'どなた'],[42,'この人は誰ですか。'],[44,'20'],[66,'まで'],[74,'8 tiếng'],[85,'飲みます'],[100,'います'],[113,'見ましょう'],[115,'苦い'],[119,'Ramen và bia lạnh'],[130,'いくつ'],[144,'お金がないからです。'],[149,'Bơi và ăn cá ngon'],[156,'かったです'],[163,'お茶のほうが好きです。'],[186,'描く'],[206,'辞書を借りてもいいですか。']]);
    for(const [id,answer] of [[51,'は'],[53,'ですか'],[55,'何'],[58,'はい、元気です。']])expected.set(id,answer);
    for(const [id,answer] of [[35,'おいくつですか'],[41,'これは私の家族の写真です。'],[43,'父は５０歳です。'],[45,'Giáo viên']])expected.set(id,answer);
    for(const [id,answer] of [[62,'やすみ'],[63,'午後'],[67,'と'],[68,'に']])expected.set(id,answer);
    for(const [id,answer] of [[81,'を'],[86,'いっしょに行きませんか。'],[87,'Đồng ý và thấy lời rủ là ý hay.'],[88,'６時に朝ごはんを食べます。']])expected.set(id,answer);
    for(const [id,answer] of [[92,'した'],[96,'に'],[98,'や'],[102,'はい、そうです。']])expected.set(id,answer);
    for(const [id,answer] of [[107,'さけ'],[111,'を'],[114,'どんな飲み物が好きですか。'],[118,'少々お待ちください。']])expected.set(id,answer);
    for(const [id,answer] of [[123,'青い'],[126,'が'],[128,'シャツを二枚買います。']])expected.set(id,answer);
    for(const [id,answer] of [[143,'スポーツをしませんか。'],[146,'いっしょに遊びに行きませんか。'],[148,'ぜひ行きたいです。']])expected.set(id,answer);
    for(const [id,answer] of [[152,'はれ'],[159,'クラスの中で田中さんが一番背が高いです。'],[161,'旅行はどうでしたか。'],[164,'かったです'],[165,'じゃありませんでした']])expected.set(id,answer);
    for(const [id,answer] of [[167,'まって'],[171,'開けて'],[172,'知って'],[173,'ここに座ってもいいですか。'],[180,'Hành động đang diễn ra, trạng thái hoặc thói quen']])expected.set(id,answer);
    for(const [id,answer] of [[181,'待つ'],[187,'前に'],[190,'食事の前に、写真を撮ります。'],[195,'Dự định làm']])expected.set(id,answer);
    for(const [id,answer] of [[203,'お茶を飲みたいです。'],[205,'東京に住んでいますか。'],[208,'昨日、宿題をしませんでした。'],[210,'Trước khi (hành động V)']])expected.set(id,answer);
    for(const id of moduleIds) {
      const current=await api.questions(id),previous=before.get(id);
      assert.notEqual(current.quizRevision,previous.quizRevision);
      assert.equal((await api.full(id,true)).sections.length,0,'Reading sections remain draft');
      const submit=answers=>({moduleId:id,requestId:crypto.randomUUID(),quizRevision:current.quizRevision,answers});
      const answers=current.questions.map(q=>{
        assert.equal(q.correctIndex,undefined,'Public API must not expose answer keys');
        assert.equal(q.explanation,undefined);
        const index=expected.has(q.id)?q.options.indexOf(expected.get(q.id)):source.quiz_questions.find(r=>r.id===q.id).correctIndex;
        assert.ok(index>=0);return {questionId:q.id,selectedIndex:index};
      });
      await assert.rejects(assessment.quiz({...submit(answers),quizRevision:previous.quizRevision}),{status:409});
      const staleWrites=await db.prepare('SELECT count(*) n FROM user_quiz_attempts WHERE module_id=?').bind(id).first();
      assert.equal(staleWrites.n,0);
      const correct=await assessment.quiz(submit(answers));
      assert.equal(correct.score,15);assert.equal(correct.passed,true);assert.equal(correct.xpEarned,150);
      const wrong=answers.map(a=>expected.has(a.questionId)?{...a,selectedIndex:a.questionId===42?3:(a.selectedIndex+1)%4}:a);
      const marked=await assessment.quiz(submit(wrong));
      assert.equal(marked.score,15-answers.filter(a=>expected.has(a.questionId)).length);
      for(const r of marked.results.filter(r=>expected.has(r.questionId)))assert.equal(r.isCorrect,false);
      assert.equal(marked.xpEarned,0,'Completed modules cannot award completion XP again');
    }
    for(const id of [44,45,74,119,149]) {
      const q=(await api.questions(candidate.quiz_questions.find(r=>r.id===id).moduleId)).questions.find(q=>q.id===id);
      assert.doesNotMatch(q.question,/bài đọc/i,'Quiz must carry context instead of referring to a hidden passage');
      assert.match(q.question,/[ぁ-んァ-ヶ一-龯]/u);
    }
    assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results,[]);
  } finally {await proxy.dispose();}
});
test('candidate round-trips through D1 and draft context hides dependent exercises',async()=>{
  const proxy=await getPlatformProxy({configPath:fileURLToPath(new URL('../wrangler.local.jsonc',import.meta.url)),persist:false,remoteBindings:false,envFiles:[]});
  try {
    const db=proxy.env.DB;await migrate(db);
    await insertSnapshot(db,candidate);
    assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results,[]);
    const {Content}=await load('content'),publicApi=new Content(db,'test-only-revision-key-never-use-production'),preview=new Content(db,'test-only-revision-key-never-use-production',undefined,true);
    assert.equal((await publicApi.full(7,true)).sections.length,0);
    const inspected=await preview.full(7,true);
    const exercise=inspected.sections.flatMap(s=>s.exercises);
    assert.equal(exercise.find(e=>e.id===149).correctAnswer,'私はベトナム人です。');
    assert.equal(inspected.sections.flatMap(s=>s.readingPassages).find(r=>r.id===9).exercises.length,6);
    // Test-only publication of non-listening rows in an ephemeral database.
    await db.prepare("UPDATE lesson_sections SET status='PUBLISHED' WHERE module_id=7 AND section_type!='LISTENING'").run();
    for(const table of ['conversations','reading_passages','writing_tasks','lesson_exercises'])await db.prepare(`UPDATE ${table} SET status='PUBLISHED' WHERE section_id IN (SELECT id FROM lesson_sections WHERE module_id=7)`).run();
    const publicModule=await publicApi.full(7,true),visible=publicModule.sections.flatMap(s=>s.exercises);
    assert.ok(visible.some(e=>e.id===149));
    assert.ok(!visible.some(e=>[143,144,145].includes(e.id)),'Questions depending on a draft audio item must stay hidden');
    await db.prepare("UPDATE reading_passages SET status='DRAFT' WHERE id=9").run();
    const hidden=(await publicApi.full(7,true)).sections.flatMap(s=>s.exercises);
    for(const id of [115,116,117,146,147,148])assert.ok(!hidden.some(e=>e.id===id));
  } finally {await proxy.dispose();}
});
