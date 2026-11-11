import * as content from '../../../content/n1/n1-01.mjs';
import { buildLessonRows } from '../lib/unit-package.mjs';
import { n1Format } from './format.mjs';

export const moduleId = 80001,
  levelId = 80001;

export const buildUnit = () =>
  buildLessonRows(content, {
    ...n1Format,
    level: 'N1',
    code: 'N1-01',
    unitNumber: 1,
    moduleId,
    levelId,
    stamp: '2026-11-26T00:00:00.000Z',
    levelRow: {
      title: 'N1 — Thành thạo toàn diện',
      titleJp: '日本語能力試験 N1',
      description: 'Đã mở N1-01 đến N1-24. Bài 24 là bài tổng ôn có 150 mục từ lặp lại.',
      color: '#E11D48',
      badge: '🗻',
      totalVocab: 150,
      totalKanji: 46,
      totalGrammar: 8,
      sortOrder: 5,
    },
    title: 'Đọc xã luận',
    titleJp: '社説を読む',
    description:
      'N1-01: đọc xã luận, nắm lập luận của tác giả; các mẫu “vừa… liền” và mốc khởi đầu: ～が早いか, ～や否や, ～そばから, ～なり, ～を皮切りに, ～を機に, ～てからというもの, ～をふまえて. 150 từ vựng về lập luận và bình luận, 46 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',
    topics: ['Xã luận', 'Lập luận của tác giả', 'Vừa… liền'],
    textbook: 'Original LearnJP — N1 editorials and argument',
    sectionTitles: [
      'Mục tiêu và cách học',
      '150 từ vựng mới',
      '46 Hán tự mới',
      'Vừa… liền và mốc khởi đầu',
      'Hội thoại',
      'Luyện nghe',
      'Đọc hiểu',
      'Tự luyện viết',
      'Bài tập',
      'Tổng kết',
    ],
    instructions: [
      'Tiên quyết: hoàn thành N2 (đặc biệt ～次第, ～たとたん, ～をきっかけに, ～を契機に, ～に基づいて). Mục tiêu: đọc một bài xã luận, tách được chủ trương, căn cứ và kiến nghị của tác giả; dùng các mẫu văn viết về trình tự tức thời và mốc khởi đầu; viết thư bạn đọc và bài nghị luận ngắn. 48 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.',
      'Từ vựng lập luận và bình luận: luận điểm, căn cứ, thái độ của người viết, cách đánh giá, các phó từ văn viết. Cặp dễ nhầm: 論旨 (luận điểm chính) / 論点 (điểm tranh luận); 懸念 (lo ngại chung) / 危惧 (lo sợ điều xấu) / 憂慮 (quan ngại, rất trang trọng); 容認 (chấp nhận, cho phép) / 是認 (thừa nhận là đúng) / 黙認 (ngầm làm ngơ); 拙速 (vội và cẩu thả) / 性急 (nóng vội); 概して / 総じて (nhìn chung) khác 一概に (đi với phủ định: không thể quy chụp).',
      '46 chữ mới: 訳 廉 氏 第 派 案 策 提 無 検 藤 施 井 展 態 鮮 視 幹 独 衛 監 閣 韓 衆 岡 松 撃 佐 核 整 融 渉 阪 推 請 攻 崎 督 催 離 激 摘 系 郎 従 隊. Nhiều chữ hay gặp trong tên riêng và địa danh (藤, 井, 岡, 松, 佐, 阪, 崎, 郎). Chú ý: 内訳 đọc うちわけ, 天井 đọc てんじょう, 融通 đọc ゆうずう, 葛藤 đọc かっとう, 市井 đọc しせい.',
      '8 mục: ～が早いか; ～や否や; ～そばから; ～なり; ～を皮切りに; ～を機に; ～てからというもの; ～をふまえて. So sánh: が早いか (nhấn tốc độ) / や否や (văn báo chí, phản ứng xã hội) / なり (cùng một người, hành động bất ngờ) / たとたん (N3, hội thoại); そばから (lặp lại, công cốc); を皮切りに (điểm khởi đầu) / をはじめ (ví dụ tiêu biểu); を機に / をきっかけに / を契機に; をふまえて / に基づいて.',
      'Hội thoại tự soạn, tình huống giả định. Chú giải: 段落（だんらく）đoạn văn; 立場（たちば）lập trường; 少子化（しょうしか）giảm sinh; 財源（ざいげん）nguồn tài chính; 連載（れんさい）đăng nhiều kỳ.',
      'Nghe trước, sau đó mới mở bản chép. Chú giải: 評論家（ひょうろんか）nhà bình luận; 見出し（みだし）tiêu đề; 構成（こうせい）cấu trúc; 中小企業（ちゅうしょうきぎょう）doanh nghiệp vừa và nhỏ; 残業（ざんぎょう）làm thêm giờ.',
      'Bài 1 là một bài xã luận về chế độ nghỉ ba ngày mỗi tuần; bài 2 là tiểu luận về cách đọc xã luận. Chú giải: 先駆けて（さきがけて）đi tiên phong; 本末転倒（ほんまつてんとう）đầu đuôi lẫn lộn; 早計（そうけい）vội vàng; 署名記事（しょめいきじ）bài có ký tên; 筋道（すじみち）mạch lập luận.',
      'Bài 1: thư bạn đọc khoảng 300 ký tự, nêu điểm đồng ý và chưa đồng ý. Bài 2: bài nghị luận khoảng 550 ký tự theo cấu trúc xã luận, văn だ・である. Có bài mẫu để so sánh sau khi viết. Bản nháp tự lưu trên trình duyệt.',
      '48 câu: 10 từ vựng, 10 Hán tự, 16 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.',
      'Tự kiểm sau bài: tóm tắt một bài xã luận thành chủ trương, căn cứ, kiến nghị; kể hai việc nối tiếp tức thời bằng が早いか, や否や, なり và giải thích khác biệt; than phiền việc lặp lại bằng そばから; nêu mốc khởi đầu bằng を皮切りに, を機に, てからというもの; viết kiến nghị với をふまえて. Bài tiếp theo (N1-02): triết học và tư tưởng.',
    ],
    rubric:
      'Tự kiểm: đúng độ dài ký tự (20%); dùng đúng các mẫu của bài theo yêu cầu (30%); lập luận có căn cứ, có đề cập ý kiến ngược lại (35%); văn phong thống nhất, phù hợp văn viết (15%). Không có điểm tự động.',
  });
