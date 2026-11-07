import * as content from '../../../content/n3/n3-10.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 39001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-10',
    unitNumber: 10,
    moduleId,
    levelId,
    stamp: '2026-11-08T00:00:00.000Z',
    title: 'Giữ gìn sức khỏe',
    titleJp: '体を大切に',
    description:
      'N3-10: sức khỏe, lời khuyên và nghĩa vụ: ～わけにはいかない, ～ないわけにはいかない, ～ことだ, ～ものだ, ～たものだ, ～ないことはない, ～べきではない. Cơ thể, triệu chứng, khám chữa bệnh và lối sống; 24 Hán tự về sức khỏe. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Sức khỏe', 'Khám bệnh', 'Lời khuyên và nghĩa vụ'],
    textbook: 'Original LearnJP — N3 health and advice',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '24 Hán tự mới',
      'Lời khuyên và nghĩa vụ',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 (N4-06 なければならない, ほうがいい, べき nhập môn) và N3-01 đến N3-09. Mục tiêu: mô tả triệu chứng khi đi khám, hiểu hướng dẫn dùng thuốc, nói điều không thể làm hoặc buộc phải làm vì hoàn cảnh, khuyên người khác đúng mức độ, nói lẽ thường và hồi tưởng. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%. Nội dung không thay lời khuyên của bác sĩ.',
      'Cơ thể, triệu chứng, khám chữa bệnh, chuyên khoa, phòng bệnh, lối sống. Cặp gần nghĩa: 治る (tự khỏi) / 治す (chữa); 血 / 血液 (y học); 眠る (văn viết) / 寝る; 診察 (khám) / 診断 (chẩn đoán) / 診療 (khám chữa) / 受診 (đi khám); 軽症 / 重症; 満腹 / 空腹; 吐く có hai nghĩa: nôn, thở ra.',
      '24 chữ mới: 健康 治療 痛症 血骨胃腹歯鼻首肩腰 疲眠汗吸吐息 患処診. Từ ghép trọng tâm: 健康, 治療（ちりょう）, 頭痛（ずつう, chú ý ず）, 症状（しょうじょう）, 血液（けつえき）, 血圧, 骨折, 腹痛, 虫歯, 鼻水, 肩こり, 腰痛（ようつう）, 不眠, 呼吸（こきゅう）, 吐き気, 患者（かんじゃ）, 処方, 診察（しんさつ）.',
      '7 mục: ～わけにはいかない; ～ないわけにはいかない; ～ことだ (lời khuyên); ～ものだ (lẽ thường) và ～ものではない (không nên); ～たものだ (hồi tưởng); ～ないことはない; ～べきではない. So sánh: わけにはいかない (có thể nhưng không được vì đạo lý) / できない (không có khả năng); ないわけにはいかない (khó xử, buộc phải) / なければならない (nghĩa vụ chung); ことだ (khuyên mạnh, không dùng với người trên) / ほうがいい (gợi ý mềm).',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 度（ど）độ; 分（ぶ）phần mười độ (三十八度五分 = 38,5 độ); 念のため để chắc chắn; うつす lây; 押さえる（おさえる）ôm, giữ; 整形外科（せいけいげか）chỉnh hình.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 錠剤（じょうざい）viên nén; 抑える（おさえる）làm giảm; あける cách (thời gian); 咳止め（せきどめ）thuốc ho; 粉薬（こなぐすり）thuốc bột; 痛み止め（いたみどめ）thuốc giảm đau; 高め（たかめ）hơi cao; 塩分（えんぶん）lượng muối; わし ông (cách xưng của người già); ねぎ hành lá; おかゆ cháo.',
      'Chú giải bài 1: 削る（けずる）cắt giảm; 調整（ちょうせい）điều chỉnh; 脳（のう）não; 目覚めさせる làm thức tỉnh; 近道（ちかみち）đường tắt. Bài 2: 向かう（むかう）hướng về, ngồi trước; とうとう cuối cùng; 姿勢（しせい）tư thế; 丸い（まるい）tròn, còng; 回す（まわす）xoay; かえって ngược lại.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 là tin nhắn khuyên bạn: thông cảm trước, khuyên sau, giọng thân thiện. Bài 2 kể thói quen xưa bằng ～たものだ rồi so với hiện tại. Kiểm tra mức độ: ことだ／べきではない mạnh, ほうがいい mềm. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: mô tả ba triệu chứng với bác sĩ; nói một việc không thể làm bằng わけにはいかない và một việc buộc phải làm bằng ないわけにはいかない; khuyên bạn bằng ことだ và nói với cấp trên bằng ほうがいい; kể một thói quen xưa bằng たものだ. Bài tiếp theo (N3-11): thay đổi và tương quan (につれて, にしたがって, ば～ほど).',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); chọn đúng mức khuyên (ことだ／ほうがいい／べきではない) và mẫu nghĩa vụ (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 1, 2, 4, 5, 7, 8, 9, 10, 11, 13],
      listen: [0, 2, 3, 4],
      read: [0, 2, 3, 4],
    },
  });
