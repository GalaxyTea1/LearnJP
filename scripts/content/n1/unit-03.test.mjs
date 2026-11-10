import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-03.mjs';
import { n1Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N1-03 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N1', 3);
  await checkCurriculum(p, { ...n1Checks, code: 'N1-03', earlier });
  assert.equal(p.jlpt_levels, undefined, 'only N1-01 carries the level row');
  assert.equal(p.kanji.length, 46);

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '来期の業績',
    '理由の',
    '「結果のいかんにかかわらず」',
    '計画はよいのだが',
    '考え（',
    '返済（',
    '委員会は',
    '「からなる」の使い方',
    '存続',
    '海外移転',
    '値上げを',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～いかんで／～いかんによって'), /次第で/, 'いかんで must contrast with 次第で');
  assert.match(explanation('～を前提に'), /踏まえて/, 'を前提に must contrast with をふまえて');
  assert.match(
    explanation('～を余儀なくされる／～を余儀なくさせる'),
    /ざるを得ない/,
    '余儀なく must contrast with ざるを得ない',
  );

  await checkInDatabase(p, { level: 'N1', moduleId, earlier });
});
