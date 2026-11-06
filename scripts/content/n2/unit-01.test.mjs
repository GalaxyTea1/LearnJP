import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-01.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-01 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 1);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-01',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });

  // First lesson of the level: it brings the N2 level row with it.
  assert.equal(p.jlpt_levels.length, 1);
  assert.equal(p.jlpt_levels[0].id, 60001);

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '資料が届き',
    '準備が整い',
    'ドアを開けた',
    'からでなければ',
    '確認した',
    '相談の',
    '「際」',
    '発売',
    'に先立って」の使い方',
    '合併',
    '「きっかけ」と「契機」',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～次第（～たらすぐ）'), /たとたん/, '次第 must contrast with たとたん');
  assert.match(explanation('～た上で'), /てから/, 'た上で must contrast with てから');
  assert.match(explanation('～をきっかけに'), /契機/, 'きっかけ must contrast with 契機');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
