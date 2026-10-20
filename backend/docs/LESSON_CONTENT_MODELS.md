# Cach dung cac model noi dung bai hoc

## 1. So do quan he

```text
LearningModule
  -> LessonSection
       -> Conversation
            -> ConversationLine
       -> ListeningContent
            -> LessonExercise
       -> ReadingPassage
            -> LessonExercise
       -> WritingTask
       -> LessonExercise
```

Vocabulary, Kanji, GrammarPattern va QuizQuestion cu van gan truc tiep vao
`LearningModule`. Cac model moi luu noi dung co cau truc va multimedia.

## 2. ContentStatus

```text
DRAFT -> IN_REVIEW -> PUBLISHED -> ARCHIVED
```

- `DRAFT`: dang soan, khong tra ve cho nguoi hoc.
- `IN_REVIEW`: da soan xong, dang kiem duyet.
- `PUBLISHED`: duoc phep hien thi tren website.
- `ARCHIVED`: noi dung cu, giu lai de bao toan lich su.

API cho nguoi hoc chi nen query `status: PUBLISHED` va module co
`contentStatus: PUBLISHED`.

## 3. Tao section cho mot module

```ts
const kaiwaSection = await prisma.lessonSection.create({
  data: {
    moduleId: module.id,
    sectionType: 'KAIWA',
    title: 'Self-introduction conversation',
    titleJp: '自己紹介の会話',
    instructions: 'Listen, read, then practise both roles.',
    sortOrder: 5,
    status: 'DRAFT',
  },
});
```

Trong cung mot module, `sortOrder` khong duoc trung.

Thu tu de xuat:

```text
1 OVERVIEW
2 VOCABULARY
3 KANJI
4 GRAMMAR
5 KAIWA
6 LISTENING
7 READING
8 WRITING
9 EXERCISE
10 SUMMARY
```

## 4. Tao Kaiwa va tung cau thoai

```ts
await prisma.conversation.create({
  data: {
    sectionId: kaiwaSection.id,
    title: 'Meeting a classmate',
    context: 'Two students meet for the first time.',
    sortOrder: 1,
    status: 'DRAFT',
    lines: {
      create: [
        {
          speaker: 'A',
          japanese: 'はじめまして。田中です。',
          hiragana: 'はじめまして。たなかです。',
          romaji: 'Hajimemashite. Tanaka desu.',
          translation: 'Rat vui duoc gap ban. Toi la Tanaka.',
          sortOrder: 1,
        },
        {
          speaker: 'B',
          japanese: 'はじめまして。マイです。',
          hiragana: 'はじめまして。まいです。',
          romaji: 'Hajimemashite. Mai desu.',
          translation: 'Rat vui duoc gap ban. Toi la Mai.',
          sortOrder: 2,
        },
      ],
    },
  },
});
```

`audioUrl` co the dat o ca conversation toan bai va tung line.

## 5. Tao Listening

```ts
const listening = await prisma.listeningContent.create({
  data: {
    sectionId: listeningSection.id,
    title: 'Listen to a self-introduction',
    instructions: 'Listen once and choose the correct answer.',
    audioUrl: '/audio/n5/n5-01/listening-01.mp3',
    durationSeconds: 35,
    playbackSpeed: 0.9,
    transcript: 'はじめまして。マイです。ベトナム人です。',
    transcriptReading: 'はじめまして。まいです。べとなむじんです。',
    transcriptTranslation: 'Rat vui duoc gap ban. Toi la Mai. Toi la nguoi Viet Nam.',
    source: 'Original SumaryJapanese content',
    sortOrder: 1,
    status: 'DRAFT',
  },
});
```

`audioUrl` la bat buoc. Chi tao record sau khi da xac dinh duong dan audio.

## 6. Tao Reading passage

```ts
const passage = await prisma.readingPassage.create({
  data: {
    sectionId: readingSection.id,
    title: 'My class',
    content: '私はマイです。ベトナム人です。日本語の学生です。',
    reading: 'わたしはまいです。べとなむじんです。にほんごのがくせいです。',
    translation: 'Toi la Mai. Toi la nguoi Viet Nam va la hoc sinh tieng Nhat.',
    estimatedLevel: 'N5',
    source: 'Original SumaryJapanese content',
    sortOrder: 1,
    status: 'DRAFT',
  },
});
```

## 7. Tao bai tap cho section, Listening hoac Reading

Bai tap binh thuong:

```ts
await prisma.lessonExercise.create({
  data: {
    sectionId: exerciseSection.id,
    exerciseType: 'MULTIPLE_CHOICE',
    prompt: '「学生」 co nghia la gi?',
    options: ['Hoc sinh', 'Giao vien', 'Bac si', 'Nhan vien'],
    correctAnswer: 0,
    explanation: '学生（がくせい） co nghia la hoc sinh/sinh vien.',
    points: 1,
    sortOrder: 1,
    status: 'DRAFT',
  },
});
```

Bai tap gan voi Listening:

```ts
await prisma.lessonExercise.create({
  data: {
    sectionId: listeningSection.id,
    listeningId: listening.id,
    exerciseType: 'MULTIPLE_CHOICE',
    prompt: 'Mai la nguoi nuoc nao?',
    options: ['Nhat Ban', 'Viet Nam', 'Han Quoc', 'Trung Quoc'],
    correctAnswer: 1,
    explanation: 'Transcript co cau ベトナム人です.',
    sortOrder: 1,
  },
});
```

Bai tap doc hieu dung `readingPassageId: passage.id`.

`correctAnswer` la JSON nen co the luu:

```ts
0                         // index cua multiple choice
true                      // true/false
"は"                     // fill blank
[2, 0, 1]                 // sentence ordering
{ "left": 1, "right": 3 } // matching
```

Backend khong duoc tra `correctAnswer` va `explanation` truoc khi nguoi hoc nop
bai.

## 8. Tao Writing task

```ts
await prisma.writingTask.create({
  data: {
    sectionId: writingSection.id,
    title: 'Introduce yourself',
    prompt: 'Write 5-8 sentences introducing yourself.',
    instructions: 'Include your name, country, job and hobby.',
    sampleAnswer: 'はじめまして。マイです。...',
    rubric: {
      grammar: 4,
      vocabulary: 3,
      clarity: 3,
    },
    minLength: 5,
    maxLength: 8,
    sortOrder: 1,
    status: 'DRAFT',
  },
});
```

`minLength` va `maxLength` duoc hieu theo don vi cua task. Instructions can noi
ro la so cau, so ky tu hay so tu.

## 9. Publish mot module

Chi publish sau khi tat ca section bat buoc da duyet:

```ts
await prisma.$transaction([
  prisma.lessonSection.updateMany({
    where: { moduleId: module.id, status: 'IN_REVIEW' },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
  }),
  prisma.learningModule.update({
    where: { id: module.id },
    data: {
      contentStatus: 'PUBLISHED',
      publishedAt: new Date(),
    },
  }),
]);
```

Trong production nen co service kiem tra section bat buoc, audio va bai tap
truoc khi cho phep publish, thay vi goi update truc tiep.
