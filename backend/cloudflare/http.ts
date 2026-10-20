export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function json(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  const h = new Headers(headers);
  h.set('Cache-Control','no-store'); h.set('X-Content-Type-Options','nosniff');
  return Response.json(body,{status,headers:h});
}
