import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { getPlatformProxy } from 'wrangler';
import { migrate, fixtures, load } from './learning-fixture.mjs';

let proxy, db, Content, describePage, renderShell, vietnamese, serveSitemap;
const shell = await readFile(new URL('../../frontend/index.html', import.meta.url), 'utf8');
const origin = 'https://learnjp.dev';
before(async () => {
  proxy = await getPlatformProxy({
    configPath: fileURLToPath(new URL('../../wrangler.local.jsonc', import.meta.url)),
    persist: false,
    remoteBindings: false,
    envFiles: [],
  });
  db = proxy.env.DB;
  await migrate(db);
  await fixtures(db);
  ({ Content } = await load('content'));
  ({ describePage, renderShell, vietnamese, serveSitemap } = await load('seo'));
});
after(async () => {
  await proxy?.dispose();
});
const content = () => new Content(db, 'local-only-quiz-revision-key-not-for-production');
const page = path => describePage(new URL(origin + path), content());

test('a lesson page carries its own title, description, canonical URL and readable content', async () => {
  const p = await page('/learning?moduleId=1');
  assert.match(p.title, /^N5 Bài \d+: .+ \| LearnJP$/);
  assert.match(p.description, /từ vựng/);
  assert.ok(p.description.length <= 160);
  assert.equal(p.path, '/learning?moduleId=1');
  assert.match(p.body, /<h1>N5 · Bài/);
  assert.match(p.body, /<h2>Từ vựng<\/h2>/);
  const html = renderShell(shell, p, origin);
  assert.match(html, /<link rel="canonical" href="https:\/\/learnjp.dev\/learning\?moduleId=1" \/>/);
  assert.match(html, /<div id="root"><main class="ssr-content"/);
  assert.equal(html.match(/<title>/g).length, 1);
  assert.ok(html.includes(`<title>${p.title.replace(/&/g, '&amp;')}</title>`));
  assert.doesNotMatch(html, /noindex/);
});

test('drafts, missing and malformed lessons are not indexed', async () => {
  for (const path of ['/learning?moduleId=3', '/learning?moduleId=999']) {
    const p = await page(path);
    assert.equal(p.status, 404);
    assert.equal(p.noindex, true);
    assert.equal(p.body, undefined);
  }
  const bad = await page('/learning?moduleId=1abc');
  assert.equal(bad.noindex, true);
  const html = renderShell(shell, bad, origin);
  assert.match(html, /<meta name="robots" content="noindex" \/>/);
  assert.doesNotMatch(html, /rel="canonical"/);
});

test('the course and home pages link every published lesson so crawlers can find them', async () => {
  for (const path of ['/learning', '/']) {
    const p = await page(path);
    assert.match(p.body, /href="\/learning\?moduleId=1"/);
    assert.match(p.body, /href="\/learning\?moduleId=2"/);
    assert.doesNotMatch(p.body, /moduleId=3/);
  }
});

test('static pages, private pages and unknown paths', async () => {
  assert.match((await page('/tests')).title, /thi thử/i);
  assert.equal((await page('/review')).noindex, true);
  const unknown = await page('/khong-co');
  assert.equal(unknown.status, 404);
  assert.equal(unknown.noindex, true);
});

test('text from the database is escaped', () => {
  const html = renderShell(
    shell,
    { title: 'a</title><script>x</script>', description: '"><img>', path: '/x"', body: '<p>ok</p>' },
    origin,
  );
  assert.doesNotMatch(html, /<script>x/);
  assert.doesNotMatch(html, /content=""><img>/);
  assert.match(html, /href="https:\/\/learnjp.dev\/x&quot;"/);
});

test('meanings show their Vietnamese half', () => {
  assert.equal(vietnamese('move house / chuyển nhà'), 'chuyển nhà');
  assert.equal(vietnamese('chào buổi sáng'), 'chào buổi sáng');
  assert.equal(vietnamese(null), '');
});

test('the sitemap lists fixed pages and published lessons only', async () => {
  const env = { DB: db, QUIZ_REVISION_SECRET: 'x', FRONTEND_URL: origin };
  const res = await serveSitemap(new Request(origin + '/sitemap.xml'), env, () => {});
  assert.match(res.headers.get('content-type'), /application\/xml/);
  const xml = await res.text();
  assert.match(xml, /<loc>https:\/\/learnjp.dev\/tests<\/loc>/);
  assert.match(xml, /moduleId=1<\/loc>/);
  assert.doesNotMatch(xml, /moduleId=3/);
  assert.doesNotMatch(xml, /\/review/);
  assert.equal(await serveSitemap(new Request(origin + '/other.xml'), env, () => {}), null);
});
