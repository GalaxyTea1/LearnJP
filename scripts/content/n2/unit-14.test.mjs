import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-14.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-14 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 14);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-14',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '感謝の気持ち（',
    '「をこめて」の使い方',
    '真面目な田中さんの（',
    '「ことだから」の使い方',
    'お忙しい（',
    '「ところを」と「ところに」',
    '子どもたちを見守ろう（',
    '「見守ろうではないか」と「見守りましょう」',
    'もう二度とあんな店には行く（',
    '見た目（',
    '彼女は周りの目（',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～をこめて'), /のために/, 'をこめて must contrast with のために');
  assert.match(explanation('～ことだから'), /だけあって/, 'ことだから must contrast with だけあって');
  assert.match(explanation('～ところを'), /ところに/, 'ところを must contrast with ところに');
  assert.match(explanation('～ようではないか'), /ましょう/, 'ようではないか must contrast with ましょう');
  assert.match(explanation('～まい'), /ないつもりだ/, 'まい must contrast with ないつもりだ');
  assert.match(explanation('～はともかく（として）'), /はもちろん/, 'はともかく must contrast with はもちろん');
  assert.match(explanation('～もかまわず'), /を問わず/, 'もかまわず must contrast with を問わず');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
