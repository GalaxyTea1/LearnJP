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
const schema = `quiz_retry_smoke_${randomBytes(8).toString('hex')}`;
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
  assert.match(schema, /^quiz_retry_smoke_[a-f0-9]{16}$/);
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
  const module = await db.learningModule.create({data:{levelId:level.id,unitNumber:1,title:'Retry test',titleJp:'Test',description:'Test',topics:[],sortOrder:1,contentStatus:'PUBLISHED'}});
  const question = await db.quizQuestion.create({data:{moduleId:module.id,question:'Test',options:['A','B'],correctIndex:0,explanation:'Test'}});
  const registered=await request('/auth/register',{body:{email:'retry@example.test',username:'retrytest',password:'StrongTest123!'}});
  assert.equal(registered.status,201);
  const token=registered.body.data.accessToken;
  const userId=registered.body.data.user.id;
  const quiz=await request(`/quizzes/module/${module.id}`);
  const body={moduleId:module.id,answers:[{questionId:question.id,selectedIndex:0}],timeTaken:12,quizRevision:quiz.body.meta.quizRevision,requestId:require('node:crypto').randomUUID()};
  const send=body=>request('/quizzes/submit',{token,body});
  const parallel=await Promise.all([send(body),send(body)]);
  assert.deepEqual(parallel.map(r=>r.status),[200,200]);
  assert.deepEqual(parallel[0].body.data,parallel[1].body.data);
  const replay=await send(body); // First response could have been lost after commit.
  assert.deepEqual(replay.body.data,parallel[0].body.data);
  assert.equal(await db.userQuizAttempt.count({where:{userId}}),1);
  assert.equal((await db.userGamification.findUnique({where:{userId}})).xp,10);
  assert.equal((await send({...body,timeTaken:13})).status,409);
  assert.equal((await send({...body,requestId:undefined})).status,400);
  await db.quizQuestion.update({where:{id:question.id},data:{correctIndex:1}});
  assert.deepEqual((await send(body)).body.data,replay.body.data);
  assert.equal((await send({...body,requestId:require('node:crypto').randomUUID()})).status,409);
  assert.equal(await db.userQuizAttempt.count({where:{userId}}),1);
  console.log('PASS: concurrent same-key requests, lost-response replay, one attempt/XP award, changed payload, missing key and changed revision');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  if (appDb) await appDb.$disconnect();
  if (schemaCreated) {
    assert.match(schema, /^quiz_retry_smoke_[a-f0-9]{16}$/);
    await db.$executeRawUnsafe(`DROP SCHEMA "${schema}" CASCADE`);
    console.log('Cleaned up isolated test schema');
  }
  await db.$disconnect();
});
