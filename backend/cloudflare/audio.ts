// Pre-generated lesson audio stored in R2. Files are named by a hash of what they say and how,
// so a URL never changes meaning and can be cached for a year.
const AUDIO_PATH = /^\/audio\/([0-9a-f]{32})\.mp3$/;
const CACHE = 'public, max-age=31536000, immutable';

const notFound = () => new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });

export async function serveAudio(request: Request, bucket: R2Bucket | undefined): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (path !== '/audio' && !path.startsWith('/audio/')) return null;
  const match = AUDIO_PATH.exec(path);
  if (!match || !bucket) return notFound();
  if (request.method !== 'GET' && request.method !== 'HEAD')
    return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });

  const key = `${match[1]}.mp3`;
  const headersFor = (object: R2Object) =>
    new Headers({
      'content-type': 'audio/mpeg',
      'cache-control': CACHE,
      'accept-ranges': 'bytes',
      etag: object.httpEtag,
    });
  if (request.method === 'HEAD') {
    const object = await bucket.head(key);
    if (!object) return notFound();
    const headers = headersFor(object);
    headers.set('content-length', String(object.size));
    return new Response(null, { headers });
  }

  const ranged = request.headers.has('range');
  let object: R2Object | R2ObjectBody | null;
  try {
    object = await bucket.get(key, { range: request.headers, onlyIf: request.headers });
  } catch (error) {
    // R2 rejects a range outside the file; anything else is a real failure.
    if (ranged) return new Response('Range not satisfiable', { status: 416 });
    throw error;
  }
  if (!object) return notFound();

  const headers = headersFor(object);
  // onlyIf matched If-None-Match: R2 returns the metadata without a body.
  if (!('body' in object)) return new Response(null, { status: 304, headers });

  let status = 200;
  const range = object.range;
  if (ranged && range) {
    // R2 may report an open range ("bytes=0-") with the other fields present but undefined.
    const suffix = 'suffix' in range ? range.suffix : undefined;
    const offset = suffix !== undefined ? object.size - suffix : 'offset' in range ? (range.offset ?? 0) : 0;
    const length =
      suffix !== undefined
        ? suffix
        : 'length' in range && range.length !== undefined
          ? range.length
          : object.size - offset;
    headers.set('content-range', `bytes ${offset}-${offset + length - 1}/${object.size}`);
    headers.set('content-length', String(length));
    status = 206;
  } else headers.set('content-length', String(object.size));
  return new Response(object.body, { status, headers });
}
