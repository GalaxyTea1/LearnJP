// Greedy kanji assignment for the N3 syllabus: each module takes the first
// `quota` candidates (in priority order) not already known or used.
import { readFileSync, writeFileSync } from 'node:fs';
const n4 = JSON.parse(readFileSync(new URL('./n4-ledger.json', import.meta.url))).n4kanji;
const n5 = JSON.parse(readFileSync(new URL('./n5-kanji.json', import.meta.url)));
const known = new Set([...n5, ...n4]);
const gap = [
  ...'一二三四五六七八九十曜半午東西南北口耳川田校何年名間国店同地方問代京主不野以家元重別死朝真有町工研究起質族銀映味写答夜悪黒赤青色洋服夕堂鳥飯昼犬妹姉',
];

const pools = {
  'N3-01': [26, '一二三四五六七八九十年半午曜朝昼夕夜間何名町色赤青黒'],
  'N3-02': [23, '家族妹姉犬鳥東西南北口耳川田国京地方店堂飯洋服'],
  'N3-03': [25, '同主元重別真有工味写校問代不以野死起研究質銀映答悪'],
  'N3-04': [24, '性格若美優怒笑泣驚恐喜感覚雰囲髪背太細似印象姿表情顔普段個'],
  'N3-05': [24, '賛否反対議論判断違例誤実際根拠証示張疑頼解決否定確率当然'],
  'N3-06': [24, '原因結果影響効故害災及被損失敗功責任状況険危防件訳恵'],
  'N3-07': [24, '晴曇降温暖涼冷寒暑熱季節晩昨翌期過経進途迎戻頃秒瞬'],
  'N3-08': [24, '講義科修得点績復標達選択規則努望希願夢志識初級師徒査'],
  'N3-09': [24, '働給求募応雇履面接営販管企署部役担務協資類式契退辞歳'],
  'N3-10': [24, '健康治療痛症血骨胃腹歯鼻首肩腰疲眠汗吸吐息患処診'],
  'N3-11': [24, '数割倍平均産齢老婚済景価値段税億伸低適全各加総夫婦若'],
  'N3-12': [24, '技術機械器製造利便携帯個型比較向逆差異共像板装置量映'],
  'N3-13': [24, '環境源森林植葉燃捨汚染守保護震波候届酸素炭灰暴荒枯'],
  'N3-14': [24, '政府民党挙法律官庁警察犯罪逮捕訴放委憲刊載領統総議局'],
  'N3-15': [24, '権等批支援制限許可観抗争戦勝負競討賃格差論証絶対投票迷惑構'],
  'N3-16': [24, '伝統祭儀神仏宗仲互交換贈祝慣誌武舞踊曲演劇芸術歴灯飾豆菓'],
};

const used = new Set();
const result = {};
for (const [code, [quota, pool]] of Object.entries(pools)) {
  const allowGap = code <= 'N3-03';
  const picked = [];
  for (const ch of [...pool]) {
    if (picked.length === quota) break;
    if (used.has(ch) || known.has(ch)) continue;
    if (!allowGap && gap.includes(ch)) continue;
    picked.push(ch);
    used.add(ch);
  }
  result[code] = picked.join('');
  console.log(code, picked.length, picked.length < quota ? `SHORT ${quota - picked.length}` : '', picked.join(''));
}
const missingGap = gap.filter(ch => !used.has(ch));
console.log('gap not placed:', missingGap.join('') || 'none');
console.log('total new', used.size, 'cumulative', known.size + used.size);
writeFileSync(new URL('./n3-kanji-plan.json', import.meta.url), JSON.stringify(result, null, 1));
