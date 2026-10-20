import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform, build } from 'esbuild';
import { createRequire } from 'node:module';

const { code } = await transform(await readFile(new URL('../src/app/screens/study/writingDraft.ts', import.meta.url), 'utf8'), { loader: 'ts', format: 'esm' });
const { writingDraftKey: key, createWritingDraftStore: createStore } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
function fixture() {
  const data = new Map();
  let blocked = false;
  const storage = {
    getItem: k => data.get(k) ?? null,
    setItem: (k, value) => { if (blocked) throw Error('QuotaExceededError'); data.set(k, value); },
  };
  return { data, storage, store: createStore(() => storage), block: value => { blocked = value; } };
}

test('Japanese text, whitespace and final input restore across remount and a fresh page store', () => {
  const { store, storage } = fixture();
  const k = key(7, 9, 1), text = '私は学生です。\n  日本語を勉強しています。\n';
  for (let end = 1; end <= text.length; end++) assert.equal(store.save(k, text.slice(0, end)).status, 'saved');
  assert.deepEqual(store.read(k), { text, status: 'saved' });
  assert.deepEqual(createStore(() => storage).read(k), { text, status: 'saved' });
  assert.equal(store.hasPending(), false);
});

test('modules, tasks, guest and different accounts restore only their own writing', () => {
  const { store } = fixture();
  const keys = [key(7, 9), key(7, 9, 1), key(7, 9, 2), key(7, 10, 1), key(8, 9, 1)];
  assert.equal(new Set(keys).size, keys.length);
  keys.forEach((k, i) => store.save(k, `draft ${i}`));
  keys.forEach((k, i) => assert.equal(store.read(k).text, `draft ${i}`));
});

test('clearing all text stays empty after a reload', () => {
  const { store, storage } = fixture();
  store.save(key(7, 9), 'older text');
  store.save(key(7, 9), '');
  assert.deepEqual(createStore(() => storage).read(key(7, 9)), { text: '', status: 'saved' });
});

test('quota failure retains latest input across tab changes and retry persists it', () => {
  const f = fixture(), k = key(7, 9);
  f.store.save(k, 'old');
  f.block(true);
  assert.deepEqual(f.store.save(k, '新しい文章'), { text: '新しい文章', status: 'unsaved' });
  assert.deepEqual(f.store.read(k), { text: '新しい文章', status: 'unsaved' });
  assert.equal(f.store.retryPending(), false);
  f.block(false);
  assert.equal(f.store.retryPending(), true);
  assert.equal(f.store.hasPending(), false);
  assert.equal(createStore(() => f.storage).read(k).text, '新しい文章');
});

test('failed clearing cannot resurrect the previous draft on tab remount', () => {
  const f = fixture(), k = key(7, 9);
  f.store.save(k, 'old'); f.block(true); f.store.save(k, '');
  assert.deepEqual(f.store.read(k), { text: '', status: 'unsaved' });
  f.block(false); f.store.retryPending();
  assert.equal(createStore(() => f.storage).read(k).text, '');
});

test('blocked localStorage getter or reads cannot crash the editor', () => {
  const store = createStore(() => { throw Error('SecurityError'); });
  assert.deepEqual(store.read(key(7, 9)), { text: '', status: 'unavailable' });
  store.save(key(7, 9), 'typing still works');
  assert.deepEqual(store.read(key(7, 9)), { text: 'typing still works', status: 'unsaved' });
  assert.equal(store.retryPending(), false);
  const readFailure = createStore(() => ({ getItem: () => { throw Error('blocked'); } }));
  assert.equal(readFailure.read(key(7, 9)).status, 'unavailable');
});

test('corrupt or obsolete records are reported without overwriting the saved data', () => {
  const f = fixture(), k = key(7, 9);
  for (const raw of ['{', 'null', '[]', '{"version":2,"text":"old"}', '{"version":1,"text":12}']) {
    f.data.set(k, raw);
    assert.equal(f.store.read(k).status, 'invalid');
    assert.equal(f.data.get(k), raw);
    assert.equal(f.store.hasPending(), false);
  }
  f.store.save(k, 'new input');
  assert.equal(f.store.read(k).text, 'new input');
});

test('returning to a task reads external saved changes and removals, with no stale success cache', () => {
  const f = fixture(), k = key(7, 9), anotherTab = createStore(() => f.storage);
  f.store.save(k, 'first'); anotherTab.save(k, 'second');
  assert.equal(f.store.read(k).text, 'second');
  f.data.delete(k);
  assert.deepEqual(f.store.read(k), { text: '', status: 'empty' });
});

test('retry keeps failed keys pending even when other account drafts succeed', () => {
  const f = fixture(), a = key(7, 9, 1), b = key(7, 9, 2);
  f.block(true); f.store.save(a, 'A'); f.store.save(b, 'B');
  f.storage.setItem = (k, value) => { if (k === b) throw Error('failed'); f.data.set(k, value); };
  assert.equal(f.store.retryPending(), false);
  assert.equal(f.store.read(a).status, 'saved');
  assert.deepEqual(f.store.read(b), { text: 'B', status: 'unsaved' });
});

test('exercise editor labels both writing fields and keeps them disabled before identity restoration', async () => {
  const require = createRequire(import.meta.url);
  const bundle = await build({ entryPoints: ['src/app/screens/study/tabs/ExerciseStudyTab.tsx'], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic' });
  const mod = { exports: {} }; new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(require, mod, mod.exports);
  const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
  const html = renderToStaticMarkup(React.createElement(mod.exports.ExerciseStudyTab, {
    moduleId: 7, checking: true, sections: [{ id: 1, writingTasks: [
      { id: 9, prompt: 'Giới thiệu', instructions: 'Viết tự do' }, { id: 10, prompt: 'Gia đình', instructions: '5–8 câu' },
    ] }],
  }));
  for (const id of [9, 10]) {
    assert.match(html, new RegExp(`<label for="writing-7-${id}"`));
    assert.match(html, new RegExp(`<textarea[^>]*id="writing-7-${id}"[^>]*disabled=""[^>]*aria-describedby="writing-7-${id}-status"`));
  }
  assert.doesNotMatch(html, /maxLength|maxlength/);
  assert.match(html, /chưa đồng bộ sang thiết bị khác/);
});
