import { prisma } from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, hashRefreshToken, refreshTokenExpiresAt } from '../utils/jwt';
import { UserRole } from '@prisma/client';

export class AuthService {
  async register(data: { email: string; username: string; password: string; displayName?: string }) {
    const email = data.email.trim().toLowerCase();
    const username = data.username.trim();
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      const error: any = new Error('Email is already registered');
      error.statusCode = 400;
      throw error;
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      const error: any = new Error('Username is already taken');
      error.statusCode = 400;
      throw error;
    }

    const passwordHash = await hashPassword(data.password);

    return prisma.$transaction(async tx => {
      const user = await tx.user.create({
        data: {
          email,
          username,
          passwordHash,
          displayName: data.displayName?.trim() || username,
          role: UserRole.USER,
          learningSettings: {
            create: {
              weeklyGoalTarget: 20,
            },
          },
          gamification: {
            create: {
              xp: 0,
              streak: 0,
            },
          },
        },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          role: true,
          createdAt: true,
        },
      });

      const accessToken = generateAccessToken({ userId: user.id, role: user.role });
      const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

      const expiresAt = refreshTokenExpiresAt(refreshToken);

      await tx.refreshToken.create({
        data: {
          token: hashRefreshToken(refreshToken),
          userId: user.id,
          expiresAt,
        },
      });

      return { user, accessToken, refreshToken };
    });
  }

  async login(login: string, password: string) {
    const normalizedLogin = login.trim();
    const isEmail = normalizedLogin.includes('@');
    const user = await prisma.user.findUnique({
      where: isEmail ? { email: normalizedLogin.toLowerCase() } : { username: normalizedLogin },
    });

    if (!user || !user.isActive) {
      const error: any = new Error('Invalid credentials or account inactive');
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      const error: any = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    const expiresAt = refreshTokenExpiresAt(refreshToken);

    await prisma.refreshToken.create({
      data: {
        token: hashRefreshToken(refreshToken),
        userId: user.id,
        expiresAt,
      },
    });

    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      const error: any = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: hashRefreshToken(refreshToken) },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date() || !tokenRecord.user.isActive) {
      if (tokenRecord) {
        await prisma.refreshToken.deleteMany({ where: { id: tokenRecord.id } });
      }
      const error: any = new Error('Refresh token expired or revoked');
      error.statusCode = 401;
      throw error;
    }

    const newAccessToken = generateAccessToken({ userId: tokenRecord.userId, role: tokenRecord.user.role });
    const newRefreshToken = generateRefreshToken({ userId: tokenRecord.userId, role: tokenRecord.user.role });

    const expiresAt = refreshTokenExpiresAt(newRefreshToken);

    await prisma.$transaction(async tx => {
      const consumed = await tx.refreshToken.deleteMany({ where: { id: tokenRecord.id } });
      if (consumed.count !== 1) {
        throw Object.assign(new Error('Refresh already consumed; retry using the current session'), { statusCode: 409 });
      }
      await tx.refreshToken.create({ data: {
        token: hashRefreshToken(newRefreshToken), userId: tokenRecord.userId, expiresAt,
      } });
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({ where: { token: hashRefreshToken(refreshToken) } });
    return true;
  }
}

export const authService = new AuthService();
