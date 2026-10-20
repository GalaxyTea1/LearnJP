import { Router } from 'express';
import { flashcardController } from '../controllers/flashcard.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { srsReviewSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate); // All flashcard routes require authentication

router.get('/due', flashcardController.getDueReviews);
router.post('/review', validate(srsReviewSchema), flashcardController.submitReview);
router.get('/stats', flashcardController.getStats);

export default router;
