import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-05.mjs';
import { n1Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N1-05 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N1', 5);
  await checkCurriculum(p, { ...n1Checks, code: 'N1-05', earlier });
  assert.equal(p.jlpt_levels, undefined, 'only N1-01 carries the level row');
  assert.equal(p.kanji.length, 46);

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '芝生に入る',
    '検察官にある',
    '「まじき」の使い方',
    '法（',
    '過去の判例',
    '実態（',
    '一年ごとに更新する',
    '十分な補償',
    '公言して',
    '「てはばからない」と一緒に',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～まじき'), /ともあろう/, 'まじき must contrast with ともあろう');
  assert.match(explanation('～に即して'), /に則って/, 'に即して must contrast with に則って');
  assert.match(explanation('～ものとする'), /こと/, 'ものとする must contrast with こと');

  await checkInDatabase(p, { level: 'N1', moduleId, earlier });
});
