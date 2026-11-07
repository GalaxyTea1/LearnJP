import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-04.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-04 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 4);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-04',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '工事中（',
    '「本日は定休日につき」',
    '新年を迎える（',
    'ご利用（',
    '「にあたって」と「に際して」',
    '先生のご指導（',
    '本日（　）閉店',
    '書面（',
    '以上のような（',
    'お応えし（',
    '「かねる」と「かねない」',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～につき（理由）'), /ので/, 'につき must contrast with ので');
  assert.match(explanation('～にあたって／～にあたり'), /に際して/, 'にあたって must contrast with に際して');
  assert.match(explanation('～をもって'), /で/, 'をもって must contrast with で');
  assert.match(explanation('～次第だ（経緯）'), /ngay khi/, '次第だ must contrast with Vます + 次第');
  assert.match(explanation('～かねる'), /かねない/, 'かねる must contrast with かねない');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
