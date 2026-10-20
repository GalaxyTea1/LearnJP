import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { prisma } from '../config/prisma';
import { readRefreshCookie, setRefreshCookie, clearRefreshCookie } from '../utils/authCookie';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      const { refreshToken, ...session } = result;
      setRefreshCookie(res, refreshToken);
      sendSuccess(res, session, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { login, password } = req.body;
      const result = await authService.login(login, password);
      const { refreshToken, ...session } = result;
      setRefreshCookie(res, refreshToken);
      sendSuccess(res, session, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = readRefreshCookie(req);
      if (!refreshToken) { res.status(401).json({ success: false, message: 'Refresh cookie missing' }); return; }
      const result = await authService.refresh(refreshToken);
      setRefreshCookie(res, result.refreshToken);
      sendSuccess(res, { accessToken: result.accessToken }, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = readRefreshCookie(req);
      if (refreshToken) await authService.logout(refreshToken);
      clearRefreshCookie(res);
      sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new Error('Not authenticated');
      }

      const fullUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          role: true,
          currentStreak: true,
          lastStudyDate: true,
          createdAt: true,
          learningSettings: true,
          gamification: {
            select: {
              xp: true,
              totalXpEarned: true,
              streak: true,
              badges: true,
              stats: true,
            },
          },
        },
      });

      sendSuccess(res, fullUser, 'User profile retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
