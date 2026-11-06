// N2 syllabus: 20 lessons. Lessons 1–19 teach seven new grammar points each; lesson 20 reviews.
// `keywords` are English meaning words used to place each kanji in the lesson whose topic fits
// it best (scripts/content/planning/assign-kanji.mjs); the resulting list is kanji-plan.json.
export const level = 'N2';
export const levelId = 60001;
export const units = [
  {
    code: 'N2-01', title: 'Môi trường làm việc mới', titleJp: '新しい職場',
    topics: ['Ngày đầu đi làm', 'Quy trình và thủ tục', 'Thời điểm và trình tự'],
    grammar: ['～次第（～たらすぐ）', '～てからでないと／～てからでなければ', '～た上で', '～際（に）', '～に先立って／～に先立ち', '～をきっかけに', '～を契機に'],
    keywords: ['office', 'procedure', 'staff', 'duty', 'post', 'arrange', 'order', 'sequence', 'begin', 'prepare'],
  },
  {
    code: 'N2-02', title: 'Thói quen và xu hướng', titleJp: '生活習慣と傾向',
    topics: ['Nếp sinh hoạt', 'Xu hướng thay đổi', 'Làm đến cùng'],
    grammar: ['～がちだ', '～気味', '～傾向にある', '～つつある', '～かける／～かけの', '～きる／～きれない', '～ぬく'],
    keywords: ['habit', 'tend', 'lean', 'sleep', 'bath', 'clothes', 'dress', 'cook', 'clean', 'daily', 'routine'],
  },
  {
    code: 'N2-03', title: 'Kinh doanh và hợp đồng', titleJp: 'ビジネスと契約',
    topics: ['Hợp đồng', 'Đàm phán', 'Căn cứ và phạm vi'],
    grammar: ['～に基づいて', '～をもとに（して）', '～に沿って', '～に応じて', '～を中心に（して）', '～をめぐって', '～にかけては'],
    keywords: ['contract', 'trade', 'sell', 'buy', 'goods', 'merchant', 'commerce', 'stock', 'deal', 'loan', 'debt', 'profit'],
  },
  {
    code: 'N2-04', title: 'Văn bản trang trọng', titleJp: '改まった文書',
    topics: ['Thông báo', 'Thư công việc', 'Lời chào trang trọng'],
    grammar: ['～につき（理由）', '～にあたって／～にあたり', '～に際して', '～のもとで', '～をもって', '～次第だ（経緯）', '～かねる'],
    keywords: ['document', 'letter', 'notice', 'seal', 'sign', 'record', 'register', 'formal', 'respect', 'humble', 'apologize'],
  },
  {
    code: 'N2-05', title: 'Nghiên cứu và khảo sát', titleJp: '研究と調査',
    topics: ['Khảo sát', 'Phòng thí nghiệm', 'Phạm vi và bổ sung'],
    grammar: ['～に限って', '～に限らず', '～のみならず', '～はもとより', '～に加えて', '～を問わず', '～にかかわらず'],
    keywords: ['research', 'investigate', 'examine', 'analysis', 'theory', 'measure', 'sample', 'element', 'chemical', 'laboratory', 'observe'],
  },
  {
    code: 'N2-06', title: 'Y tế và sức khỏe', titleJp: '医療と健康',
    topics: ['Bệnh viện', 'Phòng bệnh', 'Khả năng và rủi ro'],
    grammar: ['～得る／～得ない', '～かねない', '～恐れがある', '～ないことには', '～に越したことはない', '～ずにすむ', '～てはいられない'],
    keywords: ['disease', 'sick', 'medicine', 'cure', 'organ', 'nerve', 'wound', 'injury', 'bone', 'blood', 'infection', 'pulse'],
  },
  {
    code: 'N2-07', title: 'Cảm xúc và tâm trạng', titleJp: '気持ちと心',
    topics: ['Vui buồn', 'Lo lắng', 'Không kìm được'],
    grammar: ['～てたまらない', '～てしょうがない', '～てならない', '～ずにはいられない', '～ないではいられない', '～ことに（感情）', '～ものか'],
    keywords: ['emotion', 'sorrow', 'grief', 'joy', 'anger', 'fear', 'lonely', 'pleasant', 'worry', 'love', 'hate', 'shame', 'heart'],
  },
  {
    code: 'N2-08', title: 'Giáo dục và đánh giá', titleJp: '教育と評価',
    topics: ['Trường học', 'Đánh giá', 'Xứng đáng và không cần'],
    grammar: ['～だけあって', '～だけのことはある', '～だけに', '～ばかりか', '～ようがない', '～までもない', '～ことはない'],
    keywords: ['school', 'teach', 'study', 'lesson', 'grade', 'exam', 'student', 'learn', 'praise', 'evaluate', 'talent'],
  },
  {
    code: 'N2-09', title: 'Kinh tế và tiêu dùng', titleJp: '経済と消費',
    topics: ['Giá cả', 'Tiêu dùng', 'Góc nhìn và tiêu chuẩn'],
    grammar: ['～に伴って／～に伴い', '～次第で', '～によっては', '～からすると／～からすれば', '～から見ると／～から見て', '～上（じょう）', '～にしては'],
    keywords: ['money', 'price', 'cost', 'tax', 'economy', 'consume', 'spend', 'save', 'wealth', 'poor', 'rich', 'fee', 'currency'],
  },
  {
    code: 'N2-10', title: 'Ý kiến và lập luận', titleJp: '意見と主張',
    topics: ['Tranh luận', 'Giả định', 'Lập trường'],
    grammar: ['～に反して', '～にしても', '～にせよ／～にしろ', '～としても', '～といっても', '～からには', '～以上（は）'],
    keywords: ['opinion', 'argue', 'claim', 'insist', 'agree', 'oppose', 'reason', 'logic', 'persuade', 'debate'],
  },
  {
    code: 'N2-11', title: 'Tin tức và báo chí', titleJp: 'ニュースと報道',
    topics: ['Bản tin', 'Suy đoán', 'Nguồn tin'],
    grammar: ['～とされる', '～とみられる', '～ものと思われる', '～とか', '～に決まっている', '～かのようだ／～かのように', '～ようでは'],
    keywords: ['news', 'report', 'publish', 'press', 'broadcast', 'journal', 'article', 'announce', 'reveal', 'rumor'],
  },
  {
    code: 'N2-12', title: 'Vấn đề xã hội', titleJp: '社会問題',
    topics: ['Bất bình đẳng', 'Dân số', 'Trái với dự đoán'],
    grammar: ['～とはいえ', '～つつ（も）', '～わりに（は）', '～どころか', '～どころではない', '～ものなら', '～くらいなら'],
    keywords: ['society', 'crime', 'poverty', 'welfare', 'aid', 'social', 'citizen', 'rescue', 'victim', 'violence'],
  },
  {
    code: 'N2-13', title: 'Công nghệ và tương lai', titleJp: '技術と未来',
    topics: ['Đổi mới', 'Mục tiêu', 'Từ khi bắt đầu'],
    grammar: ['～に向けて', '～向き／～向け', '～にわたって', '～ばかりに', '～ほかない', '～ないものか', '～て以来'],
    keywords: ['machine', 'electric', 'engine', 'device', 'invent', 'develop', 'future', 'energy', 'signal', 'network', 'automatic'],
  },
  {
    code: 'N2-14', title: 'Quan hệ con người', titleJp: '人間関係',
    topics: ['Bạn bè và đồng nghiệp', 'Lời mời', 'Ý chí'],
    grammar: ['～をこめて', '～ことだから', '～ところを', '～ようではないか', '～まい', '～はともかく（として）', '～もかまわず'],
    keywords: ['friend', 'companion', 'marriage', 'family', 'relative', 'parent', 'trust', 'promise', 'neighbor', 'guest', 'host'],
  },
  {
    code: 'N2-15', title: 'Văn hóa và truyền thống', titleJp: '文化と伝統',
    topics: ['Lễ hội', 'Phong tục', 'Điều kiện và ngoại lệ'],
    grammar: ['～にこたえて', '～を～として', '～を除いて', '～に限り', '～とおり（に）', '～ものがある', '～からして'],
    keywords: ['tradition', 'custom', 'festival', 'shrine', 'temple', 'ceremony', 'costume', 'music', 'song', 'dance', 'poem'],
  },
  {
    code: 'N2-16', title: 'Diễn biến sự việc', titleJp: '出来事の経緯',
    topics: ['Kết cục', 'Ngoài dự định', 'Không làm được'],
    grammar: ['～あげく', '～末（に）', '～たところ', '～ところだった', '～ずじまい', '～きり', '～ことなく'],
    keywords: ['accident', 'event', 'result', 'end', 'final', 'fail', 'escape', 'chase', 'lose', 'search', 'trace'],
  },
  {
    code: 'N2-17', title: 'Đánh giá và khẳng định', titleJp: '評価と判断',
    topics: ['Phê bình', 'Khẳng định mạnh', 'Khó có thể'],
    grammar: ['～に過ぎない', '～にほかならない', '～に相違ない', '～というものだ', '～というものではない', '～っこない', '～がたい'],
    keywords: ['judge', 'criticize', 'value', 'merit', 'fault', 'excellent', 'inferior', 'certain', 'doubt', 'standard'],
  },
  {
    code: 'N2-18', title: 'Sở thích và chủ đề', titleJp: '趣味と話題',
    topics: ['Sở thích', 'Nêu ví dụ', 'Vừa mới… thì'],
    grammar: ['～というと／～といえば', '～といったら', '～など／～なんか／～なんて', '～やら～やら', '～かと思うと／～かと思ったら', '～か～ないかのうちに', '～げ'],
    keywords: ['play', 'game', 'sport', 'hobby', 'travel', 'picture', 'collect', 'fish', 'garden', 'flower', 'animal'],
  },
  {
    code: 'N2-19', title: 'Thử thách và quyết tâm', titleJp: '挑戦と決意',
    topics: ['Mục tiêu lớn', 'Bắt buộc phải', 'Nhấn mạnh'],
    grammar: ['～ことか', '～てでも', '～ざるを得ない', '～につけ（て）', '～ぬきで／～ぬきに', '～ことだし', '～さえ／～でさえ'],
    keywords: ['challenge', 'resolve', 'effort', 'strive', 'victory', 'brave', 'struggle', 'endure', 'aim', 'climb'],
  },
  {
    code: 'N2-20', title: 'Tổng ôn N2', titleJp: 'N2総復習',
    topics: ['Tổng ôn ngữ pháp', 'Đọc và nghe dài', 'Luyện đề'],
    grammar: [],
    keywords: [],
  },
];
