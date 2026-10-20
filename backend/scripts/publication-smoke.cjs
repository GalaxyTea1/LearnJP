// Local PostgreSQL integration test. Creates an isolated schema, applies the
// complete migration history, then drops only that randomly named test schema.
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');
const config = require('dotenv').parse(readFileSync('.env'));
const url = new URL(process.env.DATABASE_URL || config.DATABASE_URL);
if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new Error('Smoke test only permits local PostgreSQL');
const schema = `publication_smoke_${randomBytes(8).toString('hex')}`;
url.searchParams.set('schema', schema);
process.env.DATABASE_URL = url.toString();
process.env.NODE_ENV = 'production';
process.env.FRONTEND_URL = 'https://app.example.test';
process.env.JWT_SECRET = randomBytes(48).toString('hex');
process.env.JWT_REFRESH_EXPIRES_IN = '2d';
process.env.REFRESH_COOKIE_SAME_SITE = 'lax';
const db = new PrismaClient({ datasources: { db: { url: url.toString() } } });
let server, appDb, schemaCreated = false;
async function main() {
  assert.match(schema, /^publication_smoke_[a-f0-9]{16}$/);
  await db.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`);
  schemaCreated = true;
  const migrated = spawnSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'deploy'], {
    env: process.env, encoding: 'utf8', timeout: 60000,
  });
  assert.equal(migrated.status, 0, `Isolated migration failed: ${migrated.stderr}`);
  console.log('PASS: all migrations on isolated PostgreSQL schema');
  const app = require('../dist/app').default;
  appDb = require('../dist/config/prisma').prisma;
  // Expected negative requests are asserted below, without noisy error logs.
  require('../dist/utils/logger').logger.silent = true;
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/v1`;
  async function request(path, { body, cookie, token, csrf = true, origin = process.env.FRONTEND_URL, method } = {}) {
    const headers = { 'Content-Type': 'application/json', Origin: origin };
    if (csrf) headers['X-Requested-With'] = 'SumaryJP';
    if (cookie) headers.Cookie = cookie;
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(base + path, { method: method || (body ? 'POST' : 'GET'), headers,
      ...(body ? { body: JSON.stringify(body) } : {}) });
    return { status: response.status, body: await response.json(), cookie: response.headers.get('set-cookie'), headers: response.headers };
  }
  const level = await db.jlptLevel.create({data:{level:'N5',title:'Test',titleJp:'Test',color:'#000',badge:'Test',description:'Test',totalVocab:0,totalKanji:0,totalGrammar:0,sortOrder:1}});
  const modules=[];
  for (const [i,status] of ['PUBLISHED','DRAFT','ARCHIVED'].entries()) {
    modules.push(await db.learningModule.create({data:{levelId:level.id,unitNumber:i+1,title:status,titleJp:'Test',description:'Test',topics:[],sortOrder:i,contentStatus:status}}));
  }
  const [pub,draft,archived]=modules;
  const section=await db.lessonSection.create({data:{moduleId:pub.id,sectionType:'READING',title:'Visible section',sortOrder:1,status:'PUBLISHED'}});
  await db.lessonSection.create({data:{moduleId:pub.id,sectionType:'READING',title:'Hidden section',sortOrder:2,status:'DRAFT'}});
  const passage=await db.readingPassage.create({data:{sectionId:section.id,title:'Hidden passage',content:'Hidden text',sortOrder:1,status:'DRAFT'}});
  await db.lessonExercise.create({data:{sectionId:section.id,readingPassageId:passage.id,exerciseType:'MULTIPLE_CHOICE',prompt:'Hidden linked exercise',sortOrder:1,status:'PUBLISHED'}});
  await db.lessonExercise.create({data:{sectionId:section.id,exerciseType:'MULTIPLE_CHOICE',prompt:'Visible exercise',sortOrder:2,status:'PUBLISHED'}});
  await db.conversation.create({data:{sectionId:section.id,title:'Hidden conversation',sortOrder:1,status:'DRAFT'}});
  await db.writingTask.create({data:{sectionId:section.id,title:'Hidden writing',prompt:'Hidden',sortOrder:1,status:'DRAFT'}});
  await db.listeningContent.create({data:{sectionId:section.id,title:'Hidden listening',audioUrl:'PENDING_AUDIO',transcript:'Hidden',sortOrder:1,status:'DRAFT'}});
  const vocab=[]; const kanji=[]; const grammar=[]; const quizzes=[];
  for (const [i,m] of modules.entries()) {
    vocab.push(await db.vocabulary.create({data:{moduleId:m.id,japanese:'Word'+i,romaji:'word',english:'word',type:'NOUN'}}));
    kanji.push(await db.kanji.create({data:{moduleId:m.id,character:['日','月','火'][i],meaning:'Test',level:'N5'}}));
    grammar.push(await db.grammarPattern.create({data:{moduleId:m.id,pattern:'Test'+i,meaning:'Test',explanation:'Test',level:'N5'}}));
    quizzes.push(await db.quizQuestion.create({data:{moduleId:m.id,question:'Test',options:['A','B'],correctIndex:0,explanation:'Test'}}));
  }
  await db.vocabulary.create({data:{japanese:'Unassigned',romaji:'none',english:'none',type:'NOUN'}});
  const registered=await request('/auth/register',{body:{email:'publication@example.test',username:'publication_test',password:'test-password-123'}});
  assert.equal(registered.status,201);
  const token=registered.body.data.accessToken; const userId=registered.body.data.user.id;
  for (const m of modules) await db.userModuleProgress.create({data:{userId,moduleId:m.id,status:'COMPLETED',progressPercent:100}});
  await db.userFlashcardProgress.create({data:{userId,itemType:'VOCAB',itemId:vocab[1].id,nextReview:new Date(0)}});
  for (const auth of [{},{token}]) {
    const list=await request('/modules',auth); assert.deepEqual(list.body.data.map(m=>m.id),[pub.id]);
    assert.equal((await request('/levels',auth)).body.data[0]._count.modules,1);
    assert.equal((await request('/levels/N5',auth)).body.data.modules.length,1);
    const full=await request('/modules/'+pub.id+'/full',auth);
    assert.equal(full.status,200);assert.equal(full.body.data.sections.length,1);
    const children=full.body.data.sections[0]; assert.equal(children.exercises.length,1);
    for(const key of ['readingPassages','conversations','listeningContent','writingTasks']) assert.equal(children[key].length,0);
    for(const m of [draft,archived]) {
      for(const path of ['/modules/'+m.id,'/modules/'+m.id+'/full']) assert.equal((await request(path,auth)).status,404);
      assert.equal((await request('/quizzes/module/'+m.id,auth)).body.data.length,0);
    }
    for(const [route,rows] of [['vocabulary',vocab],['kanji',kanji],['grammar',grammar]]) {
      assert.equal((await request('/'+route,auth)).body.data.length,1);
      assert.equal((await request('/'+route+'/'+rows[1].id,auth)).status,404);
      assert.equal((await request('/'+route+'?moduleId='+draft.id,auth)).body.data.length,0);
      assert.equal((await request('/'+route+'?preview=true',auth)).status,403);
    }
    assert.equal((await request('/modules?preview=true',auth)).status,403);
    assert.equal((await request('/modules/'+draft.id+'/full?preview=true',auth)).status,403);
  }
  assert.equal((await request('/quizzes/submit',{token,body:{requestId:require("node:crypto").randomUUID(),moduleId:draft.id,answers:[{questionId:quizzes[1].id,selectedIndex:0}]}})).status,404);
  assert.equal((await request('/progress/module',{token,body:{requestId:require("node:crypto").randomUUID(),moduleId:draft.id,status:'IN_PROGRESS',progressPercent:25}})).status,404);
  assert.equal((await request('/flashcards/review',{token,body:{itemType:'VOCAB',itemId:vocab[1].id,quality:5}})).status,404);
  assert.equal((await request('/flashcards/due',{token})).body.data.length,0);
  const progress=(await request('/progress/me',{token})).body.data;
  assert.equal(progress.overview.totalModules,1);assert.equal(progress.overview.completedModules,1);
  assert.equal(progress.allModuleProgress.length,1);assert.equal(progress.levelStats[0].total_modules,1);
  const review=(await request('/progress/review-items',{token})).body.data;
  assert.deepEqual(review.vocab.map(v=>v.id),[vocab[0].id]);
  assert.equal(await db.userQuizAttempt.count(),0);
  console.log('PASS: guest/user lists, nested content, item search/detail, quiz, progress, review and flashcard draft protection');
  for(const role of ['ADMIN','MODERATOR']) {
    await db.user.update({where:{id:userId},data:{role}});
    const preview=await request('/modules/'+draft.id+'/full?preview=true',{token});
    assert.equal(preview.status,200);assert.equal(preview.headers.get('cache-control'),'no-store');
    assert.equal((await request('/modules?preview=true',{token})).body.data.length,3);
    assert.equal((await request('/vocabulary?preview=true',{token})).body.data.length,4);
    assert.equal((await request('/modules/'+draft.id,{token})).status,404);
    const nested=(await request('/modules/'+pub.id+'/full?preview=true',{token})).body.data;
    assert.equal(nested.sections.length,2); assert.equal(nested.sections[0].readingPassages.length,1);
  }
  await db.user.update({where:{id:userId},data:{isActive:false}});
  assert.equal((await request('/modules?preview=true',{token})).status,403);
  console.log('PASS: explicit ADMIN/MODERATOR preview, public mode remains filtered, inactive identity rejected');
  await require('./n5-sample-mocks-check.cjs')(db, request, level, userId, token);
  await require('./study-progress-check.cjs')(db, request, pub, userId, token, vocab[0].id);
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  if (appDb) await appDb.$disconnect();
  if (schemaCreated) {
    assert.match(schema, /^publication_smoke_[a-f0-9]{16}$/);
    await db.$executeRawUnsafe(`DROP SCHEMA "${schema}" CASCADE`);
    console.log('Cleaned up isolated test schema');
  }
  await db.$disconnect();
});
