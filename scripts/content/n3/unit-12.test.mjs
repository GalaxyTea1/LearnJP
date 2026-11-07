import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildUnit, moduleId } from './unit-12.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-12 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 12);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-12', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    'ネット通販は便利な',
    '都市では人口が増える',
    '機能が多い（　）',
    'Câu nào SAI',
    '前の機種（　）',
    '社長（　）',
    '現金（　）',
    '電話する（　）',
    'に代わって và かわりに',
    '安い（　）、カメラ',
    '機械に任せるより',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.doesNotMatch(
    await readFile(new URL('../../../content/n3/n3-12.mjs', import.meta.url), 'utf8'),
    /…(ではなく|じゃなくて|いいえ|ではない|いや)|。だから…/,
  );
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～反面').explanation.includes('一方で'),
    '反面 must contrast with 一方で',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
