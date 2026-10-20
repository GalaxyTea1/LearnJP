import { prisma } from '../config/prisma';
import { KanaType, KanaStatus } from '@prisma/client';

export class KanaService {
  async getMyKanaProgress(userId: number, kanaType?: KanaType) {
    const where: any = { userId };
    if (kanaType) where.kanaType = kanaType;

    return prisma.userKanaProgress.findMany({
      where,
      orderBy: { character: 'asc' },
    });
  }

  async updateKanaProgress(userId: number, data: {
    character: string;
    kanaType: KanaType;
    status?: KanaStatus;
    incrementReview?: boolean;
  }) {
    const existing = await prisma.userKanaProgress.findUnique({
      where: {
        userId_kanaType_character: {
          userId,
          kanaType: data.kanaType,
          character: data.character,
        },
      },
    });

    const updateData: any = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.incrementReview) {
      updateData.reviewCount = { increment: 1 };
      updateData.lastReviewed = new Date();
    }

    return prisma.userKanaProgress.upsert({
      where: {
        userId_kanaType_character: {
          userId,
          kanaType: data.kanaType,
          character: data.character,
        },
      },
      create: {
        userId,
        character: data.character,
        kanaType: data.kanaType,
        status: data.status || KanaStatus.LEARNING,
        reviewCount: data.incrementReview ? 1 : 0,
        lastReviewed: data.incrementReview ? new Date() : null,
      },
      update: updateData,
    });
  }
}

export const kanaService = new KanaService();
