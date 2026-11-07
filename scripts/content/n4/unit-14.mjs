import * as content from '../../../content/n4/n4-14.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 23001,
  levelId = 10001;
const allGrammar = content.grammarQuestions.map((_, i) => i);

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-14',
    vocabPractice: 9,
    unitNumber: 14,
    moduleId,
    levelId,
    stamp: '2026-10-27T00:00:00.000Z',
    title: 'Tổng ôn N4',
    titleJp: 'N4総復習',
    description:
      'N4-14: ôn 13 bài trước, lập kế hoạch du lịch ba ngày và tự kiểm tra tổng hợp. 50 từ ôn tập; bài kiểm tra trong khóa không thay bộ đề thi thử. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tổng ôn', 'Du lịch ba ngày', 'Tự đánh giá'],
    textbook: 'Original LearnJP — N4 cumulative review',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ ôn tập',
      '12 Kanji mới',
      'Tổng ôn N4',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: hoàn thành N4-01 đến N4-13. Mục tiêu: phối hợp mẫu câu đã học để lên lịch du lịch ba ngày, xử lý thay đổi và kể lại trải nghiệm. 40 bài tập và quiz tổng ôn 20 câu, đạt từ 70%. Đây là bài tổng ôn trong khóa; bộ 3 đề thi thử riêng và rà soát toàn khóa còn chờ hoàn thành. Không phải đề JLPT chính thức.',
      '50 từ ôn tập được chọn từ 13 bài trước, không phải 50 từ mới. Mỗi từ giữ nguyên cách đọc, nghĩa và ví dụ ở bài gốc. Học theo ngữ cảnh và tự đặt câu cho chuyến đi. Từ xuất hiện lại có thể tạo thẻ ôn trong riêng bài này; số mục hiển thị không đồng nghĩa số từ mới độc lập.',
      '12 Kanji bổ sung theo chủ đề đi lại: 港、湖、島、船、鉄、路、線、急、特、指、階、荷. Đọc qua từ ghép; 三階 thường đọc さんがい, 特急 đọc とっきゅう. 空港、湖、島、船、鉄道、路線、指定席、荷物 là từ nhận biết bổ sung tại mục Kanji, không nằm trong 50 từ ôn. 小島、湖水、船旅 là từ mở rộng.',
      '9 nhóm ôn phủ 13 bài trước: thể thường/kinh nghiệm; thể て; khả năng/thay đổi; kế hoạch/nghĩa vụ; cho nhận; điều kiện; bị động; truyền đạt/lịch sự; thời gian/のに. Nhóm gộp không có nghĩa các mẫu thay thế được cho nhau. Đọc điểm nhìn người giúp/nhận, quan hệ thời gian và sự khác nhau giữa phỏng đoán với truyền đạt.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 博物館（はくぶつかん）bảo tàng; 預ける（あずける）gửi đồ; 預かる（あずかる）giữ đồ hộ; 掲示板（けいじばん）bảng thông báo; 発表（はっぴょう）thông báo/công bố; お気をつけて chúc đi cẩn thận. Hai hội thoại không dùng để suy ra phí của bài đọc.',
      'Nghe trước khi xem bản chép. Mỗi đoạn có lịch riêng. Chú giải: 一日中（いちにちじゅう）cả ngày; 入口（いりぐち）cửa vào; 指定席（していせき）ghế đặt trước; 受け取る（うけとる）nhận; 弱くなる（よわくなる）yếu/nhẹ đi. Giờ mở cửa khác giờ hẹn. Dùng TTS thiết bị, không phải bản thu âm người thật.',
      'Chú giải: 入場料（にゅうじょうりょう）vé vào cửa; 往復（おうふく）khứ hồi; 食費（しょくひ）tiền ăn; 予算（よさん）ngân sách; 残り（のこり）phần còn lại; 窓口（まどぐち）quầy; 時点（じてん）thời điểm; 以外（いがい）ngoài/trừ. Bài 1 có giá hoàn toàn giả định cho một người, tính cả vé bảo tàng. Bài 2 chưa xác nhận tàu chiều, không tự suy ra tàu chạy vì bảo tàng mở.',
      'Tự luyện kế hoạch 180–240 ký tự và email sau chuyến đi 160–220 ký tự tiếng Nhật. Có mẫu để so sánh sau khi viết. Chú giải: 予算を超える（よさんをこえる）vượt ngân sách; 値段（ねだん）giá; 初めて（はじめて）lần đầu. Bản nháp lưu ở trình duyệt; không có chấm điểm tự động. Dùng lịch và thông tin tưởng tượng.',
      '40 câu: 9 từ vựng, 8 Kanji, 13 ngữ pháp, 5 nghe, 5 đọc. Quiz tổng ôn 20 câu có câu ngữ pháp từ từng bài N4-01 đến N4-13. Phần ôn nghe trong quiz hiển thị bản chép, không đo nghe độc lập. Cần chọn theo nguồn đang hỏi; không ghép giờ và giá từ tình huống khác.',
      'Sau bài này: tự kiểm kể được kế hoạch ba ngày, nhờ giúp lịch sự, chọn phương án nếu thời tiết thay đổi và giải thích điều đã tiến bộ. Xem giải thích câu sai rồi quay lại bài gốc tương ứng. 14 bài đã có nội dung không đồng nghĩa đã hoàn tất bộ đề thi thử và xác minh mức sẵn sàng thi JLPT.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); dùng mẫu đã học đúng ngữ cảnh (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 1, kanji: 1, grammar: allGrammar, listen: [0, 3], read: [0, 1, 2] },
  });
