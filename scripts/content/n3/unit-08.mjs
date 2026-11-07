import * as content from '../../../content/n3/n3-08.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 37001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-08',
    unitNumber: 8,
    moduleId,
    levelId,
    stamp: '2026-11-06T00:00:00.000Z',
    title: 'Đặt mục tiêu học tập',
    titleJp: '学ぶ目標を決める',
    description:
      'N3-08: mục đích và quyết định: ～ように, ～ようにと言う, ～ことにする, ～ことになる, ～ことにしている, ～ことになっている, ～ついでに. Trường học, thi cử, học bổng và phương pháp học; 24 Hán tự về học tập. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Mục tiêu học tập', 'Quyết định và quy định', 'Trường học'],
    textbook: 'Original LearnJP — N3 study goals and decisions',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '24 Hán tự mới',
      'Mục đích và quyết định',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 (N4-05 ために, N4-09 ようにする／ようになる) và N3-01 đến N3-07. Mục tiêu: nói mục đích đúng loại động từ, truyền đạt lời dặn, phân biệt quyết định của mình với việc được quyết định, nói thói quen tự đặt và nội quy chung; trình bày kế hoạch học và nội quy lớp. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Trường học và khóa học, điểm số và thành tích, thi cử và hồ sơ, mục tiêu và ý chí, phương pháp học, trình độ. Cặp gần nghĩa: 教科 (môn ở trường phổ thông) / 科目 (môn thi, học phần); 講義 (bài giảng đại học) / 講座 (khóa học ngắn); 自習 (tự học trong giờ, ở lớp) / 独学 (tự học không thầy); 上達 (kỹ năng tiến bộ) / 発達 (phát triển); 学習 (văn viết) / 勉強; 聴解 (phần thi nghe) / 聞き取り.',
      '24 chữ mới: 講義科修 得点績復 標達 選択規則 努望希願夢志識 初級師. Từ ghép trọng tâm: 講義, 科目, 修了, 獲得, 点数, 満点, 成績, 実績, 復習, 目標, 達成（たっせい）, 選択（せんたく）, 規則, 努力, 希望, 願書（がんしょ）, 夢中, 志望, 知識, 意識, 初級, 教師. Chú ý 復帰 đọc ふっき (âm ngắt).',
      '7 mục: ～ように (mục đích); ～ようにと言う／頼む／注意する; ～ことにする; ～ことになる; ～ことにしている; ～ことになっている; ～ついでに. So sánh: ために (động từ ý chí, cùng chủ ngữ) / ように (không ý chí, thể khả năng, phủ định, khác chủ ngữ); ことにする (tự quyết) / ことになる (được quyết định); ことにしている (lệ của mình) / ことになっている (quy định chung).',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 苦手（にがて）yếu, không giỏi; 力がつく（ちからがつく）giỏi lên; 文房具（ぶんぼうぐ）đồ dùng học tập; 問題集（もんだいしゅう）sách bài tập; 勉強会（べんきょうかい）buổi học nhóm; 集合（しゅうごう）tập trung.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 数える（かぞえる）tính, đếm; 出席率（しゅっせきりつ）tỷ lệ đi học; 受け付ける（うけつける）tiếp nhận; 日本語教育（にほんごきょういく）giảng dạy tiếng Nhật; 応援（おうえん）ủng hộ; 例文（れいぶん）câu ví dụ; 完璧（かんぺき）hoàn hảo; 目指す（めざす）nhắm tới.',
      'Chú giải bài 1: 中心（ちゅうしん）trọng tâm; 進み具合（すすみぐあい）tiến độ; 報告し合う（ほうこくしあう）báo cho nhau. Bài 2: 本校（ほんこう）trường này; 来年度（らいねんど）năm học tới; 対象（たいしょう）đối tượng; 在籍（ざいせき）đang theo học; 支給（しきゅう）cấp; 事務室（じむしつ）văn phòng; 中旬（ちゅうじゅん）giữa tháng.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 trình bày kế hoạch học: mục tiêu, giai đoạn, thói quen, cách giữ động lực. Bài 2 giới thiệu nội quy cho người mới; dùng ～時は thay cho ～場合. Kiểm tra: ai quyết định (ことにする／ことになる), quy tắc của ai (ことにしている／ことになっている). Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói một mục đích bằng ～ように và một bằng ～ために; kể một lời dặn của thầy bằng ～ように言われた; phân biệt 留学することにした và 留学することになった; nói một thói quen bằng ～ことにしている và một nội quy bằng ～ことになっている; nhờ bạn việc gì bằng ～ついでに. Bài tiếp theo (N3-09): công việc, đối tượng và lập trường (について, に対して, として, にとって).',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); chọn đúng ように／ために và ことにする／ことになる, dùng đủ mẫu đề yêu cầu (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12],
      listen: [0, 2, 3, 4],
      read: [0, 2, 3, 4],
    },
  });
