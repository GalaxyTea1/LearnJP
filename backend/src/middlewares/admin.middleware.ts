import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { sendError } from '../utils/response';

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.MODERATOR) {
    sendError(res, 'Access denied: Admin or Moderator privileges required', 403);
    return;
  }

  next();
};
