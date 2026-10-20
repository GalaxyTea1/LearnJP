import { getPlatformProxy } from 'wrangler';
import { fileURLToPath } from 'node:url';

// Same local namespace as wrangler.local.jsonc. Never accepts remote credentials.
export async function openLocalD1() {
  const runtime = await getPlatformProxy({
    configPath: fileURLToPath(new URL('../wrangler.local.jsonc', import.meta.url)),
    persist: { path: fileURLToPath(new URL('../.wrangler/state/v3', import.meta.url)) },
    remoteBindings: false, envFiles: [],
  });
  return { runtime, db: runtime.env.DB };
}
