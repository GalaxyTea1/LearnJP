# Content pipeline

Course content is data in `content/`, turned into database rows by small package builders and
written to D1 only through scripts that dry-run by default.

```
content/n4/n4-05.mjs ──> scripts/content/n4/unit-05.mjs (buildUnit) ──> rows for 13 tables
                                         │
            scripts/content/n4/unit-05.test.mjs   checks the rows (counts, answer balance, new
                                                   vocabulary only, planned kanji, reading lengths)
                                         │
     scripts/content/import-unit.mjs N4 5 [--apply|--publish]  ──> staging D1
     scripts/content/check-level.mjs N4                         ──> public API on staging
     scripts/content/promote-level.mjs N4 [--apply]             ──> production D1
```

## Rules every write follows

1. **Dry run first.** Without a flag the script only reads, builds the SQL and writes it to
   `.local/` for review.
2. **Back up before writing.** `--apply` exports the whole database before the first statement.
3. **Own ID block.** Each lesson owns 1,000 IDs starting at its module ID (N4-05 → 14001–14999),
   so imports never collide and checks can compare "inside" and "outside" the block.
4. **Draft, then publish.** Lessons are inserted as `DRAFT` and published in a separate step;
   the lesson row is published last so a half-published lesson is never visible.
5. **Verify afterwards.** Stored rows must equal the package, rows outside the block must be
   unchanged, `PRAGMA foreign_key_check` must be empty, and catalog counts must match.
6. **One transaction per lesson.** All statements for a lesson go in one D1 request.

## Levels

| Level      | Source                                                                                                                                               | Builder                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| N5         | `content/n5/source.json` (imported from the original PostgreSQL database) plus reviewed corrections and the Vietnamese text in `content/n5/vi-*.mjs` | `scripts/content/n5/`            |
| N4         | `content/n4/n4-01.mjs` … `n4-14.mjs`                                                                                                                 | `scripts/content/n4/unit-XX.mjs` |
| N3         | `content/n3/n3-01.mjs` … `n3-16.mjs`                                                                                                                 | `scripts/content/n3/unit-XX.mjs` |
| Mock tests | `content/tests/mock-tests.mjs`                                                                                                                       | `scripts/content/mock-tests/`    |

The per-unit tests load the earlier lessons and check that vocabulary is not repeated, that the
kanji match the level plan and that the lesson imports cleanly into a local D1 database.

## Translating the N5 course

N5 was first imported with English meanings. `scripts/content/n5/apply-vietnamese.mjs`
applies the Vietnamese text in `content/n5/vi-01.mjs` … `vi-12.mjs` (keyed by row ID), refreshes
the search index for changed rows and refuses to run if learner-facing English would remain.

## Local database

`npm run db:seed:local` builds a fresh local database with the same course as production: it
imports the reviewed N5 course, publishes it, adds every N4 and N3 lesson from its package,
applies the Vietnamese N5 text and imports the mock tests. Delete `.wrangler/state` and run
`npm run db:migrate:local` to start over.
