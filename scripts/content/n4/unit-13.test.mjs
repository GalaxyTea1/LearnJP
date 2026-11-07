import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-13.mjs';
import { n4Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N4-13 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N4', 13);
  await checkCurriculum(p, { ...n4Checks, code: 'N4-13', earlier, readingLength: [200, 400] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of ['とき', 'ながら', '勉強したのに', '覚えるのに', '夏休みの', '休み時間の'])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);

  await checkInDatabase(p, { level: 'N4', moduleId, earlier });
});
