import test from 'node:test';
import assert from 'node:assert/strict';
import { searchJisho, jishoQuerySchema } from '../src/services/jisho.service';
import express from 'express';
import dictionaryRoutes from '../src/routes/dictionary.routes';

test('dictionary validates keyword length, whitespace and arrays', () => {
  for (const q of ['', '   ', 'a'.repeat(101), ['cat']]) assert.equal(jishoQuerySchema.safeParse({ query: { q } }).success, false);
  assert.equal(jishoQuerySchema.parse({ query: { q: ' 猫 ' } }).query.q, '猫');
});
test('dictionary uses fixed host, encodes keyword and normalizes a bounded result', async () => {
  const entry = { japanese: [{ reading: 'ねこ' }], senses: [{ english_definitions: ['cat', 'feline'] }], jlpt: ['jlpt-n5'] };
  const data = await searchJisho('猫 & #', (async (url, options) => {
    assert.equal(new URL(String(url)).origin, 'https://jisho.org');
    assert.equal(new URL(String(url)).searchParams.get('keyword'), '猫 & #');
    assert.equal(options?.redirect, 'error');
    return Response.json({ data: Array(20).fill(entry) });
  }) as typeof fetch);
  assert.equal(data.length, 15);
  assert.equal(data[0].jp, 'ねこ'); assert.equal(data[0].en, 'cat, feline'); assert.equal(data[0].level, 'N5');
});
test('empty results succeed; upstream HTTP, invalid JSON and invalid shape fail as 502', async () => {
  assert.deepEqual(await searchJisho('x', (async () => Response.json({ data: [] })) as typeof fetch), []);
  for (const response of [new Response('', { status: 429 }), new Response('<html>'), Response.json({}), Response.json({ data: [{ japanese: [] }] })]) {
    await assert.rejects(searchJisho('x', (async () => response) as typeof fetch), { statusCode: 502 });
  }
});
test('upstream timeout is surfaced as 504', async () => {
  await assert.rejects(searchJisho('x', (async (_url, options) => {
    await new Promise(resolve => setTimeout(resolve, 20));
    options?.signal?.throwIfAborted();
    return Response.json({ data: [] });
  }) as typeof fetch, 1), { statusCode: 504 });
});

test('public HTTP endpoint validates requests and returns normalized JSON', async () => {
  const app = express(); app.use('/dictionary', dictionaryRoutes);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  const originalFetch = globalThis.fetch;
  try {
    let calls = 0;
    globalThis.fetch = (async () => { calls++; return Response.json({ data: [{ japanese: [{ word: '猫', reading: 'ねこ' }], senses: [{ english_definitions: ['cat'] }] }] }); }) as typeof fetch;
    const address = server.address() as { port: number };
    const base = `http://127.0.0.1:${address.port}/dictionary/jisho?q=`;
    assert.equal((await originalFetch(base + '%20')).status, 400);
    assert.equal(calls, 0);
    const response = await originalFetch(base + '%E7%8C%AB');
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.success, true); assert.equal(body.data[0].jp, '猫'); assert.equal(calls, 1);
  } finally {
    globalThis.fetch = originalFetch;
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
