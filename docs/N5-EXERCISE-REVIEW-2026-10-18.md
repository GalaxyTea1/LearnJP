# Sửa bài tập và phiên âm N5 — 18/10/2026

> Đây là biên bản đợt 2. Đợt Unit 1 đã được áp dụng sau đó;
> xem [trạng thái và backup hiện tại](N5-UNIT1-REVIEW-2026-10-18.md).

## Đã hoàn thành

- 19 bài tập: bổ sung nghĩa, thời điểm, vị trí chỉ định hoặc mẫu câu để chọn một đáp án rõ ràng.
- 3 lỗi phiên âm: 22歳, 買うつもり và 旅行に行きました.
- Đã áp dụng đúng 22 dòng vào D1 local chính ở ổ D; 0 câu Quiz bị ghi lại.
- Tổng gói hiện tại: 173 thay đổi / 166 dòng khác snapshot gốc. Một bài nghe đã sửa TTS ở đợt trước nay sửa thêm phiên âm.
- Giữ nguyên 18 Quiz đã sửa, tài khoản, tiến độ và trạng thái xuất bản.
- Các bài tập/nghe/đọc này vẫn DRAFT: dữ liệu đã sửa nhưng chưa hiện cho học viên thường.

## Kiểm chứng

- 11/11 kiểm thử nội dung và cập nhật D1 đạt.
- Sau khi đơn giản hóa câu 441 sang tiếng Việt, chạy lại riêng kiểm thử nâng cấp: 1/1 đạt.
- 15/15 kiểm thử HTTP trên website dùng database chính đạt.
- Đối chiếu 18 bảng nội dung và chỉ mục tìm kiếm: khớp candidate.
- Chạy lại công cụ cập nhật: rows:0, already current.
- Khóa ngoại: 0 lỗi; các bảng ngoài nội dung giữ nguyên.
- Đã kiểm tra dữ liệu bài tập qua Content preview trên D1 tạm, bao gồm đáp án độc lập cho 19 câu, phiên âm và lọc DRAFT.
- Chưa kiểm tra browser/TTS hoặc duyệt toàn bộ khóa trong lượt này.

Log: `.local/n5-exercise-review-tests.log`, `.local/n5-exercise-final-tests.log`, `.local/n5-exercise-http-tests.log`.

## Backup và phiên bản

Backup trước cập nhật: `D:\SumaryJapanese-cloudflare\.local\content-backups\n5-1792258581171-ac0db556-c6a4-4d0c-ad9f-09f3b6b7a691.json`.
Candidate SHA256: `a23da2588979650c626af556a1a06c356c1f93576a98f250012b14d4c7184251`.
Bản đợt trước được giữ làm baseline với SHA256 `dce0ec17693c55cc0edd4319da1c2de5e9ed4c5e55a49f31d1c2a6436e1aabb7`.
Công cụ chỉ chấp nhận dữ liệu khớp bản gốc, bản đợt trước hoặc bản đích; chỉnh sửa ngoài các bản này bị từ chối.
Bài nghe 7 tăng version 2 → 3; các dòng mới tăng 1 → 2. Import từ bản gốc có thể tăng nhiều version tương ứng các đợt duyệt.
Rollback kiểm tra đúng checksum của gói hiện tại và tăng version để vô hiệu hóa thao tác sửa cũ.

Dry-run khôi phục đợt này (dừng server/thao tác admin trước):

```powershell
node scripts/apply-n5-content-local.mjs --rollback D:\SumaryJapanese-cloudflare\.local\content-backups\n5-1792258581171-ac0db556-c6a4-4d0c-ad9f-09f3b6b7a691.json
```

Chỉ thêm `--apply` nếu thực sự muốn khôi phục. Backup là nội dung, không phải toàn bộ tài khoản/database.

## Danh sách sau sửa

### Unit 2 — lesson_exercises/89

Điền để nói “Người kia là giáo viên”: あの（　　）は先生です。

1. 人
2. 家族
3. 友達
4. 誰

Đáp án: 1. 人

人 nghĩa là người. あの人 là người kia; 友達 là bạn, không khớp nghĩa được yêu cầu.

### Unit 2 — lesson_exercises/102

Chọn cách hỏi tuổi lịch sự của mẹ người nghe: お母さんは（　　）ですか。

1. おいくつ
2. どなた
3. どこ
4. いつ

Đáp án: 1. おいくつ

おいくつ là cách hỏi tuổi lịch sự. どなた hỏi danh tính; どこ hỏi nơi chốn; いつ hỏi thời điểm.

### Unit 3 — lesson_exercises/171

Điền để nói “Cuộc họp bắt đầu từ 3 giờ”: 会議は３時（　　）です。

1. は
2. から
3. に
4. を

Đáp án: 2. から

から chỉ điểm bắt đầu: từ 3 giờ. Đề yêu cầu diễn đạt thời điểm bắt đầu cuộc họp.

### Unit 3 — lesson_exercises/176

Điền để hỏi “Hôm nay là thứ mấy?”: 今日は何（　　）ですか。

1. 時
2. 曜日
3. 分
4. 月

Đáp án: 2. 曜日

何曜日 (なんようび) hỏi thứ trong tuần. 何月 hỏi tháng, không phải thứ.

### Unit 3 — lesson_exercises/177

Điền để hỏi “Kết thúc lúc mấy giờ?”: （　　）に終わりますか。

1. 何時
2. 何曜日
3. 何
4. いつ

Đáp án: 1. 何時

何時に hỏi lúc mấy giờ. 何曜日に hỏi vào thứ mấy, không khớp câu hỏi về giờ trong đề.

### Unit 4 — lesson_exercises/212

Điền để nói “Tôi hoàn toàn không xem tivi”: 私は（　　）テレビを見ません。

1. いつも
2. よく
3. ときどき
4. ぜんぜん

Đáp án: 4. ぜんぜん

ぜんぜん đi với 見ません trong câu này để diễn đạt hoàn toàn không xem.

### Unit 5 — lesson_exercises/233

Điền để nói “Bưu điện nằm giữa hiệu sách và ngân hàng”: 本屋と銀行の（　　）に郵便局があります。

1. 隣
2. 近く
3. 間
4. 前

Đáp án: 3. 間

AとBの間 là ở giữa A và B. Đề đã xác định vị trí ở giữa, không phải gần hay phía trước.

### Unit 5 — lesson_exercises/243

Dùng mẫu Nがあります để giới thiệu có sách trên bàn: 机の上に本（　　）あります。

1. は
2. が
3. を
4. に

Đáp án: 2. が

Trong mẫu Nがあります, が đánh dấu vật được giới thiệu là có ở nơi đó. は có thể dùng khi đưa vật làm chủ đề hoặc đối chiếu, nhưng không phải mẫu đang được hỏi.

### Unit 5 — lesson_exercises/245

Dùng mẫu Nがいます để thông báo có anh Tanaka ở đằng kia: あそこに田中さん（　　）います。

1. は
2. が
3. を
4. に

Đáp án: 2. が

Dùng が trong mẫu Nがいます để giới thiệu sự có mặt của một người. Đề yêu cầu mẫu này, không yêu cầu cách nêu chủ đề bằng は.

### Unit 6 — lesson_exercises/281

Điền lời rủ “Chúng ta cùng uống cà phê nhé” bằng mẫu ～ましょう: いっしょにコーヒーを（　　）。

1. 飲みます
2. 飲みません
3. 飲みましょう
4. 飲みましょうか

Đáp án: 3. 飲みましょう

飲みましょう dùng để rủ cùng uống. Đề yêu cầu ～ましょう; không dựa riêng vào dấu câu để loại ～ましょうか.

### Unit 6 — lesson_exercises/282

Điền từ hỏi loại đồ ăn trong câu “Bạn thích loại đồ ăn nào?”: （　　）食べ物が好きですか。

1. どんな
2. 何の
3. どれ
4. だれ

Đáp án: 1. どんな

どんな + danh từ hỏi loại hoặc đặc điểm: どんな食べ物 (loại đồ ăn nào).

### Unit 6 — lesson_exercises/284

Điền câu khẳng định ở hiện tại “Món cà ri này rất cay”: このカレーはとても（　　）です。

1. 辛い
2. 辛く
3. 辛かった
4. 辛くない

Đáp án: 1. 辛い

辛いです là cay ở hiện tại. 辛かったです là quá khứ; 辛くないです là không cay, không khớp nghĩa trong đề.

### Unit 7 — lesson_exercises/322

Người bán đang cầm chiếc áo ở gần họ, xa bạn. Dịch: “Hãy cho tôi xem cái áo đó.”

1. このシャツを見せてください。
2. そのシャツを見せてください。
3. あのシャツを見せてください。
4. どのシャツを見せてください。

Đáp án: 2. そのシャツを見せてください。

そのシャツ chỉ chiếc áo ở gần người nghe. この chỉ vật gần người nói, あの chỉ vật xa cả hai.

### Unit 8 — lesson_exercises/353

Dùng mẫu ～ませんか để rủ bạn cùng chơi tennis: いっしょにテニスを（　　）。

1. しますか
2. しませんか
3. してか
4. しないでか

Đáp án: 2. しませんか

しませんか là lời mời cùng làm gì theo mẫu ～ませんか. Đề đã chỉ định mẫu lời mời này.

### Unit 10 — lesson_exercises/413

Điền để yêu cầu “Hãy gọi taxi”: タクシーを（　　）ください。

1. 呼んで
2. 使って
3. 待って
4. 急いで

Đáp án: 1. 呼んで

呼んでください là hãy gọi. 使って là dùng và 待って là chờ, không khớp hành động được yêu cầu.

### Unit 11 — lesson_exercises/441

Theo bài đọc, người này dự định đến quốc gia nào trong tương lai?

1. 日本
2. フランス
3. 中国
4. イギリス

Đáp án: 2. フランス

Bài đọc nêu rõ フランスへ行くつもりです: dự định đi Pháp. Câu hỏi yêu cầu tên quốc gia được nhắc đến.

### Unit 11 — lesson_exercises/461

Điền để nói “Tôi rửa tay trước bữa ăn”: 食事の（　　）、手を洗います。

1. 前
2. 前に
3. 後
4. 後で

Đáp án: 2. 前に

食事の前に nghĩa là trước bữa ăn. 後で nghĩa là sau, không khớp trình tự trong đề.

### Unit 12 — lesson_exercises/485

Điền để yêu cầu “Hãy trả tiền”: お金を（　　）ください。

1. 払って
2. 借りて
3. 貸して
4. 疲れて

Đáp án: 1. 払って

払ってください là hãy trả tiền. 借りて là mượn và 貸して là cho mượn, không phải hành động trong đề.

### Unit 12 — lesson_exercises/502

Chọn câu hỏi lịch sự có nghĩa “Vào ngày nghỉ, bạn đã đi đâu?”.

1. 休みの日に、どこへ行きますか。
2. 休みの日に、何を食べましたか。
3. 休みの日に、どこかへ行きましたか。
4. 休みの日に、どこへ行きましたか。

Đáp án: 4. 休みの日に、どこへ行きましたか。

どこへ行きましたか hỏi đã đi đâu, ở quá khứ và thể lịch sự. どこかへ行きましたか hỏi có đi đâu đó không; hai câu hỏi không cùng nghĩa.

### Unit 2 — listening_content/7

Trường transcriptReading:

Trước: A: Kono onna no hito wa dare desu ka.
B: Ane desu. Nijuunisei desu.

Sau: A: Kono onna no hito wa dare desu ka.
B: Ane desu. Nijuunisai desu.

### Unit 11 — reading_passages/28

Trường reading:

Trước: らいしゅうのれんきゅうに、ともだちときょうとへいきます。しんかんせんでいくつもりです。きょうとでゆうめいなおてらとじんじゃをみます。よるはおんせんにはいりたいです。ほてるはもうよやくしました。りょこうのまえに、かめらをあたらしくかいくつもりです。

Sau: らいしゅうのれんきゅうに、ともだちときょうとへいきます。しんかんせんでいくつもりです。きょうとでゆうめいなおてらとじんじゃをみます。よるはおんせんにはいりたいです。ほてるはもうよやくしました。りょこうのまえに、かめらをあたらしくかうつもりです。

### Unit 12 — reading_passages/29

Trường reading:

Trước: せんしゅうのにちようび、ともだちといっしょにならへりょこうにいいきました。あさ、はやくおきて、でんしゃにのりました。ならはしずかで、とてもきれいなまちでした。おおきなおてらがたくさんありました。わたしたちはいちばんふるいおてらのしゃしんをとりました。ひるごはんはすしをたべました。おいしかったですが、すこしたかかったです。ごご、かぞくにおみやげをかいました。とてもつかれましたが、たのしかったです。またいきたいです。

Sau: せんしゅうのにちようび、ともだちといっしょにならへりょこうにいきました。あさ、はやくおきて、でんしゃにのりました。ならはしずかで、とてもきれいなまちでした。おおきなおてらがたくさんありました。わたしたちはいちばんふるいおてらのしゃしんをとりました。ひるごはんはすしをたべました。おいしかったですが、すこしたかかったです。ごご、かぞくにおみやげをかいました。とてもつかれましたが、たのしかったです。またいきたいです。

## Các phần chưa xử lý — theo ưu tiên

| Ưu tiên | Phần việc còn lại | Điều kiện hoàn tất |
|---|---|---|
| Cao | Rà nội dung ngoài phạm vi đã kiểm tra: bài tập còn lại, từ vựng, kanji, grammar, hội thoại, bài viết và bản dịch | Có checklist theo từng unit; không suy ra đã duyệt toàn khóa từ test cấu trúc |
| Cao | TTS và luồng học PC/mobile web | Thực nghe giọng Nhật, thử thiếu giọng/dừng phát, ghép câu, đọc/nghe và lưu tiến độ; kiểm tra trình duyệt di động thật |
| Cao | Xuất bản từng unit | Duyệt nội dung rồi mở các section/children tương ứng; hiện 120 section còn DRAFT |
| Cao | CF6 staging Cloudflare | D1/hostname/secrets thật, dữ liệu đúng checksum, cookie/CSRF và auth qua HTTPS |
| Cao | Điều kiện vận hành production | CPU auth/quota/chi phí, backup–restore remote, rollback code/data và readiness; health hiện vẫn ready:false |
| Sau beta | Bản thu nghe người thật và Translate | Theo nhu cầu; TTS có nhãn đã được chấp thuận cho beta |

Chưa triển khai remote. Không có thay đổi Android/iOS native. Dừng ở gói bài tập/phiên âm để người dùng kiểm tra.
