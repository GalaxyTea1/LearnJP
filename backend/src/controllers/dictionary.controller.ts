import { Request, Response, NextFunction } from 'express';
import { dictionaryService } from '../services/dictionary.service';
import { sendSuccess } from '../utils/response';

export class DictionaryController {
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = String(req.query.q || '');
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const data = await dictionaryService.search(q, limit, req.user?.id);
      sendSuccess(res, data, 'Dictionary search completed');
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new Error('Not authenticated');
      }
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const data = await dictionaryService.getSearchHistory(req.user.id, limit);
      sendSuccess(res, data, 'Search history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const dictionaryController = new DictionaryController();
