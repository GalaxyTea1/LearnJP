import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-04.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-04 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 4);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-04', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '今にも雨が',
    '機嫌が（　）',
    'Nghe nói ngày mai',
    '玄関に靴がない',
    'まるで本物の花',
    '誰か（　）',
    '暖かくて',
    'Câu nào mang ý CHÊ',
    '六十歳だが',
    '一見怖',
    'Đường ướt',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
