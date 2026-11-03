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
} from '../../../content/n4/n4-03.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 12001,
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
      { id: 12001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 3,
    title: 'Kinh nghiệm và liệt kê hoạt động',
    titleJp: '経験・活動を話す',
    description:
      'N4-03: kể chuyến đi, hỏi về kinh nghiệm và liệt kê hoạt động. Phân biệt việc vừa hoàn thành với thứ tự trước sau. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Du lịch', 'Trải nghiệm', 'Kể lại hoạt động'],
    sortOrder: 3,
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
    'Kinh nghiệm và thời gian',
    'Hội thoại',
    'Luyện nghe TTS',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: thể た ở N4-01, thứ tự てから ở N4-02. Học 4 mẫu để hỏi kinh nghiệm và kể chuyến đi. Hoàn thành 40 bài tập, quiz 20 câu với ngưỡng 70%. Đây là một bài trong khóa N4 đang mở dần, không phải chứng nhận JLPT.',
    '50 mục từ mới, nhóm động từ trong phần nghĩa. Từ đã học như 旅行、経験、写真、準備 được dùng ôn tập. Chú giải ví dụ: 去年（きょねん）năm ngoái; 今年（ことし）năm nay; 夕方（ゆうがた）chiều tối; 休日（きゅうじつ）ngày nghỉ; 工場（こうじょう）nhà máy; 感想（かんそう）cảm nghĩ; 着物（きもの）kimono; 着る（きる）mặc; 着く（つく）đến; 旅行中（りょこうちゅう）trong chuyến đi; 京都（きょうと）Kyoto. Chưa học thì xem là từ mở rộng nhận biết.',
    '12 Kanji mới so với danh sách N5 và hai bài N4 trước. Từ ghép luôn kèm cách đọc, nghĩa; 駅員、交通、発見、転ぶ、過去 là mở rộng nhận biết. Đừng nhầm 去年（きょねん）với cách đọc của 昨年（さくねん）cũng nghĩa là năm ngoái.',
    '4 mẫu trung tâm: Vたことがある／ない, VたりVたりする, Vたばかり, Vた後で／Nの後で. た trong たり hoặc た後で không tự quyết định quá khứ của cả câu. Ôn chia た: て→た, で→だ.',
    'Hai hội thoại tự soạn, giọng TTS của thiết bị. Chú giải: お帰りなさい = mừng bạn về; 出かける（でかける）ra ngoài; 去年（きょねん）năm ngoái; 着く（つく）đến; 京都（きょうと）Kyoto. Mệnh đề trước danh từ như 一緒に見たお寺 = ngôi chùa đã ngắm cùng nhau: nhận biết trong ngữ cảnh.',
    'Nghe trước khi mở bản chép. Chú giải: 二度目（にどめ）lần thứ hai; 料理教室（りょうりきょうしつ）lớp nấu ăn; スープ súp; Vるのは初めて = lần đầu làm V (nhận biết). Bài nghe dùng TTS, không phải bản thu người thật.',
    'Chú giải: それまで = cho đến trước thời điểm đó; ありませんでした = đã không có (kinh nghiệm trước chuyến đi); 今回（こんかい）lần này; 夕方（ゆうがた）chiều tối; 先週（せんしゅう）tuần trước; ～と言いました = đã nói rằng (trích lời đơn giản, nhận biết). Phân biệt giờ gặp bạn, giờ đến cảng và số lần trải nghiệm của từng người.',
    'Viết theo số ký tự tiếng Nhật. Có thể kể trải nghiệm tưởng tượng nếu chưa đi du lịch. Bản nháp lưu trên trình duyệt; bài mẫu và rubric để tự kiểm, không có điểm viết tự động.',
    '40 câu gồm 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. たり chỉ liệt kê ví dụ, không đảm bảo thứ tự; たばかり không quy định số phút cố định. Câu nghe/đọc cần dựa vào đúng tư liệu và đúng nhân vật.',
    '行ったことがある = từng đi; 一度も行ったことがない = chưa từng đi; 見たり買ったりした = đã làm các việc như xem, mua; 帰ったばかり = vừa về theo cảm nhận; 着いた後で = sau khi đến. Kể sự việc cụ thể dùng quá khứ đơn khi phù hợp. Quiz 20 câu có kèm tư liệu cho câu đọc/ôn nghe.',
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
      lesson: 'N4-03',
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
      lesson: 'N4-03',
      textbook: 'Original LearnJP — experiences and activities',
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
        'Tự kiểm: đúng độ dài ký tự (25%); chia た và phân biệt kinh nghiệm, liệt kê, thời gian (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
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
      metadata: { source: 'N4-03' },
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
