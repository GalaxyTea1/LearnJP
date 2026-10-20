import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';
const { code } = await transform(await readFile(new URL('../src/app/services/courseSummary.ts', import.meta.url), 'utf8'), { loader: 'ts', format: 'esm' });
const { summarizeCourse, mergeCatalogProgress } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const module = (id, status = 'NOT_STARTED', extra = {}) => ({ id, unitNumber: id, status, contentStatus: 'PUBLISHED', level: { level: 'N5' }, _count: { vocabulary: 45, kanji: 8, grammarPatterns: 5, quizQuestions: 15 }, ...extra });
test('counts published records for selected level only; excludes drafts', () => {
  const result = summarizeCourse([module(1), module(2), module(3, 'COMPLETED', { contentStatus: 'DRAFT' }), module(4, 'NOT_STARTED', { level: { level: 'N4' } })], 'N5');
  assert.deepEqual([result.count, result.vocabulary, result.kanji, result.grammar, result.completed], [2, 90, 16, 10, 0]);
});
test('guest starts first unit regardless of API order', () => {
  assert.equal(summarizeCourse([module(2), module(1)], 'N5').next.id, 1);
});
test('continue selects unfinished in-progress unit before untouched unit', () => {
  const result = summarizeCourse([module(1, 'COMPLETED'), module(2), module(4, 'IN_PROGRESS'), module(3, 'IN_PROGRESS')], 'N5');
  assert.equal(result.next.id, 3);
  assert.equal(result.completed, 1);
});
test('completed and locked courses have no misleading start/continue action', () => {
  assert.equal(summarizeCourse([module(1, 'COMPLETED'), module(2, 'LOCKED')], 'N5').next, undefined);
});
test('empty published catalog counts zero and never substitutes plan targets', () => {
  const result = summarizeCourse([], 'N5');
  assert.deepEqual([result.count, result.vocabulary, result.kanji, result.grammar], [0, 0, 0, 0]);
  assert.equal(result.next, undefined);
});

test('unknown account progress never becomes a fake start or completed count', () => {
  const merged = mergeCatalogProgress([module(1, 'COMPLETED')], null, false);
  assert.equal(merged[0].status, 'UNKNOWN');
  assert.equal(summarizeCourse(merged, 'N5').next, undefined);
  assert.equal(summarizeCourse(merged, 'N5').count, 1);
});
test('guest and successful empty progress are distinct from loading or failure', () => {
  assert.equal(mergeCatalogProgress([module(1)], null, true)[0].status, 'NOT_STARTED');
  assert.equal(mergeCatalogProgress([module(1)], [], false)[0].status, 'NOT_STARTED');
});
test('account progress joins by module id without adding unpublished records', () => {
  const merged = mergeCatalogProgress([module(1), module(2)], [{ moduleId: 2, status: 'IN_PROGRESS', progressPercent: 35 }, { moduleId: 999, status: 'COMPLETED', progressPercent: 100 }], false);
  assert.equal(merged.length, 2);
  assert.equal(merged[1].progressPercent, 35);
  assert.equal(summarizeCourse(merged, 'N5').next.id, 2);
});
