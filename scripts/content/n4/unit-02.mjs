import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import {
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
} from '../../../content/n4/n4-02.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 11001,
  levelId = 10001;
export async function buildUnit() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-10-25T00:00:00.000Z',
    rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: 11001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 2,
    title: 'Thể て mở rộng',
    titleJp: 'て形の使い方',
    description:
      'N4-02: mô tả quy trình, chuẩn bị trước, thử làm và kể sự cố. Phân biệt hành động đang diễn ra với trạng thái kết quả. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Quy trình', 'Chuẩn bị trước', 'Trạng thái và sự cố'],
    sortOrder: 2,
    contentStatus: 'DRAFT',
  });
  const types = [
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
  const titles = [
    'Mục tiêu và cách học',
    '50 từ dùng trong bài',
    '12 Kanji mới',
    'Các cách dùng thể て',
    'Hội thoại',
    'Luyện nghe TTS',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: thể て cơ bản N5 và thể thông thường N4-01. Mục tiêu: trình bày quy trình nấu ăn/làm việc, phân biệt tiến hành và kết quả, chuẩn bị trước và thử làm. 40 bài tập, quiz 20 câu, đạt từ 70%; không thay thế đánh giá JLPT.',
    '50 từ mới theo chủ đề. Nhóm động từ ghi trong nghĩa. Tự động từ mô tả sự thay đổi/trạng thái: 開く、閉まる、消える; đối chiếu 開ける、閉める、消す đã học ở N5. Chú giải ví dụ: 床（ゆか）sàn, 分（ぶん）phần.',
    '12 chữ mới so với dữ liệu N5 và N4-01. Từ có cách đọc và nghĩa trong từng ví dụ. Từ ghép như 使用、洗濯、工場、場合、運動 là mở rộng nhận biết, không coi là từ vựng mới bắt buộc hay hỏi khi chưa giải nghĩa.',
    '7 cách dùng: てから; ている tiến hành/kết quả; てしまう hoàn tất/tiếc nuối; ておく; てみる. Ôn bảng chia て ở mẫu đầu; chú ý 行く→行って và 読む→読んで.',
    'Đọc hai vai và nghe TTS. Chú giải: スープ súp; コピー機（コピーき）máy photocopy. TTS không phải thu âm người thật.',
    'Nghe trước rồi mở bản chép để kiểm tra. Chú giải: 置く（おく）đặt; 出かける（でかける）ra ngoài; Vるのを忘れる = quên làm việc gì (の danh từ hóa, mở rộng nhận biết). TTS dùng giọng có sẵn trên thiết bị.',
    'Chú giải: 柔らかい（やわらかい）mềm; 柔らかくなる trở nên mềm; もう一度（もういちど）một lần nữa; ノート vở; メール email; ～のです giải thích tình huống (nhận biết). Không cần tự tạo các cấu trúc mở rộng trong bài này.',
    'Tự luyện theo số ký tự tiếng Nhật. Bản nháp lưu trong trình duyệt; dùng bài mẫu và rubric để tự kiểm. Không có điểm viết tự động.',
    '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu nghe/đọc có liên kết với tư liệu tương ứng. Đọc giải thích sau khi trả lời.',
    '洗ってから = rửa rồi mới làm việc sau; 切っている = đang cắt; 開いている = đang mở (trạng thái); 全部やってしまう = làm xong hết; 忘れてしまう = lỡ quên; 買っておく = mua sẵn; 作ってみる = thử làm. Ôn câu sai rồi làm quiz 20 câu.',
  ];
  const section = {};
  types.forEach(
    (t, i) =>
      (section[t] = add('lesson_sections', {
        moduleId,
        sectionType: t,
        title: titles[i],
        instructions: instructions[i],
        sortOrder: i + 1,
        isRequired: true,
      })),
  );
  vocab.forEach(([japanese, hiragana, romaji, meaning, type, exampleJp, exampleEn]) =>
    add('vocabulary', {
      moduleId,
      japanese,
      hiragana,
      romaji,
      english: meaning,
      type,
      level: 'N4',
      lesson: 'N4-02',
      exampleJp,
      exampleEn,
    }),
  );
  kanji.forEach(([character, meaning, onyomi, kunyomi, strokes, radical, examples]) =>
    add('kanji', {
      moduleId,
      character,
      meaning,
      onyomi,
      kunyomi,
      strokeCount: Number(strokes),
      radical,
      level: 'N4',
      exampleWords: examples.split('; ').map(s => ({ jp: s.split(': ')[0], en: s.split(': ')[1] })),
      relatedChars: [],
      mnemonic: `Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ví dụ. Từ ghép chưa học chỉ dùng nhận biết.`,
    }),
  );
  grammar.forEach(([pattern, meaning, explanation, examples]) => {
    const grammarId = add('grammar_patterns', {
      moduleId,
      pattern,
      meaning,
      explanation,
      level: 'N4',
      lesson: 'N4-02',
      textbook: 'Original LearnJP — te-form applications',
    });
    examples.forEach(([japanese, english], i) =>
      add('grammar_examples', { grammarPatternId: grammarId, japanese, english, sortOrder: i + 1 }),
    );
  });
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
      instructions: 'Nghe TTS và trả lời câu hỏi bên dưới. Có thể mở bản chép và bản dịch để tự kiểm.',
      audioUrl: 'TTS:ja-JP',
      playbackSpeed: 0.85,
      source: 'Original LearnJP; browser TTS',
      sortOrder: i + 1,
    }),
  );
  const reads = readings.map(([title, content, translation], i) =>
    add('reading_passages', {
      sectionId: section.READING,
      title,
      content,
      translation,
      estimatedLevel: 'N4',
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
      rubric:
        'Tự kiểm: đúng độ dài ký tự (25%); chia て và chọn đúng nghĩa mẫu câu (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
      sortOrder: i + 1,
    }),
  );
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
  const vq = vocab
    .slice(0, 10)
    .map((v, i) => [
      `「${v[0]}（${v[1]}）」nghĩa là gì?`,
      v[3],
      vocab[(i + 13) % vocab.length][3],
      vocab[(i + 23) % vocab.length][3],
      vocab[(i + 33) % vocab.length][3],
      `${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`,
    ]);
  const kq = kanjiQuestions.map(([word, ...opts]) => [
    `Cách đọc của 「${word}」?`,
    ...opts,
    `${word} đọc là ${opts[0]}. Xem ví dụ trong mục Kanji.`,
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
      metadata: { source: 'N4-02' },
      ...extra,
    });
  };
  vq.forEach(q => exercise(q, section.EXERCISE));
  kq.forEach(q => exercise(q, section.EXERCISE));
  grammarQuestions.forEach(q => exercise(q, section.EXERCISE));
  listenQuestions.forEach(([i, ...q]) => exercise(q, section.LISTENING, { listeningId: listens[i] }));
  readQuestions.forEach(([i, ...q]) => exercise(q, section.READING, { readingPassageId: reads[i] }));
  const quiz = [
    ...vq.slice(0, 2),
    ...kq.slice(0, 3),
    ...grammarQuestions.slice(0, 7),
    ...listenQuestions
      .slice(0, 4)
      .map(([i, p, ...q]) => [`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`, ...q]),
    ...readQuestions.slice(0, 4).map(([i, p, ...q]) => [`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`, ...q]),
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
  assert.equal(vocab.length, 50);
  assert.equal(kanji.length, 12);
  assert.equal(quiz.length, 20);
  assert.equal(exerciseIndex, 40);
  return rows;
}
