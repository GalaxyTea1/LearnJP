import * as content from '../../../content/n4/n4-13.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 22001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-13',
    unitNumber: 13,
    moduleId,
    levelId,
    stamp: '2026-10-26T00:00:00.000Z',
    title: 'Công việc và trường học',
    titleJp: '仕事と学校',
    description:
      'N4-13: kể lịch làm việc, đọc thông báo và viết email cá nhân khoảng 180 ký tự. Phân biệt thời điểm, khoảng thời gian, làm đồng thời và hai nghĩa のに. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Công việc', 'Trường học', 'Email và thời gian'],
    textbook: 'Original LearnJP — work and school',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Công việc và trường học',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: thể thường, thể て và cách nối câu ở N4-01 đến N4-12. Mục tiêu: kể lịch công việc/học tập, phân biệt việc suốt khoảng thời gian với một sự kiện trong khoảng đó; viết email cá nhân khoảng 180 ký tự. 40 bài tập, quiz 20 câu, đạt từ 70%. Bộ 3 đề thi thử và rà soát toàn khóa chưa hoàn tất.',
      '50 mục từ mới so với N5 và N4-01 đến N4-12. Ôn kèm các từ đã biết 資料、提出する、締め切り、保存する、同僚. 議事録、奨学金、学籍番号、引き継ぐ là từ mở rộng theo chủ đề, không khẳng định thuộc danh sách JLPT chính thức. レポート ở đây là bài báo cáo của sinh viên; 報告書 là văn bản báo cáo công việc.',
      '12 Kanji mới: 勤、職、業、課、題、授、試、験、卒、配、欠、遅. Học cách đọc qua từ ghép: 授業（じゅぎょう）、試験（しけん）、欠席（けっせき）、遅刻（ちこく）. Động từ 勤める、配る、遅れる là từ mở rộng nhận biết. Từ ghép dùng chữ đã biết vẫn được ôn nhưng không tính thêm Kanji mới.',
      '7 mục: Vる／Vたとき; Nの／Aい／Aなとき; 間; 間に (đối chiếu mở rộng của 間); Vます bỏ ます＋ながら; のに chỉ tương phản; Vるのに chỉ mục đích/công dụng. Không chọn đáp án dựa riêng dấu hiệu quá khứ ở cuối câu; xét thứ tự sự việc. ながら trong bài yêu cầu cùng chủ thể.',
      'Hội thoại tự soạn, nghe bằng TTS. Chú giải: 担当（たんとう）phần việc phụ trách; 一度（いちど）một lần; 予定表（よていひょう）bảng lịch; 前回（ぜんかい）lần trước; 書き終わる（かきおわる）viết xong. Lịch học, công việc và tên người đều giả định.',
      'Nghe trước khi mở bản chép. Mỗi đoạn có lịch và yêu cầu riêng; không lấy thông tin từ hội thoại hoặc bài đọc để trả lời. Chú giải: 締め切り（しめきり）hạn cuối; 間に合う（まにあう）kịp giờ; 連絡先（れんらくさき）thông tin liên lạc; 留守（るす）vắng mặt; 遅刻しそう（ちこくしそう）có vẻ sắp trễ; 両方（りょうほう）cả hai. TTS không thay thế thu âm người thật.',
      'Chú giải: 延ばす（のばす）lùi/kéo dài; 持ち帰る（もちかえる）mang về; 変更（へんこう）thay đổi; 確認（かくにん）xác nhận; 変更後 sau khi thay đổi; 送信（そうしん）gửi; 正午（しょうご）trưa đúng 12 giờ; 故障（こしょう）hỏng; 書き終える（かきおえる）viết xong. Đọc lý do, hạn mới và hành động cần làm, không chỉ dò con số.',
      'Tự luyện viết 160–200 ký tự tiếng Nhật, mục tiêu khoảng 180 ký tự. Viết email cá nhân cho bạn, có lời chào, tình huống, đề nghị cụ thể và kết. Chú giải mẫu viết: 問題を解く（もんだいをとく）giải bài; 都合（つごう）sự thuận tiện về lịch; 急ぎ（いそぎ）khẩn; 知らせる（しらせる）báo tin. Dùng ít nhất ba mẫu trong bài; không nhồi cả hai nghĩa のに nếu không tự nhiên. Bản nháp chỉ lưu trong trình duyệt, không được giáo viên hay AI chấm tự động.',
      '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe và 5 đọc. Mỗi câu có một đáp án theo ngữ cảnh. Quiz ôn nghe có bản chép nên không phải đề thi nghe chuẩn hóa. Chú ý toàn bộ khoảng thời gian (間) khác một sự kiện trong khoảng đó (間に).',
      '会社に行くとき = lúc đi đến công ty; 着いたとき = lúc đã tới. 学生のとき、忙しいとき、暇なとき. 留守の間ずっと = suốt thời gian vắng; 休み時間の間に一度 = một lần trong giờ nghỉ. 聞きながらメモする: cùng người nghe và ghi. 勉強したのに = dù đã học mà...; 勉強するのに使う = dùng để học.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); dùng đúng thời điểm và nối câu (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 2, 4, 5, 6, 9, 10], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
