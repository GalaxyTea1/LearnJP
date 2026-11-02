import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getPlatformProxy} from 'wrangler';
import {buildUnit,moduleId} from './unit-14.mjs';
import {migrate,fixtures,load} from '../../test/learning-fixture.mjs';
import {readings,vocab,kanji,reviewLedger} from '../../../content/n4/n4-14.mjs';

test('N4-14 curriculum, publication, assessment and learner isolation',async()=>{
 const p=await buildUnit(),n5=JSON.parse(await readFile('content/n5/review/candidate.json','utf8'));
 const previous=[];
 for(let unit=1;unit<=13;unit++)previous.push(await(await import(`./unit-${String(unit).padStart(2,'0')}.mjs`)).buildUnit());
 const knownVocab=new Set([...n5.vocabulary,...previous.flatMap(x=>x.vocabulary)].map(x=>x.japanese));
 const knownKanji=new Set([...n5.kanji,...previous.flatMap(x=>x.kanji)].map(x=>x.character));
 assert.equal(new Set(p.vocabulary.map(x=>x.japanese)).size,50);
 assert.equal(new Set(p.kanji.map(x=>x.character)).size,12);
 for(const v of p.vocabulary)assert.ok(knownVocab.has(v.japanese),`Review vocabulary must have been introduced: ${v.japanese}`);
 for(const k of p.kanji)assert.ok(!knownKanji.has(k.character),`Already introduced Kanji: ${k.character}`);
 assert.equal(p.grammar_patterns.length,9);assert.equal(p.grammar_examples.length,27);
 assert.equal(p.lesson_exercises.length,40);assert.equal(p.quiz_questions.length,20);
 const quizText=p.quiz_questions.map(q=>q.question).join('\n');
 for(let u=1;u<=13;u++)assert.ok(quizText.includes(`N4-${String(u).padStart(2,'0')}:`),`Missing unit ${u} in cumulative quiz`);
 assert.equal(reviewLedger.length,50);
 assert.equal(new Set(reviewLedger.map(x=>x.introducedIn)).size,13);
 for(const entry of reviewLedger){const source=previous[Number(entry.introducedIn.slice(3))-1];const row=source.vocabulary.find(v=>v.japanese===entry.japanese);assert.ok(row);const review=p.vocabulary.find(v=>v.japanese===entry.japanese);for(const field of ['hiragana','romaji','english','example_jp','example_en'])assert.equal(review[field],row[field]);}
 for(const q of [...p.quiz_questions,...p.lesson_exercises]){const options=JSON.parse(q.options);assert.equal(options.length,4);assert.equal(new Set(options).size,4);const answer=q.correct_index??JSON.parse(q.correct_answer);assert.ok(Number.isInteger(answer)&&answer>=0&&answer<4);assert.ok(q.explanation.trim());}
 for(const w of p.writing_tasks)assert.ok(w.sample_answer.length>=w.min_length&&w.sample_answer.length<=w.max_length);
 for(const [,text]of readings)assert.ok(text.length>=200&&text.length<=400);
 for(const row of vocab)assert.equal(row.length,7);
 for(const row of kanji)assert.equal(row.length,7);
 const proxy=await getPlatformProxy({configPath:'wrangler.local.jsonc',persist:false,remoteBindings:false,envFiles:[]});
 try{
 const db=proxy.env.DB;await migrate(db);await fixtures(db);
 for(const pkg of [...previous,p])for(const [table,rows]of Object.entries(pkg))await db.batch(rows.map(row=>db.prepare(`INSERT INTO ${table} (${Object.keys(row).join(',')}) VALUES (${Object.keys(row).map(()=>'?').join(',')})`).bind(...Object.values(row))));
 assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results,[]);
 const {Content}=await load('content'),{Assessments}=await load('assessments'),{Study}=await load('study'),{Srs}=await load('srs');
 const key='local-only-n4-revision-key-for-tests-12345',content=new Content(db,key);
 assert.equal((await content.modules(new URLSearchParams({level:'N4'}))).length,0);
 await assert.rejects(content.full(moduleId,true),{status:404});
 assert.equal((await new Content(db,key,undefined,true).full(moduleId,true)).sections.length,10);
 await db.prepare("UPDATE learning_modules SET content_status='PUBLISHED' WHERE id=?").bind(moduleId).run();
 assert.equal((await content.full(moduleId,true)).sections.length,0);
 for(const table of ['lesson_sections','conversations','listening_content','reading_passages','writing_tasks','lesson_exercises'])await db.prepare(`UPDATE ${table} SET status='PUBLISHED' WHERE id BETWEEN 23001 AND 24000`).run();
 assert.equal((await db.prepare("SELECT count(*) AS n FROM learning_modules WHERE level_id=10001 AND content_status='DRAFT'").first()).n,13);
 const full=await content.full(moduleId,true);
 assert.equal(full.sections.length,10);assert.equal(full.quizQuestions.length,20);assert.equal(full.grammarPatterns.length,9);
 assert.ok(full.sections.every(s=>s.instructions?.trim()));
 assert.ok(full.quizQuestions.every(q=>!('correctIndex'in q)&&!('explanation'in q)));
 // Practice exercises self-check in the client; scored quiz answers stay server-side.
 await db.prepare("INSERT INTO users(id,email,username,password_hash) VALUES (1,'n4@test.invalid','n4test','!external-only')").run();
 const study=new Study(db,1);await study.write(moduleId,{completedTabs:['grammar'],vocabulary:[{id:p.vocabulary[0].id,mastered:true}]});assert.deepEqual((await study.read(moduleId)).masteredVocabularyIds,[p.vocabulary[0].id]);
 const payload={moduleId,requestId:crypto.randomUUID(),quizRevision:full.quizRevision,answers:p.quiz_questions.map(q=>({questionId:q.id,selectedIndex:q.correct_index}))};
 const assess=new Assessments(db,1,key),result=await assess.quiz(payload);assert.equal(result.score,20);assert.equal(result.passed,true);assert.deepEqual(await assess.quiz(payload),result);
 assert.equal((await study.read(moduleId)).quizCompleted,true);
 const srs=new Srs(db,1);await srs.review({itemType:'VOCAB',itemId:p.vocabulary[0].id,quality:4});
 await db.prepare("UPDATE learning_modules SET content_status='DRAFT' WHERE id=?").bind(moduleId).run();
 await assert.rejects(study.write(moduleId,{completedTabs:['kanji']}),{status:404});
 await assert.rejects(assess.quiz({...payload,requestId:crypto.randomUUID()}),{status:404});
 await assert.rejects(srs.review({itemType:'VOCAB',itemId:p.vocabulary[0].id,quality:4}),{status:404});
 }finally{await proxy.dispose();}
});
