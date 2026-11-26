// Server-rendered head and body for page loads. The app is a client-rendered SPA, so without
// this every URL returned the same empty shell: one title, no text and no links for search
// engines or link previews. The Worker now fills in each page's title, description, canonical
// URL and a plain-HTML copy of its content inside #root; React replaces it on start.
import { Content } from './content';
import { edgeCache } from './content-cache';
import type { Row } from './learning-db';
import hanVietTable from '../../frontend/src/app/data/hanViet.json';

const SITE = 'LearnJP';
const DEFAULT_TITLE = 'LearnJP — Học tiếng Nhật theo lộ trình JLPT';

interface Page {
  title: string;
  description: string;
  path: string;
  body?: string;
  noindex?: boolean;
  status?: number;
}

const STATIC: Record<string, Omit<Page, 'path'>> = {
  '/tests': {
    title: 'Đề thi thử JLPT N4, N3 có giải thích — LearnJP',
    description:
      'Làm đề thi thử JLPT miễn phí theo đúng bốn phần: từ vựng, ngữ pháp, đọc hiểu, nghe hiểu. Bấm giờ, chấm điểm và xem giải thích từng câu.',
  },
  '/dictionary': {
    title: 'Từ điển Nhật – Việt: tra nghĩa, cách đọc, ví dụ — LearnJP',
    description: 'Tra từ tiếng Nhật sang tiếng Việt: nghĩa, cách đọc Hiragana, Hán tự và câu ví dụ.',
  },
  '/writing': {
    title: 'Luyện viết Hiragana và Katakana theo thứ tự nét — LearnJP',
    description: 'Bảng chữ cái Hiragana, Katakana với hoạt hình thứ tự nét và ô luyện viết cho người mới bắt đầu.',
  },
  '/review': {
    title: 'Ôn tập hôm nay — LearnJP',
    description: 'Ôn từ vựng và Hán tự đúng lúc sắp quên với thẻ ghi nhớ lặp lại ngắt quãng.',
    noindex: true,
  },
  '/translate': {
    title: 'Dịch văn bản tiếng Nhật — LearnJP',
    description: 'Dịch câu tiếng Nhật sang tiếng Việt để tham khảo.',
    noindex: true,
  },
  '/admin': { title: 'Quản trị — LearnJP', description: 'Quản trị nội dung.', noindex: true },
  '/about': {
    title: 'Giới thiệu LearnJP',
    description: 'LearnJP là khóa học tiếng Nhật miễn phí cho người Việt, từ JLPT N5 đến N1.',
  },
  '/privacy': {
    title: 'Quyền riêng tư — LearnJP',
    description: 'LearnJP thu thập những dữ liệu nào và dùng chúng ra sao.',
  },
};

const escape = (value: unknown) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
const clip = (text: string, max = 160) => {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
};
// Meanings are stored as "english / tiếng Việt"; learners read the Vietnamese part.
export const vietnamese = (meaning: unknown) => {
  const text = String(meaning ?? '');
  const i = text.indexOf(' / ');
  return i === -1 ? text : text.slice(i + 3);
};
const lessonPath = (id: number) => `/learning?moduleId=${id}`;
const hanViet = hanVietTable as Record<string, string>;
// Sino-Vietnamese readings of the kanji in a word, upper-cased ("新生活" → "TÂN SINH HOẠT").
export const hanVietOf = (text: unknown) =>
  [...String(text ?? '')]
    .map(c => hanViet[c]?.toLocaleUpperCase('vi'))
    .filter(Boolean)
    .join(' ');

function courseList(modules: Row[]) {
  const levels = [...new Set(modules.map(m => m.level.level as string))];
  return levels
    .map(level => {
      const items = modules
        .filter(m => m.level.level === level)
        .map(
          m =>
            `<li><a href="${lessonPath(m.id)}">Bài ${escape(m.unitNumber)}: ${escape(m.title)}</a> — ${m._count.vocabulary} từ vựng, ${m._count.kanji} Hán tự, ${m._count.grammarPatterns} mẫu ngữ pháp</li>`,
        )
        .join('');
      return `<section><h2>Tiếng Nhật ${escape(level)}</h2><ul>${items}</ul></section>`;
    })
    .join('');
}

function lessonBody(lesson: Row) {
  const level = escape(lesson.level?.level);
  const vocab = (lesson.vocabulary as Row[])
    .map(
      v =>
        `<li><span lang="ja">${escape(v.japanese)}</span>${v.hiragana && v.hiragana !== v.japanese ? ` (<span lang="ja">${escape(v.hiragana)}</span>)` : ''}${hanVietOf(v.japanese) ? ` [${escape(hanVietOf(v.japanese))}]` : ''}: ${escape(vietnamese(v.english))}</li>`,
    )
    .join('');
  const kanji = (lesson.kanji as Row[])
    .map(
      k =>
        `<li><span lang="ja">${escape(k.character)}</span>${hanVietOf(k.character) ? ` (Hán Việt: ${escape(hanVietOf(k.character))})` : ''}: ${escape(vietnamese(k.meaning))} — On: <span lang="ja">${escape(k.onyomi)}</span>, Kun: <span lang="ja">${escape(k.kunyomi)}</span></li>`,
    )
    .join('');
  const grammar = (lesson.grammarPatterns as Row[])
    .map(g => {
      const example = (g.examples as Row[])[0];
      return `<li><h3 lang="ja">${escape(g.pattern)}</h3><p>${escape(vietnamese(g.meaning))}</p>${g.explanation ? `<p>${escape(clip(String(g.explanation), 400))}</p>` : ''}${example ? `<p><span lang="ja">${escape(example.japanese)}</span> — ${escape(vietnamese(example.english))}</p>` : ''}</li>`;
    })
    .join('');
  return [
    `<p><a href="/learning">Lộ trình</a> › ${level}</p>`,
    `<h1>${level} · Bài ${escape(lesson.unitNumber)}: ${escape(lesson.title)}</h1>`,
    lesson.titleJp ? `<p lang="ja">${escape(lesson.titleJp)}</p>` : '',
    lesson.description ? `<p>${escape(lesson.description)}</p>` : '',
    grammar ? `<section><h2>Ngữ pháp</h2><ul>${grammar}</ul></section>` : '',
    vocab ? `<section><h2>Từ vựng</h2><ul>${vocab}</ul></section>` : '',
    kanji ? `<section><h2>Hán tự</h2><ul>${kanji}</ul></section>` : '',
  ].join('');
}

function lessonDescription(lesson: Row) {
  const patterns = (lesson.grammarPatterns as Row[]).map(g => g.pattern).slice(0, 2);
  const counts = `${lesson.vocabulary.length} từ vựng, ${lesson.kanji.length} Hán tự, ${lesson.grammarPatterns.length} mẫu ngữ pháp`;
  return clip(
    `Bài học tiếng Nhật ${lesson.level?.level}: ${lesson.title}. ${counts}${patterns.length ? ` (${patterns.join(', ')})` : ''}, hội thoại, nghe, đọc và bài kiểm tra có giải thích. Miễn phí.`,
  );
}

export async function describePage(url: URL, content: Content): Promise<Page> {
  const path = url.pathname.replace(/\/+$/, '') || '/';
  if (path === '/learning') {
    const raw = url.searchParams.get('moduleId');
    if (raw !== null) {
      if (!/^[1-9]\d{0,9}$/.test(raw)) return { title: DEFAULT_TITLE, description: '', path, noindex: true };
      try {
        const lesson = (await content.full(Number(raw), true)) as Row;
        return {
          title: `${lesson.level?.level} Bài ${lesson.unitNumber}: ${lesson.title} — Từ vựng, ngữ pháp | ${SITE}`,
          description: lessonDescription(lesson),
          path: lessonPath(lesson.id),
          body: lessonBody(lesson),
        };
      } catch {
        return { title: `Không tìm thấy bài học — ${SITE}`, description: '', path, noindex: true, status: 404 };
      }
    }
    const modules = await content.modules(new URLSearchParams());
    const levels = [...new Set(modules.map(m => m.level.level))];
    return {
      title: `Lộ trình học tiếng Nhật ${levels.join(', ')} theo JLPT — ${SITE}`,
      description: clip(
        `${modules.length} bài học tiếng Nhật miễn phí từ ${levels[0]} đến ${levels.at(-1)}: từ vựng, Hán tự, ngữ pháp, hội thoại, nghe, đọc và bài kiểm tra sau mỗi bài.`,
      ),
      path,
      body: `<h1>Lộ trình học tiếng Nhật ${escape(levels.join(' → '))}</h1>${courseList(modules)}`,
    };
  }
  if (path === '/') {
    const modules = await content.modules(new URLSearchParams());
    return {
      title: DEFAULT_TITLE,
      description:
        'Học tiếng Nhật miễn phí theo lộ trình JLPT N5–N1: từ vựng, Hán tự, ngữ pháp, hội thoại, nghe, đọc, bài kiểm tra sau mỗi bài và đề thi thử. Không cần tài khoản.',
      path,
      body: `<h1>Học tiếng Nhật theo lộ trình JLPT</h1><p>Miễn phí, không quảng cáo, học ngay không cần tài khoản.</p>${courseList(modules)}`,
    };
  }
  const known = STATIC[path];
  if (known) return { ...known, path };
  return { title: `Không tìm thấy trang — ${SITE}`, description: '', path, noindex: true, status: 404 };
}

export function renderShell(shell: string, page: Page, origin: string) {
  const canonical = origin + page.path;
  const description = escape(page.description);
  const title = escape(page.title);
  const meta = (pattern: RegExp, value: string) => (html: string) => html.replace(pattern, `$1${value}$2`);
  let html = [
    meta(/(<title>)[^<]*(<\/title>)/, title),
    meta(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, title),
    meta(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, escape(canonical)),
    meta(/(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/, title),
    ...(page.description
      ? [
          meta(/(<meta\s+name="description"\s+content=")[^"]*(")/, description),
          meta(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, description),
        ]
      : []),
  ].reduce((h, apply) => apply(h), shell);
  const head =
    (page.noindex
      ? '<meta name="robots" content="noindex" />'
      : `<link rel="canonical" href="${escape(canonical)}" />`) + '\n  </head>';
  html = html.replace(/<\/head>/, head);
  if (page.body)
    html = html.replace(
      /<div id="root"><\/div>/,
      `<div id="root"><main class="ssr-content" style="max-width:48rem;margin:0 auto;padding:5rem 1.5rem 3rem;line-height:1.6">${page.body}</main></div>`,
    );
  return html;
}

const STATIC_SITEMAP = ['/', '/learning', '/tests', '/dictionary', '/writing', '/about', '/privacy'];

export async function serveSitemap(request: Request, env: Env, waitUntil: (p: Promise<unknown>) => void) {
  const url = new URL(request.url);
  if (url.pathname !== '/sitemap.xml' || (request.method !== 'GET' && request.method !== 'HEAD')) return null;
  const origin = new URL(env.FRONTEND_URL).origin;
  let modules: Row[] = [];
  try {
    modules = await new Content(
      env.DB,
      env.QUIZ_REVISION_SECRET,
      undefined,
      false,
      edgeCache(env.DB, url.origin, waitUntil, env.CF_VERSION_METADATA?.id),
    ).modules(new URLSearchParams());
  } catch {
    // Without the database the sitemap still lists the fixed pages.
  }
  const entries = [
    ...STATIC_SITEMAP.map(path => `<url><loc>${origin}${path}</loc></url>`),
    ...modules.map(m => {
      const updated = String(m.updatedAt || m.publishedAt || '').slice(0, 10);
      return `<url><loc>${escape(origin + lessonPath(m.id))}</loc>${/^\d{4}-\d{2}-\d{2}$/.test(updated) ? `<lastmod>${updated}</lastmod>` : ''}</url>`;
    }),
  ];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
  return new Response(request.method === 'HEAD' ? null : xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}

const PAGE_PATHS = /^\/(learning|tests|dictionary|writing|review|translate|admin|about|privacy)?\/?$/;

// Returns null for anything that is not a page load (assets, API, unknown files).
export async function servePage(request: Request, env: Env, waitUntil: (p: Promise<unknown>) => void) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  const url = new URL(request.url);
  // Paths with a file extension are static files; let the asset handler answer them.
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return null;
  // A plain request: conditional headers from the browser describe our rendered page, not the shell.
  const shellResponse = await env.ASSETS.fetch(new URL('/', url));
  if (!shellResponse.ok || !shellResponse.headers.get('content-type')?.includes('text/html')) return shellResponse;
  const shell = await shellResponse.text();
  const content = new Content(
    env.DB,
    env.QUIZ_REVISION_SECRET,
    undefined,
    false,
    edgeCache(env.DB, url.origin, waitUntil, env.CF_VERSION_METADATA?.id),
  );
  let page: Page;
  try {
    page = PAGE_PATHS.test(url.pathname)
      ? await describePage(url, content)
      : await describePage(new URL('/__unknown', url), content);
  } catch {
    // Content unavailable: serve the plain app shell rather than an error page.
    page = { title: DEFAULT_TITLE, description: '', path: url.pathname };
  }
  const headers = new Headers(shellResponse.headers);
  headers.delete('content-length');
  headers.delete('etag');
  headers.set('Cache-Control', 'no-cache');
  const body = renderShell(shell, page, new URL(env.FRONTEND_URL).origin);
  return new Response(request.method === 'HEAD' ? null : body, { status: page.status ?? 200, headers });
}
