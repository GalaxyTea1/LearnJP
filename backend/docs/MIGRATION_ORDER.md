# Thu tu migration cua backend-figma

## Nguyen tac

Prisma tu dong chay migration theo ten thu muc/timestamp. Ban khong can mo file
`migration.sql` va chay tung file bang pgAdmin.

Thu tu hien tai:

```text
1. 20260727141356_init
2. 20260812010000_fix_integrity_constraints
3. 20260817155755_add_lesson_content_models
4. 20261003000000_harden_auth_sessions
```

## Migration 1: init

File:

```text
prisma/migrations/20260727141356_init/migration.sql
```

Muc dich:

- tao cac enum ban dau;
- tao cac bang user, JLPT content, progress, game, dictionary, test va admin;
- tao primary key, unique index va foreign key;
- tao nen tang database ban dau.

Day la migration goc. Khong xoa hoac sua file nay sau khi no da duoc ap dung.

## Migration 2: fix_integrity_constraints

File:

```text
prisma/migrations/20260812010000_fix_integrity_constraints/migration.sql
```

Muc dich:

- them `EXPRESSION` va `PRONOUN` vao `VocabType`;
- xoa foreign key sai cua flashcard polymorphic;
- ngan mot attempt tra loi cung mot test question nhieu lan.

Migration nay phu thuoc migration 1 vi no sua enum, table va constraint da duoc
migration 1 tao.

## Migration 3: add_lesson_content_models

File:

```text
prisma/migrations/20260817155755_add_lesson_content_models/migration.sql
```

Muc dich:

- them `ContentStatus`;
- them `LessonSectionType`;
- them `LessonExerciseType`;
- them status, version va published time cho `learning_modules`;
- tao `lesson_sections`;
- tao `conversations` va `conversation_lines`;
- tao `listening_content`;
- tao `reading_passages`;
- tao `writing_tasks`;
- tao `lesson_exercises`;
- tao index, unique constraint va foreign key tuong ung.

## Cach ap dung tren database da co

Trong thu muc `backend-figma`:

```powershell
npm run prisma:migrate:prod
npm run prisma:generate
```

`prisma migrate deploy` se xem bang `_prisma_migrations` va chi chay migration
chua duoc ap dung.

Kiem tra:

```powershell
npx prisma migrate status
```

Ket qua dung:

```text
4 migrations found
Database schema is up to date!
```

## Cach tao database local lai tu dau

Lenh sau xoa toan bo du lieu trong database duoc cau hinh boi `DATABASE_URL`:

```powershell
npx prisma migrate reset --force --skip-seed
```

Prisma se tu dong:

1. xoa schema cu;
2. chay migration 1;
3. chay migration 2;
4. chay migration 3;
5. generate Prisma Client.

Sau do nap du lieu mau neu can:

```powershell
npm run prisma:seed
```

Khong chay `migrate reset` tren production.

## Khi sua schema trong tuong lai

Vi du ban them truong `thumbnailUrl`:

1. sua `prisma/schema.prisma`;
2. tao migration moi:

```powershell
npm run prisma:migrate -- --name add_lesson_thumbnail
```

3. Prisma se tao migration thu 4 co timestamp moi;
4. commit ca `schema.prisma` va thu muc migration moi;
5. tren moi truong khac chay `npm run prisma:migrate:prod`.

Khong sua migration 1-3 de chen thay doi moi. Moi thay doi schema moi phai co
migration moi.
