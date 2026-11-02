// Keep only a resolved key, never request-owned pending work or session data.
// A changed secret replaces the single cache entry immediately after import.
let cached: { secret: string; key: CryptoKey } | undefined;
export async function signingKey(secret: string): Promise<CryptoKey> {
  if (cached?.secret === secret) return cached.key;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
  cached = { secret, key };
  return key;
}
