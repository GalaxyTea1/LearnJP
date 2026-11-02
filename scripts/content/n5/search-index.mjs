import assert from 'node:assert/strict';

// Indexed column names are identical in the JSON snapshot and encoded D1 rows.
const definitions = {
  vocabulary: ['vocabulary', ['japanese','hiragana','romaji','english']],
  kanji: ['kanji', ['character','meaning','onyomi','kunyomi']],
  grammar_patterns: ['grammar', ['pattern','meaning','explanation']],
  dictionary_entries: ['dictionary', ['japanese','romaji','english']],
};
export function searchIndexEntry(table,row) {
  const definition=definitions[table];
  if(!definition)return null;
  const [kind,fields]=definition;
  return {kind,item_id:row.id,search_text:fields.map(f=>row[f]||'').join('\u001f').toLowerCase()};
}
export function searchIndexRows(snapshot) {
  return Object.keys(definitions).flatMap(table=>snapshot[table].map(row=>searchIndexEntry(table,row)))
    .sort((a,b)=>a.kind.localeCompare(b.kind)||a.item_id-b.item_id);
}
export async function verifySearchIndex(db,snapshot) {
  const actual=(await db.prepare('SELECT * FROM content_search ORDER BY kind,item_id').all()).results;
  assert.deepEqual(actual,searchIndexRows(snapshot),'Search index differs from content; refusing silent overwrite');
  return actual;
}
