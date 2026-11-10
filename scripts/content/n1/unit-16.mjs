import * as content from '../../../content/n1/n1-16.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 95001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-16',
    unitNumber: 16,
    moduleId,
    levelId,
    stamp: '2026-12-11T00:00:00.000Z',
    title: 'Nghệ thuật và cái đẹp',
    titleJp: '芸術と美',
    description:
      'N1-16: hội họa, âm nhạc, bảo tàng, mỹ cảm và giá trị của nghệ thuật; các mẫu nhấn mạnh điều kiện, đánh giá và suy đoán: ～てこそ, ～が～だけに, ～でなくてなんだろう, ～ではなかろうか, ～かいがある／～かいもなく, ～だけましだ, ～に言わせれば, ～ほどのことはない. 150 từ vựng nghệ thuật và cái đẹp, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Hội họa', 'Thẩm mỹ', 'Chính vì'],
    textbook: 'Original LearnJP — N1 art and beauty',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Điều kiện, đánh giá, suy đoán',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-15 và các mẫu ～てはじめて, ～だけに, ～にほかならない, ～のではないか, ～おかげで, ～によると, ～ことはない. Mục tiêu: hiểu tin tức phát hiện bích họa, bài giảng về khoảng trống trong tranh Nhật, bình luận về giá trị nghệ thuật và tiểu luận về kintsugi; nhấn mạnh điều kiện, đánh giá sự đền đáp, tự an ủi, nêu quan điểm người khác; viết về một thứ bạn thấy đẹp và bài nghị luận về ngân sách nghệ thuật. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng nghệ thuật và cái đẹp: hội họa (構図, 遠近法, 筆遣い, 画風, 水彩画, 抽象画, 下絵, 壁画, 絵巻), bảo tàng (常設展, 企画展, 学芸員, 鑑定, 贋作, 真作, 修復, 落札), âm nhạc (交響曲, 協奏曲, 音色, 和音, 即興), mỹ cảm (美意識, 審美眼, 余白, 簡素, 用の美, 民芸, 崇高, 趣深い). Cặp dễ nhầm: 贋作 / 真作; 常設展 / 企画展; 優美 / 華麗 / 優雅; 写実 / 抽象; 芸術性 / 大衆性.',
      '45 chữ mới: 秀 射 華 雅 彩 輝 丹 珠 麗 羅 絹 淑 抹 蚕 諧 渦 紳 枢 鍛 裸 猶 塊 旋 弓 幣 膜 扇 脇 腸 槽 鍋 慈 漬 糾 坪 紺 慌 娯 舌 峡 俸 厘 峰 醸 弔. Chú ý cách đọc: 鍛冶 かじ, 一抹 いちまつ, 舌鼓 したつづみ, 紺碧 こんぺき, 一夜漬け いちやづけ, 団塊 だんかい; 脇, 鍋, 漬, 坪 chỉ có âm kun trong bài.',
      '8 mục: ～てこそ; ～が～だけに; ～でなくてなんだろう; ～ではなかろうか; ～かいがある／～かいもなく; ～だけましだ; ～に言わせれば; ～ほどのことはない. So sánh: てこそ / てはじめて; NがNだけに / だけに; でなくてなんだろう (cảm xúc) / にほかならない; ではなかろうか (văn viết) / のではないか; かいがある (đền đáp) / かいもなく (uổng công) / おかげで; だけましだ / よりはまし; に言わせれば (quan điểm) / によると (nguồn tin); ほどのことはない / ことはない.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 画集（がしゅう）tập tranh; 照明（しょうめい）chiếu sáng; よみがえる sống lại; 入選（にゅうせん）lọt vào vòng trong; 裏を返せば（うらをかえせば）nói ngược lại.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 古墳（こふん）mộ cổ; 宮廷（きゅうてい）cung đình; カビ nấm mốc; 発掘（はっくつ）khai quật; すみずみ từng góc; 値上がり（ねあがり）lên giá.',
      'Bài 1 là bình luận về giá trị của nghệ thuật; bài 2 là tiểu luận về kintsugi. Chú giải: 後回し（あとまわし）để sau; 避難所（ひなんじょ）nơi sơ tán; 愛好家（あいこうか）người yêu thích; 金継ぎ（きんつぎ）kintsugi; 継ぎ目（つぎめ）đường nối; 苔むす（こけむす）phủ rêu; 思い詰める（おもいつめる）nghĩ quẩn.',
      'Bài 1: đoạn văn khoảng 300 ký tự về một thứ bạn thấy đẹp. Bài 2: bài nghị luận khoảng 550 ký tự “Khi tài chính khó khăn, có nên cắt ngân sách nghệ thuật?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nêu điều kiện tất yếu bằng てこそ; nhấn tính chất bằng NがNだけに; khẳng định mạnh bằng でなくてなんだろう; nêu ý kiến dè dặt bằng ではなかろうか; nói đáng công / uổng công bằng かいがある／かいもなく; tự an ủi bằng だけましだ; dẫn quan điểm bằng に言わせれば; khuyên bằng ほどのことはない. Bài tiếp theo (N1-17): lịch sử và ký ức.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
