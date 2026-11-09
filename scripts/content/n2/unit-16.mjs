import * as content from '../../../content/n2/n2-16.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 75001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-16',
    unitNumber: 16,
    moduleId,
    levelId,
    stamp: '2026-11-22T00:00:00.000Z',
    title: 'Diễn biến sự việc',
    titleJp: '出来事の経緯',
    description:
      'N2-16: kết cục, ngoài dự định và việc không làm được: ～あげく, ～末（に）, ～たところ, ～ところだった, ～ずじまい, ～きり, ～ことなく. 150 từ vựng về sự cố, tìm kiếm, truy đuổi, đồ thất lạc và cảm xúc khi gặp chuyện, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Kết cục', 'Ngoài dự định', 'Không làm được'],
    textbook: 'Original LearnJP — N2 how events unfold',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Kết cục, phát hiện và điều không xảy ra',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N2-15 và các mẫu ～たら, ～たところだ (N4), ～結果, ～そうになる, ～ないまま, ～たまま, ～ないで／～ずに (N3). Mục tiêu: kể lại diễn biến một sự việc theo thứ tự, đọc bản tin tai nạn, cứu hộ, nói về chuyện suýt xảy ra và điều tiếc nuối. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Sự cố, tìm kiếm, cứu hộ, truy đuổi, đồ thất lạc và cảm xúc khi gặp chuyện. Cặp dễ nhầm: 捜索 (tìm người, vật bị mất) / 捜査 (điều tra vụ án); 逃亡 (trốn đi xa) / 逃走 (bỏ chạy); 遭難 / 遭遇; 間一髪 / 危機一髪; 勘違い / 思い違い / 見間違い / 聞き間違い; 呆然 / 唖然; 中断 (tạm dừng) / 打ち切り (chấm dứt) / 断念 (từ bỏ).',
      '20 chữ mới: 歳 難 追 末 極 捜 完 探 逃 暮 偶 沈 鳴 凍 乳 煙 紅 郊 冊 菜. Từ ghép trọng tâm: 歳月, お歳暮, 遭難, 難航, 追跡, 追及, 結末, 始末, 極めて, 捜索, 完成, 完璧, 探る, 探検, 逃亡, 途方に暮れる, 偶数, 沈没, 共鳴, 凍結, 乳児, 煙突, 口紅, 郊外, 冊子, 山菜. Chú ý: お歳暮 đọc おせいぼ, 行方 đọc ゆくえ, 顛末 đọc てんまつ, 案の定 đọc あんのじょう.',
      '7 mục: ～あげく; ～末（に）; ～たところ; ～ところだった; ～ずじまい; ～きり; ～ことなく. So sánh: あげく (kết quả xấu) / 末に / 結果; たところ (phát hiện) / たら / たところだ (vừa xong); ところだった / そうになった; ずじまい / ないまま; たきり / たまま / だけ; ことなく / ないで・ずに.',
      'Hội thoại tự soạn ở công ty sau một cuộc họp dài và giữa hai bạn sau chuyến du lịch. Chú giải: 取引先（とりひきさき）đối tác; 本番 lúc triển khai thật; 一から từ đầu; 流氷 băng trôi; スリップ trượt bánh.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 奪う cướp; パトカー xe cảnh sát; 映像（えいぞう）hình ảnh; 身分証明書 giấy tờ tùy thân; ぎりぎり sát nút; 目覚まし đồng hồ báo thức.',
      'Bài 1 là bản tin cứu hộ người leo núi; bài 2 là tùy bút về chiếc ví được trả lại. Chú giải: 延べ tổng số lượt; 態勢（たいせい）lực lượng; 命に別状はない không nguy hiểm tính mạng; 油断（ゆだん）chủ quan; 言い聞かせる tự nhủ; 定期券 vé tháng.',
      'Bài 1: kể chuyện khoảng 250 ký tự (です・ます). Bài 2: bài nghị luận khoảng 400 ký tự (だ・である). Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: kể kết cục xấu bằng あげく và kết quả sau cố gắng bằng 末に; kể phát hiện bằng たところ; nói chuyện suýt xảy ra bằng ところだった; nói điều tiếc nuối bằng ずじまい; nói “từ đó không…” bằng たきり; khen sự bền bỉ bằng ことなく. Bài tiếp theo (N2-17): đánh giá và khẳng định.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); kể diễn biến theo trình tự rõ ràng, có kết cục và bài học (30%); văn phong phù hợp người đọc (15%). Không có điểm tự động.',
  });
