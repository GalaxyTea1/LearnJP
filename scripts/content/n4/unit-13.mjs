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
} from '../../../content/n4/n4-13.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 22001,
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
      { id: 22001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 13,
    title: 'Công việc và trường học',
    titleJp: '仕事と学校',
    description:
      'N4-13: kể lịch làm việc, đọc thông báo và viết email cá nhân khoảng 180 ký tự. Phân biệt thời điểm, khoảng thời gian, làm đồng thời và hai nghĩa のに. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Công việc', 'Trường học', 'Email và thời gian'],
    sortOrder: 13,
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
    'Công việc và trường học',
    'Hội thoại',
    'Luyện nghe TTS',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: thể thường, thể て và cách nối câu ở N4-01 đến N4-12. Mục tiêu: kể lịch công việc/học tập, phân biệt việc suốt khoảng thời gian với một sự kiện trong khoảng đó; viết email cá nhân khoảng 180 ký tự. 40 bài tập, quiz 20 câu, đạt từ 70%. Bộ 3 đề thi thử và rà soát toàn khóa chưa hoàn tất.',
    '50 mục từ mới so với N5 và N4-01 đến N4-12. Ôn kèm các từ đã biết 資料、提出する、締め切り、保存する、同僚. 議事録、奨学金、学籍番号、引き継ぐ là từ mở rộng theo chủ đề, không khẳng định thuộc danh sách JLPT chính thức. レポート ở đây là bài báo cáo của sinh viên; 報告書 là văn bản báo cáo công việc.',
    '12 Kanji mới: 勤、職、業、課、題、授、試、験、卒、配、欠、遅. Học cách đọc qua từ ghép: 授業（じゅぎょう）、試験（しけん）、欠席（けっせき）、遅刻（ちこく）. Động từ 勤める、配る、遅れる là từ mở rộng nhận biết. Từ ghép dùng chữ đã biết vẫn được ôn nhưng không tính thêm Kanji mới.',
    '7 mục: Vる／Vたとき; Nの／Aい／Aなとき; 間; 間に (đối chiếu mở rộng của 間); Vます bỏ ます＋ながら; のに chỉ tương phản; Vるのに chỉ mục đích/công dụng. Không chọn đáp án dựa riêng dấu hiệu quá khứ ở cuối câu; xét thứ tự sự việc. ながら trong bài yêu cầu cùng chủ thể.',
    'Hội thoại tự soạn, nghe bằng TTS. Chú giải: 担当（たんとう）phần việc phụ trách; 一度（いちど）một lần; 予定表（よていひょう）bảng lịch; 前回（ぜんかい）lần trước; 書き終わる（かきおわる）viết xong. Lịch học, công việc và tên người đều giả định.',
    'Nghe trước khi mở bản chép. Mỗi đoạn có lịch và yêu cầu riêng; không lấy thông tin từ hội thoại hoặc bài đọc để trả lời. Chú giải: 締め切り（しめきり）hạn cuối; 間に合う（まにあう）kịp giờ; 連絡先（れんらくさき）thông tin liên lạc; 留守（るす）vắng mặt; 遅刻しそう（ちこくしそう）có vẻ sắp trễ; 両方（りょうほう）cả hai. TTS không thay thế thu âm người thật.',
    'Chú giải: 延ばす（のばす）lùi/kéo dài; 持ち帰る（もちかえる）mang về; 変更（へんこう）thay đổi; 確認（かくにん）xác nhận; 変更後 sau khi thay đổi; 送信（そうしん）gửi; 正午（しょうご）trưa đúng 12 giờ; 故障（こしょう）hỏng; 書き終える（かきおえる）viết xong. Đọc lý do, hạn mới và hành động cần làm, không chỉ dò con số.',
    'Tự luyện viết 160–200 ký tự tiếng Nhật, mục tiêu khoảng 180 ký tự. Viết email cá nhân cho bạn, có lời chào, tình huống, đề nghị cụ thể và kết. Chú giải mẫu viết: 問題を解く（もんだいをとく）giải bài; 都合（つごう）sự thuận tiện về lịch; 急ぎ（いそぎ）khẩn; 知らせる（しらせる）báo tin. Dùng ít nhất ba mẫu trong bài; không nhồi cả hai nghĩa のに nếu không tự nhiên. Bản nháp chỉ lưu trong trình duyệt, không được giáo viên hay AI chấm tự động.',
    '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe và 5 đọc. Mỗi câu có một đáp án theo ngữ cảnh. Quiz ôn nghe có bản chép nên không phải đề thi nghe chuẩn hóa. Chú ý toàn bộ khoảng thời gian (間) khác một sự kiện trong khoảng đó (間に).',
    '会社に行くとき = lúc đi đến công ty; 着いたとき = lúc đã tới. 学生のとき、忙しいとき、暇なとき. 留守の間ずっと = suốt thời gian vắng; 休み時間の間に一度 = một lần trong giờ nghỉ. 聞きながらメモする: cùng người nghe và ghi. 勉強したのに = dù đã học mà...; 勉強するのに使う = dùng để học.',
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
      lesson: 'N4-13',
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
      lesson: 'N4-13',
      textbook: 'Original LearnJP — work and school',
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
        'Tự kiểm: đúng độ dài ký tự (25%); dùng đúng thời điểm và nối câu (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
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
      metadata: { source: 'N4-13' },
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
    ...[0, 2, 4, 5, 6, 9, 10].map(i => grammarQuestions[i]),
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
