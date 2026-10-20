import { optionalAuthenticate } from '../middlewares/optionalAuth.middleware';
import { Router } from 'express';
import { grammarController } from '../controllers/grammar.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { createGrammarSchema } from '../validators/content.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.get('/', optionalAuthenticate, grammarController.getGrammar);
router.get('/:id', optionalAuthenticate, validate(idParamSchema), grammarController.getGrammarById);
router.post('/', authenticate, requireAdmin, validate(createGrammarSchema), grammarController.createGrammar);
router.put('/:id', authenticate, requireAdmin, validate(idParamSchema), grammarController.updateGrammar);
router.delete('/:id', authenticate, requireAdmin, validate(idParamSchema), grammarController.deleteGrammar);

export default router;
