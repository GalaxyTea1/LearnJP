// Original lesson content for N3-16 (cumulative review: Japanese culture and customs). Meanings: "english / tiếng Việt".
// Vocabulary deliberately reviews earlier N3 lessons: seven rows copied unchanged from each of N3-01 to N3-15.
import * as u01 from './n3-01.mjs';
import * as u02 from './n3-02.mjs';
import * as u03 from './n3-03.mjs';
import * as u04 from './n3-04.mjs';
import * as u05 from './n3-05.mjs';
import * as u06 from './n3-06.mjs';
import * as u07 from './n3-07.mjs';
import * as u08 from './n3-08.mjs';
import * as u09 from './n3-09.mjs';
import * as u10 from './n3-10.mjs';
import * as u11 from './n3-11.mjs';
import * as u12 from './n3-12.mjs';
import * as u13 from './n3-13.mjs';
import * as u14 from './n3-14.mjs';
import * as u15 from './n3-15.mjs';

const units=[u01,u02,u03,u04,u05,u06,u07,u08,u09,u10,u11,u12,u13,u14,u15];
const picks=[0,15,30,45,60,75,90];
export const vocab=units.flatMap(u=>picks.map(i=>u.vocab[i]));
export const reviewLedger=units.flatMap((u,n)=>picks.map(i=>({japanese:u.vocab[i][0],introducedIn:`N3-${String(n+1).padStart(2,'0')}`,reviewedIn:'N3-16'})));

export const kanji=`
祭|festival / tế|サイ|まつる、まつり|11|示|祭り（まつり）: lễ hội; 文化祭（ぶんかさい）: lễ hội văn hóa; 祭日（さいじつ）: ngày lễ
儀|ceremony / nghi|ギ||15|人|儀式（ぎしき）: nghi lễ; 礼儀（れいぎ）: lễ nghi; お辞儀（おじぎ）: cúi chào
神|god / thần|シン、ジン|かみ、かん、こう|9|示|神社（じんじゃ）: đền Thần đạo; 神様（かみさま）: thần; 精神（せいしん）: tinh thần
仏|Buddha / phật|ブツ|ほとけ|4|人|仏教（ぶっきょう）: Phật giáo; 仏像（ぶつぞう）: tượng Phật; 大仏（だいぶつ）: tượng Phật lớn
宗|religion / tông|シュウ、ソウ||8|宀|宗教（しゅうきょう）: tôn giáo; 宗派（しゅうは）: tông phái
仲|relationship / trọng|チュウ|なか|6|人|仲間（なかま）: bạn bè, đồng đội; 仲良し（なかよし）: bạn thân; 仲直り（なかなおり）: làm lành
互|mutual / hỗ|ゴ|たがい|4|二|お互い（おたがい）: lẫn nhau; 相互（そうご）: tương hỗ; 交互（こうご）: luân phiên
交|exchange, mix / giao|コウ|まじわる、まじえる、まじる、まざる、まぜる、かう、かわす|6|亠|交換（こうかん）: trao đổi; 交流（こうりゅう）: giao lưu; 交通（こうつう）: giao thông
換|exchange / hoán|カン|かえる、かわる|12|手|交換（こうかん）: trao đổi; 換気（かんき）: thông gió; 乗り換え（のりかえ）: chuyển tàu
贈|give, present / tặng|ゾウ、ソウ|おくる|18|貝|贈る（おくる）: tặng; 贈り物（おくりもの）: quà tặng; 寄贈（きぞう）: hiến tặng
祝|celebrate / chúc|シュク、シュウ|いわう|9|示|祝う（いわう）: chúc mừng; お祝い（おいわい）: quà mừng, lời chúc; 祝日（しゅくじつ）: ngày lễ
慣|accustomed / quán|カン|なれる、ならす|14|心|習慣（しゅうかん）: tập quán; 慣れる（なれる）: quen; 慣用句（かんようく）: thành ngữ
誌|magazine, record / chí|シ||14|言|雑誌（ざっし）: tạp chí; 週刊誌（しゅうかんし）: tuần san; 日誌（にっし）: nhật ký công việc
武|military / vũ|ブ、ム||8|止|武道（ぶどう）: võ đạo; 武士（ぶし）: võ sĩ samurai; 武器（ぶき）: vũ khí
舞|dance / vũ|ブ|まう、まい|15|舛|舞台（ぶたい）: sân khấu; お見舞い（おみまい）: thăm người ốm; 舞う（まう）: múa, bay lượn
踊|dance / dũng|ヨウ|おどる、おどり|14|足|踊る（おどる）: nhảy múa; 盆踊り（ぼんおどり）: múa Bon; 舞踊（ぶよう）: vũ đạo
曲|song, bend / khúc|キョク|まがる、まげる|6|曰|曲（きょく）: bản nhạc; 作曲（さっきょく）: sáng tác nhạc; 曲がる（まがる）: rẽ, cong
演|perform / diễn|エン||14|水|演奏（えんそう）: biểu diễn nhạc; 演劇（えんげき）: kịch; 出演（しゅつえん）: tham gia diễn
劇|drama / kịch|ゲキ||15|刀|劇場（げきじょう）: nhà hát; 演劇（えんげき）: kịch; 劇的（げきてき）: kịch tính
芸|art / nghệ|ゲイ||7|艸|芸術（げいじゅつ）: nghệ thuật; 芸能（げいのう）: nghệ thuật biểu diễn; 伝統芸能（でんとうげいのう）: nghệ thuật truyền thống
灯|lamp / đăng|トウ|ひ|6|火|電灯（でんとう）: đèn điện; 灯台（とうだい）: hải đăng; 灯籠（とうろう）: đèn lồng đá, đèn lồng
飾|decorate / sức|ショク|かざる|13|食|飾る（かざる）: trang trí; 飾り（かざり）: đồ trang trí; 装飾（そうしょく）: trang trí
豆|bean / đậu|トウ、ズ|まめ|7|豆|豆（まめ）: đậu; 豆腐（とうふ）: đậu phụ; 豆まき（まめまき）: ném đậu
菓|sweets / quả|カ||11|艸|お菓子（おかし）: bánh kẹo; 和菓子（わがし）: bánh kẹo Nhật; 製菓（せいか）: làm bánh kẹo
`.trim().split('\n').map(l=>l.split('|'));

// Nine review groups. [pattern, meaning, explanation, examples]
export const grammar=[
 ['Ôn 1: suy đoán và dáng vẻ','N3-01・04・05: かもしれない・はずだ, そうだ・ようだ・らしい・みたいだ, わけだ・に違いない','Mức chắc chắn tăng dần: かもしれない (có thể) < ようだ／みたいだ (có vẻ, dựa trên cảm nhận) < はずだ (lẽ ra, dựa trên lý lẽ) < に違いない (chắc chắn). そうだ (dáng vẻ, Vます＋そう) nói điều nhìn thấy sắp xảy ra; らしい (N4) là nghe nói hoặc đoán từ thông tin; N＋らしい (N3-04) là đúng chất. わけだ rút ra kết luận hợp lý; わけがない／はずがない phủ định mạnh.',[
  ['空が暗い。夜の祭りは雨で中止になるかもしれない。','Trời tối rồi. Lễ hội đêm có lẽ sẽ bị hủy vì mưa.'],
  ['屋台からいいにおいがする。焼きそばがおいしそうだ。','Có mùi thơm từ quầy hàng. Mì xào trông ngon quá.'],
  ['十年も続けているのだから、彼の踊りが上手なわけだ。','Đã tập suốt mười năm nên điệu múa của anh ấy giỏi là phải.']]],
 ['Ôn 2: sai khiến và kính ngữ','N3-02・03: させる・させられる・させていただく, 尊敬語・謙譲語','Sai khiến させる (bắt hoặc cho phép), sai khiến bị động させられる (bị bắt làm), させていただく (xin phép làm, khiêm nhường). Tôn kính: お～になる, ～（ら）れる, động từ đặc biệt (いらっしゃる, 召し上がる, ご覧になる). Khiêm nhường: お～する／いたす, động từ đặc biệt (参る, 申す, いただく). Không dùng tôn kính cho hành động của chính mình.',[
  ['子供のころ、祭りの前は毎晩太鼓を練習させられた。','Hồi nhỏ, trước lễ hội tối nào tôi cũng bị bắt tập trống.'],
  ['先生は和菓子を召し上がりながら、お茶の話をなさった。','Thầy vừa dùng bánh Nhật vừa kể chuyện trà đạo.'],
  ['本日は、私が神社をご案内いたします。','Hôm nay tôi xin được dẫn quý vị tham quan đền.']]],
 ['Ôn 3: nguyên nhân và kết quả','N3-06: ため・おかげで・せいで・からこそ・によって・ものだから・結果','おかげで cho kết quả tốt (biết ơn), せいで cho kết quả xấu (đổ lỗi), ため（に） trung tính, văn viết. からこそ nhấn chính lý do đó. によって (nguyên nhân) hay dùng trong tin tức; ものだから là lý do kiểu bào chữa trong hội thoại; 結果 nói kết quả sau một quá trình.',[
  ['町の人が協力してくれたおかげで、祭りは大成功だった。','Nhờ người dân thị trấn hợp tác, lễ hội đã rất thành công.'],
  ['台風のせいで、花火大会が中止になった。','Tại bão mà lễ hội pháo hoa bị hủy.'],
  ['伝統があるからこそ、若い人に伝えていきたい。','Chính vì có truyền thống nên tôi muốn truyền lại cho người trẻ.']]],
 ['Ôn 4: thời điểm và diễn biến','N3-07: ところだ・うちに・最中に・たとたん・ばかりだ・一方だ','ところだ: る (sắp), ている (đang), た (vừa xong). うちに: trong lúc trạng thái còn kéo dài (làm trước khi thay đổi). 最中に: đúng giữa lúc đang làm thì bị cắt ngang. たとたん: vừa làm xong thì việc bất ngờ xảy ra. ばかりだ／一方だ: xu hướng tiếp diễn một chiều (ばかりだ thường xấu đi).',[
  ['明るいうちに、神社にお参りしておこう。','Tranh thủ lúc trời còn sáng, đi viếng đền trước đã.'],
  ['盆踊りの最中に、急に雨が降ってきた。','Đang giữa lúc múa Bon thì trời bỗng đổ mưa.'],
  ['祭りに参加する若者は減る一方だ。','Người trẻ tham gia lễ hội cứ giảm dần.']]],
 ['Ôn 5: mục đích, quyết định và nghĩa vụ','N3-08・10: ように・ことにする／ことになる・ことにしている, わけにはいかない・ことだ・べきではない','ように (mục đích với động từ không ý chí hoặc thể phủ định) khác ために (động từ có ý chí). ことにする: mình quyết định; ことになる: được quyết định từ bên ngoài; ことにしている／ことになっている: thói quen tự đặt ra / quy định. わけにはいかない: không thể làm vì lý do xã hội, đạo lý; ことだ: lời khuyên; べきではない: không nên.',[
  ['お年寄りにもよく見えるように、飾りを高い所に付けた。','Để người già cũng nhìn rõ, chúng tôi treo đồ trang trí ở chỗ cao.'],
  ['今年から、町の祭りは日曜日に行うことになった。','Từ năm nay, lễ hội thị trấn được quyết định tổ chức vào chủ nhật.'],
  ['お世話になった方の結婚式だから、行かないわけにはいかない。','Là đám cưới của người đã giúp đỡ mình nên không thể không đi.']]],
 ['Ôn 6: đối tượng và lập trường','N3-09: について・に関して・に対して・として・にとって・をはじめ・において','について／に関して: chủ đề (に関して trang trọng hơn). に対して: hướng hành động, thái độ tới đối tượng, hoặc đối lập. にとって: từ lập trường của ai đó để đánh giá (đi với 大切だ, 難しい). として: với tư cách. をはじめ: lấy làm ví dụ tiêu biểu. において: trong (bối cảnh, nơi chốn) trang trọng.',[
  ['日本の宗教について、レポートを書いた。','Tôi đã viết báo cáo về tôn giáo ở Nhật.'],
  ['お正月は、日本人にとって一番大切な行事だ。','Tết là sự kiện quan trọng nhất đối với người Nhật.'],
  ['京都をはじめ、日本各地に古いお寺がある。','Khắp nơi ở Nhật, tiêu biểu là Kyoto, đều có chùa cổ.']]],
 ['Ôn 7: thay đổi và so sánh','N3-11・12: につれて・にしたがって・とともに・ば～ほど・たびに, 一方で・反面・に比べて・に代わって・かわりに・むしろ','につれて／にしたがって: hai thay đổi đi cùng nhau (にしたがって còn có nghĩa làm theo); とともに: cùng với, văn viết; ば～ほど: càng…càng. 一方で so sánh hai đối tượng hoặc hai việc; 反面 chỉ cho hai mặt của cùng một thứ. に代わって: người khác đảm nhận; かわりに: chọn B thay A, hoặc đánh đổi.',[
  ['祭りの日が近づくにつれて、町がにぎやかになってきた。','Ngày lễ hội càng đến gần, thị trấn càng trở nên nhộn nhịp.'],
  ['着物は美しい反面、一人で着るのが難しい。','Kimono đẹp nhưng mặt khác lại khó tự mặc một mình.'],
  ['昔に比べて、年賀状を書く人は減った。','So với ngày xưa, người viết thiệp chúc Tết đã giảm.']]],
 ['Ôn 8: giả định và truyền đạt','N3-13・14: 場合・としたら・さえ～ば・かぎり・たとえ～ても, によると・ということだ・とのことだ・って・にかけて・を通じて','場合（は） dùng trong quy định, hướng dẫn; としたら: giả định tách khỏi thực tế; さえ～ば: điều kiện tối thiểu; かぎり／ないかぎり: chừng nào còn / trừ khi. によると nêu nguồn tin; ということだ (trang trọng), とのことだ (lời nhắn của người cụ thể), って (khẩu ngữ). から～にかけて: khoảng không rõ ranh giới; を通じて: qua, hoặc suốt cả khoảng.',[
  ['雨の場合は、お祭りは来週に延期します。','Trường hợp mưa, lễ hội sẽ hoãn sang tuần sau.'],
  ['町の発表によると、今年の花火大会は八月十日だということだ。','Theo thông báo của thị trấn, nghe nói lễ hội pháo hoa năm nay là ngày 10 tháng 8.'],
  ['この地域では、一年を通じて色々な祭りが行われる。','Ở vùng này, suốt cả năm có nhiều lễ hội khác nhau.']]],
 ['Ôn 9: nhượng bộ và lập luận','N3-01・15: ても, ものの・ながらも・くせに・にもかかわらず・からといって・ことから・だけでなく','ても: dù… (hội thoại, chung); ものの: tuy… nhưng kết quả không như mong đợi (văn viết, trung tính); のに (N4): tiếc nuối, bất mãn; くせに: trách móc người khác; にもかかわらず: bất chấp, trang trọng; ながらも: hai mặt trái ngược ở cùng chủ thể. からといって + phủ định để phản bác; ことから: căn cứ, nguồn gốc tên gọi; だけでなく: thêm luận điểm.',[
  ['日本に五年住んでいるものの、まだ知らない習慣が多い。','Tuy đã sống ở Nhật năm năm nhưng vẫn còn nhiều tập quán tôi chưa biết.'],
  ['雨にもかかわらず、祭りには多くの人が集まった。','Mặc dù mưa, rất nhiều người đã đến lễ hội.'],
  ['外国人だからといって、日本の文化が分からないとは限らない。','Không phải cứ là người nước ngoài thì không hiểu văn hóa Nhật.']]],
];

// [title, context, [[japanese, vietnamese], …]]
export const dialogues=[
['Hỏi về lễ Shichi-Go-San','A là bà Suzuki, mẹ chủ nhà; B là Lan, du học sinh ở nhờ. Lan dùng kính ngữ.',[
 ['鈴木さん、昨日、着物を着た小さい子供たちを神社で見たんですが、何かの行事ですか。','Bác Suzuki, hôm qua cháu thấy những em bé mặc kimono ở đền, có phải là sự kiện gì không ạ?'],
 ['ああ、それは七五三よ。三歳と五歳と七歳の子供の成長を祝う行事なの。','À, đó là lễ Shichi-Go-San đấy. Là lễ mừng sự trưởng thành của trẻ ba, năm và bảy tuổi.'],
 ['そうなんですか。鈴木さんも、お子さんが小さい頃になさいましたか。','Vậy ạ. Bác cũng đã làm lễ này khi các con còn nhỏ ạ?'],
 ['ええ。娘が七歳の時に、家族みんなでお参りしたわ。写真もあるから、後で見せてあげる。','Ừ. Khi con gái bác bảy tuổi, cả nhà đã đi viếng đền. Bác có ảnh, lát nữa cho cháu xem.'],
 ['ぜひ拝見したいです。子供たちが長い袋を持っていましたが、あれは何ですか。','Cháu rất muốn được xem ạ. Các em cầm túi dài, đó là gì vậy ạ?'],
 ['千歳あめというお菓子よ。長く生きられるようにという願いが込められているの。','Đó là kẹo Chitose-ame. Trong đó gửi gắm mong ước để các con sống lâu.'],
 ['すてきな習慣ですね。ベトナムにも、子供の成長を祝う中秋節があります。','Phong tục hay quá ạ. Ở Việt Nam cũng có Tết Trung thu mừng các em nhỏ.'],
 ['へえ、そうなの。どんなことをするの？','Ồ, vậy à. Người ta làm gì thế?'],
 ['子供たちが灯りを持って町を歩いたり、月餅というお菓子を食べたりします。','Trẻ em cầm đèn lồng đi quanh phố, rồi ăn bánh gọi là bánh trung thu ạ.'],
 ['楽しそうね。今度、ランさんの国のお祭りの話も、もっと聞かせてね。','Nghe vui nhỉ. Lần sau kể cho bác nghe thêm về lễ hội ở nước cháu nhé.'],
 ['はい。写真をお持ちしますので、ぜひご覧になってください。','Vâng ạ. Cháu sẽ mang ảnh đến, mời bác xem ạ.'],
 ['楽しみにしているわ。','Bác mong lắm đấy.']]],
['Hẹn đi lễ hội mùa hè','A là Mai, B là Ken. Nói thân mật ở trường.',[
 ['ケン、今度の土曜日、夏祭りに行かない？','Ken, thứ bảy này đi lễ hội mùa hè không?'],
 ['いいね。どこの祭り？','Hay đấy. Lễ hội ở đâu?'],
 ['駅前の神社の祭り。夜は盆踊りがあって、誰でも参加できるんだって。','Lễ hội ở đền trước ga. Nghe nói buổi tối có múa Bon, ai cũng tham gia được.'],
 ['でも、踊ったことないし、ちょっと恥ずかしいな。','Nhưng tớ chưa từng múa, hơi ngại.'],
 ['大丈夫。私も初めてだけど、周りの人のまねをすれば踊れるらしいよ。','Không sao. Tớ cũng lần đầu, nhưng hình như cứ bắt chước người xung quanh là múa được.'],
 ['そうか。じゃあ、浴衣を着ていこうかな。','Vậy à. Thế tớ có nên mặc yukata đi không nhỉ.'],
 ['いいと思う！レンタルの店もあるし、着方も教えてもらえるよ。','Tớ thấy hay đấy! Có tiệm cho thuê, còn được hướng dẫn cách mặc nữa.'],
 ['天気はどうかな。最近、夕方によく雨が降るから。','Thời tiết không biết sao. Dạo này chiều tối hay mưa.'],
 ['天気予報によると、土曜日は一日中晴れるって。','Theo dự báo, thứ bảy nắng cả ngày.'],
 ['よかった。屋台で何を食べるか、今から楽しみだ。','Tốt quá. Giờ tớ đã háo hức không biết sẽ ăn gì ở quầy hàng rồi.'],
 ['食べすぎないようにね。じゃあ、六時に駅で。','Đừng ăn nhiều quá đấy. Vậy sáu giờ ở ga nhé.'],
 ['了解。楽しみにしてる。','Được. Tớ mong lắm.']]],
];

// [title, japanese, vietnamese]
export const readings=[
['Lễ hội và sự kiện trong năm','日本には、季節ごとに色々な年中行事がある。その多くは、神道や仏教などの宗教と深く関係しているが、今では宗教というより、家族や地域の人が集まる大切な機会になっている。外国人の観光客の中には、こうした行事に参加することを目的に日本を訪れる人も少なくない。\n一年は、お正月から始まる。元日には、家族でおせち料理を食べたり、神社にお参りしたりする。子供たちにとって一番の楽しみは、親や親せきからもらうお年玉だろう。また、昔に比べて減ったものの、今でも多くの人が年賀状を送って、新年のあいさつをする。\n二月の初めには節分がある。「鬼は外、福は内」と言いながら豆をまいて、悪いものを家から追い出す行事だ。自分の年の数だけ豆を食べると、一年間元気に過ごせると言われている。\n夏になると、各地で祭りや花火大会が開かれる。八月のお盆には、亡くなった家族の魂が家に帰ってくると考えられていることから、多くの人がふるさとに帰ってお墓参りをする。帰省する人が多いせいで、この時期は新幹線も高速道路もとても込む。夜には盆踊りが行われ、地域の人が輪になって踊る。\n秋には、各地で収穫に感謝する祭りが行われる。神社の前には屋台が並び、子供から大人まで楽しめる。また、十一月には七五三があり、子供が着物を着て神社にお参りし、成長を祝う。年末になると、一年の汚れを落とす大掃除をして、新しい年を迎える準備をする。\nこのような行事は、時代とともに少しずつ形を変えてきた。例えば、最近はおせち料理を家で作らずに、デパートで買う家庭が増えている。一方で、若い人が浴衣を着て祭りに参加するなど、伝統を新しい形で楽しむ動きもある。また、担い手が減ったため、外国人の住民に参加してもらっている地域の祭りもある。\n形が変わったからといって、行事の意味がなくなるわけではない。家族の健康を願い、地域の仲間と季節を祝うという気持ちは、昔も今も変わらないのだ。行事を通じて、日本人が何を大切にしてきたかが見えてくるだろう。','Ở Nhật có nhiều sự kiện thường niên theo từng mùa. Phần lớn gắn sâu với tôn giáo như Thần đạo hay Phật giáo, nhưng ngày nay, nói là tôn giáo thì đúng hơn là dịp quan trọng để gia đình và người trong vùng tụ họp. Trong số khách du lịch nước ngoài, cũng không ít người đến Nhật với mục đích tham gia những sự kiện như thế này.\nMột năm bắt đầu bằng Tết. Ngày mùng một, cả nhà ăn món osechi, đi viếng đền. Niềm vui lớn nhất của trẻ con có lẽ là tiền mừng tuổi nhận từ bố mẹ và họ hàng. Ngoài ra, tuy giảm so với ngày xưa nhưng đến nay nhiều người vẫn gửi thiệp chúc Tết để chào năm mới.\nĐầu tháng hai có lễ Setsubun. Đó là lễ vừa nói “Quỷ ra ngoài, phúc vào nhà” vừa ném đậu để đuổi điều xấu ra khỏi nhà. Người ta nói nếu ăn số hạt đậu bằng số tuổi mình thì cả năm sẽ khỏe mạnh.\nĐến mùa hè, khắp nơi tổ chức lễ hội và lễ hội pháo hoa. Vào dịp Obon tháng tám, vì người ta cho rằng linh hồn người thân đã mất trở về nhà nên nhiều người về quê viếng mộ. Tại người về quê đông nên thời gian này cả tàu Shinkansen lẫn đường cao tốc đều rất đông. Buổi tối có múa Bon, người trong vùng xếp thành vòng tròn và múa.\nMùa thu, khắp nơi tổ chức lễ hội tạ ơn mùa màng. Trước đền bày các quầy hàng, từ trẻ con đến người lớn đều vui được. Ngoài ra, tháng mười một có lễ Shichi-Go-San, trẻ em mặc kimono đi viếng đền để mừng sự trưởng thành. Đến cuối năm, người ta tổng vệ sinh để rũ sạch bụi bẩn của một năm, chuẩn bị đón năm mới.\nNhững sự kiện như vậy đã thay đổi hình thức từng chút cùng thời đại. Ví dụ, gần đây số gia đình không tự nấu osechi mà mua ở trung tâm thương mại đang tăng. Mặt khác, cũng có xu hướng tận hưởng truyền thống theo cách mới, như người trẻ mặc yukata đi lễ hội. Ngoài ra, cũng có lễ hội địa phương vì thiếu người kế tục nên mời cư dân nước ngoài tham gia.\nKhông phải cứ hình thức thay đổi là ý nghĩa của sự kiện mất đi. Tấm lòng cầu sức khỏe cho gia đình, cùng bạn bè trong vùng mừng mùa, xưa và nay vẫn không đổi. Thông qua các sự kiện, có lẽ ta sẽ thấy được người Nhật đã trân trọng điều gì.'],
['Văn hóa tặng quà','私が日本に来て一番驚いたのは、贈り物の習慣の多さだ。\n日本に来たばかりの頃、隣の家の人が引っ越しのあいさつだと言って、タオルを持ってきてくれた。ベトナムでは、引っ越してきた人が近所に物を配ることはあまりないので、何かお返しをするべきかどうか、とても迷った。後で大家さんに聞いてみたところ、お返しはしなくてもいいということだった。\nその後も、日本の贈り物の習慣には何度も驚かされた。夏にはお中元、年末にはお歳暮という、お世話になった人に贈り物をする習慣がある。旅行に行けば、職場の人にお土産のお菓子を買ってくるのが普通だ。結婚や出産のお祝いをもらった場合には、もらった金額の半分ぐらいの品物を返す「内祝い」という習慣もある。病気の人を訪ねる時には「お見舞い」として花や果物を持っていくが、鉢植えの花は、根が付くことから「病気が長引く」ことを連想させるので、避けた方がいいそうだ。\n最初は、なぜこんなに物を贈り合うのか分からなかった。お金もかかるし、正直に言うと、面倒だと思ったこともある。しかし、職場の先輩にその話をしたところ、「贈り物は、物そのものより、人と人との関係を大切にする気持ちを伝えるためのものなんだよ」と教えてくれた。それを聞いて、私の考えは少し変わった。贈り物は、言葉にしにくい気持ちを形にする方法の一つなのだと気がついたのだ。\n考えてみれば、ベトナムにも、テトの時にお世話になった人を訪ねて、お菓子やお酒を贈る習慣がある。形は違っても、感謝の気持ちを伝えるという点では同じなのだ。ただ、ベトナムでは贈り物をその場で開けて喜ぶことが多いが、日本では後で開けることが多いという違いもある。\n今では、私も旅行の後には、職場の皆に小さなお菓子を配るようにしている。たとえ小さな物でも、「ありがとう」の気持ちが伝われば、お互いの関係はもっとよくなるはずだ。習慣に慣れるには時間がかかったが、それを理解したことで、日本の生活がもっと楽しくなった。','Điều làm tôi ngạc nhiên nhất khi đến Nhật là có quá nhiều tập quán tặng quà.\nHồi mới đến Nhật, người nhà bên cạnh mang khăn tắm sang, nói là để chào hỏi khi chuyển đến. Ở Việt Nam, người mới chuyển đến ít khi phát đồ cho hàng xóm, nên tôi rất phân vân không biết có nên đáp lễ gì không. Sau đó hỏi chủ nhà thì được biết không cần đáp lễ.\nSau đó tôi còn nhiều lần ngạc nhiên vì tập quán tặng quà của Nhật. Có tập quán tặng quà cho người đã giúp đỡ mình: mùa hè là ochugen, cuối năm là oseibo. Đi du lịch thì mua bánh kẹo làm quà cho người ở chỗ làm là chuyện bình thường. Khi nhận quà mừng cưới hay mừng sinh con, còn có tập quán “uchi-iwai” đáp lại món đồ khoảng một nửa số tiền đã nhận. Khi đi thăm người ốm thì mang hoa hay hoa quả làm quà “omimai”, nhưng nghe nói nên tránh hoa trồng chậu, vì từ việc có rễ bám mà gợi đến chuyện “bệnh kéo dài”.\nLúc đầu tôi không hiểu sao lại tặng nhau nhiều đồ như vậy. Vừa tốn tiền, nói thật là đã có lúc tôi thấy phiền. Nhưng khi kể chuyện đó với một đàn anh ở chỗ làm, anh ấy bảo: “Quà tặng là để truyền đạt tấm lòng trân trọng mối quan hệ giữa người với người, hơn là bản thân món đồ.” Nghe vậy, suy nghĩ của tôi thay đổi một chút. Tôi nhận ra quà tặng là một cách biến tấm lòng khó nói thành lời thành hình hài.\nNghĩ lại thì ở Việt Nam cũng có tập quán dịp Tết đến thăm người đã giúp đỡ mình và tặng bánh kẹo, rượu. Dù hình thức khác nhau nhưng ở điểm truyền đạt lòng biết ơn thì giống nhau. Chỉ có điều, ở Việt Nam thường mở quà ngay tại chỗ để bày tỏ niềm vui, còn ở Nhật thường mở sau.\nGiờ đây, sau mỗi chuyến du lịch tôi cũng cố gắng phát chút bánh kẹo cho mọi người ở chỗ làm. Dù chỉ là món nhỏ, nếu truyền đạt được lòng “cảm ơn” thì quan hệ giữa hai bên chắc chắn sẽ tốt hơn. Quen với tập quán mất thời gian, nhưng nhờ hiểu được điều đó mà cuộc sống ở Nhật vui hơn.'],
];

// [title, transcript, vietnamese]
export const listenings=[
['Chương trình phát thanh: lễ Obon','アナウンサー：皆さん、こんにちは。「日本の季節」の時間です。今日は、八月のお盆についてお話しします。ゲストは、民俗学がご専門の山本先生です。先生、よろしくお願いします。\n山本：よろしくお願いします。\nアナウンサー：お盆というと、ふるさとに帰る人で、電車や道路が込むイメージがありますね。そもそも、お盆はどんな行事なんでしょうか。\n山本：お盆は、亡くなった家族の魂を家に迎えて、また送り出す行事です。もともとは仏教の行事でしたが、日本に古くからあった先祖を大切にする考え方と一緒になって、今の形になったと言われています。\nアナウンサー：なるほど。具体的には、どんなことをするんですか。\n山本：地域によって違いますが、多くの家では、十三日の夕方に家の前で小さな火をたいて、魂を迎えます。これを「迎え火」と言います。そして、十六日には「送り火」をたいて、魂を送ります。京都の「五山の送り火」は、その大きなものとして有名ですね。\nアナウンサー：盆踊りも、お盆の行事なんですか。\n山本：はい。盆踊りは、もともと帰ってきた魂を迎えて、なぐさめるための踊りでした。でも、時代とともに、地域の人が集まって楽しむお祭りのような行事に変わってきました。\nアナウンサー：お盆には、特別な飾りもあるそうですね。\n山本：はい。きゅうりとなすで馬と牛を作って飾る地域があります。魂が早く帰ってこられるように、来る時は足の速い馬に乗って、帰る時はゆっくり帰れるように牛に乗って行く、という意味が込められているんです。\nアナウンサー：かわいらしい習慣ですね。\nアナウンサー：最近は、お盆の過ごし方も変わってきているそうですね。\n山本：そうですね。仕事が忙しくてふるさとに帰れない人も増えましたし、オンラインでお墓参りができるサービスもあるということです。形が変わるのは、仕方がないことだと思います。\nアナウンサー：では、先生は、お盆の何が一番大切だとお考えですか。\n山本：家族が集まって、亡くなった人のことを思い出し、話をすること。それさえ忘れなければ、お盆の意味は残ると思いますよ。\nアナウンサー：山本先生、ありがとうございました。','Phát thanh viên: Xin chào quý vị. Đây là chương trình “Mùa ở Nhật”. Hôm nay chúng tôi nói về lễ Obon tháng tám. Khách mời là thầy Yamamoto, chuyên ngành dân tộc học. Kính chào thầy.\nYamamoto: Xin chào.\nPhát thanh viên: Nhắc đến Obon là có hình ảnh tàu và đường đông nghịt người về quê nhỉ. Vốn dĩ Obon là lễ như thế nào ạ?\nYamamoto: Obon là lễ đón linh hồn người thân đã mất về nhà rồi lại tiễn đi. Ban đầu là lễ Phật giáo, nhưng người ta nói rằng nó đã kết hợp với quan niệm trân trọng tổ tiên vốn có từ xưa ở Nhật để thành hình thức như hiện nay.\nPhát thanh viên: Ra vậy. Cụ thể thì người ta làm gì ạ?\nYamamoto: Tùy vùng mà khác nhau, nhưng nhiều nhà vào chiều tối ngày 13 sẽ đốt lửa nhỏ trước nhà để đón linh hồn. Gọi là “lửa đón”. Ngày 16 thì đốt “lửa tiễn” để tiễn linh hồn. “Lửa tiễn năm ngọn núi” ở Kyoto nổi tiếng là phiên bản lớn của việc đó.\nPhát thanh viên: Múa Bon cũng là nghi lễ của Obon ạ?\nYamamoto: Vâng. Múa Bon vốn là điệu múa để đón và an ủi linh hồn trở về. Nhưng cùng với thời đại, nó đã thành sự kiện giống lễ hội để người trong vùng tụ họp vui chơi.\nPhát thanh viên: Nghe nói dịp Obon cũng có đồ trang trí đặc biệt.\nYamamoto: Vâng. Có vùng làm con ngựa và con bò bằng dưa chuột và cà tím để bày. Ý nghĩa gửi gắm là để linh hồn về nhanh thì khi đến cưỡi ngựa chạy nhanh, còn khi về thì cưỡi bò để đi thong thả.\nPhát thanh viên: Tập quán đáng yêu quá.\nPhát thanh viên: Nghe nói gần đây cách đón Obon cũng đang thay đổi.\nYamamoto: Đúng vậy. Số người bận việc không về quê được đã tăng, nghe nói còn có cả dịch vụ viếng mộ trực tuyến. Tôi nghĩ hình thức thay đổi cũng là điều không tránh được.\nPhát thanh viên: Vậy thầy cho rằng điều quan trọng nhất của Obon là gì ạ?\nYamamoto: Là việc gia đình tụ họp, nhớ đến người đã mất và trò chuyện. Chỉ cần không quên điều đó thì ý nghĩa của Obon sẽ còn mãi.\nPhát thanh viên: Xin cảm ơn thầy Yamamoto.'],
['Bạn kể về tập quán tặng quà','マイ：ケン、明日から実家に帰るんだって？\nケン：うん。でも、お土産を何にするか、まだ決めてないんだ。\nマイ：日本では、帰省する時もお土産を持っていくの？\nケン：うん、持っていくことにしてる。家族だけじゃなくて、近所のおばさんにも渡すことになってるんだ。子供の頃からお世話になってるから、渡さないわけにはいかないよ。\nマイ：大変だね。何がいいかな。\nケン：東京のお菓子がいいと思う。日持ちするし、みんなで分けられるから。','Mai: Ken, nghe nói mai cậu về quê à?\nKen: Ừ. Nhưng tớ vẫn chưa quyết mua quà gì.\nMai: Ở Nhật, về quê cũng mang quà à?\nKen: Ừ, tớ đặt lệ là mang. Không chỉ gia đình, theo lệ còn phải biếu cả bác hàng xóm. Từ nhỏ bác ấy đã chăm sóc tớ nên không thể không biếu.\nMai: Vất vả nhỉ. Mua gì thì được nhỉ?\nKen: Tớ nghĩ bánh kẹo Tokyo là được. Để được lâu, lại chia cho mọi người được.'],
['Hướng dẫn phép lịch sự ở đền','ガイド：皆さん、ここから神社に入ります。鳥居をくぐる前に、軽くお辞儀をしてください。道の真ん中は神様が通る道だと言われていますので、少し端を歩きましょう。手水舎では、ひしゃくで左手、右手の順に洗います。お参りの時は、お賽銭を入れてから、二回お辞儀をして、二回手をたたき、最後にもう一度お辞儀をします。難しく感じるかもしれませんが、大切なのは形より気持ちです。間違えても、心を込めてお参りすれば大丈夫ですよ。','Hướng dẫn viên: Thưa quý vị, từ đây chúng ta vào đền. Trước khi đi qua cổng torii, xin cúi chào nhẹ. Người ta nói giữa đường là lối thần đi nên chúng ta đi sát mép một chút. Ở chỗ rửa tay, dùng gáo rửa tay trái rồi đến tay phải. Khi viếng, bỏ tiền công đức rồi cúi chào hai lần, vỗ tay hai lần, cuối cùng cúi chào thêm một lần. Có thể quý vị thấy khó, nhưng điều quan trọng là tấm lòng hơn là hình thức. Dù có nhầm, chỉ cần viếng với tất cả tấm lòng là được.'],
];

// [question, correct, distractor, distractor, distractor, explanation]
export const grammarQuestions=[
['N3-01: この祭りは人が多くて、歩き（　）。','にくい','やすい','ながら','たい','Khó đi vì đông người: Vます＋にくい.'],
['N3-02: 子供のころ、毎日ピアノを練習（　）。“Tôi đã bị bắt tập.”','させられた','させた','された','してもらった','Sai khiến bị động: させられる.'],
['N3-03: 神社の方に「どうぞ、お茶を（　）ください」と言われた。','召し上がって','いただいて','参って','申して','Tôn kính của 飲む／食べる: 召し上がる.'],
['N3-04: 空が暗くなってきた。雨が降り（　）だ。','そう','よう','らしい','みたい','Dáng vẻ sắp xảy ra: Vます＋そうだ.'],
['N3-05: 毎年行っている祭りだから、道に迷う（　）。','わけがない','わけだ','かもしれない','に違いない','Phủ định mạnh dựa trên lý lẽ: わけがない.'],
['N3-06: 地元の人が手伝ってくれた（　）、祭りは成功した。','おかげで','せいで','くせに','ものの','Kết quả tốt, biết ơn: おかげで.'],
['N3-07: 花火を見ている（　）、雨が降ってきた。','最中に','たとたん','ばかりに','一方で','Đang giữa lúc thì bị cắt ngang: 最中に.'],
['N3-08: 毎年、正月には実家に帰る（　）。“Thói quen tôi tự đặt ra.”','ことにしている','ことになっている','ようになる','ところだ','Thói quen tự đặt: ことにしている; quy định: ことになっている.'],
['N3-09: 京都（　）、日本各地に古いお寺がある。','をはじめ','について','に対して','として','Lấy làm ví dụ tiêu biểu: をはじめ.'],
['N3-10: 招待されたのだから、行かない（　）。“Không thể không đi.”','わけにはいかない','わけがない','ことだ','ものだ','ないわけにはいかない: không thể không làm vì đạo lý.'],
['N3-11: 祭りが近づく（　）、町がにぎやかになる。','につれて','にかけて','に比べて','に対して','Hai thay đổi đi cùng nhau: につれて.'],
['N3-12: 昔（　）、祭りに参加する若者が減った。','に比べて','に代わって','によって','について','So sánh với quá khứ: に比べて.'],
['N3-13: 雨の（　）は、祭りは中止になります。','場合','としたら','かぎり','さえ','Quy định cho một trường hợp: Nの場合は.'],
['N3-14: 町の発表（　）、今年の花火大会は八月十日だそうだ。','によると','にとって','について','に対して','Nguồn tin: によると.'],
['N3-15: 日本に十年住んでいる（　）、まだ知らない習慣がある。','にもかかわらず','からといって','ことから','だけでなく','Kết quả trái dự đoán: にもかかわらず.'],
];

// [listening index, question, correct, distractor, distractor, distractor, evidence]
export const listenQuestions=[
[0,'Ý chính của cuộc nói chuyện là gì?','Ý nghĩa và sự thay đổi của lễ Obon','Cách đặt vé tàu về quê','Lịch sử Kyoto','Cách múa Bon cho đúng','お盆は、亡くなった家族の魂を家に迎えて、また送り出す行事です.'],
[0,'Theo thầy Yamamoto, điều quan trọng nhất của Obon là gì?','Gia đình tụ họp, nhớ và nói chuyện về người đã mất','Về quê bằng mọi giá','Đốt lửa thật lớn','Dùng dịch vụ viếng mộ trực tuyến','家族が集まって、亡くなった人のことを思い出し、話をすること.'],
[1,'Vì sao Ken không thể không biếu quà bác hàng xóm?','Bác ấy đã chăm sóc Ken từ nhỏ','Bác ấy là người thân','Bác ấy yêu cầu','Ken muốn được nhận quà lại','子供の頃からお世話になってるから、渡さないわけにはいかない.'],
[1,'Ken định mua quà gì?','Bánh kẹo Tokyo để được lâu và chia được','Rượu','Khăn tắm','Chưa quyết, không mua','東京のお菓子がいい…日持ちするし、みんなで分けられる.'],
[2,'Khi viếng đền, thứ tự đúng là gì?','Bỏ tiền, cúi hai lần, vỗ tay hai lần, cúi một lần','Vỗ tay hai lần rồi bỏ tiền','Cúi một lần, vỗ tay ba lần','Rửa tay phải trước','お賽銭を入れてから、二回お辞儀をして、二回手をたたき、最後にもう一度お辞儀.'],
[2,'Thái độ của hướng dẫn viên với người làm sai?','Bao dung: tấm lòng quan trọng hơn hình thức','Nghiêm khắc, bắt làm lại','Không quan tâm','Khuyên không nên vào đền','大切なのは形より気持ちです.'],
];

// [reading index, question, correct, distractor, distractor, distractor, evidence]
export const readQuestions=[
[0,'Ý chính của bài đọc là gì?','Hình thức sự kiện thay đổi nhưng tấm lòng bên trong không đổi','Sự kiện truyền thống đang biến mất','Người trẻ không thích lễ hội','Tôn giáo quan trọng hơn gia đình','形が変わったからといって、行事の意味がなくなるわけではない.'],
[0,'Vì sao nhiều người về quê vào dịp Obon?','Vì người ta cho rằng linh hồn người thân trở về nhà','Vì được nghỉ dài','Vì có lễ hội pháo hoa','Vì phải ăn osechi','魂が家に帰ってくると考えられていることから.'],
[0,'Theo bài, ăn đậu ở Setsubun có ý nghĩa gì?','Ăn số hạt bằng tuổi mình thì cả năm khỏe mạnh','Để đuổi khách','Để mừng tuổi trẻ con','Để chúc mừng năm mới bằng thiệp','自分の年の数だけ豆を食べると、一年間元気に過ごせる.'],
[1,'「それを聞いて」 trong bài, それ chỉ điều gì?','Lời đàn anh rằng quà để truyền tấm lòng trân trọng quan hệ','Chuyện tốn tiền','Câu hỏi của chủ nhà','Tập quán ở Việt Nam','贈り物は、物そのものより、人と人との関係を大切にする気持ちを伝えるためのもの.'],
[1,'Lúc mới đến, người viết phân vân điều gì?','Có nên đáp lễ hàng xóm không','Có nên chuyển nhà không','Nên mua khăn ở đâu','Có nên về nước không','何かお返しをするべきかどうか、とても迷った.'],
[1,'Ý định của người viết khi viết bài này?','Kể việc hiểu ra ý nghĩa tập quán tặng quà và thấy cuộc sống vui hơn','Phê phán tập quán tặng quà','Hướng dẫn cách gói quà','Quảng cáo bánh kẹo','それを理解したことで、日本の生活がもっと楽しくなった.'],
];

// [title, prompt, sample, min, max]
export const writing=[
['Báo cáo một phong tục','Viết 250–350 ký tự giới thiệu một phong tục hoặc lễ hội (của Nhật, Việt Nam hay nơi bạn biết): thời gian, nguồn gốc, người ta làm gì, ý nghĩa, và cảm nghĩ của bạn. Dùng ít nhất ba mẫu ngữ pháp N3 thuộc các nhóm khác nhau (ví dụ ことから, によると, につれて, ものの). Văn viết (だ・である).','ベトナムでは、旧暦の八月十五日に中秋節という行事がある。月が一年で一番美しく見えることから、「子供の祭り」として大切にされてきた。\nこの日、子供たちは星や魚の形をした灯りを持って町を歩き、獅子舞を見たり、月餅というお菓子を食べたりする。祖母によると、昔は農家の親が、収穫の後で子供と過ごす時間を作るための行事だったということだ。\n町が発展するにつれて、プラスチックの灯りが増えるなど、祭りの形は変わってきた。しかし、家族が集まって子供の成長を喜ぶという意味は、今も変わっていない。\n私も子供の頃、この日を毎年楽しみにしていた。日本の七五三と同じように、子供の幸せを願う気持ちが込められた、すてきな習慣だと思う。',250,350],
['So sánh phong tục Việt–Nhật','Viết 250–350 ký tự so sánh một phong tục của Việt Nam và Nhật Bản (Tết, tặng quà, cưới hỏi, viếng mộ…): nêu điểm giống và khác bằng 一方で／に比べて, đưa ít nhất một nhận xét bằng からといって hoặc にもかかわらず, kết bằng ý kiến. Văn viết (だ・である).','日本とベトナムは、どちらも新年をとても大切にする国だ。しかし、その祝い方には違いがある。\n日本のお正月は一月一日だが、ベトナムのテトは旧暦で祝うので、毎年日にちが変わる。日本では、家族で静かに過ごし、神社にお参りする人が多い。一方で、ベトナムのテトは、親せきや近所の家を次々に訪ねて、にぎやかに過ごすのが特徴だ。\n子供にお金をあげる習慣は、どちらの国にもある。日本のお年玉に比べて、ベトナムでは赤い袋に入れて「一年元気でいられるように」という願いを込める点が印象的だ。\n祝い方が違うからといって、気持ちが違うわけではない。家族の健康と幸せを願う心は、二つの国に共通していると思う。',250,350],
];

// [word, correct reading, distractor, distractor, distractor]
export const kanjiQuestions=[['祭り','まつり','さいり','まいり','まつる'],['儀式','ぎしき','ぎしょく','いしき','ぎしけ'],['神社','じんじゃ','しんしゃ','かみしゃ','じんしゃ'],['仏教','ぶっきょう','ぶつきょう','ふっきょう','ほとけきょう'],['習慣','しゅうかん','しゅかん','しゅうがん','しょうかん'],['交換','こうかん','こうがん','こかん','きょうかん'],['贈り物','おくりもの','ぞうりもの','おくりぶつ','おくもの'],['舞台','ぶたい','まいだい','ぶだい','むたい'],['演劇','えんげき','えんぎ','えんげい','えんけき'],['和菓子','わがし','わかし','わかこ','わがこ']];
