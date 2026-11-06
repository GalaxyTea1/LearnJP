import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-03.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-03 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 3);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-03',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '契約書（',
    '「実話（',
    'お客様の声（',
    'マニュアル（',
    'ご予算（',
    '「に応じて」と「によって」',
    '若い女性（',
    '契約の内容（',
    '「をめぐって」の使い方',
    '交渉（',
    '九州から四国',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～に基づいて'), /をもとに/, 'に基づいて must contrast with をもとに');
  assert.match(explanation('～に応じて'), /によって/, 'に応じて must contrast with によって');
  assert.match(explanation('～をめぐって'), /について/, 'をめぐって must contrast with について');
  assert.match(explanation('～にかけては'), /から～にかけて/, 'にかけては must contrast with から～にかけて');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
