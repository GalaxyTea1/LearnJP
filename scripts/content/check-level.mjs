// Check a deployed level against its lesson packages through the public API.
// Usage: node scripts/content/check-level.mjs <N3|N4> [host]   (default host: staging)
import {readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';

const level = process.argv[2]?.toUpperCase();
assert.ok(/^N[34]$/.test(level), 'Usage: node scripts/content/check-level.mjs <N3|N4> [host]');
const host = process.argv[3] || 'learnjp-staging.trongdv031199.workers.dev';
const get = async path => {
  const response = await fetch(`https://${host}/api/v1/${path}`, {signal: AbortSignal.timeout(30000)});
  assert.equal(response.status, 200, path);
  return response.json();
};

const folder = new URL(`./${level.toLowerCase()}/`, import.meta.url);
const units = (await readdir(folder)).filter(name => /^unit-\d+\.mjs$/.test(name)).sort();
const catalog = (await get(`modules?level=${level}`)).data;
assert.equal(catalog.length, units.length, `Published ${level} lessons`);

const verified = [];
for (const name of units) {
  const {buildUnit, moduleId} = await import(new URL(name, folder));
  const rows = await buildUnit();
  const full = (await get(`modules/${moduleId}/full`)).data;
  const exercises = full.sections.flatMap(section => section.exercises || []);
  const expected = {
    sections: rows.lesson_sections.length, vocabulary: rows.vocabulary.length, kanji: rows.kanji.length,
    grammar: rows.grammar_patterns.length, quiz: rows.quiz_questions.length, exercises: rows.lesson_exercises.length,
  };
  assert.deepEqual({
    sections: full.sections.length, vocabulary: full.vocabulary.length, kanji: full.kanji.length,
    grammar: full.grammarPatterns.length, quiz: full.quizQuestions.length, exercises: exercises.length,
  }, expected, `${level} module ${moduleId}`);
  // Quiz answers are only revealed after submission (practice exercises show theirs on request).
  assert.ok(full.quizQuestions.every(q => !('correctIndex' in q) && !('explanation' in q)), `Quiz answers exposed in ${moduleId}`);
  assert.ok(full.sections.every(section => section.instructions?.trim()), `Empty section instructions in ${moduleId}`);
  verified.push({moduleId, ...expected});
}
console.log(JSON.stringify({host, level, lessons: verified.length, verified}));
