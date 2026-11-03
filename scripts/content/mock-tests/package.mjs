// Mock tests (3 × N4, 3 × N3) as D1 rows in the reserved block 50001–50999.
// Vocabulary/Kanji questions are generated from published lesson vocabulary; grammar, reading and listening
// come from content/tests/mock-tests.mjs. Templates start unpublished (is_published=0).
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mocks } from '../../../content/tests/mock-tests.mjs';
import { encodeRow } from '../n5/package.mjs';

export const firstId = 50001,
  lastId = 50999;
const pad = n => String(n).padStart(2, '0');
async function lessonVocab(level) {
  const units = level === 'N4' ? 13 : 15,
    dir = level === 'N4' ? 'n4' : 'n3',
    rows = [];
  for (let u = 1; u <= units; u++)
    rows.push(
      ...(await import(`../../../content/${dir}/${dir}-${pad(u)}.mjs`)).vocab.map(v => ({
        japanese: v[0],
        reading: v[1],
        meaning: v[3],
        type: v[4],
        exampleJp: v[5],
        exampleVi: v[6],
        unit: `${level}-${pad(u)}`,
      })),
    );
  return rows;
}
const hasKanji = s => /[一-鿿]/.test(s);
const rank = s => createHash('sha256').update(s).digest('hex');
// Plausible misreadings: voicing, long vowels, small っ and small ゃゅょ.
const voiced = {
  か: 'が',
  き: 'ぎ',
  く: 'ぐ',
  け: 'げ',
  こ: 'ご',
  さ: 'ざ',
  し: 'じ',
  す: 'ず',
  せ: 'ぜ',
  そ: 'ぞ',
  た: 'だ',
  ち: 'ぢ',
  つ: 'づ',
  て: 'で',
  と: 'ど',
  は: 'ば',
  ひ: 'び',
  ふ: 'ぶ',
  へ: 'べ',
  ほ: 'ぼ',
};
const unvoiced = Object.fromEntries(Object.entries(voiced).map(([a, b]) => [b, a]));
const small = { ゃ: 'や', ゅ: 'ゆ', ょ: 'よ', や: 'ゃ', ゆ: 'ゅ', よ: 'ょ' };
function misreadings(reading) {
  const out = new Set(),
    chars = [...reading];
  chars.forEach((c, i) => {
    const swap = voiced[c] ?? unvoiced[c];
    if (swap && swap !== 'ぢ' && swap !== 'づ') out.add([...chars.slice(0, i), swap, ...chars.slice(i + 1)].join(''));
    if (c === 'う' && i > 0) out.add([...chars.slice(0, i), ...chars.slice(i + 1)].join(''));
    if (
      /[おこそとのほもよろごぞどぼょゅくすつぬふむゆるぐずぶ]/.test(c) &&
      chars[i + 1] !== 'う' &&
      i < chars.length - 1
    )
      out.add([...chars.slice(0, i + 1), 'う', ...chars.slice(i + 1)].join(''));
    if (c === 'っ') out.add([...chars.slice(0, i), ...chars.slice(i + 1)].join(''));
    if (small[c] && i > 0 && (/[ゃゅょ]/.test(c) || /[きしちにひみりぎじびぴ]/.test(chars[i - 1])))
      out.add([...chars.slice(0, i), small[c], ...chars.slice(i + 1)].join(''));
  });
  out.delete(reading);
  return [...out].filter(r => !/^[ゃゅょっ]/.test(r)).sort((a, b) => rank(a).localeCompare(rank(b)));
}
function vocabularySection(pool, mockIndex) {
  const known = new Set(pool.map(v => v.reading));
  const reading = pool
    .filter(
      v =>
        hasKanji(v.japanese) &&
        v.exampleJp.includes(v.japanese) &&
        misreadings(v.reading).filter(r => !known.has(r)).length >= 3,
    )
    .sort((a, b) => rank(a.japanese).localeCompare(rank(b.japanese)));
  const context = pool
    .filter(
      v =>
        ['NOUN', 'ADJECTIVE'].includes(v.type) &&
        [...v.japanese].length >= 2 &&
        v.exampleJp.split(v.japanese).length === 2,
    )
    .sort((a, b) => rank('c' + a.japanese).localeCompare(rank('c' + b.japanese)));
  const readingWords = reading.slice(mockIndex * 6, mockIndex * 6 + 6),
    used = new Set(readingWords.map(v => v.japanese));
  const contextWords = context.filter(v => !used.has(v.japanese)).slice(mockIndex * 6, mockIndex * 6 + 6);
  assert.equal(readingWords.length, 6);
  assert.equal(contextWords.length, 6);
  const questions = [];
  for (const v of readingWords) {
    const wrong = misreadings(v.reading)
      .filter(r => !known.has(r))
      .slice(0, 3);
    questions.push([
      `「${v.japanese}」の読み方として最もよいものはどれですか。\n${v.exampleJp.replace(v.japanese, `【${v.japanese}】`)}`,
      v.reading,
      ...wrong,
      `${v.japanese}（${v.reading}）: ${v.meaning}. Từ bài ${v.unit}.`,
    ]);
  }
  for (const v of contextWords) {
    const wrong = context
      .filter(w => w.type === v.type && w.japanese !== v.japanese && !v.exampleJp.includes(w.japanese))
      .sort((a, b) => rank(v.japanese + a.japanese).localeCompare(rank(v.japanese + b.japanese)))
      .slice(0, 3)
      .map(w => w.japanese);
    questions.push([
      `（　）に入れるのに最もよいものはどれですか。\n${v.exampleJp.replace(v.japanese, '（　）')}\n（${v.exampleVi}）`,
      v.japanese,
      ...wrong,
      `${v.japanese}（${v.reading}）: ${v.meaning}. Từ bài ${v.unit}.`,
    ]);
  }
  return questions;
}

export async function mockTestsPackage() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-11-15T00:00:00.000Z',
    rows = { test_templates: [], test_sections: [], test_questions: [] };
  const add = (table, data) => {
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(row, { id: firstId + rows[table].length }, data);
    rows[table].push(encodeRow(row, columns[table]));
    return row.id;
  };
  const pools = { N4: await lessonVocab('N4'), N3: await lessonVocab('N3') };
  let rotation = 0;
  const choices = q => {
    const [questionText, correct, ...rest] = q;
    const explanation = rest.pop(),
      options = [correct, ...rest];
    assert.equal(new Set(options).size, 4, questionText);
    const shift = rotation++ % 4;
    return {
      questionText,
      options: [...options.slice(shift), ...options.slice(0, shift)],
      correctAnswer: (4 - shift) % 4,
      explanation,
    };
  };
  for (const m of mocks) {
    const vocabulary = vocabularySection(pools[m.level], m.number - 1);
    const sections = [
      [
        'VOCABULARY',
        '文字・語彙 — Từ vựng và Hán tự',
        m.level === 'N4' ? 15 : 20,
        vocabulary.map(q => ({ q, type: 'MULTIPLE_CHOICE' })),
      ],
      ['GRAMMAR', '文法 — Ngữ pháp', m.level === 'N4' ? 15 : 20, m.grammar.map(q => ({ q, type: 'FILL_BLANK' }))],
      [
        'READING',
        '読解 — Đọc hiểu',
        m.level === 'N4' ? 20 : 25,
        m.reading.flatMap(r => r.questions.map(q => ({ q, type: 'READING_COMP', passage: r.passage }))),
      ],
      [
        'LISTENING',
        '聴解 — Nghe hiểu',
        10,
        m.listening.flatMap(l => l.questions.map(q => ({ q, type: 'LISTENING_COMP', passage: l.script }))),
      ],
    ];
    const total = sections.reduce((n, s) => n + s[3].length, 0);
    assert.equal(
      sections.reduce((n, s) => n + s[2], 0),
      m.durationMinutes,
    );
    const templateId = add('test_templates', {
      title: m.title,
      level: m.level,
      description: `Đề luyện tổng hợp ${m.level} do LearnJP biên soạn (không phải đề JLPT chính thức): ${total} câu, ${m.durationMinutes} phút, gồm từ vựng và Hán tự, ngữ pháp, đọc hiểu, nghe hiểu. Chỉ dùng nội dung đã học trong khóa ${m.level}. Mục tiêu đạt từ 70%.`,
      durationMinutes: m.durationMinutes,
      totalQuestions: total,
      isPublished: false,
      createdAt: stamp,
      updatedAt: stamp,
    });
    sections.forEach(([sectionType, title, durationMinutes, items], i) => {
      const sectionId = add('test_sections', { templateId, sectionType, title, durationMinutes, sortOrder: i + 1 });
      items.forEach(({ q, type, passage }, n) =>
        add('test_questions', {
          sectionId,
          questionType: type,
          passage: passage ?? null,
          ...choices(q),
          points: 1,
          sortOrder: n + 1,
        }),
      );
    });
  }
  for (const [t, r] of Object.entries(rows)) assert.ok(r.at(-1).id <= lastId, t);
  return rows;
}
