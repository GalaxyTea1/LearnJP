import test from 'node:test';
import { buildUnit, moduleId } from './unit-01.mjs';
import { n4Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N4-01 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N4', 1);
  await checkCurriculum(p, { ...n4Checks, code: 'N4-01', earlier });

  await checkInDatabase(p, { level: 'N4', moduleId, earlier });
});
