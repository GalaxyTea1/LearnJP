// Lesson format and test settings shared by the N1 lessons
// (see scripts/content/lib/unit-package.mjs and unit-checks.mjs).
// N1 lessons teach eight grammar points with two questions each (16) and 45–46 kanji; the quiz
// takes 11 grammar questions that cover all eight points.
export const n1Format = {
  quiz: { grammar: [0, 2, 3, 4, 6, 8, 10, 11, 12, 14, 15] },
  counts: { quiz: 25, exercises: 48 },
};

export const n1Checks = { level: 'N1', vocabulary: 150, grammar: 8, exercises: 48, readingLength: [900, 1500] };
