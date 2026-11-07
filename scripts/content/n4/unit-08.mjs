import * as content from '../../../content/n4/n4-08.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 17001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-08',
    unitNumber: 8,
    moduleId,
    levelId,
    stamp: '2026-10-25T00:00:00.000Z',
    title: 'Điều kiện',
    titleJp: '条件を使って話す',
    description:
      'N4-08: dùng と・たら・なら・ば để nêu điều kiện, hướng dẫn thao tác và lên phương án. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Điều kiện', 'Hướng dẫn', 'Phương án theo tình huống'],
    textbook: 'Original LearnJP — conditional expressions',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Điều kiện',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: thể từ điển, ない, た và phân biệt nhóm động từ. Mục tiêu: lên phương án theo tình huống, đọc hướng dẫn và phân biệt bốn mẫu điều kiện. 40 bài tập, quiz 20 câu, đạt từ 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.',
      '50 mục từ về thời tiết, hướng dẫn và thiết bị. 戻す = đưa vật về chỗ cũ, khác 戻る = tự quay lại. 暖まる = ấm lên, khác 温める = làm nóng. ボタン trước đây có trong chú giải, nay học chính thức. Chú giải: 空気（くうき）không khí; つまみ núm xoay; 引き出し（ひきだし）ngăn kéo; 機械（きかい）máy; 知らせる（しらせる）báo tin; 元の（もとの）ban đầu; ～そうです nghe nói (nhận biết).',
      '12 Kanji mới so với N5 và N4-01 đến N4-07. Đọc ví dụ kèm nghĩa; 雲海、暗記、広場、狭まる、通信 là mở rộng nhận biết. 明るい／暗い: sáng/tối; 広い／狭い: rộng/hẹp; 押す／引く: đẩy/kéo. Các chữ đã học trong từ ghép không tính lại.',
      '4 mẫu điều kiện và 1 mục so sánh. と cho kết quả thường lệ; たら cho giả định hoặc sau khi một việc hoàn tất; なら lấy thông tin làm tiền đề; ば nhấn điều kiện. Có vùng dùng chung. Không học mẹo tuyệt đối “ば không có lời nhờ” hoặc “たら chỉ là quá khứ”.',
      'Hai hội thoại tự soạn, dùng TTS. Chú giải: 見るだけなら nếu chỉ xem; 印刷（いんさつ）in; 使い終わる（つかいおわる）dùng xong; 戻す đưa trở về. Máy tra cứu là tình huống giả định; quy trình tùy thiết bị thực tế.',
      'Nghe trước khi mở bản chép. Chú giải: 席（せき）chỗ ngồi; 職員（しょくいん）nhân viên; パソコン máy tính cá nhân; 電話する gọi điện. Bài nghe hẹn chín giờ, báo lúc bảy giờ; đây là tình huống riêng với hội thoại và bài đọc. TTS không thay thế giọng người thật.',
      'Chú giải: お知らせ thông báo; 二つ目（ふたつめ）cái/thứ thứ hai; 拡大（かくだい）phóng to; 使い方（つかいかた）cách dùng; 町（まち）thị trấn; ～や～ liệt kê ví dụ. Phân biệt giờ báo địa điểm với giờ gặp; máy tra cứu bản đồ không yêu cầu tên, còn bài nghe mượn máy tính có yêu cầu.',
      'Tự luyện theo số ký tự tiếng Nhật; có thể dùng tình huống tưởng tượng. Bản nháp chỉ lưu trong trình duyệt, không có điểm viết tự động. Đối chiếu thứ tự sự việc và điều kiện trong bài mẫu. Không buộc dùng cả bốn mẫu trong mọi đoạn.',
      '40 câu gồm 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu nghe/đọc dùng tư liệu tương ứng. Quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa. Câu ngữ pháp tập trung dạng chia và nghĩa khi nhiều mẫu đều có thể dùng.',
      '押すと地図が出る: nhấn thì hiện bản đồ. 着いたら電話する: đến rồi gọi. 行くなら先に予約する: nếu định đi thì đặt trước. 時間があれば行く: có thời gian thì đi. 行けば、食べれば、すれば、来れば（くれば）; いい→よければ; ない→なければ.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); chia điều kiện đúng, dùng mẫu phù hợp ngữ cảnh (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
