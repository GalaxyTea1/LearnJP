import { publishedModule, requirePublishedModule } from './publication';
import { prisma } from '../config/prisma';
import { ModuleStatus, Prisma } from '@prisma/client';

export class ProgressService {
  async getMyProgress(userId: number) {
    const [moduleProgress, totalModules, completedModules] = await Promise.all([
      prisma.userModuleProgress.findMany({
        where: { userId, module: publishedModule },
        include: {
          module: {
            select: {
              id: true,
              title: true,
              unitNumber: true,
              levelId: true,
              level: { select: { level: true, title: true, color: true } },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.learningModule.count({ where: publishedModule }),
      prisma.userModuleProgress.count({
        where: { userId, status: ModuleStatus.COMPLETED, module: publishedModule },
      }),
    ]);

    // Calculate level summaries
    const levelStats = await prisma.$queryRaw<any[]>`
      SELECT 
        l.level, 
        COUNT(m.id)::int as total_modules,
        COUNT(CASE WHEN ump.status = 'COMPLETED' THEN 1 END)::int as completed_modules,
        COALESCE(AVG(ump.progress_percent), 0)::int as avg_progress
      FROM jlpt_levels l
      LEFT JOIN learning_modules m ON l.id = m.level_id AND m.content_status = 'PUBLISHED'
      LEFT JOIN user_module_progress ump ON m.id = ump.module_id AND ump.user_id = ${userId}
      GROUP BY l.id, l.level, l.sort_order
      ORDER BY l.sort_order ASC
    `;

    return {
      overview: {
        totalModules,
        completedModules,
        overallPercent: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
      },
      levelStats,
      recentModules: moduleProgress.slice(0, 5),
      allModuleProgress: moduleProgress,
    };
  }

  async updateModuleProgress(userId: number, data: {
    moduleId: number;
    status?: ModuleStatus;
    progressPercent?: number;
  }) {
    const { moduleId, status, progressPercent } = data;
    await requirePublishedModule(moduleId);

    if (status === ModuleStatus.COMPLETED || status === ModuleStatus.LOCKED || progressPercent === 100) {
      const error: any = new Error('Module completion is determined by server-graded assessments');
      error.statusCode = 403;
      throw error;
    }

    const existing = await prisma.userModuleProgress.findUnique({
      where: { userId_moduleId: { userId, moduleId } },
    });

    if (existing?.status === ModuleStatus.COMPLETED) {
      return existing;
    }

    const newPercent = progressPercent !== undefined ? progressPercent : existing?.progressPercent || 0;
    const newStatus = status || ModuleStatus.IN_PROGRESS;

    const updateData: any = {
      status: newStatus,
      progressPercent: newPercent,
    };

    const updated = await prisma.userModuleProgress.upsert({
      where: { userId_moduleId: { userId, moduleId } },
      create: {
        userId,
        moduleId,
        status: newStatus,
        progressPercent: newPercent,
        startedAt: new Date(),
        completedAt: null,
      },
      update: updateData,
    });

    return updated;
  }

  async getReviewItems(userId: number, limit: number = 20) {
    // Lấy các module user đã học hoặc đang học
    const userModules = await prisma.userModuleProgress.findMany({
      where: { userId, module: publishedModule },
      select: { moduleId: true },
    });
    const moduleIds = userModules.map(m => m.moduleId);

    // Nếu chưa học gì, fallback lấy các module N5 (level_id = 1, giả định)
    if (moduleIds.length === 0) {
      const defaultModules = await prisma.learningModule.findMany({
        where: publishedModule,
        take: 3,
        select: { id: true },
        orderBy: { sortOrder: 'asc' }
      });
      moduleIds.push(...defaultModules.map(m => m.id));
    }

    if (moduleIds.length === 0) return { vocab: [], kanji: [] };

    // Lấy ngẫu nhiên từ vựng
    const vocab = await prisma.$queryRaw<any[]>`
      SELECT * FROM vocabulary 
      WHERE module_id IN (${Prisma.empty} ${moduleIds.length > 0 ? Prisma.join(moduleIds) : 0})
      AND module_id IN (SELECT id FROM learning_modules WHERE content_status = 'PUBLISHED')
      ORDER BY RANDOM() 
      LIMIT ${limit}
    `;

    // Lấy ngẫu nhiên kanji
    const kanji = await prisma.$queryRaw<any[]>`
      SELECT * FROM kanji 
      WHERE module_id IN (${Prisma.empty} ${moduleIds.length > 0 ? Prisma.join(moduleIds) : 0})
      AND module_id IN (SELECT id FROM learning_modules WHERE content_status = 'PUBLISHED')
      ORDER BY RANDOM() 
      LIMIT ${limit}
    `;

    return { vocab, kanji };
  }
}

export const progressService = new ProgressService();
