import { z } from 'zod';
import { VocabType, QuestionType } from '@prisma/client';

export const levelParamSchema = z.object({
  params: z.object({
    level: z.enum(['N5', 'N4', 'N3', 'N2', 'N1']),
  }),
});

export const createLevelSchema = z.object({
  body: z.object({
    level: z.enum(['N5', 'N4', 'N3', 'N2', 'N1']),
    title: z.string().min(1),
    titleJp: z.string().min(1),
    color: z.string().min(1),
    badge: z.string().min(1),
    description: z.string().min(1),
    totalVocab: z.number().int().nonnegative(),
    totalKanji: z.number().int().nonnegative(),
    totalGrammar: z.number().int().nonnegative(),
    sortOrder: z.number().int().default(1),
  }),
});

export const createModuleSchema = z.object({
  body: z.object({
    levelId: z.number().int().positive(),
    unitNumber: z.number().int().positive(),
    title: z.string().min(1),
    titleJp: z.string().min(1),
    description: z.string().min(1),
    topics: z.array(z.string()).min(1),
    sortOrder: z.number().int().default(1),
  }),
});

export const createVocabSchema = z.object({
  body: z.object({
    moduleId: z.number().int().positive().optional(),
    japanese: z.string().min(1),
    hiragana: z.string().optional(),
    romaji: z.string().min(1),
    english: z.string().min(1),
    type: z.nativeEnum(VocabType),
    level: z.string().optional(),
    lesson: z.string().optional(),
    exampleJp: z.string().optional(),
    exampleEn: z.string().optional(),
  }),
});

export const createKanjiSchema = z.object({
  body: z.object({
    moduleId: z.number().int().positive().optional(),
    character: z.string().min(1).max(5),
    meaning: z.string().min(1),
    onyomi: z.string().optional(),
    kunyomi: z.string().optional(),
    level: z.string().min(1),
    strokeCount: z.number().int().positive().optional(),
    radical: z.string().optional(),
    exampleWords: z.array(z.object({ jp: z.string(), en: z.string() })).optional(),
    relatedChars: z.array(z.string()).optional(),
    mnemonic: z.string().optional(),
  }),
});

export const createGrammarSchema = z.object({
  body: z.object({
    moduleId: z.number().int().positive().optional(),
    pattern: z.string().min(1),
    meaning: z.string().min(1),
    explanation: z.string().min(1),
    level: z.string().min(1),
    lesson: z.string().optional(),
    textbook: z.string().optional(),
    examples: z.array(
      z.object({
        japanese: z.string().min(1),
        romaji: z.string().optional(),
        english: z.string().min(1),
        sortOrder: z.number().int().default(0),
      })
    ).optional(),
  }),
});

export const createQuizSchema = z.object({
  body: z.object({
    moduleId: z.number().int().positive(),
    question: z.string().min(1),
    options: z.array(z.string()).min(2),
    correctIndex: z.number().int().nonnegative(),
    explanation: z.string().min(1),
    questionType: z.nativeEnum(QuestionType).default(QuestionType.MULTIPLE_CHOICE),
    points: z.number().int().positive().default(10),
  }),
});

export const submitQuizSchema = z.object({
  body: z.object({
    requestId: z.string().uuid(),
    quizRevision: z.string().regex(/^[a-f0-9]{64}$/).optional(),
    moduleId: z.number().int().positive(),
    answers: z.array(
      z.object({
        questionId: z.number().int().positive(),
        selectedIndex: z.number().int().nonnegative(),
      })
    ).min(1),
    timeTaken: z.number().int().nonnegative().optional(),
  }),
});

export const searchDictionarySchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search keyword is required'),
    limit: z.coerce.number().int().positive().max(50).default(20),
  }),
});
