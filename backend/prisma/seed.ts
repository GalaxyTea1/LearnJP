import { PrismaClient, VocabType, QuestionType, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Admin User
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be set and contain at least 12 characters');
  }
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@sumaryjp.com';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: adminEmail,
      username: 'admin',
      passwordHash: adminPasswordHash,
      displayName: 'System Admin',
      role: UserRole.ADMIN,
      isActive: true,
      learningSettings: {
        create: { weeklyGoalTarget: 50 },
      },
      gamification: {
        create: { xp: 9999, streak: 100, badges: ['ADMIN', 'FOUNDER'] },
      },
    },
  });
  console.log(`👤 Upserted Admin User: ${admin.email}`);

  // 2. Create JLPT Levels N5 - N1
  const levelsData = [
    {
      level: 'N5',
      title: 'Beginner - Basic Japanese',
      titleJp: '日本語能力試験 N5',
      color: '#4ADE80', // Green
      badge: '🌸',
      description: 'Master basic greetings, hiragana/katakana, basic sentence structures, ~800 words, and ~100 kanji.',
      totalVocab: 800,
      totalKanji: 100,
      totalGrammar: 80,
      sortOrder: 1,
    },
    {
      level: 'N4',
      title: 'Elementary - Daily Conversation',
      titleJp: '日本語能力試験 N4',
      color: '#38BDF8', // Blue
      badge: '🌊',
      description: 'Understand everyday conversation, basic grammar forms (te-form, nai-form), ~1,500 words, and ~300 kanji.',
      totalVocab: 1500,
      totalKanji: 300,
      totalGrammar: 120,
      sortOrder: 2,
    },
    {
      level: 'N3',
      title: 'Intermediate - Everyday Japanese',
      titleJp: '日本語能力試験 N3',
      color: '#FACC15', // Yellow
      badge: '🍁',
      description: 'Bridge to advanced Japanese. Read everyday articles, express opinions, ~3,700 words, and ~650 kanji.',
      totalVocab: 3700,
      totalKanji: 650,
      totalGrammar: 150,
      sortOrder: 3,
    },
    {
      level: 'N2',
      title: 'Pre-Advanced - Business & Media',
      titleJp: '日本語能力試験 N2',
      color: '#FB923C', // Orange
      badge: '🎋',
      description: 'Understand news, newspapers, and business communication. ~6,000 words and ~1,000 kanji.',
      totalVocab: 6000,
      totalKanji: 1000,
      totalGrammar: 180,
      sortOrder: 4,
    },
    {
      level: 'N1',
      title: 'Advanced - Native Fluency',
      titleJp: '日本語能力試験 N1',
      color: '#F87171', // Red
      badge: '🗻',
      description: 'Read complex literature, technical documents, and understand natural speech at full speed. ~10,000 words and ~2,000 kanji.',
      totalVocab: 10000,
      totalKanji: 2000,
      totalGrammar: 200,
      sortOrder: 5,
    },
  ];

  for (const l of levelsData) {
    await prisma.jlptLevel.upsert({
      where: { level: l.level },
      update: l,
      create: l,
    });
  }
  console.log('📚 Upserted JLPT Levels N5 - N1');

  const n5Level = await prisma.jlptLevel.findUnique({ where: { level: 'N5' } });
  if (!n5Level) throw new Error('N5 Level not found');

  // 3. Create N5 Modules (Unit 1 & Unit 2)
  const mod1 = await prisma.learningModule.upsert({
    where: {
      levelId_unitNumber: {
        levelId: n5Level.id,
        unitNumber: 1,
      },
    },
    update: {},
    create: {
      levelId: n5Level.id,
      unitNumber: 1,
      title: 'Greetings & Self-Introduction',
      titleJp: 'あいさつ và 自己紹介',
      description: 'Learn essential daily greetings and how to introduce yourself, your country, and your profession in Japanese.',
      topics: ['Greetings', 'Self-Introduction', 'Nationalities', 'Professions'],
      sortOrder: 1,
    },
  });

  const mod2 = await prisma.learningModule.upsert({
    where: {
      levelId_unitNumber: {
        levelId: n5Level.id,
        unitNumber: 2,
      },
    },
    update: {},
    create: {
      levelId: n5Level.id,
      unitNumber: 2,
      title: 'Daily Objects & Classroom Expressions',
      titleJp: '身の回りのもの và 教室の言葉',
      description: 'Learn demonstrative pronouns (kore, sore, are), common classroom vocabulary, and asking what things are.',
      topics: ['Demonstratives', 'Classroom', 'Personal Items', 'Questions'],
      sortOrder: 2,
    },
  });

  console.log('📖 Upserted N5 Modules 1 & 2');

  // 4. Seed Vocabulary for Module 1
  const vocabMod1 = [
    {
      moduleId: mod1.id,
      japanese: '私',
      hiragana: 'わたし',
      romaji: 'watashi',
      english: 'I, me',
      type: VocabType.PRONOUN,
      level: 'N5',
      lesson: 'Lesson 1',
      exampleJp: '私は学生です。',
      exampleEn: 'I am a student.',
    },
    {
      moduleId: mod1.id,
      japanese: 'あなた',
      hiragana: 'あなた',
      romaji: 'anata',
      english: 'you',
      type: VocabType.PRONOUN,
      level: 'N5',
      lesson: 'Lesson 1',
      exampleJp: 'あなたは日本人ですか。',
      exampleEn: 'Are you Japanese?',
    },
    {
      moduleId: mod1.id,
      japanese: 'あの人',
      hiragana: 'あのひと',
      romaji: 'ano hito',
      english: 'that person, he, she',
      type: VocabType.NOUN,
      level: 'N5',
      lesson: 'Lesson 1',
      exampleJp: 'あの人は誰ですか。',
      exampleEn: 'Who is that person?',
    },
    {
      moduleId: mod1.id,
      japanese: '学生',
      hiragana: 'がくせい',
      romaji: 'gakusei',
      english: 'student',
      type: VocabType.NOUN,
      level: 'N5',
      lesson: 'Lesson 1',
      exampleJp: '私は大学の学生です。',
      exampleEn: 'I am a university student.',
    },
    {
      moduleId: mod1.id,
      japanese: '先生',
      hiragana: 'せんせい',
      romaji: 'sensei',
      english: 'teacher, instructor',
      type: VocabType.NOUN,
      level: 'N5',
      lesson: 'Lesson 1',
      exampleJp: '田中さんは先生です。',
      exampleEn: 'Mr. Tanaka is a teacher.',
    },
    {
      moduleId: mod1.id,
      japanese: 'おはようございます',
      hiragana: 'おはようございます',
      romaji: 'ohayou gozaimasu',
      english: 'Good morning (polite)',
      type: VocabType.EXPRESSION,
      level: 'N5',
      lesson: 'Lesson 1',
      exampleJp: '先生、おはようございます。',
      exampleEn: 'Good morning, teacher.',
    },
    {
      moduleId: mod1.id,
      japanese: 'こんにちは',
      hiragana: 'こんにちは',
      romaji: 'konnichiwa',
      english: 'Good afternoon / Hello',
      type: VocabType.EXPRESSION,
      level: 'N5',
      lesson: 'Lesson 1',
      exampleJp: '皆さん、こんにちは。',
      exampleEn: 'Hello, everyone.',
    },
    {
      moduleId: mod1.id,
      japanese: 'こんばんは',
      hiragana: 'こんばんは',
      romaji: 'konbanwa',
      english: 'Good evening',
      type: VocabType.EXPRESSION,
      level: 'N5',
      lesson: 'Lesson 1',
      exampleJp: 'こんばんは、お元気ですか。',
      exampleEn: 'Good evening, how are you?',
    },
    {
      moduleId: mod1.id,
      japanese: 'はじめまして',
      hiragana: 'はじめまして',
      romaji: 'hajimemashite',
      english: 'Nice to meet you (for the first time)',
      type: VocabType.EXPRESSION,
      level: 'N5',
      lesson: 'Lesson 1',
      exampleJp: 'はじめまして、マイクです。',
      exampleEn: 'Nice to meet you, I am Mike.',
    },
    {
      moduleId: mod1.id,
      japanese: 'よろしくお願（ねが）いします',
      hiragana: 'よろしくおねがいします',
      romaji: 'yoroshiku onegaishimasu',
      english: 'Please treat me favorably / Nice to meet you',
      type: VocabType.EXPRESSION,
      level: 'N5',
      lesson: 'Lesson 1',
      exampleJp: 'どうぞよろしくお願いします。',
      exampleEn: 'Pleased to meet you.',
    },
  ];

  await prisma.vocabulary.deleteMany({
    where: {
      moduleId: mod1.id,
      japanese: { in: vocabMod1.map((item) => item.japanese) },
    },
  });
  await prisma.vocabulary.createMany({ data: vocabMod1 });
  console.log('📝 Seeded Vocabulary for Module 1');

  // 5. Seed Kanji for Module 1
  const kanjiMod1 = [
    {
      moduleId: mod1.id,
      character: '日',
      meaning: 'day, sun, Japan',
      onyomi: 'ニチ, ジツ (NICHI, JITSU)',
      kunyomi: 'ひ, -び, -か (hi, -bi, -ka)',
      level: 'N5',
      strokeCount: 4,
      radical: '日 (sun)',
      mnemonic: 'A picture of the sun with a sunspot in the middle.',
      exampleWords: [
        { jp: '日本 (にほん)', en: 'Japan' },
        { jp: '日曜日 (にちようび)', en: 'Sunday' },
        { jp: '毎日 (まいにち)', en: 'every day' },
      ],
    },
    {
      moduleId: mod1.id,
      character: '本',
      meaning: 'book, origin, main',
      onyomi: 'ホン (HON)',
      kunyomi: 'もと (moto)',
      level: 'N5',
      strokeCount: 5,
      radical: '木 (tree)',
      mnemonic: 'A tree (木) with a horizontal line marking its roots (origin).',
      exampleWords: [
        { jp: '本 (ほん)', en: 'book' },
        { jp: '日本人 (にほんじん)', en: 'Japanese person' },
        { jp: '本当 (ほんとう)', en: 'truth, reality' },
      ],
    },
    {
      moduleId: mod1.id,
      character: '人',
      meaning: 'person, human',
      onyomi: 'ジン, ニン (JIN, NIN)',
      kunyomi: 'ひと (hito)',
      level: 'N5',
      strokeCount: 2,
      radical: '人 (person)',
      mnemonic: 'A person standing on two legs.',
      exampleWords: [
        { jp: '人 (ひと)', en: 'person' },
        { jp: 'アメリカ人 (あめりかじん)', en: 'American person' },
        { jp: '一人 (ひとり)', en: 'one person' },
      ],
    },
    {
      moduleId: mod1.id,
      character: '学',
      meaning: 'study, learning, science',
      onyomi: 'ガク (GAKU)',
      kunyomi: 'まな.ぶ (mana.bu)',
      level: 'N5',
      strokeCount: 8,
      radical: '子 (child)',
      mnemonic: 'A child (子) under a school building roof studying.',
      exampleWords: [
        { jp: '学生 (がくせい)', en: 'student' },
        { jp: '学校 (がっこう)', en: 'school' },
        { jp: '大学 (だいがく)', en: 'university' },
      ],
    },
    {
      moduleId: mod1.id,
      character: '生',
      meaning: 'life, genuine, birth',
      onyomi: 'セイ, ショウ (SEI, SHOU)',
      kunyomi: 'い.きる, う.まれる, なま (i.kiru, u.mareru, nama)',
      level: 'N5',
      strokeCount: 5,
      radical: '生 (life)',
      mnemonic: 'A plant growing up out of the earth.',
      exampleWords: [
        { jp: '先生 (せんせい)', en: 'teacher' },
        { jp: '学生 (がくせい)', en: 'student' },
        { jp: '誕生日 (たんじょうび)', en: 'birthday' },
      ],
    },
  ];

  for (const k of kanjiMod1) {
    await prisma.kanji.upsert({
      where: { character: k.character },
      update: k,
      create: k,
    });
  }
  console.log('🈲 Seeded Kanji for Module 1');

  // 6. Seed Grammar Patterns for Module 1
  const grammarPatterns = [
    'N1 は N2 です',
    'N1 は N2 ではありません ( / じゃありません)',
    'S + か (Question)',
  ];
  await prisma.grammarPattern.deleteMany({
    where: { moduleId: mod1.id, pattern: { in: grammarPatterns } },
  });

  await prisma.grammarPattern.create({
    data: {
      moduleId: mod1.id,
      pattern: 'N1 は N2 です',
      meaning: 'N1 is N2 (Identity / Definition)',
      explanation: 'The particle は (pronounced "wa") indicates the topic of the sentence. です (desu) functions as the copula "to be" (am/is/are) in polite speech.',
      level: 'N5',
      lesson: 'Lesson 1',
      examples: {
        create: [
          {
            japanese: '私は学生です。',
            romaji: 'Watashi wa gakusei desu.',
            english: 'I am a student.',
            sortOrder: 1,
          },
          {
            japanese: '田中さんは日本人です。',
            romaji: 'Tanaka-san wa Nihonjin desu.',
            english: 'Mr./Ms. Tanaka is Japanese.',
            sortOrder: 2,
          },
        ],
      },
    },
  });

  await prisma.grammarPattern.create({
    data: {
      moduleId: mod1.id,
      pattern: 'N1 は N2 ではありません ( / じゃありません)',
      meaning: 'N1 is not N2 (Negative copula)',
      explanation: 'ではありません (dewa arimasen) is the polite negative form of です. In everyday conversational speech, じゃありません (ja arimasen) is often used instead.',
      level: 'N5',
      lesson: 'Lesson 1',
      examples: {
        create: [
          {
            japanese: '私は先生ではありません。',
            romaji: 'Watashi wa sensei dewa arimasen.',
            english: 'I am not a teacher.',
            sortOrder: 1,
          },
          {
            japanese: 'ミラーさんはアメリカ人じゃありません。',
            romaji: 'Miraa-san wa Amerikajin ja arimasen.',
            english: 'Mr. Miller is not American.',
            sortOrder: 2,
          },
        ],
      },
    },
  });

  await prisma.grammarPattern.create({
    data: {
      moduleId: mod1.id,
      pattern: 'S + か (Question)',
      meaning: 'Is S? (Interrogative particle)',
      explanation: 'The particle か (ka) at the end of a sentence turns a statement into a question. Japanese does not require changing word order for questions.',
      level: 'N5',
      lesson: 'Lesson 1',
      examples: {
        create: [
          {
            japanese: 'あなたは学生ですか。',
            romaji: 'Anata wa gakusei desu ka.',
            english: 'Are you a student?',
            sortOrder: 1,
          },
          {
            japanese: 'あの人は誰ですか。',
            romaji: 'Ano hito wa dare desu ka.',
            english: 'Who is that person?',
            sortOrder: 2,
          },
        ],
      },
    },
  });

  console.log('📐 Seeded Grammar Patterns for Module 1');

  // 7. Seed Quizzes for Module 1
  const quizzesMod1 = [
    {
      moduleId: mod1.id,
      question: 'Choose the correct particle to complete the sentence: 私 ___ 学生です。',
      options: ['が (ga)', 'は (wa)', 'を (wo)', 'に (ni)'],
      correctIndex: 1,
      explanation: 'The topic marker particle は (pronounced wa) is used to mark the subject/topic of the sentence ("As for me, I am a student").',
      questionType: QuestionType.MULTIPLE_CHOICE,
      points: 10,
    },
    {
      moduleId: mod1.id,
      question: 'How do you say "Good morning" politely in Japanese?',
      options: ['こんにちは (konnichiwa)', 'こんばんは (konbanwa)', 'おはようございます (ohayou gozaimasu)', 'さようなら (sayounara)'],
      correctIndex: 2,
      explanation: 'おはようございます (ohayou gozaimasu) is the polite expression for Good Morning.',
      questionType: QuestionType.MULTIPLE_CHOICE,
      points: 10,
    },
    {
      moduleId: mod1.id,
      question: 'What is the reading of the kanji word 「日本」?',
      options: ['にちほん (nichihon)', 'にほん (nihon)', 'じっぽん (jippon)', 'ひほん (hihon)'],
      correctIndex: 1,
      explanation: '「日本」 is pronounced にほん (nihon) or にっぽん (nippon), meaning Japan.',
      questionType: QuestionType.MULTIPLE_CHOICE,
      points: 10,
    },
    {
      moduleId: mod1.id,
      question: 'Select the correct negative sentence for: 「田中さんは先生です。」 (Mr. Tanaka is a teacher)',
      options: [
        '田中さんは先生ですありません。',
        '田中さんは先生ではありません。',
        '田中さんは先生くないです。',
        '田中さんは先生でした。',
      ],
      correctIndex: 1,
      explanation: 'The negative form of N is です is N ではありません (dewa arimasen) or N じゃありません (ja arimasen).',
      questionType: QuestionType.MULTIPLE_CHOICE,
      points: 10,
    },
    {
      moduleId: mod1.id,
      question: 'What does 「はじめまして」 (hajimemashite) mean?',
      options: ['Thank you very much', 'See you later', 'Nice to meet you (for the first time)', 'Excuse me'],
      correctIndex: 2,
      explanation: 'はじめまして is used at the beginning of a self-introduction when meeting someone for the first time.',
      questionType: QuestionType.MULTIPLE_CHOICE,
      points: 10,
    },
  ];

  await prisma.quizQuestion.deleteMany({
    where: {
      moduleId: mod1.id,
      question: { in: quizzesMod1.map((item) => item.question) },
    },
  });
  await prisma.quizQuestion.createMany({ data: quizzesMod1 });
  console.log('❓ Seeded Quiz Questions for Module 1');

  // 8. Seed Dictionary Entries (from Vocabulary & Kanji)
  const dictEntries = [
    { japanese: '私', hiragana: 'わたし', romaji: 'watashi', english: 'I, me', type: 'Pronoun', level: 'N5' },
    { japanese: '学生', hiragana: 'がくせい', romaji: 'gakusei', english: 'student', type: 'Noun', level: 'N5' },
    { japanese: '先生', hiragana: 'せんせい', romaji: 'sensei', english: 'teacher, master, doctor', type: 'Noun', level: 'N5' },
    { japanese: '日本', hiragana: 'にほん', romaji: 'nihon', english: 'Japan', type: 'Noun', level: 'N5' },
    { japanese: '日本人', hiragana: 'にほんじん', romaji: 'nihonjin', english: 'Japanese person', type: 'Noun', level: 'N5' },
    { japanese: 'おはようございます', hiragana: 'おはようございます', romaji: 'ohayou gozaimasu', english: 'Good morning (polite)', type: 'Expression', level: 'N5' },
    { japanese: 'こんにちは', hiragana: 'こんにちは', romaji: 'konnichiwa', english: 'Hello, Good afternoon', type: 'Expression', level: 'N5' },
    { japanese: 'はじめまして', hiragana: 'はじめまして', romaji: 'hajimemashite', english: 'Nice to meet you (first time)', type: 'Expression', level: 'N5' },
  ];

  await prisma.dictionaryEntry.deleteMany({
    where: { japanese: { in: dictEntries.map((item) => item.japanese) } },
  });
  await prisma.dictionaryEntry.createMany({ data: dictEntries });
  console.log('🔍 Seeded Dictionary Entries');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
