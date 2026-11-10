import * as content from '../../../content/n1/n1-13.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 92001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-13',
    unitNumber: 13,
    moduleId,
    levelId,
    stamp: '2026-12-08T00:00:00.000Z',
    title: 'Lao động và việc làm',
    titleJp: '労働と雇用',
    description:
      'N1-13: tuyển dụng, điều kiện lao động, cải cách cách làm việc và lao động nước ngoài; các mẫu nhượng bộ và khả năng: ～たところで, ～ところで（逆接）, ～であれ, ～といえども, ～ないまでも, ～ないものでもない, ～ないとも限らない, ～ずとも. 150 từ vựng lao động và việc làm, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Điều kiện lao động', 'Tuyển dụng', 'Dù có… cũng'],
    textbook: 'Original LearnJP — N1 labor and employment',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Nhượng bộ và khả năng',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-12 và các mẫu ～ても, ～でも, ～とはいえ, ～ないこともない, ～かもしれない, ～なくても. Mục tiêu: hiểu tin tức về tăng lương, bài giảng về chế độ tuyển dụng, xã luận về cải cách cách làm việc và tiểu luận của lao động nước ngoài; diễn đạt nhượng bộ, khả năng nhỏ và yêu cầu tối thiểu; viết về công việc lý tưởng và bài nghị luận về tuyển dụng trọn đời. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng lao động và việc làm: tuyển dụng (正規雇用, 中途採用, 新卒一括採用, 書類選考, 適性検査, エントリーシート), chế độ (終身雇用, 年功序列, 成果主義, ジョブ型雇用, 裁量労働制, フレックスタイム), điều kiện (過労死, サービス残業, 賞与, 同一労働同一賃金, 雇い止め), quan hệ chủ thợ (労働組合, 団体交渉, 春闘, 労使), lao động nước ngoài (技能実習, 特定技能, 在留資格). Cặp dễ nhầm: 求人 / 求職; 昇格 / 昇給; 解雇 / 雇い止め; 繁忙期 / 閑散期; 天職 / 適職.',
      '45 chữ mới: 棄 免 賭 庸 殉 践 呈 疎 仰 剛 疾 砕 謡 嫁 謙 后 嘆 菌 鎌 巣 頻 琴 班 棚 潔 酷 宰 廊 寂 伏 碁 俗 邪 墨 洞 劣 那 殴 娠 奉 憂 朴 亭 怪 惜. Chú ý cách đọc: 風邪 かぜ, 怪我 けが, 刹那 せつな, 旦那 だんな, 仰天 ぎょうてん, 転嫁 てんか, 那覇 なは; 鎌, 棚 chỉ có âm kun trong bài.',
      '8 mục: ～たところで; ～ところで（逆接）; ～であれ; ～といえども; ～ないまでも; ～ないものでもない; ～ないとも限らない; ～ずとも. So sánh: たところで (vô ích) / ところで + せいぜい, たかが (cùng lắm chỉ) / ても; であれ / であれ～であれ / でも; といえども / とはいえ; ないまでも (ít nhất cũng) + せめて; ないものでもない / ないこともない; ないとも限らない / かもしれない; ずとも / なくても.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 設計（せっけい）thiết kế; 雇用形態（こようけいたい）hình thức tuyển dụng; 通用する（つうようする）dùng được; 一からやり直す làm lại từ đầu; じっくり kỹ lưỡng.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 賃上げ率（ちんあげりつ）tỉ lệ tăng lương; 転嫁（てんか）chuyển (chi phí) sang; 大手並み（おおてなみ）ngang doanh nghiệp lớn; 終電（しゅうでん）chuyến tàu cuối; 体を壊す（からだをこわす）đổ bệnh.',
      'Bài 1 là xã luận về cải cách cách làm việc; bài 2 là tiểu luận của một thực tập sinh kỹ năng. Chú giải: 上限（じょうげん）mức trần; しわ寄せ gánh nặng dồn lên; 抱え込む（かかえこむ）ôm hết; 請け負う（うけおう）nhận thầu; 寮（りょう）ký túc xá; 口数が少ない ít nói; 取り上げる（とりあげる）thu giữ.',
      'Bài 1: đoạn văn khoảng 300 ký tự về công việc lý tưởng của bạn. Bài 2: bài nghị luận khoảng 550 ký tự “Nhật Bản có nên bỏ chế độ tuyển dụng trọn đời?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: phân biệt hai nghĩa của たところで; nói “dù là gì” bằng であれ; nói “dù là người đặc biệt cũng” bằng といえども; nêu yêu cầu tối thiểu bằng ないまでも; trả lời dè dặt bằng ないものでもない; cảnh báo bằng ないとも限らない; nói “không cần” bằng ずとも. Bài tiếp theo (N1-14): giáo dục đại học và nghiên cứu.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
