import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateStaging } from '../prepare-staging.mjs';
const template = JSON.parse(await readFile(new URL('../../wrangler.staging.example.json', import.meta.url), 'utf8'));
const valid = () => ({
  ...structuredClone(template),
  account_id: 'a'.repeat(32),
  vars: { APP_ENV: 'production', FRONTEND_URL: 'https://learnjp-staging.example.workers.dev' },
  d1_databases: [{ ...template.d1_databases[0], database_id: '11111111-1111-4111-8111-111111111111' }],
});
test('staging has same-origin assets/API, separate D1 and HTTPS auth', () => {
  assert.equal(validateStaging(valid()).vars.APP_ENV, 'production');
});
test('unconfigured example cannot pass remote preflight', () => assert.throws(() => validateStaging(template)));
test('rejects local auth, secrets in vars, production destinations and invalid origin', () => {
  for (const mutate of [
    c => (c.vars.APP_ENV = 'local'),
    c => (c.vars.JWT_SECRET = 'local-only-secret'),
    c => (c.name = 'learnjp-production'),
    c => (c.routes = ['example.com/*']),
    c => (c.vars.FRONTEND_URL = 'http://learnjp-staging.example.workers.dev'),
    c => (c.vars.FRONTEND_URL += '/'),
    c => (c.vars.FRONTEND_URL = 'https://learnjp-production.example.workers.dev'),
    c => (c.d1_databases[0].database_id = template.d1_databases[0].database_id),
    c => (c.d1_databases[0].database_name = 'learnjp-production'),
    c => (c.assets.run_worker_first = []),
  ]) {
    const config = valid();
    mutate(config);
    assert.throws(() => validateStaging(config));
  }
});
