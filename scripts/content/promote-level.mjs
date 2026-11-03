// Copy a published level (N3 or N4) from staging D1 to production D1.
// Usage: node scripts/content/promote-level.mjs <N3|N4> [--apply]
//   (no flag)  dry run: reads both databases and writes the SQL to .local/<level>-production/
//   --apply    backs up production, then copies one lesson per request (one transaction each)
// Lessons already present and identical on production are skipped, so the script can be re-run.
// Only the level row, lesson content and its search index are copied; learner data is never touched.
import { readdir, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { connect, literal, insert } from './lib/remote-d1.mjs';

const level = process.argv[2]?.toUpperCase(),
  apply = process.argv.includes('--apply');
assert.ok(/^N[34]$/.test(level), 'Usage: node scripts/content/promote-level.mjs <N3|N4> [--apply]');
const previousLevel = { N4: 'N5', N3: 'N4' }[level];

const folder = new URL(`./${level.toLowerCase()}/`, import.meta.url);
const lessons = [];
for (const name of (await readdir(folder)).filter(n => /^unit-\d+\.mjs$/.test(n)).sort()) {
  const { buildUnit, moduleId, levelId } = await import(new URL(name, folder));
  const rows = await buildUnit();
  lessons.push({
    unit: rows.learning_modules[0].unit_number,
    moduleId,
    levelId,
    first: moduleId,
    last: moduleId + 999,
    rows,
  });
}
const levelId = lessons[0].levelId,
  first = lessons[0].first,
  last = lessons.at(-1).last;
assert.ok(lessons.every(l => l.levelId === levelId));
// Parents before children so foreign keys hold inside each request.
const tables = [
  'learning_modules',
  'lesson_sections',
  'vocabulary',
  'kanji',
  'grammar_patterns',
  'grammar_examples',
  'conversations',
  'conversation_lines',
  'listening_content',
  'reading_passages',
  'writing_tasks',
  'lesson_exercises',
  'quiz_questions',
];

const src = await connect('staging'),
  dst = await connect('production');
const dir = resolve(`.local/${level.toLowerCase()}-production`);
await mkdir(dir, { recursive: true });

const migrations = db => db.rows('SELECT name FROM d1_migrations ORDER BY id');
assert.deepEqual(await migrations(dst), await migrations(src), 'Apply the same migrations to production first');

const read = async (db, { first, last }) => {
  const rows = {};
  for (const table of tables)
    rows[table] = await db.rows(`SELECT * FROM ${table} WHERE id BETWEEN ${first} AND ${last} ORDER BY id`);
  rows.content_search = await db.rows(
    `SELECT * FROM content_search WHERE item_id BETWEEN ${first} AND ${last} ORDER BY kind,item_id`,
  );
  return rows;
};

// Source: every lesson of the level is published on staging. Text may have been edited after
// import, so staging (not the package) is the copy source; the package fixes the row counts.
const [levelRow] = await src.rows(`SELECT * FROM jlpt_levels WHERE id=${levelId}`);
assert.equal(levelRow?.level, level, `${level} level row missing on staging`);
const source = [];
for (const lesson of lessons) {
  const rows = await read(src, lesson);
  assert.equal(
    rows.learning_modules[0]?.content_status,
    'PUBLISHED',
    `${level}-${lesson.unit} not published on staging`,
  );
  for (const table of tables) {
    assert.equal(
      rows[table].length,
      lesson.rows[table]?.length ?? 0,
      `${level}-${lesson.unit}: ${table} count differs from the package`,
    );
    for (const row of rows[table])
      if ('status' in row) assert.equal(row.status, 'PUBLISHED', `${table} ${row.id} not published`);
  }
  source.push(rows);
}

// Target: the previous level is live and nothing else occupies this level's ID range.
const [{ n: previous }] = await dst.rows(
  `SELECT COUNT(*) AS n FROM learning_modules m JOIN jlpt_levels l ON l.id=m.level_id WHERE l.level='${previousLevel}' AND m.content_status='PUBLISHED'`,
);
assert.ok(previous > 0, `Publish ${previousLevel} on production first`);
const [prodLevel] = await dst.rows(`SELECT * FROM jlpt_levels WHERE id=${levelId} OR level='${level}'`);
if (prodLevel) assert.deepEqual(prodLevel, levelRow, `Production has a different ${level} level row`);
const outside = `id<${first} OR id>${last}`;
const snapshot = async () => {
  const s = {};
  for (const table of tables) s[table] = await dst.rows(`SELECT * FROM ${table} WHERE ${outside} ORDER BY id`);
  s.content_search = await dst.rows(
    `SELECT * FROM content_search WHERE item_id<${first} OR item_id>${last} ORDER BY kind,item_id`,
  );
  return s;
};
const before = await snapshot();

const plan = [];
for (const [i, lesson] of lessons.entries()) {
  const present = await read(dst, lesson);
  if (present.learning_modules.length) {
    assert.deepEqual(present, source[i], `${level}-${lesson.unit} is partly or differently present on production`);
    plan.push({ unit: lesson.unit, skip: true });
    continue;
  }
  const occupied = Object.entries(present)
    .filter(([, r]) => r.length)
    .map(([t]) => t);
  assert.deepEqual(
    occupied,
    [],
    `${level}-${lesson.unit}: IDs ${lesson.first}–${lesson.last} occupied (${occupied.join(', ')})`,
  );
  const rows = source[i],
    [module] = rows.learning_modules,
    queries = [];
  if (i === 0 && !prodLevel) queries.push(insert('jlpt_levels', levelRow));
  // The lesson stays DRAFT until its children exist, then gets its staging status back in the same request.
  queries.push(insert('learning_modules', { ...module, content_status: 'DRAFT' }));
  for (const table of tables.slice(1)) for (const row of rows[table]) queries.push(insert(table, row));
  for (const row of rows.content_search) queries.push(insert('content_search', row));
  queries.push(`UPDATE learning_modules SET content_status=${literal(module.content_status)} WHERE id=${module.id}`);
  plan.push({ unit: lesson.unit, skip: false, queries });
}
const label = unit => `${level}-${String(unit).padStart(2, '0')}`;
const sql =
  plan
    .filter(p => !p.skip)
    .flatMap(p => [`-- ${label(p.unit)}`, ...p.queries.map(q => q + ';')])
    .join('\n') + '\n';
await writeFile(resolve(dir, 'promote.sql'), sql);
const summary = {
  mode: apply ? 'apply' : 'dry-run',
  level,
  copy: plan.filter(p => !p.skip).map(p => p.unit),
  skip: plan.filter(p => p.skip).map(p => p.unit),
  statements: plan.reduce((n, p) => n + (p.queries?.length ?? 0), 0),
  sha256: createHash('sha256').update(sql).digest('hex'),
};
if (!apply) {
  console.log(JSON.stringify(summary));
  process.exit(0);
}

const backup = dst.backup(dir, 'before-promote');
for (const p of plan.filter(p => !p.skip)) {
  await dst.query(p.queries.join(';\n'));
  console.log(`copied ${label(p.unit)}`);
}

for (const [i, lesson] of lessons.entries())
  assert.deepEqual(await read(dst, lesson), source[i], `Production differs from staging: ${label(lesson.unit)}`);
assert.deepEqual(await dst.rows(`SELECT * FROM jlpt_levels WHERE id=${levelId}`), [levelRow]);
assert.deepEqual(await snapshot(), before, `Content outside the ${level} range changed`);
assert.deepEqual(await dst.rows('PRAGMA foreign_key_check'), []);
const counts = db =>
  db.rows(`SELECT * FROM module_content_counts WHERE module_id BETWEEN ${first} AND ${last} ORDER BY module_id`);
assert.deepEqual(await counts(dst), await counts(src), 'Catalog counts differ');
const receipt = { ...summary, backup, verified: true };
await writeFile(resolve(dir, 'promoted.json'), JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt));
