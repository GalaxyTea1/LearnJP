import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-15.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-15 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 15);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-15',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '住民の要望（',
    '「にこたえて」と「に応じて」',
    '地域の活性化を目的（',
    'この寺は、月曜日（',
    '「を除いて」と「以外」',
    '小学生以下（',
    '「に限り」と「に限って」',
    '先生が言った（',
    '祭りは、予定（',
    '「感動させるものがある」と「感動したことがある」',
    'この祭りは、名前（',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～にこたえて'), /に応じて/, 'にこたえて must contrast with に応じて');
  assert.match(explanation('～を～として'), /として \(N3\)/, 'を～として must contrast with として');
  assert.match(explanation('～を除いて'), /以外/, 'を除いて must contrast with 以外');
  assert.match(explanation('～に限り'), /に限って/, 'に限り must contrast with に限って');
  assert.match(explanation('～とおり（に）'), /どおり/, 'とおり must cover どおり');
  assert.match(explanation('～ものがある'), /ことがある/, 'ものがある must contrast with ことがある');
  assert.match(explanation('～からして'), /から見ると/, 'からして must contrast with から見ると');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
