import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildUnit, moduleId } from './unit-07.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-07 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 7);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-07', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '今から家を',
    'ついさっき雨が',
    'Câu nào dùng ĐÚNG',
    '出かける（　）',
    '雨が（　）うちに',
    'Chọn câu tự nhiên nhất',
    'シャワーを浴びている',
    '外に（　）とたん',
    'dùng SAI たとたん',
    '咳はひどくなる',
    '夏の気温は上がる',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.doesNotMatch(
    await readFile(new URL('../../../content/n3/n3-07.mjs', import.meta.url), 'utf8'),
    /…(ではなく|じゃなくて|いいえ)/,
  );
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～うちに').explanation.includes('間に'),
    'うちに must contrast with 間に',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
