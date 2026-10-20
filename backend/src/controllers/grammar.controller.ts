import { contentPreview } from '../services/publication';
import { Request, Response, NextFunction } from 'express';
import { grammarService } from '../services/grammar.service';
import { sendSuccess } from '../utils/response';

export class GrammarController {
  async getGrammar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, moduleId, level } = req.query;
      const data = await grammarService.getGrammar({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search ? String(search) : undefined,
        moduleId: moduleId ? Number(moduleId) : undefined,
        level: level ? String(level) : undefined,
      }, contentPreview(req));
      sendSuccess(res, data.items, 'Grammar patterns retrieved successfully', 200, data.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getGrammarById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await grammarService.getGrammarById(id, contentPreview(req));
      sendSuccess(res, data, `Grammar pattern #${id} retrieved successfully`);
    } catch (error) {
      next(error);
    }
  }

  async createGrammar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await grammarService.createGrammar(req.body);
      sendSuccess(res, data, 'Grammar pattern created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateGrammar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await grammarService.updateGrammar(id, req.body);
      sendSuccess(res, data, 'Grammar pattern updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteGrammar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await grammarService.deleteGrammar(id);
      sendSuccess(res, null, 'Grammar pattern deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const grammarController = new GrammarController();
