import { z } from 'zod';

export const jishoQuerySchema = z.object({ query: z.object({ q: z.string().trim().min(1).max(100) }) });
const payloadSchema = z.object({
  data: z.array(z.object({
    japanese: z.array(z.object({ word: z.string().optional(), reading: z.string().optional() })).min(1),
    senses: z.array(z.object({ english_definitions: z.array(z.string()) })),
    jlpt: z.array(z.string()).optional(),
  })),
});

// Fixed upstream: callers can supply a keyword, never a destination URL.
export async function searchJisho(query: string, fetcher: typeof fetch = fetch, timeoutMs = 8000) {
  const url = new URL('https://jisho.org/api/v1/search/words');
  url.searchParams.set('keyword', query);
  const signal = AbortSignal.timeout(timeoutMs);
  try {
    const response = await fetcher(url, { signal, redirect: 'error', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Upstream dictionary unavailable');
    const payload = payloadSchema.parse(await response.json());
    return payload.data.slice(0, 15).map(item => ({
      jp: item.japanese[0].word || item.japanese[0].reading || query,
      rom: item.japanese[0].reading || '',
      en: item.senses[0]?.english_definitions.join(', ') || '',
      type: 'vocab',
      level: item.jlpt?.[0]?.replace('jlpt-', '').toUpperCase() || 'Jisho',
      example: '', exampleEn: '',
    }));
  } catch {
    throw Object.assign(new Error('Dictionary service temporarily unavailable'), { statusCode: signal.aborted ? 504 : 502 });
  }
}
