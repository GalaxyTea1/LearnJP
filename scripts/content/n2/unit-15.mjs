import * as content from '../../../content/n2/n2-15.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 74001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-15',
    unitNumber: 15,
    moduleId,
    levelId,
    stamp: '2026-11-21T00:00:00.000Z',
    title: 'Văn hóa và truyền thống',
    titleJp: '文化と伝統',
    description:
      'N2-15: lễ hội, phong tục, điều kiện và ngoại lệ: ～にこたえて, ～を～として, ～を除いて, ～に限り, ～とおり（に）, ～ものがある, ～からして. 150 từ vựng về lễ hội, đền chùa, nghệ thuật truyền thống và sự kiện trong năm, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Lễ hội', 'Phong tục', 'Điều kiện và ngoại lệ'],
    textbook: 'Original LearnJP — N2 culture and tradition',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Đáp ứng, vai trò, ngoại lệ và căn cứ',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N2-14 và các mẫu ～として, ～ように (N3), ～以外, ～ことがある (N4), ～に応じて (N2-03), ～に限って (N2-05), ～から見ると／～からすると (N2-09). Mục tiêu: hiểu thông báo ở đền chùa, bảo tàng, đọc phóng sự và tùy bút về văn hóa, giới thiệu phong tục quê hương. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Lễ hội, đền chùa, nghệ thuật truyền thống, nhà kiểu Nhật và sự kiện trong năm. Cặp dễ nhầm: 先祖 / 祖先 (cùng nghĩa, 祖先 trang trọng hơn); 風習 / 慣習 / しきたり; 神主 (đền Thần đạo) / 僧侶 (chùa Phật giáo); 大安 (ngày tốt) / 仏滅 (ngày xấu); 能 / 狂言 / 歌舞伎; 浅い (nông) / 浅はか (nông cạn).',
      '20 chữ mới: 調 章 緑 尊 窓 昔 殿 濃 液 零 祖 幼 杯 黄 臣 浅 掃 掘 皆 軟. Từ ghép trọng tâm: 調和, 勲章, 新緑, 尊い, 同窓会, 昔ながら, 本殿, 御殿, 濃厚, 液体, 零下, 祖国, 幼児, 祝杯, 黄金, 家臣, 浅はか, 発掘, 皆無, 軟化. Chú ý: 黄金 đọc おうごん, 黄砂 đọc こうさ, 老舗 đọc しにせ, 女将 đọc おかみ, 大晦日 đọc おおみそか, 山車 đọc だし.',
      '7 mục: ～にこたえて; ～を～として; ～を除いて; ～に限り; ～とおり（に）; ～ものがある; ～からして. So sánh: にこたえて / に応じて; を～として / として; を除いて / 以外; に限り / に限って / だけ; とおり / どおり / ように; ものがある / ことがある; からして / から見ると.',
      'Hội thoại tự soạn ở lớp trà đạo và trong buổi họp hội bảo tồn lễ hội. Chú giải: 茶碗（ちゃわん）bát trà; 味わう thưởng thức; 落ち着く thanh thản; 儀式（ぎしき）nghi lễ; 貸し出す cho mượn.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: くぐる đi qua (cổng); おじぎ cúi chào; 拍手（はくしゅ）vỗ tay; 衣装（いしょう）trang phục; 好評（こうひょう）được đón nhận tốt; 匂い mùi.',
      'Bài 1 là phóng sự về lễ hội làng được khôi phục; bài 2 là tùy bút về việc giữ hay đổi truyền thống. Chú giải: 高度成長期 thời kỳ tăng trưởng cao; 傷み hư hỏng; 再現（さいげん）tái hiện; 法被（はっぴ）áo lễ hội; 何気なく vô tình; 嘆く than thở; 縁起を担ぐ cầu may.',
      'Bài 1: giới thiệu phong tục khoảng 250 ký tự (です・ます). Bài 2: bài nghị luận khoảng 400 ký tự (だ・である). Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói việc làm theo mong muốn của người khác bằng にこたえて; nêu mục đích, vai trò bằng を～として; viết thông báo bằng を除いて và に限り; làm theo hướng dẫn bằng とおりに; nói cảm nhận bằng ものがある; phán đoán từ một chi tiết bằng からして. Bài tiếp theo (N2-16): diễn biến sự việc.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); giải thích được ý nghĩa, nguồn gốc của phong tục (30%); văn phong phù hợp người đọc (15%). Không có điểm tự động.',
  });
