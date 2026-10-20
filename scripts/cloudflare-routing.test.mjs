import assert from 'node:assert/strict';
import test from 'node:test';

const origin = 'http://127.0.0.1:8787';
async function get(path, options = {}) {
  return fetch(`${origin}${path}`, { ...options, signal: AbortSignal.timeout(10000) });
}

test('D1 is reachable but incomplete app readiness stays 503', async () => {
  const res = await get('/api/v1/health');
  assert.equal(res.status, 503);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.data.runtime, 'cloudflare-workers');
  assert.equal(body.data.database, 'connected');
  assert.equal(body.data.ready, false);
});

for (const path of ['/api', '/api/v1/unknown']) {
  test(`API navigation never falls back to HTML: ${path}`, async () => {
    const res = await get(path, { headers: { Accept: 'text/html', 'Sec-Fetch-Mode': 'navigate' } });
    assert.equal(res.status, 503);
    assert.match(res.headers.get('content-type'), /application\/json/);
    assert.equal((await res.json()).code, 'API_MIGRATION_PENDING');
  });
}

test('login without CSRF header rejects and never creates a cookie', async () => {
  const res = await get('/api/v1/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
  });
  assert.equal(res.status, 403);
  assert.equal(res.headers.get('set-cookie'), null);
  assert.equal((await res.json()).success, false);
});

test('frontend deep link serves the SPA and built JavaScript is available', async () => {
  const options = { headers: { Accept: 'text/html', 'Sec-Fetch-Mode': 'navigate' } };
  const home = await get('/', options);
  assert.equal(home.status, 200);
  const html = await home.text();
  assert.match(html, /id="root"/);
  const deepLink = await get('/learning?moduleId=7', options);
  assert.equal(deepLink.status, 200);
  assert.equal(await deepLink.text(), html);
  const script = html.match(/src="([^\"]+\.js)"/)[1];
  const asset = await get(script);
  assert.equal(asset.status, 200);
  assert.match(asset.headers.get('content-type'), /javascript/);
});
