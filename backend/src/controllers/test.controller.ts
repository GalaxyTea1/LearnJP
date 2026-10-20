import { Request, Response, NextFunction } from 'express';
import { testService } from '../services/test.service';
import { sendSuccess } from '../utils/response';

export class TestController {
  async getTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const level = req.query.level ? String(req.query.level) : undefined;
      const data = await testService.getTemplates(level);
      sendSuccess(res, data, 'Test templates retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTemplateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await testService.getTemplateById(id);
      sendSuccess(res, data, 'Test template details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async startAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const templateId = Number(req.params.templateId || req.body.templateId);
      const data = await testService.startAttempt(req.user.id, templateId);
      sendSuccess(res, data, 'Test attempt started successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async submitAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const attemptId = Number(req.params.attemptId || req.body.attemptId);
      const { answers } = req.body;
      const data = await testService.submitAttempt(req.user.id, attemptId, answers || []);
      sendSuccess(res, data, 'Test attempt submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyAttempts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const templateId = req.query.templateId ? Number(req.query.templateId) : undefined;
      const data = await testService.getMyAttempts(req.user.id, templateId);
      sendSuccess(res, data, 'User test attempts retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const testController = new TestController();
