import * as content from '../../../content/n4/n4-10.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 19001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-10',
    unitNumber: 10,
    moduleId,
    levelId,
    stamp: '2026-10-25T00:00:00.000Z',
    title: 'Bị động cơ bản',
    titleJp: '受身で出来事を話す',
    description:
      'N4-10: chia thể bị động, kể sự cố, hiểu thông báo và nêu người tạo ra. Phân biệt bị động trực tiếp, sở hữu và gián tiếp. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Sự cố', 'Tin tức', 'Người tạo ra'],
    textbook: 'Original LearnJP — basic passive voice',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Bị động cơ bản',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: nhóm động từ, trợ từ は／が／に／を và thể khả năng. Mục tiêu: kể một sự cố bằng bị động, hiểu thông báo và tác giả của một sản phẩm. 40 bài tập, quiz 20 câu, đạt từ 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.',
      '50 mục từ về sự cố, thông báo và sáng tạo. 注意する là động từ; 注意 ở N4-06 là danh từ. 招く tương tự 招待する đã học nhưng khác dạng chia. Chú giải: 膝（ひざ）đầu gối; 載る（のる）được đăng; 知らせる（しらせる）báo tin; 若い（わかい）trẻ. Các tên người, công trình và tin tức trong bài là giả định.',
      '12 Kanji mới so với N5 và N4-01 đến N4-09. 世話、業界、学歴、日本史、歩道橋、公共、動物園 là từ mở rộng nhận biết, có cách đọc và nghĩa. Phân biệt 橋（はし）cầu với 箸（はし）đũa khi gặp ở bài khác.',
      '6 mục: cách chia ba nhóm; bị động trực tiếp; tác động đến đồ/bộ phận cơ thể; bị động gián tiếp; sự kiện; によって. 買う→買われる; する→される; 来る→来られる（こられる）. 食べられる có thể là khả năng hoặc bị động tùy ngữ cảnh. Bị động không nhất thiết là điều xấu.',
      'Hội thoại tự soạn, dùng TTS. Chú giải: 相手（あいて）người kia; 模型（もけい）mô hình; 十年前（じゅうねんまえ）mười năm trước; 書かれ nối câu dạng 書かれる; ～んですか hỏi xác nhận/giải thích (nhận biết). Thời gian xây tòa nhà trong hội thoại khác thời gian xây cây cầu trong bài đọc.',
      'Nghe trước khi mở bản chép. Chú giải: 知らない人（しらないひと）người lạ; 展示会（てんじかい）triển lãm; 入場（にゅうじょう）vào cửa. Câu hỏi dựa đúng tư liệu của từng bài. TTS không thay thế thu âm người thật.',
      'Chú giải: タオル khăn; 分かりやすい（わかりやすい）dễ hiểu; ～と言われた được nói/nhận xét rằng; 奥（おく）phía trong; 置いてある（おいてある）được đặt sẵn; 自由に（じゆうに）tự do; 三十日（さんじゅうにち）ngày 30. Tin và triển lãm là giả định, không phải lịch sự kiện thật.',
      'Tự luyện theo số ký tự tiếng Nhật, có thể dùng sự việc tưởng tượng. Bản nháp chỉ lưu trong trình duyệt, không có chấm điểm viết tự động. Viết rõ ai làm, ai chịu ảnh hưởng và diễn biến. Không cần kể trải nghiệm riêng tư.',
      '40 câu gồm 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Dùng ngữ cảnh để phân biệt dạng ～られる. Quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa. Câu hỏi không suy ra người gây sự cố cố tình làm hại.',
      '先生に褒められた: được giáo viên khen. 人に足を踏まれた: bị người khác giẫm chân. 雨に降られた: gặp mưa, chịu ảnh hưởng. 来週開催される: sẽ được tổ chức tuần sau. 技師によって設計された: do kỹ sư thiết kế. によって không thay mọi に trong câu bị động.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); chia bị động và xác định đúng người tác động, người chịu ảnh hưởng (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
