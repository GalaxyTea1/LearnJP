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
} from '../../../content/n4/n4-12.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 21001,
  levelId = 10001;
export async function buildUnit() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-10-26T00:00:00.000Z',
    rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: 21001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 12,
    title: 'Du lịch và dịch vụ',
    titleJp: '旅行とサービス',
    description:
      'N4-12: nhận phòng khách sạn, đặt dịch vụ và nhờ giúp lịch sự. Nhận biết kính ngữ cơ bản của nhân viên. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Khách sạn', 'Nhà hàng', 'Yêu cầu lịch sự'],
    sortOrder: 12,
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
    'Du lịch và dịch vụ',
    'Hội thoại',
    'Luyện nghe TTS',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: thể て, cách nhờ và cho/nhận N4-07. Mục tiêu: nhận phòng, hỏi giá/dịch vụ và đặt bàn; nhận biết kính ngữ cơ bản trong lời nhân viên. 40 bài tập, quiz 20 câu, đạt từ 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.',
    '50 mục từ về khách sạn, nhà hàng và di chuyển. 承る、かしこまりました、申す、伺う là cụm dịch vụ/khiêm nhường để nhận biết và dùng có ngữ cảnh; không phải tất cả đều kính ngữ tôn người làm. 朝食 cùng nghĩa 朝ごはん đã học nhưng là cách gọi khác. 含まれる là dạng bị động của 含む; học cặp để đọc giá gồm/không gồm dịch vụ.',
    '12 Kanji mới so với N5 và N4-01 đến N4-11. 本屋、座席、様子、支払い là từ mở rộng nhận biết. 一泊 đọc いっぱく; 二泊 đọc にはく. 田中様 dùng gọi khách trang trọng; không gắn 様 vào tên chính mình.',
    '5 mục: いらっしゃいます; ございます／でございます; お／ご＋danh từ; ていただけませんか; てくださいませんか. Hai mẫu nhờ có nhiều ngữ cảnh dùng chung. Mục ていただけませんか ôn từ N4-07 và mở rộng trong dịch vụ. Không dùng いらっしゃいます nâng hành động chính mình.',
    'Hội thoại tự soạn, TTS. Chú giải: 二名様（にめいさま）hai vị; 満席（まんせき）kín chỗ; 正面玄関（しょうめんげんかん）cửa chính; ご用意しています chuẩn bị sẵn; お預かりします giữ giúp; ご案内 hướng dẫn (cụm nhận biết). Các lịch và phí là giả định theo từng tình huống.',
    'Nghe trước khi mở bản chép. Giờ ăn sáng, tầng phục vụ, giờ trả phòng và thời hạn giữ đồ thuộc tình huống riêng, không lấy từ hội thoại hay bài đọc để trả lời. 通路側（つうろがわ）phía lối đi. TTS không thay thế thu âm người thật.',
    'Chú giải: 会場（かいじょう）địa điểm/khu tổ chức; ご不明な点 điều chưa rõ; お問い合わせください xin liên hệ hỏi; ご希望 mong muốn; お申し出ください xin báo; ～こともあります có khi...; ～までに chậm nhất... Giá, lịch và chính sách trong bài là giả định, không áp dụng cho khách sạn thật.',
    'Tự luyện theo số ký tự tiếng Nhật, dùng đặt phòng tưởng tượng. Bản nháp chỉ lưu trong trình duyệt, không chấm điểm tự động. Phân biệt vai khách với nhân viên. Có thể dùng cụm ご用意しています và お預かりします từ chú giải, chưa cần học toàn bộ hệ thống kính ngữ.',
    '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Khi trả lời giá/giờ phải dựa đúng tư liệu. Quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa. Không mặc định mọi dịch vụ miễn phí hoặc luôn đáp ứng yêu cầu.',
    '先生がいらっしゃいます: giáo viên có mặt (tôn kính). 空室がございます: có phòng trống (lịch sự). こちらが鍵でございます: đây là chìa khóa. ご予約／お名前: cụm cố định. 確認していただけませんか／確認してくださいませんか: nhờ kiểm tra lịch sự; không phải xin đừng kiểm tra.',
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
      lesson: 'N4-12',
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
      lesson: 'N4-12',
      textbook: 'Original LearnJP — travel and services',
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
        'Tự kiểm: đúng độ dài ký tự (25%); dùng kính ngữ đúng vai và nêu yêu cầu lịch sự (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
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
      metadata: { source: 'N4-12' },
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
