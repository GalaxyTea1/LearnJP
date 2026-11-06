# Deployment

Two Cloudflare environments, each with its own Worker, D1 database and secrets:

| Environment | Config                     | Purpose                                   |
| ----------- | -------------------------- | ----------------------------------------- |
| staging     | `wrangler.staging.json`    | Try every change and content import first |
| production  | `wrangler.production.json` | Learners                                  |

Both files are created from the checked-in `*.example.json` templates and kept out of Git.
Supabase is shared for sign-in (Google OAuth, SMTP and email templates); accounts, progress and
XP live in each environment's D1 database.

## Secrets

Set with `npx wrangler secret put <NAME> --config <config>`:

- `JWT_SECRET`, `QUIZ_REVISION_SECRET`: random, at least 32 bytes, different per environment.
- Public Supabase settings (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`) are plain vars in the config.

## Automatic deploys (GitHub Actions)

`.github/workflows/deploy.yml` does the release below for you:

- **Staging** deploys on its own after CI passes on a push to `main`. New migrations are
  applied to staging automatically.
- **Production** is manual: Actions → Deploy → Run workflow → target `production`. It checks
  that CI passed for the latest `main`, deploys it to staging, then to production. If production
  has an unapplied migration the run stops; back up and apply it by hand (step 2 below), then
  re-run.
- Each deploy ends with a `/api/v1/health` check that must report `ready: true`.

The wrangler configs are not in Git, so the workflow builds them with
`scripts/tools/write-wrangler-config.mjs` from the example files and these GitHub settings.

**One-time setup** (repository Settings → Secrets and variables → Actions, and Settings →
Environments):

1. Create a Cloudflare API token (My Profile → API Tokens → "Edit Cloudflare Workers" template,
   plus Account → D1 → Edit) and save it as the repository secret `CLOUDFLARE_API_TOKEN`.
2. Repository variable `CLOUDFLARE_ACCOUNT_ID`.
3. Create environments `staging` and `production`. On `production`, add yourself as a required
   reviewer so a production run waits for approval.
4. In each environment, add the variables `D1_DATABASE_ID`, `FRONTEND_URL`, `SUPABASE_URL`,
   `SUPABASE_PUBLISHABLE_KEY`, `GOOGLE_AUTH_ENABLED`, `EMAIL_AUTH_ENABLED`, and for production
   `DOMAINS` (comma-separated, e.g. `learnjp.dev,www.learnjp.dev`). Take the values from your
   local `wrangler.<env>.json`.

Worker secrets (`JWT_SECRET`, `QUIZ_REVISION_SECRET`) stay in Cloudflare; deploys keep them.

## Release (by hand)

1. Deploy to staging and check it: `npm run build`, then
   `npx wrangler deploy --config wrangler.staging.json`.
2. If there is a new migration, back up production first
   (`npm run backup:production`), then
   `npx wrangler d1 migrations apply DB --remote --config wrangler.production.json`.
   Migrations are applied before the Worker that depends on them.
3. `npm run build` and `npx wrangler deploy --config wrangler.production.json`.
4. Check `/api/v1/health` returns 200 with `ready: true`, then sign in and open a lesson.

Content is imported separately; see [content-pipeline.md](content-pipeline.md).

## Backup and restore

- **D1 Time Travel** (free tier): restore to any point in the last 7 days with
  `npx wrangler d1 time-travel restore <db> --config <config> --timestamp=<ISO time>`.
  This overwrites the whole database, so take a backup of the current state first.
- **Weekly export:** `npm run backup:production` writes a SQL dump to
  `.local/backups/production/` (outside Git, as it contains user data) and keeps the 8 newest.
- **Restore from a dump:** create an empty D1 database, run the dump with
  `npx wrangler d1 execute <db> --remote --file <backup.sql>`, verify it, then point
  `database_id` in the config at the new database and deploy. Never run a dump against a
  database that already has data.

## Email templates

`docs/email-templates/` holds the Supabase confirmation and password-reset emails.
`docs/supabase/keepalive.sql` creates the function the Worker cron calls once a day so the free Supabase
project is not paused for inactivity.
