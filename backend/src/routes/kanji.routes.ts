import { optionalAuthenticate } from '../middlewares/optionalAuth.middleware';
import { Router } from 'express';
import { kanjiController } from '../controllers/kanji.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { createKanjiSchema } from '../validators/content.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.get('/', optionalAuthenticate, kanjiController.getKanji);
router.get('/char/:character', optionalAuthenticate, kanjiController.getKanjiByChar);
router.get('/:id', optionalAuthenticate, validate(idParamSchema), kanjiController.getKanjiById);
router.post('/', authenticate, requireAdmin, validate(createKanjiSchema), kanjiController.createKanji);
router.put('/:id', authenticate, requireAdmin, validate(idParamSchema), kanjiController.updateKanji);
router.delete('/:id', authenticate, requireAdmin, validate(idParamSchema), kanjiController.deleteKanji);

export default router;
