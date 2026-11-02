// Anonymous auth checks against a deployed environment. Accounts now come only from Google or
// email (Supabase), so this checks the boundaries that need no session.
// Usage: node scripts/tools/check-staging-auth.mjs --run [origin]
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
if (!process.argv.includes('--run')) throw new Error('Use --run to send requests to the deployed Worker');
const origin =
  process.argv.slice(2).find(a => a.startsWith('https://')) || 'https://learnjp-staging.trongdv031199.workers.dev';
const checks = [];
const check = (ok, label) => {
  if (!ok) throw new Error(label);
  checks.push(label);
};
const call = async (path, { method = 'GET', token, cookie, body, headers = {} } = {}) =>
  fetch(origin + '/api/v1' + path, {
    method,
    redirect: 'manual',
    signal: AbortSignal.timeout(20000),
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'SumaryJP',
      Origin: origin,
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
const root = fileURLToPath(new URL('../../', import.meta.url)),
  dir = resolve(root, '.local/staging-auth', new Date().toISOString().replaceAll(':', '-'));
await mkdir(dir, { recursive: true });
const report = { origin, startedAt: new Date().toISOString(), checks, passed: false };
try {
  for (const route of ['/auth/register', '/auth/login'])
    check(
      (await call(route, { method: 'POST', body: { login: 'qa@test.invalid', password: 'unused' } })).status === 410,
      `${route} is retired (410)`,
    );
  for (const headers of [
    { Origin: 'https://untrusted.invalid' },
    { 'X-Requested-With': '' },
    { 'Sec-Fetch-Site': 'cross-site' },
  ]) {
    const denied = await call('/auth/refresh', { method: 'POST', body: {}, headers });
    check(denied.status === 403 && !denied.headers.get('set-cookie'), 'CSRF rejection on refresh sets no cookie');
  }
  const noCookie = await call('/auth/refresh', { method: 'POST', body: {} });
  check(noCookie.status === 401, 'Refresh without cookie is 401');
  const forged = await call('/auth/refresh', { method: 'POST', cookie: '__Secure-sumaryjp_refresh=forged', body: {} });
  check(forged.status === 401, 'Refresh with forged cookie is 401');
  check((await call('/auth/me')).status === 401, 'Profile without token is 401');
  check((await call('/auth/me', { token: 'forged.token.value' })).status === 401, 'Profile with forged token is 401');
  check([401, 403].includes((await call('/admin/dashboard')).status), 'Admin without token is rejected');
  const logout = await call('/auth/logout', { method: 'POST', body: {} });
  check(logout.status === 200, 'Logout without session succeeds');
  const google = await call('/auth/google/start', {
    method: 'POST',
    body: { redirect: true },
    headers: { Origin: 'https://untrusted.invalid' },
  });
  check(google.status === 403, 'Google start rejects foreign origin');
  report.passed = true;
} catch (e) {
  report.failure = e.message;
  process.exitCode = 1;
} finally {
  report.completedAt = new Date().toISOString();
  await writeFile(resolve(dir, 'result.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, receipt: resolve(dir, 'result.json') }));
}
