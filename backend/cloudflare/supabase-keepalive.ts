// Supabase pauses a Free project after about a week without database activity, which would
// stop every Google/email sign-in. Once a day the hourly cron runs one read-only query through
// the public keepalive() function (docs/supabase/keepalive.sql). Opening a connection or
// reading /auth/v1/settings is not documented to count, so a real query is used instead.
export type KeepaliveEnv = {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  GOOGLE_AUTH_ENABLED?: string;
  EMAIL_AUTH_ENABLED?: string;
};
const KEEPALIVE_HOUR_UTC = 3;

export async function supabaseKeepalive(
  env: KeepaliveEnv,
  scheduledTime: number,
  fetcher: typeof fetch = fetch,
): Promise<'skipped' | 'ok' | 'failed'> {
  if (new Date(scheduledTime).getUTCHours() !== KEEPALIVE_HOUR_UTC) return 'skipped';
  if (
    (env.GOOGLE_AUTH_ENABLED !== 'true' && env.EMAIL_AUTH_ENABLED !== 'true') ||
    !env.SUPABASE_URL ||
    !env.SUPABASE_PUBLISHABLE_KEY
  )
    return 'skipped';
  try {
    const response = await fetcher(env.SUPABASE_URL + '/rest/v1/rpc/keepalive', {
      method: 'POST',
      body: '{}',
      redirect: 'manual',
      signal: AbortSignal.timeout(10000),
      headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' },
    });
    if (response.ok) return 'ok';
    // Status only: a 404 means keepalive.sql has not been applied to this project.
    console.warn('supabase_keepalive_failure', JSON.stringify({ status: response.status }));
  } catch {
    console.warn('supabase_keepalive_failure', JSON.stringify({ status: 'network' }));
  }
  return 'failed';
}
