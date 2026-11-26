import table from '../data/hanViet.json';

// Sino-Vietnamese (Hán Việt) readings of the Jōyō kanji, from content/han-viet.txt.
const readings = table as Record<string, string>;

/** Reading of one kanji, upper-cased as Vietnamese dictionaries print it ("NHẤT"), or ''. */
export function hanVietChar(char: string): string {
  return readings[char]?.toLocaleUpperCase('vi') ?? '';
}

/** Readings of every kanji in a word, in order ("新生活" → "TÂN SINH HOẠT"); kana are skipped. */
export function hanVietOf(text: string | null | undefined): string {
  return [...(text ?? '')].map(hanVietChar).filter(Boolean).join(' ');
}
