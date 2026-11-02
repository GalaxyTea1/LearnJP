import { json } from './http';
import { validateAuthSettings } from './auth';

// Bounded read-only probes: no scans of account/progress data and no writes.
const probe = `SELECT
 (SELECT version FROM assessment_revision WHERE id=1) AS revision,
 EXISTS(SELECT 1 FROM learning_modules m JOIN jlpt_levels l ON l.id=m.level_id
 WHERE l.level='N5' AND m.content_status='PUBLISHED'
 AND EXISTS(SELECT 1 FROM lesson_sections s WHERE s.module_id=m.id AND s.status='PUBLISHED')) AS content,
 (SELECT count(*) FROM (SELECT session_id,token FROM refresh_tokens LIMIT 0)) AS sessions,
 (SELECT count(*) FROM (SELECT key,reset_at FROM auth_rate_limits LIMIT 0)) AS limits,
 (SELECT count(*) FROM (SELECT password_hash,is_active FROM users LIMIT 0)) AS users,
 (SELECT count(*) FROM (SELECT submission_hash,question_snapshot FROM user_test_attempts LIMIT 0)) AS attempts,
 (SELECT count(*) FROM (SELECT version FROM user_flashcard_progress LIMIT 0)) AS flashcards,
 (SELECT count(*) FROM (SELECT event_key FROM xp_events LIMIT 0)) AS xp,
 (SELECT count(*) FROM (SELECT ok FROM mutation_guards LIMIT 0)) AS guards,
 (SELECT count(*) FROM (SELECT search_text FROM content_search LIMIT 0)) AS search`;

export async function health(
  request: Request,
  env: Omit<Env, 'APP_ENV' | 'JWT_SECRET' | 'QUIZ_REVISION_SECRET' | 'FRONTEND_URL'> & {
    APP_ENV: string;
    JWT_SECRET: string;
    QUIZ_REVISION_SECRET: string;
    FRONTEND_URL: string;
    EMAIL_AUTH_ENABLED?: string;
    GOOGLE_AUTH_ENABLED?: string;
    SUPABASE_URL?: string;
    SUPABASE_PUBLISHABLE_KEY?: string;
  },
): Promise<Response> {
  if (!['GET', 'HEAD'].includes(request.method))
    return json({ success: false, message: 'Method not allowed' }, 405, { Allow: 'GET, HEAD' });
  let ready = false;
  try {
    validateAuthSettings(env);
    if (
      typeof env.QUIZ_REVISION_SECRET !== 'string' ||
      env.QUIZ_REVISION_SECRET.length < 32 ||
      env.QUIZ_REVISION_SECRET === env.JWT_SECRET ||
      (env.APP_ENV === 'production' && env.QUIZ_REVISION_SECRET.startsWith('local-only-')) ||
      typeof env.ASSETS?.fetch !== 'function'
    )
      throw new Error('Configuration unavailable');
    const row = await env.DB.prepare(probe).first<{ revision: number; content: number }>();
    if (env.EMAIL_AUTH_ENABLED === 'true' || env.GOOGLE_AUTH_ENABLED === 'true') {
      const provider = new URL(env.SUPABASE_URL || '');
      if (
        provider.origin !== env.SUPABASE_URL ||
        provider.protocol !== 'https:' ||
        !provider.hostname.endsWith('.supabase.co') ||
        !env.SUPABASE_PUBLISHABLE_KEY
      )
        throw new Error('Provider unavailable');
      await env.DB.prepare(
        'SELECT (SELECT count(*) FROM (SELECT credential_version FROM users LIMIT 0)), (SELECT count(*) FROM (SELECT google_verified FROM external_identities LIMIT 0)), (SELECT count(*) FROM (SELECT link_user_id,link_session_id,link_password_hash FROM oauth_attempts LIMIT 0))',
      ).first();
    }
    ready = Number.isSafeInteger(row?.revision) && Number(row?.revision) >= 0 && row?.content === 1;
  } catch {
    /* Never expose SQL, secret values or account information. */
  }
  const response = json(
    {
      success: ready,
      message: ready ? 'Service ready' : 'Service not ready',
      data: { runtime: 'cloudflare-workers', ready },
    },
    ready ? 200 : 503,
  );
  return request.method === 'HEAD'
    ? new Response(null, { status: response.status, headers: response.headers })
    : response;
}
