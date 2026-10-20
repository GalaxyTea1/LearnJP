import { contentPreview } from '../services/publication';
import { Request, Response, NextFunction } from 'express';
import { levelService } from '../services/level.service';
import { sendSuccess } from '../utils/response';

export class LevelController {
  async getAllLevels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const levels = await levelService.getAllLevels(req.user?.id, contentPreview(req));
      sendSuccess(res, levels, 'JLPT levels retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getLevelByCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const level = String(req.params.level || '');
      const data = await levelService.getLevelByCode(level, req.user?.id, contentPreview(req));
      sendSuccess(res, data, `JLPT Level ${level} retrieved successfully`);
    } catch (error) {
      next(error);
    }
  }

  async createLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await levelService.createLevel(req.body);
      sendSuccess(res, data, 'JLPT level created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await levelService.updateLevel(id, req.body);
      sendSuccess(res, data, 'JLPT level updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const levelController = new LevelController();
