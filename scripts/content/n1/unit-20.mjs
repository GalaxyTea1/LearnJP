import * as content from '../../../content/n1/n1-20.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 99001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-20',
    unitNumber: 20,
    moduleId,
    levelId,
    stamp: '2026-12-15T00:00:00.000Z',
    title: 'Ẩm thực và nông nghiệp',
    titleJp: '食と農業',
    description:
      'N1-20: nông nghiệp, an ninh lương thực, an toàn thực phẩm và văn hóa ẩm thực; các mẫu xen kẽ, trạng thái, mức tối thiểu và đánh giá: ～つ～つ, ～っぱなし, ～なりとも, ～と同時に, ～にとどまる, ～にしても～にしても, ～が～なら, ～に限る. 150 từ vựng ẩm thực và nông nghiệp, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Nông nghiệp', 'An toàn thực phẩm', 'Vừa… vừa'],
    textbook: 'Original LearnJP — N1 food and agriculture',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Xen kẽ, trạng thái, mức độ, đánh giá',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-19 và các mẫu ～たり～たり, ～たまま, ～でも, ～とともに, ～にすぎない, ～にしろ～にしろ, ～なら, ～に限って. Mục tiêu: hiểu bản tin giá gạo, bài giảng về lãng phí thực phẩm, xã luận về tỷ lệ tự cung lương thực và tiểu luận của người bỏ văn phòng về làm nông; nói hai hành động xen kẽ, việc bỏ dở, mức tối thiểu, hai mặt của sự vật, giới hạn, hai ví dụ, phê phán và lựa chọn tốt nhất; viết về món ăn yêu thích và bài nghị luận về ưu tiên nông sản trong nước. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng ẩm thực và nông nghiệp: trồng trọt (稲作, 水稲, 棚田, 田植え, 作付け, 栽培, 品種改良, 種子, 堆肥, 農薬, 有機農業, 開墾, 耕作放棄地), chăn nuôi và thủy sản (放牧, 飼育, 飼料, 酪農家, 搾乳, 養殖, 漁獲量, 乱獲), chính sách (食料自給率, 食料安全保障, 輸入依存, 減反, 米価, 備蓄米, 六次産業化, スマート農業), an toàn thực phẩm (消費期限, 食品添加物, 産地偽装, 食中毒, トレーサビリティ, 食品ロス). Cặp dễ nhầm: 賞味期限 / 消費期限; 不作 / 凶作 / 豊作; 外食 / 中食 / 孤食; 満潮 / 干潮.',
      '45 chữ mới: 稲 畑 潮 牧 飼 鏡 釣 煮 穫 穂 穀 炊 鉢 餅 硝 墾 謎 匿 爪 鍵 襟 蛍 寡 痢 坑 藍 賊 搾 臼 畔 唄 孔 呂 拷 嬢 翁 牙 謹 瞳 湧 窯 褒 醜 升 枕. Chú ý cách đọc: 稲穂 いなほ, 釣果 ちょうか, 硝子 がらす, 象牙 ぞうげ, 一升瓶 いっしょうびん, 畔 あぜ, 風呂 ふろ, 語呂 ごろ; 畑 chỉ có âm kun.',
      '8 mục: ～つ～つ; ～っぱなし; ～なりとも; ～と同時に; ～にとどまる; ～にしても～にしても; ～が～なら; ～に限る. So sánh: つ～つ (cụm cố định) / たり～たり; っぱなし (thường tiêu cực) / たまま; なりとも (trang trọng) / でも; と同時に / とともに; にとどまる (giới hạn) / にすぎない (nhỏ bé); にしても～にしても / にしろ～にしろ; が～なら / なら; に限る (tốt nhất) / に限って (riêng… lại) / に限らず.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: かがむ cúi người; 手作業（てさぎょう）làm tay; 塩むすび（しおむすび）cơm nắm muối; 取引先（とりひきさき）đối tác; 在庫（ざいこ）tồn kho; 回収（かいしゅう）thu hồi.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 放出（ほうしゅつ）xả ra; 限定的（げんていてき）hạn chế; 供給（きょうきゅう）cung cấp; いわゆる cái gọi là; 見た目（みため）vẻ ngoài; 直売所（ちょくばいじょ）chợ bán trực tiếp.',
      'Bài 1 là xã luận về tỷ lệ tự cung lương thực; bài 2 là tiểu luận của người bỏ văn phòng về làm nông. Chú giải: 賄う（まかなう）tự túc; 平時（へいじ）thời bình; 前提（ぜんてい）tiền đề; 兆し（きざし）dấu hiệu; 休職（きゅうしょく）nghỉ làm; 見違える（みちがえる）khác hẳn; 漬物（つけもの）dưa muối.',
      'Bài 1: đoạn văn khoảng 300 ký tự về một món ăn hoặc nông sản bạn yêu thích và người làm ra nó. Bài 2: bài nghị luận khoảng 550 ký tự “Có nên ưu tiên mua nông sản trong nước dù giá cao hơn hàng nhập khẩu?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói quan hệ qua lại bằng つ～つ; tả việc bỏ dở hay kéo dài bằng っぱなし; nói mức tối thiểu bằng なりとも; nói hai mặt bằng と同時に; nói giới hạn bằng にとどまる; nêu hai ví dụ bằng にしても～にしても; phê phán bằng が～なら; nói lựa chọn tốt nhất bằng に限る. Bài tiếp theo (N1-21): xã hội quốc tế và di cư.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
