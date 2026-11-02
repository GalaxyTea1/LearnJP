import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { getPlatformProxy } from 'wrangler';
import { migrate, fixtures, load } from './learning-fixture.mjs';
test('readiness fails closed for configuration, schema, database and unpublished content', async () => {
  const proxy = await getPlatformProxy({
    configPath: fileURLToPath(new URL('../../wrangler.local.jsonc', import.meta.url)),
    persist: false,
    remoteBindings: false,
    envFiles: [],
  });
  const worker = (await load('worker')).default;
  const env = {
    ...proxy.env,
    APP_ENV: 'production',
    FRONTEND_URL: 'https://staging.test',
    JWT_SECRET: 'a'.repeat(48),
    QUIZ_REVISION_SECRET: 'b'.repeat(48),
    ASSETS: {
      fetch() {
        throw new Error('not used');
      },
    },
  };
  const get = (overrides = {}, method = 'GET') =>
    worker.fetch(
      new Request('https://staging.test/api/v1/health', { method, headers: { Authorization: 'Bearer stale' } }),
      { ...env, ...overrides },
    );
  const verify = async (status, overrides = {}) => {
    const r = await get(overrides);
    assert.equal(r.status, status);
    assert.equal(r.headers.get('cache-control'), 'no-store');
    const b = await r.json();
    assert.equal(b.data.ready, status === 200);
    assert.equal(b.success, status === 200);
    assert.deepEqual(Object.keys(b.data).sort(), ['ready', 'runtime']);
  };
  try {
    await verify(503); // Missing schema.
    await migrate(env.DB);
    await verify(503); // No published course.
    await fixtures(env.DB);
    await env.DB.prepare(
      "INSERT INTO lesson_sections(module_id,section_type,title,sort_order) VALUES (1,'OVERVIEW','Health fixture',1)",
    ).run();
    await verify(503);
    await env.DB.prepare("UPDATE lesson_sections SET status='PUBLISHED' WHERE module_id=1").run();
    await verify(200);
    const email = {
      EMAIL_AUTH_ENABLED: 'true',
      SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'test-public',
    };
    await env.DB.prepare('ALTER TABLE users RENAME COLUMN credential_version TO missing_email_version').run();
    await verify(503, email);
    await env.DB.prepare('ALTER TABLE users RENAME COLUMN missing_email_version TO credential_version').run();
    await verify(200, email);
    await verify(503, { ...email, SUPABASE_PUBLISHABLE_KEY: '' });
    for (const overrides of [
      { JWT_SECRET: '' },
      { QUIZ_REVISION_SECRET: '' },
      { QUIZ_REVISION_SECRET: env.JWT_SECRET },
      { QUIZ_REVISION_SECRET: 'local-only-' + 'x'.repeat(40) },
      { FRONTEND_URL: 'http://staging.test' },
      { ASSETS: undefined },
      {
        DB: {
          prepare() {
            throw new Error('private database diagnostic');
          },
        },
      },
    ])
      await verify(503, overrides);
    await env.DB.prepare('DELETE FROM assessment_revision').run();
    await verify(503);
    await env.DB.prepare('INSERT INTO assessment_revision VALUES (1,0)').run();
    const head = await get({}, 'HEAD');
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
    assert.equal((await get({}, 'POST')).status, 405);
    await env.DB.prepare('DROP TABLE content_search').run();
    await verify(503);
  } finally {
    await proxy.dispose();
  }
});
