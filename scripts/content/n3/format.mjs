// Lesson format and test settings shared by every N3 lesson
// (see scripts/content/lib/unit-package.mjs and unit-checks.mjs).
import { readFileSync } from 'node:fs';

const kanjiPlan = JSON.parse(readFileSync(new URL('./planning/n3-kanji-plan.json', import.meta.url), 'utf8'));

export const n3Format = {
  playbackSpeed: 0.9,
  distractors: [17, 41, 73],
  kanjiSection: 'Hán tự',
  mnemonicTail: 'với các từ ghép ví dụ.',
  counts: { quiz: 25, exercises: 47 },
};

export const n3Checks = { level: 'N3', vocabulary: 105, kanjiPlan, grammarPlan: null };
