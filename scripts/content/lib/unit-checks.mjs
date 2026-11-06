// Checks shared by every N2/N1 lesson test: the curriculum ledger (only new vocabulary and the
// planned kanji and grammar), the shape of the questions, and a full round trip through a
// throwaway D1 database (draft is hidden, publishing shows it, the quiz scores and a draft
// lesson accepts no learner writes).
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { getPlatformProxy } from 'wrangler';
import { migrate, fixtures, load } from '../../test/learning-fixture.mjs';

const contentRoot = new URL('../', import.meta.url);
const levelOrder = ['n4', 'n3', 'n2', 'n1'];

async function unitPackages(level) {
  const folder = new URL(`${level}/`, contentRoot);
  const names = (await readdir(folder).catch(() => [])).filter(n => /^unit-\d+\.mjs$/.test(n)).sort();
  const result = [];
  for (const name of names) result.push({ name, ...(await import(new URL(name, folder))) });
  return result;
}

// Packages of every lesson taught before `level` lesson `unitNumber`.
export async function earlierLessons(level, unitNumber) {
  const packages = [];
  for (const lv of levelOrder) {
    const units = await unitPackages(lv);
    for (const unit of units) {
      if (lv === level.toLowerCase() && Number(unit.name.match(/\d+/)[0]) >= unitNumber) break;
      packages.push(await unit.buildUnit());
    }
    if (lv === level.toLowerCase()) break;
  }
  return packages;
}

export async function checkCurriculum(p, { level, code, earlier, vocabulary, grammar, readingLength }) {
  const n5 = JSON.parse(await readFile(new URL('../../../content/n5/review/candidate.json', import.meta.url), 'utf8'));
  const knownVocab = new Set([...n5.vocabulary, ...earlier.flatMap(x => x.vocabulary)].map(x => x.japanese));
  const knownKanji = new Set([...n5.kanji, ...earlier.flatMap(x => x.kanji)].map(x => x.character));
  const plan = JSON.parse(
    await readFile(new URL(`../../../content/${level.toLowerCase()}/kanji-plan.json`, import.meta.url), 'utf8'),
  );
  const { units } = await import(`../../../content/${level.toLowerCase()}/syllabus.mjs`);
  const syllabus = units.find(u => u.code === code);

  assert.equal(new Set(p.vocabulary.map(x => x.japanese)).size, vocabulary, 'vocabulary count');
  for (const v of p.vocabulary) assert.ok(!knownVocab.has(v.japanese), `Already introduced vocabulary: ${v.japanese}`);
  for (const k of p.kanji) assert.ok(!knownKanji.has(k.character), `Already introduced kanji: ${k.character}`);
  assert.equal(p.kanji.map(k => k.character).join(''), plan[code], 'kanji differ from kanji-plan.json');
  assert.deepEqual(
    p.grammar_patterns.map(g => g.pattern),
    syllabus.grammar,
    'grammar differs from the syllabus',
  );
  assert.equal(p.grammar_patterns.length, grammar);
  assert.ok(p.grammar_examples.length >= grammar * 3, 'at least three examples per grammar point');
  assert.equal(p.lesson_sections.length, 10);
  assert.ok(p.lesson_sections.every(s => s.instructions?.trim()));
  assert.equal(p.lesson_exercises.length, 47);
  assert.equal(p.quiz_questions.length, 25);
  assert.equal(p.listening_content.length, 3);
  assert.equal(p.reading_passages.length, 2);
  assert.equal(p.writing_tasks.length, 2);
  for (const q of [...p.quiz_questions, ...p.lesson_exercises]) {
    const options = JSON.parse(q.options);
    assert.equal(options.length, 4);
    assert.equal(new Set(options).size, 4, `Repeated option in: ${q.question ?? q.prompt}`);
    const answer = q.correct_index ?? JSON.parse(q.correct_answer);
    assert.ok(Number.isInteger(answer) && answer >= 0 && answer < 4);
    assert.ok(q.explanation.trim());
  }
  // Correct answers are spread over A–D, so always picking one letter cannot pass.
  const positions = [0, 0, 0, 0];
  for (const q of p.quiz_questions) positions[q.correct_index]++;
  assert.ok(Math.max(...positions) <= 10, `quiz answers bunch up: ${positions}`);
  for (const w of p.writing_tasks)
    assert.ok(
      w.sample_answer.length >= w.min_length && w.sample_answer.length <= w.max_length,
      `Writing sample length ${w.sample_answer.length} outside ${w.min_length}–${w.max_length}`,
    );
  for (const r of p.reading_passages)
    assert.ok(
      r.content.length >= readingLength[0] && r.content.length <= readingLength[1],
      `Reading “${r.title}” is ${r.content.length} characters`,
    );
}

const insertAll = async (db, packages) => {
  for (const pkg of packages)
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
};

export async function checkInDatabase(p, { level, moduleId, earlier }) {
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
    await insertAll(db, [...earlier, p]);
    assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results, []);
    const { Content } = await load('content'),
      { Assessments } = await load('assessments'),
      { Study } = await load('study');
    const key = 'local-only-lesson-revision-key-for-tests',
      content = new Content(db, key);
    const published = async () =>
      (await content.modules(new URLSearchParams({ level }))).filter(m => m.id === moduleId);

    // A draft lesson is invisible to learners but visible in the staff preview.
    assert.equal((await published()).length, 0);
    await assert.rejects(content.full(moduleId, true), { status: 404 });
    assert.equal((await new Content(db, key, undefined, true).full(moduleId, true)).sections.length, 10);

    // Publish the lesson and its sections the way import-unit --publish does.
    const last = moduleId + 999;
    await db.prepare("UPDATE learning_modules SET content_status='PUBLISHED' WHERE id=?").bind(moduleId).run();
    for (const table of [
      'lesson_sections',
      'conversations',
      'listening_content',
      'reading_passages',
      'writing_tasks',
      'lesson_exercises',
    ])
      await db.prepare(`UPDATE ${table} SET status='PUBLISHED' WHERE id BETWEEN ? AND ?`).bind(moduleId, last).run();
    assert.equal((await published()).length, 1);
    const full = await content.full(moduleId, true);
    assert.equal(full.sections.length, 10);
    assert.equal(full.vocabulary.length, p.vocabulary.length);
    assert.equal(full.kanji.length, p.kanji.length);
    assert.equal(full.grammarPatterns.length, p.grammar_patterns.length);
    assert.equal(full.quizQuestions.length, 25);
    assert.ok(
      full.quizQuestions.every(q => !('correctIndex' in q) && !('explanation' in q)),
      'quiz answers leak',
    );

    // A learner studies, passes the quiz once (a replay returns the same result) and is locked
    // out again when the lesson goes back to draft.
    await db
      .prepare(
        "INSERT INTO users(id,email,username,password_hash) VALUES (1,'lesson@test.invalid','lesson','!external-only')",
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
    await db.prepare("UPDATE learning_modules SET content_status='DRAFT' WHERE id=?").bind(moduleId).run();
    await assert.rejects(study.write(moduleId, { completedTabs: ['kanji'] }), { status: 404 });
    await assert.rejects(assess.quiz({ ...payload, requestId: crypto.randomUUID() }), { status: 404 });
  } finally {
    await proxy.dispose();
  }
}
