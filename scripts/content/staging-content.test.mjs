import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getPlatformProxy } from 'wrangler';
import { migrate } from '../test/learning-fixture.mjs';
import { reviewedPackage } from './n5/package.mjs';
import { importPackage, literal } from './lib/staging-content.mjs';
test('content SQL imports losslessly, preserves accounts and refuses nonempty target', async () => {
  // The OS temp dir always exists; .local/ is gitignored and missing on a fresh checkout (CI).
  const path = await mkdtemp(join(tmpdir(), 'staging-import-test-'));
  const runtime = await getPlatformProxy({
    configPath: 'wrangler.local.jsonc',
    persist: { path },
    remoteBindings: false,
    envFiles: [],
  });
  try {
    const db = runtime.env.DB;
    // One 2,500-statement request can drop the local proxy connection when CI runs many Workers
    // in parallel, so send the import in chunks. The guard rejects a nonempty target in the first one.
    const run = async list => {
      for (let i = 0; i < list.length; i += 250) await db.batch(list.slice(i, i + 250).map(s => db.prepare(s)));
    };
    await migrate(db);
    const { expected, statements } = importPackage(await reviewedPackage());
    assert.equal(literal("a'b"), "'a''b'");
    await db
      .prepare(
        "INSERT INTO users(email,username,password_hash) VALUES ('preserve@test.invalid','preserve','test-hash')",
      )
      .run();
    const before = (await db.prepare('SELECT * FROM users').all()).results;
    await run(statements);
    for (const [t, rows] of Object.entries(expected)) {
      const order = t === 'content_search' ? 'kind,item_id' : 'id';
      const actual = (await db.prepare(`SELECT * FROM ${t} ORDER BY ${order}`).all()).results;
      assert.deepEqual(actual, rows, t);
    }
    assert.deepEqual((await db.prepare('SELECT * FROM users').all()).results, before);
    assert.equal(
      (await db.prepare('SELECT version FROM assessment_revision WHERE id=1').first()).version,
      expected.quiz_questions.length + expected.test_questions.length,
    );
    await assert.rejects(run(statements), /CHECK/);
    assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results, []);
  } finally {
    await runtime.dispose();
    await rm(path, { recursive: true, force: true });
  }
});
