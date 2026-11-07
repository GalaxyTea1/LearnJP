import * as content from '../../../content/n2/n2-05.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 64001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-05',
    unitNumber: 5,
    moduleId,
    levelId,
    stamp: '2026-11-11T00:00:00.000Z',
    title: 'Nghiên cứu và khảo sát',
    titleJp: '研究と調査',
    description:
      'N2-05: khảo sát, thí nghiệm và cách đọc số liệu: ～に限って, ～に限らず, ～のみならず, ～はもとより, ～に加えて, ～を問わず, ～にかかわらず. 150 từ vựng về nghiên cứu, thống kê và môi trường, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Khảo sát', 'Phòng thí nghiệm', 'Phạm vi và bổ sung'],
    textbook: 'Original LearnJP — N2 research and surveys',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Phạm vi, giới hạn và bổ sung',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N2-04 và N3 (～だけでなく, ～はもちろん, ～の上に, ～にもかかわらず). Mục tiêu: hiểu một thông báo tìm người tham gia nghiên cứu, đọc báo cáo khảo sát có mục đích, phương pháp, kết quả và bàn luận, viết báo cáo ngắn. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Nghiên cứu, thí nghiệm, thống kê, khảo sát môi trường và đạo đức nghiên cứu. Cặp dễ nhầm: 量る (cân, đong) / 測る (đo dài, sâu) / 計る (đo thời gian); 観察 (quan sát) / 観測 (quan trắc bằng thiết bị); 相関 (tương quan) / 因果関係 (nhân quả); 未満 (dưới, không gồm) / 以下 (gồm cả).',
      '20 chữ mới: 査 量 測 門 脳 種 命 含 蔵 非 横 深 呼 良 針 専 谷 程 満 突. Từ ghép trọng tâm: 審査, 査読, 数量, 測定, 推測, 頭脳, 品種, 生命, 含める, 貯蔵, 非公開, 横軸, 深刻, 呼びかける, 良好, 改良, 指針, 専念, 過程, 未満, 突き止める. Chú ý: 頭脳 đọc ずのう, 含有量 đọc がんゆうりょう, 寿命 đọc じゅみょう.',
      '7 mục: ～に限って; ～に限らず; ～のみならず; ～はもとより; ～に加えて; ～を問わず; ～にかかわらず. So sánh: に限って (đúng lúc thì lại…) / に限り (chỉ giới hạn); に限らず, のみならず / だけでなく; はもとより / はもちろん; を問わず (với danh từ) / にかかわらず (cả động từ); にかかわらず (bất kể) / にもかかわらず (mặc dù).',
      'Hội thoại tự soạn ở trường đại học. Chú giải: 防災意識（ぼうさいいしき）ý thức phòng chống thiên tai; 翻訳（ほんやく）dịch; あるある chuyện thường gặp; 記録をつける ghi chép.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 心理学部（しんりがくぶ）khoa Tâm lý; 記憶（きおく）trí nhớ; 本学（ほんがく）trường chúng tôi; 生物学（せいぶつがく）sinh vật học.',
      'Bài 1 là báo cáo khảo sát nước sông của câu lạc bộ khoa học; bài 2 là bài viết về thất bại và phát hiện. Chú giải: 昭和（しょうわ）thời Showa; 溶ける（とける）hòa tan; 基準（きじゅん）tiêu chuẩn; 物理学者（ぶつりがくしゃ）nhà vật lý; 損なう（そこなう）làm tổn hại.',
      'Bài 1: lời kêu gọi khoảng 250 ký tự (です・ます). Bài 2: báo cáo khoảng 400 ký tự (だ・である). Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: kể một chuyện xui “đúng lúc” bằng に限って; mở rộng phạm vi bằng に限らず và のみならず; nêu điều hiển nhiên bằng はもとより; thêm thông tin bằng に加えて; viết tiêu chí tuyển bằng を問わず; nói việc không thay đổi bằng にかかわらず. Bài tiếp theo (N2-06): y tế và sức khỏe.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); bố cục báo cáo rõ ràng, có số liệu (30%); văn phong phù hợp người đọc (15%). Không có điểm tự động.',
  });
