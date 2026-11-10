import * as content from '../../../content/n1/n1-06.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 85001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-06',
    unitNumber: 6,
    moduleId,
    levelId,
    stamp: '2026-12-01T00:00:00.000Z',
    title: 'Khoa học tiên phong',
    titleJp: '科学技術の最前線',
    description:
      'N1-06: nghiên cứu mũi nhọn, vũ trụ, vật lý, sinh học và đạo đức nghiên cứu; các mẫu “không chỉ… mà”, nhấn mạnh và quá trình: ～にとどまらず, ～はおろか, ～もさることながら, ～ひとり～のみならず, ～ただ～のみ, ～と相まって, ～を経て, ～からある. 150 từ vựng khoa học công nghệ, 46 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Nghiên cứu mũi nhọn', 'Vũ trụ', 'Không chỉ… mà'],
    textbook: 'Original LearnJP — N1 science and technology',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '46 Hán tự mới',
      'Không chỉ… mà, nhấn mạnh, quá trình',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-05 và các mẫu ～だけでなく, ～どころか, ～のみならず, ～はもちろん, ～とともに, ～を通して. Mục tiêu: hiểu tin tức và bài giảng khoa học (vũ trụ, lượng tử, y học tái tạo), đọc xã luận về chính sách nghiên cứu; nói về phạm vi lan rộng, điều hiển nhiên và hiệu quả cộng hưởng; viết về công nghệ tương lai và bài nghị luận về phát triển vũ trụ. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng khoa học công nghệ: nghiên cứu (応用研究, 実証, 再現性, 研究不正, 産学連携), vũ trụ (探査, 軌道, 惑星, 銀河, 光年, 大気圏, 帰還), vật lý và hóa học (原子核, 素粒子, 結晶, 触媒, 波長, 元素), sinh học (ゲノム編集, 万能細胞, 再生医療, 培養, 突然変異), máy tính (機械学習, 量子, 演算). Cặp dễ nhầm: 解明 (làm sáng tỏ cơ chế) / 究明 (truy cứu nguyên nhân sự cố); 公転 / 自転; 探査 / 探索 / 模索; 偽装 / 改ざん.',
      '46 chữ mới: 創 宙 倉 概 寛 欄 晶 飢 眺 餓 遍 隠 杉 釈 己 妥 威 豪 熊 滞 微 隆 暫 肝 喚 沿 妙 唱 索 襲 俳 麻 剤 瀬 貫 仙 慰 序 旬 兼 旨 即 柳 舎 偽 覇. Chú ý: 杉, 熊, 瀬 chỉ có âm kun trong bài; 田舎 いなか, 餓鬼 がき, 瀬戸際 せとぎわ, 川柳 せんりゅう, 暫く しばらく.',
      '8 mục: ～にとどまらず; ～はおろか; ～もさることながら; ～ひとり～のみならず; ～ただ～のみ; ～と相まって; ～を経て; ～からある. So sánh: にとどまらず (lan rộng) / にとどまる (dừng ở mức đó); はおろか / どころか (không dùng với mời, lệnh); もさることながら (trọng tâm ở vế sau) / はもちろん; ひとり～のみならず / のみならず; ただ～のみ / だけ; と相まって (cộng hưởng) / とともに; を経て / を通して; からある (trọng lượng, chiều dài) / からする (giá) / からの (người).',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 予想（よそう）dự đoán; 焦る（あせる）sốt ruột; 積み重ねる（つみかさねる）tích lũy; 一般（いっぱん）người bình thường; 申し込む（もうしこむ）đăng ký.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 採取（さいしゅ）lấy mẫu; 起源（きげん）nguồn gốc; 回収（かいしゅう）thu hồi; 従来（じゅうらい）truyền thống, từ trước; 渋滞（じゅうたい）tắc đường; 共同研究者（きょうどうけんきゅうしゃ）đồng tác giả.',
      'Bài 1 là xã luận về đầu tư cho nghiên cứu cơ bản; bài 2 là tiểu luận của một nhà thiên văn. Chú giải: 研究力（けんきゅうりょく）năng lực nghiên cứu; 博士号（はくしごう）bằng tiến sĩ; 打ち込む（うちこむ）dốc sức; 天の川（あまのがわ）dải Ngân Hà; 暦（こよみ）lịch; かけがえのない không gì thay thế.',
      'Bài 1: đoạn văn khoảng 300 ký tự về một công nghệ bạn mong đợi. Bài 2: bài nghị luận khoảng 550 ký tự “có nên dùng nhiều tiền thuế cho phát triển vũ trụ?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói phạm vi lan rộng bằng にとどまらず và ひとり～のみならず; dùng はおろか cho điều hiển nhiên; khen với もさることながら; bày tỏ quyết tâm bằng ただ～のみ; nói hai yếu tố cộng hưởng bằng と相まって; kể quá trình bằng を経て; nhấn mạnh số lượng lớn bằng からある／からする. Bài tiếp theo (N1-07): y học và đạo đức sinh học.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
