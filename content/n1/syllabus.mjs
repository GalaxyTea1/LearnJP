// N1 syllabus: 24 lessons. Lessons 1–23 teach eight new grammar points each; lesson 24 reviews.
// `keywords` place kanji by topic (scripts/content/planning/assign-kanji.mjs → kanji-plan.json).
export const level = 'N1';
export const levelId = 80001;
export const units = [
  {
    code: 'N1-01', title: 'Đọc xã luận', titleJp: '社説を読む',
    topics: ['Xã luận', 'Lập luận của tác giả', 'Vừa… liền'],
    grammar: ['～が早いか', '～や否や', '～そばから', '～なり', '～を皮切りに', '～を機に', '～てからというもの', '～をふまえて'],
    keywords: ['editorial', 'opinion', 'thesis', 'argue', 'assert', 'premise', 'reason'],
  },
  {
    code: 'N1-02', title: 'Triết học và tư tưởng', titleJp: '哲学と思想',
    topics: ['Tư tưởng', 'Bản chất con người', 'Chính vì… nên'],
    grammar: ['～あっての', '～ばこそ', '～なくして（は）', '～ことなしに', '～ならでは', '～ゆえに', '～たる', '～ともあろう'],
    keywords: ['philosophy', 'thought', 'virtue', 'moral', 'truth', 'soul', 'spirit', 'existence', 'principle', 'wisdom'],
  },
  {
    code: 'N1-03', title: 'Kinh tế và tài chính', titleJp: '経済と金融',
    topics: ['Thị trường', 'Tài chính', 'Tùy thuộc'],
    grammar: ['～いかんで／～いかんによって', '～いかんにかかわらず／～いかんを問わず', '～如何（いかん）', '～ようによっては', '～を前提に', '～からなる', '～にかかわる', '～を余儀なくされる／～を余儀なくさせる'],
    keywords: ['finance', 'bank', 'interest', 'loan', 'fund', 'stock', 'market', 'deposit', 'tax', 'budget', 'debt', 'capital'],
  },
  {
    code: 'N1-04', title: 'Chính trị và ngoại giao', titleJp: '政治と外交',
    topics: ['Quốc hội', 'Ngoại giao', 'Ở cương vị'],
    grammar: ['～にあって', '～ともなると', '～ともなれば', '～ともなく／～ともなしに', '～にして', '～を限りに', '～に先駆けて', '～をおいて'],
    keywords: ['government', 'politics', 'diplomacy', 'treaty', 'ambassador', 'emperor', 'king', 'minister', 'parliament', 'nation', 'territory'],
  },
  {
    code: 'N1-05', title: 'Pháp luật và công lý', titleJp: '法と正義',
    topics: ['Tòa án', 'Quy định', 'Không được phép'],
    grammar: ['～べからず', '～まじき', '～に則って', '～に照らして', '～に即して', '～ものとする', '～てしかるべきだ', '～てはばからない'],
    keywords: ['law', 'court', 'judge', 'trial', 'prison', 'punish', 'crime', 'sue', 'penalty', 'guilt', 'witness', 'regulation'],
  },
  {
    code: 'N1-06', title: 'Khoa học tiên phong', titleJp: '科学技術の最前線',
    topics: ['Nghiên cứu mũi nhọn', 'Vũ trụ', 'Không chỉ… mà'],
    grammar: ['～にとどまらず', '～はおろか', '～もさることながら', '～ひとり～のみならず', '～ただ～のみ', '～と相まって', '～を経て', '～からある'],
    keywords: ['science', 'atom', 'cell', 'gene', 'space', 'star', 'planet', 'orbit', 'crystal', 'metal', 'experiment', 'microscope'],
  },
  {
    code: 'N1-07', title: 'Y học và đạo đức sinh học', titleJp: '医療と生命倫理',
    topics: ['Y học hiện đại', 'Đạo đức', 'Không thể chịu nổi'],
    grammar: ['～にたえない', '～にたえる', '～に足る', '～にかたくない', '～を禁じ得ない', '～てやまない', '～ずにはおかない', '～ずにはすまない'],
    keywords: ['medical', 'surgery', 'disease', 'cure', 'birth', 'death', 'womb', 'tumor', 'poison', 'symptom', 'nurse', 'life'],
  },
  {
    code: 'N1-08', title: 'Văn học và phê bình', titleJp: '文学と批評',
    topics: ['Tác phẩm văn học', 'Phê bình', 'Như thể'],
    grammar: ['～ごとき／～ごとく', '～んばかりに', '～とばかりに', '～めく', '～ながらに', '～かたがた', '～かたわら', '～がてら'],
    keywords: ['literature', 'novel', 'poem', 'verse', 'author', 'write', 'book', 'chapter', 'story', 'drama', 'criticism', 'style'],
  },
  {
    code: 'N1-09', title: 'Ngôn ngữ học', titleJp: '言葉と言語学',
    topics: ['Ngôn ngữ', 'Cách diễn đạt', 'Nói đến… thì'],
    grammar: ['～ときたら', '～といったらない', '～といい～といい', '～というところだ／～といったところだ', '～とあって', '～とあれば', '～と思いきや', '～とは'],
    keywords: ['language', 'word', 'speech', 'sentence', 'meaning', 'translate', 'dialect', 'grammar', 'voice', 'sound', 'letter', 'character'],
  },
  {
    code: 'N1-10', title: 'Tâm lý và hành vi', titleJp: '心理と行動',
    topics: ['Tâm lý', 'Thói quen xấu', 'Rốt cuộc thì'],
    grammar: ['～きらいがある', '～しまつだ', '～が最後', '～たら最後', '～ずくめ', '～まみれ', '～極まる／～極まりない', '～の極み'],
    keywords: ['mind', 'psychology', 'behavior', 'anxiety', 'desire', 'jealous', 'temper', 'conscience', 'instinct', 'tendency', 'suspect'],
  },
  {
    code: 'N1-11', title: 'Nghệ thuật truyền thống', titleJp: '伝統芸能',
    topics: ['Kịch Noh, Kabuki', 'Nghệ nhân', 'Đúng là'],
    grammar: ['～の至り', '～をものともせず', '～をよそに', '～にもまして', '～にひきかえ', '～なりに', '～なり～なり', '～であれ～であれ'],
    keywords: ['art', 'skill', 'master', 'tradition', 'stage', 'mask', 'drum', 'flute', 'lacquer', 'brush', 'craft', 'sword'],
  },
  {
    code: 'N1-12', title: 'Đô thị và dân số', titleJp: '都市と人口',
    topics: ['Đô thị hóa', 'Già hóa', 'Đến cả… cũng'],
    grammar: ['～すら', '～だに', '～たりとも', '～に至るまで', '～に至って／～に至っては', '～からいって', '～にしたところで', '～とも'],
    keywords: ['city', 'capital', 'population', 'district', 'suburb', 'village', 'resident', 'housing', 'street', 'bridge', 'port'],
  },
  {
    code: 'N1-13', title: 'Lao động và việc làm', titleJp: '労働と雇用',
    topics: ['Điều kiện lao động', 'Tuyển dụng', 'Dù có… cũng'],
    grammar: ['～たところで', '～ところで（逆接）', '～であれ', '～といえども', '～ないまでも', '～ないものでもない', '～ないとも限らない', '～ずとも'],
    keywords: ['labor', 'employ', 'wage', 'union', 'shift', 'dismiss', 'resign', 'hire', 'occupation', 'industry', 'factory'],
  },
  {
    code: 'N1-14', title: 'Giáo dục đại học và nghiên cứu', titleJp: '高等教育と研究',
    topics: ['Đại học', 'Luận văn', 'Để mà'],
    grammar: ['～べく', '～んがため（に）', '～までだ／～までのことだ', '～ばそれまでだ', '～たらそれまでだ', '～までして', '～てまで', '～にかまけて'],
    keywords: ['university', 'scholar', 'thesis', 'doctor', 'degree', 'academic', 'professor', 'lecture', 'library', 'archive'],
  },
  {
    code: 'N1-15', title: 'Truyền thông và xã hội thông tin', titleJp: 'メディアと情報社会',
    topics: ['Mạng xã hội', 'Tin giả', 'Lợi dụng'],
    grammar: ['～をいいことに', '～にかこつけて', '～ではあるまいし', '～んじゃあるまいし', '～だの～だの', '～かと思えば', '～と見える', '～と見るや'],
    keywords: ['media', 'information', 'internet', 'broadcast', 'publish', 'print', 'press', 'copy', 'electronic', 'privacy', 'rumor'],
  },
  {
    code: 'N1-16', title: 'Nghệ thuật và cái đẹp', titleJp: '芸術と美',
    topics: ['Hội họa', 'Thẩm mỹ', 'Chính vì'],
    grammar: ['～てこそ', '～が～だけに', '～でなくてなんだろう', '～ではなかろうか', '～かいがある／～かいもなく', '～だけましだ', '～に言わせれば', '～ほどのことはない'],
    keywords: ['beauty', 'paint', 'color', 'sculpture', 'elegant', 'graceful', 'shine', 'jewel', 'silk', 'embroidery', 'harmony'],
  },
  {
    code: 'N1-17', title: 'Lịch sử và ký ức', titleJp: '歴史と記憶',
    topics: ['Lịch sử Nhật Bản', 'Chiến tranh và hòa bình', 'Không cần nói'],
    grammar: ['～はさておき', '～はいざしらず', '～ばかりは', '～べくもない', '～をかえりみず', '～をおして', '～ようものなら', '～ものを'],
    keywords: ['history', 'ancient', 'era', 'dynasty', 'war', 'battle', 'soldier', 'castle', 'samurai', 'monument', 'memory', 'tomb'],
  },
  {
    code: 'N1-18', title: 'Thiên nhiên và thảm họa', titleJp: '自然と災害',
    topics: ['Thiên tai', 'Hệ sinh thái', 'Không thể tránh'],
    grammar: ['～ないではおかない', '～ないではすまない', '～ではすまない', '～ても～きれない', '～にもほどがある', '～ことのないよう', '～もそこそこに', '～ところを見ると'],
    keywords: ['nature', 'mountain', 'volcano', 'flood', 'storm', 'earthquake', 'river', 'shore', 'swamp', 'forest', 'beast', 'insect'],
  },
  {
    code: 'N1-19', title: 'Tôn giáo và tín ngưỡng', titleJp: '宗教と信仰',
    topics: ['Phật giáo và Thần đạo', 'Nghi lễ', 'Như là'],
    grammar: ['～の手前', '～にかけても', '～にあたらない／～にはあたらない', '～てもさしつかえない', '～をもってすれば', '～ずにおく', '～の限りを尽くす', '～ものとして'],
    keywords: ['religion', 'buddha', 'god', 'pray', 'worship', 'priest', 'monk', 'sacred', 'ritual', 'shrine', 'temple', 'faith'],
  },
  {
    code: 'N1-20', title: 'Ẩm thực và nông nghiệp', titleJp: '食と農業',
    topics: ['Nông nghiệp', 'An toàn thực phẩm', 'Vừa… vừa'],
    grammar: ['～つ～つ', '～っぱなし', '～なりとも', '～と同時に', '～にとどまる', '～にしても～にしても', '～が～なら', '～に限る'],
    keywords: ['rice', 'grain', 'farm', 'field', 'harvest', 'crop', 'cattle', 'fish', 'salt', 'taste', 'cook', 'feed'],
  },
  {
    code: 'N1-21', title: 'Xã hội quốc tế và di cư', titleJp: '国際社会と移民',
    topics: ['Di cư', 'Đa văn hóa', 'Đáng lẽ phải'],
    grammar: ['～を受けて', '～とて', '～ねばならない', '～ともすれば', '～とばかりは言えない', '～なくはない', '～ところとなる', '～には及ばない'],
    keywords: ['foreign', 'border', 'immigrant', 'refugee', 'race', 'tribe', 'alliance', 'cooperate', 'exchange', 'embassy', 'passport'],
  },
  {
    code: 'N1-22', title: 'Đàm phán kinh doanh', titleJp: 'ビジネス交渉',
    topics: ['Đàm phán', 'Văn phong thương mại', 'Nhân tiện'],
    grammar: ['～を兼ねて', '～ことこの上ない', '～限りだ', '～てはかなわない', '～すべがない', '～ようにも～ない', '～こととて', '～なしに'],
    keywords: ['negotiate', 'commerce', 'contract', 'agent', 'commission', 'compensate', 'claim', 'estimate', 'invoice', 'merger'],
  },
  {
    code: 'N1-23', title: 'Văn ngữ và thành ngữ', titleJp: '文語と慣用表現',
    topics: ['Văn ngữ cổ', 'Thành ngữ bốn chữ', 'Cách nói cố định'],
    grammar: ['～べし', '～ごとし', '～ざる', '～ずして', '～ぬ（否定）', '～たり（文語の断定）', '～なかれ', '～んとする'],
    keywords: ['ancient', 'classic', 'proverb', 'idiom', 'maxim', 'phrase', 'rare', 'obscure', 'elegant'],
  },
  {
    code: 'N1-24', title: 'Tổng ôn N1', titleJp: 'N1総復習',
    topics: ['Tổng ôn ngữ pháp', 'Đọc dài và đọc tích hợp', 'Luyện đề'],
    grammar: [],
    keywords: [],
  },
];
