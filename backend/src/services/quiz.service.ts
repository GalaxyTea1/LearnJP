import { createHash } from 'node:crypto';
import { quizRevision, publicQuizQuestions } from './quizRevision';
import { publishedModule } from './publication';
import { ModuleStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export class QuizService {
  async getQuestionsByModule(moduleId: number, preview = false) {
    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId, ...(!preview ? { module: publishedModule } : {}) },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        moduleId: true,
        question: true,
        options: true,
        questionType: true,
        points: true,
        correctIndex: true,
        explanation: true,
      },
    });
    return { questions: publicQuizQuestions(questions), quizRevision: quizRevision(moduleId, questions) };
  }

  async createQuestion(data: any) {
    return prisma.quizQuestion.create({ data });
  }

  async deleteQuestion(id: number) {
    return prisma.quizQuestion.delete({ where: { id } });
  }

  async submitQuiz(userId: number, moduleId: number, answers: { questionId: number; selectedIndex: number }[], timeTaken?: number, revision?: string, requestId?: string) {
    const requestHash = createHash('sha256').update(JSON.stringify([moduleId, revision, timeTaken ?? null, [...answers].sort((a,b) => a.questionId - b.questionId)])).digest('hex');
    for (let retry = 0; ; retry++) {
    try {
    return await prisma.$transaction(async (tx) => {
    if (requestId) {
      const previous = await tx.userQuizAttempt.findUnique({ where: { userId_requestId: { userId, requestId } } });
      if (previous) {
        if (previous.requestHash !== requestHash) throw Object.assign(new Error('QUIZ_REQUEST_CONFLICT'), { statusCode: 409 });
        return previous.response;
      }
    }
    const questions = await tx.quizQuestion.findMany({
      where: { moduleId, module: publishedModule },
    });

    if (questions.length === 0) {
      const error: any = new Error(`No quiz questions found for Module #${moduleId}`);
      error.statusCode = 404;
      throw error;
    }

    if (!revision || revision !== quizRevision(moduleId, questions)) {
      throw Object.assign(new Error('QUIZ_REVISION_CHANGED'), { statusCode: 409 });
    }

    const answerIds = answers.map((answer) => answer.questionId);
    if (new Set(answerIds).size !== answerIds.length) {
      const error: any = new Error('Each quiz question may only be answered once');
      error.statusCode = 400;
      throw error;
    }

    if (answers.some((answer) => !questions.some((question) => question.id === answer.questionId))) {
      const error: any = new Error('One or more answers do not belong to this module');
      error.statusCode = 400;
      throw error;
    }

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    if (answers.some(ans => {
      const q = questionMap.get(ans.questionId)!;
      return !Number.isInteger(ans.selectedIndex) || ans.selectedIndex < 0 ||
        !Array.isArray(q.options) || ans.selectedIndex >= q.options.length;
    })) {
      const error: any = new Error('Selected option is outside the question options');
      error.statusCode = 400;
      throw error;
    }

    let score = 0;
    const submitted = new Map(answers.map(ans => [ans.questionId, ans.selectedIndex]));
    const processedAnswers = questions.map((q) => {
      const selected = submitted.get(q.id) ?? null;
      const isCorrect = selected !== null && q.correctIndex === selected;
      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        selected,
        isCorrect,
        correctIndex: q?.correctIndex ?? -1,
        explanation: q?.explanation ?? '',
      };
    });

    const totalQuestions = questions.length;
    const scorePercent = Math.floor((score / totalQuestions) * 1000) / 10;

    // Display rounding must not turn a score below 70% into a pass.
    const passed = score * 100 >= totalQuestions * 70;

      const existingProgress = await tx.userModuleProgress.findUnique({
        where: { userId_moduleId: { userId, moduleId } },
      });
      const firstCompletion = passed && existingProgress?.status !== ModuleStatus.COMPLETED;
      const xpEarned = firstCompletion ? score * 10 : 0;

      const attempt = await tx.userQuizAttempt.create({
        data: {
          userId,
          moduleId,
          requestId,
          requestHash: requestId ? requestHash : undefined,
          score,
          totalQuestions,
          answers: processedAnswers as Prisma.InputJsonValue,
          timeTaken: timeTaken ?? null,
        },
      });

      await tx.userModuleProgress.upsert({
        where: { userId_moduleId: { userId, moduleId } },
        create: {
          userId,
          moduleId,
          status: passed ? ModuleStatus.COMPLETED : ModuleStatus.IN_PROGRESS,
          progressPercent: passed ? 100 : Math.max(1, Math.floor(scorePercent)),
          completedAt: passed ? new Date() : null,
          startedAt: new Date(),
        },
        update: passed
          ? { status: ModuleStatus.COMPLETED, progressPercent: 100, completedAt: existingProgress?.completedAt ?? new Date() }
          : existingProgress?.status === ModuleStatus.COMPLETED
            ? {}
            : { status: ModuleStatus.IN_PROGRESS, progressPercent: Math.max(existingProgress?.progressPercent ?? 0, Math.floor(scorePercent)) },
      });

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



    const response = {
      attemptId: attempt.id,
      score,
      totalQuestions,
      scorePercent,
      xpEarned,
      passed,
      results: processedAnswers,
    };
    if (requestId) await tx.userQuizAttempt.update({ where: { id: attempt.id }, data: { response: response as Prisma.InputJsonValue } });
    return response;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error: any) {
      if (requestId && retry < 2 && ['P2002', 'P2034'].includes(error.code)) continue;
      throw error;
    }
    }
  }
}

export const quizService = new QuizService();
