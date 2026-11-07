import * as content from '../../../content/n3/n3-05.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 34001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-05',
    unitNumber: 5,
    moduleId,
    levelId,
    stamp: '2026-11-03T00:00:00.000Z',
    title: 'Nêu ý kiến',
    titleJp: '意見を言う',
    description:
      'N3-05: nêu quan điểm có căn cứ và phản biện; ～わけだ, ～わけではない, ～わけがない, ～はずがない, ～に違いない, ～とは限らない, ～というより. Thảo luận, khảo sát, đa số và thiểu số; 24 Hán tự về tranh luận. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Ý kiến', 'Lập luận và phản biện', 'Thảo luận'],
    textbook: 'Original LearnJP — N3 opinions and reasoning',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '24 Hán tự mới',
      'Lập luận',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 và N3-01 đến N3-04 (đặc biệt ～はずだ ở N3-01 và các cách nói suy đoán ở N3-04). Mục tiêu: nêu quan điểm có căn cứ, thừa nhận ý kiến khác rồi phản biện, phủ định một phần một khái quát hóa, và viết bài ý kiến 250–350 ký tự có bố cục rõ. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Thảo luận, lý lẽ, sự thật và nhận thức, đa số và dữ liệu, liên từ lập luận, chủ đề xã hội. Cặp gần nghĩa: 同意 (đồng ý với ý kiến) / 合意 (các bên thống nhất) / 賛同 (tán đồng đề xuất); 説得 (thuyết phục người khác) và 納得 (bản thân chấp nhận); 誤り (văn viết) và 間違い; 当然 và 当たり前 (khẩu ngữ hơn); 視点 và 観点 (trang trọng hơn); 明らか và 明確 (trang trọng, rõ ràng minh bạch). 本音 (suy nghĩ thật) đối với 建前 (lời xã giao).',
      '24 chữ mới: 賛否 反対 議論 判断 違例誤 実際 根拠証示張 疑頼解率 当然. Từ ghép trọng tâm: 賛否（さんぴ）, 議論, 結論, 反論, 判断, 断言, 例外, 誤解, 事実, 実際（じっさい）, 根拠（こんきょ）, 証拠（しょうこ）, 主張, 疑問, 信頼, 解釈, 確率（かくりつ）, 当然. Chú ý 率 đọc りつ trong 確率 nhưng そつ trong 率直.',
      '7 mục: ～わけだ (thảo nào / tức là); ～わけではない (không hẳn là); ～わけがない (không thể nào, cảm xúc mạnh); ～はずがない (không thể nào, có căn cứ); ～に違いない (tin chắc); ～とは限らない (chưa chắc đã, thường với 必ずしも); ～というより. So sánh: わけがない nhấn cảm nhận của người nói; はずがない nhấn căn cứ; はずだ (N3-01) là khẳng định có căn cứ. Phân biệt わけではない (phủ định một phần) với ～ない (phủ định hoàn toàn).',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 辞書（じしょ）từ điển; アプリ ứng dụng; 気になる thấy phiền, để ý; 消す（けす）tắt; やる気（やるき）động lực, hứng làm; 連れていく（つれていく）đưa đi; 事情（じじょう）hoàn cảnh.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 司会（しかい）người dẫn chương trình; 区別（くべつ）ranh giới, phân biệt; 並ぶ（ならぶ）xếp hàng; 貼る（はる）dán; 改装（かいそう）sửa sang lại; 意見文（いけんぶん）bài ý kiến; 説得力（せっとくりょく）sức thuyết phục; 触れる（ふれる）nhắc đến; 一方的（いっぽうてき）một chiều.',
      'Chú giải bài 1: 高学年（こうがくねん）các lớp lớn ở tiểu học; 睡眠（すいみん）giấc ngủ; 危険（きけん）nguy hiểm; 手段（しゅだん）phương tiện; そのもの bản thân nó. Bài 2: 文化祭（ぶんかさい）lễ hội văn hóa; 出し物（だしもの）tiết mục; 劇（げき）kịch; 本番（ほんばん）buổi diễn chính thức; 完成（かんせい）hoàn thành; 含む（ふくむ）bao gồm; 少数派（しょうすうは）nhóm thiểu số; きちんと đầy đủ, nghiêm túc.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 là bài ý kiến: quan điểm, hai lý do (まず／次に), 確かに～が～ để thừa nhận ý kiến khác, rồi kết luận. Bài 2 là tin nhắn phản đối lịch sự. Tách rõ sự thật và ý kiến; mỗi lý do nên có căn cứ hoặc ví dụ. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói một câu わけだ sau khi biết lý do; phản biện một khái quát bằng 必ずしも～とは限らない; phân biệt そんなわけない (phản ứng cảm xúc) và 休みだから開いているはずがない (có căn cứ); nói lại một ý bằng ～というより. Bài tiếp theo (N3-06): nguyên nhân và kết quả (ため, おかげで, せいで).',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); lập luận có căn cứ, dùng đúng mức phủ định / khẳng định (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13],
      listen: [0, 2, 3, 4],
      read: [0, 2, 3, 4],
    },
  });
