import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-03.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-03 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 3);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-03', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '帰る・tôn kính',
    '推薦状を書いて',
    '出発される',
    '「明日は休みです」',
    'この写真を',
    'お荷物を',
    'ĐÚNG khiêm nhường',
    '少々（　）',
    'ベトナムから',
    '席を外して',
    'こちらに氏名を',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === 'お／ご～する・いたす（謙譲語）').explanation.includes('お待ちになる'),
    'Humble pattern must contrast with respectful forms',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
