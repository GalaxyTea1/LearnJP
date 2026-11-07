import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildUnit, moduleId } from './unit-14.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-14 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 14);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-14', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '天気予報（　）',
    '新聞（　）、犯人',
    '来月から電車の料金',
    'Chọn câu đúng về ということだ',
    '少し遅れる（　）',
    'けが人はいない',
    '明日来られないん',
    '今夜（　）明日の朝',
    'Câu nào dùng から～にかけて',
    'インターネット（　）',
    '一年（　）暖かい',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.doesNotMatch(
    await readFile(new URL('../../../content/n3/n3-14.mjs', import.meta.url), 'utf8'),
    /…(ではなく|じゃなくて|いいえ|ではない|いや)|。だから…/,
  );
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～ということだ').explanation.includes('らしい'),
    'ということだ must contrast with そうだ and らしい',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
