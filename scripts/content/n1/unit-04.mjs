import * as content from '../../../content/n1/n1-04.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 83001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-04',
    unitNumber: 4,
    moduleId,
    levelId,
    stamp: '2026-11-29T00:00:00.000Z',
    title: 'Chính trị và ngoại giao',
    titleJp: '政治と外交',
    description:
      'N1-04: quốc hội, bầu cử, nội các và ngoại giao; các mẫu về hoàn cảnh, cương vị và mốc thời gian: ～にあって, ～ともなると, ～ともなれば, ～ともなく／ともなしに, ～にして, ～を限りに, ～に先駆けて, ～をおいて. 150 từ vựng chính trị, ngoại giao, 46 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Quốc hội', 'Ngoại giao', 'Ở cương vị'],
    textbook: 'Original LearnJP — N1 politics and diplomacy',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '46 Hán tự mới',
      'Hoàn cảnh, cương vị, mốc thời gian',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-03 và các mẫu N2 ～において, ～となると, ～に先立って, ～をもって. Mục tiêu: hiểu tin tức chính trị, bầu cử và ngoại giao; nói về hoàn cảnh đặc biệt, cương vị, mốc khởi đầu và kết thúc; viết về bầu cử và bài nghị luận về tuổi ứng cử. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng chính trị và ngoại giao: quốc hội (衆議院, 参議院, 審議, 可決, 議席), nội các (閣議, 組閣, 退陣, 続投), bầu cử (公約, 遊説, 無党派層, 出口調査), hoàng gia (皇室, 即位, 象徴), ngoại giao (国交, 批准, 共同声明, 歴訪, 国賓), xung đột và đàm phán (主権, 侵略, 制裁, 膠着, 打開, 妥結, 決裂). Cặp dễ nhầm: 妥協 / 妥結 (thỏa hiệp / đạt thỏa thuận); 調停 / 仲介 (hòa giải chính thức / làm trung gian); 侵略 / 侵害 (xâm lược lãnh thổ / xâm phạm quyền lợi).',
      '46 chữ mới: 皇 旗 帝 廷 呉 謁 璽 沖 緩 需 購 揮 充 鹿 却 端 獲 併 徹 貴 埼 衝 焦 奪 浦 析 譲 称 納 樹 挑 誘 紛 至 慎 控 握 俊 銭 渋 銃 操 託 撮 誕 侵. Chú ý cách đọc đặc biệt: 発端 ほったん, 納得 なっとく, 津々浦々 つつうらうら, 小銭 こぜに, 謁見 えっけん, 埼玉 さいたま.',
      '8 mục: ～にあって; ～ともなると; ～ともなれば; ～ともなく／～ともなしに; ～にして; ～を限りに; ～に先駆けて; ～をおいて. So sánh: にあって / において; ともなると (thực tế chung) / ともなれば (giả định, văn viết) / となると; ともなく (lơ đãng) và どこからともなく (không rõ từ đâu); にして (mới đến, ngay cả, vừa là); を限りに / をもって; に先駆けて / に先立って; をおいて / 以外に.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 一変（いっぺん）thay đổi hẳn; 往復（おうふく）đi về; 席順（せきじゅん）thứ tự chỗ ngồi; 先方（せんぽう）phía bên kia; 署名（しょめい）ký tên.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 盛り込む（もりこむ）đưa vào (nội dung); 人材育成（じんざいいくせい）đào tạo nhân lực; 優越（ゆうえつ）ưu thế; 政見放送（せいけんほうそう）chương trình phát biểu chính kiến.',
      'Bài 1 là xã luận về tỉ lệ đi bầu của người trẻ; bài 2 là hồi ký của một nhà ngoại giao. Chú giải: 足を運ぶ（あしをはこぶ）đến tận nơi; 住民票（じゅうみんひょう）phiếu cư trú; 主権者（しゅけんしゃ）người làm chủ; 地道（じみち）bền bỉ; 在留邦人（ざいりゅうほうじん）kiều bào Nhật; 安堵（あんど）nhẹ nhõm; 草の根（くさのね）cơ sở, gốc rễ.',
      'Bài 1: đoạn văn khoảng 300 ký tự về bạn và bầu cử. Bài 2: bài nghị luận khoảng 550 ký tự “có nên hạ tuổi ứng cử xuống 18?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói về hoàn cảnh đặc biệt bằng にあって; nói “đã đến mức đó thì” bằng ともなると và ともなれば; kể việc làm lơ đãng bằng ともなく; dùng にして cho mốc và tư cách; tuyên bố dừng một việc bằng を限りに; nói về việc đi đầu bằng に先駆けて; khen “ngoài… ra không ai” bằng をおいて. Bài tiếp theo (N1-05): pháp luật và công lý.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
