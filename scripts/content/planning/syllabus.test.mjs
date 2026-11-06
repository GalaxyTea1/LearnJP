import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { joyoKanji, taughtKanji, taughtGrammar, normalizeGrammar } from './course-kanji.mjs';
import * as n2 from '../../../content/n2/syllabus.mjs';
import * as n1 from '../../../content/n1/syllabus.mjs';

const plan = async level =>
  JSON.parse(await readFile(new URL(`../../../content/${level}/kanji-plan.json`, import.meta.url), 'utf8'));
const levels = [
  { name: 'n2', syllabus: n2, lessons: 20, grammarPerLesson: 7, firstId: 60001 },
  { name: 'n1', syllabus: n1, lessons: 24, grammarPerLesson: 8, firstId: 80001 },
];

test('each level has its lessons in order, a fixed grammar load and a final review', () => {
  for (const { name, syllabus, lessons, grammarPerLesson } of levels) {
    assert.equal(syllabus.units.length, lessons, name);
    syllabus.units.forEach((unit, i) => {
      assert.equal(unit.code, `${syllabus.level}-${String(i + 1).padStart(2, '0')}`);
      assert.ok(unit.title && unit.titleJp && unit.topics.length === 3, unit.code);
      assert.equal(unit.grammar.length, i === lessons - 1 ? 0 : grammarPerLesson, unit.code);
    });
  }
});

test('ID ranges for N2 and N1 do not overlap existing content or the mock tests (50001–50999)', () => {
  for (const { syllabus, lessons, firstId } of levels) {
    assert.equal(syllabus.levelId, firstId);
    const last = firstId + lessons * 1000 - 1;
    assert.ok(firstId > 50999 && (syllabus.level === 'N1' || last < 80001), `${syllabus.level} ends at ${last}`);
  }
});

test('no grammar point is taught twice, within N2/N1 or after N5–N3', async () => {
  const taught = await taughtGrammar();
  const seen = new Map();
  for (const { syllabus } of levels)
    for (const unit of syllabus.units)
      for (const pattern of unit.grammar) {
        const key = normalizeGrammar(pattern);
        assert.ok(!taught.has(key), `${unit.code} ${pattern} was taught in N5–N3`);
        assert.ok(!seen.has(key), `${unit.code} ${pattern} repeats ${seen.get(key)}`);
        seen.set(key, unit.code);
      }
});

test('kanji plans cover every joyo kanji not yet taught, once, at the planned pace', async () => {
  const taught = await taughtKanji();
  const remaining = (await joyoKanji()).map(k => k.char).filter(c => !taught.has(c));
  assert.equal(remaining.length, 1486);
  const all = [];
  for (const { name, syllabus } of levels) {
    const lessons = await plan(name);
    assert.deepEqual(
      Object.keys(lessons),
      syllabus.units.map(u => u.code),
    );
    const counts = Object.values(lessons).map(s => [...s].length);
    assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `${name} lessons are uneven: ${counts}`);
    for (const chars of Object.values(lessons)) all.push(...chars);
  }
  assert.equal(new Set(all).size, all.length, 'a kanji is planned twice');
  assert.deepEqual([...all].sort(), [...remaining].sort());
});
