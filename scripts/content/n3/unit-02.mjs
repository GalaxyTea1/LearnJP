import * as content from '../../../content/n3/n3-02.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 31001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-02',
    unitNumber: 2,
    moduleId,
    levelId,
    stamp: '2026-10-31T00:00:00.000Z',
    title: 'Gia đình và nơi làm thêm',
    titleJp: '家族とアルバイト',
    description:
      'N3-02 (cầu nối 2): thể sai khiến (bắt làm, cho làm), xin phép bằng ～させてください, sai khiến bị động, ～てほしい và ～させていただく. Kể chuyện gia đình, hồi nhỏ và công việc làm thêm; 23 Hán tự nền tảng. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Gia đình', 'Làm thêm', 'Thể sai khiến'],
    textbook: 'Original LearnJP — N3 bridge 2',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '23 Hán tự nền tảng',
      'Thể sai khiến',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 và N3-01. Bài cầu nối thứ hai: thể sai khiến và sai khiến bị động, mẫu N4 chuẩn mà khóa N4 của dự án chưa dạy. Mục tiêu: nói ai bắt/cho ai làm gì, xin phép làm việc ở nơi làm thêm, kể việc bị bắt làm và cảm nghĩ, nói mong muốn người khác làm. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Gia đình và nuôi dạy con, ký ức tuổi thơ, thái độ khi làm việc không muốn, thú nuôi, nơi làm thêm, quê và nơi chốn, ăn mặc. Cặp gần nghĩa: 怒る (nổi giận) và 叱る (mắng để dạy); 指示 (hướng dẫn công việc) và 命令 (mệnh lệnh); 地元 (quê nhà, nơi mình sống) và 故郷 (quê hương, giàu cảm xúc); 子育て và 育児 (văn viết hơn). 嫌がる chỉ dùng để tả người khác.',
      '23 chữ: 家族妹姉犬鳥 東西南北 口耳川田国京地方 店堂飯洋服. Trọng tâm là âm đọc trong từ ghép: 家庭（かてい）・実家（じっか）, 東口・西口・南口・北口, 地元（じもと）・地方（ちほう）, 方言, 店長, 食堂（しょくどう）, 夕飯（ゆうはん）, 洋服・洋食, 田舎（いなか, cách đọc đặc biệt）.',
      '7 mục: cách chia 使役形; sai khiến bắt buộc; sai khiến cho phép; ～させてください／させてもらえませんか; sai khiến bị động ～させられる (rút gọn ～される); ～てほしい／てもらいたい; ～させていただく. So sánh trọng tâm: 弟にケーキを食べられた (bị động: bị ăn mất) / 食べさせた (bắt, cho ăn) / 食べさせられた (bị bắt ăn). Không dùng sai khiến với người trên mình.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: よろしいですか (lịch sự của いいですか); 迎えに行く（むかえにいく）đi đón; 入る（シフトに）vào ca; そろばん bàn tính; 逆（ぎゃく）ngược lại; 仲がいい（なかがいい）thân thiết.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: タイムカードを押す bấm thẻ chấm công; 少々お待ちください xin chờ một chút; 商品（しょうひん）hàng hóa; 報告（ほうこく）báo cáo; 隠す（かくす）giấu; 大学院（だいがくいん）cao học; 奨学金（しょうがくきん）học bổng; 将来（しょうらい）tương lai. Âm thanh là giọng đọc của thiết bị.',
      'Chú giải bài 1: 部活（ぶかつ）câu lạc bộ ở trường; 口げんか cãi nhau; うらやましい ghen tị; 周り（まわり）xung quanh; 苦にならない không thấy khổ. Bài 2: 募集（ぼしゅう）tuyển; 流れ quy trình; ～ごとに mỗi; 交通費（こうつうひ）tiền đi lại; 期間（きかん）thời gian; 問わない không hỏi, không yêu cầu; 保護者（ほごしゃ）phụ huynh; 応募（おうぼ）ứng tuyển; 直接（ちょくせつ）trực tiếp.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 kể chuyện: tình huống, cảm xúc lúc đó, điều thay đổi, suy nghĩ bây giờ. Bài 2 là email công việc: chào, lý do, đề xuất, lời cảm ơn/xin lỗi. Tự đánh giá theo tiêu chí bên dưới; bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: chia sai khiến của 書く・食べる・する・来る; nói một việc bố mẹ bắt làm và một việc bố mẹ cho làm; xin nghỉ ca bằng 休ませていただけませんか; kể việc bị bắt chờ bằng 待たされた; phân biệt 食べられた／食べさせた／食べさせられた. Bài tiếp theo (N3-03): kính ngữ tôn kính và khiêm nhường.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng sai khiến, sai khiến bị động và lời xin phép theo vai người nói (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 2, 4, 5, 6, 8, 9, 10, 11, 13, 14],
      listen: [0, 2, 4, 5],
      read: [0, 2, 3, 4],
    },
  });
