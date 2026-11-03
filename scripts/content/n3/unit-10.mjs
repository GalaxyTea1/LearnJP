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
} from '../../../content/n3/n3-10.mjs';
import { encodeRow } from '../n5/package.mjs';
export const moduleId = 39001,
  levelId = 30001;
export async function buildUnit() {
  const columns = JSON.parse(
    await readFile(new URL('../../../backend/cloudflare/columns.json', import.meta.url), 'utf8'),
  );
  const stamp = '2026-11-08T00:00:00.000Z',
    rows = {};
  const add = (table, data) => {
    const list = (rows[table] ??= []);
    const row = Object.fromEntries(columns[table].map(f => [f.name, null]));
    Object.assign(
      row,
      { id: 39001 + list.length, createdAt: stamp, updatedAt: stamp, status: 'DRAFT', version: 1 },
      data,
    );
    const encoded = encodeRow(row, columns[table]);
    list.push(encoded);
    return row.id;
  };
  add('learning_modules', {
    levelId,
    unitNumber: 10,
    title: 'Giữ gìn sức khỏe',
    titleJp: '体を大切に',
    description:
      'N3-10: sức khỏe, lời khuyên và nghĩa vụ: ～わけにはいかない, ～ないわけにはいかない, ～ことだ, ～ものだ, ～たものだ, ～ないことはない, ～べきではない. Cơ thể, triệu chứng, khám chữa bệnh và lối sống; 24 Hán tự về sức khỏe. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Sức khỏe', 'Khám bệnh', 'Lời khuyên và nghĩa vụ'],
    sortOrder: 10,
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
    'Lời khuyên và nghĩa vụ',
    'Hội thoại',
    'Luyện nghe',
    'Đọc hiểu',
    'Tự luyện viết',
    'Bài tập',
    'Tổng kết',
  ];
  const instructions = [
    'Tiên quyết: N5, N4 (N4-06 なければならない, ほうがいい, べき nhập môn) và N3-01 đến N3-09. Mục tiêu: mô tả triệu chứng khi đi khám, hiểu hướng dẫn dùng thuốc, nói điều không thể làm hoặc buộc phải làm vì hoàn cảnh, khuyên người khác đúng mức độ, nói lẽ thường và hồi tưởng. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%. Nội dung không thay lời khuyên của bác sĩ.',
    'Cơ thể, triệu chứng, khám chữa bệnh, chuyên khoa, phòng bệnh, lối sống. Cặp gần nghĩa: 治る (tự khỏi) / 治す (chữa); 血 / 血液 (y học); 眠る (văn viết) / 寝る; 診察 (khám) / 診断 (chẩn đoán) / 診療 (khám chữa) / 受診 (đi khám); 軽症 / 重症; 満腹 / 空腹; 吐く có hai nghĩa: nôn, thở ra.',
    '24 chữ mới: 健康 治療 痛症 血骨胃腹歯鼻首肩腰 疲眠汗吸吐息 患処診. Từ ghép trọng tâm: 健康, 治療（ちりょう）, 頭痛（ずつう, chú ý ず）, 症状（しょうじょう）, 血液（けつえき）, 血圧, 骨折, 腹痛, 虫歯, 鼻水, 肩こり, 腰痛（ようつう）, 不眠, 呼吸（こきゅう）, 吐き気, 患者（かんじゃ）, 処方, 診察（しんさつ）.',
    '7 mục: ～わけにはいかない; ～ないわけにはいかない; ～ことだ (lời khuyên); ～ものだ (lẽ thường) và ～ものではない (không nên); ～たものだ (hồi tưởng); ～ないことはない; ～べきではない. So sánh: わけにはいかない (có thể nhưng không được vì đạo lý) / できない (không có khả năng); ないわけにはいかない (khó xử, buộc phải) / なければならない (nghĩa vụ chung); ことだ (khuyên mạnh, không dùng với người trên) / ほうがいい (gợi ý mềm).',
    'Hội thoại tự soạn, tình huống giả định. Chú giải: 度（ど）độ; 分（ぶ）phần mười độ (三十八度五分 = 38,5 độ); 念のため để chắc chắn; うつす lây; 押さえる（おさえる）ôm, giữ; 整形外科（せいけいげか）chỉnh hình.',
    'Nghe trước, sau đó mới mở bản chép. Chú giải: 錠剤（じょうざい）viên nén; 抑える（おさえる）làm giảm; あける cách (thời gian); 咳止め（せきどめ）thuốc ho; 粉薬（こなぐすり）thuốc bột; 痛み止め（いたみどめ）thuốc giảm đau; 高め（たかめ）hơi cao; 塩分（えんぶん）lượng muối; わし ông (cách xưng của người già); ねぎ hành lá; おかゆ cháo.',
    'Chú giải bài 1: 削る（けずる）cắt giảm; 調整（ちょうせい）điều chỉnh; 脳（のう）não; 目覚めさせる làm thức tỉnh; 近道（ちかみち）đường tắt. Bài 2: 向かう（むかう）hướng về, ngồi trước; とうとう cuối cùng; 姿勢（しせい）tư thế; 丸い（まるい）tròn, còng; 回す（まわす）xoay; かえって ngược lại.',
    'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 là tin nhắn khuyên bạn: thông cảm trước, khuyên sau, giọng thân thiện. Bài 2 kể thói quen xưa bằng ～たものだ rồi so với hiện tại. Kiểm tra mức độ: ことだ／べきではない mạnh, ほうがいい mềm. Bản nháp tự lưu trên trình duyệt.',
    '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
    'Tự kiểm sau bài: mô tả ba triệu chứng với bác sĩ; nói một việc không thể làm bằng わけにはいかない và một việc buộc phải làm bằng ないわけにはいかない; khuyên bạn bằng ことだ và nói với cấp trên bằng ほうがいい; kể một thói quen xưa bằng たものだ. Bài tiếp theo (N3-11): thay đổi và tương quan (につれて, にしたがって, ば～ほど).',
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
      lesson: 'N3-10',
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
      lesson: 'N3-10',
      textbook: 'Original LearnJP — N3 health and advice',
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
        'Tự kiểm: đúng độ dài ký tự (20%); chọn đúng mức khuyên (ことだ／ほうがいい／べきではない) và mẫu nghĩa vụ (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
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
      metadata: { source: 'N3-10' },
      ...extra,
    });
  };
  vq.forEach(q => exercise(q, section.EXERCISE));
  kq.forEach(q => exercise(q, section.EXERCISE));
  grammarQuestions.forEach(q => exercise(q, section.EXERCISE));
  listenQuestions.forEach(([i, ...q]) => exercise(q, section.LISTENING, { listeningId: listens[i] }));
  readQuestions.forEach(([i, ...q]) => exercise(q, section.READING, { readingPassageId: reads[i] }));
  // Quiz covers all seven patterns, including the ことだ / ほうがいい and わけにはいかない / できない contrasts.
  const quiz = [
    ...vq.slice(0, 3),
    ...kq.slice(0, 3),
    ...[0, 1, 2, 4, 5, 7, 8, 9, 10, 11, 13].map(i => grammarQuestions[i]),
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
