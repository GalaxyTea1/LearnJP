// Kanji the course already teaches (N5, N4, N3) and the joyo table the remaining levels draw from.
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../../../content/', import.meta.url);

export async function joyoKanji() {
  return JSON.parse(await readFile(new URL('joyo-kanji.json', root), 'utf8')).kanji;
}

export async function taughtKanji() {
  const taught = new Set();
  const n5 = JSON.parse(await readFile(new URL('n5/source.json', root), 'utf8'));
  for (const row of n5.kanji) taught.add(row.character);
  for (const level of ['n4', 'n3']) {
    const folder = new URL(`${level}/`, root);
    for (const name of (await readdir(folder)).filter(n => /^n\d-\d+\.mjs$/.test(n))) {
      const unit = await import(new URL(name, folder));
      for (const k of unit.kanji ?? []) taught.add(Array.isArray(k) ? k[0] : k.character);
    }
  }
  return taught;
}

// Grammar points taught so far, normalised so 「～ため（に）」 and 「～ため」 compare equal. The
// wave dash stays: 「～つ～つ」 and 「～つつ」 are different patterns.
export const normalizeGrammar = pattern =>
  pattern
    .replace(/[〜~]/g, '～')
    .replace(/\s/g, '')
    .replace(/（[^）]*）/g, '')
    .replace(/^～/, '');

export async function taughtGrammar() {
  const taught = new Set();
  const n5 = JSON.parse(await readFile(new URL('n5/source.json', root), 'utf8'));
  for (const row of n5.grammar_patterns) taught.add(normalizeGrammar(row.pattern));
  for (const level of ['n4', 'n3']) {
    const folder = new URL(`${level}/`, root);
    for (const name of (await readdir(folder)).filter(n => /^n\d-\d+\.mjs$/.test(n))) {
      const unit = await import(new URL(name, folder));
      for (const g of unit.grammar ?? []) taught.add(normalizeGrammar(Array.isArray(g) ? g[0] : g.pattern));
    }
  }
  return taught;
}
