import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { getPlatformProxy, unstable_splitSqlQuery } from 'wrangler';
import { build } from '../frontend/node_modules/esbuild/lib/main.js';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

let proxy, db, env, worker, Auth, authenticate, consumeLimit, digest, moduleId;
const key='local-only-auth-key-never-use-in-production-2026';
const origin='http://127.0.0.1:8787';
let sequence=0;
const input=()=>({email:`learner${++sequence}@test.invalid`,username:`learner${sequence}`,password:'Test-only-password-123',displayName:'Học viên 日本'});
const cookieOf=r=>r.headers.get('set-cookie')?.split(';')[0];
const rawCookie=r=>cookieOf(r)?.split('=')[1];
const bearer=token=>new Request(origin+'/api/v1/auth/me',{headers:{Authorization:'Bearer '+token}});
async function request(path, {method='GET',token,cookie,body,headers={},environment=env}={}) {
  const h={'Content-Type':'application/json','X-Requested-With':'SumaryJP',Origin:environment.FRONTEND_URL,...headers};
  if(token)h.Authorization='Bearer '+token;
  if(cookie)h.Cookie=cookie;
  return worker.fetch(new Request(origin+'/api/v1'+path,{method,headers:h,...(body!==undefined?{body:typeof body==='string'?body:JSON.stringify(body)}:{})}),environment);
}
before(async()=>{
  proxy=await getPlatformProxy({configPath:fileURLToPath(new URL('../wrangler.local.jsonc',import.meta.url)),persist:false,remoteBindings:false,envFiles:[]});
  db=proxy.env.DB;
  env={...proxy.env,APP_ENV:'local',FRONTEND_URL:origin,JWT_SECRET:key};
  for(const file of ['0001_initial.sql','0002_content_search.sql','0003_auth_sessions.sql','0004_learning_writes.sql']) {
    const sql=await readFile(new URL('../backend/cloudflare/migrations/'+file,import.meta.url),'utf8');
    await db.batch(unstable_splitSqlQuery(sql).map(s=>db.prepare(s)));
  }
  const load=async name=>{
    const output=await build({entryPoints:[fileURLToPath(new URL(`../backend/cloudflare/${name}.ts`,import.meta.url))],bundle:true,format:'esm',platform:'browser',write:false});
    return import('data:text/javascript;base64,'+Buffer.from(output.outputFiles[0].text).toString('base64'));
  };
  worker=(await load('worker')).default;
  ({Auth,authenticate,consumeLimit,digest}=await load('auth'));
  const data=JSON.parse(await readFile(new URL('../.local/content/n5.json',import.meta.url),'utf8'));
  const fields=JSON.parse(await readFile(new URL('../backend/cloudflare/columns.json',import.meta.url),'utf8'));
  const insert=async(table,row)=>db.prepare(`INSERT INTO ${table} (${fields[table].map(f=>f.column).join(',')}) VALUES (${fields[table].map(()=>'?').join(',')})`).bind(...fields[table].map(f=>row[f.name]==null?null:f.type==='Json'?JSON.stringify(row[f.name]):f.type==='Boolean'?Number(row[f.name]):row[f.name])).run();
  await insert('jlpt_levels',data.jlpt_levels[0]);
  const module=data.learning_modules.find(m=>m.contentStatus==='PUBLISHED');moduleId=module.id;
  await insert('learning_modules',module);
});
after(async()=>{await proxy?.dispose();});
beforeEach(async()=>{
  await db.batch([db.prepare('DELETE FROM users'),db.prepare('DELETE FROM auth_rate_limits')]);
});

test('registration creates an atomic default account, hashed session and compatible profile',async()=>{
  const data=input();
  const r=await request('/auth/register',{method:'POST',body:{...data,email:'  '+data.email.toUpperCase()+' ',role:'ADMIN',isActive:false}});
  assert.equal(r.status,201);
  assert.match(r.headers.get('set-cookie'),/^sumaryjp_refresh=.+; Path=\/api\/v1\/auth; HttpOnly; SameSite=Lax; Max-Age=604800$/);
  assert.equal(r.headers.get('cache-control'),'no-store');
  const payload=await r.json();
  assert.equal(payload.data.user.role,'USER');assert.equal(payload.data.user.email,data.email);
  assert.equal(payload.data.user.displayName,data.displayName);
  assert.equal('refreshToken' in payload.data,false);assert.equal('passwordHash' in payload.data.user,false);
  const row=await db.prepare('SELECT * FROM users').first();
  assert.match(row.password_hash,/^\$2[ab]\$10\$/);assert.ok(await bcrypt.compare(data.password,row.password_hash));
  const session=await db.prepare('SELECT * FROM refresh_tokens').first();
  assert.equal(session.token,await digest(rawCookie(r)));assert.notEqual(session.token,rawCookie(r));
  const me=await request('/auth/me',{token:payload.data.accessToken});assert.equal(me.status,200);
  const profile=(await me.json()).data;
  assert.equal(profile.learningSettings.weeklyGoalTarget,20);assert.equal(profile.gamification.xp,0);
  assert.deepEqual(profile.gamification.badges,[]);assert.equal(profile.gamification.stats.quizzesTaken,0);
  assert.equal(JSON.stringify(profile).includes('password'),false);
  for(const login of [data.username,' '+data.email.toUpperCase()+' ']) {
    assert.equal((await request('/auth/login',{method:'POST',body:{login,password:data.password}})).status,200);
  }
  assert.equal((await request('/auth/login',{method:'POST',body:{login:data.username,password:'incorrect'}})).status,401);
});

test('registration validates inputs, forbids bcrypt truncation and accepts exactly 72 UTF-8 bytes',async()=>{
  const auth=new Auth(env);
  for(const extra of [{email:'invalid'},{username:'aa'},{username:'bad name'},{password:'short'},{password:'a'.repeat(73)},{password:'あ'.repeat(25)},{displayName:' '},{displayName:'a'.repeat(81)}]) {
    await assert.rejects(auth.register({...input(),...extra}),{status:400});
  }
  const data={...input(),password:'あ'.repeat(24)};
  await auth.register(data);
  assert.ok((await auth.login({login:data.email,password:data.password})).data.accessToken);
  assert.equal((await db.prepare('SELECT count(*) n FROM users').first()).n,1);
});

test('duplicate concurrent registration commits one complete account; dependent failure rolls back',async()=>{
  const data=input(), auth=new Auth(env);
  const results=await Promise.allSettled([auth.register(data),auth.register({...data,username:'other_user'})]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  assert.equal(results.find(r=>r.status==='rejected').reason.status,400);
  for(const table of ['users','user_learning_settings','user_gamification','refresh_tokens'])assert.equal((await db.prepare(`SELECT count(*) n FROM ${table}`).first()).n,1);
  const winner=results.find(r=>r.status==='fulfilled').value;
  await assert.rejects(auth.register({...input(),username:winner.data.user.username}),{status:400});
  await db.exec("CREATE TRIGGER fail_game BEFORE INSERT ON user_gamification BEGIN SELECT RAISE(ABORT, 'injected failure'); END;");
  try {
    const failed=await request('/auth/register',{method:'POST',body:input()});assert.equal(failed.status,503);assert.equal(cookieOf(failed),undefined);
    for(const table of ['users','user_learning_settings','user_gamification','refresh_tokens'])assert.equal((await db.prepare(`SELECT count(*) n FROM ${table}`).first()).n,1);
  } finally {await db.exec('DROP TRIGGER fail_game');}
  assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results,[]);
});

test('CSRF, JSON type, bounded body and HTTP methods reject before account mutation',async()=>{
  for(const headers of [{'X-Requested-With':''},{Origin:'https://evil.invalid'},{'Sec-Fetch-Site':'cross-site'}]) {
    assert.equal((await request('/auth/register',{method:'POST',body:input(),headers})).status,403);
  }
  assert.equal((await request('/auth/register',{method:'POST',body:'{'})).status,400);
  assert.equal((await request('/auth/register',{method:'POST',body:' '.repeat(8193)})).status,413);
  assert.equal((await request('/auth/register',{method:'POST',body:input(),headers:{'Content-Type':'text/plain'}})).status,415);
  assert.equal((await request('/auth/login')).status,405);
  assert.equal((await request('/auth/me',{method:'POST'})).status,405);
  assert.equal((await request('/auth/unknown')).status,404);
  assert.equal((await db.prepare('SELECT count(*) n FROM users').first()).n,0);
});

test('JWT enforces signature, algorithm, issuer, audience, expiry, token type and issued time',async()=>{
  const auth=new Auth(env),session=await auth.register(input());
  const original=JSON.parse(Buffer.from(session.data.accessToken.split('.')[1],'base64url'));
  const sign=async(payload,secret=key,alg='HS256')=>new SignJWT(payload).setProtectedHeader({alg}).sign(new TextEncoder().encode(secret));
  const tokens=[session.refresh, 'not.a.token',await sign(original,'wrong-secret-that-is-at-least-32-bytes'),await sign(original,key,'HS384')];
  for(const change of [{iss:'wrong'},{aud:'wrong'},{exp:1},{iat:Math.floor(Date.now()/1000)+3600},{tokenType:'refresh'},{sid:'bad'},{userId:'1'},{jti:null}])tokens.push(await sign({...original,...change}));
  for(const token of tokens)await assert.rejects(authenticate(bearer(token),env),{status:401});
  assert.equal((await authenticate(bearer(session.data.accessToken),env)).id,session.data.user.id);
  assert.equal((await request('/modules',{token:'fake'})).status,401);
});

test('refresh is cookie-only, rotates once and never overwrites the winning cookie on failure',async()=>{
  const r=await request('/auth/register',{method:'POST',body:input()});const old=rawCookie(r);
  assert.equal((await request('/auth/refresh',{method:'POST',body:{refreshToken:old}})).status,401);
  const rotated=await request('/auth/refresh',{method:'POST',cookie:cookieOf(r),body:{}});
  assert.equal(rotated.status,200);assert.notEqual(rawCookie(rotated),old);
  assert.equal('refreshToken' in (await rotated.json()).data,false);
  const replay=await request('/auth/refresh',{method:'POST',cookie:cookieOf(r),body:{}});
  assert.equal(replay.status,401);assert.equal(cookieOf(replay),undefined);
  const logout=await request('/auth/logout',{method:'POST',cookie:cookieOf(rotated),body:{}});
  assert.equal(logout.status,200);assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
  assert.equal((await request('/auth/logout',{method:'POST',body:{}})).status,200);
});

test('20 simultaneous refreshes have one winner; stale-cookie logout revokes its successor and access',async()=>{
  const auth=new Auth(env),session=await auth.register(input());
  const results=await Promise.allSettled(Array.from({length:20},()=>auth.refresh(session.refresh)));
  const winners=results.filter(r=>r.status==='fulfilled');assert.equal(winners.length,1);
  for(const r of results.filter(r=>r.status==='rejected'))assert.ok([401,409].includes(r.reason.status));
  const winner=winners[0].value;
  const row=await db.prepare('SELECT * FROM refresh_tokens').first();assert.equal(row.token,await digest(winner.refresh));
  assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens').first()).n,1);
  await authenticate(bearer(session.data.accessToken),env);
  await auth.logout(session.refresh);
  await assert.rejects(auth.refresh(winner.refresh),{status:401});
  for(const token of [session.data.accessToken,winner.data.accessToken])await assert.rejects(authenticate(bearer(token),env),{status:401});
});

test('failed token rotation leaves the original session usable',async()=>{
  const session=await new Auth(env).register(input());
  await db.exec("CREATE TRIGGER fail_rotation BEFORE UPDATE ON refresh_tokens BEGIN SELECT RAISE(ABORT, 'injected rotation failure'); END;");
  try {
    const failed=await request('/auth/refresh',{method:'POST',body:{},cookie:'sumaryjp_refresh='+session.refresh});
    assert.equal(failed.status,503);assert.equal(cookieOf(failed),undefined);
    assert.equal((await db.prepare('SELECT token FROM refresh_tokens').first()).token,await digest(session.refresh));
  } finally {await db.exec('DROP TRIGGER fail_rotation');}
  await new Auth(env).refresh(session.refresh);
});

test('logout racing with refresh leaves no live session; logging out one device preserves another',async()=>{
  const auth=new Auth(env),data=input();let session=await auth.register(data);
  for(let i=0;i<5;i++) {
    await Promise.allSettled([auth.refresh(session.refresh),auth.logout(session.refresh)]);
    assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens').first()).n,0);
    await assert.rejects(authenticate(bearer(session.data.accessToken),env),{status:401});
    session=await auth.login({login:data.username,password:data.password});
  }
  const other=await auth.login({login:data.username,password:data.password});
  await auth.logout(session.refresh);
  await authenticate(bearer(other.data.accessToken),env);
});

test('authorization uses live account status and role, with gates on unfinished APIs',async()=>{
  const auth=new Auth(env),data=input(),session=await auth.register(data),token=session.data.accessToken;
  for(const path of ['/admin/dashboard','/progress/me','/users/dashboard','/tests/attempts'])assert.equal((await request(path)).status,401);
  assert.equal((await request('/admin/dashboard',{token})).status,403);
  assert.equal((await request('/modules',{method:'POST',token,body:{}})).status,403);
  assert.equal((await request('/progress/module',{method:'POST',token,body:{}})).status,400);
  for(const role of ['ADMIN','MODERATOR']) {
    await db.prepare('UPDATE users SET role=? WHERE id=?').bind(role,session.data.user.id).run();
    assert.equal((await request('/admin/dashboard',{token})).status,200);
    assert.equal((await request('/modules?preview=true',{token})).status,200);
  }
  await db.prepare("UPDATE users SET role='USER' WHERE id=?").bind(session.data.user.id).run();
  assert.equal((await request('/admin/dashboard',{token})).status,403);
  await db.prepare('UPDATE users SET is_active=0 WHERE id=?').bind(session.data.user.id).run();
  await assert.rejects(authenticate(bearer(token),env),{status:401});
  await assert.rejects(auth.refresh(session.refresh),{status:401});
  await assert.rejects(auth.login({login:data.username,password:data.password}),{status:401});
});

test('content reads return only this learner progress and never create progress on GET',async()=>{
  const auth=new Auth(env),a=await auth.register(input()),b=await auth.register(input());
  await db.prepare("INSERT INTO user_module_progress(user_id,module_id,status,progress_percent) VALUES (?,?,'IN_PROGRESS',60)").bind(a.data.user.id,moduleId).run();
  const before=(await db.prepare('SELECT count(*) n FROM user_module_progress').first()).n;
  for(const [token,percent] of [[a.data.accessToken,60],[b.data.accessToken,0],[undefined,0]]) {
    const modules=await request('/modules',{token});assert.equal(modules.status,200);assert.equal((await modules.json()).data[0].progressPercent,percent);
    const full=await request(`/modules/${moduleId}/full`,{token});assert.equal(full.status,200);assert.equal((await full.json()).data.userProgress.progressPercent,percent);
    assert.equal((await (await request('/levels',{token})).json()).data[0].userProgressPercent,percent);
  }
  assert.equal((await db.prepare('SELECT count(*) n FROM user_module_progress').first()).n,before);
});

test('D1 rate limits are atomic across callers, reset correctly and clean expired records',async()=>{
  const hits=await Promise.all(Array.from({length:40},()=>consumeLimit(db,'shared-client',10)));
  assert.equal(hits.filter(r=>r.allowed).length,10);
  const row=await db.prepare('SELECT * FROM auth_rate_limits').first();assert.equal(row.count,40);assert.equal(row.key,await digest('shared-client'));
  await db.prepare("UPDATE auth_rate_limits SET reset_at='2000-01-01T00:00:00.000Z'").run();
  const reset=await consumeLimit(db,'shared-client',10);assert.equal(reset.headers['RateLimit-Remaining'],'9');
  const account=await new Auth(env).register(input());
  await db.prepare("UPDATE refresh_tokens SET expires_at='2000-01-01T00:00:00.000Z'").run();
  await consumeLimit(db,'cleanup-client',10);
  assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens').first()).n,0);
  await assert.rejects(authenticate(bearer(account.data.accessToken),env),{status:401});
});

test('template counts preserve the aggregate contract without exposing learner attempts',async()=>{
  const session=await new Auth(env).register(input());
  const template=await db.prepare("INSERT INTO test_templates(title,level,duration_minutes,total_questions,is_published) VALUES ('Test fixture','N5',10,0,1) RETURNING id").first();
  try {
    await db.prepare('INSERT INTO user_test_attempts(user_id,template_id,max_score) VALUES (?,?,0)').bind(session.data.user.id,template.id).run();
    for(const token of [undefined,session.data.accessToken]) {
      const r=await request('/tests/templates',{token});assert.equal(r.status,200);
      const t=(await r.json()).data.find(t=>t.id===template.id);assert.equal(t._count.attempts,1);assert.equal('attempts' in t,false);
      assert.equal((await request('/tests/templates/'+template.id,{token})).status,200);
    }
  } finally {await db.prepare('DELETE FROM test_templates WHERE id=?').bind(template.id).run();}
});

test('HTTP rate limits ignore forwarded-IP spoofing, report retry and fail closed on D1 failure',async()=>{
  for(let i=0;i<10;i++)assert.equal((await request('/auth/login',{method:'POST',body:{login:'absent',password:'wrong'},headers:{'X-Forwarded-For':`10.0.0.${i}`,'CF-Connecting-IP':`10.0.1.${i}`}})).status,401);
  const blocked=await request('/auth/login',{method:'POST',body:{login:'absent',password:'wrong'}});
  assert.equal(blocked.status,429);assert.equal(blocked.headers.get('RateLimit-Remaining'),'0');assert.ok(Number(blocked.headers.get('Retry-After'))>0);
  const unavailable={...env,DB:{prepare(){throw new Error('injected outage containing private details');}}};
  const failed=await request('/auth/login',{method:'POST',body:{},environment:unavailable});
  assert.equal(failed.status,503);assert.equal((await failed.text()).includes('private details'),false);assert.equal(cookieOf(failed),undefined);
});

test('production configuration requires HTTPS and a nonlocal secret; cookie is Secure and scoped',async()=>{
  for(const changes of [{JWT_SECRET:'short'},{APP_ENV:'production'},{APP_ENV:'production',FRONTEND_URL:'http://learn.example.com',JWT_SECRET:'production-test-key-for-tests-only-12345'},{FRONTEND_URL:origin+'/path'}]) {
    const r=await request('/auth/login',{method:'POST',body:{},environment:{...env,...changes}});assert.equal(r.status,503);
  }
  const production={...env,APP_ENV:'production',FRONTEND_URL:'https://learn.example.com',JWT_SECRET:'production-test-key-for-tests-only-12345'};
  assert.equal((await request('/auth/login',{method:'POST',body:{},environment:production})).status,503);
  const r=await request('/auth/register',{method:'POST',body:input(),environment:production,headers:{'CF-Connecting-IP':'192.0.2.1'}});
  assert.equal(r.status,201);assert.match(r.headers.get('set-cookie'),/^__Secure-sumaryjp_refresh=/);assert.match(r.headers.get('set-cookie'),/; Secure$/);assert.equal(r.headers.has('Access-Control-Allow-Origin'),false);
});

test('bcrypt cost 10 local CPU sample (not Cloudflare production CPU)',async t=>{
  const start=process.cpuUsage(),wall=performance.now();
  const hash=await bcrypt.hash('test-only-benchmark-password',10);
  assert.ok(await bcrypt.compare('test-only-benchmark-password',hash));
  const cpu=process.cpuUsage(start);
  t.diagnostic(JSON.stringify({hashPlusVerifyCpuMs:(cpu.user+cpu.system)/1000,wallMs:Math.round(performance.now()-wall),cost:10,scope:'Node local process; remote Workers CPU still requires measurement'}));
});
