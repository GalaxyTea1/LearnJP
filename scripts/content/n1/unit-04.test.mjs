import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-04.mjs';
import { n1Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N1-04 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N1', 4);
  await checkCurriculum(p, { ...n1Checks, code: 'N1-04', earlier });
  assert.equal(p.jlpt_levels, undefined, 'only N1-01 carries the level row');
  assert.equal(p.kanji.length, 46);

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '国難',
    '首相（',
    '「ともなると」の使い方',
    '国の代表',
    '見る（',
    '五度目の挑戦',
    '今期（',
    '「を限りに」の意味',
    '全国（',
    'この交渉を任せられる',
    '「をおいて」の使い方',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～にあって'), /において/, 'にあって must contrast with において');
  assert.match(explanation('～ともなると'), /ともなれば/, 'ともなると must contrast with ともなれば');
  assert.match(explanation('～に先駆けて'), /に先立って/, 'に先駆けて must contrast with に先立って');

  await checkInDatabase(p, { level: 'N1', moduleId, earlier });
});
