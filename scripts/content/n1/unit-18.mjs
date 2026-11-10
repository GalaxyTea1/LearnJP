import * as content from '../../../content/n1/n1-18.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 97001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-18',
    unitNumber: 18,
    moduleId,
    levelId,
    stamp: '2026-12-13T00:00:00.000Z',
    title: 'Thiên nhiên và thảm họa',
    titleJp: '自然と災害',
    description:
      'N1-18: thiên tai, phòng chống thảm họa, hệ sinh thái và cách chung sống với thiên nhiên; các mẫu tất yếu, mức độ và suy đoán: ～ないではおかない, ～ないではすまない, ～ではすまない, ～ても～きれない, ～にもほどがある, ～ことのないよう, ～もそこそこに, ～ところを見ると. 150 từ vựng thiên nhiên và thảm họa, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Thiên tai', 'Hệ sinh thái', 'Không thể tránh'],
    textbook: 'Original LearnJP — N1 nature and disasters',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Tất yếu, mức độ, suy đoán',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-17 và các mẫu ～ずにはいられない, ～なければならない, ～きれない, ～すぎる, ～ないように, ～からすると. Mục tiêu: hiểu bản tin mưa lớn, bài giảng về loài ngoại lai, chuyên mục về chữ “ngoài dự kiến” và tiểu luận của người cứu hộ núi; nói điều tất yếu, trách nhiệm không thể né, cảm xúc không trọn, phê phán việc quá mức, mục đích phòng ngừa và suy đoán từ quan sát; viết về sự chuẩn bị cho thiên tai và bài nghị luận về trách nhiệm phòng chống thiên tai. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng thiên nhiên và thảm họa: thiên tai (豪雨, 線状降水帯, 土石流, 地滑り, 氾濫, 決壊, 浸水, 冠水, 高潮, 雪崩, 噴火, 火砕流, 余震, 活断層, 液状化), phòng chống (避難指示, ハザードマップ, 減災, 備蓄, 安否確認, 仮設住宅, 堤防, 防潮堤, 耐震, 免震, 自助, 共助, 公助), sinh thái (生物多様性, 絶滅危惧種, 外来種, 在来種, 食物連鎖, 干潟, 渡り鳥, 鳥獣, 獣害), địa hình (尾根, 渓谷, 裾野, 麓, 沼地). Cặp dễ nhầm: 浸水 / 冠水; 防災 / 減災; 耐震 / 免震; 外来種 / 在来種; 自助 / 共助 / 公助.',
      '45 chữ mới: 沢 尾 柄 岳 沼 涯 昆 獣 洪 嵐 峠 渓 裾 麓 斗 迅 肖 朽 殻 享 藩 沙 鶏 禅 嘱 胴 迭 椎 陪 剖 譜 悠 帆 暁 傑 奴 誰 錠 拳 遷 拙 尺 篤 渇 俺. Chú ý cách đọc: 音沙汰 おとさた, 表沙汰 おもてざた, 椎茸 しいたけ, 泰斗 たいと, 享年 きょうねん, 更迭 こうてつ, 拙い つたない; 嵐, 峠, 裾, 誰, 俺 chỉ có âm kun trong bài.',
      '8 mục: ～ないではおかない; ～ないではすまない; ～ではすまない; ～ても～きれない; ～にもほどがある; ～ことのないよう; ～もそこそこに; ～ところを見ると. So sánh: ないではおかない (nhất định gây ra) / ずにはいられない (không kìm được); ないではすまない (bắt buộc làm) / ではすまない (mức đó chưa đủ) / なければならない; ても～きれない / きれない; にもほどがある / すぎる; ことのないよう / ないように; もそこそこに / かと思うと; ところを見ると / からすると.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 床上浸水（ゆかうえしんすい）ngập trên sàn; 説明会（せつめいかい）buổi hướng dẫn; 連絡網（れんらくもう）mạng liên lạc; 棚（たな）giá kệ; 見直し（みなおし）rà soát lại.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 気象台（きしょうだい）đài khí tượng; 平年（へいねん）năm trung bình; 用水路（ようすいろ）kênh mương; 野生化（やせいか）trở nên hoang dã; 定着（ていちゃく）định cư; 人手（ひとで）nhân lực.',
      'Bài 1 là chuyên mục về chữ “ngoài dự kiến”; bài 2 là tiểu luận của người cứu hộ núi. Chú giải: 補強（ほきょう）gia cố; 人災（じんさい）nhân tai; 高台（たかだい）chỗ cao; 山菜（さんさい）rau rừng; 山小屋（やまごや）nhà nghỉ trên núi; 過疎化（かそか）dân cư thưa thớt; 駆除（くじょ）tiêu diệt; 引き返す（ひきかえす）quay đầu.',
      'Bài 1: đoạn văn khoảng 300 ký tự về trải nghiệm hoặc sự chuẩn bị cho thiên tai. Bài 2: bài nghị luận khoảng 550 ký tự “Phòng chống thiên tai là trách nhiệm của chính quyền hay cá nhân?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói hệ quả tất yếu bằng ないではおかない; nói trách nhiệm không thể né bằng ないではすまない; nói mức đó chưa đủ bằng ではすまない; nhấn cảm xúc bằng ても～きれない; phê phán bằng にもほどがある; nói mục đích phòng ngừa bằng ことのないよう; tả sự vội vàng bằng もそこそこに; suy đoán từ quan sát bằng ところを見ると. Bài tiếp theo (N1-19): tôn giáo và tín ngưỡng.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
