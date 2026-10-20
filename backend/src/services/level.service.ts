import { publishedModule } from './publication';
import { prisma } from '../config/prisma';

export class LevelService {
  async getAllLevels(userId?: number, preview = false) {
    const levels = await prisma.jlptLevel.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { modules: { where: preview ? {} : publishedModule } },
        },
      },
    });

    if (!userId) {
      return levels.map((l) => ({ ...l, userProgressPercent: 0 }));
    }

    // Calculate progress for user if logged in
    const userProgress = await Promise.all(
      levels.map(async (level) => {
        const modules = await prisma.learningModule.findMany({
          where: { levelId: level.id, ...(!preview ? publishedModule : {}) },
          select: { id: true },
        });

        if (modules.length === 0) return { ...level, userProgressPercent: 0 };

        const moduleIds = modules.map((m) => m.id);
        const progresses = await prisma.userModuleProgress.findMany({
          where: {
            userId,
            moduleId: { in: moduleIds },
          },
        });

        const totalPercent = progresses.reduce((acc, curr) => acc + curr.progressPercent, 0);
        const avgPercent = Math.round(totalPercent / modules.length);

        return { ...level, userProgressPercent: avgPercent };
      })
    );

    return userProgress;
  }

  async getLevelByCode(levelCode: string, userId?: number, preview = false) {
    const level = await prisma.jlptLevel.findUnique({
      where: { level: levelCode.toUpperCase() },
      include: {
        modules: {
          where: preview ? {} : publishedModule,
          orderBy: { unitNumber: 'asc' },
          include: {
            _count: {
              select: {
                vocabulary: true,
                kanji: true,
                grammarPatterns: true,
                quizQuestions: true,
              },
            },
          },
        },
      },
    });

    if (!level) {
      const error: any = new Error(`JLPT Level ${levelCode} not found`);
      error.statusCode = 404;
      throw error;
    }

    if (!userId) {
      return {
        ...level,
        modules: level.modules.map((m) => ({ ...m, status: 'NOT_STARTED', progressPercent: 0 })),
      };
    }

    const moduleIds = level.modules.map((m) => m.id);
    const userProgresses = await prisma.userModuleProgress.findMany({
      where: {
        userId,
        moduleId: { in: moduleIds },
      },
    });

    const progressMap = new Map(userProgresses.map((p) => [p.moduleId, p]));

    const modulesWithProgress = level.modules.map((m) => {
      const p = progressMap.get(m.id);
      return {
        ...m,
        status: p?.status || 'NOT_STARTED',
        progressPercent: p?.progressPercent || 0,
      };
    });

    return { ...level, modules: modulesWithProgress };
  }

  async createLevel(data: any) {
    return prisma.jlptLevel.create({ data });
  }

  async updateLevel(id: number, data: any) {
    return prisma.jlptLevel.update({ where: { id }, data });
  }
}

export const levelService = new LevelService();
