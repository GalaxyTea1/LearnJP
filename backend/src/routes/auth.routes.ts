import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { protectAuthMutation } from '../middlewares/csrf.middleware';
import { createRateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();
const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 30, keyPrefix: 'auth' });
const loginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: 'login' });

router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
router.post('/register', protectAuthMutation, authLimiter, validate(registerSchema), authController.register);
router.post('/login', protectAuthMutation, loginLimiter, validate(loginSchema), authController.login);
router.post('/refresh', protectAuthMutation, authLimiter, authController.refresh);
router.post('/logout', protectAuthMutation, authLimiter, authController.logout);
router.get('/me', authenticate, authController.me);

export default router;
