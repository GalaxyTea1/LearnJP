import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const result = await build({
  stdin: { contents: `export { answerDisplay } from './src/app/screens/study/answerDisplay'; export { ExerciseStudyTab } from './src/app/screens/study/tabs/ExerciseStudyTab';`, resolveDir: process.cwd(), loader: 'ts' },
  bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic',
});
const mod = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, mod, mod.exports);
const { answerDisplay, ExerciseStudyTab } = mod.exports;
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

test('zero and later indices resolve to the corresponding Japanese choice', () => {
  assert.equal(answerDisplay(0, ['学生', '先生']), '学生');
  assert.equal(answerDisplay(1, ['学生', '先生']), '先生');
});
test('missing or invalid content is readable, never a raw object', () => {
  assert.match(answerDisplay(null), /Chưa có/);
  assert.match(answerDisplay(4, ['学生']), /chưa hợp lệ/);
  assert.match(answerDisplay({ invalid: true }), /Chưa hỗ trợ/);
  assert.equal(answerDisplay('0'), '0');
  assert.equal(answerDisplay(false), 'Sai');
  assert.equal(answerDisplay(['日本', 'ベトナム']), '日本 · ベトナム');
});
test('reading questions included twice by the API render only under the passage', () => {
  const question = { id: 11, prompt: 'READING_UNIQUE_QUESTION', options: ['学生', '先生'], correctAnswer: 0 };
  const html = renderToStaticMarkup(React.createElement(ExerciseStudyTab, { sections: [{ id: 1, readingPassages: [{ id: 1, title: 'Reading', content: '日本語', exercises: [question] }], exercises: [question, { id: 12, prompt: 'Practice', correctAnswer: '日本' }] }] }));
  assert.equal(html.split('READING_UNIQUE_QUESTION').length - 1, 1);
  assert.match(html, /Bài tập vận dụng \(1 câu\)/);
});
