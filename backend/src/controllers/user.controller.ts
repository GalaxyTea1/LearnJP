import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/response';

export class UserController {
  async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const data = await userService.getSettings(req.user.id);
      sendSuccess(res, data, 'User settings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const data = await userService.updateSettings(req.user.id, req.body);
      sendSuccess(res, data, 'User settings updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const data = await userService.getDashboardSummary(req.user.id);
      sendSuccess(res, data, 'User dashboard summary retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
