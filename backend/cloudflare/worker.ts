import { readContent } from './content';
import { HttpError, json } from './http';
import { authenticate, handleAuth, requireRole } from './auth';
import { handleLearning } from './learning-routes';
import { handleAdmin } from './admin-routes';

export default {
  async fetch(request, env): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (path === '/api' || path.startsWith('/api/')) {
      try {
        const auth = await handleAuth(request, env);
        if (auth) return auth;
        const user = request.headers.has('authorization') ? await authenticate(request,env) : undefined;
        const learning = await handleLearning(request,env,user);
        if(learning)return learning;
        const adminResponse = await handleAdmin(request,env,user);
        if(adminResponse)return adminResponse;
        const content = await readContent(request, env, user);
        if (content) return json({ success: true, message: 'Content retrieved successfully', ...content });
        const mutation = !['GET','HEAD','OPTIONS'].includes(request.method);
        const protectedRead = /^\/api\/v1\/(admin|users|progress|flashcards|kana|history|tests\/attempts|dictionary\/history|games\/history|gamification\/me)(\/|$)/.test(path);
        const admin = /^\/api\/v1\/admin(\/|$)/.test(path) || (mutation && /^\/api\/v1\/(levels|modules|vocabulary|kanji|grammar|announcements)(\/|$)/.test(path)) || (mutation && /^\/api\/v1\/quizzes(\/|$)/.test(path) && path.replace(/\/$/,'')!=='/api/v1/quizzes/submit');
        if (mutation || protectedRead) {
          const required = user || await authenticate(request,env);
          if (admin) requireRole(required,['ADMIN','MODERATOR']);
        }
      } catch (error) {
        if (error instanceof URIError) return json({ success: false, message: 'Invalid URL encoding' }, 400);
        return json({ success: false, message: error instanceof HttpError ? error.message : 'Content temporarily unavailable' }, error instanceof HttpError ? error.status : 503);
      }
      if (path === '/api/v1/health' && request.method === 'GET') {
        try {
          const row = await env.DB.prepare('SELECT 1 AS ok').first<{ ok: number }>();
          if (row?.ok !== 1) throw new Error('Unexpected database response');
          // Connectivity is not application readiness. Do not report the app as healthy yet.
          return json({ success: false, message: 'Cloudflare migration is not complete', data: {
            runtime: 'cloudflare-workers', database: 'connected', ready: false,
          } }, 503);
        } catch {
          return json({ success: false, message: 'Database unavailable', data: {
            runtime: 'cloudflare-workers', database: 'unavailable', ready: false,
          } }, 503);
        }
      }
      // Never let an API request return SPA HTML or use the legacy PostgreSQL server.
      return json({ success: false, code: 'API_MIGRATION_PENDING',
        message: 'API đang được chuyển sang Cloudflare. Vui lòng thử lại sau.', data: null }, 503);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
