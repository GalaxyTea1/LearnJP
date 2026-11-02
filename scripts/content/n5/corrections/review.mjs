// Reviewed editorial changes. Source snapshot remains immutable; no status changes here.
// Scored quizzes: each prompt must supply its own context even while reading sections are draft.
export const quizChanges = [
  [36,{question:'Điền để nói “Đây là sách của tôi”: これは私（　　）本です。',explanation:'私の本 là sách của tôi. の nối người sở hữu với đồ vật được sở hữu.'},'Xác định nghĩa sở hữu, tránh đề thiếu ngữ cảnh.'],
  [38,{question:'Chọn từ hỏi lịch sự tương ứng với あの方 để hỏi “Vị kia là ai?”: あの方は（　　）ですか。',explanation:'どなた là cách hỏi lịch sự của だれ, phù hợp với cách gọi あの方. Đề yêu cầu cách hỏi lịch sự.'},'Nêu rõ yêu cầu về mức lịch sự.'],
  [42,{correctIndex:1,explanation:'この人は誰ですか nghĩa là “Người này là ai?”. あの方はどなたですか hỏi về người kia và lịch sự hơn, nên không cùng nghĩa chỉ định với đề.'},'Phân biệt người này và người kia; bỏ đáp án gộp sai.'],
  [44,{question:'Đọc đoạn sau: マイクさんは20歳です。学生です。マイクさんのお兄さんは25歳です。\nMike bao nhiêu tuổi?',explanation:'マイクさんは20歳です: Mike 20 tuổi. Người 25 tuổi là anh trai của Mike.'},'Đưa đủ dữ kiện vào Quiz, không phụ thuộc bài đọc chưa xuất bản.'],
  [66,{question:'Điền để nói “Công việc kéo dài đến 5 giờ”: 仕事は５時（　　）です。',explanation:'まで chỉ điểm kết thúc: đến 5 giờ. から chỉ điểm bắt đầu, không khớp nghĩa được yêu cầu.'},'Phân biệt bắt đầu và kết thúc bằng nghĩa đích.'],
  [74,{question:'Một người làm việc liên tục từ 9 giờ sáng đến 5 giờ chiều: 午前９時から午後５時まで働きます。 Khoảng thời gian đó dài mấy tiếng?',explanation:'Từ 09:00 đến 17:00 là 8 tiếng. Đề đã cho đầy đủ thời điểm bắt đầu và kết thúc.'},'Quiz tự đủ dữ kiện; nêu rõ giờ sáng/chiều và cách tính thời gian.'],
  [85,{question:'Điền để nói “Mỗi sáng tôi uống sữa”: 毎朝、牛乳を（　　）。',explanation:'飲みます nghĩa là uống, khớp câu khẳng định trong đề. 毎朝 chỉ có nghĩa là mỗi sáng; bản thân từ này không bắt buộc câu phải khẳng định.'},'Bỏ quy tắc sai về 毎朝 và xác định nghĩa khẳng định.'],
  [100,{question:'Điền để nói “Có một con mèo ở dưới gốc cây”: 木の下に猫が（　　）。',explanation:'Dùng います để nói có người hoặc động vật. いません là không có, trái với nghĩa khẳng định trong đề.'},'Phân biệt có và không có bằng ngữ cảnh rõ ràng.'],
  [113,{question:'Điền lời rủ “Chúng ta cùng xem phim nhé” bằng mẫu ～ましょう: いっしょに映画を（　　）。',explanation:'見ます đổi thành 見ましょう để rủ cùng xem. Đề yêu cầu mẫu lời rủ ～ましょう.'},'Nêu rõ mục tiêu lời rủ thay vì câu kể.'],
  [115,{question:'Điền câu khẳng định ở hiện tại “Trà này rất đắng”: このお茶はとても（　　）です。',explanation:'苦いです nói trà đắng ở hiện tại. 苦かったです là quá khứ; 苦くないです là phủ định, không khớp nghĩa đề.'},'Xác định thời và nghĩa của tính từ.'],
  [119,{question:'Đọc câu sau: 私はいつもラーメンと冷たいビールを注文します。\nNgười nói thường gọi hai món nào?',options:['Sushi và trà nóng','Bánh ngọt và cà phê','Ramen và bia lạnh','Ramen và bánh ngọt'],correctIndex:2,explanation:'ラーメンと冷たいビール là ramen và bia lạnh. Câu trích dẫn không nói người này gọi bánh.'},'Thay suy diễn không có trong bài bằng câu hỏi đọc hiểu tự đủ dữ kiện.'],
  [130,{question:'Điền từ để hỏi số lượng “Bạn đã ăn mấy quả táo?”: りんごを（　　）食べましたか。',explanation:'いくつ hỏi số lượng đồ vật. いつ hỏi thời điểm, không trả lời mục tiêu hỏi mấy quả trong đề.'},'Phân biệt hỏi số lượng và thời điểm.'],
  [144,{question:'Bạn không đi vì không có tiền. Chọn câu trả lời dùng ～からです cho câu hỏi どうして行かないの？',explanation:'お金がないからです nghĩa là vì không có tiền. Câu này vừa đúng lý do trong tình huống vừa dùng mẫu ～からです được yêu cầu.'},'Bổ sung lý do cụ thể và mẫu trả lời cần chọn.'],
  [149,{question:'Tanaka viết: いっしょに海へ行きませんか。海で泳ぎたいです。それから、おいしい魚を食べたいです。\nTanaka muốn làm những gì ở biển?',options:['Mượn sách','Bơi và ăn cá ngon','Mua quần áo','Thăm người thân'],correctIndex:1,explanation:'泳ぎたいです là muốn bơi; おいしい魚を食べたいです là muốn ăn cá ngon. Cả hai mong muốn đều được nêu trong đoạn trích.'},'Đưa ngữ cảnh vào Quiz và tránh lựa chọn quá rộng trùng nghĩa.'],
  [156,{question:'Điền ở thể lịch sự để nói “Hôm qua tôi bận”: 昨日は忙し（　　）。',explanation:'Quá khứ lịch sự của 忙しいです là 忙しかったです. 忙しかった cũng đúng ở thể thông thường nhưng đề yêu cầu thể lịch sự.'},'Không chấm sai thể thông thường khi đề chưa chỉ định mức lịch sự.'],
  [163,{question:'Được hỏi コーヒーとお茶と、どちらが好きですか。 (Bạn thích cà phê hay trà hơn?), bạn thích trà hơn. Chọn câu trả lời dùng ～のほうが好きです.',explanation:'お茶のほうが好きです nghĩa là thích trà hơn trong hai lựa chọn. Đề yêu cầu mẫu so sánh ～のほうが好きです.'},'Bổ sung hai đối tượng so sánh và mẫu câu cần chọn.'],
  [186,{options:['描く','描き','描いて','描きます'],explanation:'描く (かく) là vẽ. Dùng động từ thể từ điển trước こと: 私の趣味は絵を描くことです (Sở thích của tôi là vẽ tranh).'},'Chuẩn hóa động từ vẽ tranh và các lựa chọn chia dạng.'],
  [206,{question:'Bạn muốn xin phép mình được mượn từ điển. Chọn câu dùng mẫu ～てもいいですか。',options:['辞書を貸してください。','辞書を貸してはいけません。','辞書を借りてもいいですか。','辞書を借りますか。'],correctIndex:2,explanation:'借りる là mượn: 辞書を借りてもいいですか nghĩa là “Tôi mượn từ điển được không?”. 貸す là cho mượn; 貸してもいいですか hỏi xin phép cho mượn. 貸してください là yêu cầu người khác cho mình mượn, không phải mẫu xin phép được hỏi.'},'Sửa nhầm vai mượn/cho mượn trong đáp án và lời giải.'],
];
export const sentenceAnswers = {
  113:'その人は私の友達です。',114:'あの人は誰ですか。',
  149:'私はベトナム人です。',150:'それは私の本です。',
  185:'銀行は９時から３時までです。',186:'会議は何時に始まりますか。',
  221:'うちで晩ごはんを食べます。',222:'よく音楽を聞きますか。',
  257:'机の上に本があります。',258:'女の子はどこにいますか。',
  293:'私は野菜が好きです。',294:'ビールを飲みましょうか。',
  329:'私は小さい財布がほしいです。',330:'りんごを五つください。',
  365:'いっしょにビールを飲みに行きませんか。',366:'私は車を買いたいです。',
  401:'昨日のテストはとても難しかったです。',402:'犬は猫より大きいです。',
  437:'ここでちょっと待ってください。',438:'ここでタバコを吸ってはいけません。',
  473:'私の趣味はピアノを弾くことです。',474:'週末、どこかへ行きましたか。',
  510:'私は学校に本を忘れました。',
};
// Explicit mappings checked against each transcript/passage, not guessed from IDs.
export const listeningLinks = {
  7:[107,108,109],9:[143,144],10:[145],11:[179,180],12:[181],
  13:[215,216],14:[217],15:[251,252],16:[253],17:[287,288],18:[289],
  19:[323,324],20:[325],21:[359,360],22:[361],23:[395,396],24:[397],
  25:[431],26:[432,433],27:[467,468],28:[469],29:[505,506],30:[507],
};
export const readingLinks = {
  7:[110,111,112],9:[146,147,148],11:[182],12:[183,184],13:[218],14:[219,220],
  15:[254,255],16:[256],17:[290,291],18:[292],19:[326,327],20:[328],
  21:[362,363],22:[364],23:[398],24:[399,400],25:[434,436],26:[435],
  27:[470],28:[471,472],29:[508],30:[509],
};
export const editorialChanges = [
  ['reading_passages',9,{translation:'Tên: Kim Min-jun\nQuốc gia: Hàn Quốc\nNghề nghiệp: Sinh viên\nTuổi: 20\nTrường: Trường tiếng Nhật Sakura'},'Bổ sung bản dịch hồ sơ để nút xem nghĩa có nội dung.'],
  ['reading_passages',10,{translation:'Rất vui được gặp bạn. Tôi tên là John. Tôi đến từ Mỹ. Tôi 25 tuổi. Tôi là kỹ sư, làm việc tại công ty IMC. Rất mong được mọi người giúp đỡ.'},'Bổ sung bản dịch bài tự giới thiệu.'],
  ['lesson_exercises',361,{correctAnswer:1,explanation:'B nói 私も本を読みたいです (tôi cũng muốn đọc sách). Người nói muốn mượn sách là A: 本を借りに行きます. Câu khẳng định về B là sai.'},'Đáp án cũ đảo người muốn đọc sách và người muốn mượn sách.'],
  ['lesson_exercises',109,{prompt:'Người phụ nữ được nhắc đến trong bài nghe là mẹ của B.'},'B nói 姉です: người được nhắc đến là chị gái, không xác định người đang nói là mẹ.'],
  ['lesson_exercises',474,{prompt:'Sắp xếp thành câu: Cuối tuần vừa rồi bạn có đi đâu không?'},'Khớp nghĩa quá khứ của 行きました với đề tiếng Việt.'],
  ['lesson_exercises',437,{prompt:'Sắp xếp thành câu: Xin hãy đợi một chút ở đây.'},'Bổ sung nghĩa của mảnh câu ここで.'],
  ['lesson_exercises',293,{prompt:'Sắp xếp thành câu: Tôi thích rau.'},'Đáp án nói thích rau, không có động từ ăn.'],
  ['lesson_exercises',468,{prompt:'Theo bài nghe 1, việc nào người nói cho biết vẫn chưa làm?'},'Bỏ cụm ĐÃ CHƯA gây khó hiểu.'],
  ['lesson_exercises',125,{prompt:'Điền để nói “Tôi là người Việt Nam”: 私は（　　）です。'},'Thêm ngữ cảnh để có đáp án duy nhất.'],
  ['lesson_exercises',135,{prompt:'Điền trợ từ đánh dấu chủ đề: 私（　　）学生です。',explanation:'は (đọc là wa) đánh dấu chủ đề đang nói đến: tôi. が có vai trò khác và không phải trợ từ chủ đề được hỏi.'},'Phân biệt は và が, tránh gọi は luôn là trợ từ chủ ngữ.'],
  ['lesson_exercises',136,{prompt:'Điền để tạo câu khẳng định “Kim là người Hàn Quốc”: キムさんは韓国人（　　）。'},'Loại mơ hồ giữa câu kể và câu hỏi.'],
  ['lesson_exercises',137,{prompt:'Điền để hỏi “Bạn là giáo viên phải không?”: あなたは先生（　　）。'},'Đề cũ cho phép cả câu kể lẫn câu hỏi.'],
  ['lesson_exercises',138,{prompt:'Điền để nói “Tôi không phải là bác sĩ”: 私は医者（　　）。'},'Đề cũ thiếu ngữ cảnh phủ định.'],
  ['lesson_exercises',140,{prompt:'Điền để nói “Đây là sách của tôi”: これは私（　　）本です。'},'Tạo câu hoàn chỉnh và xác định quan hệ sở hữu.'],
  ['lesson_exercises',141,{prompt:'Chọn câu “Đó là máy tính của tôi” khi chỉ vật ở gần người nghe.'},'Phân biệt それ và あれ bằng vị trí trong tình huống.'],
];
