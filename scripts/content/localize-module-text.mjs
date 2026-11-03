// Vietnamese module metadata: node scripts/content/localize-module-text.mjs local|staging|production [--apply]
// Rewrites title/title_jp/description/topics of the 12 N5 modules (originally English) and unifies the
// listening/writing note in N4 descriptions. Default: dry run. --apply backs up the database first and
// verifies that only these columns of these modules changed.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { connect, literal } from './lib/remote-d1.mjs';

const note = 'Nghe bằng giọng đọc của thiết bị, viết tự luyện.';
export const n5 = [
  [
    1,
    'Chữ Kana, chào hỏi và tự giới thiệu',
    'ひらがな・カタカナ・あいさつ・自己紹介',
    'N5-01: làm quen Hiragana, Katakana; chào hỏi và tự giới thiệu với A は B です, câu hỏi ですか, phủ định ではありません, N の N và これ／それ／あれ. 8 Hán tự đầu tiên.',
    ['Chào hỏi', 'Tự giới thiệu', 'Lớp học'],
  ],
  [
    2,
    'Gia đình và mọi người',
    '家族と人',
    'N5-02: giới thiệu gia đình, hỏi tên và tuổi với N の N, この／その／あの, だれ／どなた, 何歳／おいくつですか. 8 Hán tự về gia đình.',
    ['Thành viên gia đình', 'Mọi người xung quanh', 'Hỏi tuổi'],
  ],
  [
    3,
    'Số đếm, thứ và giờ',
    '数字・曜日・時間',
    'N5-03: số đếm, thứ trong tuần, nói giờ và lịch sinh hoạt với ～時～分, ～から～まで, thời gian + に, と, いつ. 8 Hán tự về ngày giờ.',
    ['Số đếm', 'Thứ trong tuần', 'Giờ giấc và lịch'],
  ],
  [
    4,
    'Sinh hoạt hằng ngày',
    '毎日の生活',
    'N5-04: động từ ます／ません, trợ từ を và で, hỏi 何をしますか, trạng từ tần suất いつも・よく・あまり. 8 Hán tự về hoạt động.',
    ['Hoạt động hằng ngày', 'Ăn uống', 'Nơi chốn và tần suất'],
  ],
  [
    5,
    'Vị trí và sự tồn tại',
    '場所と存在',
    'N5-05: あります／います, nơi chốn + に, vị trí 上・下・中・前・後, liệt kê ～や～など; mô tả căn phòng. 8 Hán tự về vị trí.',
    ['Vị trí', 'Người và đồ vật', 'Mô tả căn phòng'],
  ],
  [
    6,
    'Đồ ăn và thức uống',
    '食べ物と飲み物',
    'N5-06: gọi món ～をください, thích và ghét 好き／嫌い, rủ rê ～ましょう（か）, どんな, nhận xét bằng tính từ. 8 Hán tự về đồ ăn và vị.',
    ['Đồ ăn thức uống', 'Khẩu vị và sở thích', 'Gọi món và lời mời'],
  ],
  [
    7,
    'Mua sắm',
    '買い物',
    'N5-07: hỏi giá いくらですか, nói muốn có ～がほしい, tính từ đuôi い + danh từ, cách đếm đồ vật, この／その／あの. 8 Hán tự về tiền và đánh giá.',
    ['Mua sắm và giá cả', 'Màu sắc và miêu tả', 'Đếm đồ vật và mong muốn'],
  ],
  [
    8,
    'Hoạt động cuối tuần',
    '週末の活動',
    'N5-08: muốn làm ～たい, rủ ～ませんか, đi để làm ～へ～に行きます, hỏi và nêu lý do どうして／～からです. 8 Hán tự về đi lại và thời gian.',
    ['Kế hoạch cuối tuần', 'Lời mời và mong muốn', 'Mục đích và lý do'],
  ],
  [
    9,
    'Thời tiết và tính từ',
    '天気と形容詞',
    'N5-09: tính từ và danh từ ở quá khứ, so sánh ～より, ～と～とどちら／～のほうが, nhất ～で一番. 8 Hán tự về thời tiết và mùa.',
    ['Thời tiết và mùa', 'Tính từ ở quá khứ', 'So sánh và lựa chọn'],
  ],
  [
    10,
    'Thể て cơ bản',
    'て形と規則',
    'N5-10: chia thể て; nhờ ～てください, đang làm ～ています, xin phép ～てもいいですか, cấm ～てはいけません. 8 Hán tự về động tác.',
    ['Thể て', 'Nhờ vả, xin phép và quy định', 'Hành động đang diễn ra'],
  ],
  [
    11,
    'Sở thích và dự định',
    '趣味と計画',
    'N5-11: thể từ điển; sở thích ～ことです, trước khi ～まえに, dự định ～つもりです, 何か／どこか／だれか. 8 Hán tự về giải trí.',
    ['Thể từ điển và sở thích', 'Trước khi làm gì', 'Dự định'],
  ],
  [
    12,
    'Tổng ôn N5',
    'N5総復習',
    'N5-12: ôn trợ từ, các thể động từ, nhờ vả – xin phép – cấm đoán, mong muốn – dự định và so sánh qua bài tập tổng hợp; 8 Hán tự mới. Đây là bài tổng ôn trong khóa, không phải đề thi JLPT đầy đủ.',
    ['Ôn trợ từ và thể động từ', 'Nhờ vả, xin phép, mong muốn', 'Đọc, nghe và luyện tập'],
  ],
].map(([unit, title, titleJp, description, topics]) => ({
  unit,
  title,
  title_jp: titleJp,
  description: `${description} ${note}`,
  topics: JSON.stringify(topics),
}));
const n4Rules = [
  ['Bài nghe dùng giọng TTS; viết tự luyện, không có giáo viên chấm tự động.', note],
  ['Bài nghe dùng TTS; viết tự luyện.', note],
  ['Nghe TTS, viết tự luyện.', note],
  ['"Plain form"', '"Thể thông thường"'],
];
const fix = text => n4Rules.reduce((s, [a, b]) => s.split(a).join(b), text);

const target = process.argv[2];
assert.ok(
  ['local', 'staging', 'production'].includes(target),
  'Usage: node scripts/content/localize-module-text.mjs local|staging|production [--apply]',
);
const db = await connect(target);
const { query, rows: one } = db;
const snapshot = () =>
  one('SELECT m.*,l.level AS lvl FROM learning_modules m JOIN jlpt_levels l ON l.id=m.level_id ORDER BY m.id');

const before = await snapshot(),
  changes = [];
for (const row of n5) {
  const m = before.filter(r => r.lvl === 'N5' && r.unit_number === row.unit);
  assert.equal(m.length, 1, `N5-${row.unit} missing`);
  const next = { title: row.title, title_jp: row.title_jp, description: row.description, topics: row.topics };
  if (Object.keys(next).some(k => m[0][k] !== next[k])) changes.push({ id: m[0].id, label: `N5-${row.unit}`, next });
}
const n4 = before.filter(r => r.lvl === 'N4');
assert.equal(n4.length, 14);
for (const m of n4) {
  const next = { description: fix(m.description), topics: fix(m.topics) };
  if (next.description !== m.description || next.topics !== m.topics)
    changes.push({ id: m.id, label: `N4-${m.unit_number}`, next });
}
const queries = changes.map(
  c =>
    `UPDATE learning_modules SET ${Object.entries(c.next)
      .map(([k, v]) => `${k}=${literal(v)}`)
      .join(',')} WHERE id=${c.id}`,
);
const dir = resolve(`.local/localize-modules-${target}`);
await mkdir(dir, { recursive: true });
await writeFile(resolve(dir, 'update.sql'), queries.join(';\n') + ';\n');
if (!process.argv.includes('--apply')) {
  console.log(JSON.stringify({ mode: 'check', target, changes: changes.map(c => c.label) }));
  await db.close();
  process.exit(0);
}
if (!queries.length) {
  console.log(JSON.stringify({ mode: 'apply', target, changes: [] }));
  await db.close();
  process.exit(0);
}

const backup = db.backup(dir, 'before');
await db.batch(queries);
const after = await snapshot(),
  byId = new Map(changes.map(c => [c.id, c.next]));
assert.equal(after.length, before.length);
for (const [i, row] of before.entries())
  assert.deepEqual(after[i], { ...row, ...(byId.get(row.id) ?? {}) }, `Unexpected change in module ${row.id}`);
const receipt = { mode: 'apply', target, backup, changes: changes.map(c => c.label), verified: true };
await writeFile(resolve(dir, 'applied.json'), JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt));
await db.close();
