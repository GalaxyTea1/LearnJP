import { Request, Response, NextFunction } from 'express';
import { progressService } from '../services/progress.service';
import { sendSuccess } from '../utils/response';

export class ProgressController {
  async getMyProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const data = await progressService.getMyProgress(req.user.id);
      sendSuccess(res, data, 'User learning progress retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateModuleProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const data = await progressService.updateModuleProgress(req.user.id, req.body);
      sendSuccess(res, data, 'Module progress updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getReviewItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const limit = parseInt(req.query.limit as string) || 20;
      const data = await progressService.getReviewItems(req.user.id, limit);
      sendSuccess(res, data, 'Review items retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const progressController = new ProgressController();
