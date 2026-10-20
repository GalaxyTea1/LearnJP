import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {getPlatformProxy,unstable_dev} from 'wrangler';
import {migrate,fixtures,load} from './learning-fixture.mjs';

test('workerd HTTP admin: authenticated preview, mutations, version conflicts and public isolation',{timeout:90000},async()=>{
  const root=fileURLToPath(new URL('../',import.meta.url)),config=join(root,'wrangler.local.jsonc');
  await mkdir(join(root,'.local'),{recursive:true});const state=await mkdtemp(join(root,'.local','cf4-admin-http-'));
  const proxy=await getPlatformProxy({configPath:config,persist:{path:join(state,'v3')},remoteBindings:false,envFiles:[]});
  const password='Test-only-admin-password';
  try {
    await migrate(proxy.env.DB);await fixtures(proxy.env.DB);const {Auth}=await load('auth');
    const admin=await new Auth(proxy.env).register({email:'admin@test.invalid',username:'admin_smoke',password});
    await proxy.env.DB.prepare("UPDATE users SET role='ADMIN' WHERE id=?").bind(admin.data.user.id).run();
  }finally{await proxy.dispose();}
  const server=await unstable_dev(join(root,'backend/cloudflare/worker.ts'),{config,envFiles:[],local:true,persist:true,persistTo:state,ip:'127.0.0.1',port:0,logLevel:'error',experimental:{disableExperimentalWarning:true,disableDevRegistry:true,watch:false}});
  let token;
  const request=async(path,method='GET',body,{guest=false,expected=200}={})=>{
    const response=await fetch(`http://${server.address}:${server.port}/api/v1${path}`,{method,signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json','X-Requested-With':'SumaryJP',Origin:'http://127.0.0.1:8787',...(!guest&&token?{Authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
    const payload=await response.json();assert.equal(response.status,expected,`${method} ${path}: ${payload.message}`);
    assert.equal(response.headers.get('cache-control'),'no-store');return payload;
  };
  try {
    token=(await request('/auth/login','POST',{login:'admin@test.invalid',password})).data.accessToken;
    assert.equal((await request('/admin/dashboard')).data.stats.totalUsers,1);
    assert.equal((await request('/modules?preview=true')).data.length,3);
    await request('/modules?preview=true','GET',undefined,{guest:true,expected:403});
    const draft=(await request('/modules/3/full?preview=true')).data;assert.equal(draft.contentStatus,'DRAFT');
    const changed=(await request('/modules/3','PUT',{title:'HTTP draft edit',version:draft.version})).data;
    await request('/modules/3','PUT',{title:'Stale',version:draft.version},{expected:409});
    await request('/modules/3','GET',undefined,{guest:true,expected:404});
    await request('/modules/3','PUT',{contentStatus:'PUBLISHED',version:changed.version},{expected:422});
    const item=(await request('/vocabulary','POST',{moduleId:3,japanese:'学ぶ',romaji:'manabu',english:'ĐỌC',type:'VERB'},{expected:201})).data;
    assert.equal((await request('/vocabulary?preview=true&search='+encodeURIComponent('đọc'))).data[0].id,item.id);
    assert.equal((await request('/vocabulary?search='+encodeURIComponent('đọc'),'GET',undefined,{guest:true})).data.length,0);
    const quiz=(await request('/quizzes','POST',{moduleId:1,question:'HTTP question',options:['a','b'],correctIndex:1,explanation:'Private'},{expected:201})).data;
    assert.equal((await request('/quizzes/module/1?preview=true')).data[0].correctIndex,1);
    assert.equal('correctIndex' in (await request('/quizzes/module/1','GET',undefined,{guest:true})).data[0],false);
    await request('/quizzes/'+quiz.id,'DELETE');await request('/vocabulary/'+item.id,'DELETE');
    const announcement=(await request('/announcements','POST',{title:'HTTP announcement',content:'Content'},{expected:201})).data;
    assert.equal((await request('/announcements/active','GET',undefined,{guest:true})).data[0].id,announcement.id);
    await request('/announcements/'+announcement.id,'PUT',{isActive:false});assert.equal((await request('/announcements/active','GET',undefined,{guest:true})).data.length,0);
    assert.ok((await request('/admin/logs')).data.pagination.total>=7);
    await request('/admin/settings','PUT',{key:'site.title',value:'Local test'});assert.equal((await request('/admin/settings')).data[0].value,'Local test');
  }finally{await server.stop();}
});
