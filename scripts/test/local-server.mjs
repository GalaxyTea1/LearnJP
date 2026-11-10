// Starts the Worker on a random local port against a fresh, throwaway D1 database.
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { getPlatformProxy, unstable_dev } from 'wrangler';

const root = fileURLToPath(new URL('../../', import.meta.url));
const config = join(root, 'wrangler.local.jsonc');

// `seed(db)` prepares the database before the server starts (migrations, content).
export async function startLocalServer(seed) {
  await mkdir(join(root, '.local'), { recursive: true });
  const state = await mkdtemp(join(root, '.local', 'test-server-'));
  const proxy = await getPlatformProxy({
    configPath: config,
    persist: { path: join(state, 'v3') },
    remoteBindings: false,
    envFiles: [],
  });
  try {
    await seed(proxy.env.DB);
  } finally {
    await proxy.dispose();
  }
  const server = await unstable_dev(join(root, 'backend/cloudflare/worker.ts'), {
    config,
    envFiles: [],
    local: true,
    persist: true,
    persistTo: state,
    ip: '127.0.0.1',
    port: 0,
    logLevel: 'error',
    experimental: { disableExperimentalWarning: true, disableDevRegistry: true, watch: false },
  });
  return {
    origin: `http://${server.address}:${server.port}`,
    stop: async () => {
      await server.stop();
      await rm(state, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    },
  };
}
