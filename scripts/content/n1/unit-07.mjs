import * as content from '../../../content/n1/n1-07.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 86001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-07',
    unitNumber: 7,
    moduleId,
    levelId,
    stamp: '2026-12-02T00:00:00.000Z',
    title: 'Y học và đạo đức sinh học',
    titleJp: '医療と生命倫理',
    description:
      'N1-07: y học hiện đại, cuối đời, hiến tạng, chỉnh sửa gen và đạo đức y khoa; các mẫu về cảm xúc mạnh, giá trị và tác động tất yếu: ～にたえない, ～にたえる, ～に足る, ～にかたくない, ～を禁じ得ない, ～てやまない, ～ずにはおかない, ～ずにはすまない. 150 từ vựng y học và đạo đức sinh học, 46 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Y học hiện đại', 'Đạo đức', 'Không thể chịu nổi'],
    textbook: 'Original LearnJP — N1 medicine and bioethics',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '46 Hán tự mới',
      'Cảm xúc, giá trị, tác động tất yếu',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-06 và các mẫu ～に値する, ～ずにはいられない, ～ざるを得ない, ～やすい. Mục tiêu: hiểu tin tức y tế, bài giảng về chết não và hiến tạng, xã luận về chỉnh sửa gen; diễn đạt cảm xúc mạnh, đánh giá giá trị và điều tất yếu bằng văn phong trang trọng; viết về một người đáng kính trọng và bài nghị luận về an tử. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng y học và đạo đức sinh học: cuối đời (延命治療, 緩和ケア, 尊厳死, 看取り, 事前指示書), hiến tạng (脳死, 臓器提供, ドナー, 遺族), sinh sản (体外受精, 出生前診断, 代理出産, 受精卵), nghiên cứu (臨床試験, 治験, 倫理委員会), chẩn đoán và điều trị (予後, 寛解, 再発, 合併症, 誤診). Cặp dễ nhầm: 安楽死 (chủ động chấm dứt sự sống) / 尊厳死 (không kéo dài sự sống); 臨床試験 / 治験 (thử nghiệm để xin phê duyệt thuốc); 危篤 / 重篤; 治癒 / 寛解.',
      '46 chữ mới: 身 徴 寿 酔 癒 胎 忌 腫 婆 哺 瘍 詳 抵 脅 茂 犠 距 網 竜 繁 翼 茨 潟 敵 魅 嫌 斉 敷 擁 圏 滅 礎 腐 脚 梅 尽 僕 桜 滑 孤 炎 賠 鋼 頑 鎖 摩. Chú ý: 茨, 潟 chỉ có âm kun (茨城 いばらき, 新潟 にいがた); 大抵 たいてい, 機嫌 きげん, 素敵 すてき, 梅雨 つゆ, 脚立 きゃたつ, 一周忌 いっしゅうき.',
      '8 mục: ～にたえない; ～にたえる; ～に足る; ～にかたくない; ～を禁じ得ない; ～てやまない; ～ずにはおかない; ～ずにはすまない. So sánh: 見るにたえない (không chịu nổi) / 感謝にたえない (vô cùng) / にたえる (đáng, chịu được); に足る / に値する, 取るに足らない; にかたくない (想像, 察する); を禁じ得ない / ずにはいられない; てやまない (tình cảm kéo dài); ずにはおかない (tác động tất yếu, ý chí) / ずにはすまない (nghĩa vụ) / ざるを得ない.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 管につながれる（くだにつながれる）bị nối ống dây; 書面（しょめん）văn bản; 計画書（けいかくしょ）bản kế hoạch; 明記（めいき）ghi rõ; 修正版（しゅうせいばん）bản sửa.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 取り違える（とりちがえる）nhầm lẫn; おわびの言葉もない không có lời nào để xin lỗi; 往診（おうしん）khám tại nhà; 頭が下がる（あたまがさがる）nể phục; 最期（さいご）phút cuối đời.',
      'Bài 1 là xã luận về chỉnh sửa gen trên trứng đã thụ tinh; bài 2 là tiểu luận của bác sĩ chăm sóc giảm nhẹ. Chú giải: 歯止め（はどめ）cái phanh; 子孫（しそん）con cháu; 境目（さかいめ）ranh giới; 指針（ししん）hướng dẫn; 立ち会う（たちあう）có mặt; 息を引き取る（いきをひきとる）trút hơi thở cuối; 縁起でもない điềm gở.',
      'Bài 1: đoạn văn khoảng 300 ký tự về một người khiến bạn kính trọng. Bài 2: bài nghị luận khoảng 550 ký tự “Nhật Bản có nên hợp pháp hóa an tử?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: phân biệt hai nghĩa của にたえない và nghĩa ngược にたえる; đánh giá bằng に足る, 取るに足らない; nói điều dễ hình dung bằng 想像にかたくない; bày tỏ cảm xúc bằng を禁じ得ない, てやまない; phân biệt ずにはおかない và ずにはすまない. Bài tiếp theo (N1-08): văn học và phê bình.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
