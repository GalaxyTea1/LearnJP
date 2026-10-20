import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { getPlatformProxy, unstable_dev, unstable_splitSqlQuery } from 'wrangler';

// Real Worker execution, separate persisted D1. Never modifies the main local content DB.
test('workerd HTTP: register/login/me/content/rotation/replay/logout', {timeout:90000}, async()=>{
  const root=fileURLToPath(new URL('../',import.meta.url));
  const config=join(root,'wrangler.local.jsonc');
  await mkdir(join(root,'.local'),{recursive:true});
  const state=await mkdtemp(join(root,'.local','cf3-http-'));
  const proxy=await getPlatformProxy({configPath:config,persist:{path:join(state,'v3')},remoteBindings:false,envFiles:[]});
  try {
    for(const file of ['0001_initial.sql','0002_content_search.sql','0003_auth_sessions.sql','0004_learning_writes.sql']) {
      const sql=await readFile(join(root,'backend/cloudflare/migrations',file),'utf8');
      await proxy.env.DB.batch(unstable_splitSqlQuery(sql).map(s=>proxy.env.DB.prepare(s)));
    }
  } finally {await proxy.dispose();}
  const server=await unstable_dev(join(root,'backend/cloudflare/worker.ts'),{
    config,envFiles:[],local:true,persist:true,persistTo:state,ip:'127.0.0.1',port:0,
    logLevel:'error',experimental:{disableExperimentalWarning:true,disableDevRegistry:true,watch:false},
  });
  const call=async(path,{method='GET',token,cookie,body,headers={}}={})=>fetch(`http://${server.address}:${server.port}/api/v1${path}`,{
    method,signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json','X-Requested-With':'SumaryJP',Origin:'http://127.0.0.1:8787',...(token?{Authorization:'Bearer '+token}:{}),...(cookie?{Cookie:cookie}:{}),...headers},
    ...(body===undefined?{}:{body:JSON.stringify(body)}),
  });
  const cookie=r=>r.headers.get('set-cookie')?.split(';')[0];
  try {
    const data={email:'http-smoke@test.invalid',username:'http_smoke',password:'Test-only-HTTP-password'};
    const register=await call('/auth/register',{method:'POST',body:data});assert.equal(register.status,201,await register.clone().text());
    assert.match(register.headers.get('set-cookie'),/HttpOnly; SameSite=Lax/);
    const first=await register.json();assert.equal(first.data.user.role,'USER');
    const login=await call('/auth/login',{method:'POST',body:{login:data.email,password:data.password}});assert.equal(login.status,200);
    const session=(await login.json()).data;
    assert.equal((await call('/auth/me',{token:session.accessToken})).status,200);
    assert.equal((await call('/modules',{token:session.accessToken})).status,200);
    assert.equal((await call('/admin/dashboard',{token:session.accessToken})).status,403);
    assert.equal((await call('/auth/refresh',{method:'POST',cookie:cookie(login),body:{},headers:{Origin:'https://evil.invalid'}})).status,403);
    const results=await Promise.all(Array.from({length:8},()=>call('/auth/refresh',{method:'POST',cookie:cookie(login),body:{}})));
    const winners=results.filter(r=>r.status===200);assert.equal(winners.length,1);
    for(const r of results.filter(r=>r.status!==200)){assert.ok([401,409].includes(r.status));assert.equal(cookie(r),undefined);}
    assert.notEqual(cookie(winners[0]),cookie(login));
    const refreshed=(await winners[0].json()).data;
    const logout=await call('/auth/logout',{method:'POST',cookie:cookie(login),body:{}});assert.equal(logout.status,200);assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
    assert.equal((await call('/auth/me',{token:refreshed.accessToken})).status,401);
    assert.equal((await call('/auth/refresh',{method:'POST',cookie:cookie(winners[0]),body:{}})).status,401);
    assert.equal((await call('/auth/me',{token:first.data.accessToken})).status,200); // Other device survives.
  } finally {await server.stop();}
});
