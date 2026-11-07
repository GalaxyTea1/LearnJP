import * as content from '../../../content/n3/n3-14.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 43001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-14',
    unitNumber: 14,
    moduleId,
    levelId,
    stamp: '2026-11-12T00:00:00.000Z',
    title: 'Tin tức và truyền đạt',
    titleJp: 'ニュースを伝える',
    description:
      'N3-14: nêu nguồn tin và truyền đạt lại: ～によると／によれば, ～ということだ, ～とのことだ, ～って, ～から～にかけて, ～を通じて／を通して. Chính trị, pháp luật, tội phạm, báo chí; 24 Hán tự về xã hội. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tin tức', 'Truyền đạt lại', 'Chính trị và pháp luật'],
    textbook: 'Original LearnJP — N3 news and reported information',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '24 Hán tự mới',
      'Nguồn tin và truyền đạt',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 (～そうだ truyền đạt, ～らしい) và N3-01 đến N3-13. Mục tiêu: nêu nguồn tin, truyền đạt lại thông tin trang trọng và thân mật, nói phạm vi thời gian và khu vực, nói phương tiện và khoảng thời gian; tóm tắt một bản tin. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Chính trị và bầu cử, cơ quan nhà nước, pháp luật và tòa án, tội phạm và cảnh sát, báo chí và phát thanh, xã hội và quốc tế. Cặp gần nghĩa: 警官 (gọi tắt) / 警察官; 首相 (tin tức) / 総理大臣 (chính thức); 市民 (người dân thành phố) / 国民 (người dân cả nước) / 住民 (cư dân nơi ở); 報道 (đưa tin nói chung) / 速報 (tin nhanh); 当選 / 落選.',
      '24 chữ mới: 政府民党挙 法律憲 官庁局 警察犯罪逮捕訴 放委 刊載 領統. Từ ghép trọng tâm: 政治（せいじ）, 政府, 国民, 政党, 選挙（せんきょ）, 法律（ほうりつ）, 憲法（けんぽう）, 警官, 官庁, 警察, 犯罪（はんざい）, 逮捕（たいほ）, 訴える（うったえる）, 放送, 委員会, 朝刊（ちょうかん）, 連載, 大統領（だいとうりょう）, 伝統, 放送局. Chú ý 憲法 đọc けんぽう (biến âm).',
      '7 mục: ～によると／によれば; ～ということだ; ～とのことだ; ～って; ～から～にかけて; ～を通じて／を通して (phương tiện); ～を通じて／を通して (suốt thời gian). So sánh: ということだ (trang trọng, khách quan) / そうだ (thân mật hơn) / らしい (có phỏng đoán); から～にかけて (ranh giới không rõ) / から～まで (điểm đầu cuối rõ ràng).',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 先ほど（さきほど）lúc nãy (lịch sự); 早めに（はやめに）sớm hơn một chút; 夜中（よなか）nửa đêm; 防犯カメラ camera an ninh; 映る（うつる）hiện hình; さすが đúng là.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 新人（しんじん）người mới; 割合（わりあい）tỷ lệ; 前回（ぜんかい）lần trước; 鉄道会社（てつどうがいしゃ）công ty đường sắt; 最新（さいしん）mới nhất; 孫（まご）cháu; 冷静（れいせい）bình tĩnh; 合言葉（あいことば）mật khẩu.',
      'Chú giải bài 1: 職員（しょくいん）nhân viên; ふりをする giả vờ; だまし取る（だましとる）lừa lấy; 仲間（なかま）đồng bọn; 年末（ねんまつ）cuối năm. Bài 2: 関心（かんしん）quan tâm; 久しい（ひさしい）đã lâu; 学費（がくひ）học phí; 後回し（あとまわし）gác lại; 一票（いっぴょう）một lá phiếu.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bố cục bài tóm tắt: nguồn tin (によると) → nội dung chính (ということだ／とのことだ) → chi tiết thời gian, cách thức (にかけて, を通じて) → ý kiến. Kiểm tra: không dùng って trong văn viết; とのことだ gắn với lời của một bên cụ thể. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nêu nguồn của một tin bằng によると; truyền lại tin bằng ということだ và lời nhắn bằng とのことです; kể tin cho bạn bằng って; nói dự báo thời tiết bằng から～にかけて; nói cách bạn biết tin bằng を通じて. Bài tiếp theo (N3-15): tranh luận và nhượng bộ (ものの, にもかかわらず).',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); nêu đúng nguồn tin và nội dung chính, chọn đúng ということだ／とのことだ／って (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 1, 2, 3, 4, 5, 6, 8, 10, 11, 13],
      listen: [0, 2, 3, 4],
      read: [0, 2, 3, 4],
    },
  });
