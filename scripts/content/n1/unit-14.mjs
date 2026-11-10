import * as content from '../../../content/n1/n1-14.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 93001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-14',
    unitNumber: 14,
    moduleId,
    levelId,
    stamp: '2026-12-09T00:00:00.000Z',
    title: 'Giáo dục đại học và nghiên cứu',
    titleJp: '高等教育と研究',
    description:
      'N1-14: đại học, cao học, luận văn, quỹ nghiên cứu và đời sống nhà nghiên cứu; các mẫu mục đích, quyết tâm và giới hạn: ～べく, ～んがため（に）, ～までだ／～までのことだ, ～ばそれまでだ, ～たらそれまでだ, ～までして, ～てまで, ～にかまけて. 150 từ vựng giáo dục đại học và nghiên cứu, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Đại học', 'Luận văn', 'Để mà'],
    textbook: 'Original LearnJP — N1 higher education and research',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Mục đích, quyết tâm, giới hạn',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-13 và các mẫu ～ために, ～しかない, ～だけだ, ～に夢中で. Mục tiêu: hiểu tin tức về đại học thiếu chỉ tiêu, bài giảng về cách viết luận văn, xã luận về vai trò đại học và tiểu luận của một nhà nghiên cứu; nói mục đích trang trọng, quyết tâm, giới hạn và sự bỏ bê; viết về mục đích học tập và bài nghị luận về khoa nhân văn. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng giáo dục đại học: chương trình (学部生, 院生, 博士課程, 研究生, 教養科目, 選択科目, シラバス), luận văn (研究計画書, 文献調査, 論文指導, 中間発表, 口頭試問, 剽窃), nghiên cứu (定量的, 定性的, 被引用数, 不採択, 科研費, 競争的資金), đời sống học thuật (ポスドク, 任期付き, 非常勤講師, 名誉教授, 退官, 最終講義). Cặp dễ nhầm: 修士 / 博士; 定量的 / 定性的; 給付型 / 貸与型; 実学 / 虚学; 採択 / 不採択.',
      '45 chữ mới: 士 佳 潤 悼 乏 該 赴 桑 髄 虎 盆 壮 傍 疫 累 痴 搬 寸 尿 凶 宴 賓 虜 陶 鐘 憾 磁 弥 粗 訂 芽 尻 傘 騎 寧 循 忍 怠 如 寮 鉛 凝 苗 哀 跳. Chú ý cách đọc: 弥生 やよい, 苗字 みょうじ, 尻込み しりごみ, 虎の巻 とらのまき, 音痴 おんち, 亜鉛 あえん; 尻 chỉ có âm kun.',
      '8 mục: ～べく; ～んがため（に）; ～までだ／～までのことだ; ～ばそれまでだ; ～たらそれまでだ; ～までして; ～てまで; ～にかまけて. So sánh: べく (mục đích, văn viết) / んがため (quyết tâm mạnh) / ために; V辞書形 + までだ (chỉ còn cách) / Vた + までだ (chỉ là…) / しかない; ばそれまでだ (văn viết) / たらそれまでだ (hội thoại); までして (N) / てまで (Vて); にかまけて / に夢中で.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 回収率（かいしゅうりつ）tỉ lệ thu hồi; 気が楽になる（きがらくになる）nhẹ lòng; 先輩（せんぱい）đàn anh, đàn chị; 応援（おうえん）ủng hộ.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 小規模（しょうきぼ）quy mô nhỏ; 生き残る（いきのこる）tồn tại; 写す（うつす）chép; 都合よく（つごうよく）theo hướng có lợi; 留年（りゅうねん）lưu ban.',
      'Bài 1 là xã luận về vai trò của đại học thời giảm sinh; bài 2 là tiểu luận của một nhà nghiên cứu lịch sử. Chú giải: 統合（とうごう）sáp nhập; 前面に押し出す（ぜんめんにおしだす）đưa lên hàng đầu; 説明責任（せつめいせきにん）trách nhiệm giải trình; 古文書（こもんじょ）văn bản cổ; 飢えをしのぐ chống chọi cái đói; 格闘（かくとう）vật lộn.',
      'Bài 1: đoạn văn khoảng 300 ký tự về mục đích học tập của bạn. Bài 2: bài nghị luận khoảng 550 ký tự “Có nên thu hẹp các khoa khoa học nhân văn?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nêu mục đích bằng べく và んがため; nói quyết tâm và thanh minh bằng までだ; cảnh báo bằng ばそれまでだ／たらそれまでだ; phê phán sự quá mức bằng までして／てまで; tự trách bằng にかまけて. Bài tiếp theo (N1-15): truyền thông và xã hội thông tin.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
