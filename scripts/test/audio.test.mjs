import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { getPlatformProxy } from 'wrangler';
import { load } from './learning-fixture.mjs';

const key = '0123456789abcdef0123456789abcdef';
const bytes = new Uint8Array(Array.from({ length: 100 }, (_, i) => i));
let proxy, bucket, serveAudio;
before(async () => {
  proxy = await getPlatformProxy({
    configPath: fileURLToPath(new URL('../../wrangler.local.jsonc', import.meta.url)),
    persist: false,
    remoteBindings: false,
    envFiles: [],
  });
  bucket = proxy.env.AUDIO;
  await bucket.put(`${key}.mp3`, bytes);
  ({ serveAudio } = await load('audio'));
});
after(() => proxy?.dispose());

const get = (path, init) => serveAudio(new Request(`https://learnjp.test${path}`, init), bucket);

test('serves a stored clip with long-lived caching', async () => {
  const res = await get(`/audio/${key}.mp3`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'audio/mpeg');
  assert.match(res.headers.get('cache-control'), /immutable/);
  assert.equal(res.headers.get('accept-ranges'), 'bytes');
  assert.deepEqual(new Uint8Array(await res.arrayBuffer()), bytes);
});

test('answers byte ranges, which Safari needs to play audio', async () => {
  const res = await get(`/audio/${key}.mp3`, { headers: { range: 'bytes=10-19' } });
  assert.equal(res.status, 206);
  assert.equal(res.headers.get('content-range'), 'bytes 10-19/100');
  assert.deepEqual([...new Uint8Array(await res.arrayBuffer())], [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  // Browsers open every media request with an open-ended range.
  const open = await get(`/audio/${key}.mp3`, { headers: { range: 'bytes=0-' } });
  assert.equal(open.status, 206);
  assert.equal(open.headers.get('content-range'), 'bytes 0-99/100');
  assert.equal(open.headers.get('content-length'), '100');
  assert.equal((await open.arrayBuffer()).byteLength, 100);
  const rest = await get(`/audio/${key}.mp3`, { headers: { range: 'bytes=90-' } });
  assert.equal(rest.headers.get('content-range'), 'bytes 90-99/100');
  await rest.arrayBuffer();
  const tail = await get(`/audio/${key}.mp3`, { headers: { range: 'bytes=-5' } });
  assert.equal(tail.status, 206);
  assert.equal(tail.headers.get('content-range'), 'bytes 95-99/100');
  await tail.arrayBuffer();
});

test('HEAD and conditional requests send no body', async () => {
  const head = await get(`/audio/${key}.mp3`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('content-length'), '100');
  const etag = head.headers.get('etag');
  const cached = await get(`/audio/${key}.mp3`, { headers: { 'if-none-match': etag } });
  assert.equal(cached.status, 304);
});

test('unknown, malformed or unconfigured audio is a 404, never the app page', async () => {
  assert.equal((await get('/audio/ffffffffffffffffffffffffffffffff.mp3')).status, 404);
  assert.equal((await get(`/audio/${key.toUpperCase()}.mp3`)).status, 404);
  assert.equal((await get('/audio/')).status, 404);
  assert.equal((await get(`/audio/${key}.wav`)).status, 404);
  const missing = await serveAudio(new Request(`https://learnjp.test/audio/${key}.mp3`), undefined);
  assert.equal(missing.status, 404);
  assert.equal(await get('/lessons/1'), null);
  assert.equal((await get(`/audio/${key}.mp3`, { method: 'POST' })).status, 405);
});
