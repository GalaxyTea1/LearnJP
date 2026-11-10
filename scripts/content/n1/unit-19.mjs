import * as content from '../../../content/n1/n1-19.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 98001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-19',
    unitNumber: 19,
    moduleId,
    levelId,
    stamp: '2026-12-14T00:00:00.000Z',
    title: 'Tôn giáo và tín ngưỡng',
    titleJp: '宗教と信仰',
    description:
      'N1-19: Phật giáo, Thần đạo, nghi lễ và tín ngưỡng trong đời sống người Nhật; các mẫu thể diện, quyết tâm, đánh giá và giả định: ～の手前, ～にかけても, ～にあたらない／～にはあたらない, ～てもさしつかえない, ～をもってすれば, ～ずにおく, ～の限りを尽くす, ～ものとして. 150 từ vựng tôn giáo và tín ngưỡng, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Phật giáo và Thần đạo', 'Nghi lễ', 'Như là'],
    textbook: 'Original LearnJP — N1 religion and faith',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Thể diện, quyết tâm, đánh giá, giả định',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-18 và các mẫu ～以上, ～にかけては, ～ことはない, ～てもかまわない, ～によって, ～ないでおく, ～を尽くす, ～として. Mục tiêu: hiểu thông báo ở chùa, bài giảng về tôn giáo của người Nhật, chuyên mục “người Nhật không tôn giáo?” và tiểu luận của vị trụ trì trẻ; nói vì thể diện, thề vì danh dự, đánh giá điều không đáng, xin phép trang trọng, nói về sức mạnh của phương tiện, cố ý không làm, làm đến tột độ và giả định; viết về một nghi lễ gần gũi và bài nghị luận về giáo dục tôn giáo. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng tôn giáo và tín ngưỡng: Phật giáo (宗派, 経典, お経, 念仏, 輪廻, 極楽, 供養, 法事, 住職, 檀家, 菩薩, 如来, 写経, 精進料理), Thần đạo (神宮, 宮司, 巫女, 氏神, 八百万の神, 神仏習合, 御利益, 賽銭), nghi lễ (儀式, 戒名, 位牌, 仏壇, 神棚, 巡礼, 断食, 戒律, 合掌), xã hội (無宗教, 世俗化, 政教分離, 新興宗教, 勧誘, 霊感商法, 布教, 迫害). Cặp dễ nhầm: 仏壇 / 神棚; 住職 / 宮司 / 神主; 参詣 / 巡礼; 来世 / 現世; お布施 / 寄進 / 賽銭.',
      '45 chữ mới: 宮 忠 斎 僧 猿 坊 崇 刹 詣 叔 雌 堪 叙 酢 吟 逓 袖 甚 妖 闇 岬 癖 愉 捉 礁 屯 姻 擬 塀 唇 睦 閑 幽 曹 卑 侮 鋳 尉 禍 酪 茎 汎 帥 逝 汽. Chú ý cách đọc: 宮司 ぐうじ, 古刹 こさつ, 刹那 せつな, 造詣 ぞうけい, 堪能 たんのう, 叔父 おじ, 叔母 おば, 等閑 とうかん, 逝去 せいきょ.',
      '8 mục: ～の手前; ～にかけても; ～にあたらない／～にはあたらない; ～てもさしつかえない; ～をもってすれば; ～ずにおく; ～の限りを尽くす; ～ものとして. So sánh: の手前 (thể diện) / 以上 (trách nhiệm logic); にかけても (thề lấy danh dự) / にかけては (về mặt); にはあたらない / ことはない; てもさしつかえない (trang trọng) / てもかまわない; をもってすれば / によって; ずにおく / ないでおく / ておく; の限りを尽くす / を尽くす; ものとして (giả định) / として (tư cách).',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: お勤め（おつとめ）buổi lễ tụng kinh; 本堂（ほんどう）chính điện; 師匠（ししょう）sư phụ; 担ぎ手（かつぎて）người khiêng; 神輿（みこし）kiệu thần; 絶やす（たやす）để mai một.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 撮影禁止（さつえいきんし）cấm chụp ảnh; 受付（うけつけ）quầy tiếp tân; 結論づける（けつろんづける）kết luận; 七回忌（ななかいき）giỗ bảy năm; 取り仕切る（とりしきる）lo liệu; 手ぶら（てぶら）tay không; 故人（こじん）người đã khuất.',
      'Bài 1 là chuyên mục về tôn giáo của người Nhật; bài 2 là tiểu luận của vị trụ trì trẻ. Chú giải: 合格祈願（ごうかくきがん）cầu đỗ; 排除（はいじょ）bài trừ; 名残（なごり）dấu vết; 氏子（うじこ）dân thờ thần hộ mệnh; 雨漏り（あまもり）dột; 工面（くめん）xoay xở; 身を寄せる（みをよせる）nương náu; よりどころ chỗ dựa.',
      'Bài 1: đoạn văn khoảng 300 ký tự về một nghi lễ, phong tục hay tín ngưỡng gần gũi với bạn. Bài 2: bài nghị luận khoảng 550 ký tự “Trường học có nên dạy về tôn giáo không?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói vì thể diện bằng の手前; thề vì danh dự bằng にかけても; đánh giá điều không đáng bằng にはあたらない; xin phép trang trọng bằng てもさしつかえない; nói về sức mạnh phương tiện bằng をもってすれば; nói cố ý không làm bằng ずにおく; nói làm đến tột độ bằng の限りを尽くす; giả định bằng ものとして. Bài tiếp theo (N1-20): ẩm thực và nông nghiệp.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
