import * as content from '../../../content/n1/n1-05.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 84001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-05',
    unitNumber: 5,
    moduleId,
    levelId,
    stamp: '2026-11-30T00:00:00.000Z',
    title: 'Pháp luật và công lý',
    titleJp: '法と正義',
    description:
      'N1-05: tòa án, tố tụng, hình phạt, quy định và quyền; các mẫu cấm đoán, chuẩn mực và văn bản pháp lý: ～べからず, ～まじき, ～に則って, ～に照らして, ～に即して, ～ものとする, ～てしかるべきだ, ～てはばからない. 150 từ vựng pháp luật, 46 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Tòa án', 'Quy định', 'Không được phép'],
    textbook: 'Original LearnJP — N1 law and justice',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '46 Hán tự mới',
      'Cấm đoán, chuẩn mực, văn bản luật',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: N1-01 đến N1-04 và các mẫu ～てはいけない, ～べきだ, ～に基づいて, ～に沿って, ～こと (nội quy). Mục tiêu: hiểu tin tức về xét xử, đọc điều khoản quy định và hợp đồng, nêu chuẩn mực và phê phán hành vi sai trái bằng văn phong trang trọng; viết về một quy định cần thay đổi và bài nghị luận về chế độ hội thẩm. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng pháp luật: tòa án và tố tụng (起訴, 公判, 審理, 控訴, 上告, 再審), các bên (原告, 被告人, 被疑者, 弁護人, 検察官), chứng cứ (証言, 供述, 自白, 物証, 立証), hình phạt (懲役, 執行猶予, 量刑, 求刑, 罰則), dân sự (賠償, 慰謝料, 示談), xử lý kỷ luật (懲戒, 戒告). Cặp dễ nhầm: 被疑者 (nghi phạm, chưa khởi tố) / 被告人 (đã bị khởi tố); 控訴 (kháng cáo lên tòa cao hơn) / 上告 (lên Tòa tối cao); 告訴 (nạn nhân tố cáo) / 告発 (người thứ ba tố giác); 過失 / 故意; 刑事 / 民事.',
      '46 chữ mới: 裁 審 刑 芝 典 訟 懇 罰 懲 獄 伐 隷 婿 爵 括 謝 孝 駆 透 壁 仮 裂 敏 是 排 裕 堅 綱 賀 扱 顧 看 戒 祉 誉 歓 奏 勧 騒 閥 縄 揺 既 薦 隣 範. Chú ý cách đọc: 罰が当たる ばちがあたる, 仮病 けびょう, 功を奏する こうをそうする, 縄張り なわばり, 則って のっとって (khác 即して そくして).',
      '8 mục: ～べからず; ～まじき; ～に則って; ～に照らして; ～に即して; ～ものとする; ～てしかるべきだ; ～てはばからない. So sánh: べからず (cấm tuyệt đối, văn cổ) / てはいけない / べきではない; まじき (hành vi không được phép) / ともあろう (N1-02); に則って (theo luật lệ) / に照らして (đối chiếu chuẩn để phán đoán) / に即して (sát thực tế) / に基づいて; ものとする (văn bản pháp lý) / こと (nội quy); てしかるべきだ / べきだ.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 実感（じっかん）cảm nhận thực sự; 言い聞かせる（いいきかせる）tự nhủ; 管理規約（かんりきやく）quy chế quản lý; 管理組合（かんりくみあい）ban quản trị chung cư.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 強盗殺人（ごうとうさつじん）cướp của giết người; 開示（かいじ）công khai; 弁護団（べんごだん）đội luật sư; 辞退（じたい）từ chối; 就業規則（しゅうぎょうきそく）nội quy làm việc; 副業（ふくぎょう）nghề phụ; 届け出る（とどけでる）khai báo.',
      'Bài 1 là xã luận về chế độ tái thẩm; bài 2 là tiểu luận về nội quy trường học. Chú giải: 汚名を晴らす（おめいをはらす）rửa oan; 抗告（こうこく）kháng nghị; 疑わしきは被告人の利益に nghi ngờ thì có lợi cho bị cáo; 理不尽（りふじん）phi lý; 一律（いちりつ）đồng loạt; またとない có một không hai.',
      'Bài 1: đoạn văn khoảng 300 ký tự về một quy định bạn muốn thay đổi. Bài 2: bài nghị luận khoảng 550 ký tự “người dân có nên tham gia xét xử?”, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: đọc biển cấm べからず và cụm 欠くべからざる; phê phán hành vi bằng にあるまじき; phân biệt に則って, に照らして, に即して; viết một điều khoản bằng ものとする; nêu điều đương nhiên bằng てしかるべきだ; mô tả thái độ không kiêng dè bằng てはばからない. Bài tiếp theo (N1-06): khoa học tiên phong.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
