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
} from '../../../content/n4/n4-08.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 17001,
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
      { id: 17001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 8,
    title: 'Điều kiện',
    titleJp: '条件を使って話す',
    description:
      'N4-08: dùng と・たら・なら・ば để nêu điều kiện, hướng dẫn thao tác và lên phương án. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Điều kiện', 'Hướng dẫn', 'Phương án theo tình huống'],
    sortOrder: 8,
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
    'Điều kiện',
    'Hội thoại',
    'Luyện nghe TTS',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: thể từ điển, ない, た và phân biệt nhóm động từ. Mục tiêu: lên phương án theo tình huống, đọc hướng dẫn và phân biệt bốn mẫu điều kiện. 40 bài tập, quiz 20 câu, đạt từ 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.',
    '50 mục từ về thời tiết, hướng dẫn và thiết bị. 戻す = đưa vật về chỗ cũ, khác 戻る = tự quay lại. 暖まる = ấm lên, khác 温める = làm nóng. ボタン trước đây có trong chú giải, nay học chính thức. Chú giải: 空気（くうき）không khí; つまみ núm xoay; 引き出し（ひきだし）ngăn kéo; 機械（きかい）máy; 知らせる（しらせる）báo tin; 元の（もとの）ban đầu; ～そうです nghe nói (nhận biết).',
    '12 Kanji mới so với N5 và N4-01 đến N4-07. Đọc ví dụ kèm nghĩa; 雲海、暗記、広場、狭まる、通信 là mở rộng nhận biết. 明るい／暗い: sáng/tối; 広い／狭い: rộng/hẹp; 押す／引く: đẩy/kéo. Các chữ đã học trong từ ghép không tính lại.',
    '4 mẫu điều kiện và 1 mục so sánh. と cho kết quả thường lệ; たら cho giả định hoặc sau khi một việc hoàn tất; なら lấy thông tin làm tiền đề; ば nhấn điều kiện. Có vùng dùng chung. Không học mẹo tuyệt đối “ば không có lời nhờ” hoặc “たら chỉ là quá khứ”.',
    'Hai hội thoại tự soạn, dùng TTS. Chú giải: 見るだけなら nếu chỉ xem; 印刷（いんさつ）in; 使い終わる（つかいおわる）dùng xong; 戻す đưa trở về. Máy tra cứu là tình huống giả định; quy trình tùy thiết bị thực tế.',
    'Nghe trước khi mở bản chép. Chú giải: 席（せき）chỗ ngồi; 職員（しょくいん）nhân viên; パソコン máy tính cá nhân; 電話する gọi điện. Bài nghe hẹn chín giờ, báo lúc bảy giờ; đây là tình huống riêng với hội thoại và bài đọc. TTS không thay thế giọng người thật.',
    'Chú giải: お知らせ thông báo; 二つ目（ふたつめ）cái/thứ thứ hai; 拡大（かくだい）phóng to; 使い方（つかいかた）cách dùng; 町（まち）thị trấn; ～や～ liệt kê ví dụ. Phân biệt giờ báo địa điểm với giờ gặp; máy tra cứu bản đồ không yêu cầu tên, còn bài nghe mượn máy tính có yêu cầu.',
    'Tự luyện theo số ký tự tiếng Nhật; có thể dùng tình huống tưởng tượng. Bản nháp chỉ lưu trong trình duyệt, không có điểm viết tự động. Đối chiếu thứ tự sự việc và điều kiện trong bài mẫu. Không buộc dùng cả bốn mẫu trong mọi đoạn.',
    '40 câu gồm 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu nghe/đọc dùng tư liệu tương ứng. Quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa. Câu ngữ pháp tập trung dạng chia và nghĩa khi nhiều mẫu đều có thể dùng.',
    '押すと地図が出る: nhấn thì hiện bản đồ. 着いたら電話する: đến rồi gọi. 行くなら先に予約する: nếu định đi thì đặt trước. 時間があれば行く: có thời gian thì đi. 行けば、食べれば、すれば、来れば（くれば）; いい→よければ; ない→なければ.',
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
      lesson: 'N4-08',
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
      lesson: 'N4-08',
      textbook: 'Original LearnJP — conditional expressions',
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
        'Tự kiểm: đúng độ dài ký tự (25%); chia điều kiện đúng, dùng mẫu phù hợp ngữ cảnh (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
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
      metadata: { source: 'N4-08' },
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
