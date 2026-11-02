import { spawn } from 'node:child_process';
import https from 'node:https';
import { Resolver } from 'node:dns/promises';
import { mkdir, writeFile } from 'node:fs/promises';
const host = 'learnjp-staging.trongdv031199.workers.dev';
const resolver = new Resolver();
resolver.setServers(['1.1.1.1']);
const ip = (await resolver.resolve4(host))[0];
const marker = 'public-cpu-' + Date.now(),
  samples = [],
  events = [];
let buffer = '',
  depth = 0,
  quoted = false,
  escape = false;
const tail = spawn(
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
tail.stderr.on('data', () => {});
tail.stdout.on('data', chunk => {
  for (const c of chunk.toString()) {
    if (depth === 0 && c !== '{') continue;
    buffer += c;
    if (quoted) {
      if (escape) escape = false;
      else if (c === '\\') escape = true;
      else if (c === '"') quoted = false;
      continue;
    }
    if (c === '"') {
      quoted = true;
      continue;
    }
    if (c === '{') depth++;
    if (c === '}' && --depth === 0) {
      try {
        const e = JSON.parse(buffer);
        events.push({
          path: new URL(e.event.request.url).pathname,
          status: e.event.response?.status,
          cpuMs: e.cpuTime,
          wallMs: e.wallTime,
          outcome: e.outcome,
        });
      } catch {}
      buffer = '';
    }
  }
});
const call = path =>
  new Promise((resolve, reject) => {
    const start = performance.now();
    const req = https.request(
      {
        hostname: host,
        path,
        lookup: (_h, _o, cb) => cb(null, [{ address: ip, family: 4 }]),
        headers: { 'X-QA-Measure': marker },
      },
      r => {
        r.resume();
        r.on('end', () => {
          samples.push({ path, status: r.statusCode, wallMs: Math.round(performance.now() - start) });
          resolve();
        });
      },
    );
    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy(new Error('timeout')));
    req.end();
  });
try {
  await new Promise(r => setTimeout(r, 7000));
  for (let i = 0; i < 8; i++)
    for (const path of ['/api/v1/modules', '/api/v1/modules/7/full', '/api/v1/levels']) await call(path);
  await new Promise(r => setTimeout(r, 5000));
} finally {
  tail.kill();
}
const summary = [...new Set(samples.map(s => s.path))].map(path => {
  const captured = events.filter(e => e.path === path),
    cpu = captured
      .map(e => e.cpuMs)
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
  return {
    path,
    requests: samples.filter(s => s.path === path).length,
    captured: cpu.length,
    cpuMin: cpu[0],
    cpuMedian: cpu[Math.floor(cpu.length / 2)],
    cpuMax: cpu.at(-1),
    over10: cpu.filter(n => n > 10).length,
  };
});
await mkdir('.local/metrics', { recursive: true });
await writeFile(
  process.env.MEASURE_OUTPUT || '.local/metrics/public-cpu.json',
  JSON.stringify({ samples, events, summary }, null, 2),
);
console.log(JSON.stringify(summary));
