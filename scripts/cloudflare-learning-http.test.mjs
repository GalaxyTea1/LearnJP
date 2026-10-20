import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { getPlatformProxy,unstable_dev } from 'wrangler';
import { migrate,fixtures,quizQuestions } from './learning-fixture.mjs';

test('workerd HTTP learning flow: progress, quiz retry, SRS, tests, XP, check-in', {timeout:90000}, async()=>{
  const root=fileURLToPath(new URL('../',import.meta.url)),config=join(root,'wrangler.local.jsonc');
  await mkdir(join(root,'.local'),{recursive:true});const state=await mkdtemp(join(root,'.local','cf4-http-'));
  const proxy=await getPlatformProxy({configPath:config,persist:{path:join(state,'v3')},remoteBindings:false,envFiles:[]});
  try{await migrate(proxy.env.DB);await fixtures(proxy.env.DB);await quizQuestions(proxy.env.DB);}finally{await proxy.dispose();}
  const server=await unstable_dev(join(root,'backend/cloudflare/worker.ts'),{config,envFiles:[],local:true,persist:true,persistTo:state,ip:'127.0.0.1',port:0,logLevel:'error',experimental:{disableExperimentalWarning:true,disableDevRegistry:true,watch:false}});
  let token;
  const request=async(path,method='GET',body)=>{
    const r=await fetch(`http://${server.address}:${server.port}/api/v1${path}`,{method,signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json','X-Requested-With':'SumaryJP',Origin:'http://127.0.0.1:8787',...(token?{Authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
    const payload=await r.json();assert.ok(r.ok,`${method} ${path}: ${r.status} ${payload.message}`);return payload;
  };
  try{
    token=(await request('/auth/register','POST',{email:'cf4@test.invalid',username:'cf4_smoke',password:'Test-only-password'})).data.accessToken;
    await request('/progress/module/1/study','PATCH',{completedTabs:['grammar'],vocabulary:[{id:1,mastered:true}]});
    const study=(await request('/progress/module/1/study')).data;assert.deepEqual(study.completedTabs,['grammar']);assert.deepEqual(study.masteredVocabularyIds,[1]);
    const quiz=await request('/quizzes/module/1');assert.ok(quiz.data.every(q=>!('correctIndex' in q)));
    const submission={moduleId:1,requestId:crypto.randomUUID(),quizRevision:quiz.meta.quizRevision,answers:quiz.data.map(q=>({questionId:q.id,selectedIndex:0}))};
    const results=await Promise.all(Array.from({length:4},()=>request('/quizzes/submit','POST',submission)));
    results.forEach(r=>assert.deepEqual(r.data,results[0].data));assert.equal(results[0].data.xpEarned,100);
    assert.equal((await request('/progress/module/1/study')).data.quizCompleted,true);
    const review={itemType:'VOCAB',itemId:1,quality:5};
    assert.equal((await request('/flashcards/review','POST',review)).data.xpEarned,2);
    assert.equal((await request('/flashcards/review','POST',review)).data.xpEarned,0);
    const attempt=(await request('/tests/attempts','POST',{templateId:1,requestId:crypto.randomUUID()})).data;
    const answers={answers:[{questionId:1,selectedAnswer:0},{questionId:2,selectedAnswer:0}]};
    const first=(await request(`/tests/attempts/${attempt.id}/submit`,'POST',answers)).data;
    assert.equal(first.xpEarned,150);assert.deepEqual((await request(`/tests/attempts/${attempt.id}/submit`,'POST',answers)).data,first);
    assert.equal((await request('/gamification/me')).data.totalXpEarned,252);
    assert.equal((await request('/gamification/checkin','POST')).data.streakUpdated,true);
    assert.equal((await request('/gamification/checkin','POST')).data.streakUpdated,false);
    const dashboard=(await request('/users/dashboard')).data;assert.equal(dashboard.gamification.totalXpEarned,252);
    assert.equal((await request('/progress/me')).data.overview.completedModules,1);
    await request('/dictionary/search?q=fixture');assert.equal((await request('/history/search')).data.length,1);
  }finally{await server.stop();}
});
