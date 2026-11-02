// Public (non-user, non-preview) content is identical for every viewer, so it is cached
// at the edge under the D1 content version. Any content write bumps the version through
// triggers, which moves every key at once; no purge list is needed.
export type PublicCache = <T>(key: string, compute: () => Promise<T>) => Promise<T>;
export const noCache: PublicCache = (_key, compute) => compute();
const TTL_SECONDS = 86400;

export function edgeCache(
  db: D1Database,
  origin: string,
  waitUntil?: (promise: Promise<unknown>) => void,
): PublicCache {
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  if (!cache) return noCache;
  let version: Promise<number | null> | undefined;
  return async (key, compute) => {
    // A missing table (migration not yet applied) or D1 error disables caching, never the API.
    version ??= db
      .prepare('SELECT version FROM content_cache_version WHERE id=1')
      .first<{ version: number }>()
      .then(
        row => (Number.isSafeInteger(row?.version) ? row!.version : null),
        () => null,
      );
    const current = await version;
    if (current === null) return compute();
    const request = new Request(`${origin}/__content-cache/v${current}/${encodeURIComponent(key)}`);
    try {
      const hit = await cache.match(request);
      if (hit) return await hit.json();
    } catch {
      /* Treat an unreadable entry as a miss. */
    }
    const value = await compute();
    const put = cache
      .put(
        request,
        new Response(JSON.stringify(value), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${TTL_SECONDS}` },
        }),
      )
      .catch(() => {});
    if (waitUntil) waitUntil(put);
    else await put;
    return value;
  };
}
