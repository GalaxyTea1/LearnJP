import test from 'node:test';
import { buildUnit, moduleId } from './unit-07.mjs';
import { n4Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N4-07 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N4', 7);
  await checkCurriculum(p, { ...n4Checks, code: 'N4-07', earlier });

  await checkInDatabase(p, { level: 'N4', moduleId, earlier });
});
