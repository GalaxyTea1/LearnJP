import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  logger.error(`${req.method} ${req.originalUrl} -> ${err.message || 'Unknown Error'}`, { stack: err.stack });

  if (err instanceof ZodError) {
    const issues = err.issues || (err as any).errors || [];
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: issues.map((e: any) => ({
        path: e.path ? e.path.join('.') : '',
        message: e.message,
      })),
    });
  }

  if (err.name === 'UnauthorizedError') {
    return sendError(res, 'Unauthorized access', 401);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode >= 500 && process.env.NODE_ENV === 'production'
    ? 'Internal Server Error' : err.message || 'Internal Server Error';

  return sendError(res, message, statusCode, err);
};
