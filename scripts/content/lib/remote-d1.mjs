// Shared access to the D1 databases: staging and production over the Cloudflare REST API (using the
// OAuth token that `npx wrangler login` stores; run `npx wrangler whoami` to refresh it), and the
// local development database through wrangler's platform proxy.
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { openLocalD1 } from '../../d1-local.mjs';

export const configs = { staging: 'wrangler.staging.json', production: 'wrangler.production.json' };

async function oauthToken() {
  const base = process.env.APPDATA ? join(process.env.APPDATA, 'xdg.config') : join(homedir(), '.config');
  const auth = await readFile(join(base, '.wrangler/config/default.toml'), 'utf8');
  const token = auth.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];
  assert.ok(token, 'Run npx wrangler whoami first');
  return token;
}

export async function connect(target) {
  if (target === 'local') return connectLocal();
  assert.ok(configs[target], `Unknown target "${target}" (expected staging or production)`);
  const config = JSON.parse(await readFile(configs[target], 'utf8'));
  const database = config.d1_databases?.[0];
  assert.ok(config.account_id && database?.database_id, `${configs[target]} has no D1 database`);
  const token = await oauthToken();
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.account_id}/d1/database/${database.database_id}/query`;

  // D1 runs all statements of one request as a single transaction.
  async function query(sql) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql }),
    });
    const body = await response.json();
    assert.ok(
      response.ok && body.success,
      `D1 request failed: ${response.status} ${JSON.stringify(body.errors ?? '')}`,
    );
    assert.ok(body.result.every(r => r.success));
    return body.result;
  }
  const rows = async sql => (await query(sql))[0].results;

  // Full SQL export, taken before every write.
  function backup(dir, label) {
    const file = resolve(dir, `${label}-${Date.now()}.sql`);
    const result = spawnSync(
      process.execPath,
      [
        'node_modules/wrangler/bin/wrangler.js',
        'd1',
        'export',
        database.database_name,
        '--remote',
        '--config',
        configs[target],
        '--output',
        file,
      ],
      { encoding: 'utf8', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } },
    );
    assert.equal(result.status, 0, `Backup of ${target} failed`);
    return file;
  }

  // Runs a list of statements as one transaction.
  const batch = statements => query(statements.join(';\n'));
  return { target, config, query, rows, batch, backup, close: async () => {} };
}

async function connectLocal() {
  const { runtime, db } = await openLocalD1();
  const rows = async sql => (await db.prepare(sql).all()).results;
  return {
    target: 'local',
    rows,
    query: async sql => [{ results: await rows(sql), success: true }],
    batch: statements => db.batch(statements.map(s => db.prepare(s))),
    // The local database is disposable: it is rebuilt with `npm run db:seed:local`.
    backup: () => null,
    close: () => runtime.dispose(),
  };
}

// SQL literal for encoded rows: booleans and JSON are already numbers and strings at this point.
export function literal(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') {
    assert.ok(Number.isFinite(value));
    return String(value);
  }
  return `'${String(value).replaceAll("'", "''")}'`;
}

export const insert = (table, row) =>
  `INSERT INTO ${table} (${Object.keys(row).join(',')}) VALUES (${Object.values(row).map(literal).join(',')})`;
