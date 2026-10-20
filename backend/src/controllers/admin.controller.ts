import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { sendSuccess } from '../utils/response';

export class AdminController {
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getDashboardStats();
      sendSuccess(res, data, 'Admin dashboard stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const search = req.query.search ? String(req.query.search) : undefined;
      const data = await adminService.getAllUsers(page, limit, search);
      sendSuccess(res, data, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await adminService.updateUserStatus(id, req.body);
      sendSuccess(res, data, 'User status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getSiteSettings();
      sendSuccess(res, data, 'Site settings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key, value, description } = req.body;
      const data = await adminService.updateSiteSetting(key, value, description);
      sendSuccess(res, data, 'Site setting updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getActivityLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const action = req.query.action ? String(req.query.action) : undefined;
      const data = await adminService.getActivityLogs(page, limit, userId, action);
      sendSuccess(res, data, 'Activity logs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
