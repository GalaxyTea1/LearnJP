import { quizRevision, publicQuizQuestions } from './quizRevision';
import { publishedModule, publishedExercise } from './publication';
import { prisma } from '../config/prisma';

export class ModuleService {
  async getModules(levelId?: number, userId?: number, preview = false) {
    const where = { ...(levelId ? { levelId } : {}), ...(!preview ? publishedModule : {}) };
    const modules = await prisma.learningModule.findMany({
      where,
      orderBy: [{ levelId: 'asc' }, { unitNumber: 'asc' }],
      include: {
        level: { select: { level: true, title: true, color: true } },
        _count: {
          select: {
            vocabulary: true,
            kanji: true,
            grammarPatterns: true,
            quizQuestions: true,
          },
        },
      },
    });

    if (!userId) {
      return modules.map((m) => ({ ...m, status: 'NOT_STARTED', progressPercent: 0 }));
    }

    const moduleIds = modules.map((m) => m.id);
    const userProgresses = await prisma.userModuleProgress.findMany({
      where: { userId, moduleId: { in: moduleIds } },
    });

    const progressMap = new Map(userProgresses.map((p) => [p.moduleId, p]));

    return modules.map((m) => {
      const p = progressMap.get(m.id);
      return {
        ...m,
        status: p?.status || 'NOT_STARTED',
        progressPercent: p?.progressPercent || 0,
      };
    });
  }

  async getModuleById(id: number, userId?: number, preview = false) {
    const module = await prisma.learningModule.findFirst({
      where: { id, ...(!preview ? publishedModule : {}) },
      include: {
        level: true,
        _count: {
          select: {
            vocabulary: true,
            kanji: true,
            grammarPatterns: true,
            quizQuestions: true,
          },
        },
      },
    });

    if (!module) {
      const error: any = new Error(`Learning Module #${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    let progress: any = { status: 'NOT_STARTED', progressPercent: 0 };
    if (userId && !preview) {
      const p = await prisma.userModuleProgress.findUnique({
        where: { userId_moduleId: { userId, moduleId: id } },
      });
      if (p) progress = p;
    }

    return { ...module, userProgress: progress };
  }

  async getModuleFullContent(id: number, userId?: number, preview = false) {
    const module = await prisma.learningModule.findFirst({
      where: { id, ...(!preview ? publishedModule : {}) },
      include: {
        level: true,
        sections: {
          where: preview ? {} : { status: 'PUBLISHED' },
          orderBy: { sortOrder: 'asc' },
          include: {
            conversations: {
              where: preview ? {} : { status: 'PUBLISHED' },
              include: { lines: { orderBy: { sortOrder: 'asc' } } },
            },
            listeningContent: { where: preview ? {} : { status: 'PUBLISHED' } },
            readingPassages: {
              where: preview ? {} : { status: 'PUBLISHED' },
              include: { exercises: { where: preview ? {} : publishedExercise, orderBy: { sortOrder: 'asc' } } },
            },
            writingTasks: { where: preview ? {} : { status: 'PUBLISHED' } },
            exercises: { where: preview ? {} : publishedExercise, orderBy: { sortOrder: 'asc' } },
          },
        },
        vocabulary: { orderBy: { id: 'asc' } },
        kanji: { orderBy: { id: 'asc' } },
        grammarPatterns: {
          orderBy: { id: 'asc' },
          include: {
            examples: { orderBy: { sortOrder: 'asc' } },
          },
        },
        quizQuestions: {
          orderBy: { id: 'asc' },
          select: {
            id: true,
            question: true,
            options: true,
            questionType: true,
            points: true,
            correctIndex: true,
            explanation: true,
          },
        },
      },
    });

    if (!module) {
      const error: any = new Error(`Learning Module #${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    let progress: any = { status: 'NOT_STARTED', progressPercent: 0 };
    if (userId && !preview) {
      const p = await prisma.userModuleProgress.findUnique({
        where: { userId_moduleId: { userId, moduleId: id } },
      });
      if (p) progress = p;
      else {
        // Auto initialize progress to IN_PROGRESS when they load full content
        progress = await prisma.userModuleProgress.create({
          data: {
            userId,
            moduleId: id,
            status: 'IN_PROGRESS',
            progressPercent: 10,
            startedAt: new Date(),
          },
        });
      }
    }

    return { ...module, quizQuestions: publicQuizQuestions(module.quizQuestions), quizRevision: quizRevision(id, module.quizQuestions), userProgress: progress };
  }

  async createModule(data: any) {
    return prisma.learningModule.create({ data });
  }

  async updateModule(id: number, data: any) {
    return prisma.learningModule.update({ where: { id }, data });
  }

  async deleteModule(id: number) {
    return prisma.learningModule.delete({ where: { id } });
  }
}

export const moduleService = new ModuleService();
