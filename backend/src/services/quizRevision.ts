import { createHmac } from 'node:crypto';
import { env } from '../config/env';

type RevisionQuestion = { id: number; question?: string; options: unknown; correctIndex: number; explanation?: string | null; questionType?: string; points?: number };
// Keyed digest includes private grading data without exposing a brute-forceable
// hash of a small set of possible answers. Bind the digest to its module.
export function quizRevision(moduleId: number, questions: RevisionQuestion[]) {
  const content = [...questions].sort((a, b) => a.id - b.id).map(q =>
    [q.id, q.question, q.options, q.correctIndex, q.explanation, q.questionType, q.points]);
  return createHmac('sha256', env.JWT_SECRET).update(JSON.stringify(['quiz-v1', moduleId, content])).digest('hex');
}
export function publicQuizQuestions<T extends { correctIndex: number; explanation?: string | null }>(questions: T[]) {
  return questions.map(({ correctIndex, explanation, ...question }) => question);
}
