import test from 'node:test';
import assert from 'node:assert/strict';
import * as content from '../../../content/n1/n1-10.mjs';
import { buildUnit, moduleId } from './unit-10.mjs';
import { n1Checks, n1Format } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N1-10 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N1', 10);
  await checkCurriculum(p, { ...n1Checks, code: 'N1-10', earlier });
  assert.equal(p.jlpt_levels, undefined, 'only N1-01 carries the level row');
  assert.equal(p.kanji.length, 45);

  // The quiz takes two questions per grammar point in order, so it covers all eight points.
  const quiz = p.quiz_questions.map(q => q.question).join(' | ');
  for (const i of n1Format.quiz.grammar)
    assert.ok(quiz.includes(content.grammarQuestions[i][0]), `Quiz must assess grammar question ${i}`);
  assert.deepEqual([...new Set(n1Format.quiz.grammar.map(i => Math.floor(i / 2)))], [0, 1, 2, 3, 4, 5, 6, 7]);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～きらいがある'), /がちだ/, '～きらいがある must contrast with がちだ');
  assert.match(explanation('～たら最後'), /が最後/, '～たら最後 must contrast with が最後');
  assert.match(explanation('～まみれ'), /だらけ/, '～まみれ must contrast with だらけ');

  await checkInDatabase(p, { level: 'N1', moduleId, earlier });
});
