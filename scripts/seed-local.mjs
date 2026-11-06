// Builds the local development database with the same course as production: N5 (reviewed,
// published, in Vietnamese), N4, N3 and the mock tests. Run after `npm run db:migrate:local`
// on an empty database (delete .wrangler/state to start over).
import { spawnSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { connect, literal, insert } from './content/lib/remote-d1.mjs';

const run = (...args) => {
  const result = spawnSync(process.execPath, args, { stdio: ['ignore', 'ignore', 'inherit'] });
  assert.equal(result.status, 0, `Failed: node ${args.join(' ')}`);
};

const db = await connect('local');
const [{ n: levels }] = await db.rows("SELECT COUNT(*) AS n FROM jlpt_levels WHERE level IN ('N4','N3')");
await db.close();
assert.equal(levels, 0, 'The local database already has N4/N3; delete .wrangler/state and migrate again');

// 1. N5 as reviewed (lessons published, their sections still drafts).
run('scripts/import-d1-local.mjs', '--apply');

const local = await connect('local');
const stamp = literal(new Date().toISOString());
const publish = (table, where) =>
  `UPDATE ${table} SET status='PUBLISHED',published_at=${stamp} WHERE status='DRAFT' AND ${where}`;
const n5 =
  "SELECT m.id FROM learning_modules m JOIN jlpt_levels l ON l.id=m.level_id WHERE l.level='N5' AND m.content_status='PUBLISHED'";
const sections = `SELECT id FROM lesson_sections WHERE module_id IN (${n5})`;
await local.batch([
  publish('lesson_sections', `module_id IN (${n5})`),
  ...['conversations', 'listening_content', 'reading_passages', 'writing_tasks', 'lesson_exercises'].map(t =>
    publish(t, `section_id IN (${sections})`),
  ),
]);

// 2. N4 and N3 lessons, built from their packages and published.
const search = [
  ['vocabulary', 'vocabulary', ['japanese', 'hiragana', 'romaji', 'english']],
  ['kanji', 'kanji', ['character', 'meaning', 'onyomi', 'kunyomi']],
  ['grammar_patterns', 'grammar', ['pattern', 'meaning', 'explanation']],
];
// Levels are added once their first lesson package exists.
for (const level of ['n4', 'n3', 'n2', 'n1']) {
  const folder = new URL(`./content/${level}/`, import.meta.url);
  if (!(await readdir(folder).catch(() => null))) continue;
  let levelId;
  for (const name of (await readdir(folder)).filter(n => /^unit-\d+\.mjs$/.test(n)).sort()) {
    const unit = await import(new URL(name, folder));
    const rows = await unit.buildUnit();
    levelId = unit.levelId;
    const statements = [];
    for (const [table, data] of Object.entries(rows))
      for (const row of data) {
        const published = { ...row };
        if ('status' in published)
          Object.assign(published, { status: 'PUBLISHED', published_at: published.published_at ?? row.created_at });
        if ('content_status' in published)
          Object.assign(published, { content_status: 'PUBLISHED', published_at: row.created_at });
        statements.push(insert(table, published));
      }
    for (const [table, kind, fields] of search)
      for (const row of rows[table])
        statements.push(
          `INSERT INTO content_search(kind,item_id,search_text) VALUES (${literal(kind)},${row.id},${literal(
            fields
              .map(f => row[f] || '')
              .join('\u001f')
              .toLowerCase(),
          )})`,
        );
    await local.batch(statements);
  }
  const total = (table, alias) =>
    `(SELECT COUNT(*) FROM ${table} ${alias} JOIN learning_modules m ON m.id=${alias}.module_id WHERE m.level_id=${levelId} AND m.content_status='PUBLISHED')`;
  await local.batch([
    `UPDATE jlpt_levels SET total_vocab=${total('vocabulary', 'v')}, total_kanji=${total('kanji', 'k')}, total_grammar=${total('grammar_patterns', 'g')} WHERE id=${levelId}`,
  ]);
}
assert.deepEqual(await local.rows('PRAGMA foreign_key_check'), []);
await local.close();

// 3. The same text changes production received, then the mock tests.
run('scripts/content/n5/apply-vietnamese.mjs', 'local', '--apply');
run('scripts/content/localize-module-text.mjs', 'local', '--apply');
run('scripts/content/mock-tests/import.mjs', 'local', '--apply');
run('scripts/content/mock-tests/import.mjs', 'local', '--publish');

const check = await connect('local');
const summary = await check.rows(
  "SELECT l.level, COUNT(m.id) AS lessons FROM jlpt_levels l JOIN learning_modules m ON m.level_id=l.id AND m.content_status='PUBLISHED' GROUP BY l.level ORDER BY l.level DESC",
);
const [{ n: tests }] = await check.rows('SELECT COUNT(*) AS n FROM test_templates WHERE is_published=1');
await check.close();
console.log(JSON.stringify({ lessons: summary, mockTests: tests }));
