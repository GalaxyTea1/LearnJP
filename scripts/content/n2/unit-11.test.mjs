import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-11.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-11 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 11);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-11',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    'この城は十六世紀に建てられた（',
    '「とされる」と「と言われている」',
    '火事の原因は、たばこの火（',
    '停電は、強い風による（',
    '「ものと思われる」と「と思う」',
    '来月、駅前に大きな本屋ができる（',
    'そんなうまい話、うそ（',
    '「に決まっている」と「に違いない」',
    '「雨が降るようだ」と「雨が降ったかのようだ」',
    'こんな簡単なミスをする（',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～とされる'), /と言われている/, 'とされる must contrast with と言われている');
  assert.match(explanation('～とみられる'), /とされる/, 'とみられる must contrast with とされる');
  assert.match(explanation('～ものと思われる'), /と思う/, 'ものと思われる must contrast with と思う');
  assert.match(explanation('～とか'), /そうだ/, 'とか must contrast with hearsay そうだ');
  assert.match(explanation('～に決まっている'), /に違いない/, 'に決まっている must contrast with に違いない');
  assert.match(explanation('～かのようだ／～かのように'), /ようだ \(N4\)/, 'かのようだ must contrast with ようだ');
  assert.match(explanation('～ようでは'), /ては/, 'ようでは must contrast with ては');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
