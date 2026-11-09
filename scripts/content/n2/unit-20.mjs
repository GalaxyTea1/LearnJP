import * as content from '../../../content/n2/n2-20.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 79001,
  levelId = 60001;
const allGrammar = content.grammarQuestions.map((_, i) => i);

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-20',
    unitNumber: 20,
    moduleId,
    levelId,
    stamp: '2026-11-26T00:00:00.000Z',
    title: 'Tổng ôn N2',
    titleJp: 'N2総復習',
    description:
      'N2-20: tổng ôn N2-01 đến N2-19 theo 8 nhóm ngữ pháp và bảng các cặp so sánh, không thêm mẫu mới. 133 từ ôn lại từ các bài trước, 19 Hán tự mới; bài đọc khoảng 1.000 ký tự và bài giảng nghe dài khoảng 3 phút. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tổng ôn ngữ pháp', 'Đọc và nghe dài', 'Luyện đề'],
    textbook: 'Original LearnJP — N2 cumulative review',
    sectionTitles: [
      'Mục tiêu và cách học',
      '133 từ ôn tập',
      '19 Hán tự mới',
      'Tổng ôn 8 nhóm ngữ pháp',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: hoàn thành N2-01 đến N2-19. Mục tiêu: phối hợp ngữ pháp N2 trong bài đọc khoảng 1.000 ký tự và bài giảng nghe dài khoảng 3 phút, nắm bảng các cặp so sánh, viết thư và bài nghị luận dùng nhiều nhóm mẫu. 47 bài luyện và bài kiểm tra tổng ôn 25 câu có câu ngữ pháp từ từng bài N2-01 đến N2-19, đạt từ 70%. Đây là bài tổng ôn trong khóa, không phải đề JLPT chính thức.',
      '133 từ ôn lại: 7 từ từ mỗi bài N2-01 đến N2-19, giữ nguyên cách đọc, nghĩa và câu ví dụ của bài gốc. Không phải từ mới; dùng để tự kiểm tra trí nhớ và đánh dấu từ đã thuộc. Gặp từ quên, hãy mở lại bài gốc.',
      '19 chữ mới: 粒 詞 偉 畳 机 膚 濯 猫 塔 沸 幾 帽 枯 舟 貝 皿 燥 挟 滴. Từ ghép trọng tâm: 品詞, 歌詞, 偉大, 六畳, 皮膚, 洗濯, 子猫, 五重塔, 沸騰, 幾分, 帽子, 枯渇, 貝殻, 小皿, 乾燥, 板挟み, 水滴, 点滴. Chú ý: 五重塔 đọc ごじゅうのとう, 幾分 đọc いくぶん, 板挟み đọc いたばさみ.',
      '8 nhóm ôn: thời điểm và kết cục; xu hướng và góc nhìn; căn cứ và phạm vi; văn trang trọng và mục tiêu; khả năng, rủi ro và quyết tâm; cảm xúc và đánh giá; nhượng bộ và lập luận; suy đoán, truyền đạt và quan hệ. Bảng cặp so sánh: た上で／てからでないと／次第; あげく／末に; がちだ／気味／傾向にある; に基づいて／をもとに／に沿って; に応じて／にこたえて; に限り／に限って／を除いて; かねない／恐れがある; ざるを得ない／ほかない; に過ぎない／にほかならない; にしても／にせよ／としても／とはいえ; からには／以上は; とされる／とみられる／ものと思われる; といえば／といったら.',
      'Hội thoại tự soạn trước và sau kỳ thi JLPT. Chú giải: いよいよ cuối cùng cũng; 読解（どっかい）đọc hiểu; 寝不足 thiếu ngủ; 真っ先に đầu tiên; ほっとする nhẹ nhõm; ごちそうする khao.',
      'Nghe trước, sau đó mới mở bản chép; bài 1 dài khoảng 3 phút, hãy ghi ý chính khi nghe. Chú giải: 講師（こうし）giảng viên; 一段と hơn hẳn; 怠ける lười; 焦る nóng vội; 受験票 phiếu dự thi; 不正行為 gian lận; 合図 hiệu lệnh; 勘 đoán.',
      'Hai bài đọc dài khoảng 1.000 ký tự: đọc lướt để nắm ý chính trước, sau đó đọc kỹ. Chú giải bài 1: 六畳一間 phòng sáu chiếu; 大家さん chủ nhà; 煮物 món hầm; 葬儀（そうぎ）tang lễ. Bài 2: 人生百年時代 thời đại đời người trăm năm; 定年 tuổi nghỉ hưu; 口をそろえる đồng thanh; 使い古す cũ mòn; かみしめる nghiền ngẫm.',
      'Bài 1: thư khoảng 300 ký tự (250–350). Bài 2: bài nghị luận khoảng 400 ký tự (だ・である). Có bài mẫu để so sánh sau khi viết. Kiểm tra: dùng ít nhất bốn mẫu N2 thuộc các nhóm khác nhau. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng ôn, 6 Hán tự, 19 ngữ pháp (mỗi bài N2-01 đến N2-19 một câu), 6 nghe, 6 đọc. Bài kiểm tra tổng ôn 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm cuối khóa N2: với mỗi nhóm ôn, đặt một câu về cuộc sống của bạn; tự giải thích được các cặp so sánh trong bảng; đọc hiểu một bài 1.000 ký tự trong khoảng 12 phút. Nhóm nào còn yếu, hãy mở lại bài gốc tương ứng. Bước tiếp theo: khóa N1.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng ít nhất bốn mẫu N2 thuộc các nhóm khác nhau (35%); bố cục mở–thân–kết, có lý do và ví dụ (30%); văn phong thống nhất, phù hợp người đọc (15%). Không có điểm tự động.',
    quiz: { vocab: 1, kanji: 1, grammar: allGrammar, listen: [0, 2], read: [0, 3] },
  });
