import {readFile} from 'node:fs/promises';
import {setImmediate as yieldToRuntime} from 'node:timers/promises';
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';
import {reviewSnapshot,digest} from './n5-content-review.mjs';
import {searchIndexEntry} from './n5-search-index.mjs';

export async function reviewedPackage() {
  const read=async path=>JSON.parse(await readFile(new URL(path,import.meta.url),'utf8'));
  const source=await read('../.local/content/n5.json');
  const manifest=await read('../docs/CF2-CONTENT-MANIFEST.json');
  assert.equal(digest(source),manifest.sha256,'Original source checksum changed');
  const result=reviewSnapshot(source);
  assert.equal(digest(result.previousCandidate),'dce0ec17693c55cc0edd4319da1c2de5e9ed4c5e55a49f31d1c2a6436e1aabb7','Previously applied release changed; review migration baseline');
  assert.equal(digest(result.exerciseCandidate),'a23da2588979650c626af556a1a06c356c1f93576a98f250012b14d4c7184251','Exercise release changed; review migration baseline');
  assert.equal(digest(result.unit1Candidate),'a7b3634be9c78117001d709d0f0ade39c72db8e2b257c7257ee968ada8e3c27f','Unit 1 release changed; review migration baseline');
  assert.equal(digest(result.unit2Candidate),'f454f370b87508c125f75d8739b8668415f38675c9dfad7beb8fc33ba2b609ab','Unit 2 release changed; review migration baseline');
  assert.equal(digest(result.unit3Candidate),'4da5d6a7e5281799f68134a43ac565c5246cde8e16788ca1334ffd76fc3af62b','Unit 3 release changed; review migration baseline');
  assert.equal(digest(result.unit4Candidate),'35f9fbcd00419a440fc80a90f4eaa5dbd22d2175af03739d6c1cbd1dcae32f41','Unit 4 release changed; review migration baseline');
  assert.equal(digest(result.unit5Candidate),'c27dcb5a94ff72681667d457bcbd8afa09ac63ec64d2d9763fe1e532264a1db8','Unit 5 release changed; review migration baseline');
  assert.equal(digest(result.unit6Candidate),'6ab3667447e50eeab5f111b9d0352a232296732c5ecbbba7f4361e36ba4b777e','Unit 6 release changed; review migration baseline');
  assert.equal(digest(result.unit7Candidate),'aa771cbbe8159124fd87901734b6a4f7121afaf01ad266ad6124ad2b0ac93b81','Unit 7 release changed; review migration baseline');
  assert.equal(digest(result.unit8Candidate),'c692296b1c6670b66f58cedad2e00f0be5d7a877099a9111ac0c3c79e7a1755a','Unit 8 release changed; review migration baseline');
  assert.equal(digest(result.unit9Candidate),'314d03e5f5202bb2963ea1ebc19594b7d9498268037372e7b30a12e898dd448e','Unit 9 release changed; review migration baseline');
  assert.equal(digest(result.unit10Candidate),'24d6c23473e07f1a71049a63a2ca7ea840cbb3307107ee9004601e6b1dd2474e','Unit 10 release changed; review migration baseline');
  assert.equal(digest(result.unit11Candidate),'177f92d0442d250ea5ba23a0dc518ad50bb84a6e4f1688e38cd36e1164562df6','Unit 11 release changed; review migration baseline');
  const candidate=await read('../.local/content-review/n5-candidate.json');
  const report=await read('../docs/N5-CONTENT-REVIEW.json');
  assert.equal(digest(candidate),result.candidateChecksum,'Regenerate reviewed candidate before applying');
  assert.equal(report.sourceChecksum,result.sourceChecksum);
  assert.equal(report.candidateChecksum,result.candidateChecksum);
  assert.deepEqual(report.changes,result.changes);
  return {...result,source,columns:await read('../backend/cloudflare/columns.json')};
}
export const encodeRow=(row,fields)=>Object.fromEntries(fields.map(f=>[f.column,row[f.name]==null?null:f.type==='Json'?JSON.stringify(row[f.name]):f.type==='Boolean'?Number(row[f.name]):row[f.name]]));

export async function readContentSnapshot(db,pkg) {
  const tables=Object.keys(pkg.source);
  const results=await db.batch(tables.map(t=>db.prepare(`SELECT * FROM "${t}" ORDER BY id`)));
  return Object.fromEntries(tables.map((t,i)=>[t,results[i].results]));
}

// Reject any unexpected edit before producing a write plan. Exact replays are no-ops.
export function planContentUpdate(actual,pkg) {
  const patches=[];
  for(const [table,rows] of Object.entries(pkg.source)) {
    const fields=pkg.columns[table];
    assert.equal(actual[table].length,rows.length,`${table}: row count changed`);
    const current=new Map(actual[table].map(r=>[r.id,r]));
    for(const row of rows) {
      const initial=encodeRow(row,fields),previous=pkg.previousCandidate?encodeRow(pkg.previousCandidate[table].find(r=>r.id===row.id),fields):initial;
      const after=encodeRow(pkg.candidate[table].find(r=>r.id===row.id),fields),live=current.get(row.id);
      assert.ok(live,`${table}/${row.id}: missing`);
      if(isDeepStrictEqual(live,after))continue;
      const exercise=pkg.exerciseCandidate?encodeRow(pkg.exerciseCandidate[table].find(r=>r.id===row.id),fields):previous;
      const unit1=pkg.unit1Candidate?encodeRow(pkg.unit1Candidate[table].find(r=>r.id===row.id),fields):exercise;
      const unit2=pkg.unit2Candidate?encodeRow(pkg.unit2Candidate[table].find(r=>r.id===row.id),fields):unit1;
      const unit3=pkg.unit3Candidate?encodeRow(pkg.unit3Candidate[table].find(r=>r.id===row.id),fields):unit2;
      const unit4=pkg.unit4Candidate?encodeRow(pkg.unit4Candidate[table].find(r=>r.id===row.id),fields):unit3;
      const unit5=pkg.unit5Candidate?encodeRow(pkg.unit5Candidate[table].find(r=>r.id===row.id),fields):unit4;
      const unit6=pkg.unit6Candidate?encodeRow(pkg.unit6Candidate[table].find(r=>r.id===row.id),fields):unit5;
      const unit7=pkg.unit7Candidate?encodeRow(pkg.unit7Candidate[table].find(r=>r.id===row.id),fields):unit6;
      const unit8=pkg.unit8Candidate?encodeRow(pkg.unit8Candidate[table].find(r=>r.id===row.id),fields):unit7;
      const unit9=pkg.unit9Candidate?encodeRow(pkg.unit9Candidate[table].find(r=>r.id===row.id),fields):unit8;
      const unit10=pkg.unit10Candidate?encodeRow(pkg.unit10Candidate[table].find(r=>r.id===row.id),fields):unit9;
      const unit11=pkg.unit11Candidate?encodeRow(pkg.unit11Candidate[table].find(r=>r.id===row.id),fields):unit10;
      const before=[unit11,unit10,unit9,unit8,unit7,unit6,unit5,unit4,unit3,unit2,unit1,exercise,previous].find(value=>isDeepStrictEqual(live,value))??initial;
      assert.deepEqual(live,before,`${table}/${row.id}: unexpected content; refusing overwrite`);
      patches.push({table,id:row.id,before,after});
    }
  }
  return patches;
}

export async function applyContentPatches(db,patches) {
  if(!patches.length)return;
  const statements=[];
  let preparedRows=0;
  for(const p of patches) {
    assert.ok(['quiz_questions','lesson_exercises','reading_passages','listening_content','vocabulary','learning_modules','conversations','conversation_lines','writing_tasks','grammar_patterns','grammar_examples','kanji'].includes(p.table),'Unsupported content table');
    const guard='n5-review:'+crypto.randomUUID();
    const fields=Object.keys(p.before);
    assert.ok(fields.every(f=>/^[a-z_]+$/.test(f)));
    assert.deepEqual(Object.keys(p.after),fields);
    assert.equal(p.before.id,p.after.id);
    if('version' in p.before)assert.ok(p.after.version>p.before.version,'Content versions must advance, including rollback');
    const changed=fields.filter(f=>p.before[f]!==p.after[f]);
    const fieldsByTable={grammar_examples:['japanese','romaji','english'],kanji:['radical','kunyomi','example_words','mnemonic'],vocabulary:['romaji','english','example_jp','example_en'],grammar_patterns:['explanation'],learning_modules:['description','title','title_jp','description','topics','version','updated_at'],conversations:['title','context','version','updated_at'],conversation_lines:['speaker','japanese','hiragana','romaji','translation','updated_at'],writing_tasks:['instructions','sample_answer','rubric','min_length','max_length','version','updated_at']};
    if(fieldsByTable[p.table])assert.ok(changed.every(f=>fieldsByTable[p.table].includes(f)),'Unsupported editorial field');
    assert.ok(changed.every(f=>!['id','module_id','section_id','conversation_id','grammar_pattern_id','status','content_status','published_at','created_at'].includes(f)),'Cannot change identity or publication');
    statements.push(db.prepare(`INSERT INTO mutation_guards(id,ok) SELECT ?,CASE WHEN EXISTS(SELECT 1 FROM "${p.table}" WHERE ${fields.map(f=>`"${f}" IS ?`).join(' AND ')}) THEN 1 ELSE 0 END`).bind(guard,...fields.map(f=>p.before[f])));
    statements.push(db.prepare(`UPDATE "${p.table}" SET ${changed.map(f=>`"${f}"=?`).join(',')} WHERE id=?`).bind(...changed.map(f=>p.after[f]),p.id));
    statements.push(db.prepare('DELETE FROM mutation_guards WHERE id=?').bind(guard));
    const oldIndex=searchIndexEntry(p.table,p.before),newIndex=searchIndexEntry(p.table,p.after);
    if(oldIndex&&oldIndex.search_text!==newIndex.search_text) {
      const indexGuard='n5-review-index:'+crypto.randomUUID();
      statements.push(db.prepare('INSERT INTO mutation_guards(id,ok) SELECT ?,CASE WHEN EXISTS(SELECT 1 FROM content_search WHERE kind=? AND item_id=? AND search_text=?) THEN 1 ELSE 0 END').bind(indexGuard,oldIndex.kind,oldIndex.item_id,oldIndex.search_text));
      statements.push(db.prepare('UPDATE content_search SET search_text=? WHERE kind=? AND item_id=?').bind(newIndex.search_text,newIndex.kind,newIndex.item_id));
      statements.push(db.prepare('DELETE FROM mutation_guards WHERE id=?').bind(indexGuard));
    }
    // Preparing local binding proxies is synchronous. Give the async transport
    // time to process socket events during large plans; writes still use one batch.
    if(++preparedRows%32===0)await yieldToRuntime();
  }
  // D1 batch is atomic: any changed row or failing statement rolls back the entire package.
  await db.batch(statements);
}

export function reverseContentPatches(patches) {
  return patches.map(p=>({...p,before:p.after,after:{...p.before,
    ...('version' in p.after?{version:p.after.version+1}:{}),
    ...('updated_at' in p.after?{updated_at:new Date().toISOString()}:{}),
  }}));
}
