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
} from '../../../content/n4/n4-04.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 13001,
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
      { id: 13001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 4,
    title: 'Khả năng và kỹ năng',
    titleJp: 'できること・得意なこと',
    description:
      'N4-04: nói về khả năng, sở trường và tiến bộ của bản thân. Học thể khả năng, phân biệt làm được với làm giỏi. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Kỹ năng', 'Thể khả năng', 'Tiến bộ'],
    sortOrder: 4,
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
    'Khả năng và sự tiến bộ',
    'Hội thoại',
    'Luyện nghe TTS',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: nhóm động từ, thể từ điển và các dạng thông thường ở N4-01; cách kể kinh nghiệm ở N4-03. Mục tiêu: nói được mình làm được gì, sở trường và sự tiến bộ. 40 bài tập, quiz 20 câu, ngưỡng đạt 70%. Khóa N4 đang mở từng bài, không phải chứng nhận JLPT.',
    '50 mục từ mới. 上手・下手・得意・苦手・十分 là tính từ na. 蹴る thuộc nhóm 1; 描く đọc かく trong bài, cũng có cách đọc えがく ở ngữ cảnh khác. Không tính 読める、泳げる... là từ mới riêng vì đây là dạng chia. Chú giải: ボール bóng; 足（あし）chân; 動物（どうぶつ）động vật; 線（せん）nét, đường; 間違い（まちがい）lỗi; 伸ばす（のばす）phát triển; 今年（ことし）năm nay; メートル mét; 体（からだ）cơ thể; 音（おと）âm thanh. 聞こえる／見える là nghe/nhìn thấy tự nhiên, khác 聞ける／見られる.',
    '12 Kanji mới so với danh sách N5 và N4-01 đến N4-03. Phân biệt 早い = sớm và 速い = nhanh, đều đọc はやい. Mỗi ví dụ có cách đọc và nghĩa. 強風、弱点、英国、漢方、体育、協力 là từ mở rộng nhận biết, không bắt buộc dùng trong bài viết.',
    '4 mục: thể khả năng của ba nhóm; Vることができる／Nができる; khả năng + ようになる; Vるのが上手／下手・得意／苦手. Dùng dạng chuẩn 食べられる、来られる trong bài luyện. Phân biệt khả năng với mức độ kỹ năng và với điều kiện nhìn/nghe thấy.',
    'Hai hội thoại tự soạn, dùng TTS của thiết bị. Chú giải: 動き（うごき）động tác; メートル mét; 会（かい）buổi gặp mặt; 午後なら nếu là buổi chiều (なら chỉ nhận biết ở bài này). Không cần tự dùng câu điều kiện trong bài viết.',
    'Nghe trước khi mở bản chép. Chú giải: 午前中（ごぜんちゅう）trong buổi sáng; 顔（かお）khuôn mặt; 毎週（まいしゅう）mỗi tuần; 線（せん）nét; 描き方（かきかた）cách vẽ; 何度も nhiều lần; 間違い（まちがい）lỗi. Nghe rõ sự khác nhau giữa chưa biết làm và làm được nhưng chưa giỏi/nhanh.',
    'Chú giải: 三か月前（さんかげつまえ）ba tháng trước; メール email; 最後まで（さいごまで）đến cuối; 午前中 buổi sáng; 集まる（あつまる）tập trung; ～ので vì (nhận biết); 聞いてもらう nhờ người khác nghe (mẫu cho/nhận học ở bài sau); 演奏する（えんそうする）chơi nhạc. Đọc đúng kỹ năng của từng người và thời điểm trước/hiện tại.',
    'Tự luyện theo số ký tự tiếng Nhật. Có thể dùng tình huống giả định. Bài mẫu/rubric để tự kiểm; không có chấm điểm viết tự động. Chú giải bài mẫu: 動き động tác; メートル mét; 演奏する chơi nhạc.',
    '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Không xem mọi を đi với thể khả năng là sai. Câu hỏi chọn dạng chuẩn ghi rõ yêu cầu, tránh đánh đồng khẩu ngữ với lỗi ngữ pháp tuyệt đối.',
    '書く→書ける、食べる→食べられる、する→できる、来る→来られる. 吹くことができる = có thể thổi; 吹けるようになった = đã thổi được sau thay đổi; 吹くのが上手 = thổi giỏi. 分かる không cần tạo thêm thể khả năng. Ôn câu sai trước quiz 20 câu.',
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
      lesson: 'N4-04',
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
      lesson: 'N4-04',
      textbook: 'Original LearnJP — ability and skills',
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
        'Tự kiểm: đúng độ dài ký tự (25%); chia thể khả năng và diễn tả kỹ năng, tiến bộ (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
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
      metadata: { source: 'N4-04' },
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
