import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-06.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-06 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 6);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-06',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '起こり（',
    '「あり得ない」',
    'なり（　）。',
    'このままでは、感染が広がる（',
    '「恐れがある」の使い方',
    '検査をし（',
    '早く見つける（',
    '手術（',
    '「ずにすむ」の意味',
    '休んで（',
    '「てはいられない」と「ずにはいられない」',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～得る／～得ない'), /できる/, '得る must contrast with the potential form');
  assert.match(explanation('～かねない'), /恐れがある/, 'かねない must contrast with 恐れがある');
  assert.match(explanation('～ないことには'), /なければ/, 'ないことには must contrast with なければ');
  assert.match(explanation('～に越したことはない'), /ほうがいい/, 'に越したことはない must contrast with ほうがいい');
  assert.match(
    explanation('～てはいられない'),
    /ずにはいられない/,
    'てはいられない must contrast with ずにはいられない',
  );

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
