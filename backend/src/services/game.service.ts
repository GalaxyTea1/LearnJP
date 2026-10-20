import { prisma } from '../config/prisma';
import { GameType } from '@prisma/client';

export class GameService {
  async submitScore(userId: number, data: {
    gameType: GameType;
    score: number;
    streak?: number;
    details?: unknown;
  }) {
    const scoreRecord = await prisma.userGameScore.create({
      data: {
        userId,
        gameType: data.gameType,
        score: data.score,
        streak: data.streak ?? 0,
        details: data.details as object | undefined,
      },
    });

    return {
      scoreRecord,
      xpEarned: 0,
    };
  }

  async getLeaderboard(gameType?: GameType, limit = 10) {
    const where = gameType ? { gameType } : {};
    return prisma.userGameScore.findMany({
      where,
      take: limit,
      orderBy: { score: 'desc' },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });
  }

  async getMyHistory(userId: number, gameType?: GameType, limit = 20) {
    const where: any = { userId };
    if (gameType) where.gameType = gameType;

    return prisma.userGameScore.findMany({
      where,
      take: limit,
      orderBy: { playedAt: 'desc' },
    });
  }
}

export const gameService = new GameService();
