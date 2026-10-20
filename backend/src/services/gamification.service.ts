import { prisma } from '../config/prisma';

export class GamificationService {
  async getMyStats(userId: number) {
    const stats = await prisma.userGamification.upsert({
      where: { userId },
      create: { userId, xp: 0, streak: 0 },
      update: {},
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true, lastStudyDate: true },
    });

    return {
      ...stats,
      currentStreak: user?.currentStreak || 0,
      lastStudyDate: user?.lastStudyDate || null,
    };
  }

  async recordDailyActivity(userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const lastStudyStr = user.lastStudyDate ? user.lastStudyDate.toISOString().split('T')[0] : null;

    if (lastStudyStr === todayStr) {
      // Already studied today
      return { streak: user.currentStreak, streakUpdated: false };
    }

    let newStreak = 1;
    if (lastStudyStr) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastStudyStr === yesterdayStr) {
        newStreak = user.currentStreak + 1;
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        lastStudyDate: now,
      },
    });

    await prisma.userGamification.upsert({
      where: { userId },
      create: { userId, streak: newStreak },
      update: { streak: newStreak },
    });

    return { streak: newStreak, streakUpdated: true };
  }

  async getLeaderboard(limit = 10) {
    return prisma.userGamification.findMany({
      take: limit,
      orderBy: { totalXpEarned: 'desc' },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true, currentStreak: true } },
      },
    });
  }
}

export const gamificationService = new GamificationService();
