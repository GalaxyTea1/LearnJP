// N2-20 N2総復習 — Tổng ôn N2. Original LearnJP content.
// Vocabulary deliberately reviews earlier N2 lessons: seven rows copied unchanged from each of N2-01 to N2-19.
// Row formats: see content/n2/n2-01.mjs.
import * as u01 from './n2-01.mjs';
import * as u02 from './n2-02.mjs';
import * as u03 from './n2-03.mjs';
import * as u04 from './n2-04.mjs';
import * as u05 from './n2-05.mjs';
import * as u06 from './n2-06.mjs';
import * as u07 from './n2-07.mjs';
import * as u08 from './n2-08.mjs';
import * as u09 from './n2-09.mjs';
import * as u10 from './n2-10.mjs';
import * as u11 from './n2-11.mjs';
import * as u12 from './n2-12.mjs';
import * as u13 from './n2-13.mjs';
import * as u14 from './n2-14.mjs';
import * as u15 from './n2-15.mjs';
import * as u16 from './n2-16.mjs';
import * as u17 from './n2-17.mjs';
import * as u18 from './n2-18.mjs';
import * as u19 from './n2-19.mjs';

const units = [u01, u02, u03, u04, u05, u06, u07, u08, u09, u10, u11, u12, u13, u14, u15, u16, u17, u18, u19];
const picks = [0, 21, 42, 63, 84, 105, 126];
export const vocab = units.flatMap(u => picks.map(i => u.vocab[i]));
export const reviewLedger = units.flatMap((u, n) =>
  picks.map(i => ({
    japanese: u.vocab[i][0],
    introducedIn: `N2-${String(n + 1).padStart(2, '0')}`,
    reviewedIn: 'N2-20',
  })),
);

export const kanji = [
  ['粒', 'grain / lạp', 'リュウ', 'つぶ', '11', '米', '粒（つぶ）: hạt; 一粒（ひとつぶ）: một hạt; 素粒子（そりゅうし）: hạt cơ bản'],
  ['詞', 'word, part of speech / từ', 'シ', '', '12', '言', '品詞（ひんし）: từ loại; 名詞（めいし）: danh từ; 歌詞（かし）: lời bài hát'],
  ['偉', 'great / vĩ', 'イ', 'えらい', '12', '亻', '偉い（えらい）: giỏi, vĩ đại; 偉大（いだい）: vĩ đại; 偉人（いじん）: vĩ nhân'],
  ['畳', 'tatami; fold / điệp', 'ジョウ', 'たたむ、たたみ', '12', '田', '六畳（ろくじょう）: sáu chiếu; 畳む（たたむ）: gấp; 畳（たたみ）: chiếu tatami'],
  ['机', 'desk / kỷ', 'キ', 'つくえ', '6', '木', '机（つくえ）: bàn; 机上（きじょう）: trên bàn giấy; 勉強机（べんきょうづくえ）: bàn học'],
  ['膚', 'skin / phu', 'フ', '', '15', '月', '皮膚（ひふ）: da; 皮膚科（ひふか）: khoa da liễu'],
  ['濯', 'rinse, wash / trạc', 'タク', '', '17', '氵', '洗濯（せんたく）: giặt giũ; 洗濯物（せんたくもの）: đồ giặt; 洗濯機（せんたくき）: máy giặt'],
  ['猫', 'cat / miêu', 'ビョウ', 'ねこ', '11', '犭', '猫（ねこ）: mèo; 子猫（こねこ）: mèo con; 愛猫（あいびょう）: con mèo cưng'],
  ['塔', 'tower / tháp', 'トウ', '', '12', '土', '五重塔（ごじゅうのとう）: tháp năm tầng; 鉄塔（てっとう）: tháp sắt; 塔（とう）: tháp'],
  ['沸', 'boil / phí', 'フツ', 'わく、わかす', '8', '氵', '沸く（わく）: sôi; 沸かす（わかす）: đun sôi; 沸騰（ふっとう）: sôi'],
  ['幾', 'how many / kỷ', 'キ', 'いく', '12', '幺', '幾つ（いくつ）: bao nhiêu; 幾度（いくど）: bao lần; 幾分（いくぶん）: phần nào'],
  ['帽', 'hat / mạo', 'ボウ', '', '12', '巾', '帽子（ぼうし）: mũ; 脱帽（だつぼう）: ngả mũ thán phục; 学帽（がくぼう）: mũ học sinh'],
  ['枯', 'wither / khô', 'コ', 'かれる、からす', '9', '木', '枯れる（かれる）: héo; 枯れ葉（かれは）: lá khô; 枯渇（こかつ）: cạn kiệt'],
  ['舟', 'boat / chu', 'シュウ', 'ふね、ふな', '6', '舟', '舟（ふね）: thuyền nhỏ; 小舟（こぶね）: chiếc thuyền con; 舟遊び（ふなあそび）: chơi thuyền'],
  ['貝', 'shellfish / bối', '', 'かい', '7', '貝', '貝（かい）: sò; 貝殻（かいがら）: vỏ sò; 巻き貝（まきがい）: ốc'],
  ['皿', 'plate / mãnh', '', 'さら', '5', '皿', '皿（さら）: đĩa; 小皿（こざら）: đĩa nhỏ; 灰皿（はいざら）: gạt tàn'],
  ['燥', 'dry / táo', 'ソウ', '', '17', '火', '乾燥（かんそう）: khô; 焦燥（しょうそう）: sốt ruột; 乾燥機（かんそうき）: máy sấy'],
  ['挟', 'pinch, put between / hiệp', 'キョウ', 'はさむ、はさまる', '9', '扌', '挟む（はさむ）: kẹp; 挟まる（はさまる）: bị kẹp; 板挟み（いたばさみ）: tiến thoái lưỡng nan'],
  ['滴', 'drop / trích', 'テキ', 'しずく、したたる', '14', '氵', '水滴（すいてき）: giọt nước; 一滴（いってき）: một giọt; 点滴（てんてき）: truyền dịch'],
];

export const kanjiQuestions = [
  ['品詞', 'ひんし', 'ひんじ', 'しなし', 'ほんし'],
  ['偉大', 'いだい', 'いたい', 'えらだい', 'いだ'],
  ['皮膚', 'ひふ', 'ひぶ', 'かわふ', 'ひふう'],
  ['沸騰', 'ふっとう', 'ふつとう', 'わっとう', 'ふっどう'],
  ['枯渇', 'こかつ', 'こがつ', 'かれかつ', 'こかち'],
  ['水滴', 'すいてき', 'すいしずく', 'みずてき', 'すいでき'],
];

export const grammar = [
  [
    'Ôn 1: thời điểm, trình tự và kết cục',
    'N2-01・16・18: 次第, てからでないと, た上で, 際, に先立って, をきっかけに; あげく, 末に, たところ, ところだった, ずじまい, きり, ことなく; かと思うと, か～ないかのうちに',
    'Trình tự: た上で (làm xong A rồi mới B, cẩn thận) / てからでないと (chưa A thì không B) / 次第 (A xong là B ngay, văn trang trọng). Thời điểm: 際 (khi, trang trọng) / に先立って (trước khi) / をきっかけに・を契機に (nhân dịp). Kết cục: あげく (kết quả xấu) / 末に (sau nhiều cố gắng) / たところ (phát hiện). Không xảy ra: ところだった (suýt) / ずじまい (rốt cuộc không). Liên tiếp: かと思うと / か～ないかのうちに / たとたん (N3).',
    [
      ['資料を確認した上で、お返事いたします。', 'Sau khi xem tài liệu, tôi sẽ trả lời.'],
      ['何度も話し合った末に、ようやく結論が出た。', 'Sau nhiều lần bàn bạc, cuối cùng đã có kết luận.'],
      ['もう少しで、大事な試験に遅れるところだった。', 'Suýt nữa thì trễ kỳ thi quan trọng.'],
    ],
  ],
  [
    'Ôn 2: xu hướng, thay đổi và góc nhìn',
    'N2-02・09: がちだ, 気味, 傾向にある, つつある, かける, きる, ぬく; に伴って, 次第で, によっては, からすると, から見ると, 上, にしては',
    'Xu hướng xấu: がちだ (hay, dễ) / 気味 (hơi có vẻ) / 傾向にある (có xu hướng, khách quan). Thay đổi đang diễn ra: つつある. Làm dở: かける; làm đến cùng: きる・ぬく. Thay đổi đi kèm: に伴って. Tùy theo: 次第で (quyết định bởi) / によっては (tùy trường hợp có khi). Góc nhìn: からすると・から見ると. So với chuẩn: にしては (N2-09) / わりに (N2-12).',
    [
      ['冬は運動不足になりがちだ。', 'Mùa đông dễ bị thiếu vận động.'],
      ['人口の減少に伴って、空き家が増えつつある。', 'Cùng với dân số giảm, nhà bỏ trống đang dần tăng.'],
      ['初めてにしては、よくできている。', 'Lần đầu mà làm thế là tốt rồi.'],
    ],
  ],
  [
    'Ôn 3: căn cứ, phạm vi và đối tượng',
    'N2-03・05・15: に基づいて, をもとに, に沿って, に応じて, を中心に, をめぐって, にかけては; に限って, に限らず, のみならず, はもとより, に加えて, を問わず, にかかわらず; にこたえて, を～として, を除いて, に限り, とおり, ものがある, からして',
    'Căn cứ: に基づいて (dựa trên, chặt chẽ) / をもとに (lấy làm chất liệu) / に沿って (theo đúng). Tương ứng: に応じて (thay đổi theo) / にこたえて (đáp lại mong muốn). Phạm vi: を問わず・にかかわらず (không phân biệt) / に限らず・のみならず・はもとより (không chỉ… mà cả). Giới hạn: に限り (chỉ dành cho, quy định) / に限って (riêng lúc đó lại…) / を除いて (ngoại trừ). Vai trò: を～として. Đúng như: とおり／どおり.',
    [
      ['調査の結果に基づいて、計画を見直した。', 'Dựa trên kết quả khảo sát, đã xem lại kế hoạch.'],
      ['この大会は、年齢や国籍を問わず、誰でも参加できる。', 'Giải này ai cũng tham gia được, không phân biệt tuổi tác hay quốc tịch.'],
      ['月曜日を除いて、毎日見学できます。', 'Ngoại trừ thứ hai, ngày nào cũng tham quan được.'],
    ],
  ],
  [
    'Ôn 4: văn trang trọng, mục tiêu và phạm vi thời gian',
    'N2-04・13: につき, にあたって, に際して, のもとで, をもって, 次第だ, かねる; に向けて, 向き／向け, にわたって, ばかりに, ほかない, ないものか, て以来',
    'Thông báo, thư từ: につき (vì, do – biển báo) / にあたって・に際して (nhân dịp) / をもって (bằng, đến thời điểm) / かねる (khó có thể, lịch sự). Mục tiêu: に向けて. Đối tượng sản phẩm: 向け (làm dành cho) / 向き (hợp với). Phạm vi thời gian: にわたって (suốt). Từ mốc đến nay: て以来. Không còn cách: ほかない. Mong ước: ないものか. Hậu quả đáng tiếc: ばかりに.',
    [
      ['工事中につき、立ち入り禁止。', 'Đang thi công, cấm vào.'],
      ['大会の成功に向けて、三か月にわたって準備を続けた。', 'Hướng tới thành công của giải đấu, đã chuẩn bị suốt ba tháng.'],
      ['申し訳ございませんが、そのご要望にはお応えしかねます。', 'Thành thật xin lỗi, chúng tôi khó có thể đáp ứng yêu cầu đó.'],
    ],
  ],
  [
    'Ôn 5: khả năng, rủi ro, bắt buộc và quyết tâm',
    'N2-06・19: 得る, かねない, 恐れがある, ないことには, に越したことはない, ずにすむ, てはいられない; ことか, てでも, ざるを得ない, につけ, ぬきで, ことだし, さえ',
    'Khả năng: 得る／得ない. Rủi ro xấu: かねない (văn nói hơn) / 恐れがある (khách quan, thông báo). Điều kiện cần: ないことには～ない. Tốt nhất là: に越したことはない. May mà không phải: ずにすむ. Bắt buộc: ざるを得ない (trái ý muốn) / ほかない. Quyết tâm: てでも. Cảm thán: ことか. Nhấn mạnh: さえ・でさえ. Đề nghị có lý do: ことだし.',
    [
      ['このままでは、大きな事故になりかねない。', 'Cứ thế này thì có thể thành tai nạn lớn.'],
      ['台風が来るので、試合は中止せざるを得ない。', 'Vì bão đến nên buộc phải hủy trận đấu.'],
      ['どんなに苦労してでも、夢をかなえたい。', 'Dù vất vả thế nào cũng muốn biến ước mơ thành hiện thực.'],
    ],
  ],
  [
    'Ôn 6: cảm xúc, đánh giá và phủ định',
    'N2-07・08・17: てたまらない, てしょうがない, てならない, ずにはいられない, ないではいられない, ことに, ものか; だけあって, だけのことはある, だけに, ばかりか, ようがない, までもない, ことはない; に過ぎない, にほかならない, に相違ない, というものだ, というものではない, っこない, がたい',
    'Cảm xúc mạnh: てたまらない・てしょうがない (văn nói) / てならない (tự nhiên trào dâng). Không kìm được: ずにはいられない. Đánh giá xứng đáng: だけあって・だけのことはある. Vì đặc biệt nên càng: だけに. Không những… mà: ばかりか. Phủ định: ようがない (không có cách) / までもない (không cần đến) / ことはない (không cần phải). Khẳng định: にほかならない; hạ thấp: に過ぎない. Phủ định quan niệm: というものではない. Khó (tâm lý): がたい; làm sao mà: っこない.',
    [
      ['合格の知らせを聞いて、うれしくてたまらなかった。', 'Nghe tin đỗ, vui không chịu nổi.'],
      ['さすが十年住んでいるだけあって、町に詳しい。', 'Đúng là sống mười năm có khác, rất rành phố.'],
      ['値段が高ければいいというものではない。', 'Không phải cứ giá cao là tốt.'],
    ],
  ],
  [
    'Ôn 7: nhượng bộ, giả định và lập luận',
    'N2-10・12: に反して, にしても, にせよ, としても, といっても, からには, 以上（は）; とはいえ, つつ（も）, わりに, どころか, どころではない, ものなら, くらいなら',
    'Trái với: に反して. Nhượng bộ: にしても (chấp nhận rồi phê phán) / にせよ・にしろ (trang trọng) / としても (giả định) / とはいえ (thừa nhận sự thật nhưng) / つつも (dù biết vẫn). Hạ mức độ: といっても. Một khi đã: からには (quyết tâm) / 以上は (logic). Không tương xứng: わりに. Ngược lại hẳn: どころか; không phải lúc: どころではない. Nếu có thể: ものなら; thà… còn hơn: くらいなら.',
    [
      ['予想に反して、反対意見が多かった。', 'Trái với dự đoán, ý kiến phản đối nhiều.'],
      ['引き受けたからには、最後まで責任を持つ。', 'Một khi đã nhận thì chịu trách nhiệm đến cùng.'],
      ['生活は楽になるどころか、ますます苦しくなった。', 'Cuộc sống không những không dễ hơn mà còn khổ hơn.'],
    ],
  ],
  [
    'Ôn 8: suy đoán, truyền đạt và quan hệ con người',
    'N2-11・14・18: とされる, とみられる, ものと思われる, とか, に決まっている, かのようだ, ようでは; をこめて, ことだから, ところを, ようではないか, まい, はともかく, もかまわず; というと／といえば, といったら, なんか／なんて, やら～やら, げ',
    'Mức độ chắc chắn trong tin tức: とされる (nhận định chung) / とみられる (suy đoán từ dữ kiện) / ものと思われる (phán đoán của người viết). Nghe nói (thân mật): とか. Chắc chắn (chủ quan): に決まっている. Như thể: かのようだ. Cảnh báo: ようでは. Tình cảm: をこめて. Phán đoán từ tính cách: ことだから. Lịch sự: お忙しいところを. Kêu gọi: ようではないか. Quyết không: まい. Gác lại: はともかく. Bất chấp: もかまわず. Chủ đề: といえば; nhấn mạnh: といったら. Sắc thái: なんか・なんて. Vẻ ngoài cảm xúc: げ.',
    [
      ['火事の原因は、電気の配線とみられる。', 'Nguyên nhân vụ cháy được cho là do đường dây điện.'],
      ['お忙しいところを、ありがとうございました。', 'Cảm ơn anh chị đã dành thời gian trong lúc bận rộn.'],
      ['日本の夏といえば、花火大会だ。', 'Nói đến mùa hè Nhật Bản thì là lễ hội pháo hoa.'],
    ],
  ],
];

export const grammarQuestions = [
  ['N2-01: 準備ができ（　）、出発します。', '次第', '際に', 'てからでないと', 'に先立って', 'Vます + 次第: xong là làm ngay.'],
  ['N2-02: 最近、少し風邪（　）で、体がだるい。', '気味', 'がち', 'つつ', 'きり', 'N + 気味: hơi có vẻ.'],
  ['N2-03: お客様の要望（　）、メニューを変える。', 'に応じて', 'をめぐって', 'にかけては', 'を中心に', 'Thay đổi tương ứng → に応じて.'],
  ['N2-04: 改装工事中（　）、本日は休業いたします。', 'につき', 'をもって', 'に際して', 'のもとで', 'Lý do trong thông báo → につき.'],
  ['N2-05: この仕事は経験の有無（　）、誰でも応募できる。', 'を問わず', 'に限って', 'に加えて', 'はもとより', 'Không phân biệt → を問わず.'],
  ['N2-06: このまま放っておくと、大きな問題になり（　）。', 'かねない', '得ない', 'ずにすむ', 'に越したことはない', 'Có thể dẫn đến điều xấu → かねない.'],
  ['N2-07: 一人暮らしを始めたころは、家族に会いたく（　）。', 'てたまらなかった', 'ずにはいられなかった', 'ものか', 'ことに', 'Cảm xúc mạnh → てたまらない.'],
  ['N2-08: さすがプロの料理人（　）、どれもおいしい。', 'だけあって', 'ばかりか', 'までもなく', 'ようがなく', 'Xứng đáng với danh tiếng → だけあって.'],
  ['N2-09: 子ども（　）、難しい言葉をよく知っている。', 'にしては', 'に伴って', 'によっては', '次第で', 'So với chuẩn của đối tượng → にしては.'],
  ['N2-10: 約束した（　）、守らなければならない。', '以上', 'としても', 'に反して', 'といっても', 'Một khi đã… thì → 以上.'],
  ['N2-11: 事故の原因は居眠り運転（　）。', 'とみられる', 'に決まっている', 'とか', 'かのようだ', 'Suy đoán từ dữ kiện trong bản tin → とみられる.'],
  ['N2-12: 給料が安い（　）、仕事がきつい。', 'わりに', 'どころか', 'くらいなら', 'とはいえ', 'Không tương xứng → わりに.'],
  ['N2-13: 新製品の発売（　）、準備を進めている。', 'に向けて', 'にわたって', 'ばかりに', 'て以来', 'Hướng tới mục tiêu → に向けて.'],
  ['N2-14: 感謝の気持ち（　）、手紙を書いた。', 'をこめて', 'もかまわず', 'はともかく', 'ところを', 'Gửi gắm tình cảm → をこめて.'],
  ['N2-15: 小学生以下（　）、入場無料です。', 'に限り', 'を除いて', 'にこたえて', 'からして', 'Chỉ dành cho → に限り.'],
  ['N2-16: さんざん迷った（　）、何も買わなかった。', 'あげく', '末に', 'ところ', 'きり', 'Rốt cuộc kết quả xấu → あげく.'],
  ['N2-17: それはただの噂（　）。', 'に過ぎない', 'にほかならない', 'に相違ない', 'というものだ', 'Chỉ là → に過ぎない.'],
  ['N2-18: 日本の夏（　）、やっぱり花火大会だ。', 'といえば', 'といったら', 'なんて', 'やら', 'Liên tưởng điển hình → といえば.'],
  ['N2-19: 台風のため、試合は中止（　）。', 'せざるを得ない', 'してでも', 'することか', 'さえする', 'Buộc phải → せざるを得ない.'],
];

export const dialogues = [
  [
    'Trước kỳ thi JLPT',
    'A là chị Ishii, giáo viên tiếng Nhật; B là Thảo, học viên. Lớp học buổi tối, một tuần trước kỳ thi.',
    [
      ['タオさん、いよいよ来週ですね。準備はどうですか。', 'Thảo, tuần sau là thi rồi nhỉ. Chuẩn bị thế nào?'],
      ['文法は、何度も復習した末に、だいぶ自信がつきました。ただ、読解は時間が足りなくなりがちで……。', 'Ngữ pháp thì sau nhiều lần ôn em khá tự tin rồi. Có điều đọc hiểu em hay bị thiếu thời gian……'],
      ['それなら、全部を丁寧に読むより、まず質問を読んだ上で、答えを探すといいですよ。', 'Vậy thì thay vì đọc kỹ hết, em nên đọc câu hỏi trước rồi mới tìm câu trả lời.'],
      ['なるほど。先生のおっしゃるとおりにやってみます。', 'Ra vậy. Em sẽ thử làm đúng như cô nói.'],
      ['それから、試験の前日は、遅くまで勉強するに越したことはない、とは思わないでくださいね。', 'Ngoài ra, hôm trước ngày thi đừng nghĩ là học muộn càng tốt nhé.'],
      ['はい。寝不足では、実力を発揮しようがないですから。', 'Vâng. Thiếu ngủ thì không có cách nào phát huy thực lực ạ.'],
      ['そのとおり。タオさんのことだから、きっと大丈夫ですよ。', 'Đúng vậy. Thảo thì chắc chắn sẽ ổn thôi.'],
      ['ありがとうございます。合格したら、真っ先に先生にご報告します。', 'Em cảm ơn cô. Đỗ rồi em sẽ báo cô đầu tiên.'],
    ],
  ],
  [
    'Sau khi biết kết quả',
    'A là Thảo; B là Ryo, bạn người Nhật. Gọi điện thoại, hai tháng sau kỳ thi.',
    [
      ['リョウ、聞いて！N2、合格したよ！', 'Ryo, nghe này! Tớ đỗ N2 rồi!'],
      ['本当？おめでとう！あれだけ頑張っていたんだから、合格するに決まってると思ってたよ。', 'Thật à? Chúc mừng! Cố gắng như thế, tớ đã nghĩ chắc chắn đỗ mà.'],
      ['ありがとう。結果を見た時、うれしいやらほっとしたやらで、涙が出ちゃった。', 'Cảm ơn cậu. Lúc xem kết quả, vừa vui vừa nhẹ nhõm, tớ khóc luôn.'],
      ['この一年、仕事をしながら、毎日勉強していたもんね。', 'Một năm nay, vừa làm vừa học mỗi ngày mà.'],
      ['うん。何度やめようと思ったことか。でも、リョウが励ましてくれたおかげだよ。', 'Ừ. Biết bao lần tớ định bỏ cuộc. Nhưng là nhờ cậu đã động viên tớ.'],
      ['いやいや、僕は話を聞いたに過ぎないよ。次はN1に挑戦するの？', 'Không đâu, tớ chỉ nghe cậu kể thôi. Tiếp theo cậu thử N1 chứ?'],
      ['うん、せっかくここまで来たことだし、もう少し頑張ってみようと思う。', 'Ừ, đã mất công đến đây rồi, tớ định cố thêm chút nữa.'],
      ['よし、今度お祝いしよう。合格祝いに、僕がごちそうするよ。', 'Được, lần tới ăn mừng nhé. Mừng cậu đỗ, tớ khao.'],
    ],
  ],
];

export const listenings = [
  [
    'Bài giảng: cách học tiếp sau N2',
    '講師：皆さん、N2合格おめでとうございます。今日は、これからの日本語の学び方についてお話しします。\n講師：N2に合格したということは、新聞やニュースの内容を、ある程度理解できる力がついたということにほかなりません。しかし、合格はゴールではなく、新しいスタートに過ぎないのです。\n講師：実際、N2を取った後で、「日本の会社で働き始めたら、会議の内容がほとんど分からなかった」という声をよく聞きます。教科書の日本語と、実際の仕事で使われる日本語には、大きな差があるからです。\n講師：では、どうすればいいのでしょうか。一つ目は、毎日、本物の日本語に触れることです。ニュースを聞く、新聞の社説を読む、ドラマを見る。好きなことを通して学ぶに越したことはありません。\n講師：二つ目は、使うことです。いくら単語を覚えても、使わないことには、本当の力にはなりません。日本人の友達と話す、日記を書くなど、毎日少しでも日本語を使う機会を作ってください。\n講師：三つ目は、間違いを恐れないことです。間違えるのが恥ずかしくて話さないようでは、いつまでたっても上達しません。間違いは、成長の材料だと考えましょう。\n講師：また、目標をはっきりさせることも大切です。日本の会社で働きたいのか、大学院で研究したいのか、日本の小説を原文で読みたいのか。目標によって、必要な日本語は違います。目標に応じて、勉強の内容を選びましょう。\n講師：そして、仲間を作ることもおすすめします。一人で勉強していると、どうしても怠けがちになります。同じ目標を持つ仲間がいれば、互いに励まし合いながら、続けることができるはずです。\n講師：最後に、N1を目指す人も多いと思います。N1は語彙も文法も一段と難しくなりますが、皆さんがここまで続けてきた努力を考えれば、決して不可能ではありません。焦らず、一歩一歩進んでいきましょう。',
    'Giảng viên: Chúc mừng các bạn đã đỗ N2. Hôm nay tôi sẽ nói về cách học tiếng Nhật từ nay về sau.\nGiảng viên: Đỗ N2 không gì khác chính là các bạn đã có năng lực hiểu nội dung báo chí, tin tức ở một mức độ nhất định. Nhưng đỗ không phải là đích đến, mà chẳng qua chỉ là một khởi đầu mới.\nGiảng viên: Thực tế, sau khi có N2, ta hay nghe: “bắt đầu làm ở công ty Nhật thì hầu như không hiểu nội dung cuộc họp”. Vì tiếng Nhật trong sách giáo khoa và tiếng Nhật dùng trong công việc thực tế khác nhau rất nhiều.\nGiảng viên: Vậy nên làm thế nào? Thứ nhất là tiếp xúc với tiếng Nhật thật mỗi ngày. Nghe thời sự, đọc xã luận, xem phim truyền hình. Học qua điều mình thích là tốt nhất.\nGiảng viên: Thứ hai là sử dụng. Dù nhớ bao nhiêu từ, nếu không dùng thì sẽ không thành năng lực thật. Hãy tạo cơ hội dùng tiếng Nhật mỗi ngày dù ít, như nói chuyện với bạn Nhật, viết nhật ký.\nGiảng viên: Thứ ba là đừng sợ sai. Nếu cứ ngại sai mà không nói thì mãi mãi không tiến bộ. Hãy coi lỗi sai là chất liệu để trưởng thành.\nGiảng viên: Ngoài ra, làm rõ mục tiêu cũng quan trọng. Muốn làm ở công ty Nhật, muốn nghiên cứu ở cao học, hay muốn đọc tiểu thuyết Nhật bằng nguyên bản. Tùy mục tiêu mà tiếng Nhật cần thiết khác nhau. Hãy chọn nội dung học phù hợp với mục tiêu.\nGiảng viên: Và tôi cũng khuyên các bạn kết bạn. Học một mình thì thế nào cũng dễ lười. Nếu có bạn cùng mục tiêu, chắc chắn sẽ vừa động viên nhau vừa duy trì được.\nGiảng viên: Cuối cùng, chắc nhiều bạn nhắm đến N1. N1 từ vựng và ngữ pháp khó hơn hẳn, nhưng nghĩ đến nỗ lực các bạn đã kiên trì đến giờ thì tuyệt đối không phải là không thể. Đừng nóng vội, hãy tiến từng bước một.',
  ],
  [
    'Thông báo ở trung tâm thi',
    '係員：受験者の皆様にお知らせいたします。試験開始の十分前になりましたので、机の上には、受験票と鉛筆、消しゴム以外は置かないでください。\n係員：携帯電話は、電源を切った上で、かばんの中にしまってください。試験中に音が鳴った場合は、不正行為とみなされる恐れがあります。\n係員：なお、気分が悪くなった方は、遠慮なく手を挙げてください。\n係員：それでは、問題用紙を配ります。合図があるまで、開かないでください。',
    'Nhân viên: Xin thông báo đến các thí sinh. Đã đến mười phút trước giờ thi, trên bàn xin đừng để gì ngoài phiếu dự thi, bút chì và tẩy.\nNhân viên: Điện thoại xin tắt nguồn rồi cất vào cặp. Nếu có tiếng reo trong giờ thi, có khả năng bị coi là gian lận.\nNhân viên: Ngoài ra, ai thấy khó chịu trong người xin đừng ngại giơ tay.\nNhân viên: Bây giờ chúng tôi phát đề thi. Chưa có hiệu lệnh xin đừng mở.',
  ],
  [
    'Hai bạn nói chuyện sau giờ thi',
    '女：やっと終わったね。聴解、どうだった？\n男：最後の問題、答えを書くか書かないかのうちに、次の問題が始まって、焦ったよ。\n女：私も。でも、読解は思ったより時間が足りたよ。先生に教わったとおり、先に質問を読んだのがよかったみたい。\n男：いいなあ。僕は時間が足りなくて、最後の二問は勘で答えざるを得なかった。\n女：結果はともかく、今日はお疲れ様。何かおいしいものでも食べに行こうよ。',
    'Nữ: Cuối cùng cũng xong. Phần nghe thế nào?\nNam: Câu cuối, tớ vừa định ghi đáp án chưa kịp xong thì câu tiếp theo đã bắt đầu, cuống cả lên.\nNữ: Tớ cũng vậy. Nhưng phần đọc hiểu lại đủ thời gian hơn tớ nghĩ. Làm đúng như cô dạy, đọc câu hỏi trước có vẻ hay.\nNam: Sướng nhỉ. Tớ không đủ thời gian, hai câu cuối đành phải đoán.\nNữ: Kết quả tính sau, hôm nay vất vả rồi. Đi ăn gì ngon đi.',
  ],
];

export const listenQuestions = [
  [0, 'Theo giảng viên, đỗ N2 có nghĩa là gì?', 'Chỉ là một khởi đầu mới, không phải đích đến', 'Đã nói được như người Nhật', 'Không cần học nữa', 'Đủ để làm phiên dịch', '合格はゴールではなく、新しいスタートに過ぎないのです.'],
  [0, 'Giảng viên khuyên điều nào?', 'Tiếp xúc với tiếng Nhật thật, sử dụng và không sợ sai', 'Chỉ học sách giáo khoa', 'Học thuộc thật nhiều từ', 'Thi N1 ngay', '本物の日本語に触れる…使う…間違いを恐れない.'],
  [1, 'Điện thoại phải làm thế nào trong giờ thi?', 'Tắt nguồn rồi cất vào cặp', 'Để trên bàn', 'Để chế độ im lặng trong túi áo', 'Nộp cho nhân viên', '電源を切った上で、かばんの中にしまってください.'],
  [1, 'Nếu điện thoại reo thì sao?', 'Có khả năng bị coi là gian lận', 'Bị nhắc nhở', 'Không sao', 'Phải ra ngoài nghe', '不正行為とみなされる恐れがあります.'],
  [2, 'Vì sao người nữ đủ thời gian làm đọc hiểu?', 'Đọc câu hỏi trước như cô dạy', 'Đọc rất nhanh', 'Bỏ qua bài khó', 'Đề quá dễ', '先生に教わったとおり、先に質問を読んだのがよかった.'],
  [2, 'Người nam đã làm gì với hai câu cuối?', 'Đành phải đoán', 'Bỏ trống', 'Làm cẩn thận', 'Hỏi bạn', '最後の二問は勘で答えざるを得なかった.'],
];

export const readings = [
  [
    'Tùy bút: từ căn phòng sáu chiếu',
    '十年前、私は二十歳で日本に来た。最初に住んだのは、駅から徒歩二十分の古いアパートの六畳一間だった。部屋にあるのは、小さな机と布団だけ。窓を開けると、隣の家の屋根の上で、いつも一匹の猫が昼寝をしていた。\n\n日本語は、ひらがなさえ十分に読めなかった。スーパーで買い物をするにも、商品の名前が分からず、塩と砂糖を間違えて買ったこともある。アルバイト先では、店長の言っていることが聞き取れず、何度注意されたことか。夜、一人で部屋に帰ると、家族に会いたくてたまらなかった。\n\nそんな私を支えてくれたのが、アパートの大家さんだった。七十代のおばあさんで、私が困っているのを見ると、放っておけない性格だった。洗濯機の使い方が分からずに困っていた時は、わざわざ部屋まで来て、一つ一つ教えてくれた。手作りの煮物を小皿に分けて持ってきてくれたことも、一度や二度ではない。\n\n大家さんはよく「日本語は、教科書だけでは上手にならない。毎日使ってこそ身につくものだ」と言っていた。その言葉どおり、私は毎朝、大家さんの家の前を掃除しながら、その日のニュースについて話すことにした。最初は単語を並べるだけだったが、一年もすると、新聞の見出しについて意見を言い合えるまでになった。\n\n日本語が分かるようになるにつれて、見える世界も広がっていった。それまでは、ただの古い塔にしか見えなかった近所の寺の五重塔も、その歴史を知ってからは、特別な場所になった。言葉を学ぶということは、その国の人々の暮らしや考え方を知ることにほかならないのだと、私は実感した。\n\nもちろん、うまくいかないことも多かった。大学のレポートでは、日本人の学生なら当然知っている言葉を知らずに、恥ずかしい思いをした。就職活動では、面接で緊張するあまり、言いたいことの半分も言えなかった。それでも、大家さんの「失敗は恥ずかしいことではない」という言葉に背中を押されて、何とか乗り越えてきた。\n\n三年前、大家さんは亡くなった。葬儀の日、私は、日本に来て初めて、人前で声を上げて泣いた。もっとたくさんお礼を言いたかったのに、恥ずかしくて言えずじまいだったことを、今でも後悔している。\n\n今、私は日本の会社で通訳として働いている。あの六畳一間から、ずいぶん遠くまで来たものだと思う。仕事で行き詰まるたびに、私は大家さんの言葉を思い出す。そして、いつか自分も、日本で困っている外国人に手を差し伸べられる人になりたいと思うのである。',
    'Mười năm trước, tôi đến Nhật lúc hai mươi tuổi. Nơi đầu tiên tôi ở là một phòng sáu chiếu trong khu chung cư cũ, đi bộ hai mươi phút từ ga. Trong phòng chỉ có một chiếc bàn nhỏ và tấm nệm. Mở cửa sổ ra là thấy một con mèo lúc nào cũng ngủ trưa trên mái nhà bên cạnh.\n\nTiếng Nhật thì đến cả hiragana tôi cũng không đọc thạo. Đi siêu thị mua đồ cũng không biết tên hàng, có lần mua nhầm muối với đường. Ở chỗ làm thêm, tôi không nghe được quản lý nói gì, bị nhắc biết bao lần. Tối về phòng một mình, tôi nhớ gia đình đến không chịu nổi.\n\nNgười đã nâng đỡ tôi lúc đó là bà chủ nhà. Bà ngoài bảy mươi, tính tình thấy tôi khó khăn là không bỏ mặc được. Lúc tôi không biết dùng máy giặt, bà mất công đến tận phòng chỉ từng chút một. Chuyện bà chia món hầm tự nấu ra đĩa nhỏ mang sang cho tôi cũng không phải một hai lần.\n\nBà hay nói: “Tiếng Nhật chỉ học sách giáo khoa thì không giỏi được. Phải dùng mỗi ngày thì mới thấm.” Đúng như lời bà, mỗi sáng tôi vừa quét trước cửa nhà bà vừa nói chuyện về tin tức hôm đó. Ban đầu tôi chỉ xếp từ, nhưng sau một năm đã đến mức có thể trao đổi ý kiến về tít báo.\n\nCàng hiểu tiếng Nhật, thế giới tôi nhìn thấy càng rộng ra. Ngôi tháp năm tầng của ngôi chùa gần nhà, trước đó tôi chỉ thấy là một ngọn tháp cũ, từ khi biết lịch sử của nó đã trở thành nơi đặc biệt. Tôi thấm thía rằng học một ngôn ngữ chính là hiểu cuộc sống và cách nghĩ của người dân nước đó.\n\nTất nhiên cũng có nhiều chuyện không suôn sẻ. Ở bài báo cáo đại học, tôi không biết những từ mà sinh viên Nhật đương nhiên biết nên thấy xấu hổ. Khi tìm việc, vì quá căng thẳng ở buổi phỏng vấn mà điều muốn nói tôi nói chưa được một nửa. Dù vậy, được tiếp thêm động lực bởi câu nói của bà “thất bại không có gì đáng xấu hổ”, tôi đã vượt qua bằng cách nào đó.\n\nBa năm trước, bà chủ nhà qua đời. Ngày tang lễ, lần đầu tiên từ khi đến Nhật, tôi khóc thành tiếng trước mặt người khác. Muốn nói lời cảm ơn thật nhiều mà vì ngại nên rốt cuộc không nói được, đến giờ tôi vẫn hối hận.\n\nGiờ tôi làm phiên dịch ở một công ty Nhật. Tôi nghĩ mình đã đi xa thật xa từ căn phòng sáu chiếu ấy. Mỗi lần công việc bế tắc, tôi lại nhớ lời bà. Và tôi muốn một ngày nào đó mình cũng trở thành người có thể chìa tay giúp những người nước ngoài đang khó khăn ở Nhật.',
  ],
  [
    'Xã luận: học suốt đời',
    '「学校を卒業したら、勉強はもう終わり」。かつては、そう考える人が多かった。しかし、人生百年時代と言われる今、学び続けることの重要性がこれまで以上に高まっている。\n\n背景にあるのは、社会の急速な変化である。技術革新に伴って、仕事に求められる知識や技能は、数年で大きく変わるようになった。若いころに身につけた知識だけで、定年まで働き続けられる時代は、もう終わったと言わざるを得ない。実際、多くの企業が、社員の学び直しを支援する制度を取り入れつつある。\n\n一方で、学び直しの重要性は分かっていても、なかなか一歩を踏み出せない人も多い。仕事や家事に追われて時間がない、何から始めればいいか分からない、今さら勉強なんて恥ずかしい。そうした声はよく聞かれる。特に年齢を重ねるにつれて、新しいことに挑戦するのをためらいがちになるのは、無理もないことだろう。\n\nしかし、学びは、必ずしも大きなことである必要はない。通勤の電車の中で、興味のある分野の本を読む。週末に地域の講座に参加する。外国語のニュースを毎日五分聞く。そうした小さな積み重ねが、やがて大きな力になる。大切なのは、完璧を目指すことではなく、続けることなのである。\n\nまた、学ぶことの意味は、仕事に役立つかどうかだけではない。新しい知識を得ることで、物事を別の角度から見られるようになる。年齢や立場の異なる人と出会い、刺激を受けることもある。学びは、人生そのものを豊かにしてくれるものにほかならない。\n\n実際、六十歳を過ぎてから大学に入り直す人や、定年後に新しい資格を取って再び働き始める人も珍しくなくなった。そうした人たちは口をそろえて、「学ぶことで毎日に張り合いが生まれた」と言う。学びは、年齢を問わず、人を前向きにしてくれるのである。\n\nもちろん、個人の努力だけに任せるわけにはいかない。働きながら学べる環境を整えることは、社会全体の課題である。企業は、学ぶための時間や費用を支援するべきだし、国や自治体も、年齢を問わず誰もが学べる場を増やしていく必要がある。\n\n「学ぶのに遅すぎるということはない」。使い古された言葉だが、変化の激しい時代だからこそ、改めてその重みをかみしめたい。私たち一人一人が、好奇心を忘れることなく学び続ける。それこそが、これからの社会を生きる力になるのではないだろうか。',
    '“Tốt nghiệp rồi thì việc học kết thúc.” Ngày trước nhiều người nghĩ như vậy. Nhưng giờ đây, khi người ta nói là thời đại đời người trăm năm, tầm quan trọng của việc học liên tục cao hơn bao giờ hết.\n\nBối cảnh là sự thay đổi nhanh chóng của xã hội. Cùng với đổi mới công nghệ, kiến thức và kỹ năng công việc đòi hỏi đã thay đổi lớn chỉ trong vài năm. Không thể không nói rằng thời đại mà chỉ với kiến thức học được khi trẻ cũng làm việc được đến tuổi nghỉ hưu đã kết thúc. Thực tế, nhiều doanh nghiệp đang dần áp dụng chế độ hỗ trợ nhân viên học lại.\n\nMặt khác, dù hiểu tầm quan trọng của việc học lại, nhiều người mãi không bước ra được bước đầu. Bận công việc, việc nhà không có thời gian, không biết bắt đầu từ đâu, giờ mới học thì ngại. Những tiếng nói như thế hay được nghe. Đặc biệt càng lớn tuổi càng dễ do dự thử điều mới, cũng là điều dễ hiểu.\n\nTuy nhiên, việc học không nhất thiết phải là điều lớn lao. Đọc sách lĩnh vực mình quan tâm trên tàu đi làm. Cuối tuần tham gia lớp học ở địa phương. Mỗi ngày nghe tin tức tiếng nước ngoài năm phút. Những tích lũy nhỏ như thế dần dần sẽ thành sức mạnh lớn. Điều quan trọng không phải nhắm đến sự hoàn hảo mà là duy trì.\n\nNgoài ra, ý nghĩa của việc học không chỉ là có ích cho công việc hay không. Nhờ có kiến thức mới, ta có thể nhìn sự việc từ góc độ khác. Cũng có khi gặp gỡ những người khác tuổi tác, vị trí và được kích thích. Học tập chính là thứ làm phong phú bản thân cuộc sống.\n\nThực tế, người vào đại học lại sau sáu mươi tuổi, hay người lấy chứng chỉ mới sau khi nghỉ hưu rồi đi làm lại cũng không còn hiếm. Những người đó đồng thanh nói: “Nhờ học mà mỗi ngày đều có động lực.” Học tập làm con người tích cực, bất kể tuổi tác.\n\nTất nhiên, không thể chỉ giao phó cho nỗ lực cá nhân. Tạo môi trường để vừa làm vừa học là vấn đề của toàn xã hội. Doanh nghiệp nên hỗ trợ thời gian và chi phí học tập, nhà nước và chính quyền địa phương cũng cần tăng thêm nơi để ai cũng học được, không phân biệt tuổi tác.\n\n“Học thì không bao giờ là quá muộn.” Đó là câu nói đã cũ mòn, nhưng chính vì là thời đại biến động dữ dội, ta muốn một lần nữa nghiền ngẫm sức nặng của nó. Mỗi người chúng ta tiếp tục học mà không đánh mất tính tò mò. Chẳng phải chính đó sẽ là sức mạnh để sống trong xã hội từ nay về sau sao?',
  ],
];

export const readQuestions = [
  [0, 'Lúc mới đến Nhật, người viết gặp khó khăn gì?', 'Không đọc thạo chữ, không nghe được quản lý nói', 'Không có nhà ở', 'Không có việc làm', 'Bị bệnh', 'ひらがなさえ十分に読めなかった…店長の言っていることが聞き取れず.'],
  [0, 'Người viết đã luyện tiếng Nhật với bà chủ nhà thế nào?', 'Mỗi sáng vừa quét dọn vừa nói chuyện về tin tức', 'Học sách giáo khoa cùng bà', 'Viết thư cho bà', 'Xem phim cùng bà', '毎朝、大家さんの家の前を掃除しながら、その日のニュースについて話す.'],
  [0, 'Điều người viết hối hận là gì?', 'Không nói được lời cảm ơn bà vì ngại', 'Không đến dự tang lễ', 'Chuyển nhà quá sớm', 'Không học tiếng Nhật chăm', 'もっとたくさんお礼を言いたかったのに…言えずじまいだった.'],
  [1, 'Theo bài xã luận, vì sao học suốt đời ngày càng quan trọng?', 'Xã hội và kỹ năng công việc thay đổi nhanh', 'Vì có nhiều thời gian rảnh', 'Vì trường học ít đi', 'Vì lương tăng', '技術革新に伴って、仕事に求められる知識や技能は、数年で大きく変わる.'],
  [1, 'Theo bài viết, điều quan trọng trong việc học là gì?', 'Duy trì, không nhắm đến hoàn hảo', 'Học thật nhiều trong thời gian ngắn', 'Đạt chứng chỉ', 'Học ở trường lớn', '完璧を目指すことではなく、続けることなのである.'],
  [1, 'Bài viết cho rằng ai cần tạo môi trường học tập?', 'Doanh nghiệp, nhà nước và chính quyền địa phương', 'Chỉ cá nhân', 'Chỉ trường học', 'Chỉ gia đình', '企業は…支援するべきだし、国や自治体も…場を増やしていく必要がある.'],
];

export const writing = [
  [
    'Thư gửi bản thân sau một năm học N2',
    'Viết khoảng 300 ký tự (250–350) gửi chính bạn của một năm trước: những gì đã học được, khó khăn đã vượt qua và lời khuyên. Dùng ít nhất bốn mẫu N2 thuộc các nhóm khác nhau (ví dụ: ～ことか, ～た末に, ～ずじまい, ～に過ぎない, ～からには). Dùng です・ます hoặc thể thông thường thống nhất.',
    '一年前の私へ\n\n一年前のあなたは、N2の文法の多さに驚いて、本当に合格できるのかと不安でいっぱいでしたね。\nあれから毎朝三十分、通勤の電車で勉強を続けました。仕事が忙しくて、何度やめようと思ったことか。それでも、試行錯誤を重ねた末に、少しずつ新聞が読めるようになりました。\n残念ながら、日本人の友達と話す機会は思ったほど作れずじまいでした。教科書の勉強だけでは、本当の力にはならないと実感しています。\nでも、ここまで来たのは、毎日の小さな積み重ねにほかなりません。挑戦すると決めたからには、最後まで続けてください。一年後のあなたは、きっと今より成長しているはずです。',
    250,
    350,
  ],
  [
    'Bài nghị luận: học ngoại ngữ trong thời đại dịch máy',
    'Viết khoảng 400 ký tự (350–450) nêu ý kiến về câu hỏi “Khi dịch máy ngày càng chính xác, có còn cần học ngoại ngữ không?”: lập trường, lý do, phản biện và kết luận. Dùng ít nhất bốn mẫu N2 thuộc các nhóm khác nhau. Văn viết (だ・である).',
    '翻訳技術が進んでも外国語を学ぶべきか\n\n自動翻訳の精度は、ここ数年で飛躍的に向上した。旅行や簡単な仕事のやり取りなら、外国語を話せなくても困らない時代になりつつある。とはいえ、私は、これからも外国語を学ぶ意味は大きいと考える。\n第一に、言葉を学ぶことは、その国の文化や考え方を理解することにほかならない。翻訳機は言葉の意味を伝えることはできても、言葉の裏にある気持ちや習慣までは伝えがたい。\n第二に、直接話すことで生まれる信頼関係がある。相手の言葉で一言あいさつするだけでも、相手との距離はぐっと縮まるものだ。\nもちろん、すべての人が外国語を完璧に話す必要はない。翻訳技術を上手に利用するに越したことはないだろう。しかし、技術に頼るばかりでは、相手を本当に理解することはできない。\n便利な時代だからこそ、自分の言葉で人とつながる力の価値は、むしろ高まっていくに違いない。私は、これからも学び続けたいと思う。',
    350,
    450,
  ],
];
