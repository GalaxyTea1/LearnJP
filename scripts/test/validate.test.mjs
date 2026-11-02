// Differential test: the in-house validator must accept/reject exactly what zod did, with the
// same output data, for every schema shape the Worker uses.
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { z as zod } from 'zod';
import { build } from '../../frontend/node_modules/esbuild/lib/main.js';
import { load } from './learning-fixture.mjs';

const { z: mine } = await load('validate');
const uuid = '123e4567-e89b-42d3-a456-426614174000';
const values = [
  undefined,
  null,
  true,
  false,
  0,
  -1,
  1,
  1.5,
  2 ** 53,
  NaN,
  Infinity,
  '',
  ' ',
  'a',
  ' Ab ',
  'x'.repeat(73),
  'ü'.repeat(40),
  'a@b.co',
  ' A@B.CO ',
  'a..b@c.de',
  '.a@b.cd',
  'a@b',
  uuid,
  uuid.toUpperCase(),
  '00000000-0000-0000-0000-000000000000',
  '123e4567-e89b-02d3-a456-426614174000',
  'vocab',
  'grammar',
  'N5',
  'f'.repeat(64),
  'F'.repeat(64),
  '12:30',
  '24:00',
  '2026-10-28T10:00:00Z',
  '2026-10-28T10:00Z',
  '2026-02-29T10:00:00Z',
  '2028-02-29T10:00:00.5+07:00',
  '2026-10-28T10:00:00+0700',
  [],
  [1],
  [1, 2, 3, 4, 5, 6],
  ['vocab', 'kanji'],
  ['quiz'],
  {},
  { a: 1 },
  Object.create(null),
];
const objects = [
  {},
  { moduleId: 1, answers: [{ questionId: 1, selectedIndex: 0 }], quizRevision: 'a'.repeat(64), requestId: uuid },
  {
    moduleId: 1,
    answers: [{ questionId: 1, selectedIndex: 0, extra: 1 }],
    quizRevision: 'a'.repeat(64),
    requestId: uuid,
    timeTaken: 5,
  },
  { moduleId: 1, answers: [], quizRevision: 'a'.repeat(64), requestId: uuid },
  { moduleId: 0, answers: [{ questionId: -1, selectedIndex: 1.5 }], quizRevision: 'x', requestId: 'y' },
  {
    moduleId: 1,
    answers: [{ questionId: 1, selectedIndex: 0 }],
    quizRevision: 'a'.repeat(64),
    requestId: uuid,
    unknown: true,
  },
  { completedTabs: ['vocab'], vocabulary: [{ id: 1, mastered: true }] },
  { completedTabs: undefined },
  { vocabulary: [{ id: 1 }] },
  { completedTabs: ['vocab', 'x'] },
  { email: ' User@Example.COM ', username: 'ab_c', password: 'p'.repeat(8) },
  { email: 'bad', username: 'a', password: 'ü'.repeat(40) },
  { weeklyGoalTarget: 5, dailyReminderTime: null, preferredLevel: null },
  { weeklyGoalTarget: undefined, dailyReminderTime: '07:30' },
  { preferredLevel: 'N9' },
  { gameType: 'QUIZ', score: 10, details: { a: [1] } },
  { gameType: 'QUIZ', score: 10, details: [] },
  { gameType: 'MATCH', score: -1, streak: 2 },
];
const schemas = {
  string: z => z.string(),
  trimmed: z => z.string().trim().min(1).max(5),
  email: z => z.string().trim().toLowerCase().email().max(254),
  username: z =>
    z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/),
  bytes: z =>
    z
      .string()
      .max(72)
      .refine(v => new TextEncoder().encode(v).length <= 72),
  uuid: z => z.string().uuid(),
  optionalUuid: z => z.string().uuid().optional(),
  revision: z => z.string().regex(/^[0-9a-f]{64}$/),
  int: z => z.number().int(),
  positive: z => z.number().int().positive(),
  bounded: z => z.number().int().min(0).max(5),
  number: z => z.number(),
  boolean: z => z.boolean(),
  enum: z => z.enum(['vocab', 'kanji', 'grammar']),
  nullableEnum: z => z.enum(['N5', 'N4']).nullable().optional(),
  time: z =>
    z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .nullable(),
  datetime: z => z.iso.datetime({ offset: true }).nullable().optional(),
  array: z => z.array(z.number().int()).min(1).max(5),
  defaulted: z =>
    z
      .array(z.enum(['vocab', 'kanji']))
      .max(5)
      .default([]),
  record: z => z.record(z.string(), z.unknown()),
  unknown: z => z.unknown(),
  quiz: z => {
    const id = z.number().int().positive();
    return z
      .object({
        moduleId: id,
        answers: z
          .array(z.object({ questionId: id, selectedIndex: z.number().int().min(0) }).strict())
          .min(1)
          .max(1000),
        timeTaken: z.number().int().min(0).max(86400).optional(),
        quizRevision: z.string().regex(/^[0-9a-f]{64}$/),
        requestId: z.string().uuid(),
      })
      .strict();
  },
  study: z =>
    z
      .object({
        completedTabs: z
          .array(z.enum(['vocab', 'kanji', 'grammar', 'dialogue', 'exercise']))
          .max(5)
          .default([]),
        vocabulary: z
          .array(z.object({ id: z.number().int().positive(), mastered: z.boolean() }).strict())
          .max(1000)
          .default([]),
      })
      .strict(),
  stripping: z =>
    z.object({
      email: z.string().trim().toLowerCase().email().max(254),
      username: z.string().min(3).max(30),
      password: z.string().max(72).min(8),
    }),
  settings: z =>
    z
      .object({
        weeklyGoalTarget: z.number().int().min(1).max(1000).optional(),
        dailyReminderTime: z
          .string()
          .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
          .nullable()
          .optional(),
        preferredLevel: z.enum(['N5', 'N4', 'N3', 'N2', 'N1']).nullable().optional(),
      })
      .strict(),
  game: z =>
    z
      .object({
        gameType: z.enum(['QUIZ', 'MATCH', 'SPEED']),
        score: z.number().int().min(0).max(100000),
        streak: z.number().int().min(0).max(10000).optional(),
        details: z.record(z.string(), z.unknown()).optional(),
      })
      .strict(),
  immutable: z => {
    const id = z.number().int().positive();
    id.max(2);
    return z.array(id);
  },
};

function same(name, a, b, input) {
  const x = a.safeParse(input),
    y = b.safeParse(input);
  assert.equal(y.success, x.success, `${name} success differs for ${JSON.stringify(input)}`);
  if (x.success) assert.deepEqual(y.data, x.data, `${name} data differs for ${JSON.stringify(input)}`);
  else
    assert.deepEqual(
      y.error.issues.map(i => i.path.join('.')).sort(),
      [...new Set(x.error.issues.map(i => i.path.join('.')))].sort(),
      `${name} issue paths differ for ${JSON.stringify(input)}`,
    );
}

test('builder schemas match zod for edge-case inputs', () => {
  for (const [name, make] of Object.entries(schemas)) {
    const a = make(zod),
      b = make(mine);
    for (const input of [...values, ...objects, values]) same(name, a, b, input);
  }
});

test('defaults are fresh copies, never shared between parses', () => {
  const schema = mine.object({ tabs: mine.array(mine.string()).default([]) });
  const first = schema.safeParse({}).data;
  first.tabs.push('x');
  assert.deepEqual(schema.safeParse({}).data.tabs, []);
});

test('admin content schemas match zod on the production schema definitions', async () => {
  const entry = fileURLToPath(new URL('../../backend/cloudflare/admin-validation.ts', import.meta.url));
  const bundle = async real =>
    (
      await build({
        entryPoints: [entry],
        bundle: true,
        format: 'esm',
        platform: 'browser',
        write: false,
        plugins: real
          ? [
              {
                name: 'real-zod',
                setup(b) {
                  b.onResolve({ filter: /^\.\/validate$/ }, () => ({ path: 'real-zod', namespace: 'shim' }));
                  b.onLoad({ filter: /.*/, namespace: 'shim' }, () => ({
                    contents: "export { z } from 'zod';",
                    resolveDir: process.cwd(),
                  }));
                },
              },
            ]
          : [],
      })
    ).outputFiles[0].text;
  const importText = text => import('data:text/javascript;base64,' + Buffer.from(text).toString('base64'));
  const ours = await importText(await bundle(false)),
    theirs = await importText(await bundle(true));
  const rows = [
    {},
    { title: 'x' },
    { version: 1 },
    { version: 1, contentStatus: 'PUBLISHED' },
    { version: 1, title: '  ' },
    { version: 0 },
    { levelId: 1, unitNumber: 2, title: 'T', titleJp: 'J', description: 'D', topics: ['a'] },
    { levelId: 1, unitNumber: 2, title: 'T', titleJp: 'J', description: 'D', topics: [] },
    { moduleId: null, japanese: '水', romaji: 'mizu', english: 'water', type: 'NOUN', level: 'N5' },
    { moduleId: 3, japanese: '水', romaji: 'mizu', english: 'water', type: 'THING' },
    {
      moduleId: 1,
      character: ' 水 ',
      meaning: 'water',
      level: 'N5',
      exampleWords: [{ jp: '水', en: 'water' }],
      strokeCount: null,
    },
    {
      moduleId: 1,
      pattern: 'p',
      meaning: 'm',
      explanation: 'e',
      level: 'N5',
      examples: [{ japanese: 'j', english: 'e', extra: 1 }],
    },
    { moduleId: 1, question: 'q', options: ['a', 'b'], correctIndex: 1, explanation: 'e', points: 1001 },
    { moduleId: 1, question: 'q', options: ['a'], correctIndex: 0, explanation: 'e' },
    { title: 't', content: 'c', expiresAt: '2026-10-28T10:00:00+07:00' },
    { title: 't', content: 'c', expiresAt: '2026-10-28T10:00' },
    { title: 'x'.repeat(501), content: 'c' },
    { role: 'ADMIN' },
    { role: 'OWNER', isActive: 1 },
    { key: 'site.name', value: 'v' },
    { key: '1bad', value: 'v', description: null },
  ];
  const pairs = [
    ...Object.keys(theirs.schemas).flatMap(k => [
      [k, theirs.schemas[k], ours.schemas[k]],
      [k + '.partial', theirs.schemas[k].partial(), ours.schemas[k].partial()],
    ]),
    ['moduleUpdate', theirs.moduleUpdate, ours.moduleUpdate],
    ['userStatus', theirs.userStatus, ours.userStatus],
    ['setting', theirs.setting, ours.setting],
  ];
  for (const [name, a, b] of pairs) for (const row of rows) same(name, a, b, row);
  for (const row of rows)
    for (const kind of Object.keys(theirs.schemas)) {
      let expected, actual;
      try {
        expected = theirs.contentInput(kind, row);
      } catch (e) {
        expected = e.message;
      }
      try {
        actual = ours.contentInput(kind, row);
      } catch (e) {
        actual = e.message;
      }
      assert.deepEqual(actual, expected, `contentInput(${kind}) ${JSON.stringify(row)}`);
    }
});
