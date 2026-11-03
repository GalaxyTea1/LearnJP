import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getPlatformProxy } from 'wrangler';
import { buildUnit, moduleId } from './unit-12.mjs';
import { buildUnit as n311 } from './unit-11.mjs';
import { buildUnit as n310 } from './unit-10.mjs';
import { buildUnit as n309 } from './unit-09.mjs';
import { buildUnit as n308 } from './unit-08.mjs';
import { buildUnit as n307 } from './unit-07.mjs';
import { buildUnit as n306 } from './unit-06.mjs';
import { buildUnit as n305 } from './unit-05.mjs';
import { buildUnit as n304 } from './unit-04.mjs';
import { buildUnit as n303 } from './unit-03.mjs';
import { buildUnit as n301 } from './unit-01.mjs';
import { buildUnit as n302 } from './unit-02.mjs';
import { migrate, fixtures, load } from '../../test/learning-fixture.mjs';
import { readings, vocab, kanji, grammar } from '../../../content/n3/n3-12.mjs';

test('N3-12 curriculum, publication, assessment and learner isolation', async () => {
  const p = await buildUnit(),
    n5 = JSON.parse(await readFile('content/n5/review/candidate.json', 'utf8'));
  const previous = [];
  for (let unit = 1; unit <= 14; unit++)
    previous.push(await (await import(`../n4/unit-${String(unit).padStart(2, '0')}.mjs`)).buildUnit());
  previous.push(
    await n301(),
    await n302(),
    await n303(),
    await n304(),
    await n305(),
    await n306(),
    await n307(),
    await n308(),
    await n309(),
    await n310(),
    await n311(),
  );
  const knownVocab = new Set([...n5.vocabulary, ...previous.flatMap(x => x.vocabulary)].map(x => x.japanese));
  const knownKanji = new Set([...n5.kanji, ...previous.flatMap(x => x.kanji)].map(x => x.character));
  const plan = JSON.parse(await readFile(new URL('./planning/n3-kanji-plan.json', import.meta.url), 'utf8'));
  // Curriculum ledger: new items only, Kanji exactly as locked in CURRICULUM_SOURCE_OF_TRUTH_N3.md.
  assert.equal(new Set(p.vocabulary.map(x => x.japanese)).size, 105);
  for (const v of p.vocabulary) assert.ok(!knownVocab.has(v.japanese), `Already introduced vocabulary: ${v.japanese}`);
  for (const k of p.kanji) assert.ok(!knownKanji.has(k.character), `Already introduced Kanji: ${k.character}`);
  assert.equal(p.kanji.map(k => k.character).join(''), plan['N3-12']);
  assert.equal(p.grammar_patterns.length, 7);
  assert.equal(p.grammar_examples.length, 21);
  assert.equal(p.lesson_sections.length, 10);
  assert.equal(p.lesson_exercises.length, 47);
  assert.equal(p.quiz_questions.length, 25);
  assert.equal(p.listening_content.length, 3);
  assert.equal(p.reading_passages.length, 2);
  assert.equal(p.writing_tasks.length, 2);
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    'ネット通販は便利な',
    '都市では人口が増える',
    '機能が多い（　）',
    'Câu nào SAI',
    '前の機種（　）',
    '社長（　）',
    '現金（　）',
    '電話する（　）',
    'に代わって và かわりに',
    '安い（　）、カメラ',
    '機械に任せるより',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  for (const q of [...p.quiz_questions, ...p.lesson_exercises]) {
    const options = JSON.parse(q.options);
    assert.equal(options.length, 4);
    assert.equal(new Set(options).size, 4);
    const answer = q.correct_index ?? JSON.parse(q.correct_answer);
    assert.ok(Number.isInteger(answer) && answer >= 0 && answer < 4);
    assert.ok(q.explanation.trim());
  }
  for (const w of p.writing_tasks)
    assert.ok(
      w.sample_answer.length >= w.min_length && w.sample_answer.length <= w.max_length,
      `Writing sample length ${w.sample_answer.length}`,
    );
  for (const [, text] of readings) assert.ok(text.length >= 400 && text.length <= 700, `Reading length ${text.length}`);
  // Guard against leftover drafting fragments in learner-facing text.
  assert.doesNotMatch(
    await readFile(new URL('../../../content/n3/n3-12.mjs', import.meta.url), 'utf8'),
    /…(ではなく|じゃなくて|いいえ|ではない|いや)|。だから…/,
  );
  for (const row of vocab) assert.equal(row.length, 7);
  for (const row of kanji) assert.equal(row.length, 7);
  for (const [, , , examples] of grammar) assert.ok(examples.length >= 3);
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～反面').explanation.includes('一方で'),
    '反面 must contrast with 一方で',
  );
  const proxy = await getPlatformProxy({
    configPath: 'wrangler.local.jsonc',
    persist: false,
    remoteBindings: false,
    envFiles: [],
  });
  try {
    const db = proxy.env.DB;
    await migrate(db);
    await fixtures(db);
    for (const pkg of [...previous, p])
      for (const [table, rows] of Object.entries(pkg))
        await db.batch(
          rows.map(row =>
            db
              .prepare(
                `INSERT INTO ${table} (${Object.keys(row).join(',')}) VALUES (${Object.keys(row)
                  .map(() => '?')
                  .join(',')})`,
              )
              .bind(...Object.values(row)),
          ),
        );
    assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results, []);
    const { Content } = await load('content'),
      { Assessments } = await load('assessments'),
      { Study } = await load('study'),
      { Srs } = await load('srs');
    const key = 'local-only-n3-revision-key-for-tests-12345',
      content = new Content(db, key);
    assert.equal((await content.modules(new URLSearchParams({ level: 'N3' }))).length, 0);
    await assert.rejects(content.full(moduleId, true), { status: 404 });
    assert.equal((await new Content(db, key, undefined, true).full(moduleId, true)).sections.length, 10);
    await db.prepare("UPDATE learning_modules SET content_status='PUBLISHED' WHERE id=?").bind(moduleId).run();
    assert.equal((await content.full(moduleId, true)).sections.length, 0);
    for (const table of [
      'lesson_sections',
      'conversations',
      'listening_content',
      'reading_passages',
      'writing_tasks',
      'lesson_exercises',
    ])
      await db.prepare(`UPDATE ${table} SET status='PUBLISHED' WHERE id BETWEEN 30001 AND 42000`).run();
    assert.equal((await content.modules(new URLSearchParams({ level: 'N3' }))).length, 1);
    const full = await content.full(moduleId, true);
    assert.equal(full.sections.length, 10);
    assert.equal(full.quizQuestions.length, 25);
    assert.equal(full.grammarPatterns.length, 7);
    assert.equal(full.vocabulary.length, 105);
    assert.equal(full.kanji.length, 24);
    assert.ok(full.sections.every(s => s.instructions?.trim()));
    assert.ok(full.quizQuestions.every(q => !('correctIndex' in q) && !('explanation' in q)));
    // Practice exercises self-check in the client; scored quiz answers stay server-side.
    await db
      .prepare(
        "INSERT INTO users(id,email,username,password_hash) VALUES (1,'n3@test.invalid','n3test','!external-only')",
      )
      .run();
    const study = new Study(db, 1);
    await study.write(moduleId, {
      completedTabs: ['grammar'],
      vocabulary: [{ id: p.vocabulary[0].id, mastered: true }],
    });
    assert.deepEqual((await study.read(moduleId)).masteredVocabularyIds, [p.vocabulary[0].id]);
    const payload = {
      moduleId,
      requestId: crypto.randomUUID(),
      quizRevision: full.quizRevision,
      answers: p.quiz_questions.map(q => ({ questionId: q.id, selectedIndex: q.correct_index })),
    };
    const assess = new Assessments(db, 1, key),
      result = await assess.quiz(payload);
    assert.equal(result.score, 25);
    assert.equal(result.passed, true);
    assert.deepEqual(await assess.quiz(payload), result);
    assert.equal((await study.read(moduleId)).quizCompleted, true);
    const srs = new Srs(db, 1);
    await srs.review({ itemType: 'VOCAB', itemId: p.vocabulary[0].id, quality: 4 });
    await db.prepare("UPDATE learning_modules SET content_status='DRAFT' WHERE id=?").bind(moduleId).run();
    await assert.rejects(study.write(moduleId, { completedTabs: ['kanji'] }), { status: 404 });
    await assert.rejects(assess.quiz({ ...payload, requestId: crypto.randomUUID() }), { status: 404 });
    await assert.rejects(srs.review({ itemType: 'VOCAB', itemId: p.vocabulary[0].id, quality: 4 }), { status: 404 });
  } finally {
    await proxy.dispose();
  }
});
