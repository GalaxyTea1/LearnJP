import { Router } from 'express';
import { announcementController } from '../controllers/announcement.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();

// Public routes
router.get('/active', announcementController.getActive);
router.get('/all', announcementController.getAll);

// Admin-protected routes
router.post('/', authenticate, requireAdmin, announcementController.create);
router.put('/:id', authenticate, requireAdmin, announcementController.update);
router.delete('/:id', authenticate, requireAdmin, announcementController.delete);

export default router;
