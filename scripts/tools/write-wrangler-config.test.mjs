import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./write-wrangler-config.mjs', import.meta.url));
const run = (env, vars) =>
  spawnSync(process.execPath, [script, env, '--stdout'], {
    env: { PATH: process.env.PATH, ...vars },
    encoding: 'utf8',
  });

const base = {
  CLOUDFLARE_ACCOUNT_ID: 'acc123',
  D1_DATABASE_ID: '11111111-2222-3333-4444-555555555555',
  FRONTEND_URL: 'https://example.dev',
  SUPABASE_URL: 'https://proj.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_x',
  GOOGLE_AUTH_ENABLED: 'true',
};

test('production config is filled from the environment', () => {
  const result = run('production', { ...base, DOMAINS: 'example.dev, www.example.dev' });
  assert.equal(result.status, 0, result.stderr);
  const config = JSON.parse(result.stdout);
  assert.equal(config.account_id, 'acc123');
  assert.equal(config.d1_databases[0].database_id, base.D1_DATABASE_ID);
  assert.equal(config.d1_databases[0].database_name, 'learnjp-production');
  assert.deepEqual(config.routes, [
    { pattern: 'example.dev', custom_domain: true },
    { pattern: 'www.example.dev', custom_domain: true },
  ]);
  assert.equal(config.vars.GOOGLE_AUTH_ENABLED, 'true');
  assert.equal(config.vars.EMAIL_AUTH_ENABLED, 'false');
  assert.equal(config.vars.APP_ENV, 'production');
  assert.doesNotMatch(result.stdout, /REPLACE_/);
});

test('staging config needs no domains', () => {
  const result = run('staging', base);
  assert.equal(result.status, 0, result.stderr);
  const config = JSON.parse(result.stdout);
  assert.equal(config.name, 'learnjp-staging');
  assert.equal(config.routes, undefined);
});

test('missing or invalid values are refused', () => {
  const missing = run('production', { ...base, DOMAINS: '' });
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /DOMAINS/);
  const badFlag = run('staging', { ...base, EMAIL_AUTH_ENABLED: 'yes' });
  assert.equal(badFlag.status, 1);
  assert.match(badFlag.stderr, /EMAIL_AUTH_ENABLED/);
});
