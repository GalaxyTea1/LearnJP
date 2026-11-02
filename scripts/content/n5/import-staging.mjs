import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';
import {validateStaging} from '../../prepare-staging.mjs';
import {reviewedPackage} from './package.mjs';
import {importPackage} from '../lib/staging-content.mjs';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const config=validateStaging(JSON.parse(await readFile(resolve(root,'wrangler.staging.json'),'utf8')));
assert.equal(config.account_id,'5af14e1747cecf2f16c1b95a62a53f06');
assert.equal(config.d1_databases[0].database_id,'6edc6ddb-f07c-4e23-be8e-c622b3a6bae3');
const pkg=await reviewedPackage(),{expected,statements}=importPackage(pkg);
const auth=await readFile(resolve(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8');
const token=auth.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];assert.ok(token,'Run wrangler login');
const base=`https://api.cloudflare.com/client/v4/accounts/${config.account_id}/d1/database/${config.d1_databases[0].database_id}`;
async function api(path,body){
 const r=await fetch(base+path,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 const value=await r.json();if(!r.ok||!value.success)throw new Error(`Cloudflare request failed (${r.status}): ${value.errors?.map(x=>x.code).join(',')}`);return value.result;
}
const meta=await api('');assert.equal(meta.name,'learnjp-staging');
async function query(sql){const result=await api('/query',{sql});assert.ok(result.every(r=>r.success));return result[0].results;}
const sortRows=rows=>rows.map(r=>Object.fromEntries(Object.entries(r).sort(([a],[b])=>a.localeCompare(b)))).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
const hash=rows=>createHash('sha256').update(JSON.stringify(sortRows(rows))).digest('hex');
const allTables=(await query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' ORDER BY name")).map(x=>x.name);
assert.ok(!allTables.includes('_n5_staging_import_guard'),'Previous import incomplete; inspect backup before retry');
const preserved=allTables.filter(t=>!Object.hasOwn(expected,t)&&t!=='assessment_revision');
const revisionBefore=(await query('SELECT version FROM assessment_revision WHERE id=1'))[0].version;
const before={};for(const t of preserved)before[t]=hash(await query(`SELECT * FROM "${t}"`));
let empty=true,identical=true;
for(const [t,rows] of Object.entries(expected)){const actual=await query(`SELECT * FROM "${t}"`);empty&&=actual.length===0;identical&&=isDeepStrictEqual(sortRows(actual),sortRows(rows));}
assert.ok(empty||identical,'Remote content differs: refusing overwrite or partial import');
assert.deepEqual(await query('PRAGMA foreign_key_check'),[]);
const stamp=new Date().toISOString().replaceAll(':','-'),dir=resolve(root,'.local/staging-import',stamp);await mkdir(dir,{recursive:true});
const sqlFile=resolve(dir,'n5.sql');await writeFile(sqlFile,statements.join(';\n')+';\n');
const receipt={target:config.d1_databases[0].database_id,checksum:pkg.candidateChecksum,rows:Object.fromEntries(Object.entries(expected).map(([t,r])=>[t,r.length])),sqlFile,mode:process.argv.includes('--apply')?'apply':'check',alreadyImported:identical};
function cli(args){const r=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js',...args],{cwd:root,encoding:'utf8',env:{...process.env,WRANGLER_SEND_METRICS:'false',WRANGLER_LOG_PATH:resolve(root,'.wrangler/logs')}});if(r.status!==0)throw new Error('Wrangler failed; inspect local Wrangler logs. No automatic retry.');}
if(receipt.mode==='apply'&&!identical){
 const backup=resolve(dir,'before.sql');cli(['d1','export','DB','--remote','--config','wrangler.staging.json','--output',backup]);receipt.backup=backup;
 await writeFile(resolve(dir,'pending.json'),JSON.stringify(receipt,null,2));
 cli(['d1','execute','DB','--remote','--config','wrangler.staging.json','--file',sqlFile]);
}
if(receipt.mode==='apply'||identical){
 for(const [t,rows] of Object.entries(expected))assert.deepEqual(sortRows(await query(`SELECT * FROM "${t}"`)),sortRows(rows),`Readback differs: ${t}`);
 assert.deepEqual(await query('PRAGMA foreign_key_check'),[]);
 for(const t of preserved)assert.equal(hash(await query(`SELECT * FROM "${t}"`)),before[t],`Non-content table changed: ${t}; inspect concurrent activity`);
 assert.equal((await query('SELECT version FROM assessment_revision WHERE id=1'))[0].version,revisionBefore+(receipt.mode==='apply'&&!identical?expected.quiz_questions.length+expected.test_questions.length:0),'Unexpected assessment revision');
 receipt.verified=true;receipt.preservedTables=preserved.length;
}
const backupFlag=process.argv.indexOf('--verify-before');
if(backupFlag>=0){
 const backupFile=resolve(process.argv[backupFlag+1]);
 assert.ok(backupFile.startsWith(resolve(root,'.local/staging-import')+'\\'.slice(0,1)),'Backup must belong to staging imports');
 const pending=JSON.parse(await readFile(resolve(backupFile,'../pending.json'),'utf8'));
 assert.equal(pending.target,receipt.target);assert.equal(pending.checksum,receipt.checksum);
 const r=spawnSync('python',['scripts/content/n5/read-backup.py',backupFile],{cwd:root,encoding:'utf8',maxBuffer:10*1024*1024});
 assert.equal(r.status,0,'Could not read pre-import backup');const original=JSON.parse(r.stdout);
 for(const t of preserved){assert.ok(original[t],`Missing backup table ${t}`);assert.deepEqual(sortRows(await query(`SELECT * FROM "${t}"`)),sortRows(original[t]),`Backup comparison differs: ${t}`);}
 const expectedVersion=original.assessment_revision[0].version+expected.quiz_questions.length+expected.test_questions.length;
 assert.equal((await query('SELECT version FROM assessment_revision WHERE id=1'))[0].version,expectedVersion);
 receipt.preImportBackupVerified=true;receipt.backup=backupFile;
}
receipt.completedAt=new Date().toISOString();await writeFile(resolve(dir,'result.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
