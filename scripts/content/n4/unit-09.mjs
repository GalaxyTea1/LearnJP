import * as content from '../../../content/n4/n4-09.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n4Format } from './format.mjs';

export const moduleId = 18001,
  levelId = 10001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n4Format,
    level: 'N4',
    code: 'N4-09',
    unitNumber: 9,
    moduleId,
    levelId,
    stamp: '2026-10-25T00:00:00.000Z',
    title: 'Thay đổi trạng thái',
    titleJp: '変化と上達を話す',
    description:
      'N4-09: mô tả khả năng mới, thay đổi thói quen và quá trình tiến bộ; phân biệt thay đổi tự nhiên với tác động chủ động. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tiến bộ', 'Thói quen', 'Thay đổi trạng thái'],
    textbook: 'Original LearnJP — changes and progress',
    sectionTitles: [
      'Mục tiêu và cách học',
      '50 từ dùng trong bài',
      '12 Kanji mới',
      'Thay đổi trạng thái',
      'Hội thoại',
      'Luyện nghe TTS',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: thể từ điển/ない/て, thể khả năng N4-04, tính từ i/na. Mục tiêu: kể khả năng mới, cách duy trì thói quen và sự tiến bộ học tiếng Nhật. 40 bài tập, quiz 20 câu, ngưỡng đạt 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.',
      '50 mục từ. 上げる (nâng lên) khác あげる (tặng) ở N4-07 dù cùng cách đọc. 増える／減る, 上がる／下がる diễn tả thay đổi; 上げる／下げる nêu tác động. 明るい／暗い từng xuất hiện ở ví dụ Kanji, nay học thành mục từ. 計る thường dùng đo thời gian; 測る đo chiều dài, đại lượng. Chú giải: 点（てん）điểm; 気温（きおん）nhiệt độ; 耳（みみ）tai; スピーチ bài nói; 覚え方（おぼえかた）cách nhớ.',
      '12 Kanji mới so với N5 và N4-01 đến N4-08. 増加、減少、文化、勤勉、訓練 là từ ghép mở rộng nhận biết, đã có cách đọc và nghĩa. 毎週 đọc まいしゅう; 最近 đọc さいきん. Các chữ có trong từ vựng trước đây nay được học chính thức ở phần Kanji.',
      '6 mục: ようになる; tính từ＋なる; ようにする; tính từ＋する; てくる; ていく. 読めるようになった là khả năng mới, 読むようになった thường là thói quen mới. ようにしている nhấn nỗ lực duy trì, không bảo đảm chưa từng bỏ buổi. So sánh 部屋が明るくなった với 部屋を明るくした.',
      'Hội thoại tự soạn, dùng TTS. 十分 ở thời lượng đọc じゅっぷん (mười phút), khác 十分（じゅうぶん）đầy đủ. ～てみる thử làm; ～ても dù...; ～ずつ mỗi...; ～やすい dễ làm; ～そう có vẻ (nhận biết). Mười lăm phút sáng và tối là đề xuất trong hội thoại, không phải lịch cố định của mọi bài.',
      'Nghe trước khi mở bản chép. Chú giải: ～ながら vừa... vừa...; 思い出す（おもいだす）nhớ lại; 前の日（まえのひ）ngày trước đó. Một bài nói nhật ký năm phút mỗi tối; bài còn lại ôn mười phút mỗi sáng. TTS không thay thế giọng thu âm người thật.',
      'Chú giải: 記事（きじ）bài viết; 声に出して（こえにだして）thành tiếng; 平日（へいじつ）ngày thường; ノート vở; ～のに時間がかかる mất thời gian để làm (không phải のに “mặc dù”); ～てから kể từ khi. Không suy ra điểm đã tăng khi đoạn chỉ nói thói quen thay đổi.',
      'Tự luyện theo số ký tự tiếng Nhật, có thể dùng tiến bộ tưởng tượng. Bản nháp chỉ lưu trong trình duyệt, không có điểm viết tự động. Viết rõ điều đã thay đổi, việc đang cố duy trì và kế hoạch tương lai. Không cần khẳng định thành thạo hoàn toàn.',
      '40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu hỏi khả năng dùng đúng thể khả năng. Câu nghe/đọc có tư liệu tương ứng; quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa.',
      '読めるようになった: đã đọc được. 読むようにしている: cố duy trì đọc. 楽しくなる: trở nên vui; 説明を簡単にする: đơn giản hóa giải thích. 減ってきた: đã giảm dần đến nay; 続けていく: sẽ tiếp tục về sau. いい→よくなる／よくする; tính từ na và danh từ dùng に.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (25%); phân biệt thay đổi, nỗ lực duy trì và hướng thời gian (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',
    quiz: { vocab: 2, kanji: 3, grammar: [0, 1, 2, 3, 4, 5, 6], listen: [0, 1, 2, 3], read: [0, 1, 2, 3] },
  });
