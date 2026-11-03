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
} from '../../../content/n4/n4-01.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 10001,
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
      { id: 10001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('jlpt_levels', {
    level: 'N4',
    title: 'N4 — Giao tiếp đời sống',
    titleJp: '日本語能力試験 N4',
    description: 'Đang mở N4-01. Các bài N4 tiếp theo chưa xuất bản. Không phải khóa N4 hoàn chỉnh.',
    color: '#38BDF8',
    badge: '🌊',
    totalVocab: 50,
    totalKanji: 12,
    totalGrammar: 7,
    sortOrder: 2,
  });
  add('learning_modules', {
    levelId,
    unitNumber: 1,
    title: 'Ôn N5 và thể thông thường',
    titleJp: 'N5復習・普通形',
    description:
      'N4-01: chia động từ, viết nhật ký và nêu ý kiến. Ôn 読・書・聞・食・飲・待・持; học 12 Kanji mới. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Thể thông thường', 'Nhật ký', 'Ý kiến và lý do'],
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
    '50 từ dùng trong bài',
    '12 Kanji mới',
    'Thể thông thường',
    'Hội thoại',
    'Luyện nghe TTS',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: kiến thức N5, không yêu cầu chứng chỉ. Học các dạng khẳng định/phủ định hiện tại/quá khứ, nêu lý do và ý kiến. Hoàn thành 40 bài tập và quiz 20 câu; ngưỡng quiz 70%. Đây là bài mở đầu, không xác nhận đạt N4.',
    'Nghĩa Anh/Việt và ví dụ được hiển thị cùng nhau. 思う thuộc nhóm 1; 考える thuộc nhóm 2; các động từ còn lại ghi nhóm trong nghĩa. Các tính từ đuôi い là i; 心配・簡単・複雑・特別 là na. Từ N5 dùng để ôn không tính vào 50 từ mới.',
    'Ôn 読・書・聞・食・飲・待・持 ở N5. Từ ghép ghi rõ cách đọc trong phần ví dụ. Các từ như 思考・参考・作品・注意・理解・由来 là mở rộng nhận biết, không bị hỏi nếu chưa cung cấp nghĩa.',
    'Học 7 mẫu, so sánh thể lịch sự và thông thường. Câu hỏi thân mật thường bỏ か/だ và lên giọng; không mặc định dùng với người mới quen.',
    'Nghe TTS và đọc vai A/B. TTS không thay thế bản thu hội thoại tự nhiên. Bài 2 minh họa chuyển từ lịch sự sang thân mật khi hai người đồng ý.',
    'Nghe trước khi mở bản chép. Thời lượng phụ thuộc giọng thiết bị, không gán thời lượng bản thu. Mở rộng nhận biết: 会おう = hẹn gặp nhé, ～こと = việc..., ～てから = sau khi...',
    'Đọc nội dung rồi trả lời câu hỏi. Chú giải: 調べる（しらべる）tra cứu; 携帯電話（けいたいでんわ）điện thoại di động; 明るい（あかるい）sáng; ベンチ ghế dài; ～こと việc..., ～になる trở thành; が nối hai vế với nghĩa nhưng.',
    'Bản nháp lưu trên trình duyệt. Tự kiểm theo rubric; không có chấm điểm viết tự động. Độ dài tính theo ký tự tiếng Nhật, không phải số câu.',
    '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu nghe/đọc đặt cạnh tư liệu tương ứng. Chọn đáp án và đọc giải thích.',
    'V: 食べる/食べない/食べた/食べなかった. i: 高い/高くない/高かった/高くなかった. N/na: 静かだ/静かではない/静かだった/静かではなかった. N/na + だから, V/i + から. Trước と思います dùng thể thông thường. Ôn lại câu sai trước khi nộp quiz.',
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
      lesson: 'N4-01',
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
      lesson: 'N4-01',
      textbook: 'Original LearnJP — plain form review',
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
        'Tự kiểm: đúng độ dài ký tự (25%); dạng động từ/tính từ và と思う đúng (35%); đủ ý theo đề (25%); mạch lạc và từ dùng tự nhiên (15%). Không có điểm tự động.',
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
  const kq = [
    ['思う', 'おもう', 'かんがえる', 'いう', 'はなす'],
    ['考える', 'かんがえる', 'おもう', 'つくる', 'よむ'],
    ['言う', 'いう', 'かう', 'あう', 'まつ'],
    ['話す', 'はなす', 'かえす', 'さがす', 'けす'],
    ['作る', 'つくる', 'おくる', 'くる', 'とる'],
    ['心配', 'しんぱい', 'しっぱい', 'しんはい', 'しんばい'],
    ['意見', 'いけん', 'いみ', 'いげん', 'けいけん'],
    ['理由', 'りゆう', 'りょうり', 'じゆう', 'りよう'],
  ].map(([word, ...opts]) => [
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
      metadata: { source: 'N4-01' },
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
