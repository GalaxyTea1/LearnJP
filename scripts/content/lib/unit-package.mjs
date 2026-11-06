// Turns a lesson content module (content/<level>/<code>.mjs) into rows for the 13 lesson tables.
// Every row of a lesson gets an ID in the lesson's own block (moduleId … moduleId + 999).
// Used by the N2 and N1 lessons; N3 and N4 keep their original per-lesson builders.
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { encodeRow } from '../n5/package.mjs';

const sectionTypes = [
  'OVERVIEW',
  'VOCABULARY',
  'KANJI',
  'GRAMMAR',
  'KAIWA',
  'LISTENING',
  'READING',
  'WRITING',
  'EXERCISE',
  'SUMMARY',
];
// Lesson quiz: 3 vocabulary, 3 kanji, 11 grammar, 4 listening and 4 reading questions = 25.
const quizGrammar = [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13];

// Rotates the options so the correct answer is spread evenly over A–D.
const choices = (q, i) => {
  const [prompt, correct, ...rest] = q;
  const explanation = rest.pop(),
    options = [correct, ...rest];
  const shift = i % 4;
  return {
    prompt,
    options: [...options.slice(shift), ...options.slice(0, shift)],
    correctAnswer: (4 - shift) % 4,
    explanation,
  };
};

/**
 * @param content the lesson content module
 * @param lesson  { level, code, unitNumber, moduleId, levelId, stamp, title, titleJp, description, topics,
 *                  sectionTitles[10], instructions[10], textbook, rubric, levelRow? }
 */
export async function buildLessonRows(content, lesson) {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const {
    vocab,
    kanji,
    grammar,
    dialogues,
    readings,
    listenings,
    grammarQuestions,
    listenQuestions,
    readQuestions,
    writing,
    kanjiQuestions,
  } = content;
  const { level, code, moduleId, levelId, stamp } = lesson;
  const rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: moduleId + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    list.push(encodeRow(row, columns[table]));
    return row.id;
  };

  if (lesson.levelRow) add('jlpt_levels', { level, ...lesson.levelRow });
  add('learning_modules', {
    levelId,
    unitNumber: lesson.unitNumber,
    title: lesson.title,
    titleJp: lesson.titleJp,
    description: lesson.description,
    topics: lesson.topics,
    sortOrder: lesson.unitNumber,
    contentStatus: 'DRAFT',
  });
  assert.equal(lesson.sectionTitles.length, 10);
  assert.equal(lesson.instructions.length, 10);
  const section = {};
  sectionTypes.forEach(
    (type, i) =>
      (section[type] = add('lesson_sections', {
        moduleId,
        sectionType: type,
        title: lesson.sectionTitles[i],
        instructions: lesson.instructions[i],
        sortOrder: i + 1,
        isRequired: true,
      })),
  );

  for (const [japanese, hiragana, romaji, meaning, type, exampleJp, exampleEn] of vocab)
    add('vocabulary', {
      moduleId,
      japanese,
      hiragana,
      romaji,
      english: meaning,
      type,
      level,
      lesson: code,
      exampleJp,
      exampleEn,
    });
  for (const [character, meaning, onyomi, kunyomi, strokes, radical, examples] of kanji)
    add('kanji', {
      moduleId,
      character,
      meaning,
      onyomi,
      kunyomi,
      strokeCount: Number(strokes),
      radical,
      level,
      exampleWords: examples.split('; ').map(s => ({ jp: s.split(': ')[0], en: s.split(': ')[1] })),
      relatedChars: [],
      mnemonic: `Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ghép ví dụ.`,
    });
  for (const [pattern, meaning, explanation, examples] of grammar) {
    const grammarPatternId = add('grammar_patterns', {
      moduleId,
      pattern,
      meaning,
      explanation,
      level,
      lesson: code,
      textbook: lesson.textbook,
    });
    examples.forEach(([japanese, english], i) =>
      add('grammar_examples', { grammarPatternId, japanese, english, sortOrder: i + 1 }),
    );
  }
  dialogues.forEach(([title, context, lines], i) => {
    const conversationId = add('conversations', { sectionId: section.KAIWA, title, context, sortOrder: i + 1 });
    lines.forEach(([japanese, translation], n) =>
      add('conversation_lines', {
        conversationId,
        speaker: n % 2 ? 'B' : 'A',
        japanese,
        translation,
        sortOrder: n + 1,
      }),
    );
  });
  const listens = listenings.map(([title, transcript, transcriptTranslation], i) =>
    add('listening_content', {
      sectionId: section.LISTENING,
      title,
      transcript,
      transcriptTranslation,
      instructions: 'Nghe và trả lời câu hỏi bên dưới. Sau đó mở bản chép và bản dịch để tự kiểm.',
      audioUrl: 'TTS:ja-JP',
      playbackSpeed: 1,
      source: 'Original LearnJP; browser TTS',
      sortOrder: i + 1,
    }),
  );
  const reads = readings.map(([title, text, translation], i) =>
    add('reading_passages', {
      sectionId: section.READING,
      title,
      content: text,
      translation,
      estimatedLevel: level,
      source: 'Original LearnJP',
      sortOrder: i + 1,
    }),
  );
  writing.forEach(([title, prompt, sampleAnswer, minLength, maxLength], i) =>
    add('writing_tasks', {
      sectionId: section.WRITING,
      title,
      prompt,
      instructions: prompt,
      sampleAnswer,
      minLength,
      maxLength,
      rubric: lesson.rubric,
      sortOrder: i + 1,
    }),
  );

  // Practice: 10 vocabulary, 10 kanji, 15 grammar, 6 listening, 6 reading = 47.
  const vq = vocab
    .slice(0, 10)
    .map((v, i) => [
      `「${v[0]}（${v[1]}）」nghĩa là gì?`,
      v[3],
      vocab[(i + 17) % vocab.length][3],
      vocab[(i + 41) % vocab.length][3],
      vocab[(i + 73) % vocab.length][3],
      `${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`,
    ]);
  const kq = kanjiQuestions.map(([word, ...options]) => [
    `Cách đọc của 「${word}」?`,
    ...options,
    `${word} đọc là ${options[0]}. Xem ví dụ trong mục Hán tự.`,
  ]);
  let exerciseIndex = 0;
  const exercise = (q, sectionId, extra = {}) => {
    const c = choices(q, exerciseIndex++);
    add('lesson_exercises', {
      sectionId,
      ...c,
      exerciseType: 'MULTIPLE_CHOICE',
      points: 1,
      sortOrder: exerciseIndex,
      metadata: { source: code },
      ...extra,
    });
  };
  vq.forEach(q => exercise(q, section.EXERCISE));
  kq.forEach(q => exercise(q, section.EXERCISE));
  grammarQuestions.forEach(q => exercise(q, section.EXERCISE));
  listenQuestions.forEach(([i, ...q]) => exercise(q, section.LISTENING, { listeningId: listens[i] }));
  readQuestions.forEach(([i, ...q]) => exercise(q, section.READING, { readingPassageId: reads[i] }));

  const quiz = [
    ...vq.slice(0, 3),
    ...kq.slice(0, 3),
    ...quizGrammar.map(i => grammarQuestions[i]),
    ...[0, 2, 3, 4]
      .map(i => listenQuestions[i])
      .map(([i, p, ...q]) => [`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`, ...q]),
    ...[0, 2, 3, 4]
      .map(i => readQuestions[i])
      .map(([i, p, ...q]) => [`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`, ...q]),
  ];
  quiz.forEach((q, i) => {
    const { prompt, correctAnswer, ...rest } = choices(q, i);
    add('quiz_questions', {
      moduleId,
      question: prompt,
      correctIndex: correctAnswer,
      ...rest,
      questionType: 'MULTIPLE_CHOICE',
      points: 10,
    });
  });
  assert.equal(kanjiQuestions.length, 10);
  assert.equal(grammarQuestions.length, 15);
  assert.equal(listenQuestions.length, 6);
  assert.equal(readQuestions.length, 6);
  assert.equal(quiz.length, 25);
  assert.equal(exerciseIndex, 47);
  return rows;
}
