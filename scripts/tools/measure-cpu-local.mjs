// Local CPU profile of Worker API handlers. Runs the bundled Worker in Node against an
// in-memory node:sqlite shim of D1 and reports time per request, excluding SQLite time
// (on Cloudflare, D1 executes outside the Worker's CPU budget). The run is synchronous and
// single-threaded, so high-resolution elapsed time stands in for CPU (process.cpuUsage
// has ~15 ms granularity on Windows).
// Usage: node --experimental-sqlite --no-warnings scripts/tools/measure-cpu-local.mjs [scenario] [iterations]
// Each scenario's first request is "cold" (first execution of that code in this process).
// Numbers are relative: Node is not workerd. Use them to compare before/after a change.
import { DatabaseSync } from 'node:sqlite';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { Session } from 'node:inspector/promises';
import { fixtures, quizQuestions, load } from '../test/learning-fixture.mjs';

let sqliteMicros = 0;
const timed = fn => {
  const s = performance.now();
  try {
    return fn();
  } finally {
    sqliteMicros += (performance.now() - s) * 1000;
  }
};
const clean = v => (v === undefined ? null : typeof v === 'boolean' ? Number(v) : v);
const plain = rows => rows.map(r => ({ ...r }));

function d1(raw) {
  const exec = (sql, args) =>
    timed(() => {
      const results = plain(raw.prepare(sql).all(...args.map(clean)));
      const { changes, id } = raw.prepare('SELECT changes() AS changes, last_insert_rowid() AS id').get();
      return { success: true, results, meta: { changes, last_row_id: id } };
    });
  const statement = (sql, args = []) => ({
    sql,
    args,
    bind: (...next) => statement(sql, next),
    async first(column) {
      const row = exec(sql, args).results[0] ?? null;
      return column ? (row?.[column] ?? null) : row;
    },
    async all() {
      return exec(sql, args);
    },
    async run() {
      return exec(sql, args);
    },
    async raw() {
      return exec(sql, args).results.map(Object.values);
    },
  });
  return {
    prepare: sql => statement(sql),
    async exec(sql) {
      timed(() => raw.exec(sql));
    },
    async batch(list) {
      timed(() => raw.exec('BEGIN'));
      try {
        const out = list.map(s => exec(s.sql, s.args));
        timed(() => raw.exec('COMMIT'));
        return out;
      } catch (error) {
        timed(() => raw.exec('ROLLBACK'));
        throw error;
      }
    },
  };
}

const raw = new DatabaseSync(':memory:');
raw.exec('PRAGMA foreign_keys=ON');
for (const name of (await readdir(new URL('../../backend/cloudflare/migrations/', import.meta.url)))
  .filter(n => n.endsWith('.sql'))
  .sort())
  raw.exec(await readFile(new URL('../../backend/cloudflare/migrations/' + name, import.meta.url), 'utf8'));
const db = d1(raw);
await fixtures(db);
await quizQuestions(db);

const origin = 'http://127.0.0.1:8787';
const env = {
  DB: db,
  APP_ENV: 'local',
  FRONTEND_URL: origin,
  JWT_SECRET: 'local-only-auth-key-never-use-in-production-2026',
  QUIZ_REVISION_SECRET: 'local-only-quiz-revision-key-not-for-production',
  ASSETS: { fetch: async () => new Response('') },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };
const worker = (await load('worker')).default;
const { Auth } = await load('auth');
const login = await new Auth(env).providerLogin(
  'https://bench.invalid',
  crypto.randomUUID(),
  'bench@test.invalid',
  'email',
);
let access = login.data.accessToken,
  cookie = 'sumaryjp_refresh=' + login.refresh;

const call = (path, { method = 'GET', body, auth = false, headers = {} } = {}) =>
  worker.fetch(
    new Request(origin + '/api/v1' + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'SumaryJP',
        Origin: origin,
        ...(auth ? { Authorization: 'Bearer ' + access } : {}),
        ...headers,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }),
    env,
    ctx,
  );
const revision = (await (await call('/quizzes/module/1')).json()).meta.quizRevision;
const questions = (await (await call('/quizzes/module/1')).json()).data;

const scenarios = {
  catalog: { run: () => call('/modules') },
  'full-unit': { run: () => call('/modules/1/full') },
  'progress-me': { run: () => call('/progress/me', { auth: true }) },
  'study-save': {
    run: () =>
      call('/progress/module/1/study', {
        method: 'PATCH',
        auth: true,
        body: { completedTabs: ['grammar'], vocabulary: [{ id: 1, mastered: true }] },
      }),
  },
  'quiz-submit': {
    run: () =>
      call('/quizzes/submit', {
        method: 'POST',
        auth: true,
        body: {
          moduleId: 1,
          requestId: crypto.randomUUID(),
          quizRevision: revision,
          answers: questions.map(q => ({ questionId: q.id, selectedIndex: 0 })),
          timeTaken: 30,
        },
      }),
  },
  refresh: {
    before: () => raw.exec('DELETE FROM auth_rate_limits'),
    run: () => call('/auth/refresh', { method: 'POST', body: {}, headers: { Cookie: cookie } }),
    after: (response, text) => {
      const set = response.headers.get('set-cookie');
      if (set) cookie = set.split(';')[0];
      access = JSON.parse(text).data?.accessToken ?? access;
    },
  },
};

async function measure(scenario) {
  await scenario.before?.();
  sqliteMicros = 0;
  const wall = performance.now();
  const response = await scenario.run();
  const text = await response.text();
  const usedMs = performance.now() - wall;
  const result = { status: response.status, cpuMs: usedMs - sqliteMicros / 1000, sqliteMs: sqliteMicros / 1000 };
  await scenario.after?.(response, text);
  return result;
}

const [only, count = '200'] = process.argv.slice(2);
const iterations = Number(count);
const report = {};
for (const [name, scenario] of Object.entries(scenarios)) {
  if (only && only !== name) continue;
  // CPU_PROFILE=<file> records only the cold request (V8 .cpuprofile) for attribution.
  const session = process.env.CPU_PROFILE ? new Session() : undefined;
  if (session) {
    session.connect();
    await session.post('Profiler.enable');
    await session.post('Profiler.setSamplingInterval', { interval: 20 });
    await session.post('Profiler.start');
  }
  const cold = await measure(scenario);
  if (session) {
    const { profile } = await session.post('Profiler.stop');
    await writeFile(process.env.CPU_PROFILE, JSON.stringify(profile));
    session.disconnect();
  }
  if (cold.status >= 400) throw new Error(`${name} returned ${cold.status}`);
  const warm = [];
  for (let i = 0; i < iterations; i++) warm.push((await measure(scenario)).cpuMs);
  warm.sort((a, b) => a - b);
  const pick = p => (warm.length ? +warm[Math.min(warm.length - 1, Math.floor(p * warm.length))].toFixed(2) : null);
  report[name] = {
    status: cold.status,
    coldCpuMs: +cold.cpuMs.toFixed(2),
    warmMedianMs: pick(0.5),
    warmP95Ms: pick(0.95),
    sqliteColdMs: +cold.sqliteMs.toFixed(2),
  };
}
console.table(report);
