import * as content from '../../../content/n2/n2-08.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 67001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-08',
    unitNumber: 8,
    moduleId,
    levelId,
    stamp: '2026-11-14T00:00:00.000Z',
    title: 'Giáo dục và đánh giá',
    titleJp: '教育と評価',
    description:
      'N2-08: trường học, thi cử và cách đánh giá: ～だけあって, ～だけのことはある, ～だけに, ～ばかりか, ～ようがない, ～までもない, ～ことはない. 150 từ vựng về giáo dục, thi tuyển và học tập, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Trường học', 'Đánh giá', 'Xứng đáng và không cần'],
    textbook: 'Original LearnJP — N2 education and evaluation',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Xứng đáng, càng thêm và không cần',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N2-07 và N3 (～ばかりでなく, ～ことができない, ～さすが), cùng ～のみならず ở N2-05. Mục tiêu: nói về kết quả thi và cách học, đọc bài báo về giáo dục, viết email cảm ơn thầy cô và bài nghị luận. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Trường học, thi tuyển, điểm số và đánh giá. Cặp dễ nhầm: 相対評価 / 絶対評価; 予習 (chuẩn bị bài) / 復習 (ôn bài); 暗記 (học thuộc) / 丸暗記 (học vẹt); 中退 (bỏ học giữa chừng) / 留年 (lưu ban); 浪人 (thi lại năm sau) / 補欠 (diện dự bị).',
      '20 chữ mới: 能 位 賞 腕 馬 幅 彼 般 未 諸 亡 河 航 婦 寄 込 余 王 久 油. Từ ghép trọng tâm: 才能, 知能, 順位, 地位, 賞賛, 腕前, 大幅, 幅広い, 一般, 全般, 未熟, 未知, 諸国, 亡くなる, 河川, 航空, 欠航, 主婦, 夫婦, 寄付, 込める, 余裕, 永久, 油絵. Chú ý: 夫婦 đọc ふうふ, 大幅 đọc おおはば, 込 là chữ do Nhật tạo, không có âm On.',
      '7 mục: ～だけあって; ～だけのことはある; ～だけに; ～ばかりか; ～ようがない; ～までもない; ～ことはない. So sánh: だけあって (đánh giá tích cực) / だけに (cả kết quả trái kỳ vọng); だけのことはある (kết câu); ばかりか / ばかりでなく / のみならず; ようがない / ことができない; までもない (hiển nhiên) / ことはない (an ủi) / ないことはない (phủ định kép).',
      'Hội thoại tự soạn ở nhà và sau buổi họp phụ huynh. Chú giải: 長文（ちょうぶん）bài đọc dài; 大手（おおて）lớn, có tiếng; 体験授業 buổi học thử; 見学（けんがく）tham quan.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 恥じない không hổ thẹn; 来年度（らいねんど）năm học tới; 歓迎（かんげい）hoan nghênh; 統計学 môn thống kê; 過去の問題 đề các năm trước.',
      'Bài 1 là bài báo về lớp học ít người; bài 2 là bài viết về người thầy. Chú giải: 割合（わりあい）tỷ lệ; 目立つ（めだつ）dễ thấy; 手の打ちよう cách xử lý; 葬儀（そうぎ）tang lễ; 慕う（したう）kính mến; そっけない cộc lốc.',
      'Bài 1: email khoảng 250 ký tự (kính ngữ). Bài 2: bài nghị luận khoảng 400 ký tự (だ・である). Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: khen một người bằng だけあって, だけのことはある; nói nỗi thất vọng bằng だけに; kể điều tệ hơn bằng ばかりか; nói việc bất lực bằng ようがない; nói điều hiển nhiên bằng 言うまでもなく; an ủi bạn bằng ことはない. Bài tiếp theo (N2-09): kinh tế và tiêu dùng.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); lập luận rõ ràng, có ví dụ (30%); văn phong phù hợp người đọc (15%). Không có điểm tự động.',
  });
