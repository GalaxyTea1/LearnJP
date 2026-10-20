import { Router } from 'express';
import { gamificationController } from '../controllers/gamification.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { optionalAuthenticate } from '../middlewares/optionalAuth.middleware';

const router = Router();

router.get('/leaderboard', optionalAuthenticate, gamificationController.getLeaderboard);
router.get('/me', authenticate, gamificationController.getMyStats);
router.post('/checkin', authenticate, gamificationController.recordDailyCheckIn);

export default router;
