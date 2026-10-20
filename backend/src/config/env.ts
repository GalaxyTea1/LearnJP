import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must contain at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().regex(/^[1-9]\d*(s|m|h|d)$/).default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().regex(/^[1-9]\d*(s|m|h|d)$/).default('7d'),
  DATABASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  REFRESH_COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  TRUST_PROXY: z.coerce.number().int().min(0).max(10).default(0),
}).superRefine((env, ctx) => {
  const origin = new URL(env.FRONTEND_URL);
  if (origin.origin !== env.FRONTEND_URL || (env.NODE_ENV === 'production' && origin.protocol !== 'https:')) {
    ctx.addIssue({ code: 'custom', path: ['FRONTEND_URL'], message: 'Use an exact frontend origin; production requires HTTPS' });
  }
  if (env.REFRESH_COOKIE_SAME_SITE === 'none' && env.NODE_ENV !== 'production') {
    ctx.addIssue({ code: 'custom', path: ['REFRESH_COOKIE_SAME_SITE'], message: 'SameSite=None requires production HTTPS cookies' });
  }
  if (env.NODE_ENV === 'production' && /localhost|127\.0\.0\.1/i.test(env.FRONTEND_URL)) {
    ctx.addIssue({
      code: 'custom',
      path: ['FRONTEND_URL'],
      message: 'FRONTEND_URL must point to the deployed frontend in production',
    });
  }
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
