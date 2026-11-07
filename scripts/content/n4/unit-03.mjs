import * as content from '../../../content/n4/n4-03.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 12001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-03',
    unitNumber: 3,
    moduleId,
    levelId,
    stamp: '2026-10-25T00:00:00.000Z',
    title: 'Kinh nghiệm và liệt kê hoạt động',
    titleJp: '経験・活動を話す',
    description:
      'N4-03: kể chuyến đi, hỏi về kinh nghiệm và liệt kê hoạt động. Phân biệt việc vừa hoàn thành với thứ tự trước sau. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Du lịch', 'Trải nghiệm', 'Kể lại hoạt động'],
    textbook: 'Original LearnJP — experiences and activities',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Kinh nghiệm và thời gian',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: thể た ở N4-01, thứ tự てから ở N4-02. Học 4 mẫu để hỏi kinh nghiệm và kể chuyến đi. Hoàn thành 40 bài tập, quiz 20 câu với ngưỡng 70%. Đây là một bài trong khóa N4 đang mở dần, không phải chứng nhận JLPT.',
      '50 mục từ mới, nhóm động từ trong phần nghĩa. Từ đã học như 旅行、経験、写真、準備 được dùng ôn tập. Chú giải ví dụ: 去年（きょねん）năm ngoái; 今年（ことし）năm nay; 夕方（ゆうがた）chiều tối; 休日（きゅうじつ）ngày nghỉ; 工場（こうじょう）nhà máy; 感想（かんそう）cảm nghĩ; 着物（きもの）kimono; 着る（きる）mặc; 着く（つく）đến; 旅行中（りょこうちゅう）trong chuyến đi; 京都（きょうと）Kyoto. Chưa học thì xem là từ mở rộng nhận biết.',
      '12 Kanji mới so với danh sách N5 và hai bài N4 trước. Từ ghép luôn kèm cách đọc, nghĩa; 駅員、交通、発見、転ぶ、過去 là mở rộng nhận biết. Đừng nhầm 去年（きょねん）với cách đọc của 昨年（さくねん）cũng nghĩa là năm ngoái.',
      '4 mẫu trung tâm: Vたことがある／ない, VたりVたりする, Vたばかり, Vた後で／Nの後で. た trong たり hoặc た後で không tự quyết định quá khứ của cả câu. Ôn chia た: て→た, で→だ.',
      'Hai hội thoại tự soạn, giọng TTS của thiết bị. Chú giải: お帰りなさい = mừng bạn về; 出かける（でかける）ra ngoài; 去年（きょねん）năm ngoái; 着く（つく）đến; 京都（きょうと）Kyoto. Mệnh đề trước danh từ như 一緒に見たお寺 = ngôi chùa đã ngắm cùng nhau: nhận biết trong ngữ cảnh.',
      'Nghe trước khi mở bản chép. Chú giải: 二度目（にどめ）lần thứ hai; 料理教室（りょうりきょうしつ）lớp nấu ăn; スープ súp; Vるのは初めて = lần đầu làm V (nhận biết). Bài nghe dùng TTS, không phải bản thu người thật.',
      'Chú giải: それまで = cho đến trước thời điểm đó; ありませんでした = đã không có (kinh nghiệm trước chuyến đi); 今回（こんかい）lần này; 夕方（ゆうがた）chiều tối; 先週（せんしゅう）tuần trước; ～と言いました = đã nói rằng (trích lời đơn giản, nhận biết). Phân biệt giờ gặp bạn, giờ đến cảng và số lần trải nghiệm của từng người.',
      'Viết theo số ký tự tiếng Nhật. Có thể kể trải nghiệm tưởng tượng nếu chưa đi du lịch. Bản nháp lưu trên trình duyệt; bài mẫu và rubric để tự kiểm, không có điểm viết tự động.',
      '40 câu gồm 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. たり chỉ liệt kê ví dụ, không đảm bảo thứ tự; たばかり không quy định số phút cố định. Câu nghe/đọc cần dựa vào đúng tư liệu và đúng nhân vật.',
      '行ったことがある = từng đi; 一度も行ったことがない = chưa từng đi; 見たり買ったりした = đã làm các việc như xem, mua; 帰ったばかり = vừa về theo cảm nhận; 着いた後で = sau khi đến. Kể sự việc cụ thể dùng quá khứ đơn khi phù hợp. Quiz 20 câu có kèm tư liệu cho câu đọc/ôn nghe.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); chia た và phân biệt kinh nghiệm, liệt kê, thời gian (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
