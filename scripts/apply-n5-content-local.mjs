import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join,resolve,relative,isAbsolute} from 'node:path';
import assert from 'node:assert/strict';
import {openLocalD1} from './d1-local.mjs';
import {reviewedPackage,readContentSnapshot,planContentUpdate,applyContentPatches,reverseContentPatches} from './n5-content-package.mjs';
import {digest} from './n5-content-review.mjs';
import {verifySearchIndex,searchIndexRows,searchIndexEntry} from './n5-search-index.mjs';

const args=process.argv.slice(2),rollbackIndex=args.indexOf('--rollback');
assert.ok(args.every((v,i)=>['--apply','--rollback'].includes(v)||i===rollbackIndex+1&&rollbackIndex>=0),'Use --apply or --rollback <backup.json> only; remote is unsupported');
if(rollbackIndex>=0)assert.ok(args[rollbackIndex+1]&&!args[rollbackIndex+1].startsWith('--'),'Provide backup.json');
const root=fileURLToPath(new URL('../',import.meta.url));
const pkg=await reviewedPackage();
const {runtime,db}=await openLocalD1();
try {
  const before=await readContentSnapshot(db,pkg);
  const searchBefore=await verifySearchIndex(db,before);
  let patches;
  if(rollbackIndex>=0) {
    const path=resolve(root,args[rollbackIndex+1]),backupRoot=join(root,'.local','content-backups');
    const rel=relative(backupRoot,path);assert.ok(rel&&!rel.startsWith('..')&&!isAbsolute(rel),'Backup must be inside .local/content-backups');
    const backup=JSON.parse(await readFile(path,'utf8'));
    assert.equal(digest(backup.payload),backup.sha256,'Backup checksum mismatch');
    if(backup.payload.searchIndex)assert.deepEqual(backup.payload.searchIndex,searchIndexRows(backup.payload.content),'Backup index differs');
    assert.equal(backup.payload.candidateChecksum,pkg.candidateChecksum,'Backup belongs to a different review');
    const forward=planContentUpdate(backup.payload.content,pkg);
    const expected=structuredClone(backup.payload.content);
    for(const p of forward)expected[p.table][expected[p.table].findIndex(r=>r.id===p.id)]=p.after;
    assert.deepEqual(before,expected,'Content changed after apply; refusing rollback');
    patches=reverseContentPatches(forward);
  } else patches=planContentUpdate(before,pkg);
  const summary={target:'local .wrangler/state/v3',mode:rollbackIndex>=0?'rollback':'apply',rows:patches.length,quizRows:patches.filter(p=>p.table==='quiz_questions').length,searchRows:patches.filter(p=>searchIndexEntry(p.table,p.before)?.search_text!==searchIndexEntry(p.table,p.after)?.search_text).length,candidateChecksum:pkg.candidateChecksum};
  if(!args.includes('--apply')||!patches.length) {
    console.log(JSON.stringify({...summary,written:false,status:patches.length?'validated; add --apply to execute':'already current'},null,2));
  } else {
    // Backup covers the complete content snapshot; this operation never writes account/learner tables.
    const payload={createdAt:new Date().toISOString(),target:summary.target,sourceChecksum:pkg.sourceChecksum,candidateChecksum:pkg.candidateChecksum,content:before,searchIndex:searchBefore};
    const backupDir=join(root,'.local','content-backups');await mkdir(backupDir,{recursive:true});
    const backupPath=join(backupDir,`n5-${Date.now()}-${crypto.randomUUID()}.json`);
    const backup={sha256:digest(payload),payload};
    await writeFile(backupPath,JSON.stringify(backup,null,2)+'\n',{flag:'wx'});
    assert.equal(digest(JSON.parse(await readFile(backupPath,'utf8')).payload),backup.sha256);
    const excluded=new Set([...Object.keys(pkg.source),'assessment_revision','mutation_guards','content_search']);
    // D1 owns _cf_* internal metadata and forbids reading it through the binding.
    const protectedTables=(await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all()).results.map(r=>r.name).filter(n=>!excluded.has(n)&&!n.startsWith('_cf_'));
    assert.ok(protectedTables.every(n=>/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(n)));
    const protectedState=async()=>{
      const results=await db.batch(protectedTables.map(t=>db.prepare(`SELECT * FROM "${t}"`)));
      return results.map(r=>digest(r.results.map(row=>JSON.stringify(row)).sort()));
    };
    const protectedBefore=await protectedState();
    await applyContentPatches(db,patches);
    const expected=structuredClone(before);
    for(const p of patches)expected[p.table][expected[p.table].findIndex(r=>r.id===p.id)]=p.after;
    assert.deepEqual(await readContentSnapshot(db,pkg),expected,'Post-apply content differs');
    await verifySearchIndex(db,expected);
    assert.deepEqual(await protectedState(),protectedBefore,'Non-content state changed during operation');
    assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results,[]);
    const receipt={...summary,written:true,backupPath,verified:true,nonContentTablesUnchanged:true,foreignKeyViolations:0,completedAt:new Date().toISOString()};
    await writeFile(join(backupDir,'latest-result.json'),JSON.stringify(receipt,null,2)+'\n');
    console.log(JSON.stringify(receipt,null,2));
  }
} finally {await runtime.dispose();}
