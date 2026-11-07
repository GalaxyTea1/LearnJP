import * as content from '../../../content/n4/n4-05.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 14001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-05',
    unitNumber: 5,
    moduleId,
    levelId,
    stamp: '2026-10-25T00:00:00.000Z',
    title: 'Kế hoạch và ý định',
    titleJp: '予定・意志を話す',
    description:
      'N4-05: trình bày kế hoạch cuối tuần, lựa chọn phương án và giải thích mục đích. Phân biệt ý định cá nhân với lịch dự kiến. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Kế hoạch cuối tuần', 'Ý định', 'Mục đích và lựa chọn'],
    textbook: 'Original LearnJP — plans and intentions',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Kế hoạch và mục đích',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: nhóm động từ và thể từ điển/ない ở N4-01; kể hoạt động ở N4-03. Mục tiêu: trình bày kế hoạch cuối tuần có ngày giờ, lựa chọn và mục đích. 40 bài tập, quiz 20 câu, ngưỡng đạt 70%. Khóa N4 đang mở dần, không xác nhận đạt JLPT.',
      '50 mục từ theo chủ đề. 予定、計画、準備、予約、決める đã học nên dùng ôn tập, không thêm lại làm từ mới. 持っていく／持ってくる là cụm định hướng mang đi/mang đến; chia ở động từ cuối. Chú giải: 誘い（さそい）lời mời; 今日中に（きょうじゅうに）trong hôm nay; 入場（にゅうじょう）vào cửa; 計算する（けいさんする）tính toán. 日時 đọc にちじ, 日程 đọc にってい.',
      '12 Kanji mới so với danh sách N5 và N4-01 đến N4-04. Ví dụ có cách đọc/nghĩa; 定休日、決定、送料、放送、相手、会談、会費、日本的 là mở rộng nhận biết. Ôn 金、待 đã học, không tính lại là chữ mới.',
      '5 mẫu: Vる／Vないつもり; Vる／Nの予定; thể ý chí＋と思う; Vる／Nのために; Nにする. Ý định và lịch dự kiến có thể cùng phù hợp trong một tình huống; không xem chúng là đối lập tuyệt đối. Thể ý chí của ba nhóm được giải thích trong mục thứ ba.',
      'Hai hội thoại tự soạn, nghe bằng TTS. Chú giải: ～について về...; 今日中に trong hôm nay; もう一度 một lần nữa. Mẫu ～てもいい dùng để xin phép; ～ませんか dùng để đề nghị. Dùng câu trả lời của từng nhân vật để xác định lịch cuối cùng.',
      'Nghe trước khi mở bản chép. Chú giải: ～ことになりました = đã được quyết định là... (chỉ nhận biết); 今日中に trong hôm nay. Phân biệt giờ tập trung với giờ khởi hành, ngày cũ với ngày mới. TTS không thay thế thu âm hội thoại người thật.',
      'Chú giải: 入場無料（にゅうじょうむりょう）vào cửa miễn phí; それぞれ mỗi người; 金曜日までに chậm nhất thứ Sáu; ～たいと言っています đang nói rằng muốn... (nhận biết); ～ことも考えています cũng đang cân nhắc việc...; 計算する tính toán; 京都（きょうと）Kyoto. Phân biệt ngân sách với chi phí đi lại, ý định với việc đã đặt xong.',
      'Tự luyện theo số ký tự tiếng Nhật; có thể dùng kế hoạch tưởng tượng. Bản nháp chỉ lưu trong trình duyệt. Dùng rubric và bài mẫu tự kiểm, không có điểm viết tự động. 毎月（まいつき）= mỗi tháng trong bài mẫu.',
      '40 câu gồm 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe và 5 đọc. Câu nghe/đọc cần tư liệu đúng. Câu quiz ôn nghe có kèm bản chép; không phải bài thi nghe chuẩn hóa.',
      '行くつもり = định đi; 行かないつもり = định không đi; 九時の予定 = dự kiến chín giờ; 行こうと思う = có ý định đi; 行くために = để đi; 弁当にする = chọn cơm hộp. 予定 vẫn có thể thay đổi; つもりでした không chứng minh hành động đã xảy ra.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); chia thể ý chí, nêu kế hoạch và mục đích (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
