import * as content from '../../../content/n1/n1-09.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 88001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-09',
    unitNumber: 9,
    moduleId,
    levelId,
    stamp: '2026-12-04T00:00:00.000Z',
    title: 'Ngôn ngữ học',
    titleJp: '言葉と言語学',
    description:
      'N1-09: ngôn ngữ, chữ viết, phương ngữ, kính ngữ, dịch thuật và sự thay đổi của ngôn ngữ; các mẫu nêu chủ đề, cảm thán và đánh giá: ～ときたら, ～といったらない, ～といい～といい, ～というところだ／～といったところだ, ～とあって, ～とあれば, ～と思いきや, ～とは. 150 từ vựng ngôn ngữ học, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Ngôn ngữ', 'Cách diễn đạt', 'Nói đến… thì'],
    textbook: 'Original LearnJP — N1 language and linguistics',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Nêu chủ đề, cảm thán, đánh giá',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-08 và các mẫu ～といえば, ～くらい, ～ので, ～と思ったら, ～なんて, ～というのは. Mục tiêu: đọc bình luận và tiểu luận về ngôn ngữ, hiểu tin tức về từ thịnh hành; dùng các mẫu hội thoại giàu cảm xúc và mẫu văn viết về hoàn cảnh, giả định; viết về một từ yêu thích và bài nghị luận về học ngoại ngữ thời dịch máy. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng ngôn ngữ học: âm thanh (音韻, 濁音, 清音, アクセント), từ vựng (語源, 和語, 漢語, 造語, 死語, 擬音語, 擬態語), chữ viết (表意文字, 送り仮名, 当て字, 筆順, 部首, 国字), giao tiếp (言外, 含み, 婉曲, あいづち, 饒舌, 寡黙), dịch thuật (意訳, 直訳, 訳語, 同時通訳). Cặp dễ nhầm: 意訳 / 直訳; 和語 / 漢語 / 外来語; 擬音語 (tượng thanh) / 擬態語 (tượng hình); 話し手 / 聞き手; 寡黙 / 饒舌.',
      '45 chữ mới: 弁 甲 句 潜 濁 喉 箋 倫 陳 憶 梨 拘 黙 須 偏 遇 諮 卓 亀 糧 炉 殊 殖 輩 穴 奇 慢 鶴 謀 拍 朗 丈 覆 胞 隔 浄 没 暇 肺 貞 陰 随 烈 尋 啓. Chú ý cách đọc: 甲高い かんだかい, 拍子 ひょうし, 謀反 むほん, 囲炉裏 いろり, 背丈 せたけ, 大丈夫 だいじょうぶ, お陰 おかげ.',
      '8 mục: ～ときたら; ～といったらない; ～といい～といい; ～というところだ／～といったところだ; ～とあって; ～とあれば; ～と思いきや; ～とは. So sánh: ときたら (phàn nàn, thân mật) / といえば; といったらない / 極まりない; といい～といい (đánh giá) / も～も; といったところだ (cùng lắm tầm) / くらいだ; とあって (thực tế) / とあれば (giả định, sẵn sàng); と思いきや / と思ったら; とは (cảm thán, định nghĩa) / なんて / というのは.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 眉をひそめる（まゆをひそめる）cau mày; 前向きに検討する（まえむきにけんとうする）xem xét tích cực; 首脳会談（しゅのうかいだん）hội nghị thượng đỉnh; 調子（ちょうし）giọng điệu.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 大賞（たいしょう）giải lớn; 詰めかける（つめかける）kéo đến đông; 嘆く（なげく）than thở; 罰を受ける（ばつをうける）bị phạt; 日常会話（にちじょうかいわ）hội thoại hằng ngày.',
      'Bài 1 là bình luận về “sự lộn xộn” của tiếng Nhật; bài 2 là tiểu luận của một giáo viên tiếng Nhật người Việt. Chú giải: ら抜き言葉 cách nói bỏ ら (見れる); 耳障り（みみざわり）chướng tai; 定着（ていちゃく）bám rễ; 切り捨てる（きりすてる）gạt bỏ; 長雨（ながあめ）mưa dầm; 戸惑う（とまどう）bối rối.',
      'Bài 1: đoạn văn khoảng 300 ký tự giới thiệu một từ bạn yêu thích. Bài 2: bài nghị luận khoảng 550 ký tự “Khi dịch máy phát triển, có còn cần học ngoại ngữ?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: phàn nàn bằng ときたら; bày tỏ cảm xúc cực độ bằng といったらない; đánh giá bằng AといいBといい; ước lượng bằng といったところだ; phân biệt とあって và とあれば; nói điều trái dự đoán bằng と思いきや; dùng とは cho cảm thán và định nghĩa. Bài tiếp theo (N1-10): tâm lý và hành vi.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
