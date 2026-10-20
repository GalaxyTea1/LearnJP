import { optionalAuthenticate } from '../middlewares/optionalAuth.middleware';
import { Router } from 'express';
import { vocabularyController } from '../controllers/vocabulary.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { createVocabSchema } from '../validators/content.validator';
import { idParamSchema } from '../validators/common.validator';
import { z } from 'zod';

const router = Router();

const bulkSchema = z.object({
  body: z.object({
    items: z.array(createVocabSchema.shape.body).min(1),
  }),
});

router.get('/', optionalAuthenticate, vocabularyController.getVocabulary);
router.get('/:id', optionalAuthenticate, validate(idParamSchema), vocabularyController.getVocabularyById);
router.post('/', authenticate, requireAdmin, validate(createVocabSchema), vocabularyController.createVocabulary);
router.post('/bulk', authenticate, requireAdmin, validate(bulkSchema), vocabularyController.bulkCreateVocabulary);
router.put('/:id', authenticate, requireAdmin, validate(idParamSchema), vocabularyController.updateVocabulary);
router.delete('/:id', authenticate, requireAdmin, validate(idParamSchema), vocabularyController.deleteVocabulary);

export default router;
