// Builds frontend/src/app/data/hanViet.json from content/han-viet.txt.
// Usage: node scripts/content/build-han-viet.mjs [--check]
import { readFileSync, writeFileSync } from 'node:fs';

const source = new URL('../../content/han-viet.txt', import.meta.url);
const target = new URL('../../frontend/src/app/data/hanViet.json', import.meta.url);

export function parseHanViet(text) {
  const map = {};
  for (const [i, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^(\p{Script=Han})\s+(\p{L}+)$/u);
    if (!m) throw new Error(`content/han-viet.txt:${i + 1}: expected "<kanji> <reading>"`);
    if (map[m[1]]) throw new Error(`content/han-viet.txt:${i + 1}: duplicate ${m[1]}`);
    map[m[1]] = m[2].normalize('NFC').toLowerCase();
  }
  return map;
}

const json = JSON.stringify(parseHanViet(readFileSync(source, 'utf8'))) + '\n';
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== json) {
    console.error('hanViet.json is out of date; run node scripts/content/build-han-viet.mjs');
    process.exit(1);
  }
} else writeFileSync(target, json);
