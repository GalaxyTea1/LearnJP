import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-19.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-19 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 19);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-19',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    'どんなにうれしかった（',
    '「どんなにうれしかったことか」と「毎日練習することだ」',
    '借金をして（',
    '「借金をしてでも」と「雨が降っても」',
    '登頂は中止（',
    '「ざるを得ない」と「ほかない」',
    'この写真を見る（',
    '「見るにつけ」と「見るたびに」',
    '今日は堅い話（',
    '天気もいい（',
    'プロの選手（',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～ことか'), /ことだ \(N3\)/, 'ことか must contrast with ことだ');
  assert.match(explanation('～てでも'), /ても \(N4\)/, 'てでも must contrast with ても');
  assert.match(explanation('～ざるを得ない'), /ほかない/, 'ざるを得ない must contrast with ほかない');
  assert.match(explanation('～につけ（て）'), /たびに/, 'につけ must contrast with たびに');
  assert.match(explanation('～ぬきで／～ぬきに'), /なしで/, 'ぬきで must contrast with なしで');
  assert.match(explanation('～ことだし'), /ことだから/, 'ことだし must contrast with ことだから');
  assert.match(explanation('～さえ／～でさえ'), /さえ～ば/, 'さえ must be told apart from さえ～ば');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
