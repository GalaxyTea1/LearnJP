# Kiểm tra nội dung N5 Unit 2–12 — 2026-10-17

> Cập nhật sau sửa: nhóm A và các câu **quiz_questions** trong nhóm B/C đã được
> xử lý ở candidate, tổng 18 câu. Xem [gói sửa Quiz](N5-QUIZ-REVIEW.md).
> Các phát hiện và checksum bên dưới giữ làm bằng chứng tại thời điểm audit.
> Các bài tập và phiên âm đã nêu bên dưới tiếp tục được sửa ngày 18/10, gồm 19 bài tập
> và 3 phiên âm, đã áp dụng local. Xem [gói đợt 2](N5-EXERCISE-REVIEW-2026-10-18.md).
> Các kết luận chưa sửa bên dưới là lịch sử audit, không phải trạng thái hiện tại.

## Kết luận

Chưa nên mở toàn bộ khóa N5 cho beta. Gói sửa trước có thể tái tạo đúng, nhưng còn
lỗi đáp án, lời giải và ngữ cảnh của Quiz chấm điểm; một số phiên âm sai vẫn còn.
Báo cáo này chỉ ghi nhận và đề xuất. Không sửa candidate, database, trạng thái xuất bản
hay cấu hình deploy.

## Phạm vi và bằng chứng

- Đọc 165 câu quiz_questions của Unit 2–12.
- Đối chiếu nội dung 22 bài đọc và 22 lời thoại nghe trong các unit này với câu hỏi
  đã liên kết; rà thêm các bài tập có dấu hiệu nhiều đáp án hợp lý.
- Chưa chứng nhận toàn bộ 396 lesson_exercises, từ vựng, kanji, grammar, hội thoại,
  bài viết hoặc chất lượng âm thanh trên thiết bị thật.
- Kiểm tra code đọc/chấm Quiz: backend/cloudflare/content.ts và assessments.ts.
- Nguồn kiểm tra: .local/content/n5.json và .local/content-review/n5-candidate.json.
- SHA256 theo JSON chuẩn hóa của script hiện có:
  - Gốc: f6179bfab8b0180c4e1a98fa6aab4fe944454593319f3ecf6c491a9c54b7788f
  - Candidate: a57c5be9a02e80a7240bc82412853c92ac77168430630111b704f87fef2ffacd
- Gọi reviewSnapshot trong bộ nhớ: candidate khớp hoàn toàn, 133 thay đổi / 127 dòng.
- auditSnapshot hiện trả SECTION_NOT_PUBLIC:120 và TTS_BETA:24.
  Hàm này kiểm tra cấu trúc, không đánh giá tính đúng của ngôn ngữ hoặc ngữ nghĩa.
- Không chạy lại toàn bộ test/build; lượt này kiểm tra dữ liệu/code bằng đọc file,
  tái tạo trong bộ nhớ. Không xác nhận lại database đang chạy hoặc remote.

## A. Ưu tiên cao — phải xử lý trước khi mở các Quiz liên quan

### A1. Quiz 206 / Unit 12: nhầm mượn và cho mượn

Đề hỏi xin phép mượn từ điển. Đáp án đang chọn index 2:
「辞書を貸してもいいですか。」. 貸す là cho mượn, còn 借りる là mượn.
Lời giải hiện dịch câu này thành “Cho tôi mượn được không” nên dạy sai vai hành động.

Đề xuất: làm rõ mục tiêu “xin phép tự mình mượn, dùng ～てもいいですか”,
đổi lựa chọn đúng thành 「辞書を借りてもいいですか。」 và sửa lời giải.
Lựa chọn 「辞書を貸してください。」 cũng là cách yêu cầu người khác cho mình mượn;
cần giữ đề đủ rõ để phân biệt yêu cầu và xin phép.

### A2. Quiz 42 / Unit 2: người này và người kia

Đề hỏi “Người này là ai?”. Đáp án đang chọn “B và C đều đúng”, nhưng:
- B: この人は誰ですか。 — người này.
- C: あの方はどなたですか。 — vị/người kia.

Đề xuất giữ đề hiện tại và chọn B (correctIndex 1); giải thích cả sự khác nhau về
vị trí chỉ định và mức lịch sự. Không gộp hai câu thành cùng bản dịch.

### A3. Quiz 85 / Unit 4: lời giải tạo quy tắc sai

「毎朝、牛乳を（　　）。」 có cả 飲みます và 飲みません.
Lời giải nói vì có 毎朝 nên phải khẳng định Vます. 毎朝 chỉ tần suất, không quyết định
khẳng định/phủ định.

Đề xuất thêm nghĩa đích “Mỗi sáng tôi uống sữa”, chọn 飲みます theo nghĩa đó;
bỏ quy tắc sai. Không chỉ đổi lời giải mà để câu hỏi vẫn mơ hồ.

### A4. Quiz 119 / Unit 6: suy diễn ngoài bài đọc

Bài đọc 17 nói thường gọi ramen và bia lạnh, rồi nhận xét bánh ngọt ngọt và ngon.
Không nói rõ tác giả gọi bánh. Quiz hỏi món không gọi, chấm Sushi và giải thích
“đã gọi ramen, bia và bánh” — bằng chứng trong bài chưa đủ cho kết luận này.

Đề xuất hỏi trực tiếp hai món được nêu là thường gọi, hoặc biên tập bài đọc để
tình huống gọi món đủ rõ rồi đồng bộ tất cả câu hỏi phụ thuộc.

### A5. Quiz có thể hỏi bài đọc bị ẩn

Quiz 44, 74, 119, 149 tham chiếu bài đọc. Trong đó 44/119/149 không chứa đủ dữ kiện
để trả lời độc lập; 74 đã trích giờ làm việc ngay trong đề.

content.ts questions() lấy toàn bộ quiz_questions theo module, còn full() chỉ trả
reading_passages có trạng thái PUBLISHED và cha PUBLISHED.
assessments.ts chấm toàn bộ Quiz của module, không kiểm tra bài đọc nguồn.
Snapshot hiện có module PUBLISHED nhưng các section liên quan DRAFT.

Hệ quả suy ra từ code và snapshot: học viên có thể nhận Quiz cần bài đọc mà không
được xem bài đọc. Đây là vấn đề thiếu ngữ cảnh, không phải API làm lộ bản nháp.

Đề xuất ưu tiên cho beta: viết các câu Quiz thành tình huống tự đủ dữ kiện.
Nếu giữ câu phụ thuộc bài đọc, cần quan hệ nguồn tường minh và bộ lọc nhất quán ở
API đọc, revision, chấm điểm, tổng câu và điều kiện xuất bản. Chỉ sửa frontend không đủ.

## B. Ưu tiên cao — câu chọn một đáp án nhưng chưa đủ ngữ cảnh

Các ví dụ chắc chắn nên sửa trước khi dùng để đánh giá học viên:

| Bảng / ID | Unit | Vấn đề | Hướng sửa |
|---|---:|---|---|
| quiz_questions 66 | 3 | 仕事は５時… có thể から hoặc まで | Nêu “làm việc đến 5 giờ” |
| quiz_questions 100 | 5 | Có thể います hoặc いません | Nêu rõ có mèo dưới cây |
| quiz_questions 113 | 6 | Câu cùng xem phim chưa yêu cầu lời rủ rê | Nêu mục tiêu rủ cùng xem |
| quiz_questions 115 | 6 | 苦い và 苦かった đều ghép được trước です | Nêu nghĩa hiện tại và khẳng định |
| quiz_questions 130 | 7 | いくつ hỏi số lượng; いつ hỏi thời điểm đều hợp | Yêu cầu hỏi số quả |
| quiz_questions 156 | 9 | 忙しかった và 忙しかったです đều đúng | Yêu cầu thể lịch sự |
| quiz_questions 163 | 9 | “Nếu chọn trà” chưa có câu hỏi so sánh | Bổ sung hai lựa chọn và yêu cầu ～のほうが |
| lesson_exercises 89 | 2 | 人 và 友達 đều tạo câu hợp lý | Thêm nghĩa đích “người kia” |
| lesson_exercises 177 | 3 | 何時 hoặc 何曜日 tùy muốn hỏi giờ/ngày | Nêu hỏi mấy giờ |
| lesson_exercises 233 | 5 | Khoảng giữa/gần/phía trước cần dữ kiện vị trí | Nêu nghĩa hoặc thêm sơ đồ |
| lesson_exercises 281 | 6 | Nhiều cách kết thúc lời nói hợp ngữ cảnh | Chỉ rõ kiểu lời rủ ～ましょう |
| lesson_exercises 284 | 6 | 辛い hoặc 辛かった tùy thời điểm | Nêu nghĩa hiện tại |
| lesson_exercises 413 | 10 | Gọi, dùng hoặc chờ taxi đều hợp | Nêu “hãy gọi taxi” |
| lesson_exercises 461 | 11 | Rửa tay trước hoặc sau bữa ăn đều có thể | Nêu “trước bữa ăn” |
| lesson_exercises 485 | 12 | Trả/mượn/cho mượn tiền đều tạo câu hợp | Nêu nghĩa “hãy trả tiền” |

Cần làm rõ thêm, không coi đáp án hiện tại chắc chắn sai:
- Quiz 36: nên nêu “Đây là sách của tôi” để kiểm tra sở hữu の.
- Quiz 38: nên yêu cầu cách hỏi lịch sự với どなた.
- Quiz 144: nên nêu lý do không có tiền và yêu cầu dùng ～からです.
- Exercise 171: nên nêu cuộc họp bắt đầu từ 3 giờ.
- Exercise 441: フランス và 外国 có mức độ cụ thể khác nhau; thay lựa chọn quá rộng
  hoặc hỏi rõ tên quốc gia được nhắc đến.

## C. Ưu tiên tiếp theo — phiên âm và diễn giải

| Bảng / ID | Unit | Nội dung hiện tại | Cần sửa |
|---|---:|---|---|
| listening_content 7, transcriptReading | 2 | Nijuunisei cho 22歳 | nijūni-sai / nijuunisai theo quy ước romanization của dự án |
| reading_passages 28, reading | 11 | かいくつもり | かうつもり cho 買うつもり |
| reading_passages 29, reading | 12 | りょこうにいいきました | りょこうにいきました |
| lesson_exercises 502, explanation | 12 | Chuyển câu hỏi “đã đi đâu” sang “đã đi đâu đó chưa” | Nêu rõ thể lịch sự câu hỏi; ví dụ 休みの日に、どこへ行きましたか。 |

Cần thống nhất cách biểu diễn trường reading: có đoạn giữ trợ từ は, có đoạn viết わ
theo âm đọc; không nên tự coi mọi わ là lỗi nếu trường này chủ ý ghi cách phát âm.
Quiz 186 dùng 絵を書く; nên chuẩn hóa ví dụ vẽ tranh thành 絵を描く khi biên tập.

## D. Trình tự đề xuất

1. Sửa nhóm A và các câu Quiz chấm điểm mơ hồ trong nhóm B, kèm kiểm chứng kết quả
   chấm đúng/sai và revision khi thay đề. Giữ thay đổi trong candidate để người dùng xem.
2. Sửa bài tập, phiên âm và đồng bộ câu hỏi đọc/nghe; rà nốt phần nội dung ngoài
   phạm vi lượt này. Không tự chuyển cả khóa sang PUBLISHED.
3. Kiểm tra TTS và thao tác học thực tế trên PC/mobile web; công cụ browser lượt trước
   bị tắt nên vẫn chưa có xác nhận mới về âm thanh.
4. Chuẩn bị áp dụng candidate với backup/checksum/version, xuất bản theo unit đã duyệt.
5. Tiếp tục CF6 staging HTTPS, cấu hình Cloudflare thật, kiểm tra cookie, CPU/quota
   và backup/restore trước khi mời học viên.

Giữ quy trình dừng sau từng phần để người dùng kiểm tra. Các số test trong báo cáo cũ
là kết quả lịch sử, không phải bằng chứng các lỗi ngôn ngữ nêu ở đây đã được sửa.

