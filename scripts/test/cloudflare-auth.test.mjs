import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { getPlatformProxy, unstable_splitSqlQuery } from 'wrangler';
import { build } from '../../frontend/node_modules/esbuild/lib/main.js';
import { SignJWT } from 'jose';

let proxy, db, env, worker, Auth, authenticate, consumeLimit, digest, moduleId;
const key = 'local-only-auth-key-never-use-in-production-2026';
const origin = 'http://127.0.0.1:8787';
let sequence = 0;
const input = () => ({
  email: `learner${++sequence}@test.invalid`,
  username: `learner${sequence}`,
  password: 'Test-only-password-123',
  displayName: 'Học viên 日本',
});
const cookieOf = r => r.headers.get('set-cookie')?.split(';')[0];
const rawCookie = r => cookieOf(r)?.split('=')[1];
const bearer = token => new Request(origin + '/api/v1/auth/me', { headers: { Authorization: 'Bearer ' + token } });
const ISSUER = 'https://test.supabase.co';
// Accounts are created only through a verified provider identity (Google or Supabase email).
async function account(email = input().email, subject = crypto.randomUUID()) {
  const session = await new Auth(env).providerLogin(ISSUER, subject, email, 'email');
  return { ...session, subject, email };
}
const signIn = session => new Auth(env).providerLogin(ISSUER, session.subject, session.email, 'email');
async function request(path, { method = 'GET', token, cookie, body, headers = {}, environment = env } = {}) {
  const h = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'SumaryJP',
    Origin: environment.FRONTEND_URL,
    ...headers,
  };
  if (token) h.Authorization = 'Bearer ' + token;
  if (cookie) h.Cookie = cookie;
  return worker.fetch(
    new Request(origin + '/api/v1' + path, {
      method,
      headers: h,
      ...(body !== undefined ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
    }),
    environment,
  );
}
before(async () => {
  proxy = await getPlatformProxy({
    configPath: fileURLToPath(new URL('../../wrangler.local.jsonc', import.meta.url)),
    persist: false,
    remoteBindings: false,
    envFiles: [],
  });
  db = proxy.env.DB;
  env = { ...proxy.env, APP_ENV: 'local', FRONTEND_URL: origin, JWT_SECRET: key };
  for (const file of [
    '0001_initial.sql',
    '0002_content_search.sql',
    '0003_auth_sessions.sql',
    '0004_learning_writes.sql',
    '0005_supabase_auth.sql',
    '0006_google_account_link.sql',
    '0007_email_auth.sql',
    '0008_catalog_counts_cache.sql',
  ]) {
    const sql = await readFile(new URL('../../backend/cloudflare/migrations/' + file, import.meta.url), 'utf8');
    await db.batch(unstable_splitSqlQuery(sql).map(s => db.prepare(s)));
  }
  const load = async name => {
    const output = await build({
      entryPoints: [fileURLToPath(new URL(`../../backend/cloudflare/${name}.ts`, import.meta.url))],
      bundle: true,
      format: 'esm',
      platform: 'browser',
      write: false,
    });
    return import('data:text/javascript;base64,' + Buffer.from(output.outputFiles[0].text).toString('base64'));
  };
  worker = (await load('worker')).default;
  ({ Auth, authenticate, consumeLimit, digest } = await load('auth'));
  const data = JSON.parse(await readFile(new URL('../../content/n5/source.json', import.meta.url), 'utf8'));
  const fields = JSON.parse(await readFile(new URL('../../backend/cloudflare/columns.json', import.meta.url), 'utf8'));
  const insert = async (table, row) =>
    db
      .prepare(
        `INSERT INTO ${table} (${fields[table].map(f => f.column).join(',')}) VALUES (${fields[table].map(() => '?').join(',')})`,
      )
      .bind(
        ...fields[table].map(f =>
          row[f.name] == null
            ? null
            : f.type === 'Json'
              ? JSON.stringify(row[f.name])
              : f.type === 'Boolean'
                ? Number(row[f.name])
                : row[f.name],
        ),
      )
      .run();
  await insert('jlpt_levels', data.jlpt_levels[0]);
  const module = data.learning_modules.find(m => m.contentStatus === 'PUBLISHED');
  moduleId = module.id;
  await insert('learning_modules', module);
});
after(async () => {
  await proxy?.dispose();
});
beforeEach(async () => {
  await db.batch([db.prepare('DELETE FROM users'), db.prepare('DELETE FROM auth_rate_limits')]);
});

test('provider sign-in creates a complete default account, hashed session and compatible profile', async () => {
  const session = await account();
  assert.equal(session.data.user.role, 'USER');
  assert.equal(session.data.user.email, session.email);
  assert.equal('refreshToken' in session.data, false);
  assert.equal('passwordHash' in session.data.user, false);
  assert.equal((await db.prepare('SELECT password_hash FROM users').first()).password_hash, '!external-only');
  const row = await db.prepare('SELECT * FROM refresh_tokens').first();
  assert.equal(row.token, await digest(session.refresh));
  assert.notEqual(row.token, session.refresh);
  const me = await request('/auth/me', { token: session.data.accessToken });
  assert.equal(me.status, 200);
  assert.equal(me.headers.get('cache-control'), 'no-store');
  const profile = (await me.json()).data;
  assert.equal(profile.learningSettings.weeklyGoalTarget, 20);
  assert.equal(profile.gamification.xp, 0);
  assert.deepEqual(profile.gamification.badges, []);
  assert.equal(profile.gamification.stats.quizzesTaken, 0);
  assert.equal(JSON.stringify(profile).includes('password'), false);
});
test('CSRF, JSON type, bounded body and HTTP methods reject before session mutation', async () => {
  const session = await account(),
    cookie = 'sumaryjp_refresh=' + session.refresh;
  for (const headers of [
    { 'X-Requested-With': '' },
    { Origin: 'https://evil.invalid' },
    { 'Sec-Fetch-Site': 'cross-site' },
  ]) {
    assert.equal((await request('/auth/refresh', { method: 'POST', body: {}, cookie, headers })).status, 403);
  }
  assert.equal((await request('/auth/refresh', { method: 'POST', body: '{', cookie })).status, 400);
  assert.equal((await request('/auth/refresh', { method: 'POST', body: ' '.repeat(8193), cookie })).status, 413);
  assert.equal(
    (await request('/auth/refresh', { method: 'POST', body: {}, cookie, headers: { 'Content-Type': 'text/plain' } }))
      .status,
    415,
  );
  assert.equal((await request('/auth/refresh')).status, 405);
  assert.equal((await request('/auth/me', { method: 'POST' })).status, 405);
  assert.equal((await request('/auth/unknown')).status, 404);
  assert.equal((await db.prepare('SELECT token FROM refresh_tokens').first()).token, await digest(session.refresh));
});
test('JWT enforces signature, algorithm, issuer, audience, expiry, token type and issued time', async () => {
  const auth = new Auth(env),
    session = await account();
  const original = JSON.parse(Buffer.from(session.data.accessToken.split('.')[1], 'base64url'));
  const sign = async (payload, secret = key, alg = 'HS256') =>
    new SignJWT(payload).setProtectedHeader({ alg }).sign(new TextEncoder().encode(secret));
  const tokens = [
    session.refresh,
    'not.a.token',
    await sign(original, 'wrong-secret-that-is-at-least-32-bytes'),
    await sign(original, key, 'HS384'),
  ];
  for (const change of [
    { iss: 'wrong' },
    { aud: 'wrong' },
    { exp: 1 },
    { iat: Math.floor(Date.now() / 1000) + 3600 },
    { tokenType: 'refresh' },
    { sid: 'bad' },
    { userId: '1' },
    { jti: null },
  ])
    tokens.push(await sign({ ...original, ...change }));
  for (const token of tokens) await assert.rejects(authenticate(bearer(token), env), { status: 401 });
  assert.equal((await authenticate(bearer(session.data.accessToken), env)).id, session.data.user.id);
  assert.equal((await request('/modules', { token: 'fake' })).status, 401);
});

test('refresh is cookie-only, rotates once and never overwrites the winning cookie on failure', async () => {
  const session = await account(),
    old = session.refresh,
    r = { headers: new Headers({ 'set-cookie': 'sumaryjp_refresh=' + old }) };
  assert.equal((await request('/auth/refresh', { method: 'POST', body: { refreshToken: old } })).status, 401);
  const rotated = await request('/auth/refresh', { method: 'POST', cookie: cookieOf(r), body: {} });
  assert.equal(rotated.status, 200);
  assert.notEqual(rawCookie(rotated), old);
  assert.equal('refreshToken' in (await rotated.json()).data, false);
  const replay = await request('/auth/refresh', { method: 'POST', cookie: cookieOf(r), body: {} });
  assert.equal(replay.status, 401);
  assert.equal(cookieOf(replay), undefined);
  const logout = await request('/auth/logout', { method: 'POST', cookie: cookieOf(rotated), body: {} });
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal((await request('/auth/logout', { method: 'POST', body: {} })).status, 200);
});

test('20 simultaneous refreshes have one winner; stale-cookie logout revokes its successor and access', async () => {
  const auth = new Auth(env),
    session = await account();
  const results = await Promise.allSettled(Array.from({ length: 20 }, () => auth.refresh(session.refresh)));
  const winners = results.filter(r => r.status === 'fulfilled');
  assert.equal(winners.length, 1);
  for (const r of results.filter(r => r.status === 'rejected')) assert.ok([401, 409].includes(r.reason.status));
  const winner = winners[0].value;
  const row = await db.prepare('SELECT * FROM refresh_tokens').first();
  assert.equal(row.token, await digest(winner.refresh));
  assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens').first()).n, 1);
  await authenticate(bearer(session.data.accessToken), env);
  await auth.logout(session.refresh);
  await assert.rejects(auth.refresh(winner.refresh), { status: 401 });
  for (const token of [session.data.accessToken, winner.data.accessToken])
    await assert.rejects(authenticate(bearer(token), env), { status: 401 });
});

test('failed token rotation leaves the original session usable', async () => {
  const session = await account();
  await db.exec(
    "CREATE TRIGGER fail_rotation BEFORE UPDATE ON refresh_tokens BEGIN SELECT RAISE(ABORT, 'injected rotation failure'); END;",
  );
  try {
    const failed = await request('/auth/refresh', {
      method: 'POST',
      body: {},
      cookie: 'sumaryjp_refresh=' + session.refresh,
    });
    assert.equal(failed.status, 503);
    assert.equal(cookieOf(failed), undefined);
    assert.equal((await db.prepare('SELECT token FROM refresh_tokens').first()).token, await digest(session.refresh));
  } finally {
    await db.exec('DROP TRIGGER fail_rotation');
  }
  await new Auth(env).refresh(session.refresh);
});

test('logout racing with refresh leaves no live session; logging out one device preserves another', async () => {
  const auth = new Auth(env);
  let session = await account();
  const identity = { subject: session.subject, email: session.email };
  for (let i = 0; i < 5; i++) {
    await Promise.allSettled([auth.refresh(session.refresh), auth.logout(session.refresh)]);
    assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens').first()).n, 0);
    await assert.rejects(authenticate(bearer(session.data.accessToken), env), { status: 401 });
    session = { ...(await signIn(identity)), ...identity };
  }
  const other = await signIn(identity);
  await auth.logout(session.refresh);
  await authenticate(bearer(other.data.accessToken), env);
});

test('authorization uses live account status and role, with gates on unfinished APIs', async () => {
  const auth = new Auth(env),
    session = await account(),
    token = session.data.accessToken;
  for (const path of ['/admin/dashboard', '/progress/me', '/users/dashboard', '/tests/attempts'])
    assert.equal((await request(path)).status, 401);
  assert.equal((await request('/admin/dashboard', { token })).status, 403);
  assert.equal((await request('/modules', { method: 'POST', token, body: {} })).status, 403);
  assert.equal((await request('/progress/module', { method: 'POST', token, body: {} })).status, 400);
  for (const role of ['ADMIN', 'MODERATOR']) {
    await db.prepare('UPDATE users SET role=? WHERE id=?').bind(role, session.data.user.id).run();
    assert.equal((await request('/admin/dashboard', { token })).status, 200);
    assert.equal((await request('/modules?preview=true', { token })).status, 200);
  }
  await db.prepare("UPDATE users SET role='USER' WHERE id=?").bind(session.data.user.id).run();
  assert.equal((await request('/admin/dashboard', { token })).status, 403);
  await db.prepare('UPDATE users SET is_active=0 WHERE id=?').bind(session.data.user.id).run();
  await assert.rejects(authenticate(bearer(token), env), { status: 401 });
  await assert.rejects(auth.refresh(session.refresh), { status: 401 });
  await assert.rejects(signIn(session), { status: 401 });
});

test('content reads return only this learner progress and never create progress on GET', async () => {
  const a = await account(),
    b = await account();
  await db
    .prepare(
      "INSERT INTO user_module_progress(user_id,module_id,status,progress_percent) VALUES (?,?,'IN_PROGRESS',60)",
    )
    .bind(a.data.user.id, moduleId)
    .run();
  const before = (await db.prepare('SELECT count(*) n FROM user_module_progress').first()).n;
  for (const [token, percent] of [
    [a.data.accessToken, 60],
    [b.data.accessToken, 0],
    [undefined, 0],
  ]) {
    const modules = await request('/modules', { token });
    assert.equal(modules.status, 200);
    assert.equal((await modules.json()).data[0].progressPercent, percent);
    const full = await request(`/modules/${moduleId}/full`, { token });
    assert.equal(full.status, 200);
    assert.equal((await full.json()).data.userProgress.progressPercent, percent);
    assert.equal((await (await request('/levels', { token })).json()).data[0].userProgressPercent, percent);
  }
  assert.equal((await db.prepare('SELECT count(*) n FROM user_module_progress').first()).n, before);
});

test('D1 rate limits are atomic across callers, reset correctly and clean expired records', async () => {
  const hits = await Promise.all(Array.from({ length: 40 }, () => consumeLimit(db, 'shared-client', 10)));
  assert.equal(hits.filter(r => r.allowed).length, 10);
  const row = await db.prepare('SELECT * FROM auth_rate_limits').first();
  assert.equal(row.count, 40);
  assert.equal(row.key, await digest('shared-client'));
  await db.prepare("UPDATE auth_rate_limits SET reset_at='2000-01-01T00:00:00.000Z'").run();
  const reset = await consumeLimit(db, 'shared-client', 10);
  assert.equal(reset.headers['RateLimit-Remaining'], '9');
  const expired = await account();
  await db.prepare("UPDATE refresh_tokens SET expires_at='2000-01-01T00:00:00.000Z'").run();
  await consumeLimit(db, 'cleanup-client', 10);
  assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens').first()).n, 1);
  await assert.rejects(authenticate(bearer(expired.data.accessToken), env), { status: 401 });
  await assert.rejects(new Auth(env).refresh(expired.refresh), { status: 401 });
  const live = await account();
  await db
    .prepare("INSERT INTO auth_rate_limits(key,count,reset_at) VALUES ('expired',1,'2000-01-01T00:00:00.000Z')")
    .run();
  await worker.scheduled({}, env);
  assert.equal(await db.prepare("SELECT key FROM auth_rate_limits WHERE key='expired'").first(), null);
  assert.equal((await db.prepare('SELECT count(*) n FROM auth_rate_limits').first()).n, 2);
  assert.equal((await authenticate(bearer(live.data.accessToken), env)).id, live.data.user.id);
  await db.prepare('DELETE FROM refresh_tokens WHERE user_id=?').bind(live.data.user.id).run();
  assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens').first()).n, 0);
  await assert.rejects(authenticate(bearer(expired.data.accessToken), env), { status: 401 });
});

test('template counts preserve the aggregate contract without exposing learner attempts', async () => {
  const session = await account();
  const template = await db
    .prepare(
      "INSERT INTO test_templates(title,level,duration_minutes,total_questions,is_published) VALUES ('Test fixture','N5',10,0,1) RETURNING id",
    )
    .first();
  try {
    await db
      .prepare('INSERT INTO user_test_attempts(user_id,template_id,max_score) VALUES (?,?,0)')
      .bind(session.data.user.id, template.id)
      .run();
    for (const token of [undefined, session.data.accessToken]) {
      const r = await request('/tests/templates', { token });
      assert.equal(r.status, 200);
      const t = (await r.json()).data.find(t => t.id === template.id);
      assert.equal(t._count.attempts, 1);
      assert.equal('attempts' in t, false);
      assert.equal((await request('/tests/templates/' + template.id, { token })).status, 200);
    }
  } finally {
    await db.prepare('DELETE FROM test_templates WHERE id=?').bind(template.id).run();
  }
});

test('HTTP rate limits ignore forwarded-IP spoofing, report retry and fail closed on D1 failure', async () => {
  for (let i = 0; i < 30; i++)
    assert.equal(
      (
        await request('/auth/refresh', {
          method: 'POST',
          body: {},
          headers: { 'X-Forwarded-For': `10.0.0.${i}`, 'CF-Connecting-IP': `10.0.1.${i}` },
        })
      ).status,
      401,
    );
  const blocked = await request('/auth/refresh', { method: 'POST', body: {} });
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get('RateLimit-Remaining'), '0');
  assert.ok(Number(blocked.headers.get('Retry-After')) > 0);
  const unavailable = {
    ...env,
    DB: {
      prepare() {
        throw new Error('injected outage containing private details');
      },
    },
  };
  const failed = await request('/auth/refresh', { method: 'POST', body: {}, environment: unavailable });
  assert.equal(failed.status, 503);
  assert.equal((await failed.text()).includes('private details'), false);
  assert.equal(cookieOf(failed), undefined);
});
test('production configuration requires HTTPS and a nonlocal secret; cookie is Secure and scoped', async () => {
  for (const changes of [
    { JWT_SECRET: 'short' },
    { APP_ENV: 'production' },
    {
      APP_ENV: 'production',
      FRONTEND_URL: 'http://learn.example.com',
      JWT_SECRET: 'production-test-key-for-tests-only-12345',
    },
    { FRONTEND_URL: origin + '/path' },
  ]) {
    const r = await request('/auth/refresh', { method: 'POST', body: {}, environment: { ...env, ...changes } });
    assert.equal(r.status, 503);
  }
  const production = {
    ...env,
    APP_ENV: 'production',
    FRONTEND_URL: 'https://learn.example.com',
    JWT_SECRET: 'production-test-key-for-tests-only-12345',
  };
  assert.equal((await request('/auth/refresh', { method: 'POST', body: {}, environment: production })).status, 503);
  const session = await new Auth(production).providerLogin(
    ISSUER,
    crypto.randomUUID(),
    'production@test.invalid',
    'email',
  );
  const r = await request('/auth/refresh', {
    method: 'POST',
    body: {},
    environment: production,
    cookie: '__Secure-sumaryjp_refresh=' + session.refresh,
    headers: { 'CF-Connecting-IP': '192.0.2.1' },
  });
  assert.equal(r.status, 200);
  assert.match(
    r.headers.get('set-cookie'),
    /^__Secure-sumaryjp_refresh=.+; Path=\/api\/v1\/auth; HttpOnly; SameSite=Lax; Max-Age=604800; Secure$/,
  );
  assert.equal(r.headers.has('Access-Control-Allow-Origin'), false);
});
test('Supabase subject mapping preserves ownership, roles and account state', async () => {
  const auth = new Auth(env),
    issuer = 'https://test.supabase.co',
    subject = crypto.randomUUID();
  const results = await Promise.all([
    auth.providerLogin(issuer, subject, 'google@test.invalid'),
    auth.providerLogin(issuer, subject, 'google@test.invalid'),
  ]);
  assert.equal(results[0].data.user.id, results[1].data.user.id);
  assert.equal(results[0].data.user.role, 'USER');
  assert.equal((await db.prepare('SELECT count(*) n FROM users').first()).n, 1);
  const id = results[0].data.user.id;
  await db.prepare("UPDATE users SET role='MODERATOR' WHERE id=?").bind(id).run();
  assert.equal((await auth.providerLogin(issuer, subject, 'new-email@test.invalid')).data.user.role, 'MODERATOR');
  await assert.rejects(auth.providerLogin(issuer, crypto.randomUUID(), 'google@test.invalid'), { status: 409 });
  await db.prepare('UPDATE users SET is_active=0 WHERE id=?').bind(id).run();
  await assert.rejects(auth.providerLogin(issuer, subject, 'google@test.invalid'), { status: 401 });
});

test('Google PKCE browser binding, verified callback, single-use finish and revocable session', async () => {
  const environment = {
    ...env,
    GOOGLE_AUTH_ENABLED: 'true',
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'test-public',
  };
  const post = (path, cookie, headers) =>
    request('/auth/google/' + path, { method: 'POST', body: {}, cookie, headers, environment });
  assert.equal((await post('start', undefined, { Origin: 'https://evil.invalid' })).status, 403);
  const start = await post('start');
  assert.equal(start.status, 200);
  const browserCookie = cookieOf(start);
  assert.match(start.headers.get('set-cookie'), /HttpOnly; SameSite=Lax; Max-Age=300/);
  const authorize = new URL((await start.json()).data.url);
  assert.equal(authorize.searchParams.get('redirect_to'), origin + '/api/v1/auth/google/callback');
  assert.equal(authorize.searchParams.get('code_challenge_method'), 's256');
  assert.equal((await post('finish', browserCookie)).status, 202);
  assert.equal((await post('finish')).status, 401);
  const attempt = await db
    .prepare('SELECT * FROM oauth_attempts WHERE id=?')
    .bind(await digest(browserCookie.split('=')[1]))
    .first();
  const challenge = Buffer.from(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(attempt.verifier)),
  ).toString('base64url');
  assert.equal(authorize.searchParams.get('code_challenge'), challenge);
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls++;
    if (String(url).endsWith('/token?grant_type=pkce')) {
      assert.deepEqual(JSON.parse(options.body), { auth_code: 'test-code', code_verifier: attempt.verifier });
      return Response.json({ access_token: 'verified-only-on-server', refresh_token: 'never-persist' });
    }
    assert.equal(options.headers.Authorization, 'Bearer verified-only-on-server');
    return Response.json({
      id: '12345678-1234-1234-1234-123456789012',
      email: 'googleflow@test.invalid',
      email_confirmed_at: new Date().toISOString(),
      identities: [{ provider: 'google' }],
      user_metadata: { role: 'ADMIN' },
    });
  };
  try {
    assert.equal((await request('/auth/google/callback?code=test-code', { environment })).status, 400);
    assert.equal(calls, 0);
    const callback = await request('/auth/google/callback?code=test-code', { environment, cookie: browserCookie });
    assert.equal(callback.status, 200);
    assert.equal(calls, 2);
    assert.equal(
      (await request('/auth/google/callback?code=test-code', { environment, cookie: browserCookie })).status,
      400,
    );
    assert.equal(calls, 2);
    const finish = await post('finish', browserCookie);
    assert.equal(finish.status, 200, await finish.clone().text());
    const data = (await finish.json()).data;
    assert.equal(data.user.role, 'USER');
    assert.equal(JSON.stringify(data).includes('never-persist'), false);
    assert.equal((await post('finish', browserCookie)).status, 401);
    assert.equal((await request('/auth/me', { token: data.accessToken })).status, 200);
    const refreshCookie = finish.headers
      .getSetCookie()
      .find(c => c.startsWith('sumaryjp_refresh='))
      .split(';')[0];
    await request('/auth/logout', { method: 'POST', cookie: refreshCookie, body: {} });
    assert.equal((await request('/auth/me', { token: data.accessToken })).status, 401);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Google full-page sign-in returns to the app when popups are blocked', async () => {
  const environment = {
    ...env,
    GOOGLE_AUTH_ENABLED: 'true',
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'test-public',
  };
  const cookies = r =>
    r.headers
      .getSetCookie()
      .map(c => c.split(';')[0])
      .filter(c => !c.endsWith('='))
      .join('; ');
  // Popup sign-in clears any stale mode marker and keeps the close-window page.
  const popup = await request('/auth/google/start', { method: 'POST', body: {}, environment });
  assert.ok(popup.headers.getSetCookie().some(c => /^learnjp_oauth_mode=; .*Max-Age=0/.test(c)));
  assert.equal(
    (await request('/auth/google/callback?error=access_denied', { environment, cookie: cookies(popup) })).status,
    400,
  );
  const start = await request('/auth/google/start', { method: 'POST', body: { redirect: true }, environment });
  assert.equal(start.status, 200);
  assert.ok(
    start.headers
      .getSetCookie()
      .some(c =>
        /^learnjp_oauth_mode=redirect; Path=\/api\/v1\/auth\/google; HttpOnly; SameSite=Lax; Max-Age=300/.test(c),
      ),
  );
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async url =>
    String(url).endsWith('/token?grant_type=pkce')
      ? Response.json({ access_token: 'server-only' })
      : Response.json({
          id: '22345678-1234-1234-1234-123456789012',
          email: 'redirectflow@test.invalid',
          email_confirmed_at: new Date().toISOString(),
          identities: [{ provider: 'google' }],
        });
  try {
    const callback = await request('/auth/google/callback?code=test-code', { environment, cookie: cookies(start) });
    assert.equal(callback.status, 303);
    // Fixed destination, never taken from the request.
    assert.equal(callback.headers.get('location'), env.FRONTEND_URL + '/?google=success');
    assert.match(callback.headers.get('set-cookie'), /^learnjp_oauth_mode=; .*Max-Age=0/);
    const finish = await request('/auth/google/finish', {
      method: 'POST',
      body: {},
      environment,
      cookie: cookies(start),
    });
    assert.equal(finish.status, 200, await finish.clone().text());
    assert.equal((await finish.json()).data.user.email, 'redirectflow@test.invalid');
  } finally {
    globalThis.fetch = originalFetch;
  }
  const denied = await request('/auth/google/start', { method: 'POST', body: { redirect: true }, environment });
  const failed = await request('/auth/google/callback?error=access_denied', { environment, cookie: cookies(denied) });
  assert.equal(failed.status, 303);
  assert.equal(failed.headers.get('location'), env.FRONTEND_URL + '/?google=failed');
});

test('Google expired and cancelled attempts cannot create sessions; config is opt-in', async () => {
  assert.equal((await (await request('/auth/google/config')).json()).data.enabled, false);
  const environment = {
    ...env,
    GOOGLE_AUTH_ENABLED: 'true',
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'test-public',
  };
  const start = await request('/auth/google/start', { method: 'POST', body: {}, environment });
  const cookie = cookieOf(start);
  assert.equal((await request('/auth/google/callback?error=access_denied', { cookie, environment })).status, 400);
  assert.equal((await request('/auth/google/finish', { method: 'POST', body: {}, cookie, environment })).status, 401);
  const second = await request('/auth/google/start', { method: 'POST', body: {}, environment });
  await db.prepare('UPDATE oauth_attempts SET expires_at=0').run();
  assert.equal(
    (await request('/auth/google/finish', { method: 'POST', body: {}, cookie: cookieOf(second), environment })).status,
    401,
  );
  assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens').first()).n, 0);
});

const emailEnv = () => ({
  ...env,
  EMAIL_AUTH_ENABLED: 'true',
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'test-public',
});
test('retired legacy HTTP routes cannot reach bcrypt or mutate D1; provider sessions still refresh', async () => {
  const environment = { ...emailEnv(), GOOGLE_AUTH_ENABLED: 'true' };
  for (const route of ['login', 'register', 'google/link/start', 'google/link/finish', 'email/link']) {
    const response = await request('/auth/' + route, { method: 'POST', body: {}, environment });
    assert.equal(response.status, 410, route);
  }
  assert.equal((await db.prepare('SELECT count(*) n FROM auth_rate_limits').first()).n, 0);
  assert.equal((await db.prepare('SELECT count(*) n FROM users').first()).n, 0);
  const session = await new Auth(environment).providerLogin(
    environment.SUPABASE_URL,
    crypto.randomUUID(),
    'retired-route@test.invalid',
    'email',
  );
  const response = await request('/auth/refresh', {
    method: 'POST',
    body: {},
    cookie: 'sumaryjp_refresh=' + session.refresh,
    environment,
  });
  assert.equal(response.status, 200);
  assert.equal(
    (await request('/auth/me', { token: (await response.json()).data.accessToken, environment })).status,
    200,
  );
});
const emailRequest = (action, data, extra = {}) =>
  request('/auth/email/' + action, { method: 'POST', body: data, environment: emailEnv(), ...extra });
function mockEmailProvider(t, email, overrides = {}) {
  const user = {
    id: crypto.randomUUID(),
    email,
    email_confirmed_at: new Date().toISOString(),
    is_anonymous: false,
    ...overrides,
  };
  const calls = [];
  let used = false;
  const mock = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.ok(url.startsWith('https://test.supabase.co/auth/v1/'));
    assert.equal(options.headers.apikey, 'test-public');
    assert.equal(options.redirect, 'manual');
    const path = new URL(url).pathname.replace('/auth/v1', '');
    const payload = options.body ? JSON.parse(options.body) : null;
    calls.push({ path, method: options.method, payload });
    if (path === '/user') {
      assert.equal(options.headers.Authorization, 'Bearer provider-access');
      return Response.json(user);
    }
    if (path === '/verify') {
      if (used || payload.token !== '123456') return Response.json({ code: 'otp_expired' }, { status: 403 });
      used = true;
    }
    if (path === '/token' && payload.password !== 'Email-password-123')
      return Response.json({ code: 'invalid_credentials' }, { status: 400 });
    return Response.json({ access_token: 'provider-access', refresh_token: 'provider-refresh', user });
  });
  return { user, calls, mock };
}

test('email rollout is off by default, rejects CSRF and blocks legacy registration when enabled', async t => {
  const provider = mockEmailProvider(t, 'new@test.invalid');
  assert.deepEqual((await (await request('/auth/email/config')).json()).data, { enabled: false });
  assert.equal((await request('/auth/email/register', { method: 'POST', body: input() })).status, 503);
  assert.equal(
    (
      await emailRequest(
        'register',
        { email: 'new@test.invalid', password: 'password123' },
        { headers: { Origin: 'https://evil.invalid' } },
      )
    ).status,
    403,
  );
  assert.equal(
    (await request('/auth/register', { method: 'POST', body: input(), environment: emailEnv() })).status,
    410,
  );
  assert.equal(provider.calls.length, 0);
});

test('email registration and single-use confirmation never create a local user or expose provider tokens', async t => {
  const email = 'new@test.invalid',
    provider = mockEmailProvider(t, email);
  const registered = await emailRequest('register', { email, password: 'Email-password-123', role: 'ADMIN' });
  assert.equal(registered.status, 202);
  assert.equal(registered.headers.get('set-cookie'), null);
  assert.deepEqual((await registered.json()).data, { confirmationRequired: true });
  const bad = await emailRequest('confirm', { email, code: '000000' });
  assert.equal(bad.status, 401);
  const confirmed = await emailRequest('confirm', { email, code: '123456' });
  assert.equal(confirmed.status, 200);
  assert.equal(confirmed.headers.get('set-cookie'), null);
  assert.equal((await confirmed.text()).includes('provider-access'), false);
  assert.equal((await emailRequest('confirm', { email, code: '123456' })).status, 401);
  assert.equal((await db.prepare('SELECT count(*) n FROM users').first()).n, 0);
  const login = await emailRequest('login', { email, password: 'Email-password-123' });
  assert.equal(login.status, 200);
  const payload = await login.json();
  assert.equal(payload.data.user.role, 'USER');
  assert.equal(JSON.stringify(payload).includes('provider-'), false);
  assert.match(login.headers.get('set-cookie'), /HttpOnly/);
  assert.equal((await db.prepare('SELECT password_hash FROM users').first()).password_hash, '!external-only');
  assert.equal(provider.calls.find(c => c.path === '/verify' && c.payload.token === '123456').payload.type, 'signup');
});

test('email login refuses unconfirmed, mismatched or anonymous identity and never merges an existing account by email', async t => {
  const data = input(),
    legacy = await new Auth(env).providerLogin(ISSUER + '/google', crypto.randomUUID(), data.email),
    provider = mockEmailProvider(t, data.email);
  const login = () => emailRequest('login', { email: data.email, password: 'Email-password-123' });
  provider.user.email_confirmed_at = null;
  assert.equal((await login()).status, 401);
  provider.user.email_confirmed_at = '2026-10-24';
  provider.user.is_anonymous = true;
  assert.equal((await login()).status, 401);
  provider.user.is_anonymous = false;
  provider.user.email = 'wrong@test.invalid';
  assert.equal((await login()).status, 401);
  provider.user.email = data.email;
  assert.equal((await login()).status, 409);
  // Only the existing Google identity; the email identity was never attached to it.
  assert.equal((await db.prepare('SELECT count(*) n FROM external_identities').first()).n, 1);
  assert.equal((await request('/auth/me', { token: legacy.data.accessToken })).status, 200);
});

test('recovery uses recovery OTP and revokes every local session without signing in', async t => {
  const data = input(),
    auth = new Auth(env),
    provider = mockEmailProvider(t, data.email);
  const first = await auth.providerLogin(ISSUER, provider.user.id, data.email, 'email'),
    second = await auth.providerLogin(ISSUER, provider.user.id, data.email, 'email');
  assert.equal((await emailRequest('recover', { email: data.email })).status, 202);
  const reset = await emailRequest('reset', { email: data.email, code: '123456', password: 'New-email-password-123' });
  assert.equal(reset.status, 200);
  assert.equal(reset.headers.get('set-cookie'), null);
  assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens').first()).n, 0);
  assert.equal((await request('/auth/me', { token: first.data.accessToken })).status, 401);
  assert.equal((await request('/auth/me', { token: second.data.accessToken })).status, 401);
  assert.equal(provider.calls.find(c => c.path === '/verify').payload.type, 'recovery');
  assert.deepEqual(provider.calls.find(c => c.method === 'PUT').payload, { password: 'New-email-password-123' });
  assert.equal(
    (await emailRequest('reset', { email: data.email, code: '123456', password: 'Other-password-123' })).status,
    401,
  );
});
test('recovery cannot claim an account with another identity and upstream failures do not create local sessions', async t => {
  const data = input();
  await new Auth(env).providerLogin(ISSUER + '/google', crypto.randomUUID(), data.email);
  const provider = mockEmailProvider(t, data.email);
  assert.equal(
    (await emailRequest('reset', { email: data.email, code: '123456', password: 'New-password-123' })).status,
    409,
  );
  assert.equal(
    provider.calls.some(c => c.method === 'PUT'),
    false,
  );
  provider.mock.mock.mockImplementation(async () =>
    Response.json({ code: 'unexpected_failure', message: 'private upstream details' }, { status: 500 }),
  );
  const res = await emailRequest('login', { email: data.email, password: 'Email-password-123' });
  assert.equal(res.status, 503);
  assert.equal((await res.text()).includes('private upstream'), false);
  assert.equal((await db.prepare('SELECT count(*) n FROM refresh_tokens').first()).n, 1);
});

test('email code attempts are rate limited across endpoints and reject oversized password before provider calls', async t => {
  const email = 'limited@test.invalid',
    provider = mockEmailProvider(t, email);
  assert.equal((await emailRequest('register', { email, password: 'あ'.repeat(25) })).status, 400);
  assert.equal(provider.calls.length, 0);
  for (let n = 0; n < 9; n++)
    assert.equal(
      (await emailRequest(n % 2 ? 'confirm' : 'reset', { email, code: '000000', password: 'Password-123' })).status,
      401,
    );
  assert.equal((await emailRequest('login', { email, password: 'Email-password-123' })).status, 429);
});

test('email identity does not claim Google linkage until a verified Google login', async t => {
  const email = 'emailonly@test.invalid',
    provider = mockEmailProvider(t, email);
  const result = await emailRequest('login', { email, password: 'Email-password-123' }),
    login = await result.json();
  const config = { ...emailEnv(), GOOGLE_AUTH_ENABLED: 'true' };
  const status = () => request('/auth/google/link/status', { token: login.data.accessToken, environment: config });
  assert.deepEqual((await (await status()).json()).data, { linked: false, emailIdentity: true });
  await new Auth(env).providerLogin(config.SUPABASE_URL, provider.user.id, email, 'google');
  assert.deepEqual((await (await status()).json()).data, { linked: true });
});

test('password reset fences a password login already waiting for the provider', async t => {
  const email = 'race@test.invalid',
    provider = mockEmailProvider(t, email),
    auth = new Auth(env);
  const user = await auth.providerLogin('https://test.supabase.co', provider.user.id, email, 'email');
  let entered, release;
  const started = new Promise(resolve => {
    entered = resolve;
  });
  provider.mock.mock.mockImplementation(async (url, options) => {
    if (url.includes('/token?')) {
      entered();
      await new Promise(resolve => {
        release = resolve;
      });
      return Response.json({ access_token: 'provider-access' });
    }
    if (url.endsWith('/user')) return Response.json(provider.user);
    if (url.endsWith('/verify')) return Response.json({ access_token: 'provider-access' });
    throw new Error('Unexpected provider request');
  });
  const pending = emailRequest('login', { email, password: 'Email-password-123' });
  await started;
  const reset = await emailRequest('reset', { email, code: '123456', password: 'Changed-password-123' });
  assert.equal(reset.status, 200);
  release();
  assert.equal((await pending).status, 401);
  assert.equal(
    (await db.prepare('SELECT count(*) n FROM refresh_tokens WHERE user_id=?').bind(user.data.user.id).first()).n,
    0,
  );
});
