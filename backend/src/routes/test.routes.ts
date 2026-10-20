import { Router } from 'express';
import { testController } from '../controllers/test.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { optionalAuthenticate } from '../middlewares/optionalAuth.middleware';

const router = Router();

router.get('/templates', optionalAuthenticate, testController.getTemplates);
router.get('/templates/:id', optionalAuthenticate, testController.getTemplateById);

router.post('/attempts', authenticate, testController.startAttempt);
router.post('/attempts/:attemptId/submit', authenticate, testController.submitAttempt);
router.get('/attempts', authenticate, testController.getMyAttempts);

export default router;
