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
} from '../../../content/n3/n3-04.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 33001,
  levelId = 30001;
export async function buildUnit() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-11-02T00:00:00.000Z',
    rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: 33001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 4,
    title: 'Ấn tượng về con người',
    titleJp: '人の印象',
    description:
      'N3-04: miêu tả ngoại hình, tính cách và ấn tượng; suy đoán bằng ～そうだ (dáng vẻ), ～ようだ, ～みたいだ; N＋らしい, ～っぽい, ～ように見える; phân biệt các cách nói suy đoán. 24 Hán tự về con người và cảm xúc. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tính cách', 'Ngoại hình', 'Suy đoán và ấn tượng'],
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
    '105 từ vựng mới',
    '24 Hán tự mới',
    'Suy đoán và ấn tượng',
    'Hội thoại',
    'Luyện nghe',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: N5, N4 (N4-11: そうだ truyền đạt, らしい, みたいだ) và ba bài cầu nối N3-01 đến N3-03. Mục tiêu: miêu tả ngoại hình, tính cách và ấn tượng về một người; phân biệt suy đoán dựa vào vẻ ngoài, dựa vào dấu hiệu tự quan sát và dựa vào thông tin nghe được. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
    'Tính cách và nhận xét, ngoại hình, ấn tượng và cảm xúc, らしい／っぽい, từ tượng thái. Cặp gần nghĩa và trái nghĩa: 長所／短所 (欠点 nặng hơn); 慎重／大胆; 積極的／消極的; 地味／派手; 太る／痩せる (trạng thái: 太っている／痩せている); 見た目 (khẩu ngữ) và 外見; 正直 và 誠実 (trang trọng hơn); 子供らしい (khen) và 子供っぽい (chê); 恐ろしい mạnh hơn 怖い.',
    '24 chữ mới: 性格 若美優 怒笑泣驚恐喜 感覚 雰囲 髪背太細似 印象 姿表. Từ ghép trọng tâm: 性格, 個性, 若者, 美人, 優秀, 笑顔（えがお, cách đọc đặc biệt）, 恐怖, 感情, 感覚, 雰囲気（ふんいき, hay đọc nhầm ふいんき）, 髪型, 背中, 細かい, 似合う, 印象, 表情.',
    '7 mục: ～そうだ (dáng vẻ); ～ようだ; ～みたいだ; N＋らしい (đúng chất); ～っぽい; ～ように見える／そうに見える; bảng phân biệt. Hỏi “dựa vào đâu?”: vẻ trước mắt → そうだ (Vます／gốc tính từ); nghe người khác nói → そうだ (thể thông thường, N4-11); tự quan sát dấu hiệu → ようだ／みたいだ; thông tin nghe được, giữ khoảng cách → らしい. Lưu ý: いい→よさそう, ない→なさそう; không nói きれいそう khi đang nhìn thấy.',
    'Hội thoại tự soạn, tình huống giả định. Chú giải: リーダー trưởng nhóm; 片付く（かたづく）được dọn gọn; 誘う（さそう）rủ; お正月（おしょうがつ）Tết; 家族思い（かぞくおもい）thương gia đình; お人形（おにんぎょう）búp bê; 娘（むすめ）con gái.',
    'Nghe trước, sau đó mới mở bản chép. Chú giải: 迷子（まいご）trẻ đi lạc; 身長（しんちょう）chiều cao; 半ズボン quần soóc; お心当たり biết thông tin; ドラマ phim truyền hình; 主人公（しゅじんこう）nhân vật chính; 演技（えんぎ）diễn xuất; 一応（いちおう）tạm, cứ; にぎやか ồn ào, náo nhiệt.',
    'Chú giải bài 1: 数秒（すうびょう）vài giây; 判断（はんだん）đánh giá; 入学式（にゅうがくしき）lễ nhập học; 周囲（しゅうい）xung quanh; 班（はん）nhóm; 初対面（しょたいめん）lần đầu gặp. Bài 2: ふうに theo kiểu; 無理に（むりに）gượng ép; ぐったり mệt rã rời; 口数（くちかず）số lời nói; ふりをする giả vờ.',
    'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 miêu tả một người quen: ngoại hình, ấn tượng đầu tiên, tính cách thật. Bài 2 giới thiệu ưu nhược điểm khi ứng tuyển, giữ giọng lịch sự. Kiểm tra từng câu suy đoán: bạn dựa vào đâu, đã chọn đúng そうだ／ようだ／らしい chưa. Bản nháp tự lưu trên trình duyệt.',
    '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
    'Tự kiểm sau bài: nói ba câu với 降りそうだ／降るそうだ／降ったようだ và giải thích khác nhau; tả một người quen bằng ～そうに見える và 実は; phân biệt 子供らしい và 子供っぽい; nói một ưu điểm, một nhược điểm của mình. Bài tiếp theo (N3-05): ý kiến và lập luận (わけ, はずがない, に違いない).',
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
      lesson: 'N3-04',
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
      lesson: 'N3-04',
      textbook: 'Original LearnJP — N3 people and impressions',
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
        'Tự kiểm: đúng độ dài ký tự (20%); chọn đúng cách nói suy đoán theo căn cứ, dùng đủ mẫu đề yêu cầu (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
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
      metadata: { source: 'N3-04' },
      ...extra,
    });
  };
  vq.forEach(q => exercise(q, section.EXERCISE));
  kq.forEach(q => exercise(q, section.EXERCISE));
  grammarQuestions.forEach(q => exercise(q, section.EXERCISE));
  listenQuestions.forEach(([i, ...q]) => exercise(q, section.LISTENING, { listeningId: listens[i] }));
  readQuestions.forEach(([i, ...q]) => exercise(q, section.READING, { readingPassageId: reads[i] }));
  // Quiz covers all seven patterns, including the そうだ / ようだ / らしい / みたいだ contrast.
  const quiz = [
    ...vq.slice(0, 3),
    ...kq.slice(0, 3),
    ...[0, 1, 3, 4, 5, 6, 7, 9, 11, 12, 13].map(i => grammarQuestions[i]),
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
