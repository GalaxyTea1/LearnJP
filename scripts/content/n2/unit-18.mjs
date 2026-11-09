import * as content from '../../../content/n2/n2-18.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';

export const moduleId = 77001,
  levelId = 60001;

export const buildUnit = () =>
  buildLessonRows(content, {
    level: 'N2',
    code: 'N2-18',
    unitNumber: 18,
    moduleId,
    levelId,
    stamp: '2026-11-24T00:00:00.000Z',
    title: 'Sở thích và chủ đề',
    titleJp: '趣味と話題',
    description:
      'N2-18: sở thích, nêu ví dụ và “vừa mới… thì”: ～というと／～といえば, ～といったら, ～など／～なんか／～なんて, ～やら～やら, ～かと思うと／～かと思ったら, ～か～ないかのうちに, ～げ. 150 từ vựng về sở thích, sưu tầm, làm vườn, câu cá và văn hóa người hâm mộ, 20 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Sở thích', 'Nêu ví dụ', 'Vừa mới… thì'],
    textbook: 'Original LearnJP — N2 hobbies and topics',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '20 Hán tự mới',
      'Chủ đề, nhấn mạnh, ví dụ và trình tự',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N2-17 và các mẫu ～について, ～など, ～とか～とか, ～たり～たり, ～そう (N4), ～たとたん (N3). Mục tiêu: nói chuyện về sở thích, chuyển đề tài tự nhiên, nhấn mạnh cảm xúc, kể chuyện diễn ra nhanh, đọc chuyên đề và tùy bút về sở thích. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Sở thích, sưu tầm, nghệ thuật, làm vườn, câu cá, thú nuôi và văn hóa người hâm mộ. Cặp dễ nhầm: 素人 (nghiệp dư) / 玄人 (sành nghề); はまる / 凝る / 夢中になる / 熱中 / 没頭; 推し (người mình ủng hộ) / 推し活 (hoạt động ủng hộ); 枯れる / 枯らす; 漁師 đọc りょうし (không phải ぎょし).',
      '20 chữ mới: 額 児 庭 絵 遊 漁 匹 隻 畜 氷 乾 棒 祈 忙 拾 粉 糸 綿 才 銅. Từ ghép trọng tâm: 金額, 額縁, 庭園, 絵画, 遊園地, 遊び心, 漁師, 漁業, 匹敵, 家畜, 畜産, 氷河, かき氷, 鉄棒, 祈る, 多忙, 収拾, 小麦粉, 毛糸, 糸口, 木綿, 綿密, 天才, 銅像. Chú ý: 麻雀 đọc マージャン, 木綿 đọc もめん, 匹 đổi âm: いっぴき／さんびき.',
      '7 mục: ～というと／～といえば; ～といったら; ～など／～なんか／～なんて; ～やら～やら; ～かと思うと／～かと思ったら; ～か～ないかのうちに; ～げ. So sánh: といえば (liên tưởng) / といったら (nhấn mạnh mức độ) / について; なんか・なんて (khiêm tốn, xem nhẹ, ngạc nhiên) / など (liệt kê); やら～やら / とか～とか; かと思うと / たとたん / か～ないかのうちに; げ / そう.',
      'Hội thoại tự soạn giữa đồng nghiệp nói về sở thích cuối tuần và giữa mẹ với con trai. Chú giải: 同好会 hội cùng sở thích; 作品展 triển lãm tác phẩm; 足の踏み場もない không có chỗ đặt chân; 夜更かし thức khuya.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 上位 thứ hạng cao; 目立つ nổi bật; こねる nhào; 形が崩れる méo hình; 整う đều đặn; 竿 cần câu; 悔しい tức tối.',
      'Bài 1 là chuyên đề về văn hóa ủng hộ thần tượng; bài 2 là tùy bút về vườn rau ban công. Chú giải: 幅広い rộng rãi; 出し合う góp; 背景（はいけい）bối cảnh; どうせ đằng nào cũng; 比べものにならない không thể so sánh; ごちそう bữa ngon.',
      'Bài 1: giới thiệu sở thích khoảng 250 ký tự (です・ます). Bài 2: bài nghị luận khoảng 400 ký tự (だ・である). Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: chuyển đề tài bằng といえば; nhấn mạnh cảm xúc bằng といったら; khiêm tốn bằng 私なんか và ngạc nhiên bằng なんて; kể sự bận rộn bằng やら～やら; kể việc xảy ra liên tiếp bằng かと思うと và か～ないかのうちに; miêu tả tâm trạng người khác bằng げ. Bài tiếp theo (N2-19): thử thách và quyết tâm.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (35%); có trải nghiệm cụ thể và cảm nghĩ (30%); văn phong phù hợp người đọc (15%). Không có điểm tự động.',
  });
