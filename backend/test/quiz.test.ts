import { quizRevision, publicQuizQuestions } from '../src/services/quizRevision';
import assert from 'node:assert/strict';
import test from 'node:test';
import { prisma } from '../src/config/prisma';
import { QuizService } from '../src/services/quiz.service';

// No database writes: exercise the service's actual grading and transaction
// payloads with a minimal Prisma boundary stub.
test('quiz grading, completion and validation', async (t) => {
  const originalFind = prisma.quizQuestion.findMany;
  const originalTransaction = prisma.$transaction;
  let questions: any[] = [];
  let progress: any = null;
  let lastWrite: any;
  let xpWrites = 0;
  let transactions = 0;
  (prisma.quizQuestion as any).findMany = async () => questions;
  (prisma as any).$transaction = async (work: any) => {
    transactions++;
    return work({
      quizQuestion: { findMany: async () => questions },
      userModuleProgress: {
        findUnique: async () => progress,
        upsert: async (input: any) => { lastWrite = input; return input; },
      },
      userQuizAttempt: { create: async () => ({ id: 1 }) },
      userGamification: { upsert: async () => { xpWrites++; } },
    });
  };
  const service = new QuizService();
  const submit = (user: number, module: number, answers: { questionId: number; selectedIndex: number }[], seconds?: number) => service.submitQuiz(user, module, answers, seconds, quizRevision(module, questions));
  const setup = (count = 10) => {
    questions = Array.from({ length: count }, (_, i) => ({ id: i + 1, correctIndex: 0, options: ['正解', '不正解'], explanation: `Explanation ${i + 1}` }));
    progress = null; lastWrite = null; xpWrites = 0; transactions = 0;
  };
  try {
    await t.test('7/10 passes and returns explanations for skipped questions', async () => {
      setup();
      const result = await submit(1, 2, questions.slice(0, 7).map(q => ({ questionId: q.id, selectedIndex: 0 })), 20);
      assert.equal(result.passed, true);
      assert.equal(result.score, 7);
      assert.equal(result.results.length, 10);
      assert.deepEqual(result.results[9], { questionId: 10, selected: null, isCorrect: false, correctIndex: 0, explanation: 'Explanation 10' });
      assert.equal(lastWrite.create.status, 'COMPLETED');
      assert.equal(lastWrite.create.progressPercent, 100);
      assert.equal(xpWrites, 1);
    });
    await t.test('6/10 fails without awarding XP', async () => {
      setup();
      const result = await submit(1, 2, questions.slice(0, 6).map(q => ({ questionId: q.id, selectedIndex: 0 })));
      assert.equal(result.passed, false);
      assert.equal(lastWrite.create.status, 'IN_PROGRESS');
      assert.equal(xpWrites, 0);
    });
    await t.test('rounded 70 percent does not pass an actual score below 70 percent', async () => {
      setup(33);
      const result = await submit(1, 2, questions.slice(0, 23).map(q => ({ questionId: q.id, selectedIndex: 0 })));
      assert.equal(result.scorePercent, 69.6);
      assert.equal(result.passed, false);
    });
    await t.test('repeated pass awards no additional XP; failed retake preserves completion', async () => {
      setup(); progress = { status: 'COMPLETED', progressPercent: 100, completedAt: new Date() };
      await submit(1, 2, questions.map(q => ({ questionId: q.id, selectedIndex: 0 })));
      assert.equal(xpWrites, 0);
      await submit(1, 2, [{ questionId: 1, selectedIndex: 1 }]);
      assert.deepEqual(lastWrite.update, {});
    });
    await t.test('invalid question, duplicate and out-of-range choices never write attempts', async () => {
      setup();
      for (const answers of [
        [{ questionId: 99, selectedIndex: 0 }],
        [{ questionId: 1, selectedIndex: 0 }, { questionId: 1, selectedIndex: 1 }],
        [{ questionId: 1, selectedIndex: 2 }],
        [{ questionId: 1, selectedIndex: -1 }],
      ]) await assert.rejects(submit(1, 2, answers), (e: any) => e.statusCode === 400);
      assert.equal(lastWrite, null);
      assert.equal(xpWrites, 0);
    });
    await t.test('stale or missing revision never writes attempts, progress or XP', async () => {
      for (const change of ['order', 'answer', 'wording', 'added', 'removed', 'explanation']) {
        setup(); const revision = quizRevision(2, questions);
        if (change === 'order') questions[0].options.reverse();
        if (change === 'answer') questions[0].correctIndex = 1;
        if (change === 'wording') questions[0].question = 'updated question';
        if (change === 'added') questions.push({ ...questions[0], id: 999 });
        if (change === 'removed') questions.pop();
        if (change === 'explanation') questions[0].explanation = 'updated explanation';
        let attempts = 0;
        const transaction = prisma.$transaction;
        (prisma as any).$transaction = async (work: any) => transaction(async (tx: any) => {
          tx.userQuizAttempt.create = async () => { attempts++; return { id: 1 }; };
          return work(tx);
        });
        try {
          for (const token of [revision, undefined, quizRevision(999, questions)]) {
            await assert.rejects(service.submitQuiz(1, 2, [{ questionId: 1, selectedIndex: 0 }], 10, token), (e: any) => e.statusCode === 409 && e.message === 'QUIZ_REVISION_CHANGED');
          }
          assert.equal(attempts, 0); assert.equal(lastWrite, null); assert.equal(xpWrites, 0);
        } finally { prisma.$transaction = transaction; }
      }
    });
    await t.test('revision is stable across fetch ordering and public data hides answers', () => {
      setup();
      assert.equal(quizRevision(2, questions), quizRevision(2, [...questions].reverse()));
      const exposed = publicQuizQuestions(questions);
      assert.ok(exposed.every(q => !('correctIndex' in q) && !('explanation' in q)));
    });
    await t.test('a module without quiz questions cannot complete', async () => {
      setup(0);
      await assert.rejects(submit(1, 2, []), (e: any) => e.statusCode === 404);
      assert.equal(lastWrite, null);
      assert.equal(xpWrites, 0);
    });
  } finally {
    prisma.quizQuestion.findMany = originalFind;
    prisma.$transaction = originalTransaction;
  }
});
