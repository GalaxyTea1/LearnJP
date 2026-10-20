import { Router } from 'express';
import { historyController } from '../controllers/history.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate); // All history routes require authentication

router.get('/search', historyController.getSearchHistory);
router.delete('/search', historyController.clearSearchHistory);

router.post('/translation', historyController.recordTranslation);
router.get('/translation', historyController.getTranslationHistory);
router.delete('/translation', historyController.clearTranslationHistory);

export default router;
