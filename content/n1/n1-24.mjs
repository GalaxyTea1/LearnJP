// N1-24 N1総復習 — Tổng ôn N1. Original LearnJP content.
// Vocabulary deliberately reviews earlier N1 lessons: seven rows copied unchanged from each of N1-01 to N1-12
// and six from each of N1-13 to N1-23 (150 in total).
// Row formats: see content/n1/n1-01.mjs.
import * as u01 from './n1-01.mjs';
import * as u02 from './n1-02.mjs';
import * as u03 from './n1-03.mjs';
import * as u04 from './n1-04.mjs';
import * as u05 from './n1-05.mjs';
import * as u06 from './n1-06.mjs';
import * as u07 from './n1-07.mjs';
import * as u08 from './n1-08.mjs';
import * as u09 from './n1-09.mjs';
import * as u10 from './n1-10.mjs';
import * as u11 from './n1-11.mjs';
import * as u12 from './n1-12.mjs';
import * as u13 from './n1-13.mjs';
import * as u14 from './n1-14.mjs';
import * as u15 from './n1-15.mjs';
import * as u16 from './n1-16.mjs';
import * as u17 from './n1-17.mjs';
import * as u18 from './n1-18.mjs';
import * as u19 from './n1-19.mjs';
import * as u20 from './n1-20.mjs';
import * as u21 from './n1-21.mjs';
import * as u22 from './n1-22.mjs';
import * as u23 from './n1-23.mjs';

const units = [
  u01, u02, u03, u04, u05, u06, u07, u08, u09, u10, u11, u12,
  u13, u14, u15, u16, u17, u18, u19, u20, u21, u22, u23,
];
const picksFor = n => (n < 12 ? [0, 21, 42, 63, 84, 105, 126] : [0, 25, 50, 75, 100, 125]);
export const vocab = units.flatMap((u, n) => picksFor(n).map(i => u.vocab[i]));
export const reviewLedger = units.flatMap((u, n) =>
  picksFor(n).map(i => ({
    japanese: u.vocab[i][0],
    introducedIn: `N1-${String(n + 1).padStart(2, '0')}`,
    reviewedIn: 'N1-24',
  })),
);

export const kanji = [
  ['唾', 'saliva / thóa', 'ダ', 'つば', '11', '口', '唾（つば）: nước bọt; 唾液（だえき）: nước bọt; 固唾をのむ（かたずをのむ）: nín thở theo dõi'],
  ['捻', 'twist / niệp', 'ネン', '', '11', '扌', '捻出（ねんしゅつ）: xoay xở ra; 捻挫（ねんざ）: bong gân; 捻る（ひねる）: vặn'],
  ['羞', 'shame / tu', 'シュウ', '', '11', '羊', '羞恥心（しゅうちしん）: lòng biết xấu hổ; 含羞（がんしゅう）: e thẹn'],
  ['貪', 'covet / tham', 'ドン', 'むさぼる', '11', '貝', '貪欲（どんよく）: tham lam; 貪る（むさぼる）: tham lam vơ vét'],
  ['僅', 'a little / cận', 'キン', 'わずか', '13', '亻', '僅か（わずか）: một chút; 僅差（きんさ）: sít sao'],
  ['痩', 'get thin / sấu', 'ソウ', 'やせる', '12', '疒', '痩せる（やせる）: gầy đi; 痩身（そうしん）: thân hình gầy'],
  ['痘', 'pox / đậu', 'トウ', '', '12', '疒', '天然痘（てんねんとう）: bệnh đậu mùa; 水痘（すいとう）: thủy đậu'],
  ['喩', 'metaphor / dụ', 'ユ', '', '12', '口', '比喩（ひゆ）: ẩn dụ; 喩える（たとえる）: ví von'],
  ['賂', 'bribe / lộ', 'ロ', '', '13', '貝', '賄賂（わいろ）: hối lộ'],
  ['遜', 'humble / tốn', 'ソン', '', '14', '辶', '謙遜（けんそん）: khiêm tốn; 不遜（ふそん）: ngạo mạn; 遜色（そんしょく）: kém cạnh'],
  ['隙', 'gap / khích', 'ゲキ', 'すき', '13', '阝', '隙（すき）: khe hở, sơ hở; 隙間（すきま）: khe; 間隙（かんげき）: kẽ hở'],
  ['傲', 'proud / ngạo', 'ゴウ', '', '13', '亻', '傲慢（ごうまん）: ngạo mạn; 傲然（ごうぜん）: ngạo nghễ'],
  ['窟', 'cave / quật', 'クツ', '', '13', '穴', '洞窟（どうくつ）: hang động; 巣窟（そうくつ）: sào huyệt'],
  ['塞', 'block / tắc', 'ソク、サイ', 'ふさぐ、ふさがる', '13', '土', '閉塞（へいそく）: bế tắc; 要塞（ようさい）: pháo đài; 塞ぐ（ふさぐ）: bịt lại'],
  ['腺', 'gland / tuyến', 'セン', '', '13', '月', '涙腺（るいせん）: tuyến lệ; 甲状腺（こうじょうせん）: tuyến giáp'],
  ['詮', 'investigate / thuyên', 'セン', '', '13', '言', '所詮（しょせん）: rốt cuộc; 詮索（せんさく）: soi mói'],
  ['塑', 'model / tố', 'ソ', '', '13', '土', '可塑性（かそせい）: tính dẻo; 彫塑（ちょうそ）: điêu khắc nặn'],
  ['遡', 'go upstream / tố', 'ソ', 'さかのぼる', '14', '辶', '遡る（さかのぼる）: ngược dòng; 遡及（そきゅう）: hồi tố'],
  ['溺', 'drown / nịch', 'デキ', 'おぼれる', '13', '氵', '溺れる（おぼれる）: chết đuối, đắm chìm; 溺愛（できあい）: nuông chiều'],
  ['頓', 'sudden / đốn', 'トン', '', '13', '頁', '頓挫（とんざ）: đình trệ; 整頓（せいとん）: sắp xếp gọn; 無頓着（むとんちゃく）: thờ ơ'],
  ['毀', 'destroy / hủy', 'キ', '', '13', '殳', '毀損（きそん）: tổn hại; 名誉毀損（めいよきそん）: phỉ báng'],
  ['彙', 'collect / vựng', 'イ', '', '13', '彑', '語彙（ごい）: từ vựng; 語彙力（ごいりょく）: vốn từ'],
  ['慄', 'tremble / lật', 'リツ', '', '13', '忄', '戦慄（せんりつ）: rùng mình; 慄然（りつぜん）: kinh hãi'],
  ['塡', 'fill in / điền', 'テン', '', '13', '土', '補塡（ほてん）: bù đắp; 装塡（そうてん）: nạp vào'],
  ['綻', 'come apart / trán', 'タン', 'ほころびる', '14', '糸', '破綻（はたん）: đổ vỡ; 綻びる（ほころびる）: sứt chỉ, hé nở'],
  ['貌', 'appearance / mạo', 'ボウ', '', '14', '豸', '変貌（へんぼう）: biến đổi diện mạo; 全貌（ぜんぼう）: toàn cảnh; 美貌（びぼう）: nhan sắc'],
  ['辣', 'harsh / lạt', 'ラツ', '', '14', '辛', '辛辣（しんらつ）: cay độc; 辣腕（らつわん）: tài năng sắc sảo'],
  ['璃', 'lapis lazuli / li', 'リ', '', '15', '王', '瑠璃（るり）: lưu ly; 玻璃（はり）: pha lê'],
  ['遵', 'obey / tuân', 'ジュン', '', '15', '辶', '遵守（じゅんしゅ）: tuân thủ; 遵法（じゅんぽう）: tuân pháp'],
  ['潰', 'crush / hội', 'カイ', 'つぶす、つぶれる', '15', '氵', '潰す（つぶす）: đập nát; 潰れる（つぶれる）: phá sản; 潰瘍（かいよう）: loét'],
  ['蔽', 'cover / tế', 'ヘイ', '', '15', '艹', '隠蔽（いんぺい）: che giấu; 遮蔽（しゃへい）: che chắn'],
  ['嘲', 'ridicule / trào', 'チョウ', 'あざける', '15', '口', '嘲笑（ちょうしょう）: chế giễu; 自嘲（じちょう）: tự giễu; 嘲る（あざける）: chế nhạo'],
  ['憬', 'yearn / cảnh', 'ケイ', '', '15', '忄', '憧憬（しょうけい／どうけい）: khát khao'],
  ['踪', 'trace / tung', 'ソウ', '', '15', '足', '失踪（しっそう）: mất tích; 踪跡（そうせき）: dấu vết'],
  ['骸', 'remains / hài', 'ガイ', '', '16', '骨', '残骸（ざんがい）: xác, tàn tích; 形骸化（けいがいか）: hình thức hóa'],
  ['醒', 'awaken / tỉnh', 'セイ', '', '16', '酉', '覚醒（かくせい）: thức tỉnh; 警醒（けいせい）: cảnh tỉnh'],
  ['錮', 'confinement / cố', 'コ', '', '16', '金', '禁錮（きんこ）: tù giam'],
  ['頰', 'cheek / giáp', '', 'ほお', '16', '頁', '頰（ほお）: má; 頰張る（ほおばる）: nhồi đầy miệng'],
  ['瞭', 'clear / liễu', 'リョウ', '', '17', '目', '明瞭（めいりょう）: rõ ràng; 一目瞭然（いちもくりょうぜん）: rõ như ban ngày'],
  ['曖', 'dim / ái', 'アイ', '', '17', '日', '曖昧（あいまい）: mơ hồ; 曖昧さ（あいまいさ）: sự mơ hồ'],
  ['顎', 'jaw / ngạc', 'ガク', 'あご', '18', '頁', '顎（あご）: cằm; 下顎（したあご）: hàm dưới'],
  ['濫', 'excessive / lạm', 'ラン', '', '18', '氵', '濫用（らんよう）: lạm dụng; 氾濫（はんらん）: tràn lan; 濫発（らんぱつ）: phát hành bừa'],
  ['璧', 'jewel / bích', 'ヘキ', '', '18', '玉', '完璧（かんぺき）: hoàn hảo; 双璧（そうへき）: cặp đôi xuất sắc'],
  ['籠', 'basket; seclude / lung', 'ロウ', 'かご、こもる', '22', '竹', '籠（かご）: giỏ; 籠もる（こもる）: ẩn mình; 籠城（ろうじょう）: cố thủ'],
  ['鬱', 'gloom / uất', 'ウツ', '', '29', '鬯', '憂鬱（ゆううつ）: u uất; 鬱病（うつびょう）: trầm cảm; 鬱蒼（うっそう）: rậm rạp'],
];

export const kanjiQuestions = [
  ['捻出', 'ねんしゅつ', 'ねんでる', 'ねんしつ', 'じょうしゅつ'],
  ['貪欲', 'どんよく', 'たんよく', 'ひんよく', 'どんよう'],
  ['賄賂', 'わいろ', 'わいらく', 'まいろ', 'わいろう'],
  ['謙遜', 'けんそん', 'けんじゅん', 'けんそう', 'けんぞん'],
  ['所詮', 'しょせん', 'しょぜん', 'そせん', 'しょうせん'],
  ['遡及', 'そきゅう', 'さっきゅう', 'そうきゅう', 'さくきゅう'],
  ['頓挫', 'とんざ', 'とんさ', 'どんざ', 'とんせつ'],
  ['語彙', 'ごい', 'ごえ', 'ごき', 'ごるい'],
  ['破綻', 'はたん', 'はじょう', 'はてい', 'はだん'],
  ['隠蔽', 'いんぺい', 'いんへい', 'おんぺい', 'いんべい'],
];

export const grammar = [
  [
    'Ôn 1: tức thì, khởi đầu và vị thế',
    'N1-01・04: が早いか, や否や, そばから, なり, を皮切りに, を機に, てからというもの, をふまえて; にあって, ともなると／ともなれば, ともなく, にして, を限りに, に先駆けて, をおいて',
    'Vừa… là ngay: が早いか・や否や (văn viết, khách quan) / なり (người hành động bất thường) / そばから (lặp đi lặp lại, vừa làm đã hỏng). Khởi đầu: を皮切りに (mở đầu một chuỗi) / を機に (nhân dịp) / てからというもの (từ đó trở đi thay đổi hẳn). Căn cứ: をふまえて. Vị thế: にあって (ở hoàn cảnh) / ともなると・ともなれば (đã đến mức thì đương nhiên) / にして (chính vì là… mới / ngay cả). Kết thúc: を限りに. Đi trước: に先駆けて. Duy nhất: をおいて～ない.',
    [
      ['ベルが鳴るや否や、学生たちは教室を飛び出した。', 'Chuông vừa reo, sinh viên đã lao ra khỏi lớp.'],
      ['首相ともなれば、一言一言に責任が伴う。', 'Đã là thủ tướng thì từng lời nói đều đi kèm trách nhiệm.'],
      ['この仕事を任せられるのは、彼をおいてほかにいない。', 'Người có thể giao việc này, ngoài anh ấy ra không còn ai.'],
    ],
  ],
  [
    'Ôn 2: điều kiện, tiền đề và căn cứ',
    'N1-02・03・05: あっての, ばこそ, なくして（は）, ことなしに, ならでは, ゆえに, たる, ともあろう; いかんで, いかんにかかわらず, 如何, ようによっては, を前提に, からなる, にかかわる, を余儀なくされる; べからず, まじき, に則って, に照らして, に即して, ものとする, てしかるべきだ, てはばからない',
    'Điều kiện tất yếu: あっての (có A mới có B) / なくして（は）～ない・ことなしに (không có A thì không B) / ばこそ (chính vì… mới). Đặc trưng: ならでは. Lý do văn viết: ゆえに. Tư cách: たる (đã là… thì) / ともあろう (người đáng lẽ như… mà lại). Tùy theo: いかんで (quyết định bởi) / いかんにかかわらず (bất kể). Bị buộc: を余儀なくされる. Chuẩn mực: に則って (theo quy tắc) / に照らして (đối chiếu) / に即して (sát với thực tế). Cấm: べからず (quy tắc) / まじき (không đáng có ở người như vậy). Đương nhiên: てしかるべきだ.',
    [
      ['お客様あっての商売だということを忘れてはならない。', 'Không được quên rằng có khách hàng mới có việc kinh doanh.'],
      ['理由のいかんにかかわらず、遅刻は認めない。', 'Bất kể lý do gì, đi trễ không được chấp nhận.'],
      ['教師にあるまじき言動が問題となった。', 'Lời nói và hành động không đáng có ở giáo viên đã thành vấn đề.'],
    ],
  ],
  [
    'Ôn 3: phạm vi, bổ sung và mức tối thiểu',
    'N1-06・12・20: にとどまらず, はおろか, もさることながら, ひとり～のみならず, ただ～のみ, と相まって, を経て, からある; すら, だに, たりとも, に至るまで, に至っては, からいって, にしたところで, とも; つ～つ, っぱなし, なりとも, と同時に, にとどまる, にしても～にしても, が～なら, に限る',
    'Mở rộng: にとどまらず (không dừng ở) / ひとり～のみならず (không chỉ riêng) / もさることながら (A đã đành, B còn hơn) / はおろか (A thì khỏi nói, đến B cũng không). Kết hợp: と相まって. Mức cực tiểu: すら (đến cả) / だに (dù chỉ…, văn viết, đi với 想像・夢にも) / たりとも (dù một… cũng không) / なりとも (dù chỉ một chút cũng mong). Phạm vi đến tận: に至るまで. Giới hạn: にとどまる. Hai mặt: と同時に. Tốt nhất: に限る.',
    [
      ['彼は英語はおろか、日本語の新聞も読めない。', 'Tiếng Anh thì khỏi nói, đến báo tiếng Nhật anh ấy cũng không đọc được.'],
      ['こんな日が来るとは、夢にだに思わなかった。', 'Dù chỉ trong mơ cũng chưa từng nghĩ ngày này sẽ đến.'],
      ['自給率は四割にとどまり、改善の兆しは見えない。', 'Tỷ lệ tự cung chỉ dừng ở 40%, chưa thấy dấu hiệu cải thiện.'],
    ],
  ],
  [
    'Ôn 4: cảm xúc mạnh và hệ quả tất yếu',
    'N1-07・18: にたえない, にたえる, に足る, にかたくない, を禁じ得ない, てやまない, ずにはおかない, ずにはすまない; ないではおかない, ないではすまない, ではすまない, ても～きれない, にもほどがある, ことのないよう, もそこそこに, ところを見ると',
    'Không thể chịu nổi / đáng: にたえない (không chịu nổi để xem, nghe; hoặc vô cùng biết ơn) / にたえる (đáng để) / に足る (đủ để). Dễ hình dung: にかたくない. Cảm xúc không kìm: を禁じ得ない. Mong mỏi mãi: てやまない. Tất yếu: ずにはおかない・ないではおかない (nhất định gây ra) / ずにはすまない・ないではすまない (không làm không xong) / ではすまない (mức đó chưa đủ). Mức độ không hết: ても～きれない. Phê phán: にもほどがある. Phòng ngừa: ことのないよう. Vội vàng: もそこそこに. Suy đoán: ところを見ると.',
    [
      ['被災地の惨状は、見るにたえないものだった。', 'Cảnh thảm khốc ở vùng bị nạn khiến người ta không nỡ nhìn.'],
      ['皆様のご健康を心から願ってやみません。', 'Tôi luôn thành tâm cầu chúc sức khỏe của quý vị.'],
      ['人命に関わるミスは、謝るだけではすまない。', 'Sai sót liên quan tính mạng thì không chỉ xin lỗi là xong.'],
    ],
  ],
  [
    'Ôn 5: đánh giá, phê phán và tình trạng',
    'N1-10・11・15: きらいがある, しまつだ, が最後, たら最後, ずくめ, まみれ, 極まる／極まりない, の極み; の至り, をものともせず, をよそに, にもまして, にひきかえ, なりに, なり～なり, であれ～であれ; をいいことに, にかこつけて, ではあるまいし, だの～だの, かと思えば, と見える, と見るや',
    'Xu hướng xấu: きらいがある. Kết cục tệ: しまつだ. Một khi đã… thì hết đường: が最後・たら最後. Toàn là: ずくめ (sự việc, màu sắc) / まみれ (dính đầy vật bẩn). Cực điểm: 極まりない (phê phán) / の極み・の至り (cảm xúc, trang trọng). Bất chấp: をものともせず (không nao núng, khen) / をよそに (phớt lờ người khác lo). Tương phản: にひきかえ. Lợi dụng: をいいことに / にかこつけて (lấy cớ). Đâu phải là: ではあるまいし. Liệt kê phàn nàn: だの～だの. Thấy… là lập tức: と見るや.',
    [
      ['彼は物事を悲観的に考えるきらいがある。', 'Anh ấy có xu hướng nghĩ mọi việc một cách bi quan.'],
      ['住民の反対をよそに、工事は強行された。', 'Phớt lờ sự phản đối của cư dân, công trình bị ép tiến hành.'],
      ['子どもではあるまいし、自分のことは自分でしなさい。', 'Đâu phải trẻ con, việc của mình thì tự làm đi.'],
    ],
  ],
  [
    'Ôn 6: nhượng bộ, giả định và nhận định dè dặt',
    'N1-13・17・21: たところで, ところで（逆接）, であれ, といえども, ないまでも, ないものでもない, ないとも限らない, ずとも; はさておき, はいざしらず, ばかりは, べくもない, をかえりみず, をおして, ようものなら, ものを; を受けて, とて, ねばならない, ともすれば, とばかりは言えない, なくはない, ところとなる, には及ばない',
    'Dù có… cũng vô ích: たところで / とて (Vた + とて). Dù là: であれ・といえども (dù có địa vị, văn viết) / とて (N + とて: ngay cả). Không đến mức… nhưng ít nhất: ないまでも. Khẳng định yếu: ないものでもない・なくはない. Rủi ro: ないとも限らない. Gác lại: はさておき. Trường hợp khác thì không biết: はいざしらず. Không thể nào: べくもない. Bất chấp: をかえりみず (nguy hiểm) / をおして (trở ngại cụ thể). Hậu quả nặng: ようものなら. Tiếc nuối: ものを. Phủ định một chiều: とばかりは言えない. Dễ có xu hướng: ともすれば.',
    [
      ['今さら後悔したところで、失った時間は戻らない。', 'Giờ có hối hận thì thời gian đã mất cũng không trở lại.'],
      ['プロといえども、失敗することはある。', 'Dù là chuyên nghiệp cũng có lúc thất bại.'],
      ['一言相談してくれれば助けられたものを。', 'Giá mà nói với tôi một lời thì đã giúp được.'],
    ],
  ],
  [
    'Ôn 7: mục đích, quyết tâm, giới hạn và giao tiếp trang trọng',
    'N1-14・16・19・22: べく, んがため（に）, までだ, ばそれまでだ, までして, てまで, にかまけて; てこそ, が～だけに, でなくてなんだろう, ではなかろうか, かいがある／かいもなく, だけましだ, に言わせれば, ほどのことはない; の手前, にかけても, にはあたらない, てもさしつかえない, をもってすれば, ずにおく, の限りを尽くす, ものとして; を兼ねて, ことこの上ない, 限りだ, てはかなわない, すべがない, ようにも～ない, こととて, なしに',
    'Mục đích văn viết: べく / んがため（に）. Chỉ còn cách: までだ; mất là hết: ばそれまでだ. Đến mức phải: までして・てまで. Mải mê: にかまけて. Điều kiện tất yếu: てこそ. Đáng công / uổng công: かいがある／かいもなく. Tự an ủi: だけましだ. Thể diện: の手前. Thề lấy danh dự: にかけても. Không đáng: にはあたらない. Cho phép trang trọng: てもさしつかえない. Kiêm luôn: を兼ねて. Cực điểm: ことこの上ない (đánh giá) / 限りだ (cảm xúc người nói). Bất lực: すべがない・ようにも～ない. Xin lỗi kèm lý do: こととて.',
    [
      ['夢を実現するべく、彼は毎朝五時に起きている。', 'Để thực hiện ước mơ, anh ấy dậy lúc năm giờ mỗi sáng.'],
      ['苦労してこそ、本当の喜びが分かる。', 'Chính có vất vả mới hiểu được niềm vui thật sự.'],
      ['何分不慣れなこととて、ご迷惑をおかけしました。', 'Vì còn chưa quen việc, đã gây phiền cho quý vị.'],
    ],
  ],
  [
    'Ôn 8: văn chương, chủ đề và văn ngữ',
    'N1-08・09・23: ごとき／ごとく, んばかりに, とばかりに, めく, ながらに, かたがた, かたわら, がてら; ときたら, といったらない, といい～といい, というところだ, とあって, とあれば, と思いきや, とは; べし, ごとし, ざる, ずして, ぬ, たり, なかれ, んとする',
    'So sánh văn chương: ごとし・ごとく・ごとき (như) / んばかりに (như sắp) / とばかりに (như muốn nói). Mang vẻ: めく. Vẫn nguyên: ながらに (涙ながらに, 生まれながらに). Kiêm: かたがた (lịch sự) / がてら (nhân tiện) / かたわら (song song lâu dài). Chủ đề phàn nàn: ときたら. Cực kỳ: といったらない. Cả… lẫn…: といい～といい. Vì là dịp đặc biệt: とあって; nếu là vì… thì: とあれば. Tưởng vậy mà: と思いきや. Ngạc nhiên: とは. Văn ngữ: べし (phải) / べからず (cấm) / ざる・ぬ (phủ định) / ずして (không… mà) / たる (là) / なかれ (chớ) / んとする (sắp).',
    [
      ['彼女は泣かんばかりの顔で謝った。', 'Cô ấy xin lỗi với gương mặt như sắp khóc.'],
      ['楽勝かと思いきや、試合は延長戦にもつれ込んだ。', 'Tưởng thắng dễ, ai ngờ trận đấu kéo sang hiệp phụ.'],
      ['光陰矢のごとし。初心忘るべからず。', 'Thời gian như tên bay. Chớ quên tâm thế ban đầu.'],
    ],
  ],
];

export const grammarQuestions = [
  ['N1-01: 彼は家に帰る（　）、パソコンを開いた。', 'や否や', 'を皮切りに', 'をふまえて', 'てからというもの', 'Vừa… là ngay → や否や.'],
  ['N1-02: 多くのファンの支え（　）今の私がある。', 'あっての', 'ゆえの', 'ならではの', 'たる', 'Có A mới có B → あっての.'],
  ['N1-03: 結果（　）、計画を全面的に見直すこともありうる。', 'いかんによっては', 'を前提に', 'からなる', 'にかかわる', 'Tùy theo kết quả → いかんによっては.'],
  ['N1-04: 大臣（　）、発言には重い責任が伴う。', 'ともなれば', 'を限りに', 'に先駆けて', 'をおいて', 'Đã đến vị trí đó thì → ともなれば.'],
  ['N1-05: 賄賂を受け取るなど、公務員にある（　）行為だ。', 'まじき', 'べからず', 'に即した', 'ものとする', 'Không đáng có ở người như vậy → あるまじき.'],
  ['N1-06: 彼は漢字（　）、ひらがなもまだ読めない。', 'はおろか', 'にとどまらず', 'もさることながら', 'を経て', 'A thì khỏi nói, đến B cũng không → はおろか.'],
  ['N1-07: 被害者の気持ちを思うと、同情（　）。', 'を禁じ得ない', 'にたえる', 'に足る', 'にかたくない', 'Không kìm được cảm xúc → を禁じ得ない.'],
  ['N1-08: 散歩（　）、駅前の本屋に寄った。', 'がてら', 'かたわら', 'ながらに', 'めいて', 'Nhân tiện → がてら.'],
  ['N1-09: 晴れると（　）、急に雨が降り出した。', '思いきや', 'あって', 'あれば', 'きたら', 'Tưởng vậy mà → と思いきや.'],
  ['N1-10: 彼は人の話を最後まで聞かない（　）がある。', 'きらい', 'しまつ', '極み', 'ずくめ', 'Xu hướng xấu → きらいがある.'],
  ['N1-11: 周囲の心配（　）、彼は一人で冬山に登った。', 'をよそに', 'にもまして', 'にひきかえ', 'なりに', 'Phớt lờ sự lo lắng → をよそに.'],
  ['N1-12: 締め切りまで、一日（　）無駄にはできない。', 'たりとも', 'だに', 'に至るまで', 'からいって', 'Dù một… cũng không → たりとも.'],
  ['N1-13: 今から急いだ（　）、もう間に合わない。', 'ところで', 'といえども', 'ないまでも', 'ずとも', 'Dù có… cũng vô ích → たところで.'],
  ['N1-14: 試験に合格す（　）、毎日図書館に通った。', 'べく', 'までだ', 'までして', 'にかまけて', 'Mục đích văn viết → べく.'],
  ['N1-15: 子どもじゃある（　）、そんなことで泣かないで。', 'まいし', 'ことに', 'のみ', 'と見るや', 'Đâu phải là… → じゃあるまいし.'],
  ['N1-16: 苦労して（　）、本当の喜びが分かるものだ。', 'こそ', 'ばかり', 'だけまし', 'ほど', 'Chính có… mới → てこそ.'],
  ['N1-17: 費用の問題（　）、まずは計画を立てよう。', 'はさておき', 'はいざしらず', 'ばかりは', 'をおして', 'Tạm gác lại → はさておき.'],
  ['N1-18: 迷惑をかけたのだから、謝ら（　）。', 'ないではすまない', 'ないではおかない', 'にもほどがある', 'ことのないよう', 'Không làm thì không xong → ないではすまない.'],
  ['N1-19: 一度約束した（　）、今さら断るわけにはいかない。', '手前', 'にかけても', 'をもってすれば', 'ものとして', 'Vì thể diện đã hứa → 手前.'],
  ['N1-20: 疲れた時は、早く寝る（　）。', 'に限る', 'にとどまる', 'っぱなしだ', 'と同時だ', '… là nhất → に限る.'],
  ['N1-21: 手続きは私がしますので、ご心配には（　）。', '及びません', 'ねばなりません', 'ところとなります', '受けません', 'Không cần lo → には及ばない.'],
  ['N1-22: 事前の連絡（　）、契約内容を変更しないでください。', 'なしに', 'を兼ねて', 'こととて', '限りで', 'Không có… mà → なしに.'],
  ['N1-23: 失敗を恐れる（　）。', 'なかれ', 'べし', 'ごとし', 'ざる', 'Chớ có → なかれ.'],
];

export const dialogues = [
  [
    'Một tuần trước kỳ thi N1',
    'A là cô Fujita, giáo viên tiếng Nhật; B là anh Quân, học viên. Lớp học buổi tối.',
    [
      ['いよいよ来週ですね。準備はどうですか。', 'Cuối cùng cũng là tuần sau nhỉ. Em chuẩn bị thế nào rồi?'],
      ['文法はだいぶ覚えたんですが、似た表現が多くて、覚えるそばから混乱してしまいます。', 'Ngữ pháp em nhớ khá nhiều rồi, nhưng nhiều cách nói giống nhau quá, vừa nhớ xong đã lẫn lộn.'],
      ['N1の文法は、意味より使う場面で覚えるのがコツですよ。「をものともせず」と「をよそに」の違い、説明できますか。', 'Ngữ pháp N1 bí quyết là nhớ theo tình huống dùng hơn là nghĩa. Em giải thích được khác biệt giữa “をものともせず” và “をよそに” không?'],
      ['えっと、「をものともせず」は困難に負けない時に褒める表現で、「をよそに」は周りの心配を無視する時……ですよね。', 'À, “をものともせず” là khen khi không chịu thua khó khăn, còn “をよそに” là khi phớt lờ nỗi lo của người xung quanh…… đúng không ạ?'],
      ['完璧です。その調子なら、合格は想像にかたくないですね。', 'Hoàn hảo. Cứ thế này thì không khó hình dung em sẽ đỗ.'],
      ['ありがとうございます。でも、読解は時間が足りなくて。', 'Cảm ơn cô. Nhưng phần đọc hiểu em không đủ thời gian.'],
      ['長文は、全部を理解しようとしたが最後、時間がなくなります。先に設問を読んで、必要なところを探すこと。', 'Bài dài, một khi định hiểu hết từng chữ là hết giờ. Hãy đọc câu hỏi trước rồi tìm chỗ cần thiết.'],
      ['分かりました。最後まで諦めず、やるだけのことはやります。', 'Em hiểu rồi. Em sẽ không bỏ cuộc đến cùng, làm hết những gì có thể.'],
    ],
  ],
  [
    'Sau khi biết kết quả',
    'A là anh Quân; B là chị Yuki, đồng nghiệp người Nhật. Quán cà phê gần công ty, hai tháng sau kỳ thi.',
    [
      ['ユキさん、聞いてください。N1、合格しました！', 'Chị Yuki, nghe này. Em đỗ N1 rồi!'],
      ['本当に？　おめでとう！　毎朝早く来て勉強していたもんね。', 'Thật à? Chúc mừng em! Sáng nào em cũng đến sớm học mà.'],
      ['はい。仕事と勉強の両立は大変でしたけど、頑張ったかいがありました。', 'Vâng. Vừa làm vừa học vất vả lắm, nhưng cố gắng thật đáng công.'],
      ['点数はどうだったの？', 'Điểm thế nào?'],
      ['正直、読解は僅差でした。合格ラインをわずか三点上回っただけなんです。', 'Thật ra phần đọc hiểu sít sao lắm. Chỉ vượt điểm đỗ đúng ba điểm.'],
      ['合格は合格よ。それに、日本で働く外国人ともなれば、試験より毎日の仕事の方がよっぽど実践的な勉強でしょう。', 'Đỗ là đỗ. Hơn nữa đã là người nước ngoài làm việc ở Nhật thì công việc hằng ngày còn là bài học thực tế hơn kỳ thi nhiều.'],
      ['そうですね。でも、資格を取ったからといって、勉強をやめるわけにはいきません。', 'Đúng vậy. Nhưng có bằng rồi cũng không thể bỏ học.'],
      ['その姿勢、尊敬するわ。今日は合格祝いを兼ねて、私がごちそうする！', 'Chị nể thái độ đó. Hôm nay kiêm luôn mừng em đỗ, chị khao!'],
    ],
  ],
];

export const listenings = [
  [
    'Bài giảng: cách học tiếp sau N1',
    '講師：皆さん、N1の学習、本当にお疲れさまでした。今日は、N1に合格した後、あるいは合格を目指しながら、どのように日本語の力を伸ばしていくかについてお話しします。少し長くなりますが、メモを取りながら聞いてください。\n講師：まず知っておいてほしいのは、N1は日本語学習のゴールではないということです。N1に合格したからといって、日本語を自由に使えるとは限りません。実際、合格者の中にも、会議で発言できない、メールの敬語に自信がない、という人は少なくありません。\n講師：では、何をすべきか。ここでは四つのことをお勧めします。第一に、本物の日本語にできるだけ多く触れることです。新聞の社説、専門書、小説、ドキュメンタリー。教科書の日本語と違い、生の日本語は語彙も表現もはるかに豊かです。初めは分からない言葉ばかりでも、毎日読み続けてこそ、少しずつ読める範囲が広がっていきます。\n講師：第二に、アウトプットの機会を自ら作ることです。インプットばかりで、話したり書いたりしなければ、知識は使える力になりません。日記でも、SNSでもかまいません。学んだ表現を、とにかく使ってみること。日本人の友人や同僚に、自分の文章を読んでもらうのも効果的です。間違いを恐れるなかれ、です。\n講師：第三に、自分の専門分野の日本語を磨くことです。医療、法律、ITなど、仕事で使う分野の語彙は、試験には出なくても、皆さんにとって欠くべからざるものです。\n講師：最後に、言葉の背景にある文化や歴史にも関心を持ってください。言葉は文化の入り口です。言葉を知れば知るほど、その国の人々の考え方が見えてきます。慣用句や四字熟語の由来を知れば、言葉はより深く、正しく使えるようになります。\n講師：言葉の学習に終わりはありません。皆さんが日本語を通じて、新しい世界と出会い続けることを願ってやみません。',
    'Giảng viên: Các bạn, việc học N1 thật sự vất vả rồi. Hôm nay tôi sẽ nói về cách tiếp tục nâng cao năng lực tiếng Nhật sau khi đỗ N1, hoặc trong lúc nhắm đến việc đỗ. Hơi dài một chút, các bạn hãy vừa nghe vừa ghi chép.\nGiảng viên: Điều đầu tiên tôi muốn các bạn biết là N1 không phải là đích đến của việc học tiếng Nhật. Đỗ N1 không có nghĩa là dùng tiếng Nhật tự do được. Thực tế, ngay cả trong số người đỗ cũng không ít người không phát biểu được trong cuộc họp, không tự tin với kính ngữ trong email.\nGiảng viên: Vậy nên làm gì? Ở đây tôi khuyên bốn điều. Thứ nhất, tiếp xúc càng nhiều càng tốt với tiếng Nhật thật: xã luận báo, sách chuyên ngành, tiểu thuyết, phim tài liệu. Khác với tiếng Nhật trong giáo trình, tiếng Nhật thật phong phú hơn nhiều về từ vựng và cách diễn đạt. Ban đầu toàn từ không hiểu, nhưng chính nhờ đọc liên tục mỗi ngày thì phạm vi đọc được mới dần mở rộng.\nGiảng viên: Thứ hai, tự tạo cơ hội để nói và viết. Chỉ nạp vào mà không nói, không viết thì kiến thức không thành năng lực dùng được. Nhật ký hay mạng xã hội cũng được. Cứ thử dùng những cách nói đã học. Nhờ bạn bè hay đồng nghiệp người Nhật đọc bài viết của mình cũng hiệu quả. Chớ có sợ sai.\nGiảng viên: Thứ ba, trau dồi tiếng Nhật của lĩnh vực chuyên môn. Từ vựng của lĩnh vực dùng trong công việc như y tế, pháp luật, CNTT, dù không ra trong đề thi, vẫn là thứ không thể thiếu với các bạn.\nGiảng viên: Cuối cùng, hãy quan tâm cả đến văn hóa và lịch sử phía sau ngôn từ. Ngôn từ là cánh cửa của văn hóa. Càng biết nhiều từ, các bạn càng thấy được cách nghĩ của người dân nước ấy. Biết nguồn gốc của quán dụng ngữ và thành ngữ bốn chữ, các bạn sẽ dùng từ sâu sắc và chính xác hơn.\nGiảng viên: Việc học ngôn ngữ không có điểm kết thúc. Tôi luôn cầu mong các bạn qua tiếng Nhật sẽ tiếp tục gặp gỡ những thế giới mới.',
  ],
  [
    'Thông báo trong phòng thi',
    '試験官：これから、日本語能力試験N1の試験を始めます。\n試験官：机の上には、受験票と鉛筆、消しゴムだけを置いてください。携帯電話は電源を切り、かばんの中にしまってください。\n試験官：試験中に携帯電話が鳴った場合、理由のいかんを問わず、不正行為とみなすものとします。\n試験官：問題用紙は、合図があるまで開かないでください。質問がある方は、手を挙げてください。',
    'Giám thị: Bây giờ chúng ta bắt đầu kỳ thi năng lực tiếng Nhật N1.\nGiám thị: Trên bàn chỉ để phiếu dự thi, bút chì và tẩy. Điện thoại hãy tắt nguồn và cất vào túi.\nGiám thị: Trường hợp điện thoại reo trong giờ thi, bất kể lý do gì cũng sẽ bị coi là gian lận.\nGiám thị: Đề thi không được mở cho đến khi có hiệu lệnh. Ai có câu hỏi xin giơ tay.',
  ],
  [
    'Hai người bạn sau giờ thi',
    '女：やっと終わったね。読解、どうだった？\n男：最後の長文、時間が足りなくて、半分は勘で答えたよ。\n女：私も。聴解はまだしも、読解の難しさといったらなかったね。\n男：でも、一年前の自分なら、問題文を読むことすらできなかったと思う。\n女：確かに。結果はどうであれ、ここまで頑張ってきた自分を褒めてあげよう。\n男：そうだね。今日は勉強のことは忘れて、おいしいものでも食べに行こう。',
    'Nữ: Cuối cùng cũng xong rồi. Đọc hiểu thế nào?\nNam: Bài dài cuối cùng không đủ thời gian, một nửa tớ đoán mò.\nNữ: Tớ cũng vậy. Nghe hiểu thì còn đỡ, chứ đọc hiểu khó không tả nổi.\nNam: Nhưng nếu là tớ một năm trước, chắc đến đọc đề cũng không nổi.\nNữ: Đúng thật. Dù kết quả thế nào, hãy khen bản thân đã cố gắng đến đây.\nNam: Ừ. Hôm nay quên chuyện học đi, đi ăn món gì ngon thôi.',
  ],
];

export const listenQuestions = [
  [0, 'Theo giảng viên, điều đầu tiên cần biết là gì?', 'N1 không phải là đích đến của việc học tiếng Nhật', 'N1 là chứng chỉ cao nhất', 'Đỗ N1 là dùng tiếng Nhật tự do', 'Không cần học sau N1', 'N1は日本語学習のゴールではない.'],
  [0, 'Giảng viên khuyên làm gì với từ vựng chuyên môn?', 'Trau dồi dù không ra trong đề thi', 'Bỏ qua vì không ra thi', 'Chỉ học khi cần', 'Học bằng tiếng Anh', '試験には出なくても、皆さんにとって欠くべからざるもの.'],
  [1, 'Trường hợp điện thoại reo trong giờ thi thì sao?', 'Bị coi là gian lận bất kể lý do', 'Được nghe máy', 'Bị nhắc nhở', 'Không sao nếu có lý do', '理由のいかんを問わず、不正行為とみなす.'],
  [1, 'Trên bàn được để những gì?', 'Phiếu dự thi, bút chì, tẩy', 'Từ điển', 'Điện thoại', 'Đồng hồ thông minh', '受験票と鉛筆、消しゴムだけ.'],
  [2, 'Người nam làm phần đọc dài cuối cùng thế nào?', 'Một nửa đoán mò vì không đủ thời gian', 'Làm xong hết', 'Bỏ trống', 'Làm rất tốt', '半分は勘で答えた.'],
  [2, 'Hai người quyết định làm gì?', 'Đi ăn món ngon', 'Ôn bài tiếp', 'Đăng ký thi lại', 'Về nhà ngủ', 'おいしいものでも食べに行こう.'],
];

export const readings = [
  [
    'Tiểu luận: ngôn từ là tấm gương',
    '日本語を学び始めて八年になる。初めて日本に来た時、私はコンビニで「温めますか」と聞かれても何のことか分からず、黙ってうなずくことしかできなかった。それが今では、仕事で日本人の取引先と交渉し、会議で意見を述べている。振り返れば、長い道のりだった。その間、何度やめようと思ったか分からない。\n\nN1の勉強を始めた頃、私を最も悩ませたのは、似たような意味の文法がいくつもあることだった。「にしても」「にせよ」「とはいえ」「といえども」。どれも「～けれども」に近い意味なのに、なぜこれほど多くの表現が必要なのか。覚えるそばから忘れ、問題を解くたびに間違えた。日本語はなんて不便な言語なのだろう、と恨めしく思ったこともある。\n\n考えが変わったのは、ある小説を読んでいた時だった。主人公の老人が、亡くなった妻を思って語る場面で、作者は「にもかかわらず」でも「けれども」でもなく、「ものを」という一語を使っていた。「あの時、一言でも礼を言っておけばよかったものを」。その一語には、後悔と、愛情と、取り返しのつかない時間への哀しみが込められていた。ほかのどの表現でも、この思いは表せなかっただろう。\n\nその時、私は気づいた。似た表現が多いのは、不便だからではなく、日本語を話してきた人々が、それだけ細やかな心の動きを言葉にしようとしてきたからなのだと。文法の違いは、気持ちの違いなのだ。\n\nそれからは、文法を覚える時、意味だけでなく、その表現がどんな気持ちの時に使われるのかを考えるようにした。すると、不思議なことに、あれほど混乱していた表現が、一つ一つ違う顔を持って見えてきた。「をものともせず」には相手への敬意が、「をよそに」には批判が、「限りだ」には話し手自身の喜びがある。\n\n言葉は、それを使う人々の心を映す鏡である。外国語を学ぶことは、単に別の記号を覚えることではない。その言葉を話す人々が、何を大切にし、何に心を動かされてきたのかを知ることなのだ。\n\nN1に合格した今も、分からない表現に出会わない日はない。だが、それを苦しいとは思わない。新しい言葉に出会うたびに、日本という国と、そこに生きる人々の心に、また一歩近づけるのだから。',
    'Tôi học tiếng Nhật đã tám năm. Lần đầu đến Nhật, ở cửa hàng tiện lợi được hỏi “Có hâm nóng không ạ?” tôi cũng không hiểu, chỉ biết im lặng gật đầu. Giờ đây tôi đàm phán với đối tác người Nhật trong công việc, phát biểu ý kiến trong cuộc họp. Nhìn lại, đó là một chặng đường dài. Trong khoảng thời gian ấy, không biết bao lần tôi đã muốn bỏ cuộc.\n\nKhi bắt đầu học N1, điều khiến tôi khổ sở nhất là có nhiều mẫu ngữ pháp nghĩa giống nhau: “にしても”, “にせよ”, “とはいえ”, “といえども”. Đều có nghĩa gần với “～けれども”, vậy sao cần nhiều cách nói đến thế? Vừa nhớ xong đã quên, mỗi lần làm bài lại sai. Có lúc tôi oán thầm tiếng Nhật sao bất tiện đến vậy.\n\nSuy nghĩ của tôi thay đổi khi đọc một cuốn tiểu thuyết. Trong cảnh nhân vật chính là một ông lão nhớ về người vợ đã mất, tác giả không dùng “にもかかわらず” hay “けれども” mà dùng một chữ “ものを”: “Giá mà lúc đó nói một lời cảm ơn”. Trong một chữ ấy chứa sự hối hận, tình yêu và nỗi buồn về thời gian không thể lấy lại. Không cách nói nào khác có thể diễn tả tâm tư ấy.\n\nLúc đó tôi nhận ra: nhiều cách nói giống nhau không phải vì bất tiện, mà vì những người nói tiếng Nhật đã luôn cố gắng diễn tả bằng lời những rung động tinh tế đến vậy của lòng người. Khác biệt ngữ pháp chính là khác biệt cảm xúc.\n\nTừ đó, khi học ngữ pháp, tôi không chỉ nhớ nghĩa mà còn nghĩ xem cách nói ấy được dùng với cảm xúc như thế nào. Kỳ lạ thay, những cách nói từng làm tôi rối đến thế dần hiện ra với từng gương mặt khác nhau. “をものともせず” có sự kính trọng với đối phương, “をよそに” có sự phê phán, “限りだ” có niềm vui của chính người nói.\n\nNgôn từ là tấm gương phản chiếu lòng người sử dụng nó. Học ngoại ngữ không đơn thuần là nhớ một hệ ký hiệu khác. Mà là biết được những người nói ngôn ngữ ấy đã trân trọng điều gì, đã rung động trước điều gì.\n\nĐến giờ đã đỗ N1, ngày nào tôi cũng gặp cách nói chưa hiểu. Nhưng tôi không thấy điều đó là khổ sở. Bởi mỗi lần gặp một từ mới, tôi lại tiến gần thêm một bước đến đất nước Nhật Bản và lòng người sống ở đó.',
  ],
  [
    'Đọc tích hợp: có cần học ngoại ngữ trong thời đại AI dịch thuật?',
    '【A】\nAI翻訳の精度は、この数年で飛躍的に向上した。スマートフォンに話しかければ、瞬時に外国語に訳してくれる。ビジネスの文書も、論文も、ほぼ正確に翻訳できるようになった。国際会議では、参加者がそれぞれ母語で話し、AIが同時に通訳する光景も珍しくなくなった。こうした時代に、何年もかけて外国語を学ぶ意味はあるのだろうか。正直に言えば、旅行や日常の買い物程度であれば、もはや外国語を学ぶ必要はないと私は考える。学校教育でも、全員に同じように外国語を課す必要はないのではないか。限られた時間は、専門知識や思考力を磨くことに使うべきだ。かつて計算機の登場によって、複雑な計算を手で行う技能の価値が下がったように、外国語の能力もまた、特別な専門家だけが身につければよい時代が来るだろう。言葉はあくまで道具にすぎない。大切なのは、何を伝えるかであって、どの言語で伝えるかではない。より優れた道具が現れた以上、それを使わない理由はない。外国語の習得に苦しむ子どもたちを見るにつけ、もっと別のことに時間を使わせてあげたいと思わずにはいられない。\n\n【B】\nAI翻訳が便利になったことは、誰も否定しないだろう。だが、それをもってすれば外国語を学ぶ必要がなくなるとばかりは言えない。翻訳は、言葉の表面を置き換えることはできても、その背後にある文化や感情までは伝えきれないからだ。例えば、日本語の「よろしくお願いします」を、ほかの言語で正確に表す言葉はない。この言葉には、相手への敬意や、これからの関係への期待といった、文脈によって変わる多くの意味が込められている。また、相手の言語で直接話そうとする姿勢そのものが、信頼関係を築く上で大きな意味を持つ。私自身、海外の取引先に片言の現地語で挨拶をしただけで、場の空気が一変した経験が何度もある。たとえ下手でも、相手の言葉で語りかけてこそ、心は通じるのである。外国語を学ぶことは、単に情報を交換する技術ではなく、異なる価値観を持つ他者を理解する営みだ。機械がどれほど進歩しようとも、人と人との間に立つのは、最後は人間なのである。AIの時代だからこそ、その価値はむしろ高まっていくのではなかろうか。',
    '[A]\nĐộ chính xác của AI dịch thuật đã tăng vượt bậc trong vài năm qua. Chỉ cần nói vào điện thoại, nó dịch ngay sang tiếng nước ngoài. Văn bản kinh doanh hay luận văn cũng đã dịch gần như chính xác. Ở hội nghị quốc tế, cảnh mỗi người nói bằng tiếng mẹ đẻ và AI phiên dịch đồng thời cũng không còn hiếm. Trong thời đại như vậy, mất nhiều năm học ngoại ngữ liệu có ý nghĩa? Thật lòng mà nói, tôi cho rằng nếu chỉ ở mức du lịch hay mua sắm hằng ngày thì không còn cần học ngoại ngữ. Ngay cả trong giáo dục ở trường, phải chăng không cần bắt tất cả học ngoại ngữ như nhau? Thời gian có hạn nên dùng để mài giũa kiến thức chuyên môn và năng lực tư duy. Giống như trước đây sự xuất hiện của máy tính làm giảm giá trị kỹ năng tính toán phức tạp bằng tay, rồi sẽ đến thời đại năng lực ngoại ngữ chỉ cần những chuyên gia đặc biệt có được. Ngôn ngữ suy cho cùng chỉ là công cụ. Điều quan trọng là truyền đạt điều gì, chứ không phải truyền đạt bằng ngôn ngữ nào. Khi công cụ tốt hơn đã xuất hiện thì không có lý do gì không dùng. Mỗi lần thấy trẻ em khổ sở học ngoại ngữ, tôi không khỏi muốn để các em dùng thời gian cho việc khác.\n\n[B]\nChắc không ai phủ nhận AI dịch thuật đã trở nên tiện lợi. Nhưng không thể nói chỉ cần dùng nó là không còn cần học ngoại ngữ. Vì bản dịch có thể thay thế bề mặt ngôn từ nhưng không truyền tải hết được văn hóa và cảm xúc phía sau. Ví dụ, không có từ nào trong ngôn ngữ khác diễn đạt chính xác “よろしくお願いします” của tiếng Nhật. Câu nói ấy chứa nhiều ý nghĩa thay đổi theo ngữ cảnh như sự kính trọng với đối phương hay kỳ vọng vào mối quan hệ sắp tới. Hơn nữa, chính thái độ cố gắng nói trực tiếp bằng ngôn ngữ của đối phương có ý nghĩa lớn trong việc xây dựng quan hệ tin cậy. Bản thân tôi nhiều lần trải qua cảnh chỉ cần chào đối tác nước ngoài bằng vài câu tiếng địa phương bập bẹ là không khí thay đổi hẳn. Dù nói chưa giỏi, chính nhờ nói bằng ngôn ngữ của đối phương mà lòng người mới thông nhau. Học ngoại ngữ không đơn thuần là kỹ thuật trao đổi thông tin, mà là hoạt động thấu hiểu người khác có giá trị quan khác mình. Dù máy móc tiến bộ đến đâu, người đứng giữa con người với con người cuối cùng vẫn là con người. Chính vì là thời đại AI, giá trị ấy chẳng phải càng tăng lên sao?',
  ],
];

export const readQuestions = [
  [0, 'Ban đầu tác giả khổ sở vì điều gì khi học N1?', 'Có nhiều mẫu ngữ pháp nghĩa giống nhau', 'Không có giáo trình', 'Kanji quá ít', 'Không có thời gian', '似たような意味の文法がいくつもあること.'],
  [0, 'Điều gì đã thay đổi suy nghĩ của tác giả?', 'Chữ “ものを” trong một cuốn tiểu thuyết', 'Lời khuyên của giáo viên', 'Kết quả thi', 'Một bộ phim', '作者は…「ものを」という一語を使っていた.'],
  [0, 'Theo tác giả, ngôn từ là gì?', 'Tấm gương phản chiếu lòng người sử dụng', 'Một hệ ký hiệu đơn thuần', 'Công cụ trao đổi thông tin', 'Gánh nặng của người học', '言葉は、それを使う人々の心を映す鏡である.'],
  [1, 'Theo A, nên dùng thời gian có hạn vào việc gì?', 'Mài giũa kiến thức chuyên môn và tư duy', 'Học nhiều ngoại ngữ', 'Đi du lịch', 'Học dùng điện thoại', '専門知識や思考力を磨くことに使うべきだ.'],
  [1, 'Theo B, AI dịch thuật không truyền tải được điều gì?', 'Văn hóa và cảm xúc phía sau ngôn từ', 'Nghĩa của từ', 'Ngữ pháp cơ bản', 'Con số', 'その背後にある文化や感情までは伝えきれない.'],
  [1, 'A và B khác nhau ở điểm nào?', 'A coi ngôn ngữ là công cụ, B coi học ngoại ngữ là thấu hiểu người khác', 'Cả hai đều phản đối AI', 'Cả hai đều cho rằng không cần học ngoại ngữ', 'A ủng hộ học ngoại ngữ, B phản đối', 'A: 言葉はあくまで道具にすぎない; B: 他者を理解する営み.'],
];

export const writing = [
  [
    'Thư cảm ơn giáo viên sau kỳ thi',
    'Viết thư khoảng 300 ký tự (250–350) gửi giáo viên tiếng Nhật để báo kết quả kỳ thi N1 và cảm ơn. Dùng ít nhất ba mẫu N1 thuộc các nhóm khác nhau, ví dụ ～かいがある, ～限りだ, ～あっての, ～てやまない, ～を兼ねて. Văn kính ngữ.',
    '藤田先生\n\nご無沙汰しております。クアンです。\n本日、日本語能力試験N1の結果が届き、無事に合格することができました。真っ先に先生にご報告したく、取り急ぎ筆を取りました。\n仕事と勉強の両立は大変でしたが、先生の丁寧なご指導あっての合格だと思っております。毎朝五時に起きて、出勤前に一時間勉強したかいがありました。正直に申しますと、読解は合格ラインぎりぎりでしたので、うれしい限りです。\n来月、改めて合格のご報告を兼ねて、教室にご挨拶に伺えれば幸いです。先生のますますのご健康とご活躍を、心よりお祈りしてやみません。',
    250,
    350,
  ],
  [
    'Bài nghị luận: thời đại AI dịch thuật, có nên học ngoại ngữ?',
    'Viết bài nghị luận khoảng 550 ký tự (450–650) về chủ đề “Trong thời đại AI dịch thuật, con người có còn cần học ngoại ngữ?”: nêu vấn đề, chủ trương có căn cứ, đề cập ý kiến ngược lại và kết luận. Dùng ít nhất bốn mẫu N1 thuộc các nhóm khác nhau. Văn だ・である.',
    'AI翻訳の時代に外国語を学ぶ意味\n\nAI翻訳の精度が上がり、外国語を話せなくても、海外の人と簡単に意思疎通ができるようになった。では、これからの時代、人間は外国語を学ぶ必要がなくなるのだろうか。\n\n必要ないと考える人は、言葉は道具にすぎず、より便利な道具があるならそれを使えばいいと主張する。確かに、旅行や簡単な買い物程度なら、AIをもってすれば十分に用が足りる。外国語の習得に何年もかけるより、専門知識を磨くべきだという意見にも一理ある。\n\nしかし、私は外国語を学ぶ意味は決して失われないと考える。第一に、翻訳は言葉の表面を置き換えることはできても、その背後にある文化や感情までは伝えきれない。日本語の「ものを」に込められた後悔や愛情は、機械的な翻訳ではこぼれ落ちてしまう。第二に、相手の言語で語りかける姿勢そのものが、信頼関係を生む。たとえ下手であれ、自分の言葉で話そうとしてこそ、心は通じるのである。\n\nもちろん、AI翻訳を否定する必要はない。便利な道具として上手に使いつつ、自分の力で学び続けることが大切だ。\n\n外国語を学ぶことは、異なる価値観を持つ他者を理解する営みである。機械が進歩すればするほど、人と人とが直接心を通わせることの価値は、ますます高まっていくに違いない。',
    450,
    650,
  ],
];
