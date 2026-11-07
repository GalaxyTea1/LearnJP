import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-05.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-05 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 5);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-05', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '日本語が上手な',
    'Không phải tôi phản đối',
    'ペラペラ',
    '鍵をかけた',
    'そんな（　）',
    '月曜日が休み',
    'わけがない và はずがない',
    '誰かいる',
    '必ずしもおいしい',
    'phản biện một khái quát',
    '暖かい（　）',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～はずがない').explanation.includes('わけがない'),
    'はずがない must contrast with わけがない',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
