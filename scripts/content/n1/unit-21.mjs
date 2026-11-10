import * as content from '../../../content/n1/n1-21.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 100001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-21',
    unitNumber: 21,
    moduleId,
    levelId,
    stamp: '2026-12-16T00:00:00.000Z',
    title: 'Xã hội quốc tế và di cư',
    titleJp: '国際社会と移民',
    description:
      'N1-21: di cư, lao động nước ngoài, tị nạn và chung sống đa văn hóa; các mẫu phản ứng, nhượng bộ, nghĩa vụ và nhận định dè dặt: ～を受けて, ～とて, ～ねばならない, ～ともすれば, ～とばかりは言えない, ～なくはない, ～ところとなる, ～には及ばない. 150 từ vựng xã hội quốc tế và di cư, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Di cư', 'Đa văn hóa', 'Đáng lẽ phải'],
    textbook: 'Original LearnJP — N1 international society and migration',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Phản ứng, nhượng bộ, nghĩa vụ, nhận định dè dặt',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-20 và các mẫu ～によって, ～でも／～ても, ～なければならない, ～がちだ, ～とは限らない, ～ないことはない, ～ようになる, ～ことはない. Mục tiêu: hiểu bản tin về chế độ thay thực tập kỹ năng, bài giảng về định kiến và tiếp xúc, xã luận “đón như người sinh sống” và tiểu luận của người con thuyền nhân; nói phản ứng trước sự kiện, nhượng bộ, nghĩa vụ trang trọng, xu hướng dễ xảy ra, phủ định nhận định một chiều, khẳng định yếu, việc bị công chúng biết và không cần thiết; viết về cảm giác là người ngoài và bài nghị luận về tiếp nhận di dân. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng xã hội quốc tế và di cư: thủ tục (在留カード, 査証, 就労ビザ, 永住権, 帰化, 入管, 入管法, 仮放免, 強制送還, 収容), tị nạn (難民認定, 難民申請, 庇護, 第三国定住, 避難民, ボートピープル), lao động (受け入れ企業, 監理団体, 送り出し機関, 転籍, 失踪, 人身売買, 雇用主), chung sống (同化, 統合, 包摂, 排外主義, ヘイトスピーチ, ステレオタイプ, 異国, 望郷, 郷愁, 草の根, 橋渡し). Cặp dễ nhầm: 移民 / 難民 / 避難民; 永住 / 帰化; 同化 / 統合 / 包摂; 国籍 / 無国籍 / 多国籍.',
      '45 chữ mới: 盟 唐 劾 堕 丼 桟 惧 慕 罷 矯 某 囚 虹 泌 漸 膳 蚊 厄 藻 嫡 呪 斬 串 嚇 凸 韻 霜 箸 勅 棺 儒 斑 摯 愁 楼 眉 薪 堆 褐 賜 繕 栓 芯 蜜 凹. Chú ý cách đọc: 分泌 ぶんぴつ, 嫡子 ちゃくし, 凸凹 でこぼこ, 凹凸 おうとつ, 眉間 みけん, 堆い うずたかい, 桟敷 さじき, 唐辛子 とうがらし; 丼, 虹, 蚊, 串, 箸 chỉ có âm kun.',
      '8 mục: ～を受けて; ～とて; ～ねばならない; ～ともすれば; ～とばかりは言えない; ～なくはない; ～ところとなる; ～には及ばない. So sánh: を受けて / によって; とて / でも・ても; ねばならない (văn viết) / なければならない; ともすれば / がちだ; とばかりは言えない / とは限らない; なくはない / ないことはない; ところとなる / ようになる; には及ばない (không cần / không bằng) / ことはない.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 残業代（ざんぎょうだい）tiền làm thêm; 取り上げる（とりあげる）thu giữ; 法改正（ほうかいせい）sửa luật; 苦情（くじょう）phàn nàn; 町内会（ちょうないかい）hội khu phố; 屋台（やたい）quầy hàng.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 劣悪（れつあく）tồi tệ; 意向（いこう）nguyện vọng; 流出（りゅうしゅつ）chảy ra; 怠け者（なまけもの）kẻ lười; 対等（たいとう）bình đẳng; 迷う（まよう）phân vân.',
      'Bài 1 là xã luận về đón người nước ngoài như người sinh sống; bài 2 là tiểu luận của người con thuyền nhân. Chú giải: 建前（たてまえ）danh nghĩa; 裏腹（うらはら）trái ngược; 耐えかねる（たえかねる）không chịu nổi; 就学（しゅうがく）đi học; からかう trêu chọc; 片言（かたこと）bập bẹ; 口ずさむ（くちずさむ）ngân nga.',
      'Bài 1: đoạn văn khoảng 300 ký tự về một lần bạn cảm thấy mình là “người ngoài” hoặc đã giúp ai đó hòa nhập. Bài 2: bài nghị luận khoảng 550 ký tự “Nhật Bản có nên tích cực tiếp nhận di dân hơn nữa?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói phản ứng trước sự kiện bằng を受けて; nhượng bộ bằng とて; nêu nghĩa vụ trang trọng bằng ねばならない; nói xu hướng dễ xảy ra bằng ともすれば; phủ định nhận định một chiều bằng とばかりは言えない; khẳng định yếu bằng なくはない; nói việc đến tai công chúng bằng ところとなる; trấn an hoặc so sánh bằng には及ばない. Bài tiếp theo (N1-22): đàm phán kinh doanh.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
