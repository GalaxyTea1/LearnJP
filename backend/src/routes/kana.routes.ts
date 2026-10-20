import { Router } from 'express';
import { kanaController } from '../controllers/kana.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { updateKanaProgressSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate); // All kana progress routes require authentication

router.get('/progress', kanaController.getMyProgress);
router.post('/progress', validate(updateKanaProgressSchema), kanaController.updateProgress);

export default router;
