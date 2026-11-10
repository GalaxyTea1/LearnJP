import * as content from '../../../content/n1/n1-11.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 90001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-11',
    unitNumber: 11,
    moduleId,
    levelId,
    stamp: '2026-12-06T00:00:00.000Z',
    title: 'Nghệ thuật truyền thống',
    titleJp: '伝統芸能',
    description:
      'N1-11: Noh, Kabuki, Bunraku, trà đạo, mỹ nghệ và nghệ nhân; các mẫu về cảm xúc trang trọng, bất chấp, so sánh và lựa chọn: ～の至り, ～をものともせず, ～をよそに, ～にもまして, ～にひきかえ, ～なりに, ～なり～なり, ～であれ～であれ. 150 từ vựng nghệ thuật truyền thống, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Kịch Noh, Kabuki', 'Nghệ nhân', 'Đúng là'],
    textbook: 'Original LearnJP — N1 traditional arts',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Bất chấp, so sánh, lựa chọn',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-10 và các mẫu ～にもかかわらず, ～に構わず, ～より, ～に対して, ～か～か, ～の極み. Mục tiêu: đọc bình luận về tương lai nghệ thuật truyền thống và phóng sự về nghệ nhân rèn kiếm; dùng lời lẽ trang trọng, nói về sự bất chấp, phớt lờ, so sánh trái ngược và gợi ý lựa chọn; viết về trải nghiệm văn hóa và bài nghị luận về đổi mới truyền thống. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng nghệ thuật truyền thống: sân khấu (能楽, 文楽, 雅楽, 演目, 見せ場, 花道, 女形, 隈取), truyền nghề (家元, 流派, 弟子入り, 襲名, 名跡, 一子相伝, 口伝, 秘伝), mỹ nghệ (漆器, 蒔絵, 金箔, 屏風, 陶磁器, 刀剣, 刀匠), mỹ cảm (幽玄, わび・さび, 風情, 様式美, 気品). Cặp dễ nhầm: 修業 (học nghề) / 修行 (tu hành); 名人 / 巨匠 / 匠; 古典 / 新作; 型 / 型破り; 十八番 (おはこ) / お家芸.',
      '45 chữ mới: 条 聖 剣 克 銘 熟 壇 巧 匠 刃 刀 鼓 款 挿 笛 漆 伎 箇 惨 虐 翻 墜 据 肥 徐 糖 搭 盾 脈 滝 軌 俵 妨 擦 鯨 荘 諾 雷 漂 懐 勘 栽 拐 駄 添. Chú ý cách đọc: 漆黒 しっこく, 後ろ盾 うしろだて, 常軌 じょうき, 落款 らっかん, 惨敗 ざんぱい, 下駄 げた; 滝 và 据 chỉ có âm kun trong bài.',
      '8 mục: ～の至り; ～をものともせず; ～をよそに; ～にもまして; ～にひきかえ; ～なりに; ～なり～なり; ～であれ～であれ. So sánh: の至り (trang trọng, khiêm nhường) / の極み; をものともせず (vượt khó, khen) / をよそに (phớt lờ người khác) / にもかかわらず; にもまして / より; にひきかえ (có đánh giá) / に対して; なりに (theo cách riêng) / なり (vừa… liền) / なり～なり (hoặc… hoặc); であれ～であれ / にしても～にしても.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 初舞台（はつぶたい）lần đầu lên sân khấu; 稽古をつける（けいこをつける）dạy luyện tập; 心を打たれる（こころをうたれる）xúc động; むら chỗ loang; 湿度（しつど）độ ẩm.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 見入る（みいる）chăm chú nhìn; 装束（しょうぞく）trang phục; 間近（まぢか）tận mắt, gần; 正座（せいざ）ngồi quỳ; しびれ tê; 体験（たいけん）trải nghiệm.',
      'Bài 1 là bình luận về tương lai nghệ thuật truyền thống; bài 2 là phóng sự về một thợ rèn kiếm. Chú giải: 足十年、左十年 mười năm chân, mười năm tay trái; 庶民（しょみん）thường dân; 鍛冶場（かじば）lò rèn; 砂鉄（さてつ）cát sắt; 一振り（ひとふり）một thanh kiếm; 途絶える（とだえる）đứt đoạn.',
      'Bài 1: đoạn văn khoảng 300 ký tự về một trải nghiệm văn hóa truyền thống. Bài 2: bài nghị luận khoảng 550 ký tự “Nghệ thuật truyền thống có nên thay đổi để thu hút người trẻ?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: cảm ơn trang trọng bằng 光栄の至り; phân biệt をものともせず và をよそに; so sánh bằng にもまして, にひきかえ; nói “theo cách riêng” bằng なりに; gợi ý bằng なり～なり; nói “dù A hay B” bằng であれ～であれ. Bài tiếp theo (N1-12): đô thị và dân số.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
