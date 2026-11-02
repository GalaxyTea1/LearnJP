import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../', import.meta.url));
export function validateStaging(config) {
  assert.equal(config.name, 'learnjp-staging', 'Only the staging Worker is allowed');
  assert.match(config.account_id || '', /^[a-f0-9]{32}$/i, 'Real Cloudflare account ID required');
  assert.equal(config.vars?.APP_ENV, 'production', 'Staging must enforce HTTPS cookies');
  const origin = new URL(config.vars?.FRONTEND_URL);
  assert.equal(origin.origin, config.vars.FRONTEND_URL, 'Use the exact origin without a trailing slash');
  assert.match(
    origin.hostname,
    /^learnjp-staging\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.workers\.dev$/,
    'Use the staging workers.dev hostname',
  );
  assert.equal(origin.protocol, 'https:');
  assert.equal(origin.port, '');
  assert.equal(config.workers_dev, true);
  assert.equal(config.preview_urls, false);
  assert.ok(!config.routes && !config.route && !config.env, 'No production/custom routes or environments');
  assert.deepEqual(Object.keys(config.vars).sort(), ['APP_ENV', 'FRONTEND_URL']);
  assert.deepEqual(config.secrets?.required, ['JWT_SECRET', 'QUIZ_REVISION_SECRET']);
  assert.equal(config.d1_databases?.length, 1);
  const db = config.d1_databases[0];
  assert.equal(db.binding, 'DB');
  assert.equal(db.database_name, 'learnjp-staging');
  assert.match(db.database_id || '', /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i);
  assert.notEqual(db.database_id, '00000000-0000-0000-0000-000000000000', 'Real staging D1 ID required');
  assert.equal(db.migrations_dir, 'backend/cloudflare/migrations');
  assert.equal(config.main, 'backend/cloudflare/worker.ts');
  assert.deepEqual(config.assets, {
    directory: './frontend/dist',
    binding: 'ASSETS',
    not_found_handling: 'single-page-application',
    run_worker_first: ['/api', '/api/*'],
  });
  return config;
}
async function main() {
  const args = process.argv.slice(2),
    file = resolve(root, 'wrangler.staging.json');
  if (args[0] === '--check') {
    validateStaging(JSON.parse(await readFile(file, 'utf8')));
    console.log('Staging config valid. Remote resource ownership and secrets still require verification.');
    return;
  }
  if (args.length !== 3)
    throw new Error(
      'Usage: node scripts/prepare-staging.mjs ACCOUNT_ID STAGING_D1_ID https://learnjp-staging.SUBDOMAIN.workers.dev',
    );
  const config = JSON.parse(await readFile(resolve(root, 'wrangler.staging.example.json'), 'utf8'));
  config.account_id = args[0];
  config.d1_databases[0].database_id = args[1];
  config.vars.FRONTEND_URL = args[2];
  validateStaging(config);
  await writeFile(file, JSON.stringify(config, null, 2) + '\n', { flag: 'wx' });
  console.log(
    'Created wrangler.staging.json. Existing configuration is never overwritten. No remote action performed.',
  );
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url)
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
