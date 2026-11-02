# Keeping the Worker under the free-tier CPU limit

Workers Free allows 10 ms of CPU per request. Low traffic means most requests land on a cold
isolate, where code is compiled on first use, and the signed-in write paths were over the limit
(quiz submit 11–17 ms, token refresh 14 ms on staging).

## What the profile showed

On a cold isolate, `zod` cost about 3 ms on write paths and `jose` 2.5–3.3 ms on every
authenticated request. `zod` alone was 443 of the 584 KiB bundle.

## Changes

1. **JWT on Web Crypto** (`jwt.ts`): HS256 signing and verification with the same claims and
   checks as before (alg, iss, aud, exp, iat, jti, nbf, crit). Old and new tokens are mutually
   valid, so the deploy signed nobody out.
2. **Small validator** (`validate.ts`): implements the subset of the zod API the Worker uses.
   `zod` and `jose` moved to devDependencies and are only used by tests to check equivalence.
3. **Fewer D1 round trips:** `GET /progress/me` went from five queries that decoded every lesson
   column to one batch that reads only the needed columns; quiz submission folds its duplicate
   check into the batch that loads questions (4 → 3 round trips).

Bundle size (wrangler dry-run): 987 KiB / 171 KiB gzip → 193 KiB / 46 KiB gzip.

## Results on staging (CPU ms per request, HTTP 2xx)

| Endpoint               | Before     | After               |
| ---------------------- | ---------- | ------------------- |
| `POST /quizzes/submit` | 11, 15, 17 | 7, 5, 3             |
| `POST /auth/refresh`   | 14         | 4, 3, 2             |
| `GET /progress/me`     | 13, 5      | 2, 9, 3, 2, 2, 2, 1 |

All sampled requests stayed at or below 9 ms; the highest values are the first request on a new
isolate. The sample is small, so this is a before/after comparison rather than a p95.

## How it is verified

- `scripts/test/validate.test.mjs` compares the validator with real zod on 26 schema shapes and
  about 65 edge-case inputs each, including the admin schemas and their error messages.
- `scripts/test/jwt.test.mjs` checks that tokens signed by either implementation are accepted by
  the other and that malformed tokens are rejected.
- `scripts/tools/measure-cpu-local.mjs` runs the real handlers against an in-memory SQLite database
  and reports cold and warm CPU time per flow.
