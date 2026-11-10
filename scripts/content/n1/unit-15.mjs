import * as content from '../../../content/n1/n1-15.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 94001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-15',
    unitNumber: 15,
    moduleId,
    levelId,
    stamp: '2026-12-10T00:00:00.000Z',
    title: 'Truyền thông và xã hội thông tin',
    titleJp: 'メディアと情報社会',
    description:
      'N1-15: báo chí, mạng xã hội, tin giả, quyền riêng tư và an ninh mạng; các mẫu về lợi dụng, viện cớ, phản bác và phán đoán: ～をいいことに, ～にかこつけて, ～ではあるまいし, ～んじゃあるまいし, ～だの～だの, ～かと思えば, ～と見える, ～と見るや. 150 từ vựng truyền thông và xã hội thông tin, 45 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Mạng xã hội', 'Tin giả', 'Lợi dụng'],
    textbook: 'Original LearnJP — N1 media and the information society',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '45 Hán tự mới',
      'Lợi dụng, viện cớ, phán đoán',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-14 và các mẫu ～を利用して, ～を口実に, ～わけではない, ～とか～とか, ～と思ったら, ～ようだ, ～や否や. Mục tiêu: hiểu tin tức về phỉ báng trên mạng, bài giảng về bong bóng lọc, xã luận về AI tạo sinh và tin giả, tiểu luận về cai nghiện mạng xã hội; phê phán việc lợi dụng, viện cớ, phản bác và phán đoán từ quan sát; viết về cách dùng mạng xã hội và bài nghị luận về chế độ tên thật. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng truyền thông và xã hội thông tin: báo chí (調査報道, 取材源, 編集方針, 中立性, 速報, 続報, 報道被害, メディアスクラム), mạng xã hội (書き込み, 誹謗中傷, 炎上商法, バズる, インフルエンサー, 既読スルー), thông tin giả (偽情報, 誤情報, 陰謀論, ファクトチェック, 一次情報, 風評被害, ディープフェイク), quyền riêng tư và an ninh (情報漏洩, 監視社会, なりすまし, 乗っ取り, 二段階認証). Cặp dễ nhầm: 偽情報 (cố ý) / 誤情報 (nhầm lẫn); 発信者 / 受け手; うのみにする / 真に受ける; 公共放送 / 民放.',
      '45 chữ mới: 模 促 稿 媒 痕 謄 抄 垂 蛇 澄 縫 凡 憩 媛 溝 恭 刈 睡 錯 伯 柿 霧 弊 妃 舶 腎 窮 掌 臭 釜 悦 縛 暦 宜 盲 辱 轄 弦 窒 摂 飽 冗 桃 狩 朱. Chú ý cách đọc: 蛇口 じゃぐち, 蛇足 だそく, 凡例 はんれい, 伯父 おじ, 還暦 かんれき, 宜しく よろしく, 紅葉狩り もみじがり; 刈, 柿, 釜 chỉ có âm kun.',
      '8 mục: ～をいいことに; ～にかこつけて; ～ではあるまいし; ～んじゃあるまいし; ～だの～だの; ～かと思えば; ～と見える; ～と見るや. So sánh: をいいことに (lợi dụng hoàn cảnh, phê phán) / にかこつけて (viện cớ) / を口実に; ではあるまいし (N) / んじゃあるまいし (V, hội thoại); だの～だの (phàn nàn) / とか～とか / やら～やら; かと思えば / と思ったら; と見える / ようだ / らしい; と見るや / や否や.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 差別的（さべつてき）mang tính phân biệt; 謝罪文（しゃざいぶん）thư xin lỗi; 収まる（おさまる）lắng xuống; 様子を見る chờ xem; 大げさ（おおげさ）làm quá.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 相談窓口（そうだんまどぐち）quầy tư vấn; 後を絶たない（あとをたたない）không dứt; 患う（わずらう）mắc bệnh; 検索サイト（けんさくサイト）trang tìm kiếm; 好き勝手（すきかって）làm bừa.',
      'Bài 1 là xã luận về AI tạo sinh và thông tin giả; bài 2 là tiểu luận về một tuần không mạng xã hội. Chú giải: 見分け（みわけ）phân biệt; 加工（かこう）chỉnh sửa; 決めつける（きめつける）gán cho; 封じる（ふうじる）bịt lại; 虚しさ（むなしさ）sự trống rỗng; 積んだまま chất đống; 肩の力が抜ける nhẹ nhõm.',
      'Bài 1: đoạn văn khoảng 300 ký tự về cách bạn dùng mạng xã hội. Bài 2: bài nghị luận khoảng 550 ký tự “Có nên bắt buộc dùng tên thật trên mạng xã hội?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: phê phán việc lợi dụng bằng をいいことに và viện cớ bằng にかこつけて; trách nhẹ bằng ではあるまいし／んじゃあるまいし; liệt kê phàn nàn bằng だの～だの; kể thay đổi nhanh bằng かと思えば; phán đoán bằng と見える; kể phản ứng nhanh bằng と見るや. Bài tiếp theo (N1-16): nghệ thuật và cái đẹp.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
