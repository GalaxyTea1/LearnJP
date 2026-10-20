import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { openLocalD1 } from './d1-local.mjs';
import { reviewedPackage } from './n5-content-package.mjs';

const read = async p => JSON.parse(await readFile(new URL(p, import.meta.url), 'utf8'));
// Fresh databases receive the reviewed content. Existing edits still require guarded migration.
const {candidate:snapshot,candidateChecksum} = await reviewedPackage();
const columns = await read('../backend/cloudflare/columns.json');
const manifest = await read('../docs/CF2-CONTENT-MANIFEST.json');
assert.equal(createHash('sha256').update(JSON.stringify(snapshot)).digest('hex'), candidateChecksum);
const contentTables=['jlpt_levels','learning_modules','lesson_sections','conversations','conversation_lines','listening_content','reading_passages','writing_tasks','lesson_exercises','vocabulary','kanji','grammar_patterns','grammar_examples','quiz_questions','dictionary_entries','test_templates','test_sections','test_questions'];
assert.deepEqual(Object.keys(snapshot).sort(),[...contentTables].sort(),'Import accepts content tables only');
const { runtime, db } = await openLocalD1();
const encode = (row, field) => row[field.name] == null ? null : field.type === 'Json' ? JSON.stringify(row[field.name]) : field.type === 'Boolean' ? Number(row[field.name]) : row[field.name];
try {
  const usersBefore=Number((await db.prepare('SELECT count(*) AS n FROM users').first()).n);
  const inserts = [];
  for (const [table, rows] of Object.entries(snapshot)) {
    assert.ok(columns[table], 'Unknown table');
    assert.equal(rows.length, manifest.counts[table]);
    const fields = columns[table];
    const existing = (await db.prepare(`SELECT * FROM "${table}" ORDER BY id`).all()).results;
    // Never overwrite or silently ignore changed content. Only empty tables or exact replays.
    const expected = rows.map(row => Object.fromEntries(fields.map(f => [f.column, encode(row, f)])));
    if (existing.length) { assert.deepEqual(existing, expected, `Existing ${table} differs; run scripts/apply-n5-content-local.mjs for guarded review, never reset the database`); continue; }
    for (const row of rows) {
      if (table === 'quiz_questions') {
        assert.ok(Array.isArray(row.options) && row.options.length >= 2);
        assert.ok(Number.isInteger(row.correctIndex) && row.correctIndex >= 0 && row.correctIndex < row.options.length);
      }
      inserts.push(db.prepare(`INSERT INTO "${table}" (${fields.map(f => `"${f.column}"`).join(',')}) VALUES (${fields.map(() => '?').join(',')})`).bind(...fields.map(f => encode(row, f))));
    }
  }
  const searchRows = [];
  for (const [table,kind,fields] of [
    ['vocabulary','vocabulary',['japanese','hiragana','romaji','english']],
    ['kanji','kanji',['character','meaning','onyomi','kunyomi']],
    ['grammar_patterns','grammar',['pattern','meaning','explanation']],
    ['dictionary_entries','dictionary',['japanese','romaji','english']],
  ]) for (const row of snapshot[table]) searchRows.push({kind,item_id:row.id,search_text:fields.map(f=>row[f]||'').join('\u001f').toLowerCase()});
  searchRows.sort((a,b)=>a.kind.localeCompare(b.kind)||a.item_id-b.item_id);
  const existingSearch=(await db.prepare('SELECT * FROM content_search ORDER BY kind,item_id').all()).results;
  if (existingSearch.length) assert.deepEqual(existingSearch,searchRows,'Search index differs');
  else for (const row of searchRows) inserts.push(db.prepare('INSERT INTO content_search(kind,item_id,search_text) VALUES (?,?,?)').bind(row.kind,row.item_id,row.search_text));
  if (inserts.length && !process.argv.includes('--apply')) {
    console.log(`Validated ${inserts.length} inserts; run with --apply to write local D1.`);
  } else {
    if (inserts.length) await db.batch(inserts);
    assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results, []);
    assert.deepEqual((await db.prepare('SELECT * FROM content_search ORDER BY kind,item_id').all()).results,searchRows);
    for (const [table, rows] of Object.entries(snapshot)) {
      const actual = (await db.prepare(`SELECT * FROM "${table}" ORDER BY id`).all()).results;
      const expected = rows.map(row => Object.fromEntries(columns[table].map(f => [f.column, encode(row, f)])));
      assert.deepEqual(actual, expected, `${table} round-trip differs`);
    }
    const usersAfter=Number((await db.prepare('SELECT count(*) AS n FROM users').first()).n);
    assert.equal(usersAfter,usersBefore,'Content import must preserve existing accounts');
    console.log(JSON.stringify({ verified: true, imported: inserts.length, tables: Object.keys(snapshot).length, checksum: candidateChecksum, foreignKeyViolations: 0, users: usersAfter, accountsPreserved:true }));
  }
} finally { await runtime.dispose(); }
