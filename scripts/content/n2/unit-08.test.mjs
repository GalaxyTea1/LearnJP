import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-08.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-08 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 8);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-08',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '名門校（',
    '十年も日本に住んでいる（',
    'さすが元教師（',
    '期待していた（',
    '「だけに」と「だけあって」',
    '彼は宿題をしない（',
    '知らせ（',
    '先生に聞く（',
    '基礎は何より大切だ',
    '心配する（',
    '「できないことはない」',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～だけあって'), /だけに/, 'だけあって must contrast with だけに');
  assert.match(explanation('～ばかりか'), /ばかりでなく/, 'ばかりか must contrast with ばかりでなく');
  assert.match(explanation('～ようがない'), /ことができない/, 'ようがない must contrast with ことができない');
  assert.match(explanation('～までもない'), /ことはない/, 'までもない must contrast with ことはない');
  assert.match(explanation('～ことはない'), /ないことはない/, 'ことはない must contrast with ないことはない');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
