import * as content from '../../../content/n3/n3-01.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 30001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-01',
    unitNumber: 1,
    moduleId,
    levelId,
    stamp: '2026-10-30T00:00:00.000Z',
    levelRow: {
      title: 'N3 — Cầu nối trung cấp',
      titleJp: '日本語能力試験 N3',
      color: '#A78BFA',
      badge: '🌙',
      description: 'Đang mở N3-01. Các bài N3 tiếp theo chưa xuất bản.',
      totalVocab: 105,
      totalKanji: 26,
      totalGrammar: 7,
      sortOrder: 3,
    },
    title: 'Cuộc sống mới',
    titleJp: '新しい生活',
    description:
      'N3-01 (cầu nối 1): kể cuộc sống mới, nêu lý do, nhận xét mức độ, nói nhượng bộ, phân biệt はずだ với かもしれない và bày tỏ tiếc nuối. Ôn 26 Hán tự nền tảng qua từ ghép. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Chuyển nhà', 'Nhịp sinh hoạt', 'Hàng xóm và khu phố'],
    textbook: 'Original LearnJP — N3 bridge 1',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '26 Hán tự nền tảng',
      'Cầu nối N4 → N3',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: hoàn thành N5 và N4. Bài cầu nối đầu tiên của N3: bổ sung các mẫu N4 thường gặp còn thiếu và 26 Hán tự nền tảng. Mục tiêu: kể cuộc sống mới, nêu nhiều lý do, nhận xét mức độ, nói nhượng bộ, phân biệt phán đoán có căn cứ với khả năng, và viết thư 250–350 ký tự. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Nhà ở, chuyển nhà, nhịp sinh hoạt, chi phí, cảm xúc khi đến nơi mới, hàng xóm và khu phố, trạng từ thường gặp. Chú ý cặp gần nghĩa: 暮らす (nếp sống) và 住む (ở đâu); やっと (cuối cùng, sau khi chờ) và ついに (rốt cuộc, sau quá trình dài); たまに ít hơn 時々; 恐らく trang trọng hơn たぶん; 不安 mạnh và mơ hồ hơn 心配.',
      '26 chữ: 一二三四五六七八九十 年半午曜 朝昼夕夜間 何名町 色赤青黒. Bạn có thể đã quen mặt các chữ này; trọng tâm là âm đọc trong từ ghép: ngày trong tháng (二十日 はつか, 七日 なのか, 八日 ようか), giờ (四時 よじ, 九時 くじ), 一日中, 年中, 昼間, 夜中, 名所, 下町.',
      '7 mẫu: ～し; ～すぎる; ～やすい／にくい; ～ても／でも; ～かもしれない; ～はずだ; ～ばよかった. So sánh trọng tâm: はずだ (có căn cứ, gần như chắc chắn) và かもしれない (chỉ là khả năng). やすい／にくい nói về tính chất của vật, nơi chốn, không thay cho thể khả năng.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 号室（ごうしつ）số phòng; カラス con quạ; 気に入る（きにいる）thích, ưng; 無料（むりょう）miễn phí; 眠そう（ねむそう）trông buồn ngủ; つい lỡ, bất giác; お弁当（おべんとう）cơm hộp.',
      'Nghe trước, sau đó mới mở bản chép. Bài 3 là tin nhắn thoại một chiều: thử nghe một lần rồi trả lời. Chú giải: 北向き／南向き（きたむき／みなみむき）hướng bắc/nam; ペットボトル chai nhựa; キャップ nắp; 玄関（げんかん）cửa ra vào; 組み立てる（くみたてる）lắp ráp; トラック xe tải. Âm thanh là giọng đọc của thiết bị.',
      'Chú giải bài 1: 押し入れ（おしいれ）tủ âm tường; 八百屋（やおや）hàng rau; 完璧（かんぺき）hoàn hảo; お祭り（おまつり）lễ hội. Bài 2: 第二・第四（だいに・だいよん）thứ hai và thứ tư (tuần trong tháng); 結ぶ（むすぶ）buộc; 構わない（かまわない）cũng được; 壁（かべ）tường; 車いす（くるまいす）xe lăn; 掲示板（けいじばん）bảng thông báo; 管理組合（かんりくみあい）ban quản lý tòa nhà.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Gợi ý bố cục: mở đầu (chào, tình hình), thân bài (lý do, khó khăn, điều tiếc), kết (mục tiêu hoặc lời chúc). Tự đánh giá theo tiêu chí bên dưới; bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nêu ba lý do chọn nơi ở bằng し; nói một điều “quá” và một điều “dễ/khó”; nói một câu nhượng bộ với いくら～ても; phân biệt 届くはずだ (đã đặt giờ giao) với 届くかもしれない (không chắc); kể một điều tiếc bằng ～ばよかった. Bài tiếp theo (N3-02): thể sai khiến và sai khiến bị động.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu đề yêu cầu, đúng mức chắc chắn (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 1, 3, 5, 7, 8, 9, 10, 12, 13, 14],
      listen: [0, 1, 3, 4],
      read: [0, 1, 3, 4],
    },
  });
