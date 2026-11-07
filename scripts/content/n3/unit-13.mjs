import * as content from '../../../content/n3/n3-13.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n3Format } from './format.mjs';

export const moduleId = 42001,
  levelId = 30001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n3Format,
    level: 'N3',
    code: 'N3-13',
    unitNumber: 13,
    moduleId,
    levelId,
    stamp: '2026-11-11T00:00:00.000Z',
    title: 'Bảo vệ trái đất',
    titleJp: '地球を守る',
    description:
      'N3-13: môi trường và giả định: ～場合（は）, ～としたら／とすれば, ～さえ～ば, ～かぎり, ～ないかぎり, たとえ～ても, ～ないと. Rác và tái chế, năng lượng, khí hậu, thiên tai; 24 Hán tự về môi trường. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Môi trường', 'Giả định và điều kiện', 'Thiên tai'],
    textbook: 'Original LearnJP — N3 environment and supposition',
    sectionTitles: [
      'Mục tiêu và cách học',
      '105 từ vựng mới',
      '24 Hán tự mới',
      'Giả định và điều kiện',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N5, N4 (と／たら／なら／ば ở N4-08) và N3-01 đến N3-12 (～ても ở N3-01). Mục tiêu: nói trường hợp và quy định, giả định một tình huống, nói điều kiện tối thiểu, giới hạn và ngoại lệ, nhượng bộ mạnh; viết đề xuất giải pháp cho vấn đề môi trường. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Môi trường và ô nhiễm, rác và tái chế, năng lượng, khí hậu và thiên tai, hành động. Cặp gần nghĩa: 汚染 (ô nhiễm do chất bẩn) / 公害 (ô nhiễm gây hại cho cư dân); 削減 (cắt giảm có kế hoạch) / 減らす; 避難 (sơ tán khỏi nguy hiểm) / 逃げる; 保護 (bảo vệ thứ yếu) / 守る; 捨てる / ポイ捨て (vứt bừa bãi).',
      '24 chữ mới: 環境源 森林植葉 燃捨汚染 守保護 震波候届 酸素炭灰 暴荒. Từ ghép trọng tâm: 環境（かんきょう）, 資源, 森林, 植物, 燃える, 捨てる, 汚染（おせん）, 保護, 地震, 震度, 津波, 気候, 届け出, 酸素（さんそ）, 二酸化炭素, 灰, 暴風, 荒れる. Chú ý 守 đọc まもる, 素 đọc そ trong 酸素.',
      '7 mục: ～場合（は）; ～としたら／とすれば; ～さえ～ば; ～かぎり（は）; ～ないかぎり; たとえ～ても; ～ないと（～ない）. So sánh: としたら／とすれば nhấn giả định tách khỏi thực tế, たら dùng được cả cho việc chắc chắn xảy ra, ば nhấn điều kiện; 場合 không dùng cho việc chắc chắn xảy ra một lần.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 取り組み（とりくみ）nỗ lực, biện pháp; 照明（しょうめい）đèn chiếu sáng; 冷房（れいぼう）máy lạnh; 設定（せってい）cài đặt; 無理（むり）quá sức; 容器（ようき）hộp đựng.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 避難（ひなん）sơ tán; 警報（けいほう）cảnh báo; 軍手（ぐんて）găng tay vải; 触る（さわる）chạm; 意外と bất ngờ là; 楽（らく）nhàn.',
      'Chú giải bài 1: 紫外線（しがいせん）tia tử ngoại; 砕ける（くだける）vỡ vụn; 上回る（うわまわる）vượt quá; 水筒（すいとう）bình nước; 意識（いしき）ý thức. Bài 2: 屋根（やね）mái nhà; 支援（しえん）hỗ trợ; 役場（やくば）ủy ban; 業者（ぎょうしゃ）đơn vị thi công; 停電（ていでん）mất điện.',
      'Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bố cục: vấn đề → nguyên nhân → giải pháp (場合, さえ～ば) → kết luận (ないかぎり, たとえ～ても). Kiểm tra: としたら dùng cho giả định; 場合 không dùng cho việc chắc chắn xảy ra. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói quy định khi có động đất bằng 場合は; giả định không có điện bằng としたら; nói điều kiện tối thiểu bằng さえ～ば; nói giới hạn bằng かぎり và ないかぎり; nhượng bộ bằng たとえ～ても. Bài tiếp theo (N3-14): tin tức và truyền đạt lại (によると, ということだ).',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); nêu rõ vấn đề và giải pháp, chọn đúng としたら／場合／ないかぎり (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',
    quiz: {
      vocab: 3,
      kanji: 3,
      grammar: [0, 2, 3, 4, 6, 8, 10, 11, 12, 13, 14],
      listen: [0, 2, 3, 4],
      read: [0, 2, 3, 4],
    },
  });
