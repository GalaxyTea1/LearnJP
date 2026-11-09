import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-12.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-12 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 12);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-12',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '景気が回復した（',
    '「とはいえ」と「といっても」',
    '問題だと知り（',
    '「つつも」と「つつある」',
    '給料が安い（',
    '「わりに」と「にしては」',
    '生活は楽になる（',
    '「どころか」と「ばかりか」',
    '親の介護で、旅行（',
    'できる（　）、仕事を辞めて',
    '我慢して働き続ける（',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～とはいえ'), /といっても/, 'とはいえ must contrast with といっても');
  assert.match(explanation('～つつ（も）'), /つつある/, 'つつも must be told apart from つつある');
  assert.match(explanation('～わりに（は）'), /にしては/, 'わりに must contrast with にしては');
  assert.match(explanation('～どころか'), /ばかりか/, 'どころか must contrast with ばかりか');
  assert.match(explanation('～どころではない'), /どころか/, 'どころではない must be told apart from どころか');
  assert.match(explanation('～ものなら'), /意向形/, 'ものなら must cover the volitional form');
  assert.match(explanation('～くらいなら'), /ほうがいい/, 'くらいなら must contrast with より～ほうがいい');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
