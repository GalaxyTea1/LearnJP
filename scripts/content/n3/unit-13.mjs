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
} from '../../../content/n3/n3-13.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 42001,
  levelId = 30001;
export async function buildUnit() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-11-11T00:00:00.000Z',
    rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: 42001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 13,
    title: 'Bảo vệ trái đất',
    titleJp: '地球を守る',
    description:
      'N3-13: môi trường và giả định: ～場合（は）, ～としたら／とすれば, ～さえ～ば, ～かぎり, ～ないかぎり, たとえ～ても, ～ないと. Rác và tái chế, năng lượng, khí hậu, thiên tai; 24 Hán tự về môi trường. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Môi trường', 'Giả định và điều kiện', 'Thiên tai'],
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
    '105 từ vựng mới',
    '24 Hán tự mới',
    'Giả định và điều kiện',
    'Hội thoại',
    'Luyện nghe',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: N5, N4 (と／たら／なら／ば ở N4-08) và N3-01 đến N3-12 (～ても ở N3-01). Mục tiêu: nói trường hợp và quy định, giả định một tình huống, nói điều kiện tối thiểu, giới hạn và ngoại lệ, nhượng bộ mạnh; viết đề xuất giải pháp cho vấn đề môi trường. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
    'Môi trường và ô nhiễm, rác và tái chế, năng lượng, khí hậu và thiên tai, hành động. Cặp gần nghĩa: 汚染 (ô nhiễm do chất bẩn) / 公害 (ô nhiễm gây hại cho cư dân); 削減 (cắt giảm có kế hoạch) / 減らす; 避難 (sơ tán khỏi nguy hiểm) / 逃げる; 保護 (bảo vệ thứ yếu) / 守る; 捨てる / ポイ捨て (vứt bừa bãi).',
    '24 chữ mới: 環境源 森林植葉 燃捨汚染 守保護 震波候届 酸素炭灰 暴荒. Từ ghép trọng tâm: 環境（かんきょう）, 資源, 森林, 植物, 燃える, 捨てる, 汚染（おせん）, 保護, 地震, 震度, 津波, 気候, 届け出, 酸素（さんそ）, 二酸化炭素, 灰, 暴風, 荒れる. Chú ý 守 đọc まもる, 素 đọc そ trong 酸素.',
    '7 mục: ～場合（は）; ～としたら／とすれば; ～さえ～ば; ～かぎり（は）; ～ないかぎり; たとえ～ても; ～ないと（～ない）. So sánh: としたら／とすれば nhấn giả định tách khỏi thực tế, たら dùng được cả cho việc chắc chắn xảy ra, ば nhấn điều kiện; 場合 không dùng cho việc chắc chắn xảy ra một lần.',
    'Hội thoại tự soạn, tình huống giả định. Chú giải: 取り組み（とりくみ）nỗ lực, biện pháp; 照明（しょうめい）đèn chiếu sáng; 冷房（れいぼう）máy lạnh; 設定（せってい）cài đặt; 無理（むり）quá sức; 容器（ようき）hộp đựng.',
    'Nghe trước, sau đó mới mở bản chép. Chú giải: 避難（ひなん）sơ tán; 警報（けいほう）cảnh báo; 軍手（ぐんて）găng tay vải; 触る（さわる）chạm; 意外と bất ngờ là; 楽（らく）nhàn.',
    'Chú giải bài 1: 紫外線（しがいせん）tia tử ngoại; 砕ける（くだける）vỡ vụn; 上回る（うわまわる）vượt quá; 水筒（すいとう）bình nước; 意識（いしき）ý thức. Bài 2: 屋根（やね）mái nhà; 支援（しえん）hỗ trợ; 役場（やくば）ủy ban; 業者（ぎょうしゃ）đơn vị thi công; 停電（ていでん）mất điện.',
    'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bố cục: vấn đề → nguyên nhân → giải pháp (場合, さえ～ば) → kết luận (ないかぎり, たとえ～ても). Kiểm tra: としたら dùng cho giả định; 場合 không dùng cho việc chắc chắn xảy ra. Bản nháp tự lưu trên trình duyệt.',
    '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
    'Tự kiểm sau bài: nói quy định khi có động đất bằng 場合は; giả định không có điện bằng としたら; nói điều kiện tối thiểu bằng さえ～ば; nói giới hạn bằng かぎり và ないかぎり; nhượng bộ bằng たとえ～ても. Bài tiếp theo (N3-14): tin tức và truyền đạt lại (によると, ということだ).',
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
      lesson: 'N3-13',
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
      lesson: 'N3-13',
      textbook: 'Original LearnJP — N3 environment and supposition',
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
        'Tự kiểm: đúng độ dài ký tự (20%); nêu rõ vấn đề và giải pháp, chọn đúng としたら／場合／ないかぎり (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
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
      metadata: { source: 'N3-13' },
      ...extra,
    });
  };
  vq.forEach(q => exercise(q, section.EXERCISE));
  kq.forEach(q => exercise(q, section.EXERCISE));
  grammarQuestions.forEach(q => exercise(q, section.EXERCISE));
  listenQuestions.forEach(([i, ...q]) => exercise(q, section.LISTENING, { listeningId: listens[i] }));
  readQuestions.forEach(([i, ...q]) => exercise(q, section.READING, { readingPassageId: reads[i] }));
  // Quiz covers all seven patterns, including the としたら / たら / ば and 場合 contrasts.
  const quiz = [
    ...vq.slice(0, 3),
    ...kq.slice(0, 3),
    ...[0, 2, 3, 4, 6, 8, 10, 11, 12, 13, 14].map(i => grammarQuestions[i]),
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
