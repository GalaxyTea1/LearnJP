import * as content from '../../../content/n3/n3-07.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 36001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-07',
    unitNumber: 7,
    moduleId,
    levelId,
    stamp: '2026-11-05T00:00:00.000Z',
    title: 'Thời điểm và diễn biến',
    titleJp: 'その時、何が起きた？',
    description:
      'N3-07: kể thời điểm và diễn biến: ～ところだ, ～ところに, ～うちに, ～最中に, ～たとたん, ～ばかりだ, ～一方だ. Thời tiết, mùa, khí hậu và một ngày có sự cố bất ngờ; 24 Hán tự về thời tiết và thời gian. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Thời điểm', 'Thời tiết và mùa', 'Diễn biến'],
    textbook: 'Original LearnJP — N3 timing and development',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '24 Hán tự mới',
      'Thời điểm và diễn biến',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 (N4-03 たばかり, N4-13 間／間に) và N3-01 đến N3-06. Mục tiêu: nói chính xác thời điểm của hành động (sắp, đang, vừa), kể việc xen vào đúng lúc, việc xảy ra ngay lập tức, xu hướng thay đổi; hiểu dự báo thời tiết; kể lại một ngày có sự cố bất ngờ. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Thời tiết và khí hậu, mùa và sự kiện, mốc thời gian, trạng từ diễn biến, đi lại. Cặp gần nghĩa: 気温 (nhiệt độ không khí) / 温度 (nhiệt độ nói chung) / 体温; 天候 (thời tiết trong một thời gian, trang trọng) / 気候 (khí hậu); 湿気 (hơi ẩm) / 湿度 (độ ẩm đo được); 昨年・昨夜 (trang trọng) / 去年・昨日の夜; 次第に (văn viết) / だんだん; ようやく (trang trọng) / やっと; 急に / いきなり (bất thình lình hơn).',
      '24 chữ mới: 晴曇降 温暖涼冷寒暑熱 季節 晩昨翌期 過経進途迎戻頃秒. Từ ghép trọng tâm: 快晴, 曇り, 降水確率, 気温, 暖房, 冷房, 猛暑, 熱中症, 四季, 季節, 今晩, 翌日（よくじつ）, 期待, 経由（けいゆ）, 進歩（しんぽ）, 途中, 迎える, 戻る, 頃, 一瞬. Chú ý 経つ đọc たつ (thời gian trôi qua).',
      '7 mục: ～ところだ (Vる sắp / Vている đang / Vた vừa xong); ～ところに／ところへ; ～うちに; ～最中に; ～たとたん（に）; ～ばかりだ; ～一方だ. So sánh: ～たところ (vừa xong, rất gần) / ～たばかり (cảm giác mới, N4-03); うちに (nhân lúc còn, trước khi thay đổi) / 間に (khoảng thời gian khách quan); たとたん (bất ngờ, không ý chí) / たら (dùng được cho ý chí); ばかりだ (chiều xấu) / 一方だ (trung tính).',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 改札（かいさつ）cửa soát vé; 了解（りょうかい）ok, đã rõ; 配達（はいたつ）giao hàng; こまめに thường xuyên; 気分（きぶん）cảm giác, tâm trạng.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 以降（いこう）từ… trở đi; 雷雨（らいう）dông; 見込み（みこみ）dự kiến; ついてない xui xẻo; 宅配便（たくはいびん）dịch vụ giao hàng; 懐中電灯（かいちゅうでんとう）đèn pin; 停電（ていでん）mất điện; 気分が悪い（きぶんがわるい）thấy khó chịu.',
      'Chú giải bài 1: のち sau đó (trong dự báo); 大粒（おおつぶ）hạt to; 虹（にじ）cầu vồng; 得をした気分 cảm giác được lời. Bài 2: 記録（きろく）số liệu; 猛暑日（もうしょび）ngày nắng gắt (trên 35 độ); 過去最多（かこさいた）nhiều nhất từ trước; ためる tích trữ; 専門家（せんもんか）chuyên gia; 移す（うつす）chuyển; 合わせる（あわせる）phù hợp với.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 kể theo thứ tự thời gian, dùng các mẫu thời điểm để làm rõ việc gì xảy ra lúc nào. Bài 2 giới thiệu thời tiết quê bạn và sự thay đổi. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói ba câu 出るところ／出ているところ／出たところ; kể việc xen vào bằng ～ところに và ～最中に; khuyên người khác bằng ～ないうちに; kể một chuyện bất ngờ bằng ～たとたん; nói một xu hướng bằng ～一方だ. Bài tiếp theo (N3-08): mục đích và quyết định (ように, ことにする, ことになる).',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); kể đúng thời điểm và diễn biến, dùng đủ mẫu đề yêu cầu (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13],
      listen: [0, 2, 3, 4],
      read: [0, 2, 3, 4],
    },
  });
