import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { getPlatformProxy, unstable_dev, unstable_splitSqlQuery } from 'wrangler';
import { migrate, load } from './learning-fixture.mjs';

test('workerd Google callback exchanges code and refuses provider redirects', { timeout: 90000 }, async () => {
  const root = fileURLToPath(new URL('../../', import.meta.url)),
    config = join(root, 'wrangler.local.jsonc');
  await mkdir(join(root, '.local'), { recursive: true });
  const state = await mkdtemp(join(root, '.local', 'google-runtime-'));
  const proxy = await getPlatformProxy({
    configPath: config,
    persist: { path: join(state, 'v3') },
    remoteBindings: false,
    envFiles: [],
  });
  try {
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
      const sql = await readFile(join(root, 'backend/cloudflare/migrations', file), 'utf8');
      await proxy.env.DB.batch(unstable_splitSqlQuery(sql).map(s => proxy.env.DB.prepare(s)));
    }
  } finally {
    await proxy.dispose();
  }
  const server = await unstable_dev(join(root, 'scripts/test/fixtures/google-auth-runtime.ts'), {
    config,
    envFiles: [],
    local: true,
    persist: true,
    persistTo: state,
    ip: '127.0.0.1',
    port: 0,
    logLevel: 'error',
    experimental: { disableExperimentalWarning: true, disableDevRegistry: true, watch: false },
  });
  const call = (path, cookie, redirect = false) =>
    server.fetch('http://localhost/api/v1/auth/google/' + path, {
      method: path.startsWith('callback') ? 'GET' : 'POST',
      headers: {
        Origin: 'http://127.0.0.1:8787',
        'X-Requested-With': 'SumaryJP',
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
        ...(redirect ? { 'X-Test-Redirect': 'true' } : {}),
      },
      ...(path.startsWith('callback') ? {} : { body: '{}' }),
    });
  try {
    for (const redirect of [false, true]) {
      const start = await call('start');
      assert.equal(start.status, 200);
      const cookie = start.headers.get('set-cookie').split(';')[0];
      assert.equal((await call('callback?code=test-only', cookie, redirect)).status, redirect ? 400 : 200);
      assert.equal((await call('finish', cookie)).status, redirect ? 401 : 200);
      const email = await server.fetch('http://localhost/api/v1/auth/email/login', {
        method: 'POST',
        headers: {
          Origin: 'http://127.0.0.1:8787',
          'X-Requested-With': 'SumaryJP',
          'Content-Type': 'application/json',
          ...(redirect ? { 'X-Test-Redirect': 'true' } : {}),
        },
        body: JSON.stringify({ email: 'runtime@test.invalid', password: 'test-password-123' }),
      });
      assert.equal(email.status, redirect ? 401 : 200);
    }
  } finally {
    await server.stop();
    await rm(state, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
});

// Real Worker execution, separate persisted D1. Never modifies the main local content DB.
test(
  'workerd HTTP: provider session/me/content/rotation/replay/logout; legacy routes retired',
  { timeout: 90000 },
  async () => {
    const root = fileURLToPath(new URL('../../', import.meta.url));
    const config = join(root, 'wrangler.local.jsonc');
    await mkdir(join(root, '.local'), { recursive: true });
    const state = await mkdtemp(join(root, '.local', 'cf3-http-'));
    const proxy = await getPlatformProxy({
      configPath: config,
      persist: { path: join(state, 'v3') },
      remoteBindings: false,
      envFiles: [],
    });
    let provider, first;
    try {
      await migrate(proxy.env.DB);
      const { Auth } = await load('auth');
      const subject = crypto.randomUUID();
      first = await new Auth(proxy.env).providerLogin(
        'https://test.supabase.co',
        subject,
        'http-smoke@test.invalid',
        'email',
      );
      provider = await new Auth(proxy.env).providerLogin(
        'https://test.supabase.co',
        subject,
        'http-smoke@test.invalid',
        'email',
      );
    } finally {
      await proxy.dispose();
    }
    const server = await unstable_dev(join(root, 'backend/cloudflare/worker.ts'), {
      config,
      envFiles: [],
      local: true,
      persist: true,
      persistTo: state,
      ip: '127.0.0.1',
      port: 0,
      logLevel: 'error',
      experimental: { disableExperimentalWarning: true, disableDevRegistry: true, watch: false },
    });
    const call = async (path, { method = 'GET', token, cookie, body, headers = {} } = {}) =>
      fetch(`http://${server.address}:${server.port}/api/v1${path}`, {
        method,
        signal: AbortSignal.timeout(15000),
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'SumaryJP',
          Origin: 'http://127.0.0.1:8787',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
          ...(cookie ? { Cookie: cookie } : {}),
          ...headers,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    const cookie = r => r.headers.get('set-cookie')?.split(';')[0];
    try {
      for (const route of ['/auth/register', '/auth/login'])
        assert.equal((await call(route, { method: 'POST', body: { login: 'a', password: 'b' } })).status, 410);
      const login = { headers: new Headers({ 'set-cookie': 'sumaryjp_refresh=' + provider.refresh }) };
      const session = provider.data;
      assert.equal(session.user.role, 'USER');
      assert.equal((await call('/auth/me', { token: session.accessToken })).status, 200);
      assert.equal((await call('/modules', { token: session.accessToken })).status, 200);
      assert.equal((await call('/admin/dashboard', { token: session.accessToken })).status, 403);
      assert.equal(
        (
          await call('/auth/refresh', {
            method: 'POST',
            cookie: cookie(login),
            body: {},
            headers: { Origin: 'https://evil.invalid' },
          })
        ).status,
        403,
      );
      const results = await Promise.all(
        Array.from({ length: 8 }, () => call('/auth/refresh', { method: 'POST', cookie: cookie(login), body: {} })),
      );
      const winners = results.filter(r => r.status === 200);
      assert.equal(winners.length, 1);
      for (const r of results.filter(r => r.status !== 200)) {
        assert.ok([401, 409].includes(r.status));
        assert.equal(cookie(r), undefined);
      }
      assert.notEqual(cookie(winners[0]), cookie(login));
      const refreshed = (await winners[0].json()).data;
      const logout = await call('/auth/logout', { method: 'POST', cookie: cookie(login), body: {} });
      assert.equal(logout.status, 200);
      assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
      assert.equal((await call('/auth/me', { token: refreshed.accessToken })).status, 401);
      assert.equal((await call('/auth/refresh', { method: 'POST', cookie: cookie(winners[0]), body: {} })).status, 401);
      assert.equal((await call('/auth/me', { token: first.data.accessToken })).status, 200); // Other device survives.
    } finally {
      await server.stop();
      await rm(state, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    }
  },
);
