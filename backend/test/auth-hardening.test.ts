import assert from 'node:assert/strict';
import test from 'node:test';
import { UserRole } from '@prisma/client';
import { generateRefreshToken, hashRefreshToken, refreshTokenExpiresAt } from '../src/utils/jwt';
import { hashPassword, comparePassword } from '../src/utils/password';
import { registerSchema, loginSchema } from '../src/validators/auth.validator';
import { updateSettingsSchema } from '../src/validators/user.validator';
import { validate } from '../src/middlewares/validate.middleware';
import { protectAuthMutation } from '../src/middlewares/csrf.middleware';
import { readRefreshCookie, setRefreshCookie, clearRefreshCookie, refreshCookieName } from '../src/utils/authCookie';
import { z } from 'zod';

test('refresh tokens remain unique within one second and only hashes are persisted', () => {
  const tokens = Array.from({ length: 20 }, () => generateRefreshToken({ userId: 42, role: UserRole.USER }));
  assert.equal(new Set(tokens).size, 20);
  assert.match(hashRefreshToken(tokens[0]), /^[a-f0-9]{64}$/);
  const payload = JSON.parse(Buffer.from(tokens[0].split('.')[1], 'base64url').toString());
  assert.equal(refreshTokenExpiresAt(tokens[0]).getTime(), payload.exp * 1000);
});

test('password byte limits reject bcrypt truncation including multibyte text', async () => {
  const valid = 'a'.repeat(72);
  const hash = await hashPassword(valid);
  assert.equal(await comparePassword(valid, hash), true);
  assert.equal(await comparePassword(valid + 'X', hash), false);
  await assert.rejects(hashPassword(valid + 'X'));
  for (const password of [valid + 'X', 'あ'.repeat(25)]) {
    assert.equal(registerSchema.safeParse({ body: { email: 'a@example.test', username: 'abc', password } }).success, false);
    assert.equal(loginSchema.safeParse({ body: { login: 'abc', password } }).success, false);
  }
});

test('validation strips unknown fields and applies normalized values', async () => {
  const req: any = { body: { weeklyGoalTarget: 20, userId: 999, user: { update: { role: 'ADMIN' } } } };
  let passed = false;
  await validate(updateSettingsSchema)(req, {} as any, () => { passed = true; });
  assert.equal(passed, true);
  assert.deepEqual(req.body, { weeklyGoalTarget: 20 });
  req.body = { email: ' USER@Example.COM ', username: 'learner', password: 'password123' };
  await validate(registerSchema)(req, {} as any, () => {});
  assert.equal(req.body.email, 'user@example.com');
});

test('validation supports the Express 5 query getter', async () => {
  const req: any = Object.create({ get query() { return { page: '2', extra: 'x' }; } });
  await validate(z.object({ query: z.object({ page: z.coerce.number() }) }))(req, {} as any, error => {
    assert.equal(error, undefined);
  });
  assert.deepEqual(req.query, { page: 2 });
});

test('cookie-auth mutations reject missing CSRF header and untrusted origins', () => {
  for (const headers of [{}, { 'X-Requested-With': 'SumaryJP', Origin: 'https://evil.example' }]) {
    let status = 0;
    protectAuthMutation({ get: (name: string) => (headers as any)[name] } as any,
      { status: (code: number) => { status = code; return { json() {} }; } } as any,
      () => assert.fail('Untrusted request passed'));
    assert.equal(status, 403);
  }
  let passed = false;
  protectAuthMutation({ get: (name: string) => name === 'X-Requested-With' ? 'SumaryJP' : undefined } as any,
    {} as any, () => { passed = true; });
  assert.equal(passed, true);
});

test('refresh cookies are HttpOnly, scoped and cleared using the same attributes', () => {
  const token = generateRefreshToken({ userId: 42, role: UserRole.USER });
  let options: any;
  const res: any = {
    cookie: (name: string, value: string, opts: any) => {
      assert.equal(name, refreshCookieName); assert.equal(value, token); options = opts;
    },
    clearCookie: (name: string, opts: any) => {
      assert.equal(name, refreshCookieName); assert.equal(opts.path, options.path); assert.equal(opts.httpOnly, true);
    },
  };
  setRefreshCookie(res, token);
  assert.equal(options.httpOnly, true);
  assert.equal(options.path, '/api/v1/auth');
  assert.equal(readRefreshCookie({ headers: { cookie: `${refreshCookieName}=${token}` } } as any), token);
  clearRefreshCookie(res);
});
