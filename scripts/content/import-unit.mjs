// Import one lesson into staging D1.
// Usage: node scripts/content/import-unit.mjs <N3|N4> <unit> [--apply | --publish]
//   (no flag)  dry run: builds the rows and writes the SQL to .local/<level>-<unit>-release/
//   --apply    inserts the lesson as DRAFT (invisible to learners)
//   --publish  publishes a draft that still matches the package
// Every write is preceded by a full backup and followed by checks that only the lesson's ID
// block changed, foreign keys hold and the stored rows equal the package.
import {writeFile, mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {connect, literal, insert} from './lib/remote-d1.mjs';

const [levelArg, unitArg] = process.argv.slice(2);
const level = levelArg?.toUpperCase(), unit = Number(unitArg);
assert.ok(/^N[34]$/.test(level) && Number.isInteger(unit) && unit > 0,
  'Usage: node scripts/content/import-unit.mjs <N3|N4> <unit> [--apply | --publish]');
const apply = process.argv.includes('--apply'), publish = process.argv.includes('--publish');
assert.ok(!(apply && publish), 'Use either --apply or --publish');

const code = `${level}-${String(unit).padStart(2, '0')}`;
const {buildUnit, moduleId, levelId} = await import(`./${level.toLowerCase()}/unit-${String(unit).padStart(2, '0')}.mjs`);
const rows = await buildUnit();
// Each lesson owns a block of 1,000 IDs starting at its module ID.
const first = moduleId, last = moduleId + 999;
const inBlock = `id BETWEEN ${first} AND ${last}`, outside = `id<${first} OR id>${last}`;

const db = await connect('staging');
const dir = resolve(`.local/${code.toLowerCase()}-release`);
await mkdir(dir, {recursive: true});

const before = {};
for (const table of Object.keys(rows)) before[table] = await db.rows(`SELECT * FROM ${table} WHERE ${outside} ORDER BY id`);
const [{n: earlier}] = await db.rows(`SELECT COUNT(*) AS n FROM learning_modules WHERE level_id=${levelId} AND unit_number<${unit} AND content_status='PUBLISHED'`);
assert.equal(earlier, unit - 1, `Publish ${level}-01 to ${level}-${String(unit - 1).padStart(2, '0')} first`);

const queries = [];
if (publish) {
  for (const [table, data] of Object.entries(rows)) assert.deepEqual(await db.rows(`SELECT * FROM ${table} WHERE ${inBlock} ORDER BY id`), data, `Draft changed: ${table}`);
  const stamp = literal(new Date().toISOString());
  for (const [table, data] of Object.entries(rows)) if (data[0].status === 'DRAFT')
    queries.push(`UPDATE ${table} SET status='PUBLISHED',published_at=${stamp},version=2,updated_at=${stamp} WHERE ${inBlock} AND status='DRAFT'`);
  // Publish the lesson itself last, so a half-published lesson is never visible.
  queries.push(`UPDATE learning_modules SET content_status='PUBLISHED',published_at=${stamp},version=2,updated_at=${stamp} WHERE id=${moduleId} AND content_status='DRAFT'`);
  const total = (table, alias) => `(SELECT COUNT(*) FROM ${table} ${alias} JOIN learning_modules m ON m.id=${alias}.module_id WHERE m.level_id=${levelId} AND m.content_status='PUBLISHED')`;
  queries.push(`UPDATE jlpt_levels SET total_vocab=${total('vocabulary', 'v')}, total_kanji=${total('kanji', 'k')}, total_grammar=${total('grammar_patterns', 'g')} WHERE id=${levelId}`);
} else {
  assert.equal((await db.rows(`SELECT id FROM jlpt_levels WHERE id=${levelId} AND level='${level}'`)).length, 1, `${level} level row missing`);
  assert.equal((await db.rows(`SELECT id FROM learning_modules WHERE level_id=${levelId} AND unit_number=${unit}`)).length, 0, `${code} already exists`);
  for (const [table, data] of Object.entries(rows)) {
    assert.equal((await db.rows(`SELECT id FROM ${table} WHERE ${inBlock}`)).length, 0, `IDs ${first}–${last} occupied in ${table}`);
    for (const row of data) queries.push(insert(table, row));
  }
  const search = [['vocabulary', 'vocabulary', ['japanese', 'hiragana', 'romaji', 'english']],
    ['kanji', 'kanji', ['character', 'meaning', 'onyomi', 'kunyomi']], ['grammar_patterns', 'grammar', ['pattern', 'meaning', 'explanation']]];
  for (const [table, kind, fields] of search) for (const row of rows[table])
    queries.push(`INSERT INTO content_search(kind,item_id,search_text) VALUES (${literal(kind)},${row.id},${literal(fields.map(f => row[f] || '').join('\u001f').toLowerCase())})`);
}
await writeFile(resolve(dir, publish ? 'publish.sql' : 'draft.sql'), queries.join(';\n') + ';\n');
const counts = Object.fromEntries(Object.entries(rows).map(([table, data]) => [table, data.length]));
if (!apply && !publish) {
  console.log(JSON.stringify({mode: 'check', lesson: code, moduleId, counts}));
  process.exit(0);
}

const backup = db.backup(dir, publish ? 'before-publish' : 'before-import');
await db.query(queries.join(';\n'));
for (const [table, data] of Object.entries(rows)) {
  assert.deepEqual(await db.rows(`SELECT * FROM ${table} WHERE ${outside} ORDER BY id`), before[table], `Existing content changed: ${table}`);
  const stored = await db.rows(`SELECT * FROM ${table} WHERE ${inBlock} ORDER BY id`);
  if (!publish) assert.deepEqual(stored, data, `Import mismatch: ${table}`);
  else {
    assert.equal(stored.length, data.length);
    for (const row of stored) {
      if ('status' in row) assert.equal(row.status, 'PUBLISHED');
      if ('content_status' in row) assert.equal(row.content_status, 'PUBLISHED');
    }
  }
}
assert.deepEqual(await db.rows('PRAGMA foreign_key_check'), []);
const receipt = {mode: publish ? 'publish' : 'draft-import', lesson: code, moduleId, backup,
  checksum: createHash('sha256').update(JSON.stringify(rows)).digest('hex'), counts, verified: true};
await writeFile(resolve(dir, publish ? 'published.json' : 'imported.json'), JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt));
