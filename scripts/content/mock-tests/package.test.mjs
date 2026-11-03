import test from 'node:test';
import assert from 'node:assert/strict';
import { getPlatformProxy } from 'wrangler';
import { mockTestsPackage, firstId, lastId } from './package.mjs';
import { mocks } from '../../../content/tests/mock-tests.mjs';
import { migrate, fixtures, load } from '../../test/learning-fixture.mjs';

test('mock tests: structure, answer keys and the start/submit/review flow for N4 and N3', async () => {
  const p = await mockTestsPackage();
  // Three tests per level, four JLPT-style sections each.
  assert.deepEqual(
    p.test_templates.map(t => t.level),
    ['N4', 'N4', 'N4', 'N3', 'N3', 'N3'],
  );
  assert.equal(p.test_sections.length, 24);
  assert.equal(p.test_questions.length, 204);
  for (const t of [...p.test_templates, ...p.test_sections, ...p.test_questions])
    assert.ok(t.id >= firstId && t.id <= lastId);
  for (const t of p.test_templates) {
    assert.equal(t.is_published, 0);
    const sections = p.test_sections.filter(s => s.template_id === t.id);
    assert.deepEqual(
      sections.map(s => s.section_type),
      ['VOCABULARY', 'GRAMMAR', 'READING', 'LISTENING'],
    );
    assert.equal(
      sections.reduce((n, s) => n + s.duration_minutes, 0),
      t.duration_minutes,
    );
    assert.equal(p.test_questions.filter(q => sections.some(s => s.id === q.section_id)).length, t.total_questions);
  }
  for (const q of p.test_questions) {
    const options = JSON.parse(q.options);
    assert.equal(options.length, 4);
    assert.equal(new Set(options).size, 4, q.question_text);
    assert.ok(Number.isInteger(q.correct_answer) && q.correct_answer >= 0 && q.correct_answer < 4);
    assert.ok(q.explanation.trim());
    if (['READING_COMP', 'LISTENING_COMP'].includes(q.question_type)) assert.ok(q.passage?.trim());
  }
  // Answer positions are balanced, so guessing one letter cannot pass.
  const positions = [0, 0, 0, 0];
  for (const q of p.test_questions) positions[q.correct_answer]++;
  assert.ok(Math.max(...positions) - Math.min(...positions) <= 4);
  // Generated vocabulary questions never repeat a word across tests of the same level.
  for (const level of ['N4', 'N3']) {
    const ids = new Set(
      p.test_sections
        .filter(
          s => s.section_type === 'VOCABULARY' && p.test_templates.find(t => t.id === s.template_id).level === level,
        )
        .map(s => s.id),
    );
    const words = p.test_questions.filter(q => ids.has(q.section_id)).map(q => JSON.parse(q.options)[q.correct_answer]);
    assert.equal(new Set(words).size, words.length);
  }
  assert.doesNotMatch(JSON.stringify(mocks), /…(ではなく|じゃなくて|いいえ|ではない|いや)/);

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
    for (const [table, rows] of Object.entries(p))
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
      { Assessments } = await load('assessments');
    const key = 'local-only-mock-test-key-for-tests-123456',
      content = new Content(db, key);
    // Unpublished tests stay hidden and cannot be started.
    assert.deepEqual(await content.templates(new URLSearchParams({ level: 'N4' })), []);
    await db
      .prepare(
        "INSERT INTO users(id,email,username,password_hash) VALUES (1,'mock@test.invalid','mock','!external-only')",
      )
      .run();
    const assess = new Assessments(db, 1, key);
    await assert.rejects(assess.startTest({ templateId: firstId }), { status: 404 });
    await db.prepare(`UPDATE test_templates SET is_published=1 WHERE id BETWEEN ${firstId} AND ${lastId}`).run();
    assert.equal((await content.templates(new URLSearchParams({ level: 'N4' }))).length, 3);
    assert.equal((await content.templates(new URLSearchParams({ level: 'N3' }))).length, 3);
    for (const t of p.test_templates) {
      const full = await content.templates(new URLSearchParams(), t.id);
      const questions = full.sections.flatMap(s => s.questions);
      assert.equal(questions.length, t.total_questions);
      // Public test content never carries answers or explanations.
      assert.ok(questions.every(q => !('correctAnswer' in q) && !('explanation' in q)));
      const attempt = await assess.startTest({ templateId: t.id, requestId: crypto.randomUUID() });
      assert.equal('questionSnapshot' in attempt, false);
      const rows = p.test_questions.filter(q => questions.some(x => x.id === q.id));
      // Answer all but one question correctly; the skipped one is reported as unanswered.
      const answers = rows.slice(1).map(q => ({ questionId: q.id, selectedAnswer: q.correct_answer }));
      const result = await assess.submitTest(attempt.id, { answers });
      assert.equal(result.totalScore, rows.length - 1);
      assert.equal(result.maxScore, rows.length);
      assert.equal(result.results.length, rows.length);
      const skipped = result.results.find(r => r.questionId === rows[0].id);
      assert.equal(skipped.selected, null);
      assert.equal(skipped.isCorrect, false);
      assert.equal(skipped.correctAnswer, rows[0].correct_answer);
      assert.ok(result.results.every(r => r.explanation));
      assert.deepEqual(await assess.submitTest(attempt.id, { answers }), result);
    }
    assert.equal((await assess.tests()).filter(a => a.status === 'COMPLETED').length, 6);
  } finally {
    await proxy.dispose();
  }
});
