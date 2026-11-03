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
} from '../../../content/n3/n3-14.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 43001,
  levelId = 30001;
export async function buildUnit() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-11-12T00:00:00.000Z',
    rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: 43001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 14,
    title: 'Tin tức và truyền đạt',
    titleJp: 'ニュースを伝える',
    description:
      'N3-14: nêu nguồn tin và truyền đạt lại: ～によると／によれば, ～ということだ, ～とのことだ, ～って, ～から～にかけて, ～を通じて／を通して. Chính trị, pháp luật, tội phạm, báo chí; 24 Hán tự về xã hội. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tin tức', 'Truyền đạt lại', 'Chính trị và pháp luật'],
    sortOrder: 14,
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
    'Nguồn tin và truyền đạt',
    'Hội thoại',
    'Luyện nghe',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: N5, N4 (～そうだ truyền đạt, ～らしい) và N3-01 đến N3-13. Mục tiêu: nêu nguồn tin, truyền đạt lại thông tin trang trọng và thân mật, nói phạm vi thời gian và khu vực, nói phương tiện và khoảng thời gian; tóm tắt một bản tin. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
    'Chính trị và bầu cử, cơ quan nhà nước, pháp luật và tòa án, tội phạm và cảnh sát, báo chí và phát thanh, xã hội và quốc tế. Cặp gần nghĩa: 警官 (gọi tắt) / 警察官; 首相 (tin tức) / 総理大臣 (chính thức); 市民 (người dân thành phố) / 国民 (người dân cả nước) / 住民 (cư dân nơi ở); 報道 (đưa tin nói chung) / 速報 (tin nhanh); 当選 / 落選.',
    '24 chữ mới: 政府民党挙 法律憲 官庁局 警察犯罪逮捕訴 放委 刊載 領統. Từ ghép trọng tâm: 政治（せいじ）, 政府, 国民, 政党, 選挙（せんきょ）, 法律（ほうりつ）, 憲法（けんぽう）, 警官, 官庁, 警察, 犯罪（はんざい）, 逮捕（たいほ）, 訴える（うったえる）, 放送, 委員会, 朝刊（ちょうかん）, 連載, 大統領（だいとうりょう）, 伝統, 放送局. Chú ý 憲法 đọc けんぽう (biến âm).',
    '7 mục: ～によると／によれば; ～ということだ; ～とのことだ; ～って; ～から～にかけて; ～を通じて／を通して (phương tiện); ～を通じて／を通して (suốt thời gian). So sánh: ということだ (trang trọng, khách quan) / そうだ (thân mật hơn) / らしい (có phỏng đoán); から～にかけて (ranh giới không rõ) / から～まで (điểm đầu cuối rõ ràng).',
    'Hội thoại tự soạn, tình huống giả định. Chú giải: 先ほど（さきほど）lúc nãy (lịch sự); 早めに（はやめに）sớm hơn một chút; 夜中（よなか）nửa đêm; 防犯カメラ camera an ninh; 映る（うつる）hiện hình; さすが đúng là.',
    'Nghe trước, sau đó mới mở bản chép. Chú giải: 新人（しんじん）người mới; 割合（わりあい）tỷ lệ; 前回（ぜんかい）lần trước; 鉄道会社（てつどうがいしゃ）công ty đường sắt; 最新（さいしん）mới nhất; 孫（まご）cháu; 冷静（れいせい）bình tĩnh; 合言葉（あいことば）mật khẩu.',
    'Chú giải bài 1: 職員（しょくいん）nhân viên; ふりをする giả vờ; だまし取る（だましとる）lừa lấy; 仲間（なかま）đồng bọn; 年末（ねんまつ）cuối năm. Bài 2: 関心（かんしん）quan tâm; 久しい（ひさしい）đã lâu; 学費（がくひ）học phí; 後回し（あとまわし）gác lại; 一票（いっぴょう）một lá phiếu.',
    'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bố cục bài tóm tắt: nguồn tin (によると) → nội dung chính (ということだ／とのことだ) → chi tiết thời gian, cách thức (にかけて, を通じて) → ý kiến. Kiểm tra: không dùng って trong văn viết; とのことだ gắn với lời của một bên cụ thể. Bản nháp tự lưu trên trình duyệt.',
    '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
    'Tự kiểm sau bài: nêu nguồn của một tin bằng によると; truyền lại tin bằng ということだ và lời nhắn bằng とのことです; kể tin cho bạn bằng って; nói dự báo thời tiết bằng から～にかけて; nói cách bạn biết tin bằng を通じて. Bài tiếp theo (N3-15): tranh luận và nhượng bộ (ものの, にもかかわらず).',
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
      lesson: 'N3-14',
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
      lesson: 'N3-14',
      textbook: 'Original LearnJP — N3 news and reported information',
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
        'Tự kiểm: đúng độ dài ký tự (20%); nêu đúng nguồn tin và nội dung chính, chọn đúng ということだ／とのことだ／って (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
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
      metadata: { source: 'N3-14' },
      ...extra,
    });
  };
  vq.forEach(q => exercise(q, section.EXERCISE));
  kq.forEach(q => exercise(q, section.EXERCISE));
  grammarQuestions.forEach(q => exercise(q, section.EXERCISE));
  listenQuestions.forEach(([i, ...q]) => exercise(q, section.LISTENING, { listeningId: listens[i] }));
  readQuestions.forEach(([i, ...q]) => exercise(q, section.READING, { readingPassageId: reads[i] }));
  // Quiz covers all seven patterns, including the ということだ / そうだ / らしい and にかけて / まで contrasts.
  const quiz = [
    ...vq.slice(0, 3),
    ...kq.slice(0, 3),
    ...[0, 1, 2, 3, 4, 5, 6, 8, 10, 11, 13].map(i => grammarQuestions[i]),
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
