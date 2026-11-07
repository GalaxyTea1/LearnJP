import * as content from '../../../content/n3/n3-11.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 40001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-11',
    unitNumber: 11,
    moduleId,
    levelId,
    stamp: '2026-11-09T00:00:00.000Z',
    title: 'Xã hội thay đổi',
    titleJp: '変わる社会',
    description:
      'N3-11: thay đổi và tương quan: ～につれて, ～にしたがって, ～とともに, ～ば～ほど, ～ほど, ～ほど～はない, ～たびに. Dân số, kinh tế, giá cả và cách đọc số liệu; 24 Hán tự về số liệu và xã hội. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Xã hội và dân số', 'Kinh tế và giá cả', 'Đọc số liệu'],
    textbook: 'Original LearnJP — N3 change and correlation',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '24 Hán tự mới',
      'Thay đổi và tương quan',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 (N4-08 ば, N4-09 ようになる) và N3-01 đến N3-10 (đặc biệt N3-07 一方だ／ばかりだ). Mục tiêu: mô tả thay đổi kéo theo thay đổi, tương quan “càng… càng…”, mức độ và so sánh nhất, việc lặp lại mỗi lần; đọc số liệu và viết đoạn mô tả xu hướng từ biểu đồ. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Dân số và xã hội, kinh tế và giá cả, mô tả số liệu, hôn nhân và tuổi tác. Cách đọc số liệu: 割 = 10% (三割 = 30%), 倍 = lần, 約／およそ／前後／程度 = khoảng, 上回る／下回る = vượt / dưới, 占める = chiếm, 倍増／半減 = gấp đôi / một nửa, 横ばい = đi ngang. Cặp gần nghĩa: 価格 (văn viết) / 値段; 値上げ・値下げ (người bán quyết) / 値上がり・値下がり (giá tự thay đổi); 貯蓄 (văn viết) / 貯金; 所得 / 収入.',
      '24 chữ mới: 数割倍平均 産齢老婚 済景価値段税億 伸低適全各加総夫. Từ ghép trọng tâm: 数字, 割引, 平均, 平等（びょうどう, chú ý âm びょう）, 産業, 高齢者, 老後, 離婚, 経済, 景気, 価格, 価値, 値段, 税金, 億, 低下, 適切, 全体, 各国（かっこく, âm ngắt）, 追加, 総数, 夫.',
      '7 mục: ～につれて; ～にしたがって; ～とともに; ～ば～ほど; ～ほど (mức độ); ～ほど～はない; ～たびに. So sánh: につれて (thay đổi từ từ, tự nhiên, dùng được khi nói) / にしたがって (trang trọng hơn, thêm nghĩa “làm theo”) / とともに (văn viết nhất, thêm nghĩa “cùng ai”, “cùng lúc” cho việc một lần). Khi mô tả số liệu, dùng より thay cho に比べて (N3-12).',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: どんどん liên tục, mạnh mẽ; 晩婚化（ばんこんか）xu hướng kết hôn muộn; 発表（はっぴょう）thuyết trình; 担当（たんとう）phụ trách; にぎやか náo nhiệt; 寂しい（さびしい）buồn, vắng vẻ.',
      'Nghe trước, sau đó mới mở bản chép. Bài 1 có nhiều con số: ghi chú số liệu khi nghe. Chú giải: 過去最多（かこさいた）nhiều nhất từ trước tới nay; 未満（みまん）dưới; 受け入れ（うけいれ）tiếp nhận; 検討（けんとう）xem xét; 小麦粉（こむぎこ）bột mì; やっていけない không trụ được; ～ぶり sau (bao lâu); 駄菓子屋（だがしや）tiệm bánh kẹo rẻ; ショッピングモール trung tâm mua sắm.',
      'Chú giải bài 1: 移動（いどう）di chuyển; 本数（ほんすう）số chuyến; 訪れる（おとずれる）đến thăm; 温泉（おんせん）suối nước nóng; 空き家（あきや）nhà bỏ trống; 宿（やど）nhà trọ. Bài 2: 追いつく（おいつく）theo kịp; 控える（ひかえる）hạn chế; つながる dẫn đến; 年金（ねんきん）lương hưu; 光熱費（こうねつひ）tiền điện nước ga.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 mô tả số liệu cho sẵn: nêu xu hướng chung, con số nổi bật, nguyên nhân có thể, suy nghĩ. Bài 2 kể quê hương thay đổi. Kiểm tra số liệu: đọc đúng 割, 倍, 約. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: mô tả một xu hướng bằng につれて và một bằng とともに; nói một tương quan bằng ～ば～ほど; nói “không gì… bằng” bằng ～ほど～はない; kể một việc lặp lại bằng ～たびに; đọc to: 人口の三割, 約二倍, 二〇二〇年には半減. Bài tiếp theo (N3-12): công nghệ, so sánh lợi và hại (一方で, 反面, に比べて, かわりに).',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); đọc đúng số liệu, chọn đúng につれて／にしたがって／とともに (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 2, 4, 5, 6, 7, 9, 10, 12, 13, 14],
      listen: [0, 2, 3, 4],
      read: [0, 2, 3, 4],
    },
  });
