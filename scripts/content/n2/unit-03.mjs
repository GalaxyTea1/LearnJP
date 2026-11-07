import * as content from '../../../content/n2/n2-03.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 62001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-03',
    unitNumber: 3,
    moduleId,
    levelId,
    stamp: '2026-11-09T00:00:00.000Z',
    title: 'Kinh doanh và hợp đồng',
    titleJp: 'ビジネスと契約',
    description:
      'N2-03: đàm phán, hợp đồng, thanh toán và kết quả kinh doanh: ～に基づいて, ～をもとに（して）, ～に沿って, ～に応じて, ～を中心に（して）, ～をめぐって, ～にかけては. 150 từ vựng về thương mại và hợp đồng, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Đàm phán giá', 'Đọc hợp đồng', 'Kết quả kinh doanh'],
    textbook: 'Original LearnJP — N2 business and contracts',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Căn cứ, phạm vi và tranh luận',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N2-02 và N3 (～によって, ～について, ～から～にかけて, ～をはじめ). Mục tiêu: đàm phán giá bằng kính ngữ, đọc điều khoản của một hợp đồng mua bán, nghe báo cáo kết quả kinh doanh. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Thương mại, hợp đồng, thanh toán, kế toán và đàm phán. Cặp dễ nhầm: 発注 (đặt hàng) / 受注 (nhận đơn); 前払い / 後払い; 原価 (giá vốn) / 定価 (giá niêm yết) / 単価 (đơn giá); 解約 (hủy hợp đồng, phía khách) / 解除 (chấm dứt theo điều khoản); 無償 / 有償.',
      '20 chữ mới: 商 貿 貨 純 球 与 供 補 収 石 消 導 備 宅 算 育 訪 述 残 想. Từ ghép trọng tâm: 商談, 貿易, 通貨, 純利益, 電球, 関与, 提供, 供給, 補償, 収益, 回収, 石油, 解消, 導入, 不備, 自宅, 採算, 決算, 育成, 訪問, 記述, 残高, 想定. Chú ý: 商う đọc あきなう, 補う đọc おぎなう, 残高 đọc ざんだか.',
      '7 mục: ～に基づいて; ～をもとに（して）; ～に沿って; ～に応じて; ～を中心に（して）; ～をめぐって; ～にかけては. So sánh: に基づいて (bám căn cứ) / をもとに (lấy làm chất liệu); に応じて (điều chỉnh cho tương xứng) / によって; をめぐって (có tranh luận) / について; にかけては (sở trường) / から～にかけて (khoảng thời gian, không gian).',
      'Hội thoại tự soạn trong công việc. Chú giải: まとまった量 số lượng lớn; 上と相談する bàn với cấp trên; もめる lộn xộn, tranh cãi; 理屈（りくつ）lý lẽ; お付き合い quan hệ giao dịch.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 今期（こんき）kỳ này; 横ばい đi ngang; 生産体制（せいさんたいせい）hệ thống sản xuất; 反論（はんろん）phản bác; 長引く（ながびく）kéo dài.',
      'Bài 1 là trích đoạn hợp đồng nguyên tắc mua bán; bài 2 là bài báo về một cửa hàng nhỏ. Chú giải: 甲・乙（こう・おつ）Bên A, Bên B; やむを得ない bất khả kháng; 漏らす（もらす）tiết lộ; 仕入れる nhập hàng; 品ぞろえ sự phong phú hàng hóa; かなわない không bì được.',
      'Bài 1: email khoảng 250 ký tự (kính ngữ). Bài 2: bài viết khoảng 400 ký tự (だ・である). Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: nói căn cứ của một quyết định bằng に基づいて; kể một sản phẩm ra đời từ ý kiến khách bằng をもとに; nói làm theo kế hoạch bằng に沿って; nói giá thay đổi theo số lượng bằng に応じて; nêu thị trường chính bằng を中心に; tóm tắt một tranh chấp bằng をめぐって; khen sở trường của ai bằng にかけては. Bài tiếp theo (N2-04): văn bản trang trọng.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); bố cục rõ ràng, đủ ý (30%); văn phong phù hợp người đọc (15%). Không có điểm tự động.',
  });
