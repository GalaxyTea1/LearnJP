import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './learning-fixture.mjs';

const { default: worker } = await load('worker');
const assets = { fetch: async () => new Response('app') };
const call = (url, env, method = 'GET') => worker.fetch(new Request(url, { method }), { ASSETS: assets, ...env }, {});

test('pages on workers.dev redirect to the custom domain, keeping path and query', async () => {
  const res = await call('https://learnjp.example.workers.dev/learning?moduleId=9', {
    FRONTEND_URL: 'https://learnjp.dev',
  });
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://learnjp.dev/learning?moduleId=9');
});

test('API calls and writes on workers.dev are not redirected', async () => {
  const env = { FRONTEND_URL: 'https://learnjp.dev' };
  assert.notEqual((await call('https://learnjp.example.workers.dev/api/v1/unknown', env)).status, 301);
  assert.notEqual((await call('https://learnjp.example.workers.dev/learning', env, 'POST')).status, 301);
});

test('a deployment whose canonical address is workers.dev serves pages directly', async () => {
  const env = { FRONTEND_URL: 'https://learnjp-staging.example.workers.dev' };
  const res = await call('https://learnjp-staging.example.workers.dev/learning', env);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'app');
});

test('the www address redirects to the bare domain', async () => {
  const res = await call('https://www.learnjp.dev/tests', { FRONTEND_URL: 'https://learnjp.dev' });
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://learnjp.dev/tests');
});
