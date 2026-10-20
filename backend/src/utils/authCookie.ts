import { Request, Response, CookieOptions } from 'express';
import { env } from '../config/env';
import { refreshTokenExpiresAt } from './jwt';

export const refreshCookieName = env.NODE_ENV === 'production' ? '__Secure-sumaryjp_refresh' : 'sumaryjp_refresh';
const options: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.REFRESH_COOKIE_SAME_SITE,
  path: '/api/v1/auth',
};
export function readRefreshCookie(req: Request): string | undefined {
  const value = req.headers.cookie?.split(';').map(part => part.trim())
    .find(part => part.startsWith(`${refreshCookieName}=`))?.slice(refreshCookieName.length + 1);
  if (!value) return undefined;
  try { return decodeURIComponent(value); } catch { return undefined; }
}
export function setRefreshCookie(res: Response, token: string) {
  res.cookie(refreshCookieName, token, { ...options, expires: refreshTokenExpiresAt(token) });
}
export function clearRefreshCookie(res: Response) { res.clearCookie(refreshCookieName, options); }
