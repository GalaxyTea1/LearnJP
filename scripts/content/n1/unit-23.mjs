import * as content from '../../../content/n1/n1-23.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 102001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-23',
    unitNumber: 23,
    moduleId,
    levelId,
    stamp: '2026-12-18T00:00:00.000Z',
    title: 'Văn ngữ và thành ngữ',
    titleJp: '文語と慣用表現',
    description:
      'N1-23: văn ngữ còn sống trong tiếng Nhật hiện đại, thành ngữ bốn chữ, điển tích và tục ngữ; các mẫu văn ngữ: ～べし, ～ごとし, ～ざる, ～ずして, ～ぬ（否定）, ～たり（文語の断定）, ～なかれ, ～んとする. 150 từ vựng văn ngữ và thành ngữ, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Văn ngữ cổ', 'Thành ngữ bốn chữ', 'Cách nói cố định'],
    textbook: 'Original LearnJP — N1 classical forms and idioms',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Văn ngữ trong tiếng Nhật hiện đại',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-22 và các mẫu ～べきだ, ～ようだ／～ように, ～ない + N, ～ずに, ～ざるを得ない, ～である, ～な（cấm）, ～ようとする. Mục tiêu: hiểu bản tin triển lãm cổ văn, bài giảng về thành ngữ điển tích, chuyên mục “văn ngữ sống trong chúng ta” và tiểu luận “chữ Hán là cây cầu”; nhận ra và dùng các dạng văn ngữ trên biển báo, tiêu đề, cách ngôn; viết về câu thành ngữ yêu thích và bài nghị luận về dạy cổ văn. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng văn ngữ và thành ngữ: ngôn ngữ (古文, 漢文, 訓読, 書き下し文, 擬古文, 候文, 雅語, 枕詞, 格言, 金言, 箴言, 故事成語, 典拠), thành ngữ bốn chữ (諸行無常, 栄枯盛衰, 臨機応変, 起死回生, 馬耳東風, 我田引水, 付和雷同, 大器晩成, 五里霧中, 千載一遇, 朝令暮改, 一網打尽, 一触即発, 竜頭蛇尾, 弱肉強食, 捲土重来), tục ngữ và quán dụng ngữ (覆水盆に返らず, 石の上にも三年, 情けは人のためならず, 急がば回れ, 他山の石, 井の中の蛙, 舌を巻く, 肝に銘じる, 二の足を踏む). Cặp dễ nhầm: 情けは人のためならず (thương người là thương mình, không phải “đừng giúp”); 千載一遇 / 一期一会; 格言 / 金言 / 箴言.',
      '45 chữ mới: 漠 貼 倣 煎 緻 罵 乞 倹 嗅 蔑 繭 巾 斤 勾 且 旦 氾 丙 弐 吏 汰 肘 冶 沃 弄 宛 苛 采 拉 咽 拶 勃 昧 侶 酎 桁 捗 朕 耗 崖 萎 淫 舷 梗 戚. Chú ý cách đọc: 貼付 ちょうふ, 進捗 しんちょく, 捗る はかどる, 雑巾 ぞうきん, 元旦 がんたん, 三昧 ざんまい, 陶冶 とうや, 右舷 うげん; 乞, 且, 肘, 宛, 桁 chỉ có âm kun.',
      '8 mục: ～べし; ～ごとし; ～ざる; ～ずして; ～ぬ（否定）; ～たり（文語の断定）; ～なかれ; ～んとする. So sánh: べし / べからず (cấm) / べきだ; ごとし・ごとく・ごとき / ようだ; ざる + N / ない + N; ずして / ずに; ぬ / ない; たる + N (là) / たり～たり (liệt kê); なかれ (khuyên răn) / べからず (quy tắc); んとする / ようとする.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 看板（かんばん）biển; 駆け込み乗車（かけこみじょうしゃ）lao vào tàu; 標語（ひょうご）khẩu hiệu; 名残（なごり）dấu vết; 開所式（かいしょしき）lễ khai trương; 門出（かどで）khởi đầu.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 目玉（めだま）điểm nhấn; 来場者（らいじょうしゃ）khách tham quan; よみがえる sống lại; 兵法書（へいほうしょ）binh thư; 矛（ほこ）giáo; 盾（たて）khiên; 懐中電灯（かいちゅうでんとう）đèn pin.',
      'Bài 1 là chuyên mục “văn ngữ sống trong chúng ta”; bài 2 là tiểu luận “chữ Hán là cây cầu”. Chú giải: 打ち消し（うちけし）phủ định; 有無を言わせない（うむをいわせない）không cho phản bác; 宝庫（ほうこ）kho báu; 凝縮（ぎょうしゅく）cô đọng; 歌人（かじん）thi sĩ waka; 切実（せつじつ）khẩn thiết; 透ける（すける）thấp thoáng.',
      'Bài 1: đoạn văn khoảng 300 ký tự về một câu thành ngữ, tục ngữ hay cách ngôn bạn yêu thích. Bài 2: bài nghị luận khoảng 550 ký tự “Trường cấp ba có cần dạy cổ văn và Hán văn không?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: đọc hiểu biển báo べからず và khẩu hiệu べし; dùng ごとく／ごとき trong văn viết; nhận ra phủ định văn ngữ ざる và ぬ; nói “không… mà” bằng ずして; nói “đã là… thì” bằng たる者; khuyên răn bằng なかれ; diễn tả việc sắp xảy ra bằng んとする. Bài tiếp theo (N1-24): ôn tập tổng hợp N1.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
