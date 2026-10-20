import { Request, Response, NextFunction } from 'express';
import { kanaService } from '../services/kana.service';
import { sendSuccess } from '../utils/response';
import { KanaType } from '@prisma/client';

export class KanaController {
  async getMyProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const type = req.query.kanaType as KanaType | undefined;
      const data = await kanaService.getMyKanaProgress(req.user.id, type);
      sendSuccess(res, data, 'Kana learning progress retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const data = await kanaService.updateKanaProgress(req.user.id, req.body);
      sendSuccess(res, data, 'Kana character progress updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const kanaController = new KanaController();
