import { Request, Response, NextFunction } from 'express';
import { flashcardService } from '../services/flashcard.service';
import { sendSuccess } from '../utils/response';
import { SrsItemType } from '@prisma/client';

export class FlashcardController {
  async getDueReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const itemType = req.query.itemType as SrsItemType | undefined;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const data = await flashcardService.getDueReviews(req.user.id, itemType, limit);
      sendSuccess(res, data, 'Due SRS reviews retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async submitReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const { itemType, itemId, quality } = req.body;
      const data = await flashcardService.submitReview(req.user.id, itemType, itemId, quality);
      sendSuccess(res, data, 'SRS review submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new Error('Not authenticated');
      const data = await flashcardService.getSrsStats(req.user.id);
      sendSuccess(res, data, 'SRS statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const flashcardController = new FlashcardController();
