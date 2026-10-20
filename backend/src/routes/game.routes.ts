import { Router } from 'express';
import { gameController } from '../controllers/game.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { optionalAuthenticate } from '../middlewares/optionalAuth.middleware';
import { submitGameScoreSchema } from '../validators/user.validator';

const router = Router();

router.get('/leaderboard', optionalAuthenticate, gameController.getLeaderboard);
router.post('/score', authenticate, validate(submitGameScoreSchema), gameController.submitScore);
router.get('/history', authenticate, gameController.getMyHistory);

export default router;
