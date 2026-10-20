import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';

const source = await readFile(new URL('../src/app/services/api.ts', import.meta.url), 'utf8');
const { code } = await transform(source, { loader: 'ts', format: 'esm', define: { 'import.meta.env.VITE_API_URL': '""' } });
const response = (status, data, message = '') => new Response(JSON.stringify({ success: status < 400, data, message }), { status });
const session = { user: { id: 42, username: 'learner', role: 'USER' }, accessToken: 'access-test' };
const tick = () => new Promise(resolve => setImmediate(resolve));
const loadClient = () => import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}#${Math.random()}`);
async function client() {
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  globalThis.window = new EventTarget();
  let tail = Promise.resolve();
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { locks: {
    request(_name, _options, work) { const task = tail.then(work); tail = task.catch(() => {}); return task; },
  } } });
  return loadClient();
}
function signedIn() {
  localStorage.setItem('accessToken', 'expired');
  localStorage.setItem('user', JSON.stringify(session.user));
}

test('blocked localStorage getter does not crash import or public lessons; login fails before network', async () => {
  await client();
  const storage=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
  try {
    Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new DOMException('Blocked','SecurityError');}});
    const {contentApi,authApi,STORAGE_UNAVAILABLE}=await loadClient();let calls=0;
    globalThis.fetch=async (url,options)=>{calls++;assert.equal(url,'/api/v1/modules/6/full');assert.equal(options.headers.Authorization,undefined);return response(200,{id:6});};
    assert.equal((await contentApi.getModuleFullContent(6)).data.id,6);
    await assert.rejects(authApi.login('learner','password123'),{status:503,message:STORAGE_UNAVAILABLE});assert.equal(calls,1);
  }finally{Object.defineProperty(globalThis,'localStorage',storage);}
});

test('quota before login prevents sending credentials and returns an actionable error', async () => {
  const {authApi,STORAGE_UNAVAILABLE}=await client();let calls=0;
  localStorage.setItem=()=>{throw new DOMException('Full','QuotaExceededError');};
  globalThis.fetch=async()=>{calls++;return response(200,session);};
  await assert.rejects(authApi.login('learner','password123'),{status:503,message:STORAGE_UNAVAILABLE});assert.equal(calls,0);
});

test('quota after login revokes the cookie and hides any partial local identity', async () => {
  const {authApi,readSessionValue,STORAGE_UNAVAILABLE}=await client();const set=localStorage.setItem;const calls=[];
  localStorage.setItem=(key,value)=>{if(key==='user')throw new DOMException('Full','QuotaExceededError');set(key,value);};
  globalThis.fetch=async url=>{calls.push(url);return response(200,url.endsWith('/login')?session:null);};
  await assert.rejects(authApi.login('learner','password123'),{status:503,message:STORAGE_UNAVAILABLE});
  assert.deepEqual(calls,['/api/v1/auth/login','/api/v1/auth/logout']);assert.equal(readSessionValue('accessToken'),null);assert.equal(localStorage.getItem('accessToken'),null);
});

test('logout still revokes server cookie when storage removal fails', async () => {
  const {authApi,readSessionValue}=await client();signedIn();let revoked=false;
  localStorage.removeItem=()=>{throw new DOMException('Blocked','SecurityError');};
  globalThis.fetch=async url=>{assert.ok(url.endsWith('/logout'));revoked=true;return response(200,null);};
  await authApi.logout();assert.equal(revoked,true);assert.equal(readSessionValue('accessToken'),null);
});

test('registration sends cookie credentials and CSRF header; never stores a refresh token', async () => {
  const { authApi, SESSION_CHANGED } = await client();
  let events = 0;
  window.addEventListener(SESSION_CHANGED, () => events++);
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/api/v1/auth/register');
    assert.equal(options.credentials, 'include');
    assert.equal(options.headers['X-Requested-With'], 'SumaryJP');
    assert.deepEqual(JSON.parse(options.body), { email: 'a@example.test', username: 'learner', password: 'password123' });
    return response(201, session);
  };
  await authApi.register({ email: 'a@example.test', username: 'learner', password: 'password123' });
  assert.equal(localStorage.getItem('accessToken'), session.accessToken);
  assert.equal(localStorage.getItem('refreshToken'), null);
  assert.equal(JSON.parse(localStorage.getItem('user')).role, 'USER');
  assert.equal(events, 1);
});

test('incorrect login does not refresh or clear an existing session', async () => {
  const { authApi } = await client(); signedIn(); let calls = 0;
  globalThis.fetch = async url => { calls++; assert.ok(url.endsWith('/login')); return response(401, null); };
  await assert.rejects(authApi.login('learner', 'incorrect'), { status: 401 });
  assert.equal(calls, 1); assert.equal(localStorage.getItem('accessToken'), 'expired');
});

test('logout clears local identity even when offline', async () => {
  const { authApi } = await client(); signedIn();
  globalThis.fetch = async () => { throw new TypeError('offline'); };
  await assert.rejects(authApi.logout());
  assert.equal(localStorage.getItem('user'), null); assert.equal(localStorage.getItem('accessToken'), null);
});

test('expired access refreshes using cookie and retries with the new token', async () => {
  const { authApi } = await client(); signedIn(); let refreshes = 0;
  globalThis.fetch = async (url, options) => {
    if (url.endsWith('/refresh')) {
      refreshes++; assert.equal(options.body, '{}'); return response(200, { accessToken: 'fresh' });
    }
    return options.headers.Authorization === 'Bearer fresh' ? response(200, session.user) : response(401, null);
  };
  assert.equal((await authApi.getMe()).data.id, 42); assert.equal(refreshes, 1);
});

test('only an invalid refresh response clears identity', async () => {
  const { authApi } = await client(); signedIn();
  globalThis.fetch = async () => response(401, null);
  await assert.rejects(authApi.getMe(), { status: 401 }); assert.equal(localStorage.getItem('user'), null);
});

for (const status of [429, 500, 503, 'offline']) {
  test(`refresh failure ${status} preserves session and original error`, async () => {
    const { authApi } = await client(); signedIn();
    globalThis.fetch = async url => {
      if (!url.endsWith('/refresh')) return response(401, null);
      if (status === 'offline') throw new TypeError('offline');
      return response(status, null);
    };
    await assert.rejects(authApi.getMe(), status === 'offline' ? { message: 'offline' } : { status });
    assert.equal(localStorage.getItem('accessToken'), 'expired'); assert.ok(localStorage.getItem('user'));
  });
}

test('two tabs refresh once and both protected requests succeed', async () => {
  const a = (await client()).authApi; const b = (await loadClient()).authApi; signedIn(); let refreshes = 0;
  globalThis.fetch = async (url, options) => {
    if (url.endsWith('/refresh')) { refreshes++; await tick(); return response(200, { accessToken: 'fresh' }); }
    return options.headers.Authorization === 'Bearer fresh' ? response(200, session.user) : response(401, null);
  };
  const results = await Promise.all([a.getMe(), b.getMe()]);
  assert.equal(refreshes, 1); assert.ok(results.every(result => result.data.id === 42));
});

test('logout waits for refresh cookie and prevents token restoration', async () => {
  const { authApi } = await client(); signedIn(); let finishRefresh; let loggedOut = false;
  globalThis.fetch = async url => {
    if (url.endsWith('/refresh')) return new Promise(resolve => { finishRefresh = resolve; });
    if (url.endsWith('/logout')) { loggedOut = true; return response(200, null); }
    return response(401, null);
  };
  const pending = authApi.getMe(); const rejected = assert.rejects(pending, { status: 409 });
  while (!finishRefresh) await tick();
  const logout = authApi.logout(); await tick(); assert.equal(loggedOut, false);
  finishRefresh(response(200, { accessToken: 'stale' }));
  await Promise.all([rejected, logout]);
  assert.equal(loggedOut, true); assert.equal(localStorage.getItem('accessToken'), null);
});

test('logout during login prevents the late login from restoring identity', async () => {
  const { authApi } = await client(); let finishLogin;
  globalThis.fetch = async url => url.endsWith('/login') ? new Promise(resolve => { finishLogin = resolve; }) : response(200, null);
  const pending = assert.rejects(authApi.login('learner', 'password123'), { status: 409 });
  while (!finishLogin) await tick();
  const logout = authApi.logout(); finishLogin(response(200, session));
  await Promise.all([pending, logout]); assert.equal(localStorage.getItem('user'), null);
});

test('a response from the previous account is rejected after switching identity', async () => {
  const { authApi } = await client(); signedIn(); let finishMe;
  globalThis.fetch = async url => url.endsWith('/me') ? new Promise(resolve => { finishMe = resolve; }) : response(200, { ...session, user: { id: 99 } });
  const pending = assert.rejects(authApi.getMe(), { status: 409 });
  await authApi.login('new-user', 'password123'); finishMe(response(200, session.user));
  await pending; assert.equal(JSON.parse(localStorage.getItem('user')).id, 99);
});

test('legacy browser-stored refresh credentials are removed during upgrade', async () => {
  await client(); signedIn(); localStorage.setItem('refreshToken', 'legacy'); await loadClient();
  assert.equal(localStorage.getItem('refreshToken'), null); assert.equal(localStorage.getItem('accessToken'), null);
});


test('public catalog ignores expired credentials and does not request progress or refresh', async () => {
  const { contentApi } = await client(); signedIn(); const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push(url);
    assert.equal(url, '/api/v1/modules');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.headers.Authorization, undefined);
    assert.ok(options.signal instanceof AbortSignal);
    localStorage.setItem('nihongo-session-revision', 'changed-during-public-request');
    return response(200, [{ id: 7 }]);
  };
  assert.equal((await contentApi.getPublicModules()).data[0].id, 7);
  assert.deepEqual(calls, ['/api/v1/modules']);
});
test('progress failure does not discard an independently loaded public catalog', async () => {
  const { contentApi, progressApi } = await client(); signedIn();
  globalThis.fetch = async url => url.endsWith('/modules') ? response(200, [{ id: 7 }]) : response(503, null);
  const [catalog, progress] = await Promise.allSettled([contentApi.getPublicModules(), progressApi.getMyProgress()]);
  assert.equal(catalog.status, 'fulfilled'); assert.equal(catalog.value.data[0].id, 7);
  assert.equal(progress.status, 'rejected');
});
test('public catalog reports malformed, failed and network responses instead of empty success', async () => {
  const { contentApi } = await client();
  for (const res of [response(503, []), response(200, null), new Response('<html>fallback</html>')]) {
    globalThis.fetch = async () => res;
    await assert.rejects(contentApi.getPublicModules());
  }
  globalThis.fetch = async () => { throw new TypeError('offline'); };
  await assert.rejects(contentApi.getPublicModules());
  globalThis.fetch = async () => response(200, []);
  assert.deepEqual((await contentApi.getPublicModules()).data, []);
});


test('quiz submit sends the exact loaded revision and preserves revision conflict', async () => {
  const { progressApi } = await client(); signedIn();
  const revision = 'a'.repeat(64);
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/api/v1/quizzes/submit');
    assert.equal(JSON.parse(options.body).quizRevision, revision);
    return response(409, null, 'QUIZ_REVISION_CHANGED');
  };
  await assert.rejects(progressApi.submitQuizAttempt(7, [{ questionId: 1, selectedIndex: 0 }], 10, revision), { status: 409, message: 'QUIZ_REVISION_CHANGED' });
});

test('lesson and quiz operations time out even when fetch or auth lock remains pending', async () => {
  const originalTimeout = AbortSignal.timeout;
  try {
    for (const operation of ['lesson', 'quiz', 'auth-lock']) {
      const { contentApi, progressApi } = await client();
      const controller = new AbortController();
      AbortSignal.timeout = ms => { assert.equal(ms, 15000); return controller.signal; };
      if (operation === 'auth-lock') {
        signedIn();
        navigator.locks.request = () => new Promise(() => {});
        globalThis.fetch = async () => response(401, null);
      } else globalThis.fetch = () => new Promise(() => {});
      const pending = operation === 'quiz' ? progressApi.submitQuizAttempt(7, [{questionId:1,selectedIndex:0}], 5, 'revision', 'request-id') : contentApi.getModuleFullContent(7);
      await tick();
      controller.abort(new DOMException('Timed out', 'TimeoutError'));
      await assert.rejects(pending, {name:'TimeoutError'});
    }
  } finally { AbortSignal.timeout = originalTimeout; }
});

test('retry quiz sends identical request ID, answers and frozen elapsed time', async () => {
  const { progressApi } = await client(); const sent=[];
  globalThis.fetch = async (_url, options) => { sent.push(JSON.parse(options.body)); if(sent.length===1) throw new TypeError('response lost'); return response(200,{attemptId:42}); };
  const args=[7,[{questionId:1,selectedIndex:0}],12,'revision','b171cdce-7cba-4d24-84cd-741b70130c08'];
  await assert.rejects(progressApi.submitQuizAttempt(...args));
  assert.equal((await progressApi.submitQuizAttempt(...args)).data.attemptId,42);
  assert.deepEqual(sent[0],sent[1]); assert.equal(sent[1].requestId,args[4]);
});
