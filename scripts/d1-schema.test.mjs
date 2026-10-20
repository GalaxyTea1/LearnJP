import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getPlatformProxy, unstable_splitSqlQuery } from 'wrangler';
import { fileURLToPath } from 'node:url';
import { build } from '../frontend/node_modules/esbuild/lib/main.js';

test('isolated D1 enforces constraints and rolls back an invalid batch',async()=>{
  const proxy=await getPlatformProxy({configPath:fileURLToPath(new URL('../wrangler.local.jsonc',import.meta.url)),persist:false,remoteBindings:false,envFiles:[]});
  const db=proxy.env.DB;
  try {
    for(const file of ['0001_initial.sql','0002_content_search.sql','0003_auth_sessions.sql','0004_learning_writes.sql']) {
      const sql=await readFile(new URL('../backend/cloudflare/migrations/'+file,import.meta.url),'utf8');
      await db.batch(unstable_splitSqlQuery(sql).map(s=>db.prepare(s)));
    }
    const insert=db.prepare("INSERT INTO users(email,username,password_hash) VALUES (?,?,?)");
    await assert.rejects(db.batch([insert.bind('a@test.invalid','learner','hash'),insert.bind('a@test.invalid','duplicate','hash')]));
    assert.equal((await db.prepare('SELECT count(*) n FROM users').first()).n,0);
    await assert.rejects(db.prepare("INSERT INTO refresh_tokens(token,user_id,expires_at) VALUES ('x',999,'2030-01-01T00:00:00.000Z')").run());
    await assert.rejects(db.prepare("INSERT INTO users(email,username,password_hash,role) VALUES ('a@test.invalid','a','h','OWNER')").run());
    await insert.bind('a@test.invalid','learner','hash').run();
    await assert.rejects(db.prepare("INSERT INTO user_gamification(user_id,badges) VALUES (1,'not-json')").run());
    await db.prepare("INSERT INTO refresh_tokens(token,user_id,expires_at) VALUES ('x',1,'2030-01-01T00:00:00.000Z')").run();
    await db.prepare('DELETE FROM users WHERE id=1').run();
    assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens').first()).n,0);
    assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results,[]);
    // Published child under a draft parent must still remain private.
    const snapshot=JSON.parse(await readFile(new URL('../.local/content/n5.json',import.meta.url),'utf8'));
    const fields=JSON.parse(await readFile(new URL('../backend/cloudflare/columns.json',import.meta.url),'utf8'));
    const add=async(table,row)=>db.prepare(`INSERT INTO ${table} (${fields[table].map(f=>f.column).join(',')}) VALUES (${fields[table].map(()=>'?').join(',')})`).bind(...fields[table].map(f=>row[f.name]==null?null:f.type==='Json'?JSON.stringify(row[f.name]):f.type==='Boolean'?Number(row[f.name]):row[f.name])).run();
    await add('jlpt_levels',snapshot.jlpt_levels[0]);
    const m={...snapshot.learning_modules.find(m=>m.contentStatus==='PUBLISHED')};await add('learning_modules',m);
    const s={...snapshot.lesson_sections[0],moduleId:m.id,status:'DRAFT'};await add('lesson_sections',s);
    const c={...snapshot.conversations[0],sectionId:s.id,status:'PUBLISHED'};await add('conversations',c);
    const bundled=await build({entryPoints:[fileURLToPath(new URL('../backend/cloudflare/content.ts',import.meta.url))],bundle:true,format:'esm',platform:'browser',write:false});
    const {Content,searchJisho}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
    const repo=new Content(db,'local-only-quiz-revision-key-not-for-production');
    assert.deepEqual((await repo.full(m.id,true)).sections,[]);
    // A public exercise linked to a draft reading must be hidden too.
    await db.prepare("UPDATE lesson_sections SET status='PUBLISHED' WHERE id=?").bind(s.id).run();
    const reading={...snapshot.reading_passages[0],sectionId:s.id,status:'DRAFT'};await add('reading_passages',reading);
    const exercise={...snapshot.lesson_exercises[0],sectionId:s.id,status:'PUBLISHED',readingPassageId:reading.id,listeningId:null};await add('lesson_exercises',exercise);
    assert.deepEqual((await repo.full(m.id,true)).sections[0].exercises,[]);
    const n4={...snapshot.jlpt_levels[0],id:9999,level:'N4'};await add('jlpt_levels',n4);
    await add('learning_modules',{...m,id:9999,levelId:9999});
    await assert.rejects(repo.module(9999),{status:404});
    assert.deepEqual(await repo.modules(new URLSearchParams({level:'N4'})),[]);
    const template={id:9999,title:'private template',level:'N5',description:null,durationMinutes:10,totalQuestions:1,isPublished:false,createdBy:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    await add('test_templates',template);
    await assert.rejects(repo.templates(new URLSearchParams(),9999),{status:404});
    await db.prepare("UPDATE learning_modules SET content_status='DRAFT' WHERE id=?").bind(m.id).run();
    await assert.rejects(repo.full(m.id,true),{status:404});
    await assert.rejects(searchJisho('test',async()=>new Response('{}',{status:200})),{status:502});
    const result=await searchJisho('test',async(url)=>{assert.equal(url.origin,'https://jisho.org');return Response.json({data:[{japanese:[{reading:'てすと'}],senses:[{english_definitions:['test']}]}]});});
    assert.equal(result[0].jp,'てすと');
  } finally {await proxy.dispose();}
});
