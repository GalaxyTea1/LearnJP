import * as content from '../../../content/n1/n1-24.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 103001,
  levelId = 80001;
const allGrammar = content.grammarQuestions.map((_, i) => i);

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-24',
    unitNumber: 24,
    moduleId,
    levelId,
    stamp: '2026-12-19T00:00:00.000Z',
    title: 'Tổng ôn N1',
    titleJp: 'N1総復習',
    description:
      'N1-24: tổng ôn N1-01 đến N1-23 theo 8 nhóm ngữ pháp và bảng các cặp so sánh, không thêm mẫu mới. 150 từ ôn lại từ các bài trước, 45 Hán tự mới; bài đọc dài, bài đọc tích hợp hai ý kiến và bài giảng nghe dài khoảng 3 phút. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tổng ôn ngữ pháp', 'Đọc dài và đọc tích hợp', 'Luyện đề'],
    textbook: 'Original LearnJP — N1 cumulative review',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ ôn tập',
      '45 Hán tự mới',
      'Tổng ôn 8 nhóm ngữ pháp',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: hoàn thành N1-01 đến N1-23. Mục tiêu: phối hợp ngữ pháp N1 trong bài đọc dài khoảng 900 ký tự, bài đọc tích hợp so sánh hai ý kiến và bài giảng nghe dài khoảng 3 phút; nắm bảng các cặp so sánh; viết thư kính ngữ và bài nghị luận dùng nhiều nhóm mẫu. 55 bài luyện và bài kiểm tra tổng ôn 25 câu có câu ngữ pháp từ từng bài N1-01 đến N1-23, đạt từ 70%. Đây là bài tổng ôn trong khóa, không phải đề JLPT chính thức.',
      '150 từ ôn lại: 7 từ từ mỗi bài N1-01 đến N1-12 và 6 từ từ mỗi bài N1-13 đến N1-23, giữ nguyên cách đọc, nghĩa và câu ví dụ của bài gốc. Không phải từ mới; dùng để tự kiểm tra trí nhớ và đánh dấu từ đã thuộc. Gặp từ quên, hãy mở lại bài gốc.',
      '45 chữ mới: 唾 捻 羞 貪 僅 痩 痘 喩 賂 遜 隙 傲 窟 塞 腺 詮 塑 遡 溺 頓 毀 彙 慄 塡 綻 貌 辣 璃 遵 潰 蔽 嘲 憬 踪 骸 醒 錮 頰 瞭 曖 顎 濫 璧 籠 鬱. Từ ghép trọng tâm: 捻出, 貪欲, 僅差, 比喩, 賄賂, 謙遜, 傲慢, 閉塞, 所詮, 遡及, 頓挫, 毀損, 語彙, 戦慄, 補塡, 破綻, 変貌, 辛辣, 遵守, 隠蔽, 嘲笑, 憧憬, 失踪, 形骸化, 覚醒, 禁錮, 明瞭, 曖昧, 濫用, 完璧, 憂鬱. Chú ý: 固唾 đọc かたず, 憧憬 đọc しょうけい hoặc どうけい, 頰 chỉ có âm kun ほお.',
      '8 nhóm ôn: tức thì, khởi đầu và vị thế; điều kiện, tiền đề và căn cứ; phạm vi, bổ sung và mức tối thiểu; cảm xúc mạnh và hệ quả tất yếu; đánh giá, phê phán và tình trạng; nhượng bộ, giả định và nhận định dè dặt; mục đích, quyết tâm và giao tiếp trang trọng; văn chương, chủ đề và văn ngữ. Bảng cặp so sánh: が早いか／や否や／なり／そばから; あっての／なくしては／ばこそ; に則って／に照らして／に即して; べからず／まじき; すら／だに／たりとも／なりとも; ずにはおかない／ずにはすまない／ではすまない; をものともせず／をよそに; 極まりない／の極み／の至り; たところで／といえども／とて; をかえりみず／をおして; べく／んがため; ことこの上ない／限りだ; かたがた／がてら／かたわら; とあって／とあれば; ごとし／んばかりに／とばかりに.',
      'Hội thoại tự soạn trước và sau kỳ thi N1. Chú giải: いよいよ cuối cùng cũng; コツ bí quyết; 設問（せつもん）câu hỏi; 両立（りょうりつ）cân bằng hai việc; 合格ライン điểm đỗ; ごちそうする khao.',
      'Nghe trước, sau đó mới mở bản chép; bài 1 dài khoảng 3 phút, hãy ghi ý chính khi nghe. Chú giải: アウトプット đầu ra (nói, viết); 生の（なまの）thật, nguyên bản; 欠くべからざる không thể thiếu; 受験票（じゅけんひょう）phiếu dự thi; 不正行為（ふせいこうい）gian lận; 合図（あいず）hiệu lệnh; 勘（かん）đoán mò.',
      'Bài 1 là tiểu luận dài khoảng 900 ký tự: đọc lướt để nắm ý chính trước, sau đó đọc kỹ. Bài 2 là bài đọc tích hợp hai ý kiến A và B: tìm điểm giống và khác giữa hai bên. Chú giải: 恨めしい（うらめしい）oán hận; 取り返しのつかない không thể vãn hồi; 細やか（こまやか）tinh tế; 飛躍的（ひやくてき）vượt bậc; 一理ある có lý; 片言（かたこと）bập bẹ.',
      'Bài 1: thư kính ngữ khoảng 300 ký tự (250–350) báo kết quả và cảm ơn giáo viên. Bài 2: bài nghị luận khoảng 550 ký tự (450–650) “Trong thời đại AI dịch thuật, con người có còn cần học ngoại ngữ?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Kiểm tra: dùng ít nhất bốn mẫu N1 thuộc các nhóm khác nhau. Bản nháp tự lưu trên trình duyệt.',
      '55 câu: 10 từ vựng ôn, 10 Hán tự, 23 ngữ pháp (mỗi bài N1-01 đến N1-23 một câu), 6 nghe, 6 đọc. Bài kiểm tra tổng ôn 25 câu: 1 từ vựng, 1 Hán tự và 23 câu ngữ pháp, đạt từ 70%.',
      'Tự kiểm cuối khóa N1: với mỗi nhóm ôn, đặt một câu về cuộc sống hoặc công việc của bạn; tự giải thích được các cặp so sánh trong bảng; đọc hiểu một bài 900 ký tự trong khoảng 10 phút và so sánh hai ý kiến trong bài đọc tích hợp. Nhóm nào còn yếu, hãy mở lại bài gốc tương ứng. Bước tiếp theo: đọc báo, sách chuyên ngành và luyện viết hằng ngày.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng ít nhất bốn mẫu N1 thuộc các nhóm khác nhau (35%); lập luận có căn cứ, có đề cập ý kiến ngược lại (30%); văn phong thống nhất, phù hợp người đọc (15%). Không có điểm tự động.',
    quiz: { vocab: 1, kanji: 1, grammar: allGrammar, listen: [], read: [] },
    counts: { quiz: 25, exercises: 55 },
  });
