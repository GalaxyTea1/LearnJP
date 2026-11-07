import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildUnit, moduleId } from './unit-11.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-11 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 11);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-11', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '年を取る（　）',
    '係員の案内',
    '医療が進む',
    '大学の卒業',
    'につれて／にしたがって／とともに',
    '収入が増えれば',
    '驚く（　）',
    '健康（　）',
    '実家に帰る',
    '値上げ（　）',
    'ĐÚNG たびに',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.doesNotMatch(
    await readFile(new URL('../../../content/n3/n3-11.mjs', import.meta.url), 'utf8'),
    /…(ではなく|じゃなくて|いいえ|ではない|いや)|。だから…/,
  );
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～とともに').explanation.includes('につれて'),
    'とともに must contrast with につれて and にしたがって',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
