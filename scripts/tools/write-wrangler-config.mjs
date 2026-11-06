// Writes wrangler.<env>.json from the checked-in wrangler.<env>.example.json and environment
// variables, so CI can deploy without the account-specific config being in Git.
//
//   node scripts/tools/write-wrangler-config.mjs staging|production [--stdout]
//
// Required: CLOUDFLARE_ACCOUNT_ID, D1_DATABASE_ID, FRONTEND_URL, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY.
// Production also needs DOMAINS (comma-separated custom domains, e.g. "learnjp.dev,www.learnjp.dev").
// Optional: GOOGLE_AUTH_ENABLED, EMAIL_AUTH_ENABLED ("true"/"false", default "false").
import { readFileSync, writeFileSync } from 'node:fs';

const env = process.argv[2];
if (!['staging', 'production'].includes(env)) {
  console.error('Usage: write-wrangler-config.mjs staging|production [--stdout]');
  process.exit(2);
}

const missing = [];
const required = name => {
  const value = process.env[name]?.trim();
  if (!value) missing.push(name);
  return value;
};
const flag = name => {
  const value = (process.env[name] ?? 'false').trim();
  if (value !== 'true' && value !== 'false') missing.push(`${name} (must be "true" or "false")`);
  return value;
};

const root = new URL('../../', import.meta.url);
const config = JSON.parse(readFileSync(new URL(`wrangler.${env}.example.json`, root), 'utf8'));

config.account_id = required('CLOUDFLARE_ACCOUNT_ID');
config.d1_databases[0].database_id = required('D1_DATABASE_ID');
Object.assign(config.vars, {
  FRONTEND_URL: required('FRONTEND_URL'),
  SUPABASE_URL: required('SUPABASE_URL'),
  SUPABASE_PUBLISHABLE_KEY: required('SUPABASE_PUBLISHABLE_KEY'),
  GOOGLE_AUTH_ENABLED: flag('GOOGLE_AUTH_ENABLED'),
  EMAIL_AUTH_ENABLED: flag('EMAIL_AUTH_ENABLED'),
});
if (env === 'production') {
  const domains = (required('DOMAINS') ?? '')
    .split(',')
    .map(d => d.trim())
    .filter(Boolean);
  config.routes = domains.map(pattern => ({ pattern, custom_domain: true }));
}

if (missing.length) {
  console.error(`Missing or invalid: ${missing.join(', ')}`);
  process.exit(1);
}
const leftover = JSON.stringify(config).match(/REPLACE_[A-Z_]+|0{8}-0{4}-0{4}-0{4}-0{12}/);
if (leftover) {
  console.error(`Placeholder left in config: ${leftover[0]}`);
  process.exit(1);
}

const json = `${JSON.stringify(config, null, 2)}\n`;
if (process.argv.includes('--stdout')) process.stdout.write(json);
else {
  writeFileSync(new URL(`wrangler.${env}.json`, root), json);
  console.log(`Wrote wrangler.${env}.json`);
}
