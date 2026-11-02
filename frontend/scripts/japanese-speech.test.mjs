import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundle = await build({
  entryPoints: ['src/app/screens/study/ttsHelper.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'cjs',
});
const mod = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(mod, mod.exports);
const { createJapaneseSpeech } = mod.exports;
const setup = () => {
  const spoken = [],
    states = [],
    listeners = new Set();
  let voices = [];
  const synth = {
    cancel() {},
    getVoices: () => voices,
    speak: u => spoken.push(u),
    addEventListener: (_, f) => listeners.add(f),
    removeEventListener: (_, f) => listeners.delete(f),
  };
  const player = createJapaneseSpeech(
    synth,
    text => ({ text }),
    s => states.push(s),
  );
  return {
    spoken,
    states,
    listeners,
    player,
    voices: v => {
      voices = v;
      for (const f of [...listeners]) f();
    },
  };
};
test('rapid clicks while voices load only play the latest text; stopped requests never revive', async () => {
  const t = setup();
  const a = t.player.speak('古い');
  const b = t.player.speak('新しい');
  assert.equal(t.listeners.size, 1);
  t.voices([{ lang: 'ja-JP' }]);
  await Promise.resolve();
  assert.deepEqual(
    t.spoken.map(u => u.text),
    ['新しい'],
  );
  await a;
  assert.equal(t.states.at(-1).playing, true);
  t.spoken[0].onend();
  await b;
  assert.equal(t.states.at(-1).playing, false);
  const waiting = setup();
  const c = waiting.player.speak('停止');
  waiting.player.stop();
  await c;
  waiting.voices([{ lang: 'ja-JP' }]);
  assert.equal(waiting.spoken.length, 0);
  assert.equal(waiting.listeners.size, 0);
});
test('missing Japanese voice and playback errors reach UI; retry clears error', async () => {
  const t = setup();
  t.voices([{ lang: 'en-US' }]);
  await t.player.speak('日本語');
  assert.match(t.states.at(-1).error, /Chưa có giọng tiếng Nhật/);
  assert.equal(t.spoken.length, 0);
  t.voices([{ lang: 'ja-JP' }]);
  const retry = t.player.speak('日本語');
  assert.equal(t.states.at(-1).error, '');
  t.spoken[0].onerror({ error: 'not-allowed' });
  await retry;
  assert.match(t.states.at(-1).error, /Không phát được/);
});
test('stop during playback settles the request without stale UI updates', async () => {
  const t = setup();
  t.voices([{ lang: 'ja-JP' }]);
  const p = t.player.speak('日本語');
  const lateEnd = t.spoken[0].onend;
  t.player.stop();
  const count = t.states.length;
  lateEnd();
  await p;
  assert.equal(t.states.length, count);
  assert.deepEqual(t.states.at(-1), { playing: false, error: '' });
});

test('study hook cancels pending speech on hidden page, pagehide and unmount', async () => {
  const hookBundle = await build({
    entryPoints: ['src/app/screens/study/useJapaneseSpeech.ts'],
    bundle: true,
    write: false,
    platform: 'node',
    format: 'cjs',
    external: ['react'],
  });
  for (const action of ['hidden', 'pagehide', 'unmount']) {
    const voiceListeners = new Set(),
      documentListeners = new Map(),
      windowListeners = new Map(),
      effects = [],
      spoken = [];
    let voices = [];
    const synth = {
      cancel() {},
      getVoices: () => voices,
      speak: u => spoken.push(u),
      addEventListener: (_, f) => voiceListeners.add(f),
      removeEventListener: (_, f) => voiceListeners.delete(f),
    };
    const window = {
      speechSynthesis: synth,
      SpeechSynthesisUtterance: function (text) {
        this.text = text;
      },
      addEventListener: (n, f) => windowListeners.set(n, f),
      removeEventListener: n => windowListeners.delete(n),
    };
    const document = {
      hidden: false,
      addEventListener: (n, f) => documentListeners.set(n, f),
      removeEventListener: n => documentListeners.delete(n),
    };
    const react = {
      useState: initial => [initial, () => {}],
      useRef: initial => ({ current: initial }),
      useCallback: fn => fn,
      useEffect: fn => effects.push(fn),
    };
    const loaded = { exports: {} };
    new Function(
      'require',
      'module',
      'exports',
      'window',
      'document',
      'SpeechSynthesisUtterance',
      hookBundle.outputFiles[0].text,
    )(() => react, loaded, loaded.exports, window, document, window.SpeechSynthesisUtterance);
    const hook = loaded.exports.useJapaneseSpeech('unit1');
    const cleanup = effects[0]();
    hook.speakJapanese('日本語');
    assert.equal(voiceListeners.size, 1);
    if (action === 'hidden') {
      document.hidden = true;
      documentListeners.get('visibilitychange')();
    }
    if (action === 'pagehide') windowListeners.get('pagehide')();
    if (action === 'unmount') cleanup();
    voices = [{ lang: 'ja-JP' }];
    for (const listener of [...voiceListeners]) listener();
    await Promise.resolve();
    assert.equal(voiceListeners.size, 0);
    assert.equal(spoken.length, 0);
    if (action !== 'unmount') cleanup();
    assert.equal(windowListeners.size, 0);
    assert.equal(documentListeners.size, 0);
  }
});
