import { z } from 'zod';
import { GameType, SrsItemType, KanaType } from '@prisma/client';

export const updateProgressSchema = z.object({
  body: z.object({
    moduleId: z.number().int().positive(),
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS']).optional(),
    progressPercent: z.number().int().min(0).max(99).optional(),
  }),
});

export const srsReviewSchema = z.object({
  body: z.object({
    itemType: z.nativeEnum(SrsItemType),
    itemId: z.number().int().positive(),
    quality: z.number().int().min(0).max(5),
  }),
});

export const submitGameScoreSchema = z.object({
  body: z.object({
    gameType: z.nativeEnum(GameType),
    score: z.number().int().min(0).max(100000),
    streak: z.number().int().min(0).max(10000).optional(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
});

export const updateKanaProgressSchema = z.object({
  body: z.object({
    character: z.string().min(1).max(3),
    kanaType: z.nativeEnum(KanaType),
    status: z.enum(['LEARNING', 'MASTERED']).optional(),
    incrementReview: z.boolean().optional(),
  }),
});

export const updateSettingsSchema = z.object({
  body: z.object({
    weeklyGoalTarget: z.number().int().positive().optional(),
    dailyReminderTime: z.string().optional(),
    preferredLevel: z.string().optional(),
  }),
});
