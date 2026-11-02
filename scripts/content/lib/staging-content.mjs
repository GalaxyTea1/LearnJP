import assert from 'node:assert/strict';
import {encodeRow} from '../n5/package.mjs';
export const tables=['jlpt_levels','learning_modules','lesson_sections','conversations','conversation_lines','listening_content','reading_passages','writing_tasks','lesson_exercises','vocabulary','kanji','grammar_patterns','grammar_examples','quiz_questions','dictionary_entries','test_templates','test_sections','test_questions'];
export const literal=v=>v==null?'NULL':typeof v==='number'?(assert.ok(Number.isFinite(v)),String(v)):"'"+String(v).replaceAll("'","''")+"'";
export function importPackage(pkg){
 assert.deepEqual(Object.keys(pkg.candidate).sort(),[...tables].sort());
 const expected=Object.fromEntries(tables.map(t=>[t,pkg.candidate[t].map(r=>encodeRow(r,pkg.columns[t])).sort((a,b)=>a.id-b.id)]));
 const search=[];
 for(const [table,kind,fields] of [['vocabulary','vocabulary',['japanese','hiragana','romaji','english']],['kanji','kanji',['character','meaning','onyomi','kunyomi']],['grammar_patterns','grammar',['pattern','meaning','explanation']],['dictionary_entries','dictionary',['japanese','romaji','english']]])
 for(const row of pkg.candidate[table])search.push({kind,item_id:row.id,search_text:fields.map(f=>row[f]||'').join('\u001f').toLowerCase()});
 expected.content_search=search.sort((a,b)=>a.kind.localeCompare(b.kind)||a.item_id-b.item_id);
 const statements=['CREATE TABLE _n5_staging_import_guard (ok INTEGER CHECK(ok=1))'];
 for(const t of Object.keys(expected))statements.push(`INSERT INTO _n5_staging_import_guard VALUES ((SELECT CASE WHEN COUNT(*)=0 THEN 1 ELSE 0 END FROM "${t}"))`);
 for(const [table,rows] of Object.entries(expected))for(const row of rows){
  statements.push(`INSERT INTO "${table}" (${Object.keys(row).map(k=>'"'+k+'"').join(',')}) VALUES (${Object.values(row).map(literal).join(',')})`);
 }
 statements.push('INSERT INTO _n5_staging_import_guard VALUES ((SELECT CASE WHEN COUNT(*)=0 THEN 1 ELSE 0 END FROM pragma_foreign_key_check))','DROP TABLE _n5_staging_import_guard');
 return {expected,statements};
}
