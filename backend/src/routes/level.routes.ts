import { Router } from 'express';
import { levelController } from '../controllers/level.controller';
import { validate } from '../middlewares/validate.middleware';
import { optionalAuthenticate } from '../middlewares/optionalAuth.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { levelParamSchema, createLevelSchema } from '../validators/content.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.get('/', optionalAuthenticate, levelController.getAllLevels);
router.get('/:level', optionalAuthenticate, validate(levelParamSchema), levelController.getLevelByCode);
router.post('/', authenticate, requireAdmin, validate(createLevelSchema), levelController.createLevel);
router.put('/:id', authenticate, requireAdmin, validate(idParamSchema), levelController.updateLevel);

export default router;
