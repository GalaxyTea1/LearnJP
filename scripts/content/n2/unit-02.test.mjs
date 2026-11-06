import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-02.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-02 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 2);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-02',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '不規則になり',
    '冬はいつも風邪をひく',
    '疲れ（',
    '減少する（',
    '定着し（',
    '「つつある」',
    '言い（',
    '使い（',
    '食べ（',
    '走り（',
    '「きる」と「ぬく」',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～がちだ'), /気味/, 'がち must contrast with 気味');
  assert.match(explanation('～つつある'), /ている/, 'つつある must contrast with ている');
  assert.match(explanation('～ぬく'), /きる/, 'ぬく must contrast with きる');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
