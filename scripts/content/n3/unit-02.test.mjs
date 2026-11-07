import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-02.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-02 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 2);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-02', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '「待つ」',
    '車を（　）',
    '“cho phép”',
    '来週の土曜日',
    '書かせられる',
    'một tiếng',
    '食べられた',
    '野菜を（　）',
    'không muốn em gái',
    'khiêm nhường',
    'dùng sai thể',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '使役受身：～させられる').explanation.includes('食べられた'),
    'Causative-passive must contrast with passive and causative',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
