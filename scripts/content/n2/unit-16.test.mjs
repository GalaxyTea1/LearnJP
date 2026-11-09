import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-16.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-16 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 16);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-16',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    'さんざん迷った（',
    '「あげく」と「末に」',
    '三日間の捜索の（',
    '駅に問い合わせた（',
    '「問い合わせたところ」と「問い合わせたところだ」',
    '試しに使ってみた（',
    '危うく車にひかれる（',
    '「乗り遅れるところだった」と「泣きそうになった」',
    '結局京都には行か（',
    '彼は朝出かけた（',
    '彼は一度も休む（',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～あげく'), /末（に）/, 'あげく must contrast with 末に');
  assert.match(explanation('～末（に）'), /結果/, '末に must contrast with 結果');
  assert.match(explanation('～たところ'), /たところだ/, 'たところ must be told apart from たところだ');
  assert.match(explanation('～ところだった'), /そうになった/, 'ところだった must contrast with そうになった');
  assert.match(explanation('～ずじまい'), /ないまま/, 'ずじまい must contrast with ないまま');
  assert.match(explanation('～きり'), /たまま/, 'きり must contrast with たまま');
  assert.match(explanation('～ことなく'), /ないで／～ずに/, 'ことなく must contrast with ないで／ずに');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
