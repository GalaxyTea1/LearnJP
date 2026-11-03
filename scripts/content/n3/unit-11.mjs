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
} from '../../../content/n3/n3-11.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 40001,
  levelId = 30001;
export async function buildUnit() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-11-09T00:00:00.000Z',
    rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: 40001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 11,
    title: 'Xã hội thay đổi',
    titleJp: '変わる社会',
    description:
      'N3-11: thay đổi và tương quan: ～につれて, ～にしたがって, ～とともに, ～ば～ほど, ～ほど, ～ほど～はない, ～たびに. Dân số, kinh tế, giá cả và cách đọc số liệu; 24 Hán tự về số liệu và xã hội. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Xã hội và dân số', 'Kinh tế và giá cả', 'Đọc số liệu'],
    sortOrder: 11,
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
    '105 từ vựng mới',
    '24 Hán tự mới',
    'Thay đổi và tương quan',
    'Hội thoại',
    'Luyện nghe',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: N5, N4 (N4-08 ば, N4-09 ようになる) và N3-01 đến N3-10 (đặc biệt N3-07 一方だ／ばかりだ). Mục tiêu: mô tả thay đổi kéo theo thay đổi, tương quan “càng… càng…”, mức độ và so sánh nhất, việc lặp lại mỗi lần; đọc số liệu và viết đoạn mô tả xu hướng từ biểu đồ. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
    'Dân số và xã hội, kinh tế và giá cả, mô tả số liệu, hôn nhân và tuổi tác. Cách đọc số liệu: 割 = 10% (三割 = 30%), 倍 = lần, 約／およそ／前後／程度 = khoảng, 上回る／下回る = vượt / dưới, 占める = chiếm, 倍増／半減 = gấp đôi / một nửa, 横ばい = đi ngang. Cặp gần nghĩa: 価格 (văn viết) / 値段; 値上げ・値下げ (người bán quyết) / 値上がり・値下がり (giá tự thay đổi); 貯蓄 (văn viết) / 貯金; 所得 / 収入.',
    '24 chữ mới: 数割倍平均 産齢老婚 済景価値段税億 伸低適全各加総夫. Từ ghép trọng tâm: 数字, 割引, 平均, 平等（びょうどう, chú ý âm びょう）, 産業, 高齢者, 老後, 離婚, 経済, 景気, 価格, 価値, 値段, 税金, 億, 低下, 適切, 全体, 各国（かっこく, âm ngắt）, 追加, 総数, 夫.',
    '7 mục: ～につれて; ～にしたがって; ～とともに; ～ば～ほど; ～ほど (mức độ); ～ほど～はない; ～たびに. So sánh: につれて (thay đổi từ từ, tự nhiên, dùng được khi nói) / にしたがって (trang trọng hơn, thêm nghĩa “làm theo”) / とともに (văn viết nhất, thêm nghĩa “cùng ai”, “cùng lúc” cho việc một lần). Khi mô tả số liệu, dùng より thay cho に比べて (N3-12).',
    'Hội thoại tự soạn, tình huống giả định. Chú giải: どんどん liên tục, mạnh mẽ; 晩婚化（ばんこんか）xu hướng kết hôn muộn; 発表（はっぴょう）thuyết trình; 担当（たんとう）phụ trách; にぎやか náo nhiệt; 寂しい（さびしい）buồn, vắng vẻ.',
    'Nghe trước, sau đó mới mở bản chép. Bài 1 có nhiều con số: ghi chú số liệu khi nghe. Chú giải: 過去最多（かこさいた）nhiều nhất từ trước tới nay; 未満（みまん）dưới; 受け入れ（うけいれ）tiếp nhận; 検討（けんとう）xem xét; 小麦粉（こむぎこ）bột mì; やっていけない không trụ được; ～ぶり sau (bao lâu); 駄菓子屋（だがしや）tiệm bánh kẹo rẻ; ショッピングモール trung tâm mua sắm.',
    'Chú giải bài 1: 移動（いどう）di chuyển; 本数（ほんすう）số chuyến; 訪れる（おとずれる）đến thăm; 温泉（おんせん）suối nước nóng; 空き家（あきや）nhà bỏ trống; 宿（やど）nhà trọ. Bài 2: 追いつく（おいつく）theo kịp; 控える（ひかえる）hạn chế; つながる dẫn đến; 年金（ねんきん）lương hưu; 光熱費（こうねつひ）tiền điện nước ga.',
    'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 mô tả số liệu cho sẵn: nêu xu hướng chung, con số nổi bật, nguyên nhân có thể, suy nghĩ. Bài 2 kể quê hương thay đổi. Kiểm tra số liệu: đọc đúng 割, 倍, 約. Bản nháp tự lưu trên trình duyệt.',
    '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
    'Tự kiểm sau bài: mô tả một xu hướng bằng につれて và một bằng とともに; nói một tương quan bằng ～ば～ほど; nói “không gì… bằng” bằng ～ほど～はない; kể một việc lặp lại bằng ～たびに; đọc to: 人口の三割, 約二倍, 二〇二〇年には半減. Bài tiếp theo (N3-12): công nghệ, so sánh lợi và hại (一方で, 反面, に比べて, かわりに).',
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
      level: 'N3',
      lesson: 'N3-11',
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
      level: 'N3',
      exampleWords: examples.split('; ').map(s => ({ jp: s.split(': ')[0], en: s.split(': ')[1] })),
      relatedChars: [],
      mnemonic: `Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ghép ví dụ.`,
    }),
  );
  grammar.forEach(([pattern, meaning, explanation, examples]) => {
    const grammarId = add('grammar_patterns', {
      moduleId,
      pattern,
      meaning,
      explanation,
      level: 'N3',
      lesson: 'N3-11',
      textbook: 'Original LearnJP — N3 change and correlation',
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
      instructions: 'Nghe và trả lời câu hỏi bên dưới. Sau đó mở bản chép và bản dịch để tự kiểm.',
      audioUrl: 'TTS:ja-JP',
      playbackSpeed: 0.9,
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
      estimatedLevel: 'N3',
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
        'Tự kiểm: đúng độ dài ký tự (20%); đọc đúng số liệu, chọn đúng につれて／にしたがって／とともに (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
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
      vocab[(i + 17) % vocab.length][3],
      vocab[(i + 41) % vocab.length][3],
      vocab[(i + 73) % vocab.length][3],
      `${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`,
    ]);
  const kq = kanjiQuestions.map(([word, ...opts]) => [
    `Cách đọc của 「${word}」?`,
    ...opts,
    `${word} đọc là ${opts[0]}. Xem ví dụ trong mục Hán tự.`,
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
      metadata: { source: 'N3-11' },
      ...extra,
    });
  };
  vq.forEach(q => exercise(q, section.EXERCISE));
  kq.forEach(q => exercise(q, section.EXERCISE));
  grammarQuestions.forEach(q => exercise(q, section.EXERCISE));
  listenQuestions.forEach(([i, ...q]) => exercise(q, section.LISTENING, { listeningId: listens[i] }));
  readQuestions.forEach(([i, ...q]) => exercise(q, section.READING, { readingPassageId: reads[i] }));
  // Quiz covers all seven patterns, including the につれて / にしたがって / とともに contrast.
  const quiz = [
    ...vq.slice(0, 3),
    ...kq.slice(0, 3),
    ...[0, 2, 4, 5, 6, 7, 9, 10, 12, 13, 14].map(i => grammarQuestions[i]),
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
  assert.equal(vocab.length, 105);
  assert.equal(kanji.length, 24);
  assert.equal(quiz.length, 25);
  assert.equal(exerciseIndex, 47);
  return rows;
}
