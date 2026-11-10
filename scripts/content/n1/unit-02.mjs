import * as content from '../../../content/n1/n1-02.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 81001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-02',
    unitNumber: 2,
    moduleId,
    levelId,
    stamp: '2026-11-27T00:00:00.000Z',
    title: 'Triết học và tư tưởng',
    titleJp: '哲学と思想',
    description:
      'N1-02: triết học, đạo đức và tư tưởng Đông – Tây; các mẫu điều kiện tất yếu, lý do nhấn mạnh và tư cách: ～あっての, ～ばこそ, ～なくして（は）, ～ことなしに, ～ならでは, ～ゆえに, ～たる, ～ともあろう. 150 từ vựng về triết học và đạo đức, 46 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tư tưởng', 'Bản chất con người', 'Chính vì… nên'],
    textbook: 'Original LearnJP — N1 philosophy and ethics',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '46 Hán tự mới',
      'Điều kiện tất yếu và tư cách',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 (đọc xã luận, tách chủ trương và căn cứ) và các mẫu N2 ～からこそ, ～なしに, ～ため（に）. Mục tiêu: đọc tiểu luận triết học và đạo đức, hiểu lập luận về bản chất con người; nói điều kiện không thể thiếu, lý do nhấn mạnh và chuẩn mực theo tư cách; viết đoạn văn về giá trị bản thân và bài nghị luận. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng triết học, đạo đức, tư tưởng: khái niệm (本質, 観念, 普遍, 相対的), con người (理性, 良心, 自我, 人格), đức tính (美徳, 寛容, 節度, 中庸), cách nhìn đời (世界観, 死生観, 無常, 諦観), thành ngữ bốn chữ (一期一会, 温故知新, 自業自得). Cặp dễ nhầm: 思索 (suy tư sâu) / 思慮 (suy nghĩ chín chắn trước khi làm); 省察 (tự vấn) / 洞察 (thấu hiểu sâu); 諦念 / 諦観 / 達観 (buông bỏ, chấp nhận, nhìn thấu); 性善説 / 性悪説.',
      '46 chữ mới: 慮 徳 哲 仁 霊 魔 魂 諦 織 拡 振 就 献 厳 維 浜 遺 塁 邦 遣 雄 益 緊 宣 昭 廃 江 僚 吉 盛 臨 踏 壊 障 継 筋 狙 葬 司 善 迫 崩 聴 脱 博 締. Chú ý cách đọc đặc biệt: 遺言 ゆいごん, 成就 じょうじゅ, 繁盛 はんじょう, 雪崩 なだれ, 博士 はかせ, 慮る おもんぱかる. 踏まえる viết bằng chữ 踏 (mẫu ～をふまえて ở N1-01).',
      '8 mục: ～あっての; ～ばこそ; ～なくして（は）; ～ことなしに; ～ならでは; ～ゆえに; ～たる; ～ともあろう. So sánh: あっての (khẳng định) / なくして～ない (phủ định); ばこそ (cứng, lý do tích cực) / からこそ; なくして (danh từ) / ことなしに (động từ) / なしに (N2); ゆえに (văn cổ) / ため; たる (chuẩn mực nên có) / ともあろう (phê phán khi lệch chuẩn).',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 哲学カフェ quán cà phê triết học, nơi mọi người cùng bàn một câu hỏi; 差別的（さべつてき）mang tính phân biệt; ゼミ seminar; 空回り（からまわり）quay vòng vô ích.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 疑う（うたがう）nghi ngờ; たどり着く（たどりつく）tìm đến được; 和菓子（わがし）bánh kẹo Nhật; 老舗（しにせ）cửa hàng lâu đời; 面談（めんだん）buổi trao đổi riêng; それとなく khéo léo, gián tiếp.',
      'Bài 1 là tiểu luận “vì sao cần học triết học”; bài 2 bàn về thuyết tính thiện và tính ác và ảnh hưởng của Nho giáo ở Nhật. Chú giải: 営み（いとなみ）hoạt động; 否応なく（いやおうなく）buộc phải; 礼（れい）lễ; 私利私欲（しりしよく）tư lợi; 不祥事（ふしょうじ）bê bối; 決着（けっちゃく）ngã ngũ.',
      'Bài 1: đoạn văn khoảng 300 ký tự về giá trị bạn coi trọng. Bài 2: bài nghị luận khoảng 550 ký tự “AI có thể phán đoán đạo đức không?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói điều kiện không thể thiếu bằng あっての và なくして; nêu lý do nhấn mạnh bằng ばこそ, ゆえに; nói “mà không…” bằng ことなしに; khen nét đặc sắc bằng ならでは; nêu chuẩn mực bằng たる và phê phán bằng ともあろう. Bài tiếp theo (N1-03): kinh tế và tài chính.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
