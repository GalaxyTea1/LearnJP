import { z, type Schema } from './validate';
import { Auth, type AuthEnv, body, consumeLimit, cookieHeader, csrf, validateAuthSettings } from './auth';
import { HttpError, json } from './http';

type EmailEnv = AuthEnv & { EMAIL_AUTH_ENABLED?: string; SUPABASE_URL?: string; SUPABASE_PUBLISHABLE_KEY?: string };
const prefix = '/api/v1/auth/email/';
const emailSchema = z.string().trim().toLowerCase().email().max(254);
const passwordSchema = z
  .string()
  .min(8)
  .max(72)
  .refine(v => new TextEncoder().encode(v).length <= 72);
const codeSchema = z.string().regex(/^\d{6,10}$/);
function settings(env: EmailEnv) {
  if (env.EMAIL_AUTH_ENABLED !== 'true' || !env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY)
    throw new HttpError(503, 'Email authentication unavailable');
  const url = new URL(env.SUPABASE_URL);
  if (url.origin !== env.SUPABASE_URL || url.protocol !== 'https:' || !url.hostname.endsWith('.supabase.co'))
    throw new HttpError(503, 'Email authentication unavailable');
  return { url: url.origin, key: env.SUPABASE_PUBLISHABLE_KEY };
}
type Settings = ReturnType<typeof settings>;
async function upstream(
  config: Settings,
  path: string,
  payload?: unknown,
  token?: string,
  method = payload ? 'POST' : 'GET',
) {
  const response = await fetch(config.url + '/auth/v1' + path, {
    method,
    headers: {
      apikey: config.key,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
    signal: AbortSignal.timeout(10000),
    redirect: 'manual',
  });
  const data = (await response.json().catch(() => null)) as any;
  if (!response.ok) {
    if (response.status === 429) throw new HttpError(429, 'Too many attempts');
    if (response.status >= 500) throw new HttpError(503, 'Email authentication unavailable');
    if (data?.code === 'email_not_confirmed') throw new HttpError(403, 'Email confirmation required');
    if (data?.code === 'weak_password' || data?.code === 'same_password')
      throw new HttpError(400, 'Choose a different strong password');
    throw new HttpError(401, 'Email credentials or code invalid');
  }
  return data;
}
async function verified(config: Settings, tokens: any, email: string) {
  if (typeof tokens?.access_token !== 'string' || tokens.access_token.length > 8192)
    throw new HttpError(401, 'Email credentials or code invalid');
  const user = await upstream(config, '/user', undefined, tokens.access_token);
  if (
    !z.string().uuid().safeParse(user?.id).success ||
    typeof user?.email !== 'string' ||
    user.email.toLowerCase() !== email ||
    !user.email_confirmed_at ||
    user.is_anonymous
  )
    throw new HttpError(401, 'Email credentials or code invalid');
  return { subject: user.id as string, email, token: tokens.access_token as string };
}
function parse<T>(schema: Schema<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new HttpError(400, 'Invalid email authentication data');
  return result.data;
}
export async function handleEmailAuth(request: Request, env: EmailEnv): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (!path.startsWith(prefix)) return null;
  const action = path.slice(prefix.length),
    headers = new Headers();
  try {
    validateAuthSettings(env);
    if (action === 'config' && request.method === 'GET') {
      let enabled = false;
      try {
        settings(env);
        enabled = true;
      } catch {}
      return json({ success: true, data: { enabled } });
    }
    const config = settings(env);
    // Migrating a username/password account was part of the retired legacy auth.
    if (action === 'link') throw new HttpError(410, 'Legacy authentication retired');
    if (!['register', 'login', 'confirm', 'resend', 'recover', 'reset'].includes(action))
      throw new HttpError(404, 'Not found');
    if (request.method !== 'POST') throw new HttpError(405, 'Method not allowed');
    csrf(request, env);
    const ip = env.APP_ENV === 'local' ? 'local' : request.headers.get('CF-Connecting-IP');
    if (!ip) throw new HttpError(503, 'Client address unavailable');
    const limit = await consumeLimit(env.DB, 'email-ip:' + ip, 20);
    if (!limit.allowed) throw new HttpError(429, 'Too many attempts');
    const input = await body(request);
    const { email } = parse(z.object({ email: emailSchema }), input);
    // One bucket across all code/password endpoints prevents endpoint hopping.
    const accountLimit = await consumeLimit(env.DB, 'email-account:' + email, 10);
    if (!accountLimit.allowed) throw new HttpError(429, 'Too many attempts');
    const auth = new Auth(env);
    if (action === 'register') {
      const { password } = parse(z.object({ password: passwordSchema }), input);
      // No D1 account/session is created until verified password sign-in.
      // Existing Supabase users receive the provider's anti-enumeration response.
      await upstream(config, '/signup', { email, password });
      return json({ success: true, data: { confirmationRequired: true } }, 202);
    }
    if (action === 'resend' || action === 'recover') {
      await upstream(
        config,
        action === 'resend' ? '/resend' : '/recover',
        action === 'resend' ? { email, type: 'signup' } : { email },
      );
      return json({ success: true, data: { accepted: true } }, 202);
    }
    if (action === 'confirm') {
      const { code } = parse(z.object({ code: codeSchema }), input);
      await verified(config, await upstream(config, '/verify', { email, token: code, type: 'signup' }), email);
      // Confirmation alone never signs in or links a legacy identity.
      return json({ success: true, data: { confirmed: true } });
    }
    if (action === 'reset') {
      const { code, password } = parse(z.object({ code: codeSchema, password: passwordSchema }), input);
      const identity = await verified(
        config,
        await upstream(config, '/verify', { email, token: code, type: 'recovery' }),
        email,
      );
      const linked = await env.DB.prepare(
        'SELECT u.id FROM external_identities i JOIN users u ON u.id=i.user_id WHERE i.issuer=? AND i.subject=? AND lower(u.email)=? AND u.is_active=1',
      )
        .bind(config.url, identity.subject, email)
        .first<{ id: number }>();
      // An unlinked legacy account cannot be recovered or migrated by email alone.
      if (!linked && (await env.DB.prepare('SELECT 1 FROM users WHERE lower(email)=?').bind(email).first()))
        throw new HttpError(409, 'Existing account requires verified linking');
      if (linked) {
        // Fail closed before the external mutation, including timeout/ambiguous success.
        // Retire legacy credentials so an old password cannot bypass this reset.
        await env.DB.batch([
          env.DB.prepare(
            "UPDATE users SET password_hash='!external-only',credential_version=credential_version+1 WHERE id=?",
          ).bind(linked.id),
          env.DB.prepare('DELETE FROM refresh_tokens WHERE user_id=?').bind(linked.id),
        ]);
      }
      try {
        await upstream(config, '/user', { password }, identity.token, 'PUT');
      } finally {
        if (linked)
          await env.DB.batch([
            env.DB.prepare('UPDATE users SET credential_version=credential_version+1 WHERE id=?').bind(linked.id),
            env.DB.prepare('DELETE FROM refresh_tokens WHERE user_id=?').bind(linked.id),
          ]);
      }
      return json({ success: true, data: { reset: true } });
    }
    const { password } = parse(z.object({ password: z.string().min(1).max(256) }), input);
    const beforeLogin = await env.DB.prepare('SELECT id,credential_version FROM users WHERE lower(email)=?')
      .bind(email)
      .first<{ id: number; credential_version: number }>();
    const identity = await verified(
      config,
      await upstream(config, '/token?grant_type=password', { email, password }),
      email,
    );
    const result = await auth.providerLogin(config.url, identity.subject, email, 'email', beforeLogin ?? undefined);
    headers.set('Set-Cookie', cookieHeader(env, result.refresh));
    return json({ success: true, data: result.data }, 200, headers);
  } catch (error) {
    return json(
      { success: false, message: error instanceof HttpError ? error.message : 'Email authentication unavailable' },
      error instanceof HttpError ? error.status : 503,
      headers,
    );
  }
}
