import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const names = ['Kanji', 'Grammar', 'Dialogue', 'Exercise', 'Vocab'];
const bundle = await build({ stdin: { resolveDir: process.cwd(), loader: 'ts', contents: names.map(n => `export { ${n}StudyTab } from './src/app/screens/study/tabs/${n}StudyTab';`).join('\n') }, bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic' });
const mod = { exports: {} }; new Function('require','module','exports',bundle.outputFiles[0].text)(require,mod,mod.exports);
const React = require('react'); const { renderToStaticMarkup } = require('react-dom/server');
const fixtures = {
  Kanji: { kanjiList: [{ id: 1, character: '日', meaning: 'day', onyomi: 'ニチ', kunyomi: 'ひ', strokeCount: 4 }] },
  Grammar: { grammarPatterns: [{ id: 1, pattern: 'です', meaning: 'is', explanation: 'Example', examples: [] }] },
  Dialogue: { sections: [{ id: 1, conversations: [{ id: 1, title: 'Greeting', lines: [{ id: 1, speaker: 'A', japanese: 'こんにちは', translation: 'Hello', sortOrder: 0 }] }] }] },
  Exercise: { sections: [{ id: 1, exercises: [{ id: 1, prompt: 'Choose', options: ['A','B'], correctAnswer: 0 }] }] },
  Vocab: { vocabulary: [{ id: 1, japanese: '日', hiragana: 'ひ', romaji: 'hi', english: 'day' }], masteredIds: new Set(), onToggleMastered: () => {} },
};
for (const name of names) test(`${name}: failed progress disables only save controls; recovery enables them`, () => {
  const render = ready => renderToStaticMarkup(React.createElement(mod.exports[name + 'StudyTab'], { ...fixtures[name], onCompleteTab: () => {}, progressReady: ready }));
  const html = render(false);
  const buttons = [...html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)].map(m => m[0]);
  const disabled = buttons.filter(b => /disabled=""/.test(b));
  assert.equal(disabled.length, 1);
  assert.match(disabled[0], name === 'Vocab' ? /Đánh dấu đã thuộc/ : /hoàn thành/);
  assert.ok(buttons.some(b => !/disabled=""/.test(b)), 'reading/listening/practice remains enabled');
  assert.doesNotMatch(html, /<fieldset[^>]*disabled/);
  assert.doesNotMatch(render(true), /<button[^>]*disabled=""/);
});
