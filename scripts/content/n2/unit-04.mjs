import * as content from '../../../content/n2/n2-04.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 63001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-04',
    unitNumber: 4,
    moduleId,
    levelId,
    stamp: '2026-11-10T00:00:00.000Z',
    title: 'Văn bản trang trọng',
    titleJp: '改まった文書',
    description:
      'N2-04: thông báo, thư công việc và lời chào trang trọng: ～につき, ～にあたって／～にあたり, ～に際して, ～のもとで, ～をもって, ～次第だ, ～かねる. 150 từ vựng về thư từ, giấy tờ và kính ngữ, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Thông báo', 'Thư công việc', 'Lời chào trang trọng'],
    textbook: 'Original LearnJP — N2 formal documents',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Văn thông báo và thư từ',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N2-03 và N3 (kính ngữ, ～ので／～ため, ～次第 “ngay khi”, ～かねない). Mục tiêu: đọc thông báo dán ở cửa hàng, hiểu cấu trúc một lá thư trang trọng, viết thư thông báo và thư xin lỗi. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Thư từ, giấy tờ hành chính, thông báo, nhậm chức và kính ngữ cố định. Cặp dễ nhầm: 貴社 (văn viết) / 御社 (văn nói); 拝啓…敬具 / 前略…草々; 御中 (tổ chức) / 様 (cá nhân) / 各位 (nhiều người); 就任 (nhậm chức) / 着任 (đến nhận việc) / 赴任 (đi nhận việc ở nơi xa).',
      '20 chữ mới: 参 申 籍 敬 封 兆 符 伺 農 州 念 域 労 形 落 欧 準 辺 渡 移. Từ ghép trọng tâm: 参列, 持参, 申告, 戸籍, 国籍, 敬意, 敬具, 同封, 兆し, 符号, 農家, 本州, 欧州, 記念, 区域, 労働, 苦労, 段落, 準じる, 周辺, 渡航, 移転, 移行. Chú ý: 兆し đọc きざし, 労う đọc ねぎらう, 音符 đọc おんぷ.',
      '7 mục: ～につき（理由）; ～にあたって／～にあたり; ～に際して; ～のもとで; ～をもって; ～次第だ（経緯）; ～かねる. So sánh: につき (văn thông báo) / ので; にあたって (tâm thế trước việc lớn) / に際して (thời điểm); をもって / で; 次第だ (đầu đuôi) / Vます + 次第 (ngay khi); かねる (khó làm) / かねない (có thể xảy ra điều xấu).',
      'Hội thoại tự soạn ở văn phòng. Chú giải: 結ぶ（むすぶ）kết (thư); サポート係 bộ phận hỗ trợ; カタログ catalogue; 印刷に入る bắt đầu in.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 末日（まつじつ）ngày cuối tháng; 南口（みなみぐち）cửa Nam; 故郷（こきょう）quê hương; 寄せられる được gửi đến; 司会（しかい）người dẫn chương trình.',
      'Bài 1 là thư thông báo chuyển văn phòng; bài 2 là bài viết về khuôn mẫu thư trang trọng. Chú giải: 晩秋の候 giữa tiết cuối thu; 業務（ぎょうむ）nghiệp vụ; 創業（そうぎょう）thành lập; 駐車場（ちゅうしゃじょう）bãi đỗ xe; 繁栄（はんえい）thịnh vượng; 後付け phần ghi sau.',
      'Bài 1: thông báo khoảng 250 ký tự (kính ngữ). Bài 2: thư xin lỗi khoảng 400 ký tự (kính ngữ, có 拝啓／敬具). Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: viết một biển báo bằng につき; chào trước một dịp quan trọng bằng にあたり; hướng dẫn thủ tục bằng に際して; nói làm việc dưới sự hướng dẫn của ai bằng のもとで; thông báo kết thúc bằng をもって; giải thích lý do liên lạc bằng 次第です; từ chối khách bằng いたしかねます. Bài tiếp theo (N2-05) theo lộ trình N2.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); bố cục và khuôn mẫu thư đúng (30%); kính ngữ phù hợp người đọc (15%). Không có điểm tự động.',
  });
