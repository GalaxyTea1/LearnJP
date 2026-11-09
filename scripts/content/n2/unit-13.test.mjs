import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-13.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-13 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 13);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-13',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '新製品の発売（',
    '「に向けて」と「に対して」',
    '高齢者（　）に作られていて',
    '「向き」と「向け」',
    '十年（　）新しい電池',
    '「にわたって」と「から～にかけて」',
    'パスワードを簡単にした（',
    '「ばかりに」と「せいで」',
    '生産を止める（',
    'もっと簡単に操作でき（',
    'スマホを使い始めて（',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～に向けて'), /に対して/, 'に向けて must contrast with に対して');
  assert.match(explanation('～向き／～向け'), /向けの/, '向き must be told apart from 向け');
  assert.match(explanation('～にわたって'), /にかけて/, 'にわたって must contrast with にかけて');
  assert.match(explanation('～ばかりに'), /せいで/, 'ばかりに must contrast with せいで');
  assert.match(explanation('～ほかない'), /しかない/, 'ほかない must contrast with しかない');
  assert.match(explanation('～ないものか'), /ものか \(N2-07\)/, 'ないものか must be told apart from ものか');
  assert.match(explanation('～て以来'), /てから/, 'て以来 must contrast with てから');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
