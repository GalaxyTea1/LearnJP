// Splits the joyo kanji the course does not teach yet between the N2 and N1 lessons.
// Usage: node scripts/content/planning/assign-kanji.mjs   (writes content/n2|n1/kanji-plan.json)
//
// N2 takes every remaining kanji graded JLPT N2 or N3; N1 takes the rest. Within a level each
// kanji goes, most frequent first, to the lesson whose topic keywords match its meanings best;
// kanji that match no topic fill the earliest lessons that still have room, so common
// characters come first.
import { writeFile } from 'node:fs/promises';
import { joyoKanji, taughtKanji } from './course-kanji.mjs';

const taught = await taughtKanji();
const remaining = (await joyoKanji())
  .filter(k => !taught.has(k.char))
  .sort((a, b) => (a.freq ?? 1e9) - (b.freq ?? 1e9) || a.strokes - b.strokes);
const levels = {
  n2: remaining.filter(k => k.jlpt === 2 || k.jlpt === 3),
  n1: remaining.filter(k => !(k.jlpt === 2 || k.jlpt === 3)),
};

const words = k => k.meanings.join(' ').toLowerCase();
const score = (kanji, keywords) => keywords.filter(w => new RegExp(`\\b${w}`).test(words(kanji))).length;

const summary = {};
for (const [level, pool] of Object.entries(levels)) {
  const { units } = await import(`../../../content/${level}/syllabus.mjs`);
  // Spread the pool evenly; earlier lessons take the remainder.
  const base = Math.floor(pool.length / units.length),
    extra = pool.length % units.length;
  const lessons = units.map((u, i) => ({
    code: u.code,
    keywords: u.keywords,
    quota: base + (i < extra ? 1 : 0),
    kanji: [],
  }));
  const left = [];
  for (const kanji of pool) {
    const best = lessons
      .filter(l => l.kanji.length < l.quota)
      .map(l => ({ l, s: score(kanji, l.keywords) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)[0];
    if (best) best.l.kanji.push(kanji.char);
    else left.push(kanji.char);
  }
  for (const char of left) lessons.find(l => l.kanji.length < l.quota).kanji.push(char);
  const plan = Object.fromEntries(lessons.map(l => [l.code, l.kanji.join('')]));
  await writeFile(
    new URL(`../../../content/${level}/kanji-plan.json`, import.meta.url),
    JSON.stringify(plan, null, 2) + '\n',
  );
  summary[level] = { kanji: pool.length, perLesson: lessons.map(l => l.kanji.length).join(',') };
}
console.log(JSON.stringify(summary));
