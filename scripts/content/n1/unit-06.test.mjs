import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-06.mjs';
import { n1Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N1-06 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N1', 6);
  await checkCurriculum(p, { ...n1Checks, code: 'N1-06', earlier });
  assert.equal(p.jlpt_levels, undefined, 'only N1-01 carries the level row');
  assert.equal(p.kanji.length, 46);

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    'その技術は医療',
    '宇宙旅行',
    '「はおろか」の後に',
    '研究の内容',
    '気候変動は',
    'あとは（',
    '技術の進歩',
    '「円安と原料高が相まって」',
    '十年に及ぶ研究',
    '重さ五十トン',
    '値段の大きさ',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～はおろか'), /どころか/, 'はおろか must contrast with どころか');
  assert.match(explanation('～と相まって'), /とともに/, 'と相まって must contrast with とともに');
  assert.match(explanation('～からある'), /からする/, 'からある must contrast with からする');

  await checkInDatabase(p, { level: 'N1', moduleId, earlier });
});
