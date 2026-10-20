import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const bundle = await build({ entryPoints: ['src/app/screens/study/quizSession.ts'], bundle: true, write: false, platform: 'node', format: 'cjs' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(require, mod, mod.exports);
const { decodeQuizSession: decode, encodeQuizSession: encode, emptyQuizSession: empty, quizRevision, quizSessionKey } = mod.exports;
const questions = [{ id: 8, question: '学生?', options: ['Student', 'Teacher'], points: 10 }, { id: 9, question: '先生?', options: ['Student', 'Teacher'], points: 10 }];
const revision = quizRevision(questions);

test('draft round trip restores choice zero, position and elapsed time', () => {
  const session = { ...empty(), answers: { 8: 0 }, index: 1, seconds: 83 };
  assert.deepEqual(decode(encode(session, revision), revision, questions), session);
});
test('account, guest and module draft keys cannot overlap', () => {
  assert.equal(new Set([quizSessionKey(1), quizSessionKey(1, 2), quizSessionKey(1, 3), quizSessionKey(2, 2)]).size, 4);
});
test('question wording, options, order and points changes invalidate old attempts', () => {
  const raw = encode(empty(), revision);
  for (const changed of [[...questions].reverse(), [{ ...questions[0], question: 'New wording' }, questions[1]], [{ ...questions[0], options: [...questions[0].options].reverse() }, questions[1]], [{ ...questions[0], points: 20 }, questions[1]]]) {
    assert.equal(decode(raw, quizRevision(changed), changed), null);
  }
});
test('corrupt, obsolete or out-of-range drafts are rejected safely', () => {
  for (const raw of ['{', 'null', '[]', JSON.stringify({ version: 0, revision, session: empty() }), ...[
    { ...empty(), answers: { 8: 2 } }, { ...empty(), answers: { 44: 0 } }, { ...empty(), answers: { 8: -1 } },
    { ...empty(), index: 2 }, { ...empty(), seconds: -1 }, { ...empty(), answers: [] }, { ...empty(), result: { passed: true } },
  ].map(s => encode(s, revision))]) assert.equal(decode(raw, revision, questions), null);
});
test('submitted review restores skipped answers without changing server completion', () => {
  const session = { ...empty(), answers: { 8: 0 }, result: { score: 1, totalQuestions: 2, scorePercent: 50, passed: false, xpEarned: 0, results: [
    { questionId: 8, selected: 0, isCorrect: true, correctIndex: 0, explanation: 'Student' },
    { questionId: 9, selected: null, isCorrect: false, correctIndex: 1, explanation: 'Teacher' },
  ] } };
  assert.deepEqual(decode(encode(session, revision), revision, questions), session);
  session.result.results[1].questionId = 8;
  assert.equal(decode(encode(session, revision), revision, questions), null);
});


test('server grading revision invalidates an old draft even when visible questions are unchanged', () => {
  const before = quizRevision(questions, 'old-server-revision');
  const after = quizRevision(questions, 'new-server-revision');
  const raw = encode(empty(), before);
  assert.equal(decode(raw, after, questions), null);
  assert.notEqual(before, after);
});

test('pending submission survives draft reload with its original request ID and elapsed time',()=>{
  const session={...empty(),answers:{8:0},seconds:19,submission:{requestId:'b171cdce-7cba-4d24-84cd-741b70130c08',seconds:19}};
  assert.deepEqual(decode(encode(session,revision),revision,questions),session);
  assert.equal(decode(encode({...session,submission:{requestId:'invalid',seconds:19}},revision),revision,questions),null);
});
