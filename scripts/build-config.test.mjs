import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const cwd = fileURLToPath(new URL('../frontend/', import.meta.url));
for (const [mode, url, message] of [
  ['production', '', 'Set VITE_API_URL'],
  ['production', '/', 'Invalid URL'],
  ['cloudflare', 'https://api.example.test', 'Cloudflare build requires VITE_API_URL=/'],
]) {
  test(`reject incorrect API configuration: ${mode}, ${url || '(missing)'}`, () => {
    const result = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--mode', mode], {
      cwd, env: { ...process.env, VITE_API_URL: url }, encoding: 'utf8', timeout: 30000,
    });
    assert.ifError(result.error);
    assert.notEqual(result.status, 0);
    assert.ok(`${result.stdout}${result.stderr}`.includes(message));
  });
}
