import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildUnit, moduleId } from './unit-06.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-06 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 6);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-06', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '大雪（　）',
    'dùng ため (nguyên nhân) ĐÚNG',
    '先生（　）',
    '雨（　）',
    'おかげで và せいで',
    '年の（　）',
    '失敗した（　）',
    '台風（　）',
    '電車が止まってしまった',
    '毎日練習した',
    '調査（　）',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.doesNotMatch(
    await readFile(new URL('../../../content/n3/n3-06.mjs', import.meta.url), 'utf8'),
    /…(ではなく|じゃなくて|いいえ)/,
  );
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～せいで／～せいか').explanation.includes('おかげで'),
    'せいで must contrast with おかげで',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
