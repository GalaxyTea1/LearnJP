import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { load } from '../test/learning-fixture.mjs';
import { validateStaging } from '../prepare-staging.mjs';
const config = JSON.parse(await readFile('wrangler.staging.json', 'utf8'));
// This read-only probe needs the deployment target, not provider configuration.
validateStaging({ ...config, vars: { APP_ENV: config.vars.APP_ENV, FRONTEND_URL: config.vars.FRONTEND_URL } });
assert.equal(config.account_id, '5af14e1747cecf2f16c1b95a62a53f06');
assert.equal(config.d1_databases[0].database_id, '6edc6ddb-f07c-4e23-be8e-c622b3a6bae3');
const token = (await readFile(resolve(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'), 'utf8')).match(
  /^oauth_token\s*=\s*"([^"]+)"/m,
)?.[1];
assert.ok(token);
const base = `https://api.cloudflare.com/client/v4/accounts/${config.account_id}/d1/database/${config.d1_databases[0].database_id}`;
let metas = [];
async function query(statements) {
  for (const s of statements) assert.match(s.sql.trim(), /^SELECT\b/i);
  const results = [];
  for (const statement of statements) {
    const r = await fetch(base + '/query', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(statement),
    });
    const b = await r.json();
    assert.ok(r.ok && b.success, 'D1 query failed HTTP ' + r.status + ' codes ' + b.errors?.map(e => e.code).join(','));
    for (const x of b.result) {
      assert.ok(x.success);
      metas.push(x.meta);
      results.push(x);
    }
  }
  return results;
}
const db = {
  prepare(sql) {
    return {
      sql,
      params: [],
      bind(...params) {
        return { ...this, params };
      },
      async all() {
        return (await query([{ sql: this.sql, params: this.params }]))[0];
      },
      async first(column) {
        const row = (await this.all()).results[0] ?? null;
        return column && row ? row[column] : row;
      },
    };
  },
  async batch(s) {
    return query(s.map(x => ({ sql: x.sql, params: x.params })));
  },
};
const { Content } = await load('content');
const content = new Content(db, 'measurement-only-not-a-production-secret');
const report = [];
for (const [name, fn] of [
  ['catalog', () => content.modules(new URLSearchParams())],
  ['unit1Full', () => content.full(7, true)],
  [
    'unit12Full',
    async () => {
      const m = (await content.modules(new URLSearchParams())).find(m => m.unitNumber === 12);
      metas = [];
      return content.full(m.id, true);
    },
  ],
]) {
  metas = [];
  try {
    await fn();
    report.push({
      name,
      queries: metas.length,
      rowsRead: metas.reduce((a, m) => a + (m.rows_read || 0), 0),
      rowsWritten: metas.reduce((a, m) => a + (m.rows_written || 0), 0),
      sqlDurationMs: metas.reduce((a, m) => a + (m.duration || 0), 0),
      sizeBytes: metas.at(-1)?.size_after,
    });
  } catch (e) {
    report.push({ name, error: e.message });
  }
}
await mkdir('.local/metrics', { recursive: true });
await writeFile(process.env.MEASURE_OUTPUT || '.local/metrics/d1-read-sample.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
