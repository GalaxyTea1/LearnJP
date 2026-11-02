// Mock tests import: node scripts/content/mock-tests/import.mjs staging|production [--apply|--publish]
// Default: dry run (writes SQL only). --apply: insert the six tests unpublished. --publish: publish them and
// update the N4/N3 level descriptions. IDs 50001–50999 in test_templates/test_sections/test_questions.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {mockTestsPackage,firstId,lastId} from './package.mjs';
import {connect,literal} from '../lib/remote-d1.mjs';

const target=process.argv[2];
assert.ok(['staging','production'].includes(target),'Usage: node scripts/content/mock-tests/import.mjs staging|production [--apply|--publish]');
const db=await connect(target);
const {query,rows:one}=db;
const rows=await mockTestsPackage(),publish=process.argv.includes('--publish'),apply=process.argv.includes('--apply');
assert.ok(!(apply&&publish));
const dir=resolve(`.local/mock-tests-${target}`);await mkdir(dir,{recursive:true});
const hash=createHash('sha256').update(JSON.stringify(rows)).digest('hex');
const tables=Object.keys(rows),inRange=`id BETWEEN ${firstId} AND ${lastId}`,outside=`id<${firstId} OR id>${lastId}`;
const descriptions={N4:'Đã mở N4-01 đến N4-14 và 3 đề thi thử. Bài 14 là bài tổng ôn có 50 mục từ lặp lại.',N3:'Đã mở N3-01 đến N3-16 và 3 đề thi thử. Bài 16 là bài tổng ôn có 105 mục từ lặp lại.'};

// The tests only use lessons that must already be live.
for(const [level,n] of [['N4',14],['N3',16]])assert.equal((await one(`SELECT COUNT(*) AS n FROM learning_modules m JOIN jlpt_levels l ON l.id=m.level_id WHERE l.level='${level}' AND m.content_status='PUBLISHED'`))[0].n,n,`${level} must be fully published first`);
const before={};for(const t of tables)before[t]=await one(`SELECT * FROM ${t} WHERE ${outside} ORDER BY id`);
const queries=[];
if(publish){
 for(const t of tables)assert.deepEqual(await one(`SELECT * FROM ${t} WHERE ${inRange} ORDER BY id`),rows[t],`Draft changed: ${t}`);
 queries.push(`UPDATE test_templates SET is_published=1 WHERE ${inRange} AND is_published=0`);
 for(const [level,text] of Object.entries(descriptions))queries.push(`UPDATE jlpt_levels SET description=${literal(text)} WHERE level='${level}'`);
}else{
 for(const t of tables)assert.equal((await one(`SELECT id FROM ${t} WHERE ${inRange}`)).length,0,`Reserved IDs occupied: ${t}`);
 for(const t of tables)for(const r of rows[t])queries.push(`INSERT INTO ${t} (${Object.keys(r).join(',')}) VALUES (${Object.values(r).map(literal).join(',')})`);
}
await writeFile(resolve(dir,publish?'publish.sql':'draft.sql'),queries.join(';\n')+';\n');
if(!apply&&!publish){console.log(JSON.stringify({mode:'check',target,checksum:hash,counts:Object.fromEntries(tables.map(t=>[t,rows[t].length]))}));process.exit(0);}

const backup=db.backup(dir,publish?'before-publish':'before-import');
await query(queries.join(';\n'));
for(const t of tables){
 assert.deepEqual(await one(`SELECT * FROM ${t} WHERE ${outside} ORDER BY id`),before[t],`Existing rows changed: ${t}`);
 const expected=publish&&t==='test_templates'?rows[t].map(r=>({...r,is_published:1})):rows[t];
 assert.deepEqual(await one(`SELECT * FROM ${t} WHERE ${inRange} ORDER BY id`),expected,`Import mismatch: ${t}`);
}
assert.deepEqual(await one('PRAGMA foreign_key_check'),[]);
if(publish)for(const [level,text] of Object.entries(descriptions))assert.equal((await one(`SELECT description FROM jlpt_levels WHERE level='${level}'`))[0].description,text);
const receipt={mode:publish?'publish':'draft-import',target,backup,checksum:hash,counts:Object.fromEntries(tables.map(t=>[t,rows[t].length])),verified:true};
await writeFile(resolve(dir,publish?'published.json':'imported.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
