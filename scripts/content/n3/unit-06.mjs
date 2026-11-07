import * as content from '../../../content/n3/n3-06.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 35001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-06',
    unitNumber: 6,
    moduleId,
    levelId,
    stamp: '2026-11-04T00:00:00.000Z',
    title: 'Nguyên nhân và kết quả',
    titleJp: '原因と結果',
    description:
      'N3-06: nêu nguyên nhân và kết quả: ～ため (nguyên nhân), ～おかげで, ～せいで, ～からこそ, ～によって／による, ～ものだから, ～結果. Sự cố, thiên tai, giao thông, kinh tế và rút kinh nghiệm; 24 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Nguyên nhân và kết quả', 'Sự cố và thiên tai', 'Rút kinh nghiệm'],
    textbook: 'Original LearnJP — N3 cause and effect',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '24 Hán tự mới',
      'Nguyên nhân và kết quả',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 và N3-01 đến N3-05. Mục tiêu: nêu nguyên nhân và kết quả theo đúng sắc thái (trang trọng, biết ơn, trách, nhấn mạnh, xin lỗi), hiểu thông báo ở ga và bản tin thiên tai, viết báo cáo sự cố có nguyên nhân – kết quả – đối sách. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Sự cố và tai nạn, thiên tai và phòng chống, giao thông, kinh tế, nguyên nhân – hệ quả, thành công – thất bại. Cặp gần nghĩa: 状況 (tình hình xung quanh) và 状態 (trạng thái của người, vật); 火事 và 火災 (văn viết); 不景気 (khẩu ngữ) và 不況 (tin tức); 予防 (phòng bệnh, tai nạn) và 防止 (ngăn chặn); 警報 (cảnh báo) mạnh hơn 注意報; 弁償 (đền đồ làm hỏng) và 補償 (bồi thường thiệt hại). Động từ gây hệ quả: 与える, 及ぼす, 引き起こす; chịu hệ quả: 受ける.',
      '24 chữ mới: 原因 結果 影響 効 故 害災 及 被損 失敗功 責任 状況 険危防件. Từ ghép trọng tâm: 原因, 結果（けっか, âm ngắt）, 影響（えいきょう）, 効果, 故障, 災害, 被害, 損害, 失敗（しっぱい）, 責任, 状況（じょうきょう）, 危険, 予防. Chú ý 及ぼす（およぼす）và 及ぶ（およぶ）cùng chữ khác nghĩa.',
      '7 mục: ～ため（に）nguyên nhân; ～おかげで; ～せいで／せいか; ～からこそ; ～によって／による; ～ものだから／もので; ～結果. So sánh: おかげで (kết quả tốt, biết ơn) / せいで (kết quả xấu, trách); ため (trang trọng, câu sau không là mệnh lệnh hay ý chí) / から (dùng được mọi loại câu). Phân biệt ために nguyên nhân với ために mục đích (N4-05).',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 信号（しんごう）tín hiệu; 遅延証明書（ちえんしょうめいしょ）giấy xác nhận tàu trễ; お互い様（おたがいさま）ai cũng như ai; 今後（こんご）từ nay; 聴解（ちょうかい）phần nghe hiểu; 前向き（まえむき）lạc quan, tích cực; お祝い（おいわい）ăn mừng.',
      'Nghe trước, sau đó mới mở bản chép. Bài 1 là thông báo ở ga: chú ý cụm ため、運転を見合わせております. Chú giải: 上り線／下り線（のぼりせん／くだりせん）tuyến lên/tuyến xuống; 振替輸送（ふりかえゆそう）chở thay; 改札口（かいさつぐち）cửa soát vé; 関東地方（かんとうちほう）vùng Kanto; 電力会社（でんりょくがいしゃ）công ty điện lực; 指示（しじ）lệnh; 体を壊す（からだをこわす）đổ bệnh.',
      'Chú giải bài 1: 会計（かいけい）thanh toán; おつり tiền thối; お札（おさつ）tiền giấy; お預かりします xin nhận (tiền); 幸い（さいわい）may mắn. Bài 2: 大型（おおがた）cỡ lớn; 各地（かくち）khắp nơi; 食料（しょくりょう）lương thực; 高齢者（こうれいしゃ）người cao tuổi; 逃げ遅れる（にげおくれる）chạy không kịp; 充電器（じゅうでんき）sạc pin; 持ち出す（もちだす）mang ra ngoài.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 là báo cáo sự cố: chuyện gì, nguyên nhân, kết quả, đối sách. Bài 2 là tin nhắn cảm ơn. Kiểm tra: kết quả tốt dùng おかげで, xấu dùng せいで; câu sau ため không là mệnh lệnh. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: cảm ơn một người bằng おかげで và kể một điều không may bằng せいで; đọc hiểu thông báo 「信号故障のため、運転を見合わせております」; xin lỗi đến muộn bằng ものですから; viết một câu からこそ về bài học từ thất bại. Bài tiếp theo (N3-07): thời điểm và diễn biến (ところだ, うちに, たとたん).',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); nêu đúng nguyên nhân – kết quả, chọn đúng おかげで／せいで／ため (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 1, 3, 4, 5, 7, 8, 10, 12, 13, 14],
      listen: [0, 2, 3, 4],
      read: [0, 2, 3, 4],
    },
  });
