import type { ReviewCard } from '../../services/api';
import { hanVietChar, hanVietOf } from '../../utils/hanViet';

export interface QueuedCard {
  card: ReviewCard;
  isNew: boolean;
  // A card answered "Quên" comes back later in the same session; that retry is not sent again,
  // because the server has already scheduled it for tomorrow.
  retry: boolean;
}

export const GRADES = [
  { quality: 1, label: 'Quên', hint: 'Học lại', key: '1' },
  { quality: 3, label: 'Khó', hint: 'Nhớ chật vật', key: '2' },
  { quality: 4, label: 'Nhớ', hint: 'Nhớ được', key: '3' },
  { quality: 5, label: 'Dễ', hint: 'Nhớ ngay', key: '4' },
] as const;

export const NEW_CARDS_PER_ROUND = 10;
// Forgotten cards return after a few others so the answer is not still on screen in memory.
const RETRY_GAP = 3;

const keyOf = (c: ReviewCard) => `${c.itemType}:${c.itemId}`;

export function buildQueue(due: ReviewCard[], fresh: ReviewCard[]): QueuedCard[] {
  const seen = new Set<string>();
  const queue: QueuedCard[] = [];
  for (const [cards, isNew] of [
    [due, false],
    [fresh, true],
  ] as const)
    for (const card of cards) {
      if (seen.has(keyOf(card))) continue;
      seen.add(keyOf(card));
      queue.push({ card, isNew, retry: false });
    }
  return queue;
}

export function answerCard(queue: QueuedCard[], quality: number): { queue: QueuedCard[]; submit: boolean } {
  const [head, ...rest] = queue;
  if (!head) return { queue, submit: false };
  if (quality >= 3) return { queue: rest, submit: !head.retry };
  const at = Math.min(RETRY_GAP, rest.length);
  return { queue: [...rest.slice(0, at), { ...head, retry: true }, ...rest.slice(at)], submit: !head.retry };
}

export interface CardFace {
  prompt: string;
  reading?: string;
  romaji?: string;
  hanViet?: string;
  meaning: string;
  details: { label: string; value: string }[];
  example?: { jp: string; vi?: string };
  speakText: string;
  lesson: string;
}

function kanjiExamples(value: unknown): string {
  if (Array.isArray(value))
    return value
      .slice(0, 3)
      .map(e => (e && typeof e === 'object' ? `${e.jp ?? ''}${e.en ? `: ${e.en}` : ''}` : String(e)))
      .join('; ');
  return typeof value === 'string' ? value.split(';').slice(0, 3).join(';') : '';
}

export function cardFace(card: ReviewCard): CardFace {
  const d = card.itemData;
  if (card.itemType === 'KANJI') {
    const details = [
      { label: 'Âm On', value: d.onyomi || '' },
      { label: 'Âm Kun', value: d.kunyomi || '' },
      { label: 'Từ ví dụ', value: kanjiExamples(d.exampleWords) },
    ].filter(x => x.value && x.value !== '—');
    return {
      prompt: d.character,
      hanViet: hanVietChar(d.character) || undefined,
      meaning: d.meaning || '',
      details,
      speakText: (d.kunyomi || d.onyomi || d.character || '').split(/[、,]/)[0],
      lesson: 'Hán tự',
    };
  }
  return {
    prompt: d.japanese,
    reading: d.hiragana && d.hiragana !== d.japanese ? d.hiragana : undefined,
    romaji: d.romaji || undefined,
    hanViet: hanVietOf(d.japanese) || undefined,
    meaning: d.english || '',
    details: [],
    example: d.exampleJp ? { jp: d.exampleJp, vi: d.exampleEn || undefined } : undefined,
    speakText: d.hiragana || d.japanese,
    lesson: 'Từ vựng',
  };
}
