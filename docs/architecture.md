# Architecture

LearnJP runs as a single Cloudflare Worker that serves both the React single-page app (static
assets) and the JSON API under `/api/v1`, so the browser talks to one origin and no CORS setup
is needed.

```
Browser ── HTTPS ──> Cloudflare Worker (backend/cloudflare/worker.ts)
                      ├─ static assets: frontend/dist (SPA, deep links fall back to index.html)
                      ├─ /api/v1/*   : content, auth, learning, assessments, admin routes
                      ├─ Cache API   : public course content, keyed by content version
                      └─ D1 (SQLite): courses, users, progress, quiz and test attempts
                                    Supabase Auth: email and Google sign-in (identity only)
```

## Backend (`backend/cloudflare`)

| File                                                     | Responsibility                                                              |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| `worker.ts`                                              | Entry point: routing between static assets and API handlers, scheduled job  |
| `http.ts`                                                | JSON responses, error mapping, security headers (`Cache-Control: no-store`) |
| `content.ts`, `content-cache.ts`                         | Public course API and its edge cache                                        |
| `auth.ts`, `jwt.ts`, `email-auth.ts`, `google-auth.ts`   | Sessions, HS256 JWTs on Web Crypto, Supabase sign-in                        |
| `learner.ts`, `learning-routes.ts`, `study.ts`, `srs.ts` | Progress, study state, spaced repetition                                    |
| `assessments.ts`                                         | Lesson quizzes and timed mock tests                                         |
| `admin.ts`, `admin-routes.ts`, `admin-validation.ts`     | Content editing for staff                                                   |
| `validate.ts`                                            | Small zod-compatible validator (keeps the bundle and cold-start CPU low)    |
| `migrations/`                                            | D1 schema, applied with `wrangler d1 migrations apply`                      |

### Data model notes

- Dates are UTC ISO-8601 `TEXT`, JSON columns are validated `TEXT`, booleans are `0/1`, enums
  use `CHECK` constraints.
- Writes that must be atomic (quiz submission, token refresh, progress updates) run as a single
  D1 `batch`, which rolls back if any statement fails. Conditional SQL and unique constraints
  replace the interactive transactions the original PostgreSQL backend used.
- `content_search` holds a normalized search string for vocabulary, kanji and grammar.

### Public content cache

Course content is identical for every learner, so the Worker caches it with the Cache API.

- `module_content_counts` keeps per-lesson counts up to date through triggers, so the catalog
  query no longer runs `count(*)` per lesson (catalog rows read on staging: 2,239 → 59).
- `content_cache_version` is bumped by triggers on every content table. The version is part of
  the cache key, so publishing or editing a lesson takes effect immediately without a purge list.
- Personal data (progress, status) is read separately and never cached. Admin previews bypass
  the cache, errors are not cached, and a missing version table simply disables caching.

## Frontend (`frontend`)

React 18 + Vite 6 + Tailwind CSS 4. Screens are lazy-loaded; the API client lives in
`src/app/services/api.ts`.

- **Learning path:** lessons are grouped by JLPT level; each lesson has vocabulary, kanji,
  grammar, dialogue and listening, reading and exercises, and a final quiz (pass at 70%).
- **Progress:** guests keep progress in the browser; signed-in learners sync it to D1.
- **Mock tests:** four timed sections in JLPT format; answers and explanations are only
  returned after submission.
- **Audio:** listening uses the device's Japanese speech synthesis.

## Content

Course content is authored as JavaScript modules in `content/` and imported with scripts that
dry-run by default, back up the database before writing and verify the result. See
[content-pipeline.md](content-pipeline.md).
