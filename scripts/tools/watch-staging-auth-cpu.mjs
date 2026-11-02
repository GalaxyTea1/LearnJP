import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const output = process.argv[2] || '.local/metrics/live-auth-write-2026-10-24.json',
  events = [];
let buffer = '',
  depth = 0,
  quoted = false,
  escape = false;
mkdirSync('.local/metrics', { recursive: true });
const child = spawn(
  process.execPath,
  ['node_modules/wrangler/bin/wrangler.js', 'tail', '--config', 'wrangler.staging.json', '--format', 'json'],
  { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } },
);
child.stderr.on('data', () => {});
child.stdout.on('data', chunk => {
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
        const e = JSON.parse(buffer),
          path = new URL(e.event.request.url).pathname;
        if (/^\/api\/v1\/(auth|progress|quizzes)/.test(path)) {
          const row = {
            time: e.eventTimestamp,
            path,
            method: e.event.request.method,
            status: e.event.response?.status,
            cpuMs: e.cpuTime,
            wallMs: e.wallTime,
            outcome: e.outcome,
          };
          events.push(row);
          console.log(JSON.stringify(row));
          writeFileSync(output, JSON.stringify(events, null, 2));
        }
      } catch {}
      buffer = '';
    }
  }
});
setTimeout(() => child.kill(), 900000);
child.on('exit', () => process.exit());
