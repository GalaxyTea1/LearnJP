import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-07.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-07 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 7);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-07',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '合格の知らせを聞いて、うれしく（',
    '「田中さんは寂しくてたまらない」',
    '眠くて（',
    '将来のことが不安で（',
    '「てならない」と「てたまらない」',
    'その話を聞いて、泣か（',
    '心配で、電話し（',
    'ことに、彼は会社を辞めて',
    '「ことに」の使い方',
    '二度と行く（',
    '「ものか」と「ものだ」',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～てたまらない'), /てしょうがない/, 'てたまらない must contrast with てしょうがない');
  assert.match(explanation('～てならない'), /てたまらない/, 'てならない must contrast with てたまらない');
  assert.match(
    explanation('～ずにはいられない'),
    /てはいられない/,
    'ずにはいられない must contrast with てはいられない',
  );
  assert.match(explanation('～ことに（感情）'), /ことだ/, 'ことに must contrast with ことだ');
  assert.match(explanation('～ものか'), /ものだ/, 'ものか must contrast with ものだ');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
