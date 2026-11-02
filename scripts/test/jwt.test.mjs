import test from 'node:test';
import assert from 'node:assert/strict';
import { SignJWT, jwtVerify } from 'jose';
import { load } from './learning-fixture.mjs';

const { signJwt, verifyJwt } = await load('jwt');
const key = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode('jwt-test-secret-that-is-at-least-32-bytes'),
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign', 'verify'],
);
const other = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode('a-different-secret-that-is-also-32-bytes'),
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign', 'verify'],
);
const expected = { issuer: 'sumaryjp-api', audience: 'sumaryjp-web' };
const now = () => Math.floor(Date.now() / 1000);
const claims = (extra = {}) => ({
  tokenType: 'access',
  sid: crypto.randomUUID(),
  userId: 7,
  role: 'USER',
  iss: 'sumaryjp-api',
  aud: 'sumaryjp-web',
  iat: now(),
  exp: now() + 900,
  jti: crypto.randomUUID(),
  ...extra,
});
const b64 = value => Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');

test('tokens are interchangeable with jose in both directions', async () => {
  const mine = await signJwt(key, claims());
  const { payload, protectedHeader } = await jwtVerify(mine, key, {
    algorithms: ['HS256'],
    ...expected,
    requiredClaims: ['exp', 'iat', 'jti'],
  });
  assert.deepEqual(protectedHeader, { alg: 'HS256', typ: 'JWT' });
  assert.equal(payload.userId, 7);
  const theirs = await new SignJWT({ tokenType: 'refresh', sid: 'x' })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer('sumaryjp-api')
    .setAudience('sumaryjp-web')
    .setIssuedAt()
    .setExpirationTime('15m')
    .setJti('j')
    .sign(key);
  assert.equal((await verifyJwt(key, theirs, expected)).tokenType, 'refresh');
  // jose accepts an audience array containing the expected value; so do we.
  assert.equal((await verifyJwt(key, await signJwt(key, claims({ aud: ['x', 'sumaryjp-web'] })), expected)).userId, 7);
});

test('rejects forged, mismatched, expired and malformed tokens', async () => {
  const valid = await signJwt(key, claims());
  const [h, p, s] = valid.split('.');
  const rejected = [
    await signJwt(other, claims()),
    `${h}.${b64(claims({ userId: 1 }))}.${s}`,
    `${b64({ alg: 'none', typ: 'JWT' })}.${p}.`,
    `${b64({ alg: 'HS512', typ: 'JWT' })}.${p}.${s}`,
    `${b64({ alg: 'HS256', crit: ['exp'], exp: 1 })}.${p}.${s}`,
    await signJwt(key, claims({ iss: 'someone-else' })),
    await signJwt(key, claims({ aud: 'sumaryjp-refresh' })),
    await signJwt(key, claims({ exp: now() - 1 })),
    await signJwt(key, claims({ exp: now() })),
    await signJwt(key, claims({ nbf: now() + 60 })),
    await signJwt(key, claims({ jti: undefined })),
    await signJwt(key, claims({ exp: String(now() + 900) })),
    valid + '.extra',
    `${h}.${p}`,
    `${h}.${p}.${s}!`,
    `${h}.bm90LWpzb24.${s}`,
    '',
    'a.b.c',
  ];
  for (const token of rejected) await assert.rejects(verifyJwt(key, token, expected), undefined, token);
  assert.equal((await verifyJwt(key, valid, expected)).role, 'USER');
});
