import * as content from '../../../content/n2/n2-02.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 61001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-02',
    unitNumber: 2,
    moduleId,
    levelId,
    stamp: '2026-11-08T00:00:00.000Z',
    title: 'Thói quen và xu hướng',
    titleJp: '生活習慣と傾向',
    description:
      'N2-02: thói quen sinh hoạt, giấc ngủ, ăn uống và xu hướng xã hội: ～がちだ, ～気味, ～傾向にある, ～つつある, ～かける／～かけの, ～きる／～きれない, ～ぬく. 150 từ vựng về sinh hoạt hằng ngày và số liệu khảo sát, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Nếp sinh hoạt', 'Xu hướng thay đổi', 'Làm đến cùng'],
    textbook: 'Original LearnJP — N2 habits and tendencies',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Khuynh hướng và mức độ',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N2-01 và N3 (～やすい, ～っぽい, ～ている, ～終わる). Mục tiêu: nói về thói quen của bản thân, mô tả xu hướng từ số liệu khảo sát, kể về việc duy trì một mục tiêu đến cùng. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Giấc ngủ, ăn uống, tắm, quần áo, dọn dẹp và từ chỉ xu hướng trong báo cáo. Cặp dễ nhầm: 寝坊 (ngủ dậy muộn) / 二度寝 (ngủ lại sau khi đã thức) / 夜更かし (thức khuya); 作り置き (nấu sẵn để dành) / 惣菜 (món làm sẵn mua về); 増加傾向 / 減少傾向; 億劫 (ngại làm) / 面倒くさい (phiền, khẩu ngữ hơn).',
      '20 chữ mới: 側 清 傾 寝 浴 柔 衣 湯 組 在 団 所 打 直 両 革 村 再 流 常. Từ ghép trọng tâm: 両側, 縁側, 清潔, 傾く, 寝つき, 入浴, 浴びる, 柔らかい, 衣類, 湯船, 銭湯, 組み合わせ, 在宅, 滞在, 団地, 居場所, 打ち明ける, 両立, 改革, 農村, 流行, 常に. Chú ý: 衣替え đọc ころもがえ, 湯気 đọc ゆげ, 流行る đọc はやる.',
      '7 mục: ～がちだ; ～気味; ～傾向にある; ～つつある; ～かける／～かけの; ～きる／～きれない; ～ぬく. So sánh: がち (hay lặp lại) / 気味 (hơi… lúc này); 傾向にある (xu hướng chung, văn viết) / がち (cảm nhận đời thường); つつある (quá trình thay đổi) / ている; きる (làm hết) / ぬく (vượt khó làm đến cùng).',
      'Hội thoại tự soạn giữa đồng nghiệp và bạn bè. Chú giải: つかる ngâm mình; 報告し合う báo cho nhau; クローゼット tủ quần áo; 寄付（きふ）quyên tặng.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 専門家（せんもんか）chuyên gia; 頼る（たよる）dựa vào; フルマラソン marathon 42 km; 距離（きょり）quãng đường; 伸びる（のびる）dài ra.',
      'Bài 1 là báo cáo khảo sát của thành phố; bài 2 là tản văn kể chuyện duy trì thói quen. Chú giải: 対象（たいしょう）đối tượng; 割合（わりあい）tỷ lệ; 上る（のぼる）lên tới; 投げ出す（なげだす）bỏ dở; 完璧（かんぺき）hoàn hảo.',
      'Bài 1: lời khuyên cho bạn khoảng 250 ký tự (です・ます). Bài 2: bài viết khoảng 400 ký tự (だ・である). Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói một thói quen xấu bằng がち; tả thể trạng hôm nay bằng 気味; đọc một câu số liệu có 傾向にある, つつある; nói việc làm dở bằng かけの; nói việc không làm hết bằng きれない; kể một việc làm đến cùng bằng ぬく. Bài tiếp theo (N2-03): kinh doanh và hợp đồng.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); bố cục rõ ràng, đủ ý (30%); văn phong phù hợp người đọc (15%). Không có điểm tự động.',
  });
