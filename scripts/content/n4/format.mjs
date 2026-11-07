// Lesson format and test settings shared by every N4 lesson
// (see scripts/content/lib/unit-package.mjs and unit-checks.mjs).
export const n4Format = {
  playbackSpeed: 0.85,
  distractors: [13, 23, 33],
  kanjiSection: 'Kanji',
  mnemonicTail: 'với các từ ví dụ. Từ ghép chưa học chỉ dùng nhận biết.',
  listeningInstructions: 'Nghe TTS và trả lời câu hỏi bên dưới. Có thể mở bản chép và bản dịch để tự kiểm.',
  counts: { quiz: 20, exercises: 40 },
};

export const n4Checks = {
  level: 'N4',
  vocabulary: 50,
  kanjiPlan: null,
  grammarPlan: null,
  listenings: 2,
  exercises: 40,
  quiz: 20,
};
