import { publishedItem } from './publication';
import { prisma } from '../config/prisma';
import { calculateSm2 } from '../utils/srs';
import { Prisma, SrsItemType, SrsStatus } from '@prisma/client';

export class FlashcardService {
  async getDueReviews(userId: number, itemType?: SrsItemType, limit = 20) {
    const now = new Date();
    const where: any = {
      userId,
      nextReview: { lte: now },
    };
    if (itemType) where.itemType = itemType;

    const reviews = await prisma.userFlashcardProgress.findMany({
      where,
      take: limit,
      orderBy: { nextReview: 'asc' },
    });

    // Fetch actual item contents based on itemType
    const populatedReviews = await Promise.all(
      reviews.map(async (rev) => {
        let itemData: any = null;
        if (rev.itemType === SrsItemType.VOCAB) {
          itemData = await prisma.vocabulary.findFirst({ where: { id: rev.itemId, ...publishedItem } });
        } else if (rev.itemType === SrsItemType.KANJI) {
          itemData = await prisma.kanji.findFirst({ where: { id: rev.itemId, ...publishedItem } });
        } else if (rev.itemType === SrsItemType.GRAMMAR) {
          itemData = await prisma.grammarPattern.findFirst({ where: { id: rev.itemId, ...publishedItem } });
        }
        return {
          ...rev,
          itemData,
        };
      })
    );

    return populatedReviews.filter((r) => r.itemData !== null);
  }

  async submitReview(userId: number, itemType: SrsItemType, itemId: number, quality: number) {
    const itemExists = itemType === SrsItemType.VOCAB
      ? await prisma.vocabulary.findFirst({ where: { id: itemId, ...publishedItem }, select: { id: true } })
      : itemType === SrsItemType.KANJI
        ? await prisma.kanji.findFirst({ where: { id: itemId, ...publishedItem }, select: { id: true } })
        : await prisma.grammarPattern.findFirst({ where: { id: itemId, ...publishedItem }, select: { id: true } });

    if (!itemExists) {
      const error: any = new Error(`${itemType} item #${itemId} not found`);
      error.statusCode = 404;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const existing = await tx.userFlashcardProgress.findUnique({
        where: { userId_itemType_itemId: { userId, itemType, itemId } },
      });
      const now = new Date();
      const isDue = !existing || existing.nextReview <= now;
      const sm2Result = calculateSm2({
        quality,
        repetitions: existing?.repetitions || 0,
        interval: existing?.interval || 0,
        easeFactor: existing?.easeFactor ? Number(existing.easeFactor) : 2.5,
      });

      const updated = await tx.userFlashcardProgress.upsert({
        where: { userId_itemType_itemId: { userId, itemType, itemId } },
        create: {
          userId,
          itemType,
          itemId,
          status: sm2Result.status,
          repetitions: sm2Result.repetitions,
          interval: sm2Result.interval,
          easeFactor: sm2Result.easeFactor,
          nextReview: sm2Result.nextReview,
          lastReview: now,
        },
        update: isDue ? {
          status: sm2Result.status,
          repetitions: sm2Result.repetitions,
          interval: sm2Result.interval,
          easeFactor: sm2Result.easeFactor,
          nextReview: sm2Result.nextReview,
          lastReview: now,
        } : {},
      });

      if (isDue) {
        await tx.userGamification.upsert({
          where: { userId },
          create: { userId, xp: 2, totalXpEarned: 2, dailyXp: 2 },
          update: { xp: { increment: 2 }, totalXpEarned: { increment: 2 }, dailyXp: { increment: 2 } },
        });
      }
      return { ...updated, xpEarned: isDue ? 2 : 0 };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async getSrsStats(userId: number) {
    const stats = await prisma.userFlashcardProgress.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true },
    });

    const now = new Date();
    const dueCount = await prisma.userFlashcardProgress.count({
      where: { userId, nextReview: { lte: now } },
    });

    const statMap: Record<string, number> = {
      LEARNING: 0,
      REVIEWING: 0,
      MASTERED: 0,
    };

    stats.forEach((s) => {
      statMap[s.status] = s._count.id;
    });

    return {
      dueCount,
      learning: statMap.LEARNING || 0,
      reviewing: statMap.REVIEWING || 0,
      mastered: statMap.MASTERED || 0,
      totalTracked: (statMap.LEARNING || 0) + (statMap.REVIEWING || 0) + (statMap.MASTERED || 0),
    };
  }
}

export const flashcardService = new FlashcardService();
