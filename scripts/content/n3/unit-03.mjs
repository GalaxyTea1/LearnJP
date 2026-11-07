import * as content from '../../../content/n3/n3-03.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 32001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-03',
    unitNumber: 3,
    moduleId,
    levelId,
    stamp: '2026-11-01T00:00:00.000Z',
    title: 'Dùng kính ngữ',
    titleJp: '敬語を使ってみよう',
    description:
      'N3-03 (cầu nối 3): tôn kính お／ご～になる, ～（ら）れる và động từ đặc biệt; khiêm nhường お／ご～する・いたす và động từ đặc biệt; お／ご～ください; ～ていただけないでしょうか. Tiếp khách, nghe điện thoại, gặp giáo sư; 25 Hán tự nền tảng cuối cùng. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Kính ngữ', 'Tiếp khách và điện thoại', 'Trường đại học'],
    textbook: 'Original LearnJP — N3 bridge 3',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '25 Hán tự nền tảng',
      'Kính ngữ',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 (đặc biệt N4-12 kính ngữ cơ bản), N3-01 và N3-02. Bài cầu nối cuối cùng: hệ thống tôn kính ngữ và khiêm nhường ngữ. Mục tiêu: tiếp khách ở quầy, nhận điện thoại và ghi lời nhắn, xin gặp giáo viên, tự giới thiệu ngày đầu đi làm. Câu hỏi then chốt: ai làm hành động? Người trên làm → tôn kính; mình làm → khiêm nhường. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Động từ và cụm kính ngữ, khái niệm kính ngữ, chức danh, văn phòng và điện thoại, trường đại học, ngân hàng và giấy tờ, rạp chiếu phim, thăm người ốm. Cặp gần nghĩa: 少々／少し, ただいま／今, 先ほど／さっき, 後ほど／後で (bên trái trang trọng); 応対 (tiếp đón, tiếp chuyện) và 対応 (xử lý); 回答 (trả lời câu hỏi, khảo sát) và 解答 (lời giải bài).',
      '25 chữ cuối của nhóm nền tảng: 同主元重別真有工味写 校問代不以野死起研究質銀映答悪. Sau bài này đã đủ 74 chữ còn thiếu từ N5/N4. Trọng tâm âm đọc: 同期（どうき）, 元々（もともと）, 重要（じゅうよう）, 工場（こうじょう）, 研究室, 品質（ひんしつ）, 上映（じょうえい）, 回答（かいとう）, 悪化（あっか, âm ngắt）.',
      '7 mục: お／ご～になる; ～（ら）れる (tôn kính, giống hình thức bị động); động từ tôn kính đặc biệt; お／ご～する・いたす; động từ khiêm nhường đặc biệt; お／ご～ください; ～ていただけないでしょうか. Lỗi hay gặp: ご利用してください (đúng: ご利用ください), お読みになられる (kính ngữ hai lớp), dùng tôn kính cho người trong công ty mình khi nói với khách.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 二泊（にはく）hai đêm; お待たせいたしました xin lỗi đã để chờ; ごゆっくり xin cứ thong thả; お過ごしください chúc có thời gian…; 計画書（けいかくしょ）bản kế hoạch; 推薦状（すいせんじょう）thư giới thiệu; 大学院（だいがくいん）cao học.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 商事（しょうじ）công ty thương mại; 総務課（そうむか）phòng hành chính; お世話になっております câu chào trong công việc; 承る（うけたまわる）xin nhận (khiêm nhường của 受ける・聞く); 念のため để chắc chắn; 在留カード thẻ cư trú; 外国籍（がいこくせき）quốc tịch nước ngoài; けた chữ số; 郵送（ゆうそう）gửi bưu điện; 歓迎会（かんげいかい）tiệc chào đón; 仲間（なかま）đồng nghiệp, bạn; 乾杯（かんぱい）cạn ly.',
      'Chú giải bài 1: 件名（けんめい）tiêu đề; 経済学部（けいざいがくぶ）khoa Kinh tế; 計画書 bản kế hoạch; 方法（ほうほう）phương pháp; ご都合（ごつごう）sự thuận tiện của người trên; 日時（にちじ）ngày giờ; ご検討のほど xin xem xét; 親子（おやこ）cha mẹ và con. Bài 2: 苦労（くろう）vất vả; 実際（じっさい）thực tế; 席を外す（せきをはずす）không ở chỗ ngồi; 表現（ひょうげん）cách diễn đạt; 完璧（かんぺき）hoàn hảo; 後輩（こうはい）đàn em.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 là email trang trọng: tiêu đề, chào, tự giới thiệu, việc nhờ, đề xuất thời gian, kết. Bài 2 là bài phát biểu tự giới thiệu. Kiểm tra từng động từ: chủ thể là ai, đã chọn tôn kính hay khiêm nhường đúng chưa. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: chuyển 待つ・利用する sang tôn kính và khiêm nhường; nói tôn kính và khiêm nhường của 行く・言う・見る・食べる; nhận một cuộc điện thoại khi cấp trên vắng (ただいま席を外しております、折り返しお電話いたします); viết một câu nhờ bằng ～ていただけないでしょうか. Đã xong ba bài cầu nối; bài tiếp theo (N3-04): suy đoán và ấn tượng (ようだ・らしい・そうだ).',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); chọn đúng tôn kính / khiêm nhường theo chủ thể hành động (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 2, 3, 5, 6, 7, 8, 9, 10, 12, 14],
      listen: [0, 1, 2, 4],
      read: [0, 2, 3, 4],
    },
  });
