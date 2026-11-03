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
} from '../../../content/n3/n3-03.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 32001,
  levelId = 30001;
export async function buildUnit() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-11-01T00:00:00.000Z',
    rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: 32001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 3,
    title: 'Dùng kính ngữ',
    titleJp: '敬語を使ってみよう',
    description:
      'N3-03 (cầu nối 3): tôn kính お／ご～になる, ～（ら）れる và động từ đặc biệt; khiêm nhường お／ご～する・いたす và động từ đặc biệt; お／ご～ください; ～ていただけないでしょうか. Tiếp khách, nghe điện thoại, gặp giáo sư; 25 Hán tự nền tảng cuối cùng. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Kính ngữ', 'Tiếp khách và điện thoại', 'Trường đại học'],
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
    '105 từ vựng mới',
    '25 Hán tự nền tảng',
    'Kính ngữ',
    'Hội thoại',
    'Luyện nghe',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: N5, N4 (đặc biệt N4-12 kính ngữ cơ bản), N3-01 và N3-02. Bài cầu nối cuối cùng: hệ thống tôn kính ngữ và khiêm nhường ngữ. Mục tiêu: tiếp khách ở quầy, nhận điện thoại và ghi lời nhắn, xin gặp giáo viên, tự giới thiệu ngày đầu đi làm. Câu hỏi then chốt: ai làm hành động? Người trên làm → tôn kính; mình làm → khiêm nhường. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
    'Động từ và cụm kính ngữ, khái niệm kính ngữ, chức danh, văn phòng và điện thoại, trường đại học, ngân hàng và giấy tờ, rạp chiếu phim, thăm người ốm. Cặp gần nghĩa: 少々／少し, ただいま／今, 先ほど／さっき, 後ほど／後で (bên trái trang trọng); 応対 (tiếp đón, tiếp chuyện) và 対応 (xử lý); 回答 (trả lời câu hỏi, khảo sát) và 解答 (lời giải bài).',
    '25 chữ cuối của nhóm nền tảng: 同主元重別真有工味写 校問代不以野死起研究質銀映答悪. Sau bài này đã đủ 74 chữ còn thiếu từ N5/N4. Trọng tâm âm đọc: 同期（どうき）, 元々（もともと）, 重要（じゅうよう）, 工場（こうじょう）, 研究室, 品質（ひんしつ）, 上映（じょうえい）, 回答（かいとう）, 悪化（あっか, âm ngắt）.',
    '7 mục: お／ご～になる; ～（ら）れる (tôn kính, giống hình thức bị động); động từ tôn kính đặc biệt; お／ご～する・いたす; động từ khiêm nhường đặc biệt; お／ご～ください; ～ていただけないでしょうか. Lỗi hay gặp: ご利用してください (đúng: ご利用ください), お読みになられる (kính ngữ hai lớp), dùng tôn kính cho người trong công ty mình khi nói với khách.',
    'Hội thoại tự soạn, tình huống giả định. Chú giải: 二泊（にはく）hai đêm; お待たせいたしました xin lỗi đã để chờ; ごゆっくり xin cứ thong thả; お過ごしください chúc có thời gian…; 計画書（けいかくしょ）bản kế hoạch; 推薦状（すいせんじょう）thư giới thiệu; 大学院（だいがくいん）cao học.',
    'Nghe trước, sau đó mới mở bản chép. Chú giải: 商事（しょうじ）công ty thương mại; 総務課（そうむか）phòng hành chính; お世話になっております câu chào trong công việc; 承る（うけたまわる）xin nhận (khiêm nhường của 受ける・聞く); 念のため để chắc chắn; 在留カード thẻ cư trú; 外国籍（がいこくせき）quốc tịch nước ngoài; けた chữ số; 郵送（ゆうそう）gửi bưu điện; 歓迎会（かんげいかい）tiệc chào đón; 仲間（なかま）đồng nghiệp, bạn; 乾杯（かんぱい）cạn ly.',
    'Chú giải bài 1: 件名（けんめい）tiêu đề; 経済学部（けいざいがくぶ）khoa Kinh tế; 計画書 bản kế hoạch; 方法（ほうほう）phương pháp; ご都合（ごつごう）sự thuận tiện của người trên; 日時（にちじ）ngày giờ; ご検討のほど xin xem xét; 親子（おやこ）cha mẹ và con. Bài 2: 苦労（くろう）vất vả; 実際（じっさい）thực tế; 席を外す（せきをはずす）không ở chỗ ngồi; 表現（ひょうげん）cách diễn đạt; 完璧（かんぺき）hoàn hảo; 後輩（こうはい）đàn em.',
    'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 là email trang trọng: tiêu đề, chào, tự giới thiệu, việc nhờ, đề xuất thời gian, kết. Bài 2 là bài phát biểu tự giới thiệu. Kiểm tra từng động từ: chủ thể là ai, đã chọn tôn kính hay khiêm nhường đúng chưa. Bản nháp tự lưu trên trình duyệt.',
    '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
    'Tự kiểm sau bài: chuyển 待つ・利用する sang tôn kính và khiêm nhường; nói tôn kính và khiêm nhường của 行く・言う・見る・食べる; nhận một cuộc điện thoại khi cấp trên vắng (ただいま席を外しております、折り返しお電話いたします); viết một câu nhờ bằng ～ていただけないでしょうか. Đã xong ba bài cầu nối; bài tiếp theo (N3-04): suy đoán và ấn tượng (ようだ・らしい・そうだ).',
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
      lesson: 'N3-03',
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
      lesson: 'N3-03',
      textbook: 'Original LearnJP — N3 bridge 3',
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
        'Tự kiểm: đúng độ dài ký tự (20%); chọn đúng tôn kính / khiêm nhường theo chủ thể hành động (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
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
      metadata: { source: 'N3-03' },
      ...extra,
    });
  };
  vq.forEach(q => exercise(q, section.EXERCISE));
  kq.forEach(q => exercise(q, section.EXERCISE));
  grammarQuestions.forEach(q => exercise(q, section.EXERCISE));
  listenQuestions.forEach(([i, ...q]) => exercise(q, section.LISTENING, { listeningId: listens[i] }));
  readQuestions.forEach(([i, ...q]) => exercise(q, section.READING, { readingPassageId: reads[i] }));
  // Quiz covers all seven patterns, including the respectful / humble contrast.
  const quiz = [
    ...vq.slice(0, 3),
    ...kq.slice(0, 3),
    ...[0, 2, 3, 5, 6, 7, 8, 9, 10, 12, 14].map(i => grammarQuestions[i]),
    ...[0, 1, 2, 4]
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
  assert.equal(kanji.length, 25);
  assert.equal(quiz.length, 25);
  assert.equal(exerciseIndex, 47);
  return rows;
}
