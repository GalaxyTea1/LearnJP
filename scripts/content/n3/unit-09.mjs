import * as content from '../../../content/n3/n3-09.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 38001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-09',
    unitNumber: 9,
    moduleId,
    levelId,
    stamp: '2026-11-07T00:00:00.000Z',
    title: 'Tìm việc',
    titleJp: '仕事を探す',
    description:
      'N3-09: công việc, đối tượng và lập trường: ～について, ～に関して, ～に対して, ～として, ～にとって, ～をはじめ, ～において. Tuyển dụng, phỏng vấn, điều kiện làm việc và sự nghiệp; 24 Hán tự về công việc. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tìm việc', 'Phỏng vấn', 'Đối tượng và lập trường'],
    textbook: 'Original LearnJP — N3 work and standpoint',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '24 Hán tự mới',
      'Đối tượng và lập trường',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 và N3-01 đến N3-08 (đặc biệt kính ngữ ở N3-03). Mục tiêu: nêu chủ đề, đối tượng, tư cách và góc nhìn chính xác; đọc tin tuyển dụng; gọi điện hỏi và trả lời phỏng vấn xin việc; viết phần giới thiệu điểm mạnh và email hỏi thông tin. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Tuyển dụng, hình thức làm việc, công ty và bộ phận, điều kiện làm việc, sự nghiệp, hồ sơ và phỏng vấn. Cặp gần nghĩa: 給与 (văn viết) / 給料; 雇う (thuê) / 雇用 (văn viết); 退職 (nghỉ việc, về hưu) / 退社 (tan sở hoặc rời công ty) / 辞職 (từ chức) / 引退 (giải nghệ); 業種 (loại hình kinh doanh) / 職種 (loại công việc); 顧客 (trang trọng) / お客様; パート (thường người lớn) / アルバイト.',
      '24 chữ mới: 働給求募応雇履 面接営販管企署部役担務 協資類式契退. Từ ghép trọng tâm: 働き方, 給与（きゅうよ）, 求人, 募集（ぼしゅう）, 応募（おうぼ）, 雇用（こよう）, 履歴書（りれきしょ）, 面接, 営業, 販売, 管理, 企業, 部署（ぶしょ）, 担当, 業務, 協力, 書類, 正式, 契約, 退職. Chú ý 役 đọc やく (役職, 役員).',
      '7 mục: ～について; ～に関して／に関する; ～に対して; ～として; ～にとって; ～をはじめ; ～において／における. So sánh: にとって (góc nhìn đánh giá: 私にとって大切だ) / に対して (hành động, thái độ hướng tới: お客様に対して丁寧だ); について (thường ngày) / に関して (trang trọng, email, thông báo). Dạng bổ nghĩa danh từ: についての, に関する, に対する, としての, における.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 説明会（せつめいかい）buổi giới thiệu; 貿易会社（ぼうえきがいしゃ）công ty thương mại; ぴったり rất hợp; 目標（もくひょう）chỉ tiêu; 認める（みとめる）cho phép, công nhận; 翻訳（ほんやく）dịch thuật; 見せ合う（みせあう）cho nhau xem.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 当社（とうしゃ）công ty chúng tôi; 名（めい）người (đếm); 卒業見込み（そつぎょうみこみ）dự kiến tốt nghiệp; 母国語（ぼこくご）tiếng mẹ đẻ; 筆記試験（ひっきしけん）thi viết; 個別に（こべつに）riêng từng người; 構わない cũng được; 焦る（あせる）vội vàng.',
      'Chú giải bài 1: 歓迎（かんげい）chào đón; 当店（とうてん）tiệm chúng tôi; 割引（わりびき）giảm giá; チャンス cơ hội; 職場（しょくば）nơi làm việc. Bài 2: 本業（ほんぎょう）công việc chính; 何らか（なんらか）nào đó; 収入（しゅうにゅう）thu nhập; 生かす（いかす）phát huy; 積む（つむ）tích lũy; 余裕（よゆう）dư dả; 課題（かだい）vấn đề cần giải quyết; 投げかける đặt ra.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 là bài nói phỏng vấn, dùng khiêm nhường cho bản thân. Bài 2 là email hỏi thông tin, dùng ～に関して và kính ngữ. Kiểm tra: にとって đi với câu đánh giá, に対して đi với hành động, thái độ. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: hỏi về nội dung công việc bằng ～について và viết một câu email bằng ～に関して; nói thái độ với khách bằng ～に対して; giới thiệu kinh nghiệm bằng ～として; nói công việc có ý nghĩa gì bằng ～にとって; phân biệt にとって và に対して. Bài tiếp theo (N3-10): sức khỏe, lời khuyên và nghĩa vụ (わけにはいかない, ことだ, ものだ).',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); chọn đúng にとって／に対して／として và kính ngữ phù hợp (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 2, 4, 6, 7, 8, 9, 10, 11, 13, 14],
      listen: [0, 2, 3, 4],
      read: [0, 2, 3, 4],
    },
  });
