import { contentPreview } from '../services/publication';
import { Request, Response, NextFunction } from 'express';
import { moduleService } from '../services/module.service';
import { sendSuccess } from '../utils/response';

export class ModuleController {
  async getModules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const levelId = req.query.levelId ? Number(req.query.levelId) : undefined;
      const modules = await moduleService.getModules(levelId, req.user?.id, contentPreview(req));
      sendSuccess(res, modules, 'Learning modules retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getModuleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await moduleService.getModuleById(id, req.user?.id, contentPreview(req));
      sendSuccess(res, data, `Module #${id} retrieved successfully`);
    } catch (error) {
      next(error);
    }
  }

  async getModuleFullContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await moduleService.getModuleFullContent(id, req.user?.id, contentPreview(req));
      sendSuccess(res, data, `Module #${id} full content retrieved successfully`);
    } catch (error) {
      next(error);
    }
  }

  async createModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await moduleService.createModule(req.body);
      sendSuccess(res, data, 'Learning module created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await moduleService.updateModule(id, req.body);
      sendSuccess(res, data, 'Learning module updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await moduleService.deleteModule(id);
      sendSuccess(res, null, 'Learning module deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const moduleController = new ModuleController();
