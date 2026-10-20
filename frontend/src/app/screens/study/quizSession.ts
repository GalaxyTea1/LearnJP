import type { QuizQuestionItem } from './types';

export interface SubmittedResult {
  score: number;
  totalQuestions: number;
  scorePercent: number;
  passed: boolean;
  xpEarned?: number;
  results?: Array<{ questionId: number; selected: number | null; isCorrect: boolean; correctIndex: number; explanation: string }>;
}

export interface QuizSession {
  answers: Record<number, number>;
  index: number;
  seconds: number;
  result: SubmittedResult | null;
  submission?: { requestId: string; seconds: number };
}

export const emptyQuizSession = (): QuizSession => ({ answers: {}, index: 0, seconds: 0, result: null });
export const quizSessionKey = (moduleId: number, userId?: number) => `study_quiz_v1_${moduleId}_${userId ?? 'guest'}`;
// Include wording and option order: reusing a question ID must not reuse an old answer.
export const quizRevision = (questions: QuizQuestionItem[], serverRevision?: string) => JSON.stringify([serverRevision ?? null, questions.map(q => [q.id, q.question, q.options, q.points])]);

export function decodeQuizSession(raw: string | null, revision: string, questions: QuizQuestionItem[]): QuizSession | null {
  try {
    const saved = JSON.parse(raw || 'null');
    if (!saved || saved.version !== 1 || saved.revision !== revision) return null;
    const s = saved.session;
    if (!s || !s.answers || typeof s.answers !== 'object' || Array.isArray(s.answers) ||
      !Number.isInteger(s.index) || s.index < 0 || s.index >= questions.length ||
      !Number.isSafeInteger(s.seconds) || s.seconds < 0) return null;
    for (const [id, answer] of Object.entries(s.answers)) {
      const question = questions.find(q => String(q.id) === id);
      if (!question || !Number.isInteger(answer) || (answer as number) < 0 || (answer as number) >= question.options.length) return null;
    }
    if (s.submission && (typeof s.submission.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s.submission.requestId) || !Number.isSafeInteger(s.submission.seconds) || s.submission.seconds < 0)) return null;
    if (s.result !== null) {
      const r = s.result;
      if (!r || typeof r.passed !== 'boolean' || !Number.isInteger(r.score) || r.score < 0 || r.score > questions.length ||
        r.totalQuestions !== questions.length || !Number.isFinite(r.scorePercent) || r.scorePercent < 0 || r.scorePercent > 100 ||
        (r.xpEarned !== undefined && (!Number.isFinite(r.xpEarned) || r.xpEarned < 0)) || !Array.isArray(r.results) ||
        r.results.length !== questions.length || new Set(r.results.map((item: { questionId: number }) => item?.questionId)).size !== questions.length) return null;
      for (const item of r.results) {
        const q = questions.find(q => q.id === item?.questionId);
        if (!q || typeof item.isCorrect !== 'boolean' || typeof item.explanation !== 'string' ||
          !Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex >= q.options.length ||
          (item.selected !== null && (!Number.isInteger(item.selected) || item.selected < 0 || item.selected >= q.options.length))) return null;
      }
    }
    return s;
  } catch { return null; }
}

export function encodeQuizSession(session: QuizSession, revision: string) {
  return JSON.stringify({ version: 1, revision, session });
}
