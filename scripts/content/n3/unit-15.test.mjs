import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildUnit, moduleId } from './unit-15.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-15 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 15);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-15', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '免許は取った',
    'Chọn câu đúng về ものの',
    'この店は狭い',
    '自分では何もしない',
    'Câu nào dùng くせに',
    '雨（　）、試合',
    'お金がある（　）',
    '安い（　）、たくさん',
    '富士山がよく見える',
    '彼は英語（　）',
    'この問題は若者',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.doesNotMatch(
    await readFile(new URL('../../../content/n3/n3-15.mjs', import.meta.url), 'utf8'),
    /…(ではなく|じゃなくて|いいえ|ではない|いや)|。だから…/,
  );
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～ものの').explanation.includes('くせに'),
    'ものの must contrast with のに and くせに',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
