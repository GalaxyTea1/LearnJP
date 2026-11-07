import * as content from '../../../content/n3/n3-16.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 45001,
  levelId = 30001;
const allGrammar = content.grammarQuestions.map((_, i) => i);

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-16',
    unitNumber: 16,
    moduleId,
    levelId,
    stamp: '2026-11-14T00:00:00.000Z',
    title: 'Tổng ôn N3: văn hóa và phong tục',
    titleJp: '日本の文化と習慣',
    description:
      'N3-16: tổng ôn N3-01 đến N3-15 theo 9 nhóm ngữ pháp và bảng các cặp so sánh, không thêm mẫu mới. 105 từ ôn lại từ các bài trước, 24 Hán tự mới về lễ hội, tôn giáo và nghệ thuật; bài đọc 800–1.000 ký tự và bài nghe dài khoảng 3 phút. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tổng ôn N3', 'Văn hóa và phong tục', 'Đọc và nghe dài'],
    textbook: 'Original LearnJP — N3 cumulative review',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ ôn tập',
      '24 Hán tự mới',
      'Tổng ôn 9 nhóm ngữ pháp',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: hoàn thành N3-01 đến N3-15. Mục tiêu: phối hợp ngữ pháp N3 trong bài đọc 800–1.000 ký tự và bài nghe dài khoảng 3 phút, nắm bảng các cặp so sánh, viết báo cáo một phong tục. 47 bài luyện và quiz tổng ôn 25 câu có câu ngữ pháp từ từng bài N3-01 đến N3-15, đạt từ 70%. Đây là bài tổng ôn trong khóa, không phải đề JLPT chính thức.',
      '105 từ ôn lại: 7 từ từ mỗi bài N3-01 đến N3-15, giữ nguyên cách đọc, nghĩa và câu ví dụ của bài gốc. Không phải từ mới; dùng để tự kiểm tra trí nhớ và đánh dấu từ đã thuộc. Gặp từ quên, hãy mở lại bài gốc ghi trong sổ ôn tập.',
      '24 chữ mới về văn hóa: 祭儀神仏宗 仲互交換贈祝慣誌 武舞踊曲演劇芸 灯飾豆菓. Từ ghép trọng tâm: 祭り（まつり）, 儀式（ぎしき）, 神社（じんじゃ）, 仏教（ぶっきょう）, 宗教, 仲間, お互い, 交換（こうかん）, 贈り物（おくりもの）, 祝う, 習慣（しゅうかん）, 雑誌, 武道, 舞台（ぶたい）, 盆踊り, 作曲, 演劇（えんげき）, 芸術, 電灯, 飾る, 豆まき, 和菓子（わがし）. Chú ý 神社 đọc じんじゃ, 和菓子 đọc わがし.',
      '9 nhóm ôn: suy đoán; sai khiến và kính ngữ; nguyên nhân; thời điểm; mục đích và nghĩa vụ; đối tượng và lập trường; thay đổi và so sánh; giả định và truyền đạt; nhượng bộ. Bảng cặp so sánh: そうだ／ようだ／らしい／みたいだ; わけがない／はずがない; おかげで／せいで; うちに／最中に／たとたん; ことにする／ことになる; に対して／にとって; につれて／にしたがって／とともに; 一方で／反面; に代わって／かわりに; としたら／たら／ば; ということだ／そうだ／らしい; から～にかけて／から～まで; ものの／のに／くせに.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 七五三（しちごさん）lễ cho trẻ 3, 5, 7 tuổi; 成長（せいちょう）trưởng thành; 拝見する（はいけんする）xem (khiêm nhường); 千歳あめ（ちとせあめ）kẹo Chitose; 込める（こめる）gửi gắm; 浴衣（ゆかた）yukata; 屋台（やたい）quầy hàng.',
      'Nghe trước, sau đó mới mở bản chép; bài 1 dài khoảng 3 phút, hãy ghi chú ý chính khi nghe. Chú giải: 民俗学（みんぞくがく）dân tộc học; 魂（たましい）linh hồn; 先祖（せんぞ）tổ tiên; 迎え火（むかえび）lửa đón; なぐさめる an ủi; 帰省（きせい）về quê; 日持ち（ひもち）để được lâu; 鳥居（とりい）cổng đền; 手水舎（ちょうずや）chỗ rửa tay; お賽銭（おさいせん）tiền công đức.',
      'Hai bài đọc dài 800–1.000 ký tự: đọc lướt để nắm ý chính trước, sau đó đọc kỹ. Chú giải bài 1: 年中行事（ねんじゅうぎょうじ）sự kiện thường niên; お年玉（おとしだま）tiền mừng tuổi; 鬼（おに）quỷ; お墓参り（おはかまいり）viếng mộ; 収穫（しゅうかく）thu hoạch; 担い手（にないて）người kế tục. Bài 2: 大家（おおや）chủ nhà; お中元（おちゅうげん）/お歳暮（おせいぼ）quà mùa hè/cuối năm; 内祝い（うちいわい）quà đáp lễ; 鉢植え（はちうえ）cây chậu; 長引く（ながびく）kéo dài.',
      'Viết 250–350 ký tự. Có bài mẫu để so sánh sau khi viết. Bố cục báo cáo phong tục: thời gian và nguồn gốc → hoạt động → ý nghĩa → cảm nghĩ. Kiểm tra: dùng ít nhất ba mẫu N3 thuộc các nhóm khác nhau; văn viết thống nhất だ・である. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng ôn, 10 Hán tự, 15 ngữ pháp (mỗi bài N3-01 đến N3-15 một câu), 6 nghe, 6 đọc. Quiz tổng ôn 25 câu, đạt từ 70%; phần nghe trong quiz hiển thị bản chép để ôn lại.',
      'Tự kiểm cuối khóa N3: với mỗi nhóm ôn, đặt một câu về văn hóa Nhật hoặc Việt Nam; tự giải thích được các cặp so sánh trong bảng; đọc hiểu một bài 800 ký tự trong khoảng 10 phút. Nhóm nào còn yếu, hãy mở lại bài gốc tương ứng.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng ít nhất ba mẫu N3 thuộc các nhóm khác nhau, giải thích rõ ý nghĩa phong tục (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: { vocab: 1, kanji: 1, grammar: allGrammar, listen: [0, 1, 2, 4], read: [0, 1, 3, 4] },
  });
