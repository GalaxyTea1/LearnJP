// Local PostgreSQL integration test. Creates an isolated schema, applies the
// complete migration history, then drops only that randomly named test schema.
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');
const config = require('dotenv').parse(readFileSync('.env'));
const url = new URL(process.env.DATABASE_URL || config.DATABASE_URL);
if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new Error('Smoke test only permits local PostgreSQL');
const schema = `auth_smoke_${randomBytes(8).toString('hex')}`;
url.searchParams.set('schema', schema);
process.env.DATABASE_URL = url.toString();
process.env.NODE_ENV = 'production';
process.env.FRONTEND_URL = 'https://app.example.test';
process.env.JWT_SECRET = randomBytes(48).toString('hex');
process.env.JWT_REFRESH_EXPIRES_IN = '2d';
process.env.REFRESH_COOKIE_SAME_SITE = 'lax';
const db = new PrismaClient({ datasources: { db: { url: url.toString() } } });
let server, appDb, schemaCreated = false;
async function main() {
  assert.match(schema, /^auth_smoke_[a-f0-9]{16}$/);
  await db.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`);
  schemaCreated = true;
  const migrated = spawnSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'deploy'], {
    env: process.env, encoding: 'utf8', timeout: 60000,
  });
  assert.equal(migrated.status, 0, `Isolated migration failed: ${migrated.stderr}`);
  console.log('PASS: all migrations on isolated PostgreSQL schema');
  const app = require('../dist/app').default;
  appDb = require('../dist/config/prisma').prisma;
  // Expected negative requests are asserted below, without noisy error logs.
  require('../dist/utils/logger').logger.silent = true;
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/v1`;
  async function request(path, { body, cookie, token, csrf = true, origin = process.env.FRONTEND_URL, method } = {}) {
    const headers = { 'Content-Type': 'application/json', Origin: origin };
    if (csrf) headers['X-Requested-With'] = 'SumaryJP';
    if (cookie) headers.Cookie = cookie;
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(base + path, { method: method || (body ? 'POST' : 'GET'), headers,
      ...(body ? { body: JSON.stringify(body) } : {}) });
    return { status: response.status, body: await response.json(), cookie: response.headers.get('set-cookie'), headers: response.headers };
  }
  const input = { email: ' AUDIT@Example.test ', username: 'auth_smoke', password: 'test-password-123', role: 'ADMIN' };
  assert.equal((await request('/auth/register', { body: input, csrf: false })).status, 403);
  const registered = await request('/auth/register', { body: input });
  assert.equal(registered.status, 201);
  assert.equal(registered.body.data.user.role, 'USER');
  assert.equal(registered.body.data.user.email, 'audit@example.test');
  assert.equal(registered.body.data.refreshToken, undefined);
  assert.match(registered.cookie, /HttpOnly/); assert.match(registered.cookie, /Secure/);
  assert.match(registered.cookie, /SameSite=Lax/); assert.match(registered.cookie, /Path=\/api\/v1\/auth/);
  assert.equal(registered.headers.get('access-control-allow-credentials'), 'true');
  assert.equal(registered.headers.get('cache-control'), 'no-store');
  let cookie = registered.cookie.split(';')[0];
  const token = registered.body.data.accessToken;
  const row = await db.refreshToken.findFirst();
  assert.match(row.token, /^[a-f0-9]{64}$/); assert.ok(!cookie.includes(row.token));
  const ttl = row.expiresAt.getTime() - Date.now();
  assert.ok(ttl > 47 * 3600000 && ttl <= 48 * 3600000);
  assert.equal((await request('/auth/me', { token })).status, 200);
  assert.equal((await request('/admin/users', { token })).status, 403);
  assert.equal((await request('/users/settings', { token, method: 'PUT', body: {
    weeklyGoalTarget: 30, userId: 999, user: { update: { role: 'ADMIN' } },
  } })).status, 200);
  assert.equal((await db.user.findFirst()).role, 'USER');
  assert.equal((await db.userLearningSettings.findFirst()).userId, registered.body.data.user.id);
  console.log('PASS: register, /me, permissions, field filtering, HttpOnly cookie, hash and configured expiry');
  const logins = await Promise.all([1, 2].map(() => request('/auth/login', { body: { login: input.username, password: input.password } })));
  assert.ok(logins.every(result => result.status === 200)); assert.notEqual(logins[0].cookie, logins[1].cookie);
  assert.equal((await request('/auth/login', { body: { login: input.username, password: 'wrong' } })).status, 401);
  assert.equal((await request('/auth/login', { body: { login: input.username, password: 'a'.repeat(73) } })).status, 400);
  const rotated = await request('/auth/refresh', { body: {}, cookie });
  assert.equal(rotated.status, 200); assert.notEqual(rotated.cookie, registered.cookie);
  assert.equal((await request('/auth/refresh', { body: {}, cookie })).status, 401);
  cookie = rotated.cookie.split(';')[0];
  const race = await Promise.all([1, 2].map(() => request('/auth/refresh', { body: {}, cookie })));
  assert.equal(race.filter(result => result.status === 200).length, 1);
  assert.ok(race.every(result => [200, 401, 409].includes(result.status)));
  cookie = race.find(result => result.status === 200).cookie.split(';')[0];
  const logout = await request('/auth/logout', { body: {}, cookie });
  assert.equal(logout.status, 200); assert.match(logout.cookie, /Expires=Thu, 01 Jan 1970/);
  assert.equal((await request('/auth/refresh', { body: {}, cookie })).status, 401);
  assert.equal((await request('/auth/logout', { body: {}, cookie })).status, 200);
  console.log('PASS: concurrent login, refresh rotation/replay/race and idempotent logout');
  const { generateRefreshToken, hashRefreshToken } = require('../dist/utils/jwt');
  const legacy = generateRefreshToken({ userId: registered.body.data.user.id, role: 'USER' });
  await db.refreshToken.create({ data: { userId: registered.body.data.user.id, token: legacy, expiresAt: new Date(Date.now() + 60000) } });
  const sql = readFileSync('prisma/migrations/20261003000000_harden_auth_sessions/migration.sql', 'utf8');
  await db.$executeRawUnsafe(sql.slice(0, sql.indexOf('CREATE TABLE')));
  assert.ok(await db.refreshToken.findUnique({ where: { token: hashRefreshToken(legacy) } }));
  console.log('PASS: migration hashes existing plaintext refresh tokens');
  const { consumeDatabaseLimit } = require('../dist/middlewares/databaseRateLimit');
  const buckets = await Promise.all(Array.from({ length: 8 }, () => consumeDatabaseLimit('smoke', 60000)));
  assert.deepEqual(buckets.map(b => b.count).sort((a, b) => a - b), [1,2,3,4,5,6,7,8]);
  assert.equal((await request('/auth/refresh', { body: {}, csrf: false })).status, 403);
  console.log('PASS: atomic PostgreSQL rate limit and CSRF rejection');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  if (appDb) await appDb.$disconnect();
  if (schemaCreated) {
    assert.match(schema, /^auth_smoke_[a-f0-9]{16}$/);
    await db.$executeRawUnsafe(`DROP SCHEMA "${schema}" CASCADE`);
    console.log('Cleaned up isolated test schema');
  }
  await db.$disconnect();
});
