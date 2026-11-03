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
} from '../../../content/n3/n3-01.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 30001,
  levelId = 30001;
export async function buildUnit() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-10-30T00:00:00.000Z',
    rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: 30001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('jlpt_levels', {
    level: 'N3',
    title: 'N3 — Cầu nối trung cấp',
    titleJp: '日本語能力試験 N3',
    description: 'Đang mở N3-01. Các bài N3 tiếp theo chưa xuất bản.',
    color: '#A78BFA',
    badge: '🌙',
    totalVocab: 105,
    totalKanji: 26,
    totalGrammar: 7,
    sortOrder: 3,
  });
  add('learning_modules', {
    levelId,
    unitNumber: 1,
    title: 'Cuộc sống mới',
    titleJp: '新しい生活',
    description:
      'N3-01 (cầu nối 1): kể cuộc sống mới, nêu lý do, nhận xét mức độ, nói nhượng bộ, phân biệt はずだ với かもしれない và bày tỏ tiếc nuối. Ôn 26 Hán tự nền tảng qua từ ghép. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Chuyển nhà', 'Nhịp sinh hoạt', 'Hàng xóm và khu phố'],
    sortOrder: 1,
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
    '26 Hán tự nền tảng',
    'Cầu nối N4 → N3',
    'Hội thoại',
    'Luyện nghe',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: hoàn thành N5 và N4. Bài cầu nối đầu tiên của N3: bổ sung các mẫu N4 thường gặp còn thiếu và 26 Hán tự nền tảng. Mục tiêu: kể cuộc sống mới, nêu nhiều lý do, nhận xét mức độ, nói nhượng bộ, phân biệt phán đoán có căn cứ với khả năng, và viết thư 250–350 ký tự. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
    'Nhà ở, chuyển nhà, nhịp sinh hoạt, chi phí, cảm xúc khi đến nơi mới, hàng xóm và khu phố, trạng từ thường gặp. Chú ý cặp gần nghĩa: 暮らす (nếp sống) và 住む (ở đâu); やっと (cuối cùng, sau khi chờ) và ついに (rốt cuộc, sau quá trình dài); たまに ít hơn 時々; 恐らく trang trọng hơn たぶん; 不安 mạnh và mơ hồ hơn 心配.',
    '26 chữ: 一二三四五六七八九十 年半午曜 朝昼夕夜間 何名町 色赤青黒. Bạn có thể đã quen mặt các chữ này; trọng tâm là âm đọc trong từ ghép: ngày trong tháng (二十日 はつか, 七日 なのか, 八日 ようか), giờ (四時 よじ, 九時 くじ), 一日中, 年中, 昼間, 夜中, 名所, 下町.',
    '7 mẫu: ～し; ～すぎる; ～やすい／にくい; ～ても／でも; ～かもしれない; ～はずだ; ～ばよかった. So sánh trọng tâm: はずだ (có căn cứ, gần như chắc chắn) và かもしれない (chỉ là khả năng). やすい／にくい nói về tính chất của vật, nơi chốn, không thay cho thể khả năng.',
    'Hội thoại tự soạn, tình huống giả định. Chú giải: 号室（ごうしつ）số phòng; カラス con quạ; 気に入る（きにいる）thích, ưng; 無料（むりょう）miễn phí; 眠そう（ねむそう）trông buồn ngủ; つい lỡ, bất giác; お弁当（おべんとう）cơm hộp.',
    'Nghe trước, sau đó mới mở bản chép. Bài 3 là tin nhắn thoại một chiều: thử nghe một lần rồi trả lời. Chú giải: 北向き／南向き（きたむき／みなみむき）hướng bắc/nam; ペットボトル chai nhựa; キャップ nắp; 玄関（げんかん）cửa ra vào; 組み立てる（くみたてる）lắp ráp; トラック xe tải. Âm thanh là giọng đọc của thiết bị.',
    'Chú giải bài 1: 押し入れ（おしいれ）tủ âm tường; 八百屋（やおや）hàng rau; 完璧（かんぺき）hoàn hảo; お祭り（おまつり）lễ hội. Bài 2: 第二・第四（だいに・だいよん）thứ hai và thứ tư (tuần trong tháng); 結ぶ（むすぶ）buộc; 構わない（かまわない）cũng được; 壁（かべ）tường; 車いす（くるまいす）xe lăn; 掲示板（けいじばん）bảng thông báo; 管理組合（かんりくみあい）ban quản lý tòa nhà.',
    'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Gợi ý bố cục: mở đầu (chào, tình hình), thân bài (lý do, khó khăn, điều tiếc), kết (mục tiêu hoặc lời chúc). Tự đánh giá theo tiêu chí bên dưới; bản nháp tự lưu trên trình duyệt.',
    '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
    'Tự kiểm sau bài: nêu ba lý do chọn nơi ở bằng し; nói một điều “quá” và một điều “dễ/khó”; nói một câu nhượng bộ với いくら～ても; phân biệt 届くはずだ (đã đặt giờ giao) với 届くかもしれない (không chắc); kể một điều tiếc bằng ～ばよかった. Bài tiếp theo (N3-02): thể sai khiến và sai khiến bị động.',
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
      lesson: 'N3-01',
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
      lesson: 'N3-01',
      textbook: 'Original LearnJP — N3 bridge 1',
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
        'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu đề yêu cầu, đúng mức chắc chắn (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
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
      metadata: { source: 'N3-01' },
      ...extra,
    });
  };
  vq.forEach(q => exercise(q, section.EXERCISE));
  kq.forEach(q => exercise(q, section.EXERCISE));
  grammarQuestions.forEach(q => exercise(q, section.EXERCISE));
  listenQuestions.forEach(([i, ...q]) => exercise(q, section.LISTENING, { listeningId: listens[i] }));
  readQuestions.forEach(([i, ...q]) => exercise(q, section.READING, { readingPassageId: reads[i] }));
  // Quiz covers all seven patterns, including the はずだ／かもしれない contrast.
  const quiz = [
    ...vq.slice(0, 3),
    ...kq.slice(0, 3),
    ...[0, 1, 3, 5, 7, 8, 9, 10, 12, 13, 14].map(i => grammarQuestions[i]),
    ...[0, 1, 3, 4]
      .map(i => listenQuestions[i])
      .map(([i, p, ...q]) => [`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`, ...q]),
    ...[0, 1, 3, 4]
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
  assert.equal(kanji.length, 26);
  assert.equal(quiz.length, 25);
  assert.equal(exerciseIndex, 47);
  return rows;
}
