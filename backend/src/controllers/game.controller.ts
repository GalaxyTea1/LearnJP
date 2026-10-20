import { Request, Response, NextFunction } from 'express';
import { gameService } from '../services/game.service';
import { sendSuccess } from '../utils/response';
import { GameType } from '@prisma/client';

export class GameController {
  async submitScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const data = await gameService.submitScore(req.user.id, req.body);
      sendSuccess(res, data, 'Game score submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameType = req.query.gameType as GameType | undefined;
      const limit = Math.min(100, Math.max(1, req.query.limit ? Number(req.query.limit) || 10 : 10));
      const data = await gameService.getLeaderboard(gameType, limit);
      sendSuccess(res, data, 'Game leaderboard retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const gameType = req.query.gameType as GameType | undefined;
      const limit = Math.min(100, Math.max(1, req.query.limit ? Number(req.query.limit) || 20 : 20));
      const data = await gameService.getMyHistory(req.user.id, gameType, limit);
      sendSuccess(res, data, 'User game history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const gameController = new GameController();
