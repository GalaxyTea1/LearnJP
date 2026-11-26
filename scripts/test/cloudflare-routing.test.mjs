import assert from 'node:assert/strict';
import test, { after } from 'node:test';
import { startLocalServer } from './local-server.mjs';
import { migrate } from './learning-fixture.mjs';

// CF_TEST_ORIGIN points the checks at a running deployment instead of a local server.
const server = process.env.CF_TEST_ORIGIN ? null : await startLocalServer(migrate);
const origin = process.env.CF_TEST_ORIGIN || server.origin;
after(() => server?.stop());
async function get(path, options = {}) {
  return fetch(`${origin}${path}`, { ...options, signal: AbortSignal.timeout(10000) });
}

test('health reports readiness consistently without caching', async () => {
  const res = await get('/api/v1/health');
  assert.ok([200, 503].includes(res.status));
  assert.equal(res.headers.get('cache-control'), 'no-store');
  const body = await res.json();
  assert.equal(body.data.ready, res.status === 200);
  assert.equal(body.success, body.data.ready);
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
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
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
  // Every page load is the same app with its own head; a lesson that does not exist answers 404.
  const strip = page =>
    page
      .replace(/<head>[\s\S]*<\/head>/, '')
      .replace(/<div id="root">[\s\S]*?<\/main><\/div>/, '<div id="root"></div>');
  const deepLink = await get('/learning?moduleId=7', options);
  assert.equal(deepLink.status, 404);
  const deepHtml = await deepLink.text();
  assert.match(deepHtml, /<meta name="robots" content="noindex" \/>/);
  assert.equal(strip(deepHtml), strip(html));
  const tests = await get('/tests', options);
  assert.equal(tests.status, 200);
  assert.match(await tests.text(), /<link rel="canonical" href="[^"]+\/tests" \/>/);
  const sitemap = await get('/sitemap.xml');
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /<urlset/);
  const script = html.match(/src="([^\"]+\.js)"/)[1];
  const asset = await get(script);
  assert.equal(asset.status, 200);
  assert.match(asset.headers.get('content-type'), /javascript/);
});
