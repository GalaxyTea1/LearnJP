import { Request, Response, NextFunction } from 'express';
import { announcementService } from '../services/announcement.service';
import { sendSuccess } from '../utils/response';

export class AnnouncementController {
  async getActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await announcementService.getActiveAnnouncements();
      sendSuccess(res, data, 'Active announcements retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await announcementService.getAllAnnouncements();
      sendSuccess(res, data, 'All announcements retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = { ...req.body, createdBy: req.user?.id };
      const data = await announcementService.createAnnouncement(payload);
      sendSuccess(res, data, 'Announcement created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data = await announcementService.updateAnnouncement(id, req.body);
      sendSuccess(res, data, 'Announcement updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await announcementService.deleteAnnouncement(id);
      sendSuccess(res, null, 'Announcement deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const announcementController = new AnnouncementController();
