import { Router } from 'express';
import { moduleController } from '../controllers/module.controller';
import { validate } from '../middlewares/validate.middleware';
import { optionalAuthenticate } from '../middlewares/optionalAuth.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { createModuleSchema } from '../validators/content.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.get('/', optionalAuthenticate, moduleController.getModules);
router.get('/:id', optionalAuthenticate, validate(idParamSchema), moduleController.getModuleById);
router.get('/:id/full', optionalAuthenticate, validate(idParamSchema), moduleController.getModuleFullContent);
router.post('/', authenticate, requireAdmin, validate(createModuleSchema), moduleController.createModule);
router.put('/:id', authenticate, requireAdmin, validate(idParamSchema), moduleController.updateModule);
router.delete('/:id', authenticate, requireAdmin, validate(idParamSchema), moduleController.deleteModule);

export default router;
