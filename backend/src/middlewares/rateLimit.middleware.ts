import { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/response';
import { env } from '../config/env';
import { consumeDatabaseLimit } from './databaseRateLimit';

type Bucket = { count: number; resetAt: number };

export function createRateLimiter(options: { windowMs: number; max: number; keyPrefix: string;
  consume?: (key: string, windowMs: number) => Promise<Bucket> }) {
  const buckets = new Map<string, Bucket>();

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const now = Date.now();
      const key = `${options.keyPrefix}:${req.ip || req.socket.remoteAddress || 'unknown'}`;
      const current = buckets.get(key);
      let bucket = !current || current.resetAt <= now
        ? { count: 0, resetAt: now + options.windowMs }
        : current;

      const consume = options.consume ?? (env.NODE_ENV === 'production' ? consumeDatabaseLimit : undefined);
      if (consume) bucket = await consume(key, options.windowMs);
      else { bucket.count += 1; buckets.set(key, bucket); }
      res.setHeader('RateLimit-Limit', options.max);
      res.setHeader('RateLimit-Remaining', Math.max(0, options.max - bucket.count));
      res.setHeader('RateLimit-Reset', Math.ceil(bucket.resetAt / 1000));

      if (bucket.count > options.max) {
        res.setHeader('Retry-After', Math.ceil((bucket.resetAt - now) / 1000));
        sendError(res, 'Too many requests. Please try again later.', 429);
        return;
      }

      if (buckets.size > 5000) {
        for (const [bucketKey, value] of buckets) {
          if (value.resetAt <= now) buckets.delete(bucketKey);
        }
      }
      next();
    } catch (error) { next(error); } // Fail closed when the shared store is unavailable.
  };
}
