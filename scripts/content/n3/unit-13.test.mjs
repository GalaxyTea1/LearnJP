import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildUnit, moduleId } from './unit-13.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-13 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 13);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-13', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '地震が起きた',
    'Câu nào dùng 場合',
    'もし電気がなかった',
    'Chọn câu đúng về としたら',
    '天気（　）よければ',
    '人間が生活する',
    '一人一人が行動し',
    '（　）小さなことでも',
    'たとえ雨が',
    '今すぐ対策をし',
    'もう暗くなるから',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.doesNotMatch(
    await readFile(new URL('../../../content/n3/n3-13.mjs', import.meta.url), 'utf8'),
    /…(ではなく|じゃなくて|いいえ|ではない|いや)|。だから…/,
  );
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～としたら／～とすれば').explanation.includes('たら'),
    'としたら must contrast with たら and ば',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
