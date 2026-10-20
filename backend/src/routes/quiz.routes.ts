import { optionalAuthenticate } from '../middlewares/optionalAuth.middleware';
import { Router } from 'express';
import { quizController } from '../controllers/quiz.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { createQuizSchema, submitQuizSchema } from '../validators/content.validator';
import { idParamSchema } from '../validators/common.validator';
import { z } from 'zod';

const router = Router();

const moduleParamSchema = z.object({
  params: z.object({
    moduleId: z.coerce.number().int().positive(),
  }),
});

router.get('/module/:moduleId', optionalAuthenticate, validate(moduleParamSchema), quizController.getQuestionsByModule);
router.post('/', authenticate, requireAdmin, validate(createQuizSchema), quizController.createQuestion);
router.delete('/:id', authenticate, requireAdmin, validate(idParamSchema), quizController.deleteQuestion);
router.post('/submit', authenticate, validate(submitQuizSchema), quizController.submitQuiz);

export default router;
