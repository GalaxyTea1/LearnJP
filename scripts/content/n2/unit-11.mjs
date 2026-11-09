import * as content from '../../../content/n2/n2-11.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 70001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-11',
    unitNumber: 11,
    moduleId,
    levelId,
    stamp: '2026-11-17T00:00:00.000Z',
    title: 'Tin tức và báo chí',
    titleJp: 'ニュースと報道',
    description:
      'N2-11: bản tin, suy đoán và nguồn tin: ～とされる, ～とみられる, ～ものと思われる, ～とか, ～に決まっている, ～かのようだ／～かのように, ～ようでは. 150 từ vựng về tin tức, báo chí và tin đồn, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Bản tin', 'Suy đoán', 'Nguồn tin'],
    textbook: 'Original LearnJP — N2 news and reporting',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Suy đoán, truyền đạt và nguồn tin',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N2-10 và N3 (～と言われている, ～ようだ, ～らしい, ～に違いない, ～そうだ 伝聞). Mục tiêu: hiểu bản tin và bài báo, phân biệt điều đã xác định với điều chỉ là suy đoán, kể lại tin nghe được, nói về tin đồn một cách thận trọng. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Tin tức, báo chí, truyền hình, tin đồn và mạng xã hội. Cặp dễ nhầm: 誤報 (tin sai) / 訂正 (đính chính); 推定 (ước tính) / 断定 (khẳng định chắc); 判明 (được làm rõ) / 発覚 (bị phát giác, thường là chuyện xấu); 朝刊 / 夕刊 / 号外; 視聴者 / 視聴率; 偏向 (thiên lệch) / 誇張 (phóng đại).',
      '20 chữ mới: 圧 著 詰 裏 徒 築 混 昇 池 居 雑 招 困 星 永 庫 香 更 坂 刻. Từ ghép trọng tâm: 圧力, 低気圧, 著者, 著名, 缶詰, 行き詰まる, 舞台裏, 裏切る, 生徒, 徒労, 建築, 混同, 混在, 住居, 芝居, 雑誌, 困難, 衛星, 永遠, 倉庫, 香り, 今更, 下り坂, 時刻, 刻一刻. Chú ý: 居間 đọc いま, 図星 đọc ずぼし, 缶詰 đọc かんづめ (づ), 特ダネ viết カタカナ ở ダネ.',
      '7 mục: ～とされる; ～とみられる; ～ものと思われる; ～とか; ～に決まっている; ～かのようだ／～かのように; ～ようでは. So sánh: とされる (nhận định chung, chính thức) / と言われている; とみられる (suy đoán từ dữ kiện) / ようだ・らしい; ものと思われる (văn viết) / と思う; とか (nghe đâu) / そうだ 伝聞; に決まっている (chủ quan) / に違いない / はずだ; かのようだ (như thể) / ようだ; ようでは / ては.',
      'Hội thoại tự soạn ở tòa soạn báo và giữa bạn bè. Chú giải: 放火（ほうか）phóng hỏa; 消防（しょうぼう）cứu hỏa; 配線（はいせん）đường dây điện; 書き直す viết lại; 俳優（はいゆう）diễn viên.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 予報士 chuyên gia dự báo; 山沿い vùng ven núi; 体調を崩す mệt trong người; 消し止める dập tắt; 出火（しゅっか）phát lửa.',
      'Bài 1 là bản tin về tai nạn tàu hỏa; bài 2 là bài bình luận về cách đọc tin tức. Chú giải: 脱線（だっせん）trật bánh; 土砂（どしゃ）đất đá; 見合わせる tạm ngừng; 迂回（うかい）đi vòng; 出どころ nguồn gốc; 閲覧数 lượt xem.',
      'Bài 1: bình luận khoảng 250 ký tự (です・ます). Bài 2: bài nghị luận khoảng 400 ký tự (だ・である). Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: đọc một bản tin và chỉ ra câu nào đã xác định, câu nào là suy đoán (とされる, とみられる, ものと思われる); kể lại một tin nghe được bằng とか; nói chắc chắn bằng に決まっている; so sánh “như thể” bằng かのように; cảnh báo bằng ようでは. Bài tiếp theo (N2-12): vấn đề xã hội.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); phân biệt rõ sự thật, suy đoán và ý kiến (30%); văn phong phù hợp người đọc (15%). Không có điểm tự động.',
  });
