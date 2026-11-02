import {
  Auth,
  type AuthEnv,
  authenticate,
  body,
  cookieHeader,
  consumeLimit,
  csrf,
  digest,
  validateAuthSettings,
} from './auth';
import { HttpError, json } from './http';

type GoogleEnv = AuthEnv & { SUPABASE_URL?: string; SUPABASE_PUBLISHABLE_KEY?: string; GOOGLE_AUTH_ENABLED?: string };
type Attempt = {
  id: string;
  verifier: string;
  expires_at: number;
  status: string;
  subject: string | null;
  email: string | null;
  link_user_id: number | null;
  link_session_id: string | null;
  link_password_hash: string | null;
};
const prefix = '/api/v1/auth/google';
const stamp = () => Math.floor(Date.now() / 1000);
const random = () =>
  btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
function config(env: GoogleEnv) {
  if (env.GOOGLE_AUTH_ENABLED !== 'true' || !env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY)
    throw new HttpError(503, 'Google sign-in unavailable');
  const url = new URL(env.SUPABASE_URL);
  if (url.origin !== env.SUPABASE_URL || url.protocol !== 'https:' || !url.hostname.endsWith('.supabase.co'))
    throw new HttpError(503, 'Google sign-in unavailable');
  return { url: url.origin, key: env.SUPABASE_PUBLISHABLE_KEY };
}
function name(env: GoogleEnv) {
  return env.APP_ENV === 'production' ? '__Secure-learnjp_oauth' : 'learnjp_oauth';
}
function flowCookie(env: GoogleEnv, value: string | null, cookie = name(env)) {
  return `${cookie}=${value || ''}; Path=${prefix}; HttpOnly; SameSite=Lax; Max-Age=${value ? 300 : 0}${env.APP_ENV === 'production' ? '; Secure' : ''}`;
}
// Marks a full-page (no popup) sign-in so the callback returns to the app instead of
// rendering the close-this-window page. In-app browsers (Zalo, Messenger) block popups.
const modeName = (env: GoogleEnv) => name(env) + '_mode';
const redirectMode = (request: Request, env: GoogleEnv) =>
  request.headers
    .get('cookie')
    ?.split(';')
    .some(v => v.trim() === modeName(env) + '=redirect') ?? false;
function backToApp(env: GoogleEnv, ok: boolean) {
  // Fixed destination: never derived from the request, so this cannot become an open redirect.
  return new Response(null, {
    status: 303,
    headers: {
      Location: env.FRONTEND_URL + '/?google=' + (ok ? 'success' : 'failed'),
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'Set-Cookie': flowCookie(env, null, modeName(env)),
    },
  });
}
async function attempt(request: Request, env: GoogleEnv) {
  const raw = request.headers
    .get('cookie')
    ?.split(';')
    .map(v => v.trim())
    .find(v => v.startsWith(name(env) + '='))
    ?.slice(name(env).length + 1);
  if (!raw || !/^[-_a-zA-Z0-9]{43}$/.test(raw)) throw new HttpError(401, 'Google sign-in expired');
  const row = await env.DB.prepare('SELECT * FROM oauth_attempts WHERE id=? AND expires_at>?')
    .bind(await digest(raw), stamp())
    .first<Attempt>();
  if (!row) throw new HttpError(401, 'Google sign-in expired');
  return row;
}
function page(ok: boolean) {
  const message = ok
    ? 'Đã xác thực Google. Bạn có thể đóng cửa sổ này và quay lại bài học.'
    : 'Không thể xác thực Google. Hãy đóng cửa sổ này và thử lại từ LearnJP.';
  return new Response(
    `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>LearnJP</title><body><h1>LearnJP</h1><p>${message}</p></body></html>`,
    {
      status: ok ? 200 : 400,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
      },
    },
  );
}
export async function handleGoogleAuth(request: Request, env: GoogleEnv): Promise<Response | null> {
  const url = new URL(request.url),
    path = url.pathname;
  if (!path.startsWith(prefix + '/')) return null;
  const headers = new Headers();
  try {
    validateAuthSettings(env);
    if (path === prefix + '/config' && request.method === 'GET') {
      let enabled = false;
      try {
        config(env);
        enabled = true;
      } catch {}
      return json({ success: true, data: { enabled } });
    }
    const settings = config(env);
    // Linking a username/password account to Google was part of the retired legacy auth.
    if (path === prefix + '/link/start' || path === prefix + '/link/finish')
      throw new HttpError(410, 'Legacy authentication retired');
    if (path === prefix + '/link/status' && request.method === 'GET') {
      const user = await authenticate(request, env);
      const linked = await env.DB.prepare(
        'SELECT google_verified FROM external_identities WHERE issuer=? AND user_id=?',
      )
        .bind(settings.url, user.id)
        .first<{ google_verified: number }>();
      return json({
        success: true,
        data: {
          linked: Boolean(linked?.google_verified),
          ...(linked && !linked.google_verified ? { emailIdentity: true } : {}),
        },
      });
    }
    if (path === prefix + '/callback') {
      const finish = (ok: boolean) => (redirectMode(request, env) ? backToApp(env, ok) : page(ok));
      if (request.method !== 'GET') throw new HttpError(405, 'Method not allowed');
      let row: Attempt | undefined;
      let processing = false;
      let stage = 'browser_binding';
      let providerStatus: number | undefined;
      try {
        row = await attempt(request, env);
        stage = url.searchParams.has('error') ? 'provider_redirect' : 'callback_code';
        const code = url.searchParams.get('code');
        if (row.status !== 'pending' || !code || code.length > 2048 || url.searchParams.has('error'))
          throw new Error('Invalid callback');
        const claimed = await env.DB.prepare(
          "UPDATE oauth_attempts SET status='exchanging' WHERE id=? AND status='pending' RETURNING id",
        )
          .bind(row.id)
          .first();
        if (!claimed) throw new Error('Callback already used');
        processing = true;
        stage = 'code_exchange';
        const response = await fetch(settings.url + '/auth/v1/token?grant_type=pkce', {
          method: 'POST',
          headers: { apikey: settings.key, 'Content-Type': 'application/json' },
          body: JSON.stringify({ auth_code: code, code_verifier: row.verifier }),
          signal: AbortSignal.timeout(15000),
          redirect: 'manual',
        });
        providerStatus = response.status;
        if (!response.ok) throw new Error('Exchange failed');
        stage = 'token_payload';
        const tokens = (await response.json()) as { access_token?: string };
        if (!tokens.access_token) throw new Error('Missing token');
        stage = 'user_fetch';
        const verified = await fetch(settings.url + '/auth/v1/user', {
          headers: { apikey: settings.key, Authorization: 'Bearer ' + tokens.access_token },
          signal: AbortSignal.timeout(15000),
          redirect: 'manual',
        });
        providerStatus = verified.status;
        if (!verified.ok) throw new Error('Invalid user');
        stage = 'identity_validation';
        const user = (await verified.json()) as {
          id?: string;
          email?: string;
          email_confirmed_at?: string;
          is_anonymous?: boolean;
          identities?: { provider: string }[];
        };
        if (
          !user.id ||
          !/^[0-9a-f-]{36}$/i.test(user.id) ||
          !user.email ||
          user.email.length > 254 ||
          !user.email_confirmed_at ||
          user.is_anonymous ||
          !user.identities?.some(i => i.provider === 'google')
        )
          throw new Error('Unverified identity');
        stage = 'save_verified_identity';
        const ready = await env.DB.prepare(
          "UPDATE oauth_attempts SET status='ready',subject=?,email=?,verifier='' WHERE id=? AND status='exchanging' AND expires_at>? RETURNING id",
        )
          .bind(user.id, user.email.toLowerCase(), row.id, stamp())
          .first();
        if (!ready) throw new Error('Attempt expired');
        return finish(Boolean(ready));
      } catch {
        // Log only locally defined stages and HTTP status, never callback URLs,
        // provider payloads, account details, cookies, codes or tokens.
        console.warn('google_callback_failure', JSON.stringify({ stage, providerStatus }));
        if (row?.status === 'pending')
          await env.DB.prepare("UPDATE oauth_attempts SET status='failed',verifier='' WHERE id=? AND status=?")
            .bind(row.id, processing ? 'exchanging' : 'pending')
            .run();
        return finish(false);
      }
    }
    if (request.method !== 'POST') throw new HttpError(405, 'Method not allowed');
    csrf(request, env);
    if (path === prefix + '/start') {
      const ip = env.APP_ENV === 'local' ? 'local' : request.headers.get('CF-Connecting-IP');
      if (!ip) throw new HttpError(503, 'Client address unavailable');
      const limit = await consumeLimit(env.DB, 'google:' + ip, 10);
      if (!limit.allowed) throw new HttpError(429, 'Too many attempts');
      const input = await body(request);
      const raw = random(),
        id = await digest(raw),
        verifier = random();
      const challenge = btoa(
        String.fromCharCode(
          ...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))),
        ),
      )
        .replaceAll('+', '-')
        .replaceAll('/', '_')
        .replaceAll('=', '');
      await env.DB.batch([
        env.DB.prepare(
          'DELETE FROM oauth_attempts WHERE id IN (SELECT id FROM oauth_attempts WHERE expires_at<=? LIMIT 100)',
        ).bind(stamp()),
        env.DB.prepare('INSERT INTO oauth_attempts(id,verifier,expires_at) VALUES (?,?,?)').bind(
          id,
          verifier,
          stamp() + 300,
        ),
      ]);
      const authorize = new URL(settings.url + '/auth/v1/authorize');
      authorize.search = new URLSearchParams({
        provider: 'google',
        redirect_to: env.FRONTEND_URL + prefix + '/callback',
        code_challenge: challenge,
        code_challenge_method: 's256',
      }).toString();
      headers.set('Set-Cookie', flowCookie(env, raw));
      const redirect = (input as { redirect?: unknown }).redirect === true;
      headers.append('Set-Cookie', flowCookie(env, redirect ? 'redirect' : null, modeName(env)));
      return json({ success: true, data: { url: authorize.href } }, 200, headers);
    }
    if (path === prefix + '/finish') {
      const row = await attempt(request, env);
      // Attempts created for the retired linking flow are never finished as a sign-in.
      if (row.link_user_id) throw new HttpError(400, 'Incorrect Google flow');
      if (['pending', 'exchanging'].includes(row.status)) return json({ success: true, data: { pending: true } }, 202);
      headers.append('Set-Cookie', flowCookie(env, null));
      const claimed = await env.DB.prepare('DELETE FROM oauth_attempts WHERE id=? AND expires_at>? RETURNING *')
        .bind(row.id, stamp())
        .first<Attempt>();
      if (!claimed || claimed.status !== 'ready' || !claimed.subject || !claimed.email)
        throw new HttpError(401, 'Google sign-in failed');
      const result = await new Auth(env).providerLogin(settings.url, claimed.subject, claimed.email);
      headers.append('Set-Cookie', cookieHeader(env, result.refresh));
      return json({ success: true, data: result.data }, 200, headers);
    }
    throw new HttpError(404, 'Not found');
  } catch (error) {
    return json(
      {
        success: false,
        message: error instanceof HttpError ? error.message : 'Google sign-in temporarily unavailable',
      },
      error instanceof HttpError ? error.status : 503,
      headers,
    );
  }
}
