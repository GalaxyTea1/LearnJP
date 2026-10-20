# Huong dan database, migration va nhap noi dung

Tai lieu nay danh cho `backend-figma` va database PostgreSQL local:

```text
sumaryjp_figma
```

## 1. Ba khai niem quan trong

### Prisma schema

File `prisma/schema.prisma` mo ta trang thai database ma ung dung mong muon:

- bang nao ton tai;
- moi bang co cot gi;
- kieu du lieu cua cot;
- khoa chinh, khoa ngoai va unique constraint;
- quan he giua cac bang.

Sua schema khong tu dong sua database. Sau khi sua schema, ban can tao migration.

### Migration

Migration la lich su thay doi cau truc database. Moi thu muc trong
`prisma/migrations` chua mot file `migration.sql`.

Du an hien co ba migration, chay theo thu tu timestamp:

```text
20260727141356_init
20260812010000_fix_integrity_constraints
20260817155755_add_lesson_content_models
```

Migration chi tao/sua cau truc. Migration khong phai noi de them bai hoc hay cau hoi.
Xem giai thich tung migration tai `docs/MIGRATION_ORDER.md`.

### Seed

File `prisma/seed.ts` them du lieu khoi tao, vi du:

- tai khoan admin local;
- 5 cap JLPT;
- module/bai hoc mau;
- tu vung, Kanji, ngu phap va quiz mau;
- du lieu tu dien mau.

Seed co the chay lai. Code seed can duoc viet idempotent de khong tao ban ghi trung.

## 2. Trang thai database sau khi reset

Database da duoc reset va hai migration da duoc ap dung. Tat ca bang nghiep vu
hien dang trong. Bang `_prisma_migrations` co hai ban ghi de Prisma biet hai
migration da chay.

Kiem tra trang thai:

```powershell
npm run prisma:migrate:prod
```

Lenh tren dung `prisma migrate deploy`: no chi ap dung migration chua chay va
khong xoa du lieu.

De chi xem trang thai, dung:

```powershell
npx prisma migrate status
```

## 3. Seed hien tai se tao gi?

Sau khi cau hinh mat khau admin va chay seed, database du kien co:

| Bang | Du lieu mau |
|---|---|
| `users` | 1 tai khoan admin |
| `user_learning_settings` | Cai dat hoc cua admin |
| `user_gamification` | XP, streak va badge cua admin |
| `jlpt_levels` | N5, N4, N3, N2, N1 |
| `learning_modules` | 2 module N5 |
| `vocabulary` | 10 tu/cum tu cua bai 1 |
| `kanji` | 5 Kanji: 日, 本, 人, 学, 生 |
| `grammar_patterns` | 3 mau ngu phap |
| `grammar_examples` | 6 cau vi du |
| `quiz_questions` | 5 cau trac nghiem cua module 1 |
| `dictionary_entries` | 8 muc tu dien |

Nhung bang lich su hoc, tien do, game va bai thi se van trong cho den khi nguoi
dung su dung ung dung hoac ban them de thi mau.

## 4. Chay seed lan dau

Mo file `.env` va them hai bien sau. Khong commit file `.env` len Git.

```dotenv
SEED_ADMIN_EMAIL=admin@sumaryjp.com
SEED_ADMIN_PASSWORD=mat_khau_local_cua_ban_toi_thieu_12_ky_tu
```

Sau do chay:

```powershell
npm run prisma:seed
```

Kiem tra du lieu bang Prisma Studio:

```powershell
npm run prisma:studio
```

Prisma Studio thuong mo tai `http://localhost:5555`. Ban co the bam vao tung
model de xem, them, sua hoac xoa ban ghi.

## 5. Thu tu quan he cua noi dung hoc

Noi dung mot bai hoc co cau truc:

```text
JlptLevel
  -> LearningModule
       -> Vocabulary
       -> Kanji
       -> GrammarPattern
            -> GrammarExample
       -> QuizQuestion
```

Vi vay, ban phai co cap JLPT truoc, sau do tao module, roi moi gan tu vung,
Kanji, ngu phap va quiz vao `moduleId` cua module do.

### Hai loai cau hoi khac nhau

`QuizQuestion` la quiz ngan ben trong mot module/bai hoc.

```text
LearningModule -> QuizQuestion
```

`TestQuestion` la cau hoi thuoc mot de thi hoan chinh, co section va thoi gian.

```text
TestTemplate -> TestSection -> TestQuestion
```

Khong nen tron hai loai nay.

## 6. Them mot bai hoc moi vao seed

Vi du them Bai 3 cua N5. Dat code sau khi da lay duoc `n5Level` trong
`prisma/seed.ts`.

```ts
const lesson3 = await prisma.learningModule.upsert({
  where: {
    levelId_unitNumber: {
      levelId: n5Level.id,
      unitNumber: 3,
    },
  },
  update: {
    title: 'Shopping and Prices',
    titleJp: '買い物と値段',
    description: 'Learn how to ask prices and buy everyday items.',
    topics: ['Shopping', 'Prices', 'Counters'],
    sortOrder: 3,
  },
  create: {
    levelId: n5Level.id,
    unitNumber: 3,
    title: 'Shopping and Prices',
    titleJp: '買い物と値段',
    description: 'Learn how to ask prices and buy everyday items.',
    topics: ['Shopping', 'Prices', 'Counters'],
    sortOrder: 3,
  },
});
```

Giai thich:

- `levelId`: bai hoc thuoc cap nao;
- `unitNumber`: so bai trong cap do;
- `sortOrder`: thu tu hien thi;
- `topics`: mang JSON cac chu de;
- cap `levelId + unitNumber` la unique, nen mot cap khong the co hai Bai 3.

## 7. Them tu vung cho bai hoc

```ts
const lesson3Vocabulary = [
  {
    moduleId: lesson3.id,
    japanese: 'いくら',
    hiragana: 'いくら',
    romaji: 'ikura',
    english: 'how much',
    type: VocabType.PRONOUN,
    level: 'N5',
    lesson: 'Lesson 3',
    exampleJp: 'これはいくらですか。',
    exampleEn: 'How much is this?',
  },
  {
    moduleId: lesson3.id,
    japanese: '買う',
    hiragana: 'かう',
    romaji: 'kau',
    english: 'to buy',
    type: VocabType.VERB,
    level: 'N5',
    lesson: 'Lesson 3',
    exampleJp: '本を買います。',
    exampleEn: 'I buy a book.',
  },
];

await prisma.vocabulary.deleteMany({
  where: {
    moduleId: lesson3.id,
    japanese: { in: lesson3Vocabulary.map(item => item.japanese) },
  },
});

await prisma.vocabulary.createMany({ data: lesson3Vocabulary });
```

Gia tri hop le cua `VocabType`:

```text
PHRASE, EXPRESSION, PRONOUN, VERB,
ADJECTIVE, NOUN, ADVERB, PARTICLE
```

## 8. Them Kanji

`character` dang la unique tren toan database. Neu Kanji da ton tai, `upsert`
se cap nhat no thay vi tao them ban ghi trung.

```ts
await prisma.kanji.upsert({
  where: { character: '買' },
  update: {
    moduleId: lesson3.id,
    meaning: 'buy',
    onyomi: 'バイ',
    kunyomi: 'か.う',
    level: 'N5',
    strokeCount: 12,
    radical: '貝',
    exampleWords: [
      { jp: '買う（かう）', en: 'to buy' },
      { jp: '買い物（かいもの）', en: 'shopping' },
    ],
    mnemonic: 'Use money represented by a shell to buy something.',
  },
  create: {
    moduleId: lesson3.id,
    character: '買',
    meaning: 'buy',
    onyomi: 'バイ',
    kunyomi: 'か.う',
    level: 'N5',
    strokeCount: 12,
    radical: '貝',
    exampleWords: [
      { jp: '買う（かう）', en: 'to buy' },
      { jp: '買い物（かいもの）', en: 'shopping' },
    ],
    mnemonic: 'Use money represented by a shell to buy something.',
  },
});
```

Luu y: schema hien tai chi cho mot Kanji gan truc tiep voi mot module. Ve sau,
neu muon mot Kanji xuat hien trong nhieu bai, nen tao bang lien ket many-to-many
thay vi ghi de `moduleId`.

## 9. Them ngu phap va cau vi du

```ts
await prisma.grammarPattern.create({
  data: {
    moduleId: lesson3.id,
    pattern: 'N は いくらですか',
    meaning: 'How much is N?',
    explanation: 'Use this pattern to ask the price of an item.',
    level: 'N5',
    lesson: 'Lesson 3',
    textbook: 'Custom curriculum',
    examples: {
      create: [
        {
          japanese: 'この本はいくらですか。',
          romaji: 'Kono hon wa ikura desu ka.',
          english: 'How much is this book?',
          sortOrder: 1,
        },
        {
          japanese: 'そのかばんは三千円です。',
          romaji: 'Sono kaban wa sanzen en desu.',
          english: 'That bag is 3,000 yen.',
          sortOrder: 2,
        },
      ],
    },
  },
});
```

`GrammarExample` khong ton tai doc lap. No luon can
`grammarPatternId` cua mot `GrammarPattern`.

## 10. Them quiz ngan cho bai hoc

```ts
await prisma.quizQuestion.create({
  data: {
    moduleId: lesson3.id,
    question: '「これはいくらですか」 co nghia la gi?',
    options: [
      'Cai nay la gi?',
      'Cai nay bao nhieu tien?',
      'Cai nay cua ai?',
      'Cai nay o dau?',
    ],
    correctIndex: 1,
    explanation: 'いくらですか duoc dung de hoi gia.',
    questionType: QuestionType.MULTIPLE_CHOICE,
    points: 10,
  },
});
```

Quan trong: `correctIndex` bat dau tu `0`.

```text
options[0] = dap an thu 1
options[1] = dap an thu 2
options[2] = dap an thu 3
options[3] = dap an thu 4
```

Trong vi du tren, dap an dung la lua chon thu hai, nen `correctIndex` bang `1`.

## 11. Them mot de thi hoan chinh

Mot de thi nen duoc tao trong mot transaction nested create de tranh truong
hop tao template thanh cong nhung section hoac question bi loi.

```ts
const n5MockTest = await prisma.testTemplate.create({
  data: {
    title: 'JLPT N5 Mock Test 01',
    level: 'N5',
    description: 'De thi thu tong hop N5 so 1',
    durationMinutes: 90,
    totalQuestions: 3,
    isPublished: false,
    createdBy: admin.id,
    sections: {
      create: [
        {
          sectionType: 'VOCABULARY',
          title: 'Vocabulary',
          durationMinutes: 20,
          sortOrder: 1,
          questions: {
            create: [
              {
                questionType: 'MULTIPLE_CHOICE',
                questionText: '「学生」 doc la gi?',
                options: ['がくせい', 'せんせい', 'かいしゃ', 'がっこう'],
                correctAnswer: 0,
                explanation: '学生 doc la がくせい.',
                points: 1,
                sortOrder: 1,
              },
            ],
          },
        },
        {
          sectionType: 'READING',
          title: 'Reading',
          durationMinutes: 35,
          sortOrder: 2,
          questions: {
            create: [
              {
                questionType: 'READING_COMP',
                passage: '田中さんは毎朝七時に起きます。...',
                questionText: '田中さんは何時に起きますか。',
                options: ['6時', '7時', '8時', '9時'],
                correctAnswer: 1,
                explanation: 'Doan van noi 毎朝七時に起きます.',
                points: 2,
                sortOrder: 1,
              },
            ],
          },
        },
      ],
    },
  },
});
```

Gia tri `TestSectionType`:

```text
VOCABULARY, GRAMMAR, READING, LISTENING
```

Gia tri `TestQuestionType`:

```text
MULTIPLE_CHOICE, FILL_BLANK, READING_COMP, LISTENING_COMP
```

Quy tac xuat ban de thi:

1. Tao de voi `isPublished: false`.
2. Kiem tra tong so cau va dap an.
3. Dam bao `totalQuestions` bang so `TestQuestion` thuc te.
4. Chay thu bang tai khoan test.
5. Sau khi kiem tra moi doi `isPublished` thanh `true`.

## 12. Them du lieu bang pgAdmin 4

Trong pgAdmin 4:

1. Mo `Servers`.
2. Mo server PostgreSQL local.
3. Mo `Databases` -> `sumaryjp_figma`.
4. Mo `Schemas` -> `public` -> `Tables`.
5. Bam phai vao mot bang -> `View/Edit Data` -> `All Rows`.

Thu tu nhap thu cong cho bai hoc:

1. Lay `jlpt_levels.id` cua N5.
2. Them `learning_modules` bang `level_id` do.
3. Lay `learning_modules.id` moi tao.
4. Dung id nay lam `module_id` khi them vocabulary, Kanji, grammar va quiz.

JSON trong pgAdmin phai la JSON hop le:

```json
["Shopping", "Prices", "Counters"]
```

```json
["Cai nay la gi?", "Cai nay bao nhieu tien?", "Cai nay cua ai?"]
```

Chuoi JSON bat buoc dung dau ngoac kep `"`, khong dung dau nhay don.

## 13. Mot so SQL huu ich trong pgAdmin

Liet ke cac bai hoc va cap JLPT:

```sql
SELECT
  lm.id,
  jl.level,
  lm.unit_number,
  lm.title
FROM learning_modules lm
JOIN jlpt_levels jl ON jl.id = lm.level_id
ORDER BY jl.sort_order, lm.sort_order;
```

Dem noi dung cua tung bai:

```sql
SELECT
  lm.id,
  lm.title,
  COUNT(DISTINCT v.id) AS vocabulary_count,
  COUNT(DISTINCT k.id) AS kanji_count,
  COUNT(DISTINCT g.id) AS grammar_count,
  COUNT(DISTINCT q.id) AS quiz_count
FROM learning_modules lm
LEFT JOIN vocabulary v ON v.module_id = lm.id
LEFT JOIN kanji k ON k.module_id = lm.id
LEFT JOIN grammar_patterns g ON g.module_id = lm.id
LEFT JOIN quiz_questions q ON q.module_id = lm.id
GROUP BY lm.id, lm.title
ORDER BY lm.id;
```

Kiem tra `correct_index` vuot khoi mang options:

```sql
SELECT id, question, correct_index, jsonb_array_length(options) AS option_count
FROM quiz_questions
WHERE correct_index < 0
   OR correct_index >= jsonb_array_length(options);
```

Neu truy van cuoi tra ve 0 dong thi index dap an dang hop le.

## 14. Khi nao can tao migration moi?

Ban can migration neu thay doi cau truc, vi du:

- them cot audio URL cho cau nghe;
- them bang lesson sections;
- them enum moi;
- them unique constraint;
- doi quan he mot-nhieu thanh nhieu-nhieu.

Quy trinh development:

```powershell
# 1. Sua prisma/schema.prisma

# 2. Tao va ap dung migration local
npm run prisma:migrate -- --name add_audio_to_test_question

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Kiem tra TypeScript va test
npm run build
npm test
```

Khong sua migration cu da duoc ap dung tren database dung chung. Hay tao migration
moi de lich su thay doi ro rang.

## 15. Reset database trong development

Lenh nay xoa toan bo du lieu va tao lai schema:

```powershell
npx prisma migrate reset --force --skip-seed
```

Sau do, neu muon nap du lieu mau:

```powershell
npm run prisma:seed
```

Khong bao gio chay `migrate reset` tren production.

Tren production chi dung:

```powershell
npm run prisma:migrate:prod
```

## 16. Loi thuong gap

### `SEED_ADMIN_PASSWORD must be set`

Them `SEED_ADMIN_PASSWORD` toi thieu 12 ky tu vao `.env`, sau do chay lai seed.

### `Unique constraint failed`

Ban dang tao mot gia tri da ton tai, thuong la email, username, cap JLPT,
`levelId + unitNumber`, hoac Kanji `character`. Dung `upsert` neu ban muon cap
nhat ban ghi cu.

### `Foreign key constraint failed`

ID cha khong ton tai. Vi du `moduleId` khong co trong `learning_modules` hoac
`sectionId` khong co trong `test_sections`.

### Prisma Client bi khoa tren Windows

Dung backend dev server truoc khi generate:

```powershell
# Trong terminal dang chay npm run dev, bam Ctrl+C
npm run prisma:generate
npm run dev
```

### Sua schema nhung code khong nhan field moi

Chay:

```powershell
npm run prisma:generate
```

## 17. Cach to chuc seed khi du lieu lon hon

Khi moi cap co nhieu bai, khong nen de tat ca trong mot file `seed.ts`. Cau truc
de mo rong:

```text
prisma/
  seed.ts
  seed-data/
    levels.ts
    n5/
      lesson-01.ts
      lesson-02.ts
      mock-test-01.ts
    n4/
      lesson-01.ts
```

Moi file bai hoc nen chua mot object gom module, vocabulary, Kanji, grammar va
quiz. `seed.ts` chi import cac object va ghi chung vao database. Cach nay giup
ban them tung bai ma khong lam file seed tro nen qua dai.
