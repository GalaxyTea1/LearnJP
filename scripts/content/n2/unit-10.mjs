import * as content from '../../../content/n2/n2-10.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 69001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-10',
    unitNumber: 10,
    moduleId,
    levelId,
    stamp: '2026-11-16T00:00:00.000Z',
    title: 'Ý kiến và lập luận',
    titleJp: '意見と主張',
    description:
      'N2-10: tranh luận, giả định và lập trường: ～に反して, ～にしても, ～にせよ／～にしろ, ～としても, ～といっても, ～からには, ～以上（は）. 150 từ vựng về ý kiến, tranh luận và lập luận, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tranh luận', 'Giả định', 'Lập trường'],
    textbook: 'Original LearnJP — N2 opinions and arguments',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Nhượng bộ, giả định và lập trường',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N2-09 và N3 (～と違って, ～ても, ～から, ～わけではない). Mục tiêu: nêu và bảo vệ ý kiến trong cuộc họp, phản biện lịch sự, đọc thư bạn đọc và bài bình luận, viết bài nghị luận có lập luận rõ. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Ý kiến, tranh luận, biểu quyết và từ nối lập luận. Cặp dễ nhầm: 反論 (phản biện) / 異論 (ý kiến khác) / 異議 (phản đối chính thức); 主観 / 客観; 可決 (thông qua) / 否決 (bác bỏ); 論破 (cãi thắng) / 納得 (tâm phục); むしろ (đúng hơn là) / かえって (trái lại).',
      '20 chữ mới: 肯 玉 延 羽 固 乱 普 静 略 承 浮 幸 岩 軽 倒 了 城 版 角 絡. Từ ghép trọng tâm: 肯定, 目玉, 延長, 固定観念, 混乱, 乱暴, 普遍的, 静まる, 概略, 浮上, 幸運, 軽視, 軽率, 圧倒的, 了解, 完了, 出版, 角度, 絡む. Chú ý: 世論 đọc よろん, 屁理屈 đọc へりくつ, 角 đọc かく trong 角度.',
      '7 mục: ～に反して; ～にしても; ～にせよ／～にしろ; ～としても; ～といっても; ～からには; ～以上（は）. So sánh: に反して / と違って; にしても (chấp nhận rồi phê phán) / としても (giả định) / ても; にせよ (trang trọng) / にしても; といっても (hạ mức độ); からには (quyết tâm) / 以上 (logic khách quan) / 以上 “trở lên”.',
      'Hội thoại tự soạn ở cuộc họp và giữa bạn bè. Chú giải: 問い合わせ câu hỏi của khách; 一理ある có lý; 傷つく tổn thương; 共有（きょうゆう）chia sẻ.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 持ち時間 thời gian được phân; 判定（はんてい）phân định; 建て直し xây lại; 抱え込む ôm một mình.',
      'Bài 1 là thư bạn đọc về đồng phục; bài 2 là bài bình luận về cách tranh luận. Chú giải: 私服（しふく）thường phục; 成長期 tuổi lớn; 揚げ足を取る bắt bẻ; 水掛け論 cãi nhau không hồi kết; 平行線 bế tắc.',
      'Bài 1: bình luận khoảng 250 ký tự (です・ます). Bài 2: bài nghị luận khoảng 400 ký tự (だ・である). Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói kết quả trái dự đoán bằng に反して; phê phán nhẹ bằng にしても; nêu hai lựa chọn bằng AにせよBにせよ; giả định bằng たとえ～としても; đính chính bằng といっても; nói quyết tâm bằng からには, 以上. Bài tiếp theo (N2-11): tin tức và báo chí.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); lập luận có lý do, phản biện và kết luận (30%); văn phong phù hợp người đọc (15%). Không có điểm tự động.',
  });
