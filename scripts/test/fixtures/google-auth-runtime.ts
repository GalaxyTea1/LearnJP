import { handleGoogleAuth } from '../../../backend/cloudflare/google-auth';
import { handleEmailAuth } from '../../../backend/cloudflare/email-auth';

// Test-only provider: construct a real workerd Request before mocking transport.
// Node's Request accepts redirect:error, whereas workerd rejects it.
let redirectProvider = false;
globalThis.fetch = async (input, init) => {
  const request = new Request(input, init);
  if (request.redirect !== 'manual') throw new Error('Provider redirects must not be followed');
  if (redirectProvider) return new Response(null, { status: 302, headers: { Location: 'https://untrusted.invalid' } });
  if (new URL(request.url).pathname.endsWith('/token')) return Response.json({ access_token: 'test-only' });
  return Response.json({
    id: '12345678-1234-4234-8234-123456789012',
    email: 'runtime@test.invalid',
    email_confirmed_at: '2026-10-24',
    identities: [{ provider: 'google' }],
  });
};
export default {
  async fetch(request: Request, env: any) {
    redirectProvider = request.headers.get('X-Test-Redirect') === 'true';
    const settings = {
      ...env,
      GOOGLE_AUTH_ENABLED: 'true',
      EMAIL_AUTH_ENABLED: 'true',
      SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'test-only',
    };
    return (
      (await handleGoogleAuth(request, settings)) ||
      (await handleEmailAuth(request, settings)) ||
      new Response(null, { status: 404 })
    );
  },
};
