import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../../frontend/node_modules/esbuild/lib/main.js';
import { SignJWT, jwtVerify } from 'jose';

test('cached HMAC key preserves signatures and changes with the secret', async () => {
  const output = await build({
    entryPoints: ['backend/cloudflare/signing-key.ts'],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    write: false,
  });
  const { signingKey } = await import(
    'data:text/javascript;base64,' + Buffer.from(output.outputFiles[0].text).toString('base64')
  );
  const secret = 'test-only-original-signing-key-123456789';
  const key = await signingKey(secret);
  assert.equal(await signingKey(secret), key);
  assert.equal(key.extractable, false);
  const token = await new SignJWT({ test: true }).setProtectedHeader({ alg: 'HS256' }).sign(key);
  assert.equal((await jwtVerify(token, new TextEncoder().encode(secret))).payload.test, true);
  const replacement = await signingKey('test-only-rotated-signing-key-123456789');
  assert.notEqual(replacement, key);
  await assert.rejects(jwtVerify(token, replacement));
  assert.equal((await jwtVerify(token, await signingKey(secret))).payload.test, true);
});
