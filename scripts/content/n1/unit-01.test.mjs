import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-01.mjs';
import { n1Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N1-01 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N1', 1);
  await checkCurriculum(p, { ...n1Checks, code: 'N1-01', earlier });

  // First lesson of the level: it brings the N1 level row with it.
  assert.equal(p.jlpt_levels.length, 1);
  assert.equal(p.jlpt_levels[0].id, 80001);
  assert.equal(p.kanji.length, 46);

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    'ベルが鳴る',
    '首相の発言',
    'や否や」の読み方',
    '片付ける',
    '彼は記事を読む',
    '東京公演',
    '退職',
    '今回の事故',
    'スマホを持って',
    '調査結果',
    '「に基づいて」の違い',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～が早いか'), /や否や/, 'が早いか must contrast with や否や');
  assert.match(explanation('～そばから'), /たとたん/, 'そばから must contrast with たとたん');
  assert.match(explanation('～を機に'), /きっかけ/, 'を機に must contrast with をきっかけに');
  assert.match(explanation('～をふまえて'), /に基づいて/, 'をふまえて must contrast with に基づいて');

  await checkInDatabase(p, { level: 'N1', moduleId, earlier });
});
