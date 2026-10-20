import { contentPreview } from '../services/publication';
import { Request, Response, NextFunction } from 'express';
import { kanjiService } from '../services/kanji.service';
import { sendSuccess } from '../utils/response';

export class KanjiController {
  async getKanji(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, moduleId, level } = req.query;
      const data = await kanjiService.getKanji({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search ? String(search) : undefined,
        moduleId: moduleId ? Number(moduleId) : undefined,
        level: level ? String(level) : undefined,
      }, contentPreview(req));
      sendSuccess(res, data.items, 'Kanji retrieved successfully', 200, data.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getKanjiById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await kanjiService.getKanjiById(id, contentPreview(req));
      sendSuccess(res, data, `Kanji #${id} retrieved successfully`);
    } catch (error) {
      next(error);
    }
  }

  async getKanjiByChar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const character = String(req.params.character);
      const data = await kanjiService.getKanjiByChar(character, contentPreview(req));
      sendSuccess(res, data, `Kanji '${character}' retrieved successfully`);
    } catch (error) {
      next(error);
    }
  }

  async createKanji(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await kanjiService.createKanji(req.body);
      sendSuccess(res, data, 'Kanji created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateKanji(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await kanjiService.updateKanji(id, req.body);
      sendSuccess(res, data, 'Kanji updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteKanji(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await kanjiService.deleteKanji(id);
      sendSuccess(res, null, 'Kanji deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const kanjiController = new KanjiController();
