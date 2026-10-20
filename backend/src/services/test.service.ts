import { prisma } from '../config/prisma';
import { Prisma, TestAttemptStatus } from '@prisma/client';

export class TestService {
  async getTemplates(level?: string) {
    const where = level ? { level, isPublished: true } : { isPublished: true };
    return prisma.testTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        sections: {
          select: { id: true, sectionType: true, title: true, durationMinutes: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { attempts: true } },
      },
    });
  }

  async getTemplateById(id: number) {
    return prisma.testTemplate.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
          include: {
            questions: {
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                questionType: true,
                passage: true,
                questionText: true,
                options: true,
                points: true,
                sortOrder: true,
              },
            },
          },
        },
      },
    });
  }

  async startAttempt(userId: number, templateId: number) {
    const template = await prisma.testTemplate.findUnique({
      where: { id: templateId },
      include: {
        sections: { include: { questions: { select: { points: true } } } },
      },
    });

    if (!template || !template.isPublished) {
      const error: any = new Error('Published test template not found');
      error.statusCode = 404;
      throw error;
    }

    const maxScore = template.sections.reduce((total, sec) => {
      return total + sec.questions.reduce((sum, q) => sum + q.points, 0);
    }, 0);

    return prisma.userTestAttempt.create({
      data: {
        userId,
        templateId,
        maxScore,
        status: TestAttemptStatus.IN_PROGRESS,
      },
    });
  }

  async submitAttempt(userId: number, attemptId: number, answers: Array<{ questionId: number; selectedAnswer: number }>) {
    const answerIds = answers.map((answer) => answer.questionId);
    if (new Set(answerIds).size !== answerIds.length) {
      const error: any = new Error('Each test question may only be answered once');
      error.statusCode = 400;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const attempt = await tx.userTestAttempt.findUnique({
        where: { id: attemptId },
        include: {
          template: {
            include: {
              sections: {
                include: { questions: true },
              },
            },
          },
        },
      });

      if (!attempt || attempt.userId !== userId) {
        const error: any = new Error('Attempt not found');
        error.statusCode = 404;
        throw error;
      }
      if (attempt.status !== TestAttemptStatus.IN_PROGRESS) {
        const error: any = new Error('Attempt already submitted or abandoned');
        error.statusCode = 409;
        throw error;
      }

      const questionMap = new Map<number, typeof attempt.template.sections[number]['questions'][number]>();
      attempt.template.sections.forEach((section) => {
        section.questions.forEach((question) => questionMap.set(question.id, question));
      });
      if (answers.some((answer) => !questionMap.has(answer.questionId))) {
        const error: any = new Error('One or more answers do not belong to this test');
        error.statusCode = 400;
        throw error;
      }

      let totalScore = 0;
      const answerRecords = answers.map((answer) => {
        const question = questionMap.get(answer.questionId)!;
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        const pointsEarned = isCorrect ? question.points : 0;
        totalScore += pointsEarned;
        return {
          attemptId,
          questionId: question.id,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
          pointsEarned,
        };
      });

      if (answerRecords.length > 0) {
        await tx.userTestAnswer.createMany({ data: answerRecords });
      }

      const updatedAttempt = await tx.userTestAttempt.update({
        where: { id: attemptId },
        data: {
          status: TestAttemptStatus.COMPLETED,
          finishedAt: new Date(),
          totalScore,
          answers: answers as Prisma.InputJsonValue,
        },
      });

      const xpEarned = Math.min(150, Math.round((totalScore / Math.max(1, attempt.maxScore)) * 150));
      if (xpEarned > 0) {
        await tx.userGamification.upsert({
          where: { userId },
          create: { userId, xp: xpEarned, totalXpEarned: xpEarned, dailyXp: xpEarned },
          update: {
            xp: { increment: xpEarned },
            totalXpEarned: { increment: xpEarned },
            dailyXp: { increment: xpEarned },
          },
        });
      }

      return { attempt: updatedAttempt, totalScore, maxScore: attempt.maxScore, xpEarned };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async getMyAttempts(userId: number, templateId?: number) {
    const where: any = { userId };
    if (templateId) where.templateId = templateId;

    return prisma.userTestAttempt.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      include: {
        template: { select: { id: true, title: true, level: true, durationMinutes: true } },
      },
    });
  }
}

export const testService = new TestService();
