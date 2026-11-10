import * as content from '../../../content/n1/n1-12.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 91001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-12',
    unitNumber: 12,
    moduleId,
    levelId,
    stamp: '2026-12-07T00:00:00.000Z',
    title: 'Đô thị và dân số',
    titleJp: '都市と人口',
    description:
      'N1-12: đô thị hóa, giảm dân số, thôn xóm thưa dân, quy hoạch và đời sống địa phương; các mẫu nhấn mạnh cực đoan, phạm vi và căn cứ: ～すら, ～だに, ～たりとも, ～に至るまで, ～に至って／～に至っては, ～からいって, ～にしたところで, ～とも. 150 từ vựng đô thị và dân số, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Đô thị hóa', 'Già hóa', 'Đến cả… cũng'],
    textbook: 'Original LearnJP — N1 cities and population',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Nhấn mạnh, phạm vi, căn cứ',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-11 và các mẫu ～さえ, ～だけで, ～も (一日も), ～まで, ～から見て, ～にしても, ～ても. Mục tiêu: hiểu tin tức điều tra dân số, bài giảng về thành phố nén, xã luận và phóng sự về thôn xóm thưa dân; nhấn mạnh ví dụ cực đoan, phạm vi và thời điểm muộn màng; viết về quê hương thay đổi và bài nghị luận về dồn dân về trung tâm. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng đô thị và dân số: dân số (人口動態, 自然減, 社会減, 生産年齢人口, 未婚率, 出生数), địa phương (中山間地域, 集落, 廃村, 統廃合, 地域格差, 関係人口, 移住者, 定住), đô thị (再開発, 区画整理, 景観, ドーナツ化現象, 都心回帰, ヒートアイランド), giao thông và đời sống (買い物弱者, 交通弱者, 免許返納, 乗り合いタクシー, 見守り, 独居). Cặp dễ nhầm: 転入 / 転出; 自然減 / 社会減; 持ち家 / 賃貸; 下町 / 山の手; 郷里 / 郷土.',
      '45 chữ mới: 街 郡 津 郷 里 丁 阜 郭 畿 冠 斜 浪 亜 覧 詐 勲 酬 紫 紋 卸 奮 逸 拓 眼 尚 彫 穏 顕 矛 垣 欺 粧 葛 粛 愚 遭 架 鬼 庶 稚 滋 幻 姫 誓 把. Chú ý cách đọc: 興味津々 きょうみしんしん, 浪人 ろうにん, 垣間見る かいまみる, 眼鏡 めがね, 尚更 なおさら, 岐阜 ぎふ; 卸, 垣, 姫 chỉ có âm kun trong bài.',
      '8 mục: ～すら; ～だに; ～たりとも; ～に至るまで; ～に至って／～に至っては; ～からいって; ～にしたところで; ～とも. So sánh: すら / さえ (さえ～ば); だに (想像するだに, 夢にだに) / だけで; たりとも (一 + từ đếm) / も; に至るまで (phạm vi) / に至って (đến mức đó mới) / に至っては (ví dụ cực đoan); からいって / から見て; にしたところで / にしても; ようとも / ても.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 児童（じどう）học sinh tiểu học; 役場（やくば）ủy ban xã; 実家（じっか）nhà bố mẹ; 行き届く（いきとどく）quan tâm chu đáo; 解放（かいほう）giải thoát.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 速報値（そくほうち）số liệu sơ bộ; 道府県（どうふけん）các tỉnh; 商業施設（しょうぎょうしせつ）cơ sở thương mại; 住み慣れる（すみなれる）sống quen; 駄菓子屋（だがしや）tiệm kẹo; 改装（かいそう）sửa sang.',
      'Bài 1 là xã luận về tương lai thôn xóm nhỏ; bài 2 là phóng sự một ngày ở thôn mười hộ. Chú giải: 無人（むじん）không người; たたむ giải thể, dẹp; 先祖代々（せんぞだいだい）ông cha nhiều đời; 拠点（きょてん）cứ điểm; 他人事（ひとごと）chuyện người khác; 通院（つういん）đi khám; 務め（つとめ）bổn phận.',
      'Bài 1: đoạn văn khoảng 300 ký tự về sự thay đổi của quê hương bạn. Bài 2: bài nghị luận khoảng 550 ký tự “Có nên khuyến khích cư dân làng hẻo lánh chuyển về trung tâm?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nhấn ví dụ cực đoan bằng すら, だに; nói “dù một… cũng không” bằng たりとも; nêu phạm vi bằng に至るまで; phân biệt に至って và に至っては; phán đoán bằng からいって; bênh vực bằng にしたところで; nói ý chí bằng ようとも. Bài tiếp theo (N1-13): lao động và việc làm.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
