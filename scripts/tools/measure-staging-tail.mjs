// Public-route CPU sample via wrangler tail. Signed-in routes: scripts/tools/watch-staging-auth-cpu.mjs.
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
const marker = 'learnjp-cost-' + Date.now();
const samples = [];
let buffer = '';
const child = spawn(
  process.execPath,
  [
    'node_modules/wrangler/bin/wrangler.js',
    'tail',
    '--config',
    'wrangler.staging.json',
    '--format',
    'json',
    '--header',
    'X-QA-Measure:' + marker,
  ],
  { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } },
);
child.stdout.on('data', chunk => {
  buffer += chunk;
});
child.stderr.on('data', () => {});
try {
  await new Promise(r => setTimeout(r, 8000));
  const origin = 'https://learnjp-staging.trongdv031199.workers.dev';
  const call = async path => {
    const start = performance.now();
    const r = await fetch(origin + path, { headers: { 'X-QA-Measure': marker }, signal: AbortSignal.timeout(20000) });
    await r.arrayBuffer();
    samples.push({ path, status: r.status, wallMs: Math.round(performance.now() - start) });
    if (!r.ok) throw new Error('Sample request failed: ' + r.status);
  };
  for (let i = 0; i < 3; i++)
    for (const path of ['/api/v1/health', '/api/v1/modules', '/api/v1/modules/7/full']) await call(path);
  await new Promise(r => setTimeout(r, 5000));
} finally {
  child.kill();
}
// Tail may contain request headers: never print or persist raw events.
const events = [];
let depth = 0,
  start = -1,
  inString = false,
  escape = false;
for (let i = 0; i < buffer.length; i++) {
  const c = buffer[i];
  if (inString) {
    if (escape) escape = false;
    else if (c === '\\') escape = true;
    else if (c === '"') inString = false;
    continue;
  }
  if (c === '"') {
    inString = true;
    continue;
  }
  if (c === '{') {
    if (depth++ === 0) start = i;
  } else if (c === '}' && --depth === 0 && start >= 0) {
    try {
      const e = JSON.parse(buffer.slice(start, i + 1));
      events.push({
        keys: Object.keys(e),
        outcome: e.outcome,
        cpuTime: e.cpuTime,
        wallTime: e.wallTime,
        eventKeys: Object.keys(e.event || {}),
        path: e.event?.request?.url ? new URL(e.event.request.url).pathname : undefined,
      });
    } catch {}
  }
}
await mkdir('.local/metrics', { recursive: true });
await writeFile('.local/metrics/tail-public-sample.json', JSON.stringify({ samples, events }, null, 2));
console.log(JSON.stringify({ samples, events }));
