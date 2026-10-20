import { createHash } from 'node:crypto';
import { prisma } from '../config/prisma';

let nextCleanup = 0;
export async function consumeDatabaseLimit(key: string, windowMs: number) {
  const digest = createHash('sha256').update(key).digest('hex');
  const [bucket] = await prisma.$queryRaw<Array<{ count: number; resetAt: Date }>>`
    INSERT INTO auth_rate_limits (key, count, reset_at)
    VALUES (${digest}, 1, clock_timestamp() + ${windowMs} * interval '1 millisecond')
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN auth_rate_limits.reset_at <= clock_timestamp() THEN 1 ELSE auth_rate_limits.count + 1 END,
      reset_at = CASE WHEN auth_rate_limits.reset_at <= clock_timestamp()
        THEN clock_timestamp() + ${windowMs} * interval '1 millisecond' ELSE auth_rate_limits.reset_at END
    RETURNING count, reset_at AS "resetAt"
  `;
  if (Date.now() >= nextCleanup) {
    nextCleanup = Date.now() + 60_000;
    // Cleanup does not affect the decision for the current request.
    void prisma.$executeRaw`DELETE FROM auth_rate_limits WHERE reset_at < clock_timestamp()`
      .catch(() => { nextCleanup = 0; });
  }
  return { count: bucket.count, resetAt: bucket.resetAt.getTime() };
}
