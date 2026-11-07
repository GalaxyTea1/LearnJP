import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-10.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-10 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 10);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-10',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '予想（　）、反対意見',
    '「規則（',
    '冗談（',
    '賛成（　）反対（',
    '「にしても」と「にせよ」',
    'たとえ反対された（',
    '反対（　）、全部に反対',
    '引き受けた（',
    '「からには」の後に続く文',
    '約束した（',
    '「以上（は）」と「からには」',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～に反して'), /と違って/, 'に反して must contrast with と違って');
  assert.match(explanation('～にしても'), /としても/, 'にしても must contrast with としても');
  assert.match(explanation('～としても'), /ても/, 'としても must contrast with ても');
  assert.match(explanation('～からには'), /以上/, 'からには must contrast with 以上');
  assert.match(explanation('～以上（は）'), /からには/, '以上 must contrast with からには');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
