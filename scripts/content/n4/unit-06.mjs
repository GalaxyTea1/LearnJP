import * as content from '../../../content/n4/n4-06.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 15001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-06',
    unitNumber: 6,
    moduleId,
    levelId,
    stamp: '2026-10-25T00:00:00.000Z',
    title: 'Nghĩa vụ và lời khuyên',
    titleJp: '義務・助言を伝える',
    description:
      'N4-06: phân biệt nghĩa vụ, điều không bắt buộc, lời khuyên và yêu cầu không làm. Thực hành nội quy và lời nhắn cho bạn. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Nghĩa vụ', 'Nội quy', 'Lời khuyên'],
    textbook: 'Original LearnJP — obligations and advice',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Nghĩa vụ và lời khuyên',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: nhóm động từ, thể ない ở N4-01 và thể た. Mục tiêu: hiểu nội quy và đưa lời khuyên cho bạn. 40 bài tập, quiz 20 câu, ngưỡng đạt 70%. N4 đang mở dần, không xác nhận đạt JLPT.',
      '50 từ về sức khỏe, nội quy và thủ tục. 汚す／壊す là làm bẩn/làm hỏng, khác 汚れる／壊れる đã học. 並ぶ là xếp hàng, khác 並べる là sắp xếp đồ. 伝わる là được truyền đạt, khác 伝える là truyền đạt. Ôn chia ない trước khi ghép mẫu.',
      '12 Kanji mới so với N5 và N4-01 đến N4-05. Ví dụ từ ghép có cách đọc/nghĩa; 病人、入院、退院、医学、医院、薬局、薬剤師、頭痛、先頭、笑顔、足りる、遠足、歩道、走行 là mở rộng nhận biết, không phải từ mới bắt buộc.',
      '5 mẫu: ～なければならない (phải); ～なくてもいい (không cần); ～た／ないほうがいい (nên/không nên); ～ないでください (xin đừng); ～べき (nhập môn). なくてもいい không cấm hành động. べき mạnh, cần cân nhắc ngữ cảnh; không bắt buộc dùng trong phần viết.',
      'Hai hội thoại tự soạn, nghe bằng TTS. Chú giải: 勉強会（べんきょうかい）buổi học nhóm; 紙（かみ）giấy; 欄（らん）ô/mục; 休憩室（きゅうけいしつ）phòng nghỉ; お大事に（おだいじに）chúc mau khỏe; ～たら nếu (nhận biết). Nội quy là tình huống giả định.',
      'Nghe trước khi mở bản chép. 電話番号（でんわばんごう）số điện thoại; ボタン nút bấm; そのまま giữ nguyên; 金曜日までに chậm nhất thứ Sáu. Phân biệt việc không cần làm với việc bị yêu cầu không làm. TTS không thay thế thu âm người thật.',
      'Chú giải: 学習室（がくしゅうしつ）phòng học; 飲食（いんしょく）ăn uống; 休憩室（きゅうけいしつ）phòng nghỉ; 声（こえ）giọng/tiếng; ほかの những người khác; ～と伝える nhắn rằng (nhận biết). Xác định thời hạn, thông tin bắt buộc và quy định trong từng đoạn.',
      'Tự luyện theo số ký tự tiếng Nhật; có thể dùng tình huống tưởng tượng. Bản nháp chỉ lưu trong trình duyệt. Dùng rubric và bài mẫu tự kiểm, không có điểm viết tự động. 疲れているんですね thể hiện đã hiểu tình trạng bạn kể (nhận biết). Bài luyện ngôn ngữ không yêu cầu chẩn đoán hay kê thuốc.',
      '40 câu gồm 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe và 5 đọc. 機械（きかい）máy móc trong câu ngữ pháp. Câu nghe/đọc cần tư liệu đúng; quiz ôn nghe có kèm bản chép, không phải bài thi nghe chuẩn hóa.',
      '書かなければならない = phải viết; 書かなくてもいい = không cần viết; 休んだほうがいい = nên nghỉ; 無理しないほうがいい = không nên cố quá sức; 触らないでください = xin đừng chạm; 約束を守るべき = nên giữ lời hứa theo nguyên tắc. Thể た trong lời khuyên không kể quá khứ.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); chia đúng thể phủ định, phân biệt nghĩa vụ và lời khuyên (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
