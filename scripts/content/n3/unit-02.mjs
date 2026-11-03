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
} from '../../../content/n3/n3-02.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 31001,
  levelId = 30001;
export async function buildUnit() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-10-31T00:00:00.000Z',
    rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: 31001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 2,
    title: 'Gia đình và nơi làm thêm',
    titleJp: '家族とアルバイト',
    description:
      'N3-02 (cầu nối 2): thể sai khiến (bắt làm, cho làm), xin phép bằng ～させてください, sai khiến bị động, ～てほしい và ～させていただく. Kể chuyện gia đình, hồi nhỏ và công việc làm thêm; 23 Hán tự nền tảng. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Gia đình', 'Làm thêm', 'Thể sai khiến'],
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
    '105 từ vựng mới',
    '23 Hán tự nền tảng',
    'Thể sai khiến',
    'Hội thoại',
    'Luyện nghe',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: N5, N4 và N3-01. Bài cầu nối thứ hai: thể sai khiến và sai khiến bị động, mẫu N4 chuẩn mà khóa N4 của dự án chưa dạy. Mục tiêu: nói ai bắt/cho ai làm gì, xin phép làm việc ở nơi làm thêm, kể việc bị bắt làm và cảm nghĩ, nói mong muốn người khác làm. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
    'Gia đình và nuôi dạy con, ký ức tuổi thơ, thái độ khi làm việc không muốn, thú nuôi, nơi làm thêm, quê và nơi chốn, ăn mặc. Cặp gần nghĩa: 怒る (nổi giận) và 叱る (mắng để dạy); 指示 (hướng dẫn công việc) và 命令 (mệnh lệnh); 地元 (quê nhà, nơi mình sống) và 故郷 (quê hương, giàu cảm xúc); 子育て và 育児 (văn viết hơn). 嫌がる chỉ dùng để tả người khác.',
    '23 chữ: 家族妹姉犬鳥 東西南北 口耳川田国京地方 店堂飯洋服. Trọng tâm là âm đọc trong từ ghép: 家庭（かてい）・実家（じっか）, 東口・西口・南口・北口, 地元（じもと）・地方（ちほう）, 方言, 店長, 食堂（しょくどう）, 夕飯（ゆうはん）, 洋服・洋食, 田舎（いなか, cách đọc đặc biệt）.',
    '7 mục: cách chia 使役形; sai khiến bắt buộc; sai khiến cho phép; ～させてください／させてもらえませんか; sai khiến bị động ～させられる (rút gọn ～される); ～てほしい／てもらいたい; ～させていただく. So sánh trọng tâm: 弟にケーキを食べられた (bị động: bị ăn mất) / 食べさせた (bắt, cho ăn) / 食べさせられた (bị bắt ăn). Không dùng sai khiến với người trên mình.',
    'Hội thoại tự soạn, tình huống giả định. Chú giải: よろしいですか (lịch sự của いいですか); 迎えに行く（むかえにいく）đi đón; 入る（シフトに）vào ca; そろばん bàn tính; 逆（ぎゃく）ngược lại; 仲がいい（なかがいい）thân thiết.',
    'Nghe trước, sau đó mới mở bản chép. Chú giải: タイムカードを押す bấm thẻ chấm công; 少々お待ちください xin chờ một chút; 商品（しょうひん）hàng hóa; 報告（ほうこく）báo cáo; 隠す（かくす）giấu; 大学院（だいがくいん）cao học; 奨学金（しょうがくきん）học bổng; 将来（しょうらい）tương lai. Âm thanh là giọng đọc của thiết bị.',
    'Chú giải bài 1: 部活（ぶかつ）câu lạc bộ ở trường; 口げんか cãi nhau; うらやましい ghen tị; 周り（まわり）xung quanh; 苦にならない không thấy khổ. Bài 2: 募集（ぼしゅう）tuyển; 流れ quy trình; ～ごとに mỗi; 交通費（こうつうひ）tiền đi lại; 期間（きかん）thời gian; 問わない không hỏi, không yêu cầu; 保護者（ほごしゃ）phụ huynh; 応募（おうぼ）ứng tuyển; 直接（ちょくせつ）trực tiếp.',
    'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 kể chuyện: tình huống, cảm xúc lúc đó, điều thay đổi, suy nghĩ bây giờ. Bài 2 là email công việc: chào, lý do, đề xuất, lời cảm ơn/xin lỗi. Tự đánh giá theo tiêu chí bên dưới; bản nháp tự lưu trên trình duyệt.',
    '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
    'Tự kiểm sau bài: chia sai khiến của 書く・食べる・する・来る; nói một việc bố mẹ bắt làm và một việc bố mẹ cho làm; xin nghỉ ca bằng 休ませていただけませんか; kể việc bị bắt chờ bằng 待たされた; phân biệt 食べられた／食べさせた／食べさせられた. Bài tiếp theo (N3-03): kính ngữ tôn kính và khiêm nhường.',
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
      lesson: 'N3-02',
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
      lesson: 'N3-02',
      textbook: 'Original LearnJP — N3 bridge 2',
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
        'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng sai khiến, sai khiến bị động và lời xin phép theo vai người nói (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
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
      metadata: { source: 'N3-02' },
      ...extra,
    });
  };
  vq.forEach(q => exercise(q, section.EXERCISE));
  kq.forEach(q => exercise(q, section.EXERCISE));
  grammarQuestions.forEach(q => exercise(q, section.EXERCISE));
  listenQuestions.forEach(([i, ...q]) => exercise(q, section.LISTENING, { listeningId: listens[i] }));
  readQuestions.forEach(([i, ...q]) => exercise(q, section.READING, { readingPassageId: reads[i] }));
  // Quiz covers all seven patterns, including the passive / causative / causative-passive contrast.
  const quiz = [
    ...vq.slice(0, 3),
    ...kq.slice(0, 3),
    ...[0, 2, 4, 5, 6, 8, 9, 10, 11, 13, 14].map(i => grammarQuestions[i]),
    ...[0, 2, 4, 5]
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
  assert.equal(kanji.length, 23);
  assert.equal(quiz.length, 25);
  assert.equal(exerciseIndex, 47);
  return rows;
}
