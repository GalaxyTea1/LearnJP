import { prisma } from '../config/prisma';
import { ModuleStatus } from '@prisma/client';

export class UserService {
  async getSettings(userId: number) {
    return prisma.userLearningSettings.upsert({
      where: { userId },
      create: { userId, weeklyGoalTarget: 20 },
      update: {},
    });
  }

  async updateSettings(userId: number, data: any) {
    const settings = {
      weeklyGoalTarget: data.weeklyGoalTarget,
      dailyReminderTime: data.dailyReminderTime,
      preferredLevel: data.preferredLevel,
    };
    return prisma.userLearningSettings.upsert({
      where: { userId },
      create: { userId, ...settings },
      update: settings,
    });
  }

  async getDashboardSummary(userId: number) {
    const [user, settings, gamification, dueReviews, inProgressModules] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, displayName: true, avatarUrl: true, currentStreak: true },
      }),
      prisma.userLearningSettings.findUnique({ where: { userId } }),
      prisma.userGamification.findUnique({ where: { userId } }),
      prisma.userFlashcardProgress.count({
        where: { userId, nextReview: { lte: new Date() } },
      }),
      prisma.userModuleProgress.findMany({
        where: { userId, status: ModuleStatus.IN_PROGRESS },
        take: 3,
        orderBy: { updatedAt: 'desc' },
        include: {
          module: { select: { id: true, title: true, unitNumber: true, level: { select: { level: true, color: true } } } },
        },
      }),
    ]);

    return {
      user,
      settings: settings || { weeklyGoalTarget: 20 },
      gamification: gamification || { xp: 0, streak: 0, totalXpEarned: 0 },
      dueReviewsCount: dueReviews,
      inProgressModules,
    };
  }
}

export const userService = new UserService();
