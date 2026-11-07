import * as content from '../../../content/n4/n4-02.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 11001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-02',
    unitNumber: 2,
    moduleId,
    levelId,
    stamp: '2026-10-25T00:00:00.000Z',
    title: 'Thể て mở rộng',
    titleJp: 'て形の使い方',
    description:
      'N4-02: mô tả quy trình, chuẩn bị trước, thử làm và kể sự cố. Phân biệt hành động đang diễn ra với trạng thái kết quả. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Quy trình', 'Chuẩn bị trước', 'Trạng thái và sự cố'],
    textbook: 'Original LearnJP — te-form applications',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Các cách dùng thể て',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: thể て cơ bản N5 và thể thông thường N4-01. Mục tiêu: trình bày quy trình nấu ăn/làm việc, phân biệt tiến hành và kết quả, chuẩn bị trước và thử làm. 40 bài tập, quiz 20 câu, đạt từ 70%; không thay thế đánh giá JLPT.',
      '50 từ mới theo chủ đề. Nhóm động từ ghi trong nghĩa. Tự động từ mô tả sự thay đổi/trạng thái: 開く、閉まる、消える; đối chiếu 開ける、閉める、消す đã học ở N5. Chú giải ví dụ: 床（ゆか）sàn, 分（ぶん）phần.',
      '12 chữ mới so với dữ liệu N5 và N4-01. Từ có cách đọc và nghĩa trong từng ví dụ. Từ ghép như 使用、洗濯、工場、場合、運動 là mở rộng nhận biết, không coi là từ vựng mới bắt buộc hay hỏi khi chưa giải nghĩa.',
      '7 cách dùng: てから; ている tiến hành/kết quả; てしまう hoàn tất/tiếc nuối; ておく; てみる. Ôn bảng chia て ở mẫu đầu; chú ý 行く→行って và 読む→読んで.',
      'Đọc hai vai và nghe TTS. Chú giải: スープ súp; コピー機（コピーき）máy photocopy. TTS không phải thu âm người thật.',
      'Nghe trước rồi mở bản chép để kiểm tra. Chú giải: 置く（おく）đặt; 出かける（でかける）ra ngoài; Vるのを忘れる = quên làm việc gì (の danh từ hóa, mở rộng nhận biết). TTS dùng giọng có sẵn trên thiết bị.',
      'Chú giải: 柔らかい（やわらかい）mềm; 柔らかくなる trở nên mềm; もう一度（もういちど）một lần nữa; ノート vở; メール email; ～のです giải thích tình huống (nhận biết). Không cần tự tạo các cấu trúc mở rộng trong bài này.',
      'Tự luyện theo số ký tự tiếng Nhật. Bản nháp lưu trong trình duyệt; dùng bài mẫu và rubric để tự kiểm. Không có điểm viết tự động.',
      '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu nghe/đọc có liên kết với tư liệu tương ứng. Đọc giải thích sau khi trả lời.',
      '洗ってから = rửa rồi mới làm việc sau; 切っている = đang cắt; 開いている = đang mở (trạng thái); 全部やってしまう = làm xong hết; 忘れてしまう = lỡ quên; 買っておく = mua sẵn; 作ってみる = thử làm. Ôn câu sai rồi làm quiz 20 câu.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); chia て và chọn đúng nghĩa mẫu câu (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
