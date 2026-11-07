import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-05.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-05 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 5);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-05',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '大事な実験の日（',
    '「うちの子に限って',
    'この調査は若者（',
    'この発見は国内（',
    'この本は、専門家（',
    '「はもとより」と「はもちろん」',
    '調査費（',
    '年齢（',
    '「を問わず」の使い方',
    '天候（',
    '「雨（',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～に限って'), /に限り/, 'に限って must contrast with に限り');
  assert.match(explanation('～に限らず'), /だけでなく/, 'に限らず must contrast with だけでなく');
  assert.match(explanation('～はもとより'), /はもちろん/, 'はもとより must contrast with はもちろん');
  assert.match(explanation('～を問わず'), /にかかわらず/, 'を問わず must contrast with にかかわらず');
  assert.match(explanation('～にかかわらず'), /にもかかわらず/, 'にかかわらず must contrast with にもかかわらず');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
