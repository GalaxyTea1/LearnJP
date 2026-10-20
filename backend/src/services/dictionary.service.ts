import { prisma } from '../config/prisma';

export class DictionaryService {
  async search(query: string, limit = 20, userId?: number) {
    const results = await prisma.dictionaryEntry.findMany({
      where: {
        OR: [
          { japanese: { contains: query, mode: 'insensitive' } },
          { romaji: { contains: query, mode: 'insensitive' } },
          { english: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { id: 'asc' },
    });

    if (userId && query.trim().length > 0) {
      // Log search history asynchronously without blocking response
      prisma.searchHistory
        .create({
          data: {
            userId,
            query: query.trim(),
            resultsCount: results.length,
          },
        })
        .catch(() => {});
    }

    return results;
  }

  async getSearchHistory(userId: number, limit = 10) {
    return prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { searchedAt: 'desc' },
      take: limit,
    });
  }
}

export const dictionaryService = new DictionaryService();
