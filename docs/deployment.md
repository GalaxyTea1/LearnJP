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

## Release

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
