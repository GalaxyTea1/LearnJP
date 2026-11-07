import * as content from '../../../content/n4/n4-01.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 10001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-01',
    unitNumber: 1,
    moduleId,
    levelId,
    stamp: '2026-10-25T00:00:00.000Z',
    levelRow: {
      title: 'N4 — Giao tiếp đời sống',
      titleJp: '日本語能力試験 N4',
      color: '#38BDF8',
      badge: '🌊',
      description: 'Đang mở N4-01. Các bài N4 tiếp theo chưa xuất bản. Không phải khóa N4 hoàn chỉnh.',
      totalVocab: 50,
      totalKanji: 12,
      totalGrammar: 7,
      sortOrder: 2,
    },
    title: 'Ôn N5 và thể thông thường',
    titleJp: 'N5復習・普通形',
    description:
      'N4-01: chia động từ, viết nhật ký và nêu ý kiến. Ôn 読・書・聞・食・飲・待・持; học 12 Kanji mới. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Thể thông thường', 'Nhật ký', 'Ý kiến và lý do'],
    textbook: 'Original LearnJP — plain form review',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Thể thông thường',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: kiến thức N5, không yêu cầu chứng chỉ. Học các dạng khẳng định/phủ định hiện tại/quá khứ, nêu lý do và ý kiến. Hoàn thành 40 bài tập và quiz 20 câu; ngưỡng quiz 70%. Đây là bài mở đầu, không xác nhận đạt N4.',
      'Nghĩa Anh/Việt và ví dụ được hiển thị cùng nhau. 思う thuộc nhóm 1; 考える thuộc nhóm 2; các động từ còn lại ghi nhóm trong nghĩa. Các tính từ đuôi い là i; 心配・簡単・複雑・特別 là na. Từ N5 dùng để ôn không tính vào 50 từ mới.',
      'Ôn 読・書・聞・食・飲・待・持 ở N5. Từ ghép ghi rõ cách đọc trong phần ví dụ. Các từ như 思考・参考・作品・注意・理解・由来 là mở rộng nhận biết, không bị hỏi nếu chưa cung cấp nghĩa.',
      'Học 7 mẫu, so sánh thể lịch sự và thông thường. Câu hỏi thân mật thường bỏ か/だ và lên giọng; không mặc định dùng với người mới quen.',
      'Nghe TTS và đọc vai A/B. TTS không thay thế bản thu hội thoại tự nhiên. Bài 2 minh họa chuyển từ lịch sự sang thân mật khi hai người đồng ý.',
      'Nghe trước khi mở bản chép. Thời lượng phụ thuộc giọng thiết bị, không gán thời lượng bản thu. Mở rộng nhận biết: 会おう = hẹn gặp nhé, ～こと = việc..., ～てから = sau khi...',
      'Đọc nội dung rồi trả lời câu hỏi. Chú giải: 調べる（しらべる）tra cứu; 携帯電話（けいたいでんわ）điện thoại di động; 明るい（あかるい）sáng; ベンチ ghế dài; ～こと việc..., ～になる trở thành; が nối hai vế với nghĩa nhưng.',
      'Bản nháp lưu trên trình duyệt. Tự kiểm theo rubric; không có chấm điểm viết tự động. Độ dài tính theo ký tự tiếng Nhật, không phải số câu.',
      '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu nghe/đọc đặt cạnh tư liệu tương ứng. Chọn đáp án và đọc giải thích.',
      'V: 食べる/食べない/食べた/食べなかった. i: 高い/高くない/高かった/高くなかった. N/na: 静かだ/静かではない/静かだった/静かではなかった. N/na + だから, V/i + から. Trước と思います dùng thể thông thường. Ôn lại câu sai trước khi nộp quiz.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); dạng động từ/tính từ và と思う đúng (35%); đủ ý theo đề (25%); mạch lạc và từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
