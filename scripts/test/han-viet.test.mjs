import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const read = async path => readFile(new URL('../../' + path, import.meta.url), 'utf8');
const table = JSON.parse(await read('frontend/src/app/data/hanViet.json'));
const joyo = JSON.parse(await read('content/joyo-kanji.json')).kanji.map(k => k.char);
// Kanji made in Japan (国字) have no Sino-Vietnamese reading.
const KOKUJI = [...'込枠畑塀栃峠匂'];

test('the generated table matches content/han-viet.txt', () => {
  const script = fileURLToPath(new URL('../content/build-han-viet.mjs', import.meta.url));
  execFileSync(process.execPath, [script, '--check'], { stdio: 'pipe' });
});

test('every Jōyō kanji except Japanese-made ones has one lower-case Vietnamese reading', () => {
  assert.deepEqual(
    joyo.filter(c => !table[c]),
    KOKUJI,
  );
  assert.deepEqual(
    Object.keys(table).filter(c => !joyo.includes(c)),
    [],
  );
  for (const [char, reading] of Object.entries(table))
    assert.match(reading, /^[a-zàáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]+$/u, char);
});

test('well-known readings', () => {
  const expected = {
    一: 'nhất',
    学: 'học',
    国: 'quốc',
    気: 'khí',
    来: 'lai',
    予: 'dự',
    電: 'điện',
    語: 'ngữ',
    東: 'đông',
    私: 'tư',
  };
  for (const [char, reading] of Object.entries(expected)) assert.equal(table[char], reading, char);
});
