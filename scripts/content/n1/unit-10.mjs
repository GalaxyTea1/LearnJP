import * as content from '../../../content/n1/n1-10.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 89001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-10',
    unitNumber: 10,
    moduleId,
    levelId,
    stamp: '2026-12-05T00:00:00.000Z',
    title: 'Tâm lý và hành vi',
    titleJp: '心理と行動',
    description:
      'N1-10: tâm lý, cảm xúc, thói quen xấu, nghiện và áp lực đồng thuận; các mẫu về khuynh hướng, kết cục xấu và mức độ cực điểm: ～きらいがある, ～しまつだ, ～が最後, ～たら最後, ～ずくめ, ～まみれ, ～極まる／～極まりない, ～の極み. 150 từ vựng tâm lý và hành vi, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tâm lý', 'Thói quen xấu', 'Rốt cuộc thì'],
    textbook: 'Original LearnJP — N1 psychology and behavior',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Khuynh hướng, kết cục, cực điểm',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-09 và các mẫu ～がちだ, ～傾向がある, ～だらけ, ～たとたん, ～結果になる. Mục tiêu: đọc bình luận về mạng xã hội và tiểu luận về thói trì hoãn, hiểu chương trình radio về tâm lý; nói về khuynh hướng xấu, kết cục tồi tệ, trạng thái “toàn là” và mức độ cực điểm; viết về một thói quen muốn sửa và bài nghị luận về giới hạn điện thoại cho trẻ. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng tâm lý và hành vi: cảm xúc (羨望, 怨恨, 喪失感, 疎外感, 焦燥感, 自己肯定感), tính cách (内向的, 外向的, 優柔不断, 完璧主義, 八方美人, 移り気), nhận thức (認知バイアス, 確証バイアス, 同調圧力, 刷り込み), thói xấu (先延ばし, 怠惰, 悪癖, ずぼら), phản ứng (八つ当たり, 逆ギレ, 逆恨み, 腹いせ). Cặp dễ nhầm: 嫉妬 / 羨望; 内向的 / 外向的; 気晴らし / 憂さ晴らし; 臆病 / 臆する; 冷淡 / 淡々と.',
      '45 chữ mới: 煩 怨 錬 衷 嫉 妬 虞 羨 臆 丘 棟 壌 漫 玄 粘 悟 舗 妊 恩 騰 往 遂 狂 栃 岐 陛 緯 培 衰 艇 屈 径 淡 抽 披 錦 准 奨 浸 剰 胆 繊 駒 虚 悔. Chú ý cách đọc: 煩悩 ぼんのう, 老舗 しにせ, 玄人 くろうと, 虚空 こくう, 直披 じきひ; 栃, 駒, 虞 chỉ có âm kun (栃木 とちぎ, 駒 こま, 虞 おそれ).',
      '8 mục: ～きらいがある; ～しまつだ; ～が最後; ～たら最後; ～ずくめ; ～まみれ; ～極まる／～極まりない; ～の極み. So sánh: きらいがある (khuynh hướng xấu) / がちだ / 傾向がある; しまつだ (kết cục tồi tệ); が最後 (văn viết) / たら最後 (hội thoại) / たとたん; ずくめ (toàn là, trung tính) / だらけ / まみれ (bám đầy thứ bẩn); 極まりない (Aな, nghĩa xấu) / の極み (N, cả tốt lẫn xấu).',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 夢中（むちゅう）say mê; 閉じこもる（とじこもる）nhốt mình; 面談（めんだん）gặp riêng; 却下（きゃっか）bác bỏ; 異動（いどう）điều chuyển; 決めつける（きめつける）kết luận vội.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 限定（げんてい）giới hạn; 一晩置く（ひとばんおく）để qua một đêm; 目立つ（めだつ）nổi bật; 水浸し（みずびたし）ngập nước; 立ち往生（たちおうじょう）mắc kẹt.',
      'Bài 1 là bình luận về so sánh xã hội trên mạng; bài 2 là tiểu luận về thói trì hoãn. Chú giải: 振り回される（ふりまわされる）bị chi phối; 色あせる（いろあせる）phai nhạt; 生身（なまみ）bằng xương bằng thịt; 胸に刺さる（むねにささる）đâm vào lòng; 手をつける bắt tay vào.',
      'Bài 1: đoạn văn khoảng 300 ký tự về một thói quen bạn muốn sửa. Bài 2: bài nghị luận khoảng 550 ký tự “Có nên giới hạn thời gian dùng điện thoại của trẻ?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nhận xét khuynh hướng xấu bằng きらいがある; kể kết cục tồi tệ bằng しまつだ; phân biệt が最後 và たら最後; dùng ずくめ, まみれ, だらけ đúng chỗ; nói mức cực điểm bằng 極まりない và の極み. Bài tiếp theo (N1-11): nghệ thuật truyền thống.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
