-- Keeps the Free Supabase project active. The LearnJP Worker calls this once a day
-- (backend/cloudflare/supabase-keepalive.ts) so the project is not paused after a week
-- without database activity. Read-only: it touches no tables and returns a constant.
-- Run once per Supabase project (staging and production): Dashboard → SQL Editor → Run.
create or replace function public.keepalive()
returns integer
language sql
stable
security invoker
set search_path = ''
as $$ select 1 $$;

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon;
