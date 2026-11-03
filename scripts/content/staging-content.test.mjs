import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { getPlatformProxy } from 'wrangler';
import { migrate } from '../test/learning-fixture.mjs';
import { reviewedPackage } from './n5/package.mjs';
import { importPackage, literal } from './lib/staging-content.mjs';
test('content SQL imports losslessly, preserves accounts and refuses nonempty target', async () => {
  const path = await mkdtemp(new URL('../../.local/staging-import-test-', import.meta.url));
  const runtime = await getPlatformProxy({
    configPath: 'wrangler.local.jsonc',
    persist: { path },
    remoteBindings: false,
    envFiles: [],
  });
  try {
    const db = runtime.env.DB;
    await migrate(db);
    const { expected, statements } = importPackage(await reviewedPackage());
    assert.equal(literal("a'b"), "'a''b'");
    await db
      .prepare(
        "INSERT INTO users(email,username,password_hash) VALUES ('preserve@test.invalid','preserve','test-hash')",
      )
      .run();
    const before = (await db.prepare('SELECT * FROM users').all()).results;
    await db.batch(statements.map(s => db.prepare(s)));
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
    await assert.rejects(db.batch(statements.map(s => db.prepare(s))), /CHECK/);
    assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results, []);
  } finally {
    await runtime.dispose();
  }
});
