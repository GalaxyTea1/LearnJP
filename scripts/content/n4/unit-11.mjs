import * as content from '../../../content/n4/n4-11.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 20001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-11',
    unitNumber: 11,
    moduleId,
    levelId,
    stamp: '2026-10-25T00:00:00.000Z',
    title: 'Truyền đạt và dẫn lời gián tiếp',
    titleJp: '聞いた情報を伝える',
    description:
      'N4-11: truyền lại điều nghe hoặc đọc, dẫn lời và phân biệt thông tin với suy đoán. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Thông tin', 'Dẫn lời', 'Nguồn và suy đoán'],
    textbook: 'Original LearnJP — reported information',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Truyền đạt và dẫn lời gián tiếp',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: dạng thường hiện tại/quá khứ và tính từ i/na. Mục tiêu: truyền lại thông tin đã nghe/đọc, điều chỉnh từ thời gian khi dẫn lời và phân biệt suy đoán. 40 bài tập, quiz 20 câu, đạt từ 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.',
      '50 mục từ về tin tức và thông báo. 伝言する là nhắn lại, không phải mọi trường hợp 伝える. 延期／中止 là danh từ; dạng する đã học. 広まる tự lan rộng, 広める chủ động truyền rộng. Chú giải: 判断する（はんだんする）đánh giá; 感想（かんそう）cảm tưởng; ～か mệnh đề nghi vấn gián tiếp (nhận biết).',
      '12 Kanji mới so với N5 và N4-01 đến N4-10. 広告、音声、感情、容器、認める là từ ghép/mục mở rộng nhận biết, có cách đọc và nghĩa. 聞 trong 新聞 đã học ở N5, không tính lại.',
      '5 mục: そうだ truyền đạt; と言っていました; という tên gọi/nội dung; らしい; みたい suy đoán. 休みだそう／休みらしい／休みみたい: chú ý だ. Không gán phần trăm chắc chắn cố định. おいしいそう là nghe nói ngon; おいしそう là trông có vẻ ngon.',
      'Hội thoại tự soạn, dùng TTS. Chú giải: 評判（ひょうばん）đánh giá, tiếng tăm; 決めつける（きめつける）kết luận chắc khi chưa đủ căn cứ; ～によると theo nguồn; ～の話では theo lời... Các thông báo và quán đều giả định.',
      'Nghe trước khi mở bản chép. Chú giải: 勉強しやすい dễ học; ～つもり định làm. Giờ cũ một giờ và giờ mới hai giờ thuộc bài nghe riêng, khác mười/mười một giờ trong hội thoại và bài đọc. TTS không thay thế thu âm người thật.',
      'Chú giải: 開始（かいし）bắt đầu; 変わらず（かわらず）không đổi; 展示室（てんじしつ）phòng triển lãm; 青い窓（あおいまど）Cửa sổ xanh; ～ことにしました đã quyết định; ～ではなく thay vì (nhận biết). Xem nguồn và thời điểm cập nhật, không suy ra lời đồn đã được xác nhận.',
      'Tự luyện theo số ký tự tiếng Nhật, dùng tình huống giả định. Bản nháp chỉ lưu trong trình duyệt, không chấm điểm viết tự động. Nêu nguồn, giữ đúng giờ/ngày và chỉ rõ phần chưa chắc. Khi truyền lời hôm trước, điều chỉnh 明日 thành 今日 nếu đúng ngữ cảnh.',
      '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu nghe/đọc cần đúng tư liệu. Quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa. Tránh xem らしい／みたい là bằng chứng chắc chắn.',
      '休みだそうです: nghe nói nghỉ. 十時だと言っていました: đã nói là mười giờ. 「そら」という店: cửa hàng tên Sora. 休みらしい／留守みたい: hình như nghỉ/có vẻ vắng nhà. そう伝聞 giữ dạng thường, kể cả だ và quá khứ; らしい／みたい bỏ だ ở N/na hiện tại khẳng định.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); dẫn lời đúng, nêu nguồn và phân biệt suy đoán (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
