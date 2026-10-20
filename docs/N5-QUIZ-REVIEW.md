# Gói sửa Quiz N5 — 17/10/2026

## Trạng thái

Đã sửa 18 câu Quiz trong candidate và áp dụng vào database local chính ở ổ D.
Đã kiểm chứng HTTP. Chưa deploy remote; xem [biên bản áp dụng](N5-LOCAL-CONTENT-APPLIED.md).
Tổng gói nội dung hiện tại: 151 thay đổi trên 145 dòng; snapshot gốc giữ nguyên.
Các section DRAFT, N4 và đề mock giữ nguyên. Dừng sau gói này để người dùng kiểm tra.

## Kiểm chứng

- 24/24 kiểm thử đạt: 7 kiểm thử nội dung/candidate và 17 kiểm thử nghiệp vụ học viên.
- Import vào D1 tạm, thực hiện UPDATE Quiz qua D1, xác nhận revision thay đổi.
- Đối chiếu đáp án của 18 câu với danh sách đáp án kỳ vọng độc lập, chấm qua Assessments thật.
- Các module được kiểm tra đạt 15/15 khi trả lời đúng; lựa chọn sai bị chấm sai.
- Bài nộp mang revision cũ bị từ chối 409 và không tạo attempt.
- Bài đọc vẫn DRAFT; các Quiz liên quan chứa đủ đoạn trích, API không lộ đáp án/lời giải trước khi nộp.
- Nộp lại module đã hoàn thành không cộng XP hoàn thành lần hai; kiểm tra khóa ngoại đạt.
- Candidate không thêm version/updatedAt vào Quiz vì bảng Quiz không có các trường này.
- Lần chạy sandbox đầu bị EPERM ở registry Wrangler; lần chạy lại được cấp quyền cho công cụ local đạt toàn bộ.
- Không thay giao diện/runtime backend; không chạy lại build hoặc kiểm tra browser trong gói sửa dữ liệu này.

Lệnh kiểm tra:

```powershell
node scripts/n5-content-review.mjs
node --test --test-concurrency=1 scripts/n5-content-review.test.mjs scripts/cloudflare-learning.test.mjs
```

Log: `.local/n5-quiz-review-tests.log`.

## Nội dung sau sửa

### Unit 2 — Quiz 36

Xác định nghĩa sở hữu, tránh đề thiếu ngữ cảnh.

> Điền để nói “Đây là sách của tôi”: これは私（　　）本です。

1. は
2. の
3. か
4. も

**Đáp án: 2. の**

私の本 là sách của tôi. の nối người sở hữu với đồ vật được sở hữu.

### Unit 2 — Quiz 38

Nêu rõ yêu cầu về mức lịch sự.

> Chọn từ hỏi lịch sự tương ứng với あの方 để hỏi “Vị kia là ai?”: あの方は（　　）ですか。

1. だれ
2. どなた
3. 何
4. どこ

**Đáp án: 2. どなた**

どなた là cách hỏi lịch sự của だれ, phù hợp với cách gọi あの方. Đề yêu cầu cách hỏi lịch sự.

### Unit 2 — Quiz 42

Phân biệt người này và người kia; bỏ đáp án gộp sai.

> Khi muốn hỏi 'Người này là ai?', bạn nói câu nào?

1. この人は何歳ですか。
2. この人は誰ですか。
3. あの方はどなたですか。
4. B và C đều đúng.

**Đáp án: 2. この人は誰ですか。**

この人は誰ですか nghĩa là “Người này là ai?”. あの方はどなたですか hỏi về người kia và lịch sự hơn, nên không cùng nghĩa chỉ định với đề.

### Unit 2 — Quiz 44

Đưa đủ dữ kiện vào Quiz, không phụ thuộc bài đọc chưa xuất bản.

> Đọc đoạn sau: マイクさんは20歳です。学生です。マイクさんのお兄さんは25歳です。
> Mike bao nhiêu tuổi?

1. 18
2. 20
3. 22
4. 25

**Đáp án: 2. 20**

マイクさんは20歳です: Mike 20 tuổi. Người 25 tuổi là anh trai của Mike.

### Unit 3 — Quiz 66

Phân biệt bắt đầu và kết thúc bằng nghĩa đích.

> Điền để nói “Công việc kéo dài đến 5 giờ”: 仕事は５時（　　）です。

1. から
2. まで
3. に
4. は

**Đáp án: 2. まで**

まで chỉ điểm kết thúc: đến 5 giờ. から chỉ điểm bắt đầu, không khớp nghĩa được yêu cầu.

### Unit 3 — Quiz 74

Quiz tự đủ dữ kiện; nêu rõ giờ sáng/chiều và cách tính thời gian.

> Một người làm việc liên tục từ 9 giờ sáng đến 5 giờ chiều: 午前９時から午後５時まで働きます。 Khoảng thời gian đó dài mấy tiếng?

1. 7 tiếng
2. 8 tiếng
3. 9 tiếng
4. 10 tiếng

**Đáp án: 2. 8 tiếng**

Từ 09:00 đến 17:00 là 8 tiếng. Đề đã cho đầy đủ thời điểm bắt đầu và kết thúc.

### Unit 4 — Quiz 85

Bỏ quy tắc sai về 毎朝 và xác định nghĩa khẳng định.

> Điền để nói “Mỗi sáng tôi uống sữa”: 毎朝、牛乳を（　　）。

1. 飲みません
2. 食べます
3. 飲みます
4. 食べません

**Đáp án: 3. 飲みます**

飲みます nghĩa là uống, khớp câu khẳng định trong đề. 毎朝 chỉ có nghĩa là mỗi sáng; bản thân từ này không bắt buộc câu phải khẳng định.

### Unit 5 — Quiz 100

Phân biệt có và không có bằng ngữ cảnh rõ ràng.

> Điền để nói “Có một con mèo ở dưới gốc cây”: 木の下に猫が（　　）。

1. ありません
2. あります
3. います
4. いません

**Đáp án: 3. います**

Dùng います để nói có người hoặc động vật. いません là không có, trái với nghĩa khẳng định trong đề.

### Unit 6 — Quiz 113

Nêu rõ mục tiêu lời rủ thay vì câu kể.

> Điền lời rủ “Chúng ta cùng xem phim nhé” bằng mẫu ～ましょう: いっしょに映画を（　　）。

1. 見ます
2. 見ません
3. 見ましょう
4. 見てください

**Đáp án: 3. 見ましょう**

見ます đổi thành 見ましょう để rủ cùng xem. Đề yêu cầu mẫu lời rủ ～ましょう.

### Unit 6 — Quiz 115

Xác định thời và nghĩa của tính từ.

> Điền câu khẳng định ở hiện tại “Trà này rất đắng”: このお茶はとても（　　）です。

1. 苦い
2. 苦く
3. 苦かった
4. 苦くない

**Đáp án: 1. 苦い**

苦いです nói trà đắng ở hiện tại. 苦かったです là quá khứ; 苦くないです là phủ định, không khớp nghĩa đề.

### Unit 6 — Quiz 119

Thay suy diễn không có trong bài bằng câu hỏi đọc hiểu tự đủ dữ kiện.

> Đọc câu sau: 私はいつもラーメンと冷たいビールを注文します。
> Người nói thường gọi hai món nào?

1. Sushi và trà nóng
2. Bánh ngọt và cà phê
3. Ramen và bia lạnh
4. Ramen và bánh ngọt

**Đáp án: 3. Ramen và bia lạnh**

ラーメンと冷たいビール là ramen và bia lạnh. Câu trích dẫn không nói người này gọi bánh.

### Unit 7 — Quiz 130

Phân biệt hỏi số lượng và thời điểm.

> Điền từ để hỏi số lượng “Bạn đã ăn mấy quả táo?”: りんごを（　　）食べましたか。

1. いくら
2. いくつ
3. いつ
4. だれ

**Đáp án: 2. いくつ**

いくつ hỏi số lượng đồ vật. いつ hỏi thời điểm, không trả lời mục tiêu hỏi mấy quả trong đề.

### Unit 8 — Quiz 144

Bổ sung lý do cụ thể và mẫu trả lời cần chọn.

> Bạn không đi vì không có tiền. Chọn câu trả lời dùng ～からです cho câu hỏi どうして行かないの？

1. お金がないからです。
2. お金があるからです。
3. お金がないです。
4. お金があるです。

**Đáp án: 1. お金がないからです。**

お金がないからです nghĩa là vì không có tiền. Câu này vừa đúng lý do trong tình huống vừa dùng mẫu ～からです được yêu cầu.

### Unit 8 — Quiz 149

Đưa ngữ cảnh vào Quiz và tránh lựa chọn quá rộng trùng nghĩa.

> Tanaka viết: いっしょに海へ行きませんか。海で泳ぎたいです。それから、おいしい魚を食べたいです。
> Tanaka muốn làm những gì ở biển?

1. Mượn sách
2. Bơi và ăn cá ngon
3. Mua quần áo
4. Thăm người thân

**Đáp án: 2. Bơi và ăn cá ngon**

泳ぎたいです là muốn bơi; おいしい魚を食べたいです là muốn ăn cá ngon. Cả hai mong muốn đều được nêu trong đoạn trích.

### Unit 9 — Quiz 156

Không chấm sai thể thông thường khi đề chưa chỉ định mức lịch sự.

> Điền ở thể lịch sự để nói “Hôm qua tôi bận”: 昨日は忙し（　　）。

1. です
2. でした
3. かった
4. かったです

**Đáp án: 4. かったです**

Quá khứ lịch sự của 忙しいです là 忙しかったです. 忙しかった cũng đúng ở thể thông thường nhưng đề yêu cầu thể lịch sự.

### Unit 9 — Quiz 163

Bổ sung hai đối tượng so sánh và mẫu câu cần chọn.

> Được hỏi コーヒーとお茶と、どちらが好きですか。 (Bạn thích cà phê hay trà hơn?), bạn thích trà hơn. Chọn câu trả lời dùng ～のほうが好きです.

1. お茶が好きです。
2. お茶のほうが好きです。
3. お茶が一番好きです。
4. お茶より好きです。

**Đáp án: 2. お茶のほうが好きです。**

お茶のほうが好きです nghĩa là thích trà hơn trong hai lựa chọn. Đề yêu cầu mẫu so sánh ～のほうが好きです.

### Unit 11 — Quiz 186

Chuẩn hóa động từ vẽ tranh và các lựa chọn chia dạng.

> Điền vào chỗ trống: 私の趣味は絵を（　　）ことです。

1. 描く
2. 描き
3. 描いて
4. 描きます

**Đáp án: 1. 描く**

描く (かく) là vẽ. Dùng động từ thể từ điển trước こと: 私の趣味は絵を描くことです (Sở thích của tôi là vẽ tranh).

### Unit 12 — Quiz 206

Sửa nhầm vai mượn/cho mượn trong đáp án và lời giải.

> Bạn muốn xin phép mình được mượn từ điển. Chọn câu dùng mẫu ～てもいいですか。

1. 辞書を貸してください。
2. 辞書を貸してはいけません。
3. 辞書を借りてもいいですか。
4. 辞書を借りますか。

**Đáp án: 3. 辞書を借りてもいいですか。**

借りる là mượn: 辞書を借りてもいいですか nghĩa là “Tôi mượn từ điển được không?”. 貸す là cho mượn; 貸してもいいですか hỏi xin phép cho mượn. 貸してください là yêu cầu người khác cho mình mượn, không phải mẫu xin phép được hỏi.

## Còn lại sau gói này

- Các bài tập mơ hồ và phiên âm trong audit đã được xử lý ở
  [đợt tiếp theo ngày 18/10](N5-EXERCISE-REVIEW-2026-10-18.md), áp dụng local.
- Chưa xác nhận toàn bộ nội dung N5; chưa kiểm tra TTS trên thiết bị thật.
- Bước áp dụng local có backup/checksum/version và kiểm chứng database chính đã xong.
  Staging/production vẫn cần chuẩn bị và xác minh riêng.
- CF6 staging Cloudflare HTTPS/CPU/quota/backup vẫn chưa hoàn thành.

Candidate SHA256: `dce0ec17693c55cc0edd4319da1c2de5e9ed4c5e55a49f31d1c2a6436e1aabb7`.
Source SHA256: `f6179bfab8b0180c4e1a98fa6aab4fe944454593319f3ecf6c491a9c54b7788f`.

Danh sách before/after đầy đủ: [N5-CONTENT-REVIEW.json](N5-CONTENT-REVIEW.json).
