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
} from '../../../content/n3/n3-05.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 34001,
  levelId = 30001;
export async function buildUnit() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-11-03T00:00:00.000Z',
    rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: 34001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 5,
    title: 'Nêu ý kiến',
    titleJp: '意見を言う',
    description:
      'N3-05: nêu quan điểm có căn cứ và phản biện; ～わけだ, ～わけではない, ～わけがない, ～はずがない, ～に違いない, ～とは限らない, ～というより. Thảo luận, khảo sát, đa số và thiểu số; 24 Hán tự về tranh luận. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Ý kiến', 'Lập luận và phản biện', 'Thảo luận'],
    sortOrder: 5,
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
    'Lập luận',
    'Hội thoại',
    'Luyện nghe',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: N5, N4 và N3-01 đến N3-04 (đặc biệt ～はずだ ở N3-01 và các cách nói suy đoán ở N3-04). Mục tiêu: nêu quan điểm có căn cứ, thừa nhận ý kiến khác rồi phản biện, phủ định một phần một khái quát hóa, và viết bài ý kiến 250–350 ký tự có bố cục rõ. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
    'Thảo luận, lý lẽ, sự thật và nhận thức, đa số và dữ liệu, liên từ lập luận, chủ đề xã hội. Cặp gần nghĩa: 同意 (đồng ý với ý kiến) / 合意 (các bên thống nhất) / 賛同 (tán đồng đề xuất); 説得 (thuyết phục người khác) và 納得 (bản thân chấp nhận); 誤り (văn viết) và 間違い; 当然 và 当たり前 (khẩu ngữ hơn); 視点 và 観点 (trang trọng hơn); 明らか và 明確 (trang trọng, rõ ràng minh bạch). 本音 (suy nghĩ thật) đối với 建前 (lời xã giao).',
    '24 chữ mới: 賛否 反対 議論 判断 違例誤 実際 根拠証示張 疑頼解率 当然. Từ ghép trọng tâm: 賛否（さんぴ）, 議論, 結論, 反論, 判断, 断言, 例外, 誤解, 事実, 実際（じっさい）, 根拠（こんきょ）, 証拠（しょうこ）, 主張, 疑問, 信頼, 解釈, 確率（かくりつ）, 当然. Chú ý 率 đọc りつ trong 確率 nhưng そつ trong 率直.',
    '7 mục: ～わけだ (thảo nào / tức là); ～わけではない (không hẳn là); ～わけがない (không thể nào, cảm xúc mạnh); ～はずがない (không thể nào, có căn cứ); ～に違いない (tin chắc); ～とは限らない (chưa chắc đã, thường với 必ずしも); ～というより. So sánh: わけがない nhấn cảm nhận của người nói; はずがない nhấn căn cứ; はずだ (N3-01) là khẳng định có căn cứ. Phân biệt わけではない (phủ định một phần) với ～ない (phủ định hoàn toàn).',
    'Hội thoại tự soạn, tình huống giả định. Chú giải: 辞書（じしょ）từ điển; アプリ ứng dụng; 気になる thấy phiền, để ý; 消す（けす）tắt; やる気（やるき）động lực, hứng làm; 連れていく（つれていく）đưa đi; 事情（じじょう）hoàn cảnh.',
    'Nghe trước, sau đó mới mở bản chép. Chú giải: 司会（しかい）người dẫn chương trình; 区別（くべつ）ranh giới, phân biệt; 並ぶ（ならぶ）xếp hàng; 貼る（はる）dán; 改装（かいそう）sửa sang lại; 意見文（いけんぶん）bài ý kiến; 説得力（せっとくりょく）sức thuyết phục; 触れる（ふれる）nhắc đến; 一方的（いっぽうてき）một chiều.',
    'Chú giải bài 1: 高学年（こうがくねん）các lớp lớn ở tiểu học; 睡眠（すいみん）giấc ngủ; 危険（きけん）nguy hiểm; 手段（しゅだん）phương tiện; そのもの bản thân nó. Bài 2: 文化祭（ぶんかさい）lễ hội văn hóa; 出し物（だしもの）tiết mục; 劇（げき）kịch; 本番（ほんばん）buổi diễn chính thức; 完成（かんせい）hoàn thành; 含む（ふくむ）bao gồm; 少数派（しょうすうは）nhóm thiểu số; きちんと đầy đủ, nghiêm túc.',
    'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 là bài ý kiến: quan điểm, hai lý do (まず／次に), 確かに～が～ để thừa nhận ý kiến khác, rồi kết luận. Bài 2 là tin nhắn phản đối lịch sự. Tách rõ sự thật và ý kiến; mỗi lý do nên có căn cứ hoặc ví dụ. Bản nháp tự lưu trên trình duyệt.',
    '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
    'Tự kiểm sau bài: nói một câu わけだ sau khi biết lý do; phản biện một khái quát bằng 必ずしも～とは限らない; phân biệt そんなわけない (phản ứng cảm xúc) và 休みだから開いているはずがない (có căn cứ); nói lại một ý bằng ～というより. Bài tiếp theo (N3-06): nguyên nhân và kết quả (ため, おかげで, せいで).',
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
      lesson: 'N3-05',
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
      lesson: 'N3-05',
      textbook: 'Original LearnJP — N3 opinions and reasoning',
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
        'Tự kiểm: đúng độ dài ký tự (20%); lập luận có căn cứ, dùng đúng mức phủ định / khẳng định (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
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
      metadata: { source: 'N3-05' },
      ...extra,
    });
  };
  vq.forEach(q => exercise(q, section.EXERCISE));
  kq.forEach(q => exercise(q, section.EXERCISE));
  grammarQuestions.forEach(q => exercise(q, section.EXERCISE));
  listenQuestions.forEach(([i, ...q]) => exercise(q, section.LISTENING, { listeningId: listens[i] }));
  readQuestions.forEach(([i, ...q]) => exercise(q, section.READING, { readingPassageId: reads[i] }));
  // Quiz covers all seven patterns, including the わけがない / はずがない contrast.
  const quiz = [
    ...vq.slice(0, 3),
    ...kq.slice(0, 3),
    ...[0, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13].map(i => grammarQuestions[i]),
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
