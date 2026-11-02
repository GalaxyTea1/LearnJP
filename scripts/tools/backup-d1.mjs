// Export a remote D1 database to .local/backups (Git-ignored: backups contain account data).
// Usage: node scripts/tools/backup-d1.mjs staging|production [keep=8]
// D1 Time Travel already restores any minute of the last 7 days (Free plan); these exports
// are the longer-term copy. Keeps the newest `keep` files per environment.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [target, keepArg = '8'] = process.argv.slice(2);
const configs = { staging: 'wrangler.staging.json', production: 'wrangler.production.json' };
if (!configs[target]) {
  console.error('Usage: node scripts/tools/backup-d1.mjs staging|production [keep]');
  process.exit(2);
}
const keep = Number(keepArg);
if (!Number.isInteger(keep) || keep < 1) {
  console.error('keep must be a positive integer');
  process.exit(2);
}

const root = resolve(import.meta.dirname, '../..');
const config = JSON.parse(readFileSync(join(root, configs[target]), 'utf8'));
const database = config.d1_databases?.[0]?.database_name;
if (!database) {
  console.error(`No D1 database in ${configs[target]}`);
  process.exit(1);
}

const dir = join(root, '.local', 'backups', target);
mkdirSync(dir, { recursive: true });
const stamp = new Date()
  .toISOString()
  .replaceAll(':', '-')
  .replace(/\.\d+Z$/, 'Z');
const file = join(dir, `${database}-${stamp}.sql`);
const result = spawnSync(
  process.execPath,
  [
    join(root, 'node_modules/wrangler/bin/wrangler.js'),
    'd1',
    'export',
    database,
    '--remote',
    '--config',
    configs[target],
    '--output',
    file,
  ],
  { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] },
);
if (result.status !== 0) {
  console.error('Export failed');
  process.exit(result.status ?? 1);
}

const sql = readFileSync(file);
const inserts = sql
  .toString('utf8')
  .split('\n')
  .filter(line => line.startsWith('INSERT')).length;
if (!inserts) {
  console.error('Export contains no rows; keeping older backups untouched');
  process.exit(1);
}
const backups = readdirSync(dir)
  .filter(name => name.startsWith(database + '-') && name.endsWith('.sql'))
  .sort();
for (const old of backups.slice(0, Math.max(0, backups.length - keep))) rmSync(join(dir, old));
console.log(
  JSON.stringify({
    target,
    database,
    file,
    bytes: statSync(file).size,
    inserts,
    sha256: createHash('sha256').update(sql).digest('hex'),
    kept: Math.min(backups.length, keep),
  }),
);
