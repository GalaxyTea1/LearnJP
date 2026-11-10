import * as content from '../../../content/n1/n1-03.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 82001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-03',
    unitNumber: 3,
    moduleId,
    levelId,
    stamp: '2026-11-28T00:00:00.000Z',
    title: 'Kinh tế và tài chính',
    titleJp: '経済と金融',
    description:
      'N1-03: thị trường, tiền tệ, tài chính công và tài chính cá nhân; các mẫu “tùy thuộc”, tiền đề và hoàn cảnh bắt buộc: ～いかんで／いかんによって, ～いかんにかかわらず／いかんを問わず, ～如何（いかん）, ～ようによっては, ～を前提に, ～からなる, ～にかかわる, ～を余儀なくされる／させる. 150 từ vựng kinh tế, tài chính, 46 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Thị trường', 'Tài chính', 'Tùy thuộc'],
    textbook: 'Original LearnJP — N1 economy and finance',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '46 Hán tự mới',
      'Tùy thuộc, tiền đề, buộc phải',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01, N1-02 và các mẫu N2 ～次第で, ～にかかわらず, ～ざるを得ない, ～に関する. Mục tiêu: hiểu bản tin và xã luận kinh tế (lãi suất, tỷ giá, ngân sách), nói về điều kiện, tiền đề và hoàn cảnh bắt buộc bằng văn phong trang trọng; viết về quản lý tiền và bài nghị luận về giáo dục tài chính. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng kinh tế và tài chính: chính sách tiền tệ (金融緩和, 政策金利), trái phiếu và cổ phiếu (国債, 債務, 株式, 配当), ngân sách nhà nước (歳入, 歳出, 財政赤字), biến động thị trường (急騰, 乱高下, 底を打つ), doanh nghiệp (破綻, 再編, 資金繰り), thuế (課税, 控除, 確定申告). Cặp dễ nhầm: 債務 (nợ phải trả) / 債権 (quyền đòi nợ); 元本 (tiền gốc của khoản đầu tư) / 元手 (vốn liếng ban đầu); 歳入 / 歳出; 好材料 / 懸念材料; 内需 / 外需.',
      '46 chữ mới: 基 株 債 興 貢 趣 賄 征 堤 租 柵 救 執 房 撤 削 密 措 我 為 抑 幕 奈 傷 弾 償 秘 拒 塚 致 繰 鈴 盤 項 喪 伴 養 懸 掲 躍 邸 還 属 枠 恵 露. Chú ý cách đọc đặc biệt: 為替 かわせ, 年貢 ねんぐ, 執着 しゅうちゃく, 幕府 ばくふ, 知恵 ちえ, 資金繰り しきんぐり. 枠 là chữ do Nhật tự tạo nên chỉ có âm kun わく.',
      '8 mục: ～いかんで／いかんによって; ～いかんにかかわらず／いかんを問わず; ～如何（いかん）; ～ようによっては; ～を前提に; ～からなる; ～にかかわる; ～を余儀なくされる／させる. So sánh: いかんで / 次第で; いかんにかかわらず / にかかわらず; いかんで (điều kiện khách quan) / ようによっては (cách nhìn, cách làm); を前提に / をふまえて; からなる / でできている; にかかわる / に関する; を余儀なくされる / ざるを得ない.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 開業（かいぎょう）mở cửa hàng; 自己資金（じこしきん）vốn tự có; 審査（しんさ）thẩm định; 黒字化（くろじか）có lãi; 手放す（てばなす）bán đi, buông bỏ.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 会合（かいごう）cuộc họp; 利上げ（りあげ）tăng lãi suất; 総裁（そうさい）thống đốc; 運用（うんよう）đầu tư sinh lời; 雇用（こよう）việc làm.',
      'Bài 1 là xã luận về tăng lãi suất; bài 2 là tiểu luận về giáo dục tài chính ở trường học. Chú giải: 節目（ふしめ）cột mốc; 変動金利（へんどうきんり）lãi suất thả nổi; 追い風（おいかぜ）gió thuận; 利払い費（りばらいひ）tiền trả lãi; しわ寄せ gánh nặng dồn lên; 眉をひそめる cau mày; はしたない khiếm nhã; 過言（かごん）nói quá.',
      'Bài 1: đoạn văn khoảng 300 ký tự về cách bạn quản lý tiền. Bài 2: bài nghị luận khoảng 550 ký tự “có nên dạy đầu tư ở trường cấp ba?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói kết quả thay đổi theo điều kiện bằng いかんで và ようによっては; viết quy định “bất kể…” bằng いかんを問わず; dùng 如何ともしがたい, 如何せん; đặt điều kiện trước bằng を前提に; mô tả thành phần bằng からなる; nhấn mức độ hệ trọng bằng にかかわる; nói hoàn cảnh bắt buộc bằng を余儀なくされる／させる. Bài tiếp theo (N1-04): chính trị và ngoại giao.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
