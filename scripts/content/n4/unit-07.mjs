import * as content from '../../../content/n4/n4-07.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 16001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-07',
    unitNumber: 7,
    moduleId,
    levelId,
    stamp: '2026-10-25T00:00:00.000Z',
    title: 'Cho và nhận',
    titleJp: '贈り物と助け合い',
    description:
      'N4-07: kể việc tặng quà, nhận sự giúp đỡ, nhờ và cảm ơn phù hợp. Phân biệt điểm nhìn người cho và người nhận. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Quà tặng', 'Giúp đỡ', 'Nhờ và cảm ơn'],
    textbook: 'Original LearnJP — giving and receiving',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Cho và nhận',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: thể て, trợ từ は／が／に／を và thể khả năng. Mục tiêu: kể việc tặng quà, nhờ giúp và cảm ơn phù hợp quan hệ. 40 bài tập, quiz 20 câu, ngưỡng đạt 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.',
      '50 mục từ về quà tặng và giúp đỡ. 贈る và 送る cùng đọc おくる nhưng 贈る nhấn tặng quà, 送る nhấn gửi. 預かる = giữ hộ; 預ける = gửi nhờ giữ. 手伝う đã học ở N5 dưới dạng 手伝います nên chỉ ôn, không tính thêm. どういたしまして dùng đáp lời cảm ơn; với bạn bè cũng thường nói いいえ hoặc いえいえ.',
      '12 Kanji mới so với N5 và N4-01 đến N4-06. 借りる là mượn, 貸す là cho mượn. Từ ghép 借金、貸出、礼儀、包装、品物、商品 dùng nhận biết, đã có cách đọc và nghĩa. 親切 là tử tế; 切 đã học, không tính lại.',
      '7 mục: あげる、もらう、くれる và ba mẫu Vてあげる／もらう／くれる; Vていただく nhập môn. Luôn xác định người thực hiện và người hưởng lợi. Nhiều mẫu có thể kể cùng sự việc khi đổi chủ thể/trợ từ. Khi chủ thể giữ nguyên thì không thay các động từ tùy ý.',
      'Hai hội thoại tự soạn, nghe TTS. Chú giải: 去年（きょねん）năm ngoái; きっと chắc là; お互いに（おたがいに）lẫn nhau; ～なら nếu là... (nhận biết); ～ので vì... (nhận biết). Đối chiếu giờ hẹn: hội thoại với giáo viên là ba giờ chiều.',
      'Nghe trước khi mở bản chép. 電話（でんわ）điện thoại; お礼を言う nói lời cảm ơn. Phân biệt nguồn tặng găng tay với nguồn tặng thiệp. Bài nghe giáo viên hẹn bốn giờ chiều, là tình huống riêng với hội thoại. TTS không thay thế giọng thu âm người thật.',
      'Chú giải: メッセージ lời nhắn; ～てありました ở trạng thái đã được làm (chỉ nhận biết); 重い（おもい）nặng; ～のために cho/vì...; 試験を受ける（しけんをうける）dự thi. Theo dõi tên từng người trước khi chọn đáp án.',
      'Tự luyện theo số ký tự tiếng Nhật. Có thể tưởng tượng món quà và sự giúp đỡ. Bản nháp chỉ lưu trong trình duyệt, không có điểm viết tự động. Chú giải bài mẫu: おかげで nhờ vậy; ～てもらって nối mệnh đề nhận giúp đỡ. Với bạn bè dùng ～てくれてありがとう; với giáo viên dùng cách nhờ/cảm ơn lịch sự ở mục ngữ pháp.',
      '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu nghe/đọc dùng đúng tư liệu kèm theo. Quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa.',
      '私は友達に本をあげた: tôi tặng sách cho bạn. 私は友達に本をもらった／友達が私に本をくれた: tôi nhận sách từ bạn. 私は友達に撮ってもらった／友達が撮ってくれた: bạn chụp giúp tôi. 先生に見ていただいた: giáo viên xem giúp tôi. Đề nghị giúp dùng ～ましょうか; nhờ lịch sự dùng ～ていただけませんか.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); đúng điểm nhìn cho/nhận và trợ từ (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
