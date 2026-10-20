## Running the code

Run `npm install` to install dependencies, then `npm run dev` to start the development server.

Set `VITE_API_URL` to the backend API base URL when it is not running at the default local address. The API client is available in `src/app/services/api.ts`; several screens still intentionally use local Figma sample data and need endpoint-by-endpoint integration before production use.

Run `npm run build` before deployment.

## Authentication deployment

- Production builds require `VITE_API_URL=https://api.your-domain.example` (origin only, no `/api/v1` suffix or trailing slash). Supply it as a build-time environment variable on Vercel. The API client appends `/api/v1`.
- The local Vite proxy is development-only; the Vercel SPA rewrite is not an API proxy.
- Use current browsers with Web Locks support and HTTPS (localhost works for development). All tabs share an authentication lock.
- Refresh tokens use host-only HttpOnly cookies and are never read by JavaScript. Access tokens remain in localStorage with their short configured lifetime. Existing users must sign in once after this upgrade.
- Prefer frontend and API on the same site, e.g. `app.example.com` and `api.example.com`, with `REFRESH_COOKIE_SAME_SITE=lax`. If they are on unrelated sites use `none` on the backend; browsers blocking third-party cookies may still require a same-site custom domain or reverse proxy.
- The backend must allow the exact frontend origin via `FRONTEND_URL`. Fetch sends credentials and a custom CSRF header.
- Run `node --test scripts/auth-client.test.mjs` and `npm run typecheck` before deployment.
