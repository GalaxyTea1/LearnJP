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
} from '../../../content/n4/n4-11.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 20001,
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
      { id: 20001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 11,
    title: 'Truyền đạt và dẫn lời gián tiếp',
    titleJp: '聞いた情報を伝える',
    description:
      'N4-11: truyền lại điều nghe hoặc đọc, dẫn lời và phân biệt thông tin với suy đoán. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Thông tin', 'Dẫn lời', 'Nguồn và suy đoán'],
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
    '50 từ dùng trong bài',
    '12 Kanji mới',
    'Truyền đạt và dẫn lời gián tiếp',
    'Hội thoại',
    'Luyện nghe TTS',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: dạng thường hiện tại/quá khứ và tính từ i/na. Mục tiêu: truyền lại thông tin đã nghe/đọc, điều chỉnh từ thời gian khi dẫn lời và phân biệt suy đoán. 40 bài tập, quiz 20 câu, đạt từ 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.',
    '50 mục từ về tin tức và thông báo. 伝言する là nhắn lại, không phải mọi trường hợp 伝える. 延期／中止 là danh từ; dạng する đã học. 広まる tự lan rộng, 広める chủ động truyền rộng. Chú giải: 判断する（はんだんする）đánh giá; 感想（かんそう）cảm tưởng; ～か mệnh đề nghi vấn gián tiếp (nhận biết).',
    '12 Kanji mới so với N5 và N4-01 đến N4-10. 広告、音声、感情、容器、認める là từ ghép/mục mở rộng nhận biết, có cách đọc và nghĩa. 聞 trong 新聞 đã học ở N5, không tính lại.',
    '5 mục: そうだ truyền đạt; と言っていました; という tên gọi/nội dung; らしい; みたい suy đoán. 休みだそう／休みらしい／休みみたい: chú ý だ. Không gán phần trăm chắc chắn cố định. おいしいそう là nghe nói ngon; おいしそう là trông có vẻ ngon.',
    'Hội thoại tự soạn, dùng TTS. Chú giải: 評判（ひょうばん）đánh giá, tiếng tăm; 決めつける（きめつける）kết luận chắc khi chưa đủ căn cứ; ～によると theo nguồn; ～の話では theo lời... Các thông báo và quán đều giả định.',
    'Nghe trước khi mở bản chép. Chú giải: 勉強しやすい dễ học; ～つもり định làm. Giờ cũ một giờ và giờ mới hai giờ thuộc bài nghe riêng, khác mười/mười một giờ trong hội thoại và bài đọc. TTS không thay thế thu âm người thật.',
    'Chú giải: 開始（かいし）bắt đầu; 変わらず（かわらず）không đổi; 展示室（てんじしつ）phòng triển lãm; 青い窓（あおいまど）Cửa sổ xanh; ～ことにしました đã quyết định; ～ではなく thay vì (nhận biết). Xem nguồn và thời điểm cập nhật, không suy ra lời đồn đã được xác nhận.',
    'Tự luyện theo số ký tự tiếng Nhật, dùng tình huống giả định. Bản nháp chỉ lưu trong trình duyệt, không chấm điểm viết tự động. Nêu nguồn, giữ đúng giờ/ngày và chỉ rõ phần chưa chắc. Khi truyền lời hôm trước, điều chỉnh 明日 thành 今日 nếu đúng ngữ cảnh.',
    '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu nghe/đọc cần đúng tư liệu. Quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa. Tránh xem らしい／みたい là bằng chứng chắc chắn.',
    '休みだそうです: nghe nói nghỉ. 十時だと言っていました: đã nói là mười giờ. 「そら」という店: cửa hàng tên Sora. 休みらしい／留守みたい: hình như nghỉ/có vẻ vắng nhà. そう伝聞 giữ dạng thường, kể cả だ và quá khứ; らしい／みたい bỏ だ ở N/na hiện tại khẳng định.',
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
      lesson: 'N4-11',
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
      lesson: 'N4-11',
      textbook: 'Original LearnJP — reported information',
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
        'Tự kiểm: đúng độ dài ký tự (25%); dẫn lời đúng, nêu nguồn và phân biệt suy đoán (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
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
      metadata: { source: 'N4-11' },
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
