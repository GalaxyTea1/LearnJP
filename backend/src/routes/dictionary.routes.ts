import { Router } from 'express';
import { dictionaryController } from '../controllers/dictionary.controller';
import { validate } from '../middlewares/validate.middleware';
import { optionalAuthenticate } from '../middlewares/optionalAuth.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { searchDictionarySchema } from '../validators/content.validator';
import { jishoQuerySchema, searchJisho } from '../services/jisho.service';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/jisho', validate(jishoQuerySchema), async (req, res, next) => {
  try { sendSuccess(res, await searchJisho(String(req.query.q))); }
  catch (error) { next(error); }
});

router.get('/search', optionalAuthenticate, validate(searchDictionarySchema), dictionaryController.search);
router.get('/history', authenticate, dictionaryController.getHistory);

export default router;
