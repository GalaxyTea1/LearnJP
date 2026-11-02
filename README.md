# LearnJP

A Japanese course for Vietnamese learners, from JLPT N5 to N3, running entirely on Cloudflare's
free tier.

**Live:** https://learnjp.trongdv031199.workers.dev

- 42 lessons (N5: 12, N4: 14, N3: 16) with vocabulary, kanji, grammar, dialogues, listening,
  reading, writing practice and a quiz at the end of every lesson
- Timed mock tests for N4 and N3 in the four-section JLPT format, with explanations after
  submission
- Learn without an account; sign in with email or Google to sync progress across devices
- Admin tools for editing and publishing lessons

## Stack

| Layer    | Technology                                                                               |
| -------- | ---------------------------------------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS                                                 |
| API      | Cloudflare Workers (TypeScript), one origin for the app and `/api/v1`                    |
| Database | Cloudflare D1 (SQLite) with SQL migrations                                               |
| Sign-in  | Supabase Auth (email, Google); sessions are HS256 JWTs issued by the Worker              |
| Caching  | Cache API for public course content, invalidated through a version bumped by D1 triggers |

## Engineering highlights

- **Ported from Express + Prisma/PostgreSQL to Workers + D1.** Interactive transactions became
  single D1 batches with conditional SQL and unique constraints, so quiz submission, token
  refresh and progress updates stay atomic.
- **Under the 10 ms free-tier CPU limit.** Replacing `jose` and `zod` on the request path with
  Web Crypto JWTs and a small compatible validator cut the bundle from 987 KiB to 193 KiB, and
  quiz submission from 11–17 ms to 3–7 ms CPU. Details in [docs/performance.md](docs/performance.md).
- **Cheap reads.** Trigger-maintained counts took the catalog query from 2,239 to 59 rows read,
  and a content version in the cache key makes edits visible immediately without purging.
- **Safe content releases.** Lessons are authored as data, imported as drafts, published
  separately and promoted to production by scripts that dry-run first, back up before writing
  and verify every row afterwards. See [docs/content-pipeline.md](docs/content-pipeline.md).

More in [docs/architecture.md](docs/architecture.md) and [docs/deployment.md](docs/deployment.md).

## Project layout

```
backend/cloudflare/   Worker source and D1 migrations
frontend/             React app
content/              Course content (N3/N4 lessons, N5 review data and translations, mock tests)
scripts/              Build, local database, tests and content tooling
docs/                 Architecture, deployment, performance and content pipeline notes
```

## Running locally

Requires Node.js 22 or later.

```bash
npm install
npm --prefix frontend install
npm run db:migrate:local   # create the local D1 database
npm run db:import:local    # load the N5 course
npm run build
npm run dev                # http://127.0.0.1:8787
```

## Tests

```bash
npm test                   # Worker, database and content tests (Node test runner)
npm --prefix frontend test # frontend logic tests
npm run typecheck
```
