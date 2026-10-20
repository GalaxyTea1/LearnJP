import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();

router.use(authenticate, requireAdmin); // All admin routes require admin/moderator auth

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);

router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSetting);

router.get('/logs', adminController.getActivityLogs);

export default router;
