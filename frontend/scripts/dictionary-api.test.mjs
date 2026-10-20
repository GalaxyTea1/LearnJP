import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';

const source = await readFile(new URL('../src/app/services/api.ts', import.meta.url), 'utf8');
const { code } = await transform(source, { loader: 'ts', format: 'esm', define: { 'import.meta.env.VITE_API_URL': '"https://api.example.test"' } });
globalThis.localStorage = { getItem: () => null };
const { dictionaryApi, contentApi } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);

test('remote dictionary uses production backend origin and forwards cancellation', async () => {
  const controller = new AbortController();
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.example.test/api/v1/dictionary/jisho?q=%E7%8C%AB%20%26%20dog');
    assert.equal(options.signal, controller.signal);
    return Response.json({ success: true, data: [{ jp: '猫' }] });
  };
  assert.equal((await dictionaryApi.searchRemote('猫 & dog', controller.signal)).data[0].jp, '猫');
});
test('upstream failures and HTML fallback are errors, not empty search results', async () => {
  const signal = new AbortController().signal;
  for (const response of [Response.json({ success: false }, { status: 502 }), new Response('<html>SPA</html>')]) {
    globalThis.fetch = async () => response;
    await assert.rejects(dictionaryApi.searchRemote('cat', signal));
  }
});

test('content searches encode q, filters and pagination',async()=>{
  for(const [kind,method] of [['vocabulary','getVocabulary'],['kanji','getKanji'],['grammar','getGrammar']]) {
    globalThis.fetch=async(url,options)=>{
      const parsed=new URL(url);assert.equal(parsed.pathname,'/api/v1/'+kind);assert.equal(parsed.searchParams.get('q'),'日本 & học');assert.equal(parsed.searchParams.get('moduleId'),'6');assert.equal(parsed.searchParams.get('limit'),'10');assert.ok(options.signal);return Response.json({success:true,data:[]});
    };
    await contentApi[method]({q:'日本 & học',moduleId:6,limit:10});
  }
});
