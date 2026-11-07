import * as content from '../../../content/n4/n4-04.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 13001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-04',
    unitNumber: 4,
    moduleId,
    levelId,
    stamp: '2026-10-25T00:00:00.000Z',
    title: 'Khả năng và kỹ năng',
    titleJp: 'できること・得意なこと',
    description:
      'N4-04: nói về khả năng, sở trường và tiến bộ của bản thân. Học thể khả năng, phân biệt làm được với làm giỏi. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Kỹ năng', 'Thể khả năng', 'Tiến bộ'],
    textbook: 'Original LearnJP — ability and skills',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Khả năng và sự tiến bộ',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: nhóm động từ, thể từ điển và các dạng thông thường ở N4-01; cách kể kinh nghiệm ở N4-03. Mục tiêu: nói được mình làm được gì, sở trường và sự tiến bộ. 40 bài tập, quiz 20 câu, ngưỡng đạt 70%. Khóa N4 đang mở từng bài, không phải chứng nhận JLPT.',
      '50 mục từ mới. 上手・下手・得意・苦手・十分 là tính từ na. 蹴る thuộc nhóm 1; 描く đọc かく trong bài, cũng có cách đọc えがく ở ngữ cảnh khác. Không tính 読める、泳げる... là từ mới riêng vì đây là dạng chia. Chú giải: ボール bóng; 足（あし）chân; 動物（どうぶつ）động vật; 線（せん）nét, đường; 間違い（まちがい）lỗi; 伸ばす（のばす）phát triển; 今年（ことし）năm nay; メートル mét; 体（からだ）cơ thể; 音（おと）âm thanh. 聞こえる／見える là nghe/nhìn thấy tự nhiên, khác 聞ける／見られる.',
      '12 Kanji mới so với danh sách N5 và N4-01 đến N4-03. Phân biệt 早い = sớm và 速い = nhanh, đều đọc はやい. Mỗi ví dụ có cách đọc và nghĩa. 強風、弱点、英国、漢方、体育、協力 là từ mở rộng nhận biết, không bắt buộc dùng trong bài viết.',
      '4 mục: thể khả năng của ba nhóm; Vることができる／Nができる; khả năng + ようになる; Vるのが上手／下手・得意／苦手. Dùng dạng chuẩn 食べられる、来られる trong bài luyện. Phân biệt khả năng với mức độ kỹ năng và với điều kiện nhìn/nghe thấy.',
      'Hai hội thoại tự soạn, dùng TTS của thiết bị. Chú giải: 動き（うごき）động tác; メートル mét; 会（かい）buổi gặp mặt; 午後なら nếu là buổi chiều (なら chỉ nhận biết ở bài này). Không cần tự dùng câu điều kiện trong bài viết.',
      'Nghe trước khi mở bản chép. Chú giải: 午前中（ごぜんちゅう）trong buổi sáng; 顔（かお）khuôn mặt; 毎週（まいしゅう）mỗi tuần; 線（せん）nét; 描き方（かきかた）cách vẽ; 何度も nhiều lần; 間違い（まちがい）lỗi. Nghe rõ sự khác nhau giữa chưa biết làm và làm được nhưng chưa giỏi/nhanh.',
      'Chú giải: 三か月前（さんかげつまえ）ba tháng trước; メール email; 最後まで（さいごまで）đến cuối; 午前中 buổi sáng; 集まる（あつまる）tập trung; ～ので vì (nhận biết); 聞いてもらう nhờ người khác nghe (mẫu cho/nhận học ở bài sau); 演奏する（えんそうする）chơi nhạc. Đọc đúng kỹ năng của từng người và thời điểm trước/hiện tại.',
      'Tự luyện theo số ký tự tiếng Nhật. Có thể dùng tình huống giả định. Bài mẫu/rubric để tự kiểm; không có chấm điểm viết tự động. Chú giải bài mẫu: 動き động tác; メートル mét; 演奏する chơi nhạc.',
      '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Không xem mọi を đi với thể khả năng là sai. Câu hỏi chọn dạng chuẩn ghi rõ yêu cầu, tránh đánh đồng khẩu ngữ với lỗi ngữ pháp tuyệt đối.',
      '書く→書ける、食べる→食べられる、する→できる、来る→来られる. 吹くことができる = có thể thổi; 吹けるようになった = đã thổi được sau thay đổi; 吹くのが上手 = thổi giỏi. 分かる không cần tạo thêm thể khả năng. Ôn câu sai trước quiz 20 câu.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); chia thể khả năng và diễn tả kỹ năng, tiến bộ (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
