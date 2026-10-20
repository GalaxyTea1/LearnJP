import { z } from 'zod';

const password = z.string().max(72).refine(value => Buffer.byteLength(value, 'utf8') <= 72, {
  message: 'Password must be at most 72 UTF-8 bytes',
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Invalid email format').max(254),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores'),
    password: password.refine(value => value.length >= 8, 'Password must be at least 8 characters'),
    displayName: z.string().trim().min(1).max(80).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    login: z.string().trim().min(1, 'Username or email is required').max(254), // can be username or email
    password: password.refine(value => value.length > 0, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    displayName: z.string().optional(),
    avatarUrl: z.string().url().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: password.refine(value => value.length > 0, 'Current password is required'),
    newPassword: password.refine(value => value.length >= 8, 'New password must be at least 8 characters'),
  }),
});
