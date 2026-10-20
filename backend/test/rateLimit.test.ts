import assert from 'node:assert/strict';
import test from 'node:test';
import { createRateLimiter } from '../src/middlewares/rateLimit.middleware';

test('rate limiter blocks requests after the configured maximum', async () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 2, keyPrefix: 'test' });
  const statuses: number[] = [];
  let nextCalls = 0;
  const req = { ip: '127.0.0.1', socket: {} } as any;
  const res = {
    headers: {} as Record<string, unknown>,
    setHeader(name: string, value: unknown) { this.headers[name] = value; },
    status(code: number) { statuses.push(code); return this; },
    json() { return this; },
  } as any;
  const next = () => { nextCalls += 1; };

  await limiter(req, res, next);
  await limiter(req, res, next);
  await limiter(req, res, next);

  assert.equal(nextCalls, 2);
  assert.deepEqual(statuses, [429]);
  assert.equal(res.headers['Retry-After'] > 0, true);
});

test('separate limiter instances share a store and fail closed on storage errors', async () => {
  let count = 0;
  const consume = async () => ({ count: ++count, resetAt: Date.now() + 60000 });
  const options = { windowMs: 60000, max: 1, keyPrefix: 'shared', consume };
  const req: any = { ip: '127.0.0.1', socket: {} };
  let status = 0;
  const res: any = { setHeader() {}, status(code: number) { status = code; return this; }, json() {} };
  await createRateLimiter(options)(req, res, () => {});
  await createRateLimiter(options)(req, res, () => assert.fail('Shared limit bypassed'));
  assert.equal(status, 429);
  const failure = new Error('store unavailable');
  await createRateLimiter({ ...options, consume: async () => { throw failure; } })(req, res, err => {
    assert.equal(err, failure);
  });
});
