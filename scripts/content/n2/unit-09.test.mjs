import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-09.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-09 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 9);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-09',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '物価の上昇（',
    '店舗の移転（',
    '使い方（',
    '店（　）、同じ商品',
    '「によって」と「によっては」',
    '消費者の立場（',
    '外国人（',
    '法律（',
    '「上（じょう）」の使い方',
    '高級ホテル（',
    '「にしては」と「わりに」',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～に伴って／～に伴い'), /につれて/, 'に伴って must contrast with につれて');
  assert.match(explanation('～次第で'), /によって/, '次第で must contrast with によって');
  assert.match(explanation('～からすると／～からすれば'), /にとって/, 'からすると must contrast with にとって');
  assert.match(explanation('～上（じょう）'), /の上で/, '上 must contrast with の上で');
  assert.match(explanation('～にしては'), /わりに/, 'にしては must contrast with わりに');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
