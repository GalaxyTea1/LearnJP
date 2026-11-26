import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const load = async entry => {
  const bundle = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs' });
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(require, mod, mod.exports);
  return mod.exports;
};
const { buildQueue, answerCard, cardFace, liveStreak } = await load('src/app/screens/review/reviewSession.ts');

const vocab = (id, extra = {}) => ({
  itemType: 'VOCAB',
  itemId: id,
  itemData: { id, japanese: `語${id}`, hiragana: 'ご', english: 'word / từ', ...extra },
});

test('due cards come before new ones and duplicates are dropped', () => {
  const q = buildQueue([vocab(1), vocab(2)], [vocab(2), vocab(3)]);
  assert.deepEqual(
    q.map(c => [c.card.itemId, c.isNew]),
    [
      [1, false],
      [2, false],
      [3, true],
    ],
  );
});

test('a forgotten card returns later once and its retry is not submitted again', () => {
  let q = buildQueue(
    [1, 2, 3, 4, 5].map(id => vocab(id)),
    [],
  );
  let r = answerCard(q, 1);
  assert.equal(r.submit, true);
  assert.deepEqual(
    r.queue.map(c => c.card.itemId),
    [2, 3, 4, 1, 5],
  );
  q = r.queue;
  for (const _ of [2, 3, 4]) q = answerCard(q, 4).queue;
  r = answerCard(q, 4);
  assert.equal(r.queue[0].card.itemId, 5);
  assert.equal(r.submit, false);
  r = answerCard([q[0]], 1);
  assert.equal(r.queue.length, 1);
  assert.equal(r.submit, false);
  assert.deepEqual(answerCard([], 4), { queue: [], submit: false });
});

test('card faces show reading only when it differs and handle both kanji example shapes', () => {
  assert.equal(cardFace(vocab(1)).reading, 'ご');
  assert.equal(cardFace(vocab(1, { japanese: 'ご' })).reading, undefined);
  const kanji = exampleWords => ({
    itemType: 'KANJI',
    itemId: 9,
    itemData: { character: '一', meaning: 'one / một', onyomi: 'イチ、イツ', kunyomi: 'ひと', exampleWords },
  });
  const face = cardFace(kanji([{ jp: '一人', en: 'một người' }]));
  assert.equal(face.prompt, '一');
  assert.equal(face.speakText, 'ひと');
  assert.ok(face.details.some(d => d.value === '一人: một người'));
  assert.ok(cardFace(kanji('一日中: cả ngày')).details.some(d => d.value === '一日中: cả ngày'));
});

test('a streak only counts while the last study day is today or yesterday (UTC)', () => {
  const now = Date.parse('2026-11-27T10:00:00Z');
  assert.equal(liveStreak({ currentStreak: 4, lastStudyDate: '2026-11-27T01:00:00Z' }, now), 4);
  assert.equal(liveStreak({ currentStreak: 4, lastStudyDate: '2026-11-26T23:00:00Z' }, now), 4);
  assert.equal(liveStreak({ currentStreak: 4, lastStudyDate: '2026-11-25T23:00:00Z' }, now), 0);
  assert.equal(liveStreak(null, now), 0);
});
