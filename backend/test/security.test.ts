import assert from 'node:assert/strict';
import test from 'node:test';
import { UserRole } from '@prisma/client';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../src/utils/jwt';
import { registerSchema } from '../src/validators/auth.validator';
import { submitGameScoreSchema, updateProgressSchema } from '../src/validators/user.validator';
import { calculateSm2 } from '../src/utils/srs';

test('access and refresh tokens cannot be substituted for each other', () => {
  const payload = { userId: 42, role: UserRole.USER };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  assert.equal(verifyAccessToken(accessToken)?.tokenType, 'access');
  assert.equal(verifyRefreshToken(refreshToken)?.tokenType, 'refresh');
  assert.equal(verifyAccessToken(refreshToken), null);
  assert.equal(verifyRefreshToken(accessToken), null);
});

test('registration requires a normalized email and strong-enough password', () => {
  const parsed = registerSchema.parse({
    body: { email: '  USER@Example.COM ', username: 'learner_1', password: 'correct-horse' },
  });
  assert.equal(parsed.body.email, 'user@example.com');
  assert.equal(registerSchema.safeParse({ body: { email: 'a@b.com', username: 'abc', password: 'short' } }).success, false);
});

test('client progress cannot mark a module complete or reach 100 percent', () => {
  assert.equal(updateProgressSchema.safeParse({ body: { moduleId: 1, status: 'COMPLETED' } }).success, false);
  assert.equal(updateProgressSchema.safeParse({ body: { moduleId: 1, progressPercent: 100 } }).success, false);
  assert.equal(updateProgressSchema.safeParse({ body: { moduleId: 1, status: 'IN_PROGRESS', progressPercent: 99 } }).success, true);
});

test('game scores have bounded values and structured details', () => {
  assert.equal(submitGameScoreSchema.safeParse({ body: { gameType: 'QUIZ', score: 100001 } }).success, false);
  assert.equal(submitGameScoreSchema.safeParse({ body: { gameType: 'QUIZ', score: 100, details: 'raw' } }).success, false);
  assert.equal(submitGameScoreSchema.safeParse({ body: { gameType: 'QUIZ', score: 100, details: { rounds: 10 } } }).success, true);
});

test('SM-2 schedules successful and failed reviews safely', () => {
  const success = calculateSm2({ quality: 5, repetitions: 0, interval: 0, easeFactor: 2.5 });
  const failure = calculateSm2({ quality: 1, repetitions: 4, interval: 20, easeFactor: 2.5 });
  assert.equal(success.repetitions, 1);
  assert.equal(success.interval, 1);
  assert.equal(failure.repetitions, 0);
  assert.equal(failure.interval, 1);
  assert.ok(failure.easeFactor >= 1.3);
});
