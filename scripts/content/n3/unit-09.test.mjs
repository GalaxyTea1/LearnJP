import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildUnit, moduleId } from './unit-09.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-09 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 9);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-09', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '給与（　）',
    '求人広告（　）',
    'お客様（　）',
    '給与が高い（　）',
    'アルバイト（　）',
    '留学生（　）',
    'ĐÚNG にとって',
    'Câu nào SAI',
    '社長（　）',
    '大会議室（　）',
    '外国人の雇用',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.doesNotMatch(
    await readFile(new URL('../../../content/n3/n3-09.mjs', import.meta.url), 'utf8'),
    /…(ではなく|じゃなくて|いいえ|ではない)|。だから…/,
  );
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～にとって').explanation.includes('に対して'),
    'にとって must contrast with に対して',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
