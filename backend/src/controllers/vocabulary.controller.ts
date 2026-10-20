import { contentPreview } from '../services/publication';
import { Request, Response, NextFunction } from 'express';
import { vocabularyService } from '../services/vocabulary.service';
import { sendSuccess } from '../utils/response';
import { VocabType } from '@prisma/client';

export class VocabularyController {
  async getVocabulary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, moduleId, level, type } = req.query;
      const data = await vocabularyService.getVocabulary({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search ? String(search) : undefined,
        moduleId: moduleId ? Number(moduleId) : undefined,
        level: level ? String(level) : undefined,
        type: type as VocabType,
      }, contentPreview(req));
      sendSuccess(res, data.items, 'Vocabulary retrieved successfully', 200, data.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getVocabularyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await vocabularyService.getVocabularyById(id, contentPreview(req));
      sendSuccess(res, data, `Vocabulary #${id} retrieved successfully`);
    } catch (error) {
      next(error);
    }
  }

  async createVocabulary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await vocabularyService.createVocabulary(req.body);
      sendSuccess(res, data, 'Vocabulary created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateVocabulary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await vocabularyService.updateVocabulary(id, req.body);
      sendSuccess(res, data, 'Vocabulary updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteVocabulary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await vocabularyService.deleteVocabulary(id);
      sendSuccess(res, null, 'Vocabulary deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async bulkCreateVocabulary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = req.body.items;
      const data = await vocabularyService.bulkCreateVocabulary(items);
      sendSuccess(res, data, `${data.count} vocabulary items created successfully`, 201);
    } catch (error) {
      next(error);
    }
  }
}

export const vocabularyController = new VocabularyController();
