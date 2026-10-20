import { Request, Response, NextFunction } from 'express';
import { gamificationService } from '../services/gamification.service';
import { sendSuccess } from '../utils/response';

export class GamificationController {
  async getMyStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const data = await gamificationService.getMyStats(req.user.id);
      sendSuccess(res, data, 'Gamification stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async recordDailyCheckIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const data = await gamificationService.recordDailyActivity(req.user.id);
      sendSuccess(res, data, 'Daily check-in recorded successfully');
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const data = await gamificationService.getLeaderboard(limit);
      sendSuccess(res, data, 'XP Leaderboard retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const gamificationController = new GamificationController();
