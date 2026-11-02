// Minimal HS256 JWT (RFC 7519) on Web Crypto. Replaces jose on the request path: the
// library's first-use cost dominated CPU on cold isolates. Wire format matches jose, so
// tokens issued by either implementation verify with the other.
const encoder = new TextEncoder(),
  decoder = new TextDecoder();
const HEADER = encode(encoder.encode('{"alg":"HS256","typ":"JWT"}'));

function encode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}
function decode(part: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]*$/.test(part)) throw new Error('Invalid base64url');
  const binary = atob(part.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (part.length % 4)) % 4));
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}
function object(bytes: Uint8Array): Record<string, unknown> {
  const value = JSON.parse(decoder.decode(bytes));
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid JWT segment');
  return value;
}

export async function signJwt(key: CryptoKey, claims: Record<string, unknown>): Promise<string> {
  const input = HEADER + '.' + encode(encoder.encode(JSON.stringify(claims)));
  return input + '.' + encode(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(input))));
}

// Same acceptance rules as jose jwtVerify with algorithms ['HS256'], issuer, audience and
// requiredClaims exp/iat/jti; callers add their own payload checks. Throws on any failure.
export async function verifyJwt(key: CryptoKey, token: string, expected: { issuer: string; audience: string }) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed JWT');
  const header = object(decode(parts[0]));
  if (header.alg !== 'HS256' || 'crit' in header || header.b64 === false) throw new Error('Unsupported JWT header');
  if (!(await crypto.subtle.verify('HMAC', key, decode(parts[2]), encoder.encode(parts[0] + '.' + parts[1]))))
    throw new Error('Invalid signature');
  const payload = object(decode(parts[1]));
  const now = Math.floor(Date.now() / 1000);
  const audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (payload.iss !== expected.issuer || !audience.includes(expected.audience))
    throw new Error('Unexpected issuer or audience');
  if (typeof payload.exp !== 'number' || typeof payload.iat !== 'number' || payload.jti === undefined)
    throw new Error('Missing required claim');
  if (payload.exp <= now || (payload.nbf !== undefined && (typeof payload.nbf !== 'number' || payload.nbf > now)))
    throw new Error('Token not active');
  return payload;
}
