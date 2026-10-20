import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { updateSettingsSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate); // All user profile & settings routes require auth

router.get('/dashboard', userController.getDashboard);
router.get('/settings', userController.getSettings);
router.put('/settings', validate(updateSettingsSchema), userController.updateSettings);

export default router;
