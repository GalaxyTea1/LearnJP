import { getPlatformProxy } from 'wrangler';
import { migrate, fixtures, quizQuestions, load } from '../test/learning-fixture.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const proxy = await getPlatformProxy({
  configPath: 'wrangler.local.jsonc',
  persist: false,
  remoteBindings: false,
  envFiles: [],
});
const raw = proxy.env.DB,
  report = [];
let metas = [];
const wrap = s => ({
  bind(...args) {
    return wrap(s.bind(...args));
  },
  _raw: s,
  async all() {
    const r = await s.all();
    metas.push(r.meta);
    return r;
  },
  async first(column) {
    const r = await this.all(),
      row = r.results[0] ?? null;
    return column && row ? row[column] : row;
  },
  async run() {
    const r = await s.run();
    metas.push(r.meta);
    return r;
  },
});
const db = {
  prepare: sql => wrap(raw.prepare(sql)),
  async batch(statements) {
    const results = await raw.batch(statements.map(s => s._raw));
    metas.push(...results.map(r => r.meta));
    return results;
  },
};
async function measure(name, work) {
  metas = [];
  const result = await work();
  report.push({
    name,
    statements: metas.length,
    rowsRead: metas.reduce((n, m) => n + (m.rows_read || 0), 0),
    rowsWritten: metas.reduce((n, m) => n + (m.rows_written || 0), 0),
  });
  return result;
}
try {
  await migrate(raw);
  await fixtures(raw);
  await quizQuestions(raw, 10);
  const { Auth } = await load('auth'),
    { Study } = await load('study'),
    { Assessments } = await load('assessments'),
    { Content } = await load('content');
  const auth = new Auth({
    ...proxy.env,
    DB: db,
    APP_ENV: 'local',
    FRONTEND_URL: 'http://127.0.0.1:8787',
    JWT_SECRET: 'local-only-auth-measurement-secret-not-production',
  });
  const subject = crypto.randomUUID(),
    issuer = 'https://test.supabase.co';
  const first = await measure('provider_first_login_local_only', () =>
    auth.providerLogin(issuer, subject, 'measure@test.invalid', 'email'),
  );
  const login = await measure('provider_returning_login_local_only', () =>
    auth.providerLogin(issuer, subject, 'measure@test.invalid', 'email'),
  );
  const renewed = await measure('refresh_repository', () => auth.refresh(login.refresh));
  const user = first.data.user.id,
    study = new Study(db, user),
    assess = new Assessments(db, user, 'local-only-quiz-revision-key-not-production');
  const patch = { completedTabs: ['grammar'], vocabulary: [{ id: 1, mastered: true }] };
  await measure('study_first_save', () => study.write(1, patch));
  await measure('study_repeat_save', () => study.write(1, patch));
  const q = await new Content(raw, 'local-only-quiz-revision-key-not-production').questions(1);
  const payload = {
    moduleId: 1,
    requestId: crypto.randomUUID(),
    quizRevision: q.quizRevision,
    answers: q.questions.map(q => ({ questionId: q.id, selectedIndex: 0 })),
    timeTaken: 30,
  };
  await measure('quiz_first_pass', () => assess.quiz(payload));
  await measure('quiz_same_request_replay', () => assess.quiz(payload));
  await measure('quiz_new_attempt_after_pass', () => assess.quiz({ ...payload, requestId: crypto.randomUUID() }));
  await measure('logout_repository', () => auth.logout(renewed.refresh));
  await mkdir('.local/metrics', { recursive: true });
  await writeFile(
    '.local/metrics/auth-write-local-2026-10-24.json',
    JSON.stringify(
      {
        scope:
          'Isolated local D1 fixture, 10 quiz questions and 2 vocabulary items; excludes HTTP auth/rate-limit overhead and Supabase network; NOT remote CPU or production quota estimates',
        report,
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(report));
} finally {
  await proxy.dispose();
}
