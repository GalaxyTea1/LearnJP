import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-17.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-17 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 17);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-17',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    'その話は、ただの噂（',
    '「に過ぎない」と「だけだ」',
    '成功の理由は、彼の努力（',
    '「にほかならない」と「に過ぎない」',
    'この筆跡からして',
    '「に相違ない」と「に違いない」',
    '本当の友達（',
    '値段が高ければいい（',
    '「というものではない」と「わけではない」',
    '「解けっこない」と「解けるわけがない」',
    'どうしても理解し（',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～に過ぎない'), /だけだ/, 'に過ぎない must contrast with だけだ');
  assert.match(explanation('～にほかならない'), /に過ぎない/, 'にほかならない must contrast with に過ぎない');
  assert.match(explanation('～に相違ない'), /に違いない/, 'に相違ない must contrast with に違いない');
  assert.match(explanation('～というものだ'), /ものだ \(N3\)/, 'というものだ must contrast with ものだ');
  assert.match(
    explanation('～というものではない'),
    /わけではない/,
    'というものではない must contrast with わけではない',
  );
  assert.match(explanation('～っこない'), /わけがない/, 'っこない must contrast with わけがない');
  assert.match(explanation('～がたい'), /にくい/, 'がたい must contrast with にくい');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
