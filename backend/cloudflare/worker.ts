import { health } from './health';
import { handleGoogleAuth } from './google-auth';
import { handleEmailAuth } from './email-auth';
import { readContent } from './content';
import { HttpError, json } from './http';
import { authenticate, cleanupExpiredAuth, handleAuth, requireRole } from './auth';
import { handleLearning } from './learning-routes';
import { handleAdmin } from './admin-routes';
import { supabaseKeepalive, type KeepaliveEnv } from './supabase-keepalive';

export default {
  async scheduled(controller, env): Promise<void> {
    await Promise.all([
      cleanupExpiredAuth(env.DB),
      supabaseKeepalive(env as Env & KeepaliveEnv, controller.scheduledTime),
    ]);
  },
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url),
      path = url.pathname;
    // Pages opened on the workers.dev or www address move to the custom domain. API calls are
    // left alone so a tab that is still open on the old address can finish what it was doing.
    const canonical = new URL(env.FRONTEND_URL);
    if (
      url.hostname !== canonical.hostname &&
      (url.hostname.endsWith('.workers.dev') || url.hostname === 'www.' + canonical.hostname) &&
      !(path === '/api' || path.startsWith('/api/')) &&
      (request.method === 'GET' || request.method === 'HEAD')
    )
      return Response.redirect(canonical.origin + path + url.search, 301);
    if (path === '/api/v1/health') return health(request, env);
    if (path === '/api' || path.startsWith('/api/')) {
      try {
        const google = await handleGoogleAuth(request, env);
        if (google) return google;
        const email = await handleEmailAuth(request, env);
        if (email) return email;
        const auth = await handleAuth(request, env);
        if (auth) return auth;
        const user = request.headers.has('authorization') ? await authenticate(request, env) : undefined;
        const learning = await handleLearning(request, env, user);
        if (learning) return learning;
        const adminResponse = await handleAdmin(request, env, user);
        if (adminResponse) return adminResponse;
        const content = await readContent(request, env, user, promise => ctx.waitUntil(promise));
        if (content) return json({ success: true, message: 'Content retrieved successfully', ...content });
        const mutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
        const protectedRead =
          /^\/api\/v1\/(admin|users|progress|flashcards|kana|history|tests\/attempts|dictionary\/history|games\/history|gamification\/me)(\/|$)/.test(
            path,
          );
        const admin =
          /^\/api\/v1\/admin(\/|$)/.test(path) ||
          (mutation && /^\/api\/v1\/(levels|modules|vocabulary|kanji|grammar|announcements)(\/|$)/.test(path)) ||
          (mutation && /^\/api\/v1\/quizzes(\/|$)/.test(path) && path.replace(/\/$/, '') !== '/api/v1/quizzes/submit');
        if (mutation || protectedRead) {
          const required = user || (await authenticate(request, env));
          if (admin) requireRole(required, ['ADMIN', 'MODERATOR']);
        }
      } catch (error) {
        if (error instanceof URIError) return json({ success: false, message: 'Invalid URL encoding' }, 400);
        return json(
          { success: false, message: error instanceof HttpError ? error.message : 'Content temporarily unavailable' },
          error instanceof HttpError ? error.status : 503,
        );
      }
      // Never let an API request return SPA HTML or use the legacy PostgreSQL server.
      return json(
        {
          success: false,
          code: 'API_MIGRATION_PENDING',
          message: 'API đang được chuyển sang Cloudflare. Vui lòng thử lại sau.',
          data: null,
        },
        503,
      );
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
