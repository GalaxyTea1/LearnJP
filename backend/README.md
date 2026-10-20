# SumaryJapanese API (`backend-figma`)

Express + Prisma API used by `frontend-figma`.

## Requirements

- Node.js 20 or newer
- PostgreSQL

## Local setup

1. Copy `.env.example` to `.env` and replace the placeholder secrets.
2. Install dependencies with `npm install`.
3. Generate the Prisma client with `npm run prisma:generate`.
4. Apply development migrations with `npm run prisma:migrate`.
5. Set a unique `SEED_ADMIN_PASSWORD` (at least 12 characters), then run `npm run prisma:seed` if sample data is needed.
6. Start the API with `npm run dev`.

The health endpoint is `GET http://localhost:3001/api/v1/health`.

For a beginner-friendly explanation of migrations, database reset, seed data,
lessons, quizzes and full test authoring, read
[`docs/DATABASE_AND_CONTENT_GUIDE.md`](docs/DATABASE_AND_CONTENT_GUIDE.md).

Curriculum and daily content-production references:

- [`docs/JLPT_CURRICULUM_ROADMAP.md`](docs/JLPT_CURRICULUM_ROADMAP.md)
- [`docs/CURRICULUM_SOURCE_OF_TRUTH.md`](docs/CURRICULUM_SOURCE_OF_TRUTH.md)
- [`docs/CONTENT_PRODUCTION_PLAN.md`](docs/CONTENT_PRODUCTION_PLAN.md)
- [`docs/MIGRATION_ORDER.md`](docs/MIGRATION_ORDER.md)
- [`docs/LESSON_CONTENT_MODELS.md`](docs/LESSON_CONTENT_MODELS.md)
- [`docs/DAY_01_N5_01_CONTENT_BRIEF.md`](docs/DAY_01_N5_01_CONTENT_BRIEF.md)
- [`docs/CONTENT_WORKFLOW_GUIDE.md`](docs/CONTENT_WORKFLOW_GUIDE.md)

## Verification

```text
npm run build
npm test
npx prisma validate
```

## Production deployment

- Set `NODE_ENV=production`.
- Use a strong, unique `JWT_SECRET` of at least 32 characters.
- Set `FRONTEND_URL` to the deployed frontend origin. Localhost is rejected in production.
- Set `TRUST_PROXY` to the number of trusted reverse proxies in front of Express. Leave it at `0` when the process receives client traffic directly.
- Apply migrations with `npm run prisma:migrate:prod`; do not use `prisma migrate dev` in production.
- Run `npm run build`, then `npm start`.
- Production authentication rate limits use atomic PostgreSQL counters shared across instances. Development/test use memory. Apply the auth migration before starting production; a store failure rejects the request rather than bypassing the limit.

Refresh tokens are unique, rotated, stored as SHA-256 digests in PostgreSQL and sent only as host-only HttpOnly cookies. In production cookies are Secure. Access tokens remain short-lived bearer tokens in browser storage; continue protecting the frontend against XSS.

All auth POST requests require `X-Requested-With: SumaryJP`. Browser requests must originate from the exact `FRONTEND_URL`, use `credentials: include`, and send the refresh cookie (never a JSON refresh token). Auth responses use `Cache-Control: no-store`. Logout revokes the refresh credential; already-issued access tokens expire at their configured expiry (15 minutes by default).

Prefer same-site frontend/API domains and `REFRESH_COOKIE_SAME_SITE=lax`. Unrelated domains require `none` and HTTPS; browser third-party-cookie blocking can still prevent authentication. Use a same-site custom API domain or reverse proxy in that case. Do not add wildcard CORS origins.

### Upgrade and verification

Deploy backend and frontend together during a maintenance window. Migration `20261003000000_harden_auth_sessions` hashes old plaintext tokens and creates the shared rate-limit table. Old browser builds are incompatible with the cookie contract; the new frontend removes legacy credentials and asks users to sign in again. Avoid mixing old/new backend instances during the migration.

Passwords are limited to 72 UTF-8 bytes to prevent bcrypt truncation (minimum 8 characters for registration). Legacy passwords exceeding that limit require a controlled password reset; passwords and user data are not rewritten by this migration.

Production frontend builds require `VITE_API_URL` set to the HTTPS backend origin (without `/api/v1` or a trailing slash). Set it in the hosting build environment; the Vite development proxy is not deployed. Authentication requires modern browsers supporting Web Locks on HTTPS/localhost.

Run `npm test`, `npm run build`, and `npm run test:integration`. The integration test requires local PostgreSQL and permission to create/drop a temporary schema. It applies all migrations in a randomly named `auth_smoke_*` schema, runs real HTTP/database assertions, and removes only that schema; it refuses remote database hosts. Frontend checks: `npm run typecheck` and `node --test scripts/auth-client.test.mjs`.

## Frontend integration status

`frontend-figma/src/app/services/api.ts` implements authentication, token refresh, and the API request contract. Most visual screens still use local Figma sample data, so connecting learning content, progress, quizzes, tests, and games to live API endpoints remains product integration work rather than an API defect.

Dictionary and translation features also depend on third-party public endpoints. A production deployment should proxy these through a controlled backend service with timeouts, caching, quotas, and stable error handling.

### Quiz retry contract (L5)

Apply `20261013000000_quiz_idempotency` with `npm run prisma:migrate:prod` before starting the updated backend, then generate the Prisma client and build. Deploy the matching frontend/backend together and reload old browser tabs: `POST /quizzes/submit` now requires a UUID `requestId` along with the quiz revision. Reuse the same ID and exact payload for retries; use a new ID only for a new attempt. Replays return the stored response without another attempt or XP write. Reusing an ID with a different payload returns 409.

Run `npm run build` then `node scripts/quiz-retry-smoke.cjs` for local PostgreSQL migration/concurrent-retry verification. This script refuses remote hosts and only creates/removes its randomly named test schema.
