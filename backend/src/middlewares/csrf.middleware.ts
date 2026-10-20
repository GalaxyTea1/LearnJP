import { Request, Response, NextFunction } from 'express';
import { allowedOrigins } from '../config/cors';
import { sendError } from '../utils/response';

// A custom header forces a CORS preflight; an attacker cannot submit a simple
// cross-origin form to use or replace the HttpOnly refresh cookie.
export function protectAuthMutation(req: Request, res: Response, next: NextFunction): void {
  const origin = req.get('Origin');
  if (req.get('X-Requested-With') !== 'SumaryJP' || (origin && !allowedOrigins.includes(origin))) {
    sendError(res, 'Untrusted authentication request', 403);
    return;
  }
  next();
}
