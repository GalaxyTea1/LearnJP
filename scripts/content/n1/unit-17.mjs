import * as content from '../../../content/n1/n1-17.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 96001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-17',
    unitNumber: 17,
    moduleId,
    levelId,
    stamp: '2026-12-12T00:00:00.000Z',
    title: 'Lịch sử và ký ức',
    titleJp: '歴史と記憶',
    description:
      'N1-17: lịch sử Nhật Bản, chiến tranh, hòa bình và việc truyền lại ký ức; các mẫu gác lại, ngoại lệ, bất chấp và tiếc nuối: ～はさておき, ～はいざしらず, ～ばかりは, ～べくもない, ～をかえりみず, ～をおして, ～ようものなら, ～ものを. 150 từ vựng lịch sử và ký ức, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Lịch sử Nhật Bản', 'Chiến tranh và hòa bình', 'Không cần nói'],
    textbook: 'Original LearnJP — N1 history and memory',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Gác lại, ngoại lệ, bất chấp, tiếc nuối',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-16 và các mẫu ～は別として, ～ならともかく, ～だけは, ～ようがない, ～をものともせず, ～たら, ～のに. Mục tiêu: hiểu bản tin lễ tưởng niệm, bài giảng về sử liệu, xã luận 80 năm sau chiến tranh và tiểu luận về cuốn nhật ký của ông; gác chuyện sang bên, nêu ngoại lệ, khẳng định điều không thể, nói về sự dũng cảm và tiếc nuối; viết về một câu chuyện lịch sử trong gia đình và bài nghị luận về AI kể chuyện chiến tranh. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng lịch sử và ký ức: thời đại (古代, 中世, 近世, 近現代, 縄文時代, 戦国時代, 昭和, 元号), sử học (史実, 史料, 古文書, 公文書, 年表, 考古学, 出土), chiến tranh (空襲, 疎開, 原爆, 被爆者, 戦没者, 占領, 降伏, 捕虜, 焼け野原, 闇市, 配給), ký ức (語り部, 語り継ぐ, 風化, 忘却, 集団的記憶, 負の遺産, 慰霊碑, 追悼式, 黙祷, 鎮魂). Cặp dễ nhầm: 終戦 / 敗戦; 戦前 / 戦後 / 戦時中; 記念碑 / 慰霊碑 / 石碑; 加害 / 被害; 史料 / 資料.',
      '45 chữ mới: 闘 避 紀 陣 誠 陥 墓 艦 鑑 諭 鎮 陵 碑 墳 侍 乙 汁 尼 衡 薫 瓦 猟 羊 閲 偵 喝 敢 酵 憤 豚 遮 扉 硫 赦 挫 窃 泡 又 慨 紡 恨 肪 扶 戯 奔. Chú ý cách đọc: 豚汁 とんじる, 硫黄 いおう, 乙女 おとめ, 尼寺 あまでら, 瓦礫 がれき, 門扉 もんぴ, 出奔 しゅっぽん; 又 chỉ có âm kun trong bài.',
      '8 mục: ～はさておき; ～はいざしらず; ～ばかりは; ～べくもない; ～をかえりみず; ～をおして; ～ようものなら; ～ものを. So sánh: はさておき / は別として; はいざしらず / ならともかく; ばかりは / だけは; べくもない (văn viết) / ようがない; をかえりみず (không màng nguy hiểm) / をおして (vượt trở ngại cụ thể) / をものともせず; ようものなら (hậu quả nặng) / たら; ものを (tiếc nuối) / のに.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 防空壕（ぼうくうごう）hầm trú ẩn; 口を閉ざす（くちをとざす）im lặng; 寄贈（きぞう）hiến tặng; 保存処理（ほぞんしょり）xử lý bảo quản; 存命（ぞんめい）còn sống.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 遺族（いぞく）thân nhân người mất; 参列（さんれつ）tham dự; 真偽（しんぎ）thật giả; 一次史料（いちじしりょう）sử liệu gốc; 悔やむ（くやむ）day dứt.',
      'Bài 1 là xã luận 80 năm sau chiến tranh; bài 2 là tiểu luận về cuốn nhật ký của ông. Chú giải: 統制（とうせい）kiểm soát; 和解（わかい）hòa giải; 戦跡（せんせき）di tích chiến tranh; 押し入れ（おしいれ）tủ âm tường; 力尽きる（ちからつきる）kiệt sức; 町工場（まちこうば）xưởng nhỏ; 沈黙（ちんもく）im lặng.',
      'Bài 1: đoạn văn khoảng 300 ký tự về một câu chuyện lịch sử trong gia đình. Bài 2: bài nghị luận khoảng 550 ký tự “Có nên dùng AI tái hiện lời kể của người trải qua chiến tranh để giáo dục?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: chuyển chủ đề bằng はさておき; nêu trường hợp đặc biệt bằng はいざしらず; nói ngoại lệ bằng ばかりは; khẳng định điều không thể bằng べくもない; khen sự dũng cảm bằng をかえりみず; nói vượt trở ngại bằng をおして; cảnh báo hậu quả bằng ようものなら; bày tỏ tiếc nuối bằng ものを. Bài tiếp theo (N1-18): thiên nhiên và thảm họa.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
