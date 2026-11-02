import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { getPlatformProxy } from 'wrangler';
import { migrate, fixtures, quizQuestions, load } from './learning-fixture.mjs';

let proxy, db, Content, edgeCache;
const secret = 'local-only-quiz-revision-key-not-for-production';
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
  await quizQuestions(db);
  ({ Content } = await load('content'));
  ({ edgeCache } = await load('content-cache'));
});
after(async () => {
  delete globalThis.caches;
  await proxy?.dispose();
});

const live = async () =>
  (
    await db
      .prepare(
        `SELECT m.id AS module_id,
  (SELECT count(*) FROM vocabulary WHERE module_id=m.id) AS vocabulary,(SELECT count(*) FROM kanji WHERE module_id=m.id) AS kanji,
  (SELECT count(*) FROM grammar_patterns WHERE module_id=m.id) AS grammar,(SELECT count(*) FROM quiz_questions WHERE module_id=m.id) AS quiz
  FROM learning_modules m ORDER BY m.id`,
      )
      .all()
  ).results;
const stored = async () =>
  (
    await db
      .prepare(
        `SELECT m.id AS module_id,coalesce(c.vocabulary,0) AS vocabulary,coalesce(c.kanji,0) AS kanji,
  coalesce(c.grammar,0) AS grammar,coalesce(c.quiz,0) AS quiz FROM learning_modules m LEFT JOIN module_content_counts c ON c.module_id=m.id ORDER BY m.id`,
      )
      .all()
  ).results;
const version = async () => (await db.prepare('SELECT version FROM content_cache_version WHERE id=1').first()).version;

test('trigger-maintained counts follow insert, move, detach and delete', async () => {
  assert.deepEqual(await stored(), await live());
  const vocab = await db.prepare('SELECT * FROM vocabulary WHERE id=1').first();
  await db.prepare('UPDATE vocabulary SET module_id=2 WHERE id=1').run();
  await db.prepare('UPDATE vocabulary SET module_id=NULL WHERE id=2').run();
  await db
    .prepare('DELETE FROM quiz_questions WHERE id IN (SELECT id FROM quiz_questions WHERE module_id=1 LIMIT 3)')
    .run();
  assert.deepEqual(await stored(), await live());
  // Restore so the remaining assertions see the original fixture.
  await db.batch([
    db.prepare('UPDATE vocabulary SET module_id=? WHERE id=1').bind(vocab.module_id),
    db.prepare('UPDATE vocabulary SET module_id=1 WHERE id=2'),
  ]);
  await quizQuestions(db);
  assert.deepEqual(await stored(), await live());
  const content = new Content(db, secret);
  for (const m of await content.modules(new URLSearchParams())) assert.deepEqual(m._count, await content.counts(m.id));
});

test('content writes bump the cache version; learner writes do not', async () => {
  const start = await version();
  await db
    .prepare("INSERT INTO users(email,username,password_hash) VALUES ('cache@test.invalid','cache_user','x')")
    .run();
  const user = (await db.prepare("SELECT id FROM users WHERE username='cache_user'").first()).id;
  await db
    .prepare(
      "INSERT INTO user_module_progress(user_id,module_id,status,progress_percent) VALUES (?,1,'IN_PROGRESS',40)",
    )
    .bind(user)
    .run();
  assert.equal(await version(), start);
  await db.prepare('UPDATE learning_modules SET title=title WHERE id=1').run();
  assert.ok((await version()) > start);
});

test('edge cache serves shared content, keeps progress personal and invalidates on writes', async () => {
  const store = new Map();
  let puts = 0,
    hits = 0;
  globalThis.caches = {
    default: {
      async match(r) {
        const v = store.get(r.url);
        if (v) {
          hits++;
          return new Response(v);
        }
      },
      async put(r, res) {
        puts++;
        store.set(r.url, await res.text());
      },
    },
  };
  const cache = edgeCache(db, 'https://learnjp.test');
  const guest = () => new Content(db, secret, undefined, false, edgeCache(db, 'https://learnjp.test'));
  const first = await guest().full(1, true);
  assert.equal(puts, 1);
  const second = await guest().full(1, true);
  assert.equal(hits, 1);
  assert.deepEqual(second, first);
  assert.equal(first.userProgress.status, 'NOT_STARTED');
  // A signed-in learner reuses the cached lesson but receives only their own progress.
  const user = (await db.prepare("SELECT id FROM users WHERE username='cache_user'").first()).id;
  const mine = await new Content(db, secret, user, false, cache).full(1, true);
  assert.equal(hits, 2);
  assert.equal(mine.userProgress.progressPercent, 40);
  const catalog = await new Content(db, secret, user, false, cache).modules(new URLSearchParams());
  assert.equal(catalog.find(m => m.id === 1).progressPercent, 40);
  assert.equal((await guest().modules(new URLSearchParams())).find(m => m.id === 1).progressPercent, 0);
  // Preview never reads or writes the shared cache.
  const before = puts + hits;
  await new Content(db, secret, undefined, true, cache).full(3, true);
  assert.equal(puts + hits, before);
  // Errors are not cached; a draft stays hidden.
  await assert.rejects(guest().full(3, true), { status: 404 });
  await assert.rejects(guest().full(3, true), { status: 404 });
  // Editing content yields a new key, so the next guest read is fresh.
  await db.prepare("UPDATE learning_modules SET title='Cache refreshed' WHERE id=1").run();
  assert.equal((await guest().full(1, true)).title, 'Cache refreshed');
  assert.equal((await guest().modules(new URLSearchParams())).find(m => m.id === 1).title, 'Cache refreshed');
  // Unpublishing invalidates too.
  await db.prepare("UPDATE learning_modules SET content_status='DRAFT' WHERE id=2").run();
  await assert.rejects(guest().full(2, false), { status: 404 });
  assert.deepEqual(
    (await guest().modules(new URLSearchParams())).map(m => m.id),
    [1],
  );
  await db.prepare("UPDATE learning_modules SET content_status='PUBLISHED' WHERE id=2").run();
});

test('a missing version table disables caching instead of failing reads', async () => {
  let touched = false;
  globalThis.caches = {
    default: {
      async match() {
        touched = true;
      },
      async put() {
        touched = true;
      },
    },
  };
  const broken = {
    prepare: sql =>
      sql.includes('content_cache_version')
        ? {
            first: async () => {
              throw new Error('no such table');
            },
          }
        : db.prepare(sql),
    batch: s => db.batch(s),
  };
  const content = new Content(db, secret, undefined, false, edgeCache(broken, 'https://learnjp.test'));
  assert.equal((await content.full(1, false)).id, 1);
  assert.equal(touched, false);
});
