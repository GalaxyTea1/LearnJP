import { SrsStatus } from '@prisma/client';

export interface SrsInput {
  quality: number; // 0 to 5 rating of recall quality
  repetitions: number;
  interval: number; // in days
  easeFactor: number;
}

export interface SrsOutput {
  repetitions: number;
  interval: number;
  easeFactor: number;
  nextReview: Date;
  status: SrsStatus;
}

/**
 * SuperMemo 2 (SM-2) Spaced Repetition Algorithm
 * @param input Current SRS state and review rating (0-5)
 */
export const calculateSm2 = (input: SrsInput): SrsOutput => {
  let { quality, repetitions, interval, easeFactor } = input;

  // Clamp quality between 0 and 5
  quality = Math.max(0, Math.min(5, Math.round(quality)));

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  let status: SrsStatus = SrsStatus.LEARNING;
  if (repetitions > 5 && interval >= 21) {
    status = SrsStatus.MASTERED;
  } else if (repetitions > 1) {
    status = SrsStatus.REVIEWING;
  }

  return {
    repetitions,
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReview,
    status,
  };
};
