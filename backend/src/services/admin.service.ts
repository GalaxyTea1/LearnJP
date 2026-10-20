import { prisma } from '../config/prisma';
import { UserRole } from '@prisma/client';

export class AdminService {
  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalLevels,
      totalModules,
      totalVocab,
      totalKanji,
      totalGrammar,
      totalQuizzes,
      totalTestAttempts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.jlptLevel.count(),
      prisma.learningModule.count(),
      prisma.vocabulary.count(),
      prisma.kanji.count(),
      prisma.grammarPattern.count(),
      prisma.quizQuestion.count(),
      prisma.userTestAttempt.count(),
    ]);

    const recentActivity = await prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, displayName: true, role: true } },
      },
    });

    return {
      stats: {
        totalUsers,
        activeUsers,
        content: {
          totalLevels,
          totalModules,
          totalVocab,
          totalKanji,
          totalGrammar,
          totalQuizzes,
        },
        activity: {
          totalTestAttempts,
        },
      },
      recentActivity,
    };
  }

  async getAllUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          role: true,
          currentStreak: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserStatus(userId: number, data: { role?: UserRole; isActive?: boolean }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  async getSiteSettings() {
    return prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async updateSiteSetting(key: string, value: string, description?: string) {
    return prisma.siteSetting.upsert({
      where: { key },
      create: { key, value, description },
      update: { value, description },
    });
  }

  async getActivityLogs(page = 1, limit = 50, userId?: number, action?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, displayName: true } },
        },
      }),
      prisma.activityLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const adminService = new AdminService();
