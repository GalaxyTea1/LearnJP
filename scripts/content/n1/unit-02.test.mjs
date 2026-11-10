import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-02.mjs';
import { n1Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N1-02 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N1', 2);
  await checkCurriculum(p, { ...n1Checks, code: 'N1-02', earlier });
  assert.equal(p.jlpt_levels, undefined, 'only N1-01 carries the level row');
  assert.equal(p.kanji.length, 46);

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    'お客様',
    '子どもの将来',
    '「からこそ」の違い',
    '努力',
    '他者と関わる',
    'この町',
    '我思う',
    '真面目である',
    '教師',
    '大臣',
    '「ともあろう」の違い',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～ばこそ'), /からこそ/, 'ばこそ must contrast with からこそ');
  assert.match(explanation('～なくして（は）'), /ことなしに/, 'なくして must contrast with ことなしに');
  assert.match(explanation('～たる'), /ともあろう/, 'たる must contrast with ともあろう');

  await checkInDatabase(p, { level: 'N1', moduleId, earlier });
});
