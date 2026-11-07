import * as content from '../../../content/n3/n3-15.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 44001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-15',
    unitNumber: 15,
    moduleId,
    levelId,
    stamp: '2026-11-13T00:00:00.000Z',
    title: 'Tranh luận và nhượng bộ',
    titleJp: '意見を戦わせる',
    description:
      'N3-15: nhượng bộ, trách móc và phản bác: ～ものの, ～ながら（も）, ～くせに, ～にもかかわらず, ～からといって, ～ことから, ～だけでなく／ばかりでなく. Quyền và bình đẳng, chế độ, cạnh tranh, lao động và xã hội; 24 Hán tự về tranh luận. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tranh luận', 'Nhượng bộ và phản bác', 'Vấn đề xã hội'],
    textbook: 'Original LearnJP — N3 debate and concession',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '24 Hán tự mới',
      'Nhượng bộ và phản bác',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 (～のに, ～ながら đồng thời) và N3-01 đến N3-14. Mục tiêu: nhượng bộ trong văn viết, trách móc người khác, phản bác một suy luận vội vàng, nêu căn cứ, thêm luận điểm; viết bài ý kiến khoảng 300 ký tự. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Quyền và bình đẳng, chế độ và giới hạn, tranh luận, cạnh tranh và thắng thua, lao động và xã hội. Cặp gần nghĩa: 文句 (phàn nàn, khẩu ngữ) / 苦情 (khiếu nại chính thức); 抗議 (phản đối công khai) / 反発 (phản ứng chống lại); 主観 / 客観的; 楽観的 / 悲観的; 少数派 / 多数派; 言い訳 (bào chữa) / 言い分 (lý lẽ của mình).',
      '24 chữ mới: 権等批 支援 制限許可 観 抗争戦 勝負競 討賃絶 投票 迷惑構. Từ ghép trọng tâm: 人権（じんけん）, 平等（びょうどう）, 批判, 支援（しえん）, 制度, 制限（せいげん）, 許可（きょか）, 観客, 抵抗, 競争（きょうそう）, 戦争, 勝負（しょうぶ）, 検討, 賃金（ちんぎん）, 絶対, 投票（とうひょう）, 迷惑（めいわく）, 構造. Chú ý 迷子 đọc まいご, 客観的 đọc きゃっかんてき.',
      '7 mục: ～ものの; ～ながら（も） (nhượng bộ); ～くせに; ～にもかかわらず; ～からといって; ～ことから; ～だけでなく／ばかりでなく. So sánh: ものの (trung tính, văn viết) / のに (cảm xúc, hội thoại) / くせに (trách móc người khác); ながら nhượng bộ khác ながら đồng thời ở N4.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 在宅勤務（ざいたくきんむ）làm việc tại nhà; 通勤（つうきん）đi làm; 両立（りょうりつ）cân bằng hai việc; 腹が立つ（はらがたつ）bực mình; 片付ける（かたづける）dọn dẹp; すっきり nhẹ người.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 司会（しかい）dẫn chương trình; 生活費（せいかつひ）chi phí sinh hoạt; 部員（ぶいん）thành viên câu lạc bộ; 監督（かんとく）huấn luyện viên; 拍手（はくしゅ）vỗ tay; 告げ口（つげぐち）mách lẻo.',
      'Chú giải bài 1: めぐって xoay quanh; 一員（いちいん）một thành viên; 服装（ふくそう）trang phục; 保護者（ほごしゃ）phụ huynh; 性別（せいべつ）giới tính. Bài 2: 保育園（ほいくえん）nhà trẻ; 保育士（ほいくし）giáo viên mầm non; 人材（じんざい）nhân lực; 損失（そんしつ）tổn thất; 待遇（たいぐう）đãi ngộ.',
      'Viết khoảng 300 ký tự (250–350). Có bài mẫu để so sánh sau khi viết. Bố cục bài ý kiến: vấn đề → ý kiến trái chiều (ものの, にもかかわらず) → phản bác (からといって) → luận điểm thêm (だけでなく) → kết luận. Kiểm tra: không dùng くせに trong văn viết trang trọng; からといって đi với vế phủ định. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói một việc chưa thành bằng ものの; nói hai mặt trái ngược bằng ながらも; than phiền về ai đó bằng くせに; nói kết quả bất ngờ bằng にもかかわらず; phản bác bằng からといって; nêu căn cứ bằng ことから; thêm ý bằng だけでなく. Bài tiếp theo (N3-16): tổng ôn N3.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); lập luận rõ ràng có phản bác, chọn đúng ものの／にもかかわらず／からといって (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13],
      listen: [0, 2, 3, 4],
      read: [0, 2, 3, 4],
    },
  });
