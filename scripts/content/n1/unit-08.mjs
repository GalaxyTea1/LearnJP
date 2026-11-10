import * as content from '../../../content/n1/n1-08.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 87001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-08',
    unitNumber: 8,
    moduleId,
    levelId,
    stamp: '2026-12-03T00:00:00.000Z',
    title: 'Văn học và phê bình',
    titleJp: '文学と批評',
    description:
      'N1-08: tác phẩm văn học, thơ ca, phê bình và xuất bản; các mẫu so sánh, miêu tả dáng vẻ và “nhân tiện”: ～ごとき／～ごとく, ～んばかりに, ～とばかりに, ～めく, ～ながらに, ～かたがた, ～かたわら, ～がてら. 150 từ vựng văn học, 46 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tác phẩm văn học', 'Phê bình', 'Như thể'],
    textbook: 'Original LearnJP — N1 literature and criticism',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '46 Hán tự mới',
      'Như thể, dáng vẻ, nhân tiện',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-07 và các mẫu ～ように, ～そうになる, ～らしい, ～ながら, ～ついでに. Mục tiêu: đọc bình luận văn học và tiểu luận, hiểu cách miêu tả trong văn chương; dùng các mẫu so sánh, miêu tả dáng vẻ, hai hoạt động song song; viết giới thiệu một cuốn sách và bài nghị luận về sách giấy. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng văn học: thể loại (純文学, 私小説, 随筆, 戯曲, 短歌, 寓話, 紀行文), kỹ thuật viết (描写, 比喩, 擬人法, 伏線, 余韻, 文体, 推敲), phê bình (評論, 再評価, 注釈, 処女作, 遺作), xuất bản (刊行, 重版, 絶版, 単行本, 文庫本, 印税, 盗作). Cặp dễ nhầm: 韻文 / 散文; 文語 / 口語; 執筆 (chấp bút) / 推敲 (gọt giũa); 名作 / 傑作 / 代表作; 叙情的 / 叙事詩.',
      '46 chữ mới: 評 描 詩 簿 帳 粋 詠 妄 楷 賦 励 縦 蓄 軸 巡 稼 瞬 砲 噴 誇 祥 牲 秩 唆 阻 泰 撲 堀 菊 絞 縁 唯 膨 矢 耐 塾 漏 慶 猛 芳 彰 棋 恒 揚 冒 曽. Chú ý cách đọc: 几帳面 きちょうめん, 相撲 すもう, 縁側 えんがわ, 雨漏り あまもり, 未曽有 みぞう, 粋 いき; 堀 chỉ có âm kun ほり.',
      '8 mục: ～ごとき／～ごとく; ～んばかりに; ～とばかりに; ～めく; ～ながらに; ～かたがた; ～かたわら; ～がてら. So sánh: ごとく / ような (văn nói), 私ごとき (khiêm tốn); んばかりに (gần như sắp làm) / とばかりに (như muốn nói); めく / らしい; ながらに (giữ nguyên trạng thái) / ながら (vừa…vừa); かたがた (lịch sự, một lần) / がてら (nhân tiện, thường đi lại) / かたわら (song song lâu dài) / ついでに.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 引き込まれる（ひきこまれる）bị cuốn vào; 甲斐がある（かいがある）đáng công; 課題図書（かだいとしょ）sách được giao đọc; 退屈（たいくつ）nhàm chán.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 選考委員（せんこういいん）hội đồng tuyển chọn; 絆（きずな）sợi dây gắn kết; 抑制（よくせい）kiềm chế; 気配（けはい）dấu hiệu, hơi hướng; こき下ろす chê tơi bời.',
      'Bài 1 là bình luận về phê bình văn học thời mạng xã hội; bài 2 là tiểu luận về một tiệm sách cũ. Chú giải: 一喜一憂（いっきいちゆう）lúc mừng lúc lo; 口コミ（くちコミ）truyền miệng; けなす chê bai; 霧が晴れる（きりがはれる）sương tan; 痕跡（こんせき）dấu vết; 手あか vết tay; 胸がいっぱいになる nghẹn lòng.',
      'Bài 1: đoạn văn khoảng 300 ký tự giới thiệu cuốn sách đã ảnh hưởng tới bạn. Bài 2: bài nghị luận khoảng 550 ký tự “Sách giấy có còn cần thiết?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: so sánh bằng ごとく／ごとき; miêu tả mức độ bằng んばかりに và thái độ bằng とばかりに; dùng めく với 春, 謎, 皮肉; nói trạng thái giữ nguyên bằng 涙ながらに, 昔ながらの; phân biệt かたがた, かたわら, がてら. Bài tiếp theo (N1-09): ngôn ngữ học.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
