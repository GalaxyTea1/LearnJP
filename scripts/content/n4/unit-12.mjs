import * as content from '../../../content/n4/n4-12.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 21001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-12',
    unitNumber: 12,
    moduleId,
    levelId,
    stamp: '2026-10-26T00:00:00.000Z',
    title: 'Du lịch và dịch vụ',
    titleJp: '旅行とサービス',
    description:
      'N4-12: nhận phòng khách sạn, đặt dịch vụ và nhờ giúp lịch sự. Nhận biết kính ngữ cơ bản của nhân viên. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Khách sạn', 'Nhà hàng', 'Yêu cầu lịch sự'],
    textbook: 'Original LearnJP — travel and services',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Du lịch và dịch vụ',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: thể て, cách nhờ và cho/nhận N4-07. Mục tiêu: nhận phòng, hỏi giá/dịch vụ và đặt bàn; nhận biết kính ngữ cơ bản trong lời nhân viên. 40 bài tập, quiz 20 câu, đạt từ 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.',
      '50 mục từ về khách sạn, nhà hàng và di chuyển. 承る、かしこまりました、申す、伺う là cụm dịch vụ/khiêm nhường để nhận biết và dùng có ngữ cảnh; không phải tất cả đều kính ngữ tôn người làm. 朝食 cùng nghĩa 朝ごはん đã học nhưng là cách gọi khác. 含まれる là dạng bị động của 含む; học cặp để đọc giá gồm/không gồm dịch vụ.',
      '12 Kanji mới so với N5 và N4-01 đến N4-11. 本屋、座席、様子、支払い là từ mở rộng nhận biết. 一泊 đọc いっぱく; 二泊 đọc にはく. 田中様 dùng gọi khách trang trọng; không gắn 様 vào tên chính mình.',
      '5 mục: いらっしゃいます; ございます／でございます; お／ご＋danh từ; ていただけませんか; てくださいませんか. Hai mẫu nhờ có nhiều ngữ cảnh dùng chung. Mục ていただけませんか ôn từ N4-07 và mở rộng trong dịch vụ. Không dùng いらっしゃいます nâng hành động chính mình.',
      'Hội thoại tự soạn, TTS. Chú giải: 二名様（にめいさま）hai vị; 満席（まんせき）kín chỗ; 正面玄関（しょうめんげんかん）cửa chính; ご用意しています chuẩn bị sẵn; お預かりします giữ giúp; ご案内 hướng dẫn (cụm nhận biết). Các lịch và phí là giả định theo từng tình huống.',
      'Nghe trước khi mở bản chép. Giờ ăn sáng, tầng phục vụ, giờ trả phòng và thời hạn giữ đồ thuộc tình huống riêng, không lấy từ hội thoại hay bài đọc để trả lời. 通路側（つうろがわ）phía lối đi. TTS không thay thế thu âm người thật.',
      'Chú giải: 会場（かいじょう）địa điểm/khu tổ chức; ご不明な点 điều chưa rõ; お問い合わせください xin liên hệ hỏi; ご希望 mong muốn; お申し出ください xin báo; ～こともあります có khi...; ～までに chậm nhất... Giá, lịch và chính sách trong bài là giả định, không áp dụng cho khách sạn thật.',
      'Tự luyện theo số ký tự tiếng Nhật, dùng đặt phòng tưởng tượng. Bản nháp chỉ lưu trong trình duyệt, không chấm điểm tự động. Phân biệt vai khách với nhân viên. Có thể dùng cụm ご用意しています và お預かりします từ chú giải, chưa cần học toàn bộ hệ thống kính ngữ.',
      '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Khi trả lời giá/giờ phải dựa đúng tư liệu. Quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa. Không mặc định mọi dịch vụ miễn phí hoặc luôn đáp ứng yêu cầu.',
      '先生がいらっしゃいます: giáo viên có mặt (tôn kính). 空室がございます: có phòng trống (lịch sự). こちらが鍵でございます: đây là chìa khóa. ご予約／お名前: cụm cố định. 確認していただけませんか／確認してくださいませんか: nhờ kiểm tra lịch sự; không phải xin đừng kiểm tra.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); dùng kính ngữ đúng vai và nêu yêu cầu lịch sự (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
