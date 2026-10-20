import jwt from 'jsonwebtoken';
import { createHash, randomUUID } from 'node:crypto';
import { env } from '../config/env';
import { TokenPayload } from '../types';

type BaseTokenPayload = Omit<TokenPayload, 'tokenType'>;

export const generateAccessToken = (payload: BaseTokenPayload): string => {
  return jwt.sign({ ...payload, tokenType: 'access' }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    issuer: 'sumaryjp-api',
    audience: 'sumaryjp-web',
  });
};

export const generateRefreshToken = (payload: BaseTokenPayload): string => {
  return jwt.sign({ ...payload, tokenType: 'refresh' }, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    issuer: 'sumaryjp-api',
    audience: 'sumaryjp-refresh',
    jwtid: randomUUID(),
  });
};

const verifyToken = (token: string, expectedType: TokenPayload['tokenType']): TokenPayload | null => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'sumaryjp-api',
      audience: expectedType === 'access' ? 'sumaryjp-web' : 'sumaryjp-refresh',
      algorithms: ['HS256'],
    }) as TokenPayload;
    return payload.tokenType === expectedType ? payload : null;
  } catch (error) {
    return null;
  }
};

export const verifyAccessToken = (token: string) => verifyToken(token, 'access');
export const verifyRefreshToken = (token: string) => verifyToken(token, 'refresh');

export const hashRefreshToken = (token: string): string => createHash('sha256').update(token).digest('hex');
export const refreshTokenExpiresAt = (token: string): Date => {
  const payload = jwt.decode(token) as jwt.JwtPayload;
  if (!payload.exp) throw new Error('Refresh token expiry missing');
  return new Date(payload.exp * 1000);
};
