import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const frontend = fileURLToPath(new URL('../frontend/', import.meta.url));
for (const args of [
  ['node_modules/typescript/bin/tsc', '--noEmit'],
  ['node_modules/vite/bin/vite.js', 'build', '--mode', 'cloudflare'],
]) {
  const result = spawnSync(process.execPath, args, {
    cwd: frontend, stdio: 'inherit',
    env: { ...process.env, VITE_API_URL: '/' },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
