import { Request, Response, NextFunction } from 'express';
import { historyService } from '../services/history.service';
import { sendSuccess } from '../utils/response';

export class HistoryController {
  async getSearchHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const data = await historyService.getSearchHistory(req.user.id, limit);
      sendSuccess(res, data, 'Search history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async clearSearchHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      await historyService.clearSearchHistory(req.user.id);
      sendSuccess(res, null, 'Search history cleared successfully');
    } catch (error) {
      next(error);
    }
  }

  async recordTranslation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const data = await historyService.recordTranslation(req.user.id, req.body);
      sendSuccess(res, data, 'Translation recorded successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTranslationHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const data = await historyService.getTranslationHistory(req.user.id, limit);
      sendSuccess(res, data, 'Translation history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async clearTranslationHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      await historyService.clearTranslationHistory(req.user.id);
      sendSuccess(res, null, 'Translation history cleared successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const historyController = new HistoryController();
