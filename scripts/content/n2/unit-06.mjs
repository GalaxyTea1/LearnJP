import * as content from '../../../content/n2/n2-06.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 65001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-06',
    unitNumber: 6,
    moduleId,
    levelId,
    stamp: '2026-11-12T00:00:00.000Z',
    title: 'Y tế và sức khỏe',
    titleJp: '医療と健康',
    description:
      'N2-06: đi khám, phòng bệnh và nói về khả năng, rủi ro: ～得る／～得ない, ～かねない, ～恐れがある, ～ないことには, ～に越したことはない, ～ずにすむ, ～てはいられない. 150 từ vựng về bệnh viện, triệu chứng và thuốc, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Bệnh viện', 'Phòng bệnh', 'Khả năng và rủi ro'],
    textbook: 'Original LearnJP — N2 medicine and health',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Khả năng, rủi ro và điều kiện',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N2-05 và N3 (thể khả năng, ～なければ, ～ほうがいい, ～ずにはいられない), cùng ～かねる ở N2-04. Mục tiêu: kể triệu chứng với bác sĩ, đọc hướng dẫn khám ngoại trú, hiểu tin cảnh báo sức khỏe, viết email xin nghỉ ốm. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Khoa khám, triệu chứng, thuốc, xét nghiệm và bệnh truyền nhiễm. Cặp dễ nhầm: 診察 (khám) / 診断 (chẩn đoán) / 診療 (khám chữa); 陽性 (dương tính) / 陰性 (âm tính); 慢性 / 急性; 微熱 / 高熱 / 平熱; 副作用 (thuốc) / 副反応 (vắc-xin).',
      '20 chữ mới: 兵 光 積 丸 他 湾 省 岸 周 材 易 戸 存 飛 殺 央 券 単 座 破. Từ ghép trọng tâm: 日光, 蓄積, 丸一日, 他人, 厚生労働省, 省略, 周囲, 周期, 食材, 容易, 安易, 戸外, 生存率, 飛沫, 殺菌, 中央, 診察券, 単なる, 正座, 破傷風. Chú ý: 他人 đọc たにん, 戸惑う đọc とまどう, 破傷風 đọc はしょうふう.',
      '7 mục: ～得る／～得ない; ～かねない; ～恐れがある; ～ないことには; ～に越したことはない; ～ずにすむ; ～てはいられない. So sánh: 得る (khả năng xảy ra) / thể khả năng (năng lực); かねない (lo ngại chủ quan) / 恐れがある (cảnh báo khách quan) / かねる (từ chối); ないことには / なければ; に越したことはない / ほうがいい; ずにすむ, てはいられない / ずにはいられない.',
      'Hội thoại tự soạn ở phòng khám và văn phòng. Chú giải: 喉（のど）họng; 肺炎（はいえん）viêm phổi; ゴホッ tiếng ho; 倒れる ngã bệnh; お大事に giữ gìn sức khỏe.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 来院（らいいん）đến bệnh viện; 渇く（かわく）khát; 塩分（えんぶん）lượng muối; 数値（すうち）chỉ số.',
      'Bài 1 là hướng dẫn khám ngoại trú của bệnh viện; bài 2 là bài viết về khám sức khỏe định kỳ. Chú giải: 再来受付機 máy tiếp nhận tái khám; 遠慮（えんりょ）xin đừng; 自覚症状 triệu chứng tự nhận biết; 沈黙（ちんもく）im lặng; 後回し để sau; 自治体（じちたい）chính quyền địa phương.',
      'Bài 1: email khoảng 250 ký tự (kính ngữ). Bài 2: bài viết khoảng 400 ký tự (だ・である). Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói một điều có thể xảy ra bằng 得る; cảnh báo bạn bè bằng かねない; đọc một câu cảnh báo có 恐れがある; nói điều kiện bắt buộc bằng ないことには; khuyên chung bằng に越したことはない; kể việc tránh được bằng ずにすんだ; nói mình không thể ngồi yên bằng てはいられない. Bài tiếp theo (N2-07): cảm xúc và tâm trạng.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); bố cục rõ ràng, đủ ý (30%); văn phong phù hợp người đọc (15%). Không có điểm tự động.',
  });
