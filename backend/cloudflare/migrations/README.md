# D1 migrations

0001_initial.sql: 35 original models plus 2 normalized study-progress tables.
0002_content_search.sql: Unicode-normalized search index (maintained by importer/write repositories).
Both migrations are applied and verified on local D1. No remote database is configured.
Dates use UTC ISO-8601 TEXT; JSON uses validated TEXT; booleans use 0/1; enums use CHECK.
Write repositories must explicitly update updated_at and the content_search index.
Do not edit an already applied migration: add a new numbered migration instead.
The schema was ported from the original PostgreSQL (Prisma) backend; PostgreSQL migrations do not run on D1.
Use separate local/staging/production databases when remote environments are configured.
0008_catalog_counts_cache.sql: trigger-maintained `module_content_counts` (catalog `_count`) and
`content_cache_version` (key prefix for the public content edge cache). Apply BEFORE deploying the
Worker that reads them: the catalog query joins `module_content_counts`.
