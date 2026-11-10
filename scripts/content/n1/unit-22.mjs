import * as content from '../../../content/n1/n1-22.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 101001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-22',
    unitNumber: 22,
    moduleId,
    levelId,
    stamp: '2026-12-17T00:00:00.000Z',
    title: 'Đàm phán kinh doanh',
    titleJp: 'ビジネス交渉',
    description:
      'N1-22: đàm phán, hợp đồng, báo giá, văn phong thương mại và tập quán ra quyết định của doanh nghiệp Nhật; các mẫu kiêm nhiệm, mức độ cực điểm, bất lực và xin lỗi trang trọng: ～を兼ねて, ～ことこの上ない, ～限りだ, ～てはかなわない, ～すべがない, ～ようにも～ない, ～こととて, ～なしに. 150 từ vựng đàm phán kinh doanh, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Đàm phán', 'Văn phong thương mại', 'Nhân tiện'],
    textbook: 'Original LearnJP — N1 business negotiation',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Kiêm nhiệm, cực điểm, bất lực, xin lỗi trang trọng',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-21 và các mẫu ～ついでに, ～極まりない, ～てたまらない, ～ようがない, ～たくても～ない, ～ので, ～ないで, ～抜きで. Mục tiêu: hiểu thư kinh doanh, bài giảng về phong cách đàm phán Nhật, chuyên mục “mang về xem xét” và tiểu luận về cuộc đàm phán tăng giá; nói việc kiêm nhiệm, mức độ cực điểm, cảm xúc mạnh, sự không chịu nổi, bất lực, xin lỗi kèm lý do và điều kiện tất yếu; viết thư xin lỗi kinh doanh và bài nghị luận về lợi ích trước mắt và quan hệ lâu dài. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng đàm phán kinh doanh: chiến thuật (交渉術, 交渉材料, 駆け引き, 腹の探り合い, 切り札, 叩き台, 腹案, 代替案, 言質, 先手, 着地点, 落としどころ), giá và thanh toán (買い叩く, 上乗せ, 据え置き, 掛け率, ボリュームディスカウント, 支払いサイト, 手付金), hợp đồng (瑕疵, 免責, 秘密保持契約, 基本合意, 電子契約, 覚書, 独占契約), kết quả (仕切り直し, 白紙撤回, ゼロ回答, 押し問答, 即決, 二つ返事), văn thư (ご査収, ご検討, ご教示, ご放念, ご一読, 拝受). Cặp dễ nhầm: 御社 / 貴社 / 弊社; 先方 / 当方; 下請け / 元請け; 強気 / 弱腰.',
      '45 chữ mới: 縮 艶 股 匂 玩 蜂 逐 斥 詔 椅 叱 挨 憧 宵 酌 餌 頒 肢 脊 嗣 凄 膝 恣 畝 麺 戴 爽 惰 蛮 旺 冥 壱 瑠 侯 弧 稽 蹴 訃 剥 蓋 畏 附 但 芋 拭. Chú ý cách đọc: 冥利 みょうり, 蓋然性 がいぜんせい, 艶やか あでやか, 玩ぶ もてあそぶ, 頂戴 ちょうだい, 今宵 こよい, 払拭 ふっしょく; 匂, 膝, 畝, 但, 芋 chỉ có âm kun.',
      '8 mục: ～を兼ねて; ～ことこの上ない; ～限りだ; ～てはかなわない; ～すべがない; ～ようにも～ない; ～こととて; ～なしに. So sánh: を兼ねて / ついでに; ことこの上ない (đánh giá) / 極まりない / 限りだ (cảm xúc người nói); てはかなわない / てたまらない; すべがない / ようがない; ようにも～ない / たくても～ない; こととて (xin lỗi trang trọng) / ので; なしに / ないで / 抜きで.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 人件費（じんけんひ）chi phí nhân công; 余地（よち）chỗ, khả năng; 感情的（かんじょうてき）cảm tính; 臨む（のぞむ）đối mặt, tham gia; いきなり đột ngột.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 購買部（こうばいぶ）phòng mua hàng; 価格改定（かかくかいてい）điều chỉnh giá; 別紙（べっし）tài liệu đính kèm; 戸惑う（とまどう）bối rối; 大口（おおぐち）khách lớn; 法務部（ほうむぶ）phòng pháp chế.',
      'Bài 1 là chuyên mục về câu “mang về xem xét”; bài 2 là tiểu luận về cuộc đàm phán tăng giá đầu tiên. Chú giải: 外資系（がいしけい）vốn nước ngoài; 命取り（いのちとり）đòn chí mạng; 逆効果（ぎゃくこうか）phản tác dụng; 簡略化（かんりゃくか）đơn giản hóa; 縫製（ほうせい）may mặc; 本音（ほんね）lời thật lòng.',
      'Bài 1: thư kinh doanh khoảng 300 ký tự xin lỗi đối tác vì giao hàng chậm, văn kính ngữ. Bài 2: bài nghị luận khoảng 550 ký tự “Trong đàm phán kinh doanh, nên coi trọng lợi ích trước mắt hay quan hệ lâu dài?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói kiêm nhiệm bằng を兼ねて; đánh giá cực điểm bằng ことこの上ない; bày tỏ cảm xúc bằng 限りだ; phàn nàn bằng てはかなわない; nói bất lực bằng すべがない và ようにも～ない; xin lỗi kèm lý do bằng こととて; nêu điều kiện tất yếu bằng なしには～ない. Bài tiếp theo (N1-23): văn ngữ và thành ngữ.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
