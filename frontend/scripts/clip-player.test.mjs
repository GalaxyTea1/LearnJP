import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
const bundle = await build({
  entryPoints: ['src/app/screens/study/clipPlayer.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'cjs',
});
const mod = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(mod, mod.exports);
const { createClipPlayer } = mod.exports;

const fakeAudio = () => {
  const audio = {
    src: '',
    played: [],
    paused: 0,
    onended: null,
    onerror: null,
    play() {
      audio.played.push(audio.src);
      return audio.rejectNext
        ? Promise.reject(Object.assign(new Error('x'), { name: audio.rejectNext }))
        : Promise.resolve();
    },
    pause() {
      audio.paused++;
    },
  };
  return audio;
};
const tick = () => new Promise(r => setTimeout(r, 0));

test('clips play in order on one element and report each line', async () => {
  const audio = fakeAudio();
  let created = 0;
  const player = createClipPlayer(() => (created++, audio));
  const lines = [];
  const done = player.play(['/audio/a.mp3', '/audio/b.mp3'], i => lines.push(i));
  await tick();
  assert.deepEqual(audio.played, ['/audio/a.mp3']);
  audio.onended();
  await tick();
  assert.deepEqual(audio.played, ['/audio/a.mp3', '/audio/b.mp3']);
  audio.onended();
  assert.equal(await done, true);
  assert.deepEqual(lines, [0, 1]);
  const again = player.play(['/audio/c.mp3'], () => {});
  player.stop();
  assert.equal(await again, false);
  assert.equal(created, 1, 'the element is reused');
});

test('stop resolves the current clip as not completed and pauses', async () => {
  const audio = fakeAudio();
  const player = createClipPlayer(() => audio);
  const done = player.play(['/audio/a.mp3', '/audio/b.mp3'], () => {});
  await tick();
  player.stop();
  assert.equal(await done, false);
  assert.ok(audio.paused > 0);
  assert.deepEqual(audio.played, ['/audio/a.mp3']);
});

test('a missing file or blocked playback rejects so the caller can fall back', async () => {
  const audio = fakeAudio();
  const player = createClipPlayer(() => audio);
  const missing = player.play(['/audio/a.mp3'], () => {});
  await tick();
  audio.onerror();
  await assert.rejects(missing, /bản ghi âm/);
  audio.rejectNext = 'NotAllowedError';
  await assert.rejects(player.play(['/audio/a.mp3'], () => {}));
  audio.rejectNext = 'AbortError';
  assert.equal(await player.play(['/audio/a.mp3'], () => {}), false);
});
