import { prisma } from '../config/prisma';

export class HistoryService {
  async getSearchHistory(userId: number, limit = 20) {
    return prisma.searchHistory.findMany({
      where: { userId },
      take: limit,
      orderBy: { searchedAt: 'desc' },
    });
  }

  async clearSearchHistory(userId: number) {
    return prisma.searchHistory.deleteMany({ where: { userId } });
  }

  async recordTranslation(userId: number, data: {
    sourceText: string;
    translatedText: string;
    direction: string;
  }) {
    return prisma.translationHistory.create({
      data: {
        userId,
        sourceText: data.sourceText,
        translatedText: data.translatedText,
        direction: data.direction,
      },
    });
  }

  async getTranslationHistory(userId: number, limit = 20) {
    return prisma.translationHistory.findMany({
      where: { userId },
      take: limit,
      orderBy: { translatedAt: 'desc' },
    });
  }

  async clearTranslationHistory(userId: number) {
    return prisma.translationHistory.deleteMany({ where: { userId } });
  }
}

export const historyService = new HistoryService();
