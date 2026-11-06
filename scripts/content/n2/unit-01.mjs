import * as content from '../../../content/n2/n2-01.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 60001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-01',
    unitNumber: 1,
    moduleId,
    levelId,
    stamp: '2026-11-07T00:00:00.000Z',
    levelRow: {
      title: 'N2 — Năng lực chuyên nghiệp',
      titleJp: '日本語能力試験 N2',
      description: 'Đang mở N2-01. Các bài N2 tiếp theo chưa xuất bản.',
      color: '#F59E0B',
      badge: '⛰️',
      totalVocab: 150,
      totalKanji: 20,
      totalGrammar: 7,
      sortOrder: 4,
    },
    title: 'Môi trường làm việc mới',
    titleJp: '新しい職場',
    description:
      'N2-01: ngày đầu đi làm, thủ tục và trình tự công việc: ～次第, ～てからでないと, ～た上で, ～際（に）, ～に先立って, ～をきっかけに, ～を契機に. 150 từ vựng về công sở và hành chính, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Ngày đầu đi làm', 'Quy trình và thủ tục', 'Thời điểm và trình tự'],
    textbook: 'Original LearnJP — N2 workplace and procedures',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Thời điểm và trình tự',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: hoàn thành N3 (đặc biệt ～たとたん, ～てから, ～とき, ～によって). Mục tiêu: hiểu thông báo và hướng dẫn ở nơi làm việc, nói về trình tự công việc bằng văn phong trang trọng, viết email báo cáo cho cấp trên. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng công sở và hành chính: nhân sự, thủ tục, giấy tờ, chấm công, điện thoại. Cặp dễ nhầm: 御社 (quý công ty, khi nói) / 貴社 (khi viết); 当社 (công ty chúng tôi) / 先方 (phía đối tác); 原本 (bản gốc) / 写し・控え (bản sao, bản lưu); 改定 (sửa giá, quy định) / 改正 (sửa luật); 出社 (đến công ty) / 出勤 (đi làm, ca làm).',
      '20 chữ mới: 設 次 係 順 令 緒 柱 連 市 米 関 現 要 都 和 区 県 改 活 軍. Từ ghép trọng tâm: 設備, 設置, 次第に, 次長, 係長, 手順, 順守, 辞令, 内緒, 連携, 市役所, 欧米, 関連, 現状, 要点, 都合, 和やか, 区役所, 県庁, 改善, 活用, 軍手. Chú ý: 都合 đọc つごう, 内緒 đọc ないしょ, 軍手 là găng tay vải dùng khi làm việc.',
      '7 mục: ～次第; ～てからでないと; ～た上で; ～際（に）; ～に先立って; ～をきっかけに; ～を契機に. So sánh: 次第 (tương lai, có ý chí) / たとたん (việc đã xảy ra, bất ngờ); た上で (làm kỹ A rồi mới B) / てから (chỉ thứ tự); 際 (trang trọng) / とき; きっかけ (chuyện cá nhân) / 契機 (sự kiện lớn, văn viết).',
      'Hội thoại tự soạn, tình huống giả định ở công ty. Chú giải: 再発行（さいはっこう）cấp lại; 情報システム部 phòng hệ thống thông tin; 経路（けいろ）tuyến đường; 定期券（ていきけん）vé tháng.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: インターンシップ thực tập; 申し伝える（もうしつたえる）nhắn lại (khiêm nhường); 分かりかねます không thể trả lời (lịch sự); 一人前（いちにんまえ）người làm được việc.',
      'Bài 1 là thông báo nội bộ gửi nhân viên mới; bài 2 là bài viết kể kinh nghiệm năm đầu. Chú giải: 着用（ちゃくよう）mặc, đeo; 申し出る（もうしでる）đề nghị, báo; 支給（しきゅう）chi trả; 一人前 người làm được việc; 抱える（かかえる）ôm, gánh.',
      'Bài 1: email báo cáo khoảng 250 ký tự, kính ngữ phù hợp. Bài 2: bài viết khoảng 400 ký tự, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: hứa làm việc gì ngay khi có kết quả bằng 次第; nói điều kiện bắt buộc bằng てからでないと; đề nghị làm sau khi xem xét kỹ bằng た上で; viết thông báo với 際に và に先立って; kể một bước ngoặt bằng をきっかけに／を契機に. Bài tiếp theo (N2-02): thói quen và xu hướng.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); bố cục rõ ràng, đủ ý (30%); kính ngữ hoặc văn phong phù hợp người đọc (15%). Không có điểm tự động.',
  });
