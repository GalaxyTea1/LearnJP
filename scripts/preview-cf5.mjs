// Disposable local UI fixture. Never uses the main .wrangler database or remote bindings.
import {mkdtemp,mkdir,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {getPlatformProxy,unstable_dev} from 'wrangler';
import {migrate,load} from './learning-fixture.mjs';
import {reviewSnapshot,digest} from './n5-content-review.mjs';

const root=fileURLToPath(new URL('../',import.meta.url)),config=join(root,'wrangler.local.jsonc');
await mkdir(join(root,'.local'),{recursive:true});
const reviewUnit1=process.argv.includes('--review-unit1');
const state=await mkdtemp(join(root,'.local',reviewUnit1?'n5-review-preview-':'cf5-preview-'));
const proxy=await getPlatformProxy({configPath:config,persist:{path:join(state,'v3')},remoteBindings:false,envFiles:[]});
try {
  const db=proxy.env.DB;await migrate(db);
  const original=JSON.parse(await readFile(join(root,'.local/content/n5.json'),'utf8'));
  const manifest=JSON.parse(await readFile(join(root,'docs/CF2-CONTENT-MANIFEST.json'),'utf8'));
  if(digest(original)!==manifest.sha256)throw new Error('Source snapshot changed; re-review it first');
  const data=reviewUnit1?reviewSnapshot(original).candidate:original;
  const fields=JSON.parse(await readFile(join(root,'backend/cloudflare/columns.json'),'utf8'));
  for(const [table,rows] of Object.entries(data)) {
    for(let i=0;i<rows.length;i+=40)await db.batch(rows.slice(i,i+40).map(row=>db.prepare(`INSERT INTO ${table} (${fields[table].map(f=>f.column).join(',')}) VALUES (${fields[table].map(()=>'?').join(',')})`).bind(...fields[table].map(f=>row[f.name]==null?null:f.type==='Json'?JSON.stringify(row[f.name]):f.type==='Boolean'?Number(row[f.name]):row[f.name]))));
  }
  for(const [table,kind,keys] of [['vocabulary','vocabulary',['japanese','hiragana','romaji','english']],['kanji','kanji',['character','meaning','onyomi','kunyomi']],['grammar_patterns','grammar',['pattern','meaning','explanation']]]) {
    for(let i=0;i<data[table].length;i+=40)await db.batch(data[table].slice(i,i+40).map(row=>db.prepare('INSERT INTO content_search(kind,item_id,search_text) VALUES (?,?,?)').bind(kind,row.id,keys.map(k=>row[k]||'').join('\u001f').toLowerCase())));
  }
  const {Auth}=await load('auth');
  if(reviewUnit1) {
    // Deliberately limited to this newly-created disposable database. Not a release action.
    await db.prepare("UPDATE lesson_sections SET status='PUBLISHED' WHERE module_id=7").run();
    for(const table of ['conversations','listening_content','reading_passages','writing_tasks','lesson_exercises'])await db.prepare(`UPDATE ${table} SET status='PUBLISHED' WHERE section_id IN (SELECT id FROM lesson_sections WHERE module_id=7)`).run();
  }
  await new Auth(proxy.env).register({email:'cf5@test.invalid',username:'cf5_learner',password:'CF5-local-only-123'});
}finally{await proxy.dispose();}
console.log('Disposable UI database: '+state);
if(reviewUnit1)console.log('REVIEW ONLY: Unit 1 including TTS opened in disposable database; main D1 and publication manifest unchanged.');
console.log('Local fixture login: cf5_learner / CF5-local-only-123');
const server=await unstable_dev(join(root,'backend/cloudflare/worker.ts'),{config,envFiles:[],local:true,persist:true,persistTo:state,ip:'127.0.0.1',port:8787,logLevel:'error',experimental:{disableExperimentalWarning:true,disableDevRegistry:true,watch:false}});
console.log(`Preview ready: http://${server.address}:${server.port}`);
await new Promise(resolve=>{process.once('SIGINT',resolve);process.once('SIGTERM',resolve);});
await server.stop();
