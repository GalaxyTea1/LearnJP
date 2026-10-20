import { contentPreview } from '../services/publication';
import { Request, Response, NextFunction } from 'express';
import { quizService } from '../services/quiz.service';
import { sendSuccess } from '../utils/response';

export class QuizController {
  async getQuestionsByModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const moduleId = Number(req.params.moduleId);
      const data = await quizService.getQuestionsByModule(moduleId, contentPreview(req));
      sendSuccess(res, data.questions, `Quiz questions for Module #${moduleId} retrieved successfully`, 200, { quizRevision: data.quizRevision });
    } catch (error) {
      next(error);
    }
  }

  async createQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await quizService.createQuestion(req.body);
      sendSuccess(res, data, 'Quiz question created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await quizService.deleteQuestion(id);
      sendSuccess(res, null, 'Quiz question deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async submitQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new Error('User must be authenticated to submit quiz');
      }
      const { moduleId, answers, timeTaken, quizRevision, requestId } = req.body;
      const data = await quizService.submitQuiz(req.user.id, moduleId, answers, timeTaken, quizRevision, requestId);
      sendSuccess(res, data, 'Quiz submitted and graded successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const quizController = new QuizController();
