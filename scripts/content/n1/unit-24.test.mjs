import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildUnit, moduleId } from './unit-24.mjs';
import { earlierLessons, checkInDatabase } from '../lib/unit-checks.mjs';
import { readings, listenings, reviewLedger } from '../../../content/n1/n1-24.mjs';

test('N1-24 cumulative review, publication, assessment and learner isolation', { timeout: 240000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N1', 24);
  const n5 = JSON.parse(await readFile(new URL('../../../content/n5/review/candidate.json', import.meta.url), 'utf8'));
  const knownKanji = new Set([...n5.kanji, ...earlier.flatMap(x => x.kanji)].map(x => x.character));
  const plan = JSON.parse(await readFile(new URL('../../../content/n1/kanji-plan.json', import.meta.url), 'utf8'));

  // Review ledger: vocabulary repeats earlier N1 rows unchanged, seven or six from each lesson.
  const n1 = earlier.slice(-23);
  assert.equal(new Set(p.vocabulary.map(x => x.japanese)).size, 150);
  assert.equal(reviewLedger.length, 150);
  assert.equal(new Set(reviewLedger.map(x => x.introducedIn)).size, 23);
  for (const entry of reviewLedger) {
    const source = n1[Number(entry.introducedIn.slice(3)) - 1];
    const row = source.vocabulary.find(v => v.japanese === entry.japanese);
    assert.ok(row, `${entry.japanese} is not in ${entry.introducedIn}`);
    const review = p.vocabulary.find(v => v.japanese === entry.japanese);
    for (const field of ['hiragana', 'romaji', 'english', 'example_jp', 'example_en'])
      assert.equal(review[field], row[field], `${entry.japanese} ${field}`);
  }

  // Kanji are new and exactly as planned.
  for (const k of p.kanji) assert.ok(!knownKanji.has(k.character), `Already introduced kanji: ${k.character}`);
  assert.equal(p.kanji.map(k => k.character).join(''), plan['N1-24']);

  // Eight review groups that name their source lessons and together cover every N1 lesson;
  // one quiz question from every N1 lesson.
  assert.equal(p.grammar_patterns.length, 8);
  assert.ok(p.grammar_examples.length >= 24);
  assert.ok(
    p.grammar_patterns.every(g => g.meaning.startsWith('N1-')),
    'Each review group names its source lessons',
  );
  const covered = new Set(p.grammar_patterns.flatMap(g => g.meaning.split(':')[0].match(/\d\d/g)));
  for (let u = 1; u <= 23; u++) assert.ok(covered.has(String(u).padStart(2, '0')), `Lesson ${u} is in no review group`);
  assert.equal(p.lesson_sections.length, 10);
  assert.ok(p.lesson_sections.every(s => s.instructions?.trim()));
  assert.equal(p.lesson_exercises.length, 55);
  assert.equal(p.quiz_questions.length, 25);
  assert.equal(p.listening_content.length, 3);
  assert.equal(p.reading_passages.length, 2);
  assert.equal(p.writing_tasks.length, 2);
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (let u = 1; u <= 23; u++)
    assert.ok(quiz.includes(`N1-${String(u).padStart(2, '0')}:`), `Missing lesson ${u} in the cumulative quiz`);
  for (const q of [...p.quiz_questions, ...p.lesson_exercises]) {
    const options = JSON.parse(q.options);
    assert.equal(options.length, 4);
    assert.equal(new Set(options).size, 4, `Repeated option in: ${q.question ?? q.prompt}`);
    const answer = q.correct_index ?? JSON.parse(q.correct_answer);
    assert.ok(Number.isInteger(answer) && answer >= 0 && answer < 4);
    assert.ok(q.explanation.trim());
  }
  const positions = [0, 0, 0, 0];
  for (const q of p.quiz_questions) positions[q.correct_index]++;
  assert.ok(Math.max(...positions) <= 10, `quiz answers bunch up: ${positions}`);
  for (const w of p.writing_tasks)
    assert.ok(
      w.sample_answer.length >= w.min_length && w.sample_answer.length <= w.max_length,
      `Writing sample length ${w.sample_answer.length}`,
    );
  for (const [, text] of readings)
    assert.ok(text.length >= 900 && text.length <= 1500, `Reading length ${text.length}`);
  assert.ok(Math.max(...listenings.map(l => l[1].length)) >= 750, 'One listening must be long (about 3 minutes)');

  await checkInDatabase(p, { level: 'N1', moduleId, earlier });
});
