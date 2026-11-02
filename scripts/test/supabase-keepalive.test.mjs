import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './learning-fixture.mjs';

const { supabaseKeepalive } = await load('supabase-keepalive');
const env = {
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
  GOOGLE_AUTH_ENABLED: 'true',
};
const at = hour => Date.UTC(2026, 9, 28, hour, 17);

test('queries keepalive() once a day, at 03:17 UTC, with the public key only', async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    return new Response('1');
  };
  for (let hour = 0; hour < 24; hour++) await supabaseKeepalive(env, at(hour), fetcher);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://test.supabase.co/rest/v1/rpc/keepalive');
  assert.equal(calls[0].options.method, 'POST');
  assert.deepEqual(calls[0].options.headers, { apikey: 'sb_publishable_test', 'Content-Type': 'application/json' });
  assert.equal(await supabaseKeepalive(env, at(3), fetcher), 'ok');
});

test('skips when Supabase sign-in is off or unconfigured, and never throws', async () => {
  let called = false;
  const fetcher = async () => {
    called = true;
    return new Response('1');
  };
  assert.equal(await supabaseKeepalive({ ...env, GOOGLE_AUTH_ENABLED: 'false' }, at(3), fetcher), 'skipped');
  assert.equal(await supabaseKeepalive({ ...env, SUPABASE_URL: undefined }, at(3), fetcher), 'skipped');
  assert.equal(await supabaseKeepalive(env, Number.NaN, fetcher), 'skipped');
  assert.equal(called, false);
  const warn = console.warn;
  const logged = [];
  console.warn = (...args) => logged.push(args.join(' '));
  try {
    assert.equal(await supabaseKeepalive(env, at(3), async () => new Response('missing', { status: 404 })), 'failed');
    assert.equal(
      await supabaseKeepalive(env, at(3), async () => {
        throw new TypeError('offline');
      }),
      'failed',
    );
  } finally {
    console.warn = warn;
  }
  assert.deepEqual(logged, [
    'supabase_keepalive_failure {"status":404}',
    'supabase_keepalive_failure {"status":"network"}',
  ]);
});
