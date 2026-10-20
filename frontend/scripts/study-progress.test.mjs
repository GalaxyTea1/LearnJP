import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';
const source = await readFile(new URL('../src/app/screens/study/studyProgressSync.ts', import.meta.url), 'utf8');
const { code } = await transform(source, { loader: 'ts', format: 'esm' });
const { createStudySync, emptyDetails } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const tick = () => new Promise(resolve => setImmediate(resolve));
function setup(overrides = {}) {
  const stored = new Map(); let view, writes = 0, remote = emptyDetails();
  const storage = { get length() { return stored.size; }, key: i => [...stored.keys()][i] ?? null, getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value), removeItem: key => stored.delete(key) };
  let tail = Promise.resolve();
  const withLock = (_name, work) => { const task = tail.then(work); tail = task.catch(() => {}); return task; };
  const options = { storage, withLock, moduleId: 7, userId: 42, read: async () => remote,
    write: async patch => {
      writes++;
      const words = new Set(remote.masteredVocabularyIds);
      patch.vocabulary.forEach(w => w.mastered ? words.add(w.id) : words.delete(w.id));
      remote = { ...remote, completedTabs: [...new Set([...remote.completedTabs, ...patch.completedTabs])], masteredVocabularyIds: [...words] };
      return remote;
    }, notify: state => { view = state; }, ...overrides };
  return { options, stored, storage, make: () => createStudySync(options), view: () => view, writes: () => writes };
}
test('guest details persist locally and never call protected APIs', async () => {
  const env = setup({ userId: null, read: async () => { throw Error('guest read'); }, write: async () => { throw Error('guest write'); } });
  const sync = env.make(); await sync.start();
  sync.change({ completedTabs: ['grammar','quiz'], vocabulary: [{ id: 3, mastered: true }] });
  assert.deepEqual(env.view().completedTabs, ['grammar']);
  sync.dispose(); await env.make().start();
  assert.deepEqual(env.view().masteredVocabularyIds, [3]); assert.equal(env.view().quizCompleted, false);
});
test('server details restore with empty localStorage; guest data is not automatically merged', async () => {
  const env = setup({ read: async () => ({ completedTabs: ['kanji'], masteredVocabularyIds: [8], quizCompleted: true }) });
  env.stored.set('completed_tabs_mod_7_user_guest', '["grammar"]');
  await env.make().start();
  assert.deepEqual(env.view().completedTabs, ['kanji']); assert.equal(env.view().quizCompleted, true); assert.equal(env.writes(), 0);
});
test('failed writes survive remount and replay on the same account only', async () => {
  const env = setup(); const success = env.options.write;
  env.options.write = async () => { throw Error('offline'); };
  const first = env.make(); await first.start(); first.change({ completedTabs: ['kanji'], vocabulary: [{ id: 4, mastered: true }] }); await tick();
  assert.equal(env.view().error, true); assert.equal(env.view().pending, true); first.dispose();
  env.options.userId = 43; await env.make().start(); assert.deepEqual(env.view().completedTabs, []);
  env.options.userId = 42; env.options.write = success; await env.make().start();
  assert.deepEqual(env.view().masteredVocabularyIds, [4]); assert.equal(env.view().pending, false);
});
test('new edits during save are retained and late responses after disposal do not update UI', async () => {
  const env = setup(); const write = env.options.write; let release;
  env.options.write = patch => new Promise(resolve => { release = async () => resolve(await write(patch)); });
  const sync = env.make(); await sync.start(); sync.change({ completedTabs: [], vocabulary: [{ id: 4, mastered: true }] });
  sync.change({ completedTabs: ['grammar'], vocabulary: [{ id: 4, mastered: false }] });
  await tick(); await release(); await tick(); assert.equal(env.view().pending, true); assert.deepEqual(env.view().masteredVocabularyIds, []);
  const before = env.view(); sync.dispose(); await release(); await tick(); assert.equal(env.view(), before);
  assert.equal([...env.stored.keys()].filter(k => k.startsWith('study_ops_v2_')).length, 0); // In-flight success is ACKed after disposal.
});
test('read failure blocks changes until retry; storage failure is visible without blocking server writes', async () => {
  let offline = true;
  const env = setup({ read: async () => { if (offline) throw Error('offline'); return emptyDetails(); } });
  const sync = env.make(); await sync.start(); sync.change({ completedTabs: ['kanji'], vocabulary: [] });
  assert.equal(env.view().ready, false); assert.equal(env.writes(), 0);
  offline = false; await sync.retry(); assert.equal(env.view().ready, true);
  env.storage.setItem = () => { throw Error('quota'); };
  sync.change({ completedTabs: ['kanji'], vocabulary: [] }); await tick();
  assert.equal(env.writes(), 1); assert.equal(env.view().storageError, true); assert.equal(env.view().pending, false);
});
test('older progress response cannot revoke a newly confirmed passed quiz', async () => {
  let release; const env = setup({ write: () => new Promise(resolve => { release = resolve; }) });
  const sync = env.make(); await sync.start(); sync.change({ completedTabs: ['grammar'], vocabulary: [] }); sync.confirmQuiz();
  await tick(); release({ ...emptyDetails(), completedTabs: ['grammar'] }); await tick(); assert.equal(env.view().quizCompleted, true);
});


test('two offline tabs retain both edits after closing and replay from one tab', async () => {
  const env = setup(); const write = env.options.write;
  env.options.write = async () => { throw Error('offline'); };
  const a = env.make(), b = env.make(); await a.start(); await b.start();
  a.change({ completedTabs: ['kanji'], vocabulary: [{ id: 101, mastered: true }] });
  b.change({ completedTabs: ['grammar'], vocabulary: [{ id: 102, mastered: true }] });
  await tick(); a.dispose(); b.dispose();
  assert.equal([...env.stored.keys()].filter(k => k.startsWith('study_ops_v2_')).length, 2);
  env.options.write = write; await env.make().start();
  assert.deepEqual(env.view().masteredVocabularyIds.sort(), [101, 102]);
  assert.deepEqual(env.view().completedTabs.sort(), ['grammar', 'kanji']);
  assert.equal(env.view().pending, false); assert.equal(env.stored.size, 0);
});
test('cross-tab saves are serialized; older ACK cannot delete a newer opposite edit', async () => {
  const env = setup(); const write = env.options.write; let release; let active = 0, maximum = 0;
  env.options.write = async patch => {
    active++; maximum = Math.max(maximum, active);
    if (!release) await new Promise(resolve => { release = resolve; });
    const result = await write(patch); active--; return result;
  };
  const a = env.make(), b = env.make(); await a.start(); await b.start();
  a.change({ completedTabs: [], vocabulary: [{ id: 4, mastered: true }] }); await tick();
  b.change({ completedTabs: [], vocabulary: [{ id: 4, mastered: false }] });
  a.dispose(); release(); await tick(); await b.retry();
  assert.equal(maximum, 1); assert.deepEqual(env.view().masteredVocabularyIds, []);
  assert.equal(env.view().pending, false); assert.equal(env.stored.size, 0);
});
test('legacy pending data migrates once under the lock and survives offline failure', async () => {
  const env = setup(); const write = env.options.write;
  env.stored.set('study_pending_v1_7_user_42', JSON.stringify({ completedTabs: ['grammar'], vocabulary: [{ id: 4, mastered: true }] }));
  env.options.write = async () => { throw Error('offline'); };
  const a = env.make(), b = env.make(); await Promise.all([a.start(), b.start()]);
  assert.equal(env.stored.has('study_pending_v1_7_user_42'), false);
  assert.equal(env.stored.size, 1); a.dispose(); b.dispose();
  env.options.write = write; await env.make().start();
  assert.equal(env.writes(), 1); assert.deepEqual(env.view().masteredVocabularyIds, [4]);
});
test('successful acknowledgement removes only its operation and module/account keys stay isolated', async () => {
  const env = setup();
  env.stored.set('study_ops_v2_8_user_42_other', JSON.stringify({ id: 'other', order: 1, patch: { completedTabs: ['kanji'], vocabulary: [] } }));
  env.stored.set('study_ops_v2_7_user_43_other', JSON.stringify({ id: 'other', order: 1, patch: { completedTabs: ['grammar'], vocabulary: [] } }));
  const a = env.make(); await a.start(); a.change({ completedTabs: ['vocab'], vocabulary: [] }); await tick();
  assert.equal(env.stored.size, 2); assert.deepEqual(env.view().completedTabs, ['vocab']);
});
test('without cross-tab lock capability no account writes are attempted', async () => {
  const env = setup({ withLock: async () => { throw Error('unavailable'); } });
  const a = env.make(); await a.start();
  assert.equal(env.view().ready, false); assert.equal(env.view().error, true); assert.equal(env.writes(), 0);
});
