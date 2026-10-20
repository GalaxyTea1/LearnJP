# Unit 6 — rà nội dung, 18/10/2026

Unit 6 là **Food and Drink / 食べ物と飲み物**, module **11**.
Gói sửa gồm **24 dòng nội dung**, trong đó có **4 Quiz**, và **6 mục tìm kiếm**.
Đã áp dụng vào D1 local chính, có backup và kiểm chứng; chưa xuất bản hoặc deploy remote.

## Phạm vi đã đọc và đối chiếu

| Nhóm | Số mục | Kết quả |
|---|---:|---|
| Thông tin bài | 1 module / 10 section | Topics khớp đồ ăn/uống, vị giác, gọi món và lời rủ |
| Từ vựng | 45, ID 406–450 | Sửa 5 mục: ví dụ trà đắng, nghĩa お茶, いただきます, 一番 và ましょうか |
| Kanji | 8, ID 66–73 | Sửa phân loại On/Kun của 肉 và 茶; giữ âm On đúng và ví dụ |
| Ngữ pháp | 5 mẫu / 9 ví dụ | Sửa giải thích 好き／嫌い với が/は và bổ sung nghĩa đề nghị giúp của ましょうか |
| Hội thoại | 2 / 9 dòng | Đối chiếu tiếng Nhật/kana/romaji/bản dịch; giữ nguyên |
| Nghe | 2 | Sửa hướng dẫn tránh gán cặp đôi/giới tính không có bằng chứng; dịch rõ câu hỏi chọn đồ uống; giữ transcript Nhật và romaji |
| Đọc | 2 | Đối chiếu kana/dịch, vị trí/giá menu và câu hỏi; giữ nguyên |
| Viết | 2 | Khớp giới hạn 2–3 và 1–2 câu; ghi đơn vị rõ; mẫu đáp án hợp lệ |
| Bài tập | 36, ID 259–294 | Sửa 6 câu về tình huống yêu cầu, cách đọc, trợ từ và người nói |
| Quiz | 15, ID 106–120 | Sửa 4 câu về âm đọc, trợ từ, loại đồ uống và cách nhờ khách đợi |

Đây là rà biên tập nội bộ, chưa nghiệm thu giảng dạy hay thực nghe TTS. Âm đọc
Kanji là danh sách chọn lọc; không chứng nhận mọi âm là N5 hoặc liệt kê đầy đủ.
Bản dịch tiếng Anh được giữ khi khớp nghĩa, chưa chuyển toàn khóa sang tiếng Việt.

## Các thay đổi

| Dòng | Vấn đề | Sau |
|---|---|---|
| learning_modules/11 | Topics chào hỏi/giới thiệu | Food and drink, Tastes and preferences, Ordering and invitations |
| vocabulary/412 | Ví dụ dễ hiểu mọi trà đều đắng | このお茶は苦いです / This tea is bitter |
| vocabulary/437 | お茶 chỉ ghi green tea | tea (often green tea), ví dụ dịch tea |
| vocabulary/440 | いただきます dịch Let's eat dễ nhầm lời rủ | Diễn giải lời cảm tạ trước ăn |
| vocabulary/444 | most favorite cuisine thiếu tự nhiên | What dish do you like best? |
| vocabulary/446 | ましょうか chỉ là shall we | Thêm shall I khi đề nghị làm giúp |
| kanji/67 | にく bị ghi là Kun | Giữ On ニク; Kun rỗng trong danh sách cơ bản; ghi chú しし là âm Kun hiếm chưa đưa vào bài |
| kanji/68 | ちゃ bị ghi là Kun | Giữ On チャ、サ; Kun rỗng; ví dụ お茶 dịch tea |
| grammar_patterns/42 | Đối tượng thích/ghét bắt buộc が | Giải thích mẫu cơ bản và は khi nêu chủ đề/đối chiếu; 嫌い là tính từ な |
| grammar_patterns/43 | ましょうか chỉ cùng làm | Cách tạo mẫu và nghĩa đề nghị mình làm giúp |
| listening_content/17 | Gọi A/B là couple; câu chọn đồ uống dịch which is better | Hai khách, Which would you prefer? |
| listening_content/18 và lesson_exercises/289 | Gán người nói là đàn ông | Dùng người nói, phù hợp TTS phụ thuộc thiết bị |
| writing_tasks/17–18 | Giới hạn/đơn vị chưa khớp hướng dẫn | 2–3 và 1–2 câu; max của bài 17 giảm từ 4 xuống 3 |
| lesson_exercises/269 | Mọi đáp án đều đúng | Hỏi xin thanh toán, đổi options và correctAnswer sang お会計 |
| lesson_exercises/274 | Hỏi chữ 魚 như chỉ có một cách đọc | Nêu câu 魚を食べます và cách đọc thông dụng trong bài |
| lesson_exercises/279,280,283 | は cũng có thể đúng theo ngữ cảnh | Nêu rõ mẫu をください hoặc が好きです cần luyện |
| quiz_questions/107 | Hỏi âm 酒 thiếu ngữ cảnh | 酒 trong お酒 |
| quiz_questions/111 | を／は có thể tạo yêu cầu theo ngữ cảnh | Hỏi mẫu Nをください |
| quiz_questions/114 | Đồ uống nào chưa khớp rõ どんな | Loại đồ uống nào |
| quiz_questions/118 | Hai cách nói đều có thể dịch xin đợi | Hỏi cách trang trọng dùng 少々／お待ちください; giải thích câu kia vẫn lịch sự |

Kun rỗng được lưu bằng chuỗi rỗng theo kiểu dữ liệu hiện có; giao diện Kanji đang
có hiển thị dự phòng dấu —; hàm phát âm trả về khi nội dung rỗng (đã đọc mã, chưa thử UI). Điều này không có nghĩa mọi chữ đều không có âm Kun
khác; riêng 肉 có âm hiếm しし được ghi chú. Không thêm âm hiếm vào mục học cơ bản.

## Nguồn đối chiếu

- [Kanjipedia — 肉](https://www.kanjipedia.jp/kanji/0005428500): ニク là On, しし là Kun ngoài bảng thường dùng.
- [Kanjipedia — 茶](https://www.kanjipedia.jp/kanji/0004711300): チャ／サ nằm ở mục On, mục Kun không có âm ちゃ.
- [Japan Foundation — Irodori Elementary 1, Lesson 10](https://www.irodori.jpf.go.jp/assets/data/elementary01/pdf/Y_L10.pdf):
  Vましょうか dùng khi đề nghị giúp người nghe.

## Kiểm chứng và áp dụng

Công cụ cập nhật được mở rộng hẹp cho bảng Kanji: chỉ cho sửa kunyomi, example_words
và mnemonic, giữ nguyên ID/chữ/module/publication. Dữ liệu và search index cập nhật
cùng batch, có kiểm tra dữ liệu trước khi ghi và rollback.

- **20/20 test D1 đạt**: nâng cấp từ các baseline, chấm Quiz với đáp án độc lập,
  từ chối revision cũ, không cộng XP hoàn thành lần hai, rollback và chống ghi đè.
  Hai test mới kiểm tra đủ 24 dòng Unit 6, 6 mục tìm kiếm, âm On/Kun,
  đáp án thanh toán, giới hạn bài viết và bảo toàn transcript/liên kết nguồn;
  từ chối sửa chữ/ID module, sửa đồng thời và chỉ mục Kanji thiếu.
- **19/19 test HTTP đạt** trên database chính: nội dung khớp candidate, Kun rỗng
  và On đúng, tìm kiếm theo nội dung mới, section DRAFT vẫn bị ẩn.
- Chạy lại trả **rows:0**; đối chiếu đủ **18 bảng nội dung và 696 mục tìm kiếm**,
  **0 lỗi khóa ngoại**, database chính có **0 user thử nghiệm**.
- Các bảng tài khoản/tiến độ không đổi. **120 section trong 12 bài N5 mở vẫn DRAFT**.
- Không sửa frontend/runtime backend; không chạy lại build/UI trong đợt này.
  Server chính đã khởi động lại ở port 8787.

Log: .local/n5-unit6-tests.log và .local/n5-unit6-http-tests.log.
Backup riêng: .local/content-backups/n5-1792305729535-cf544c3d-1115-4832-9992-2c4896bbf201.json.
Receipt: .local/content-backups/latest-result.json (có thể thay bằng receipt gói sau).

Tổng tích lũy: **282 thay đổi / 264 dòng khác bản gốc / 42 Quiz**.
24 dòng của đợt này chỉ tăng 21 dòng duy nhất: hai bài nghe và bài tập 289 đã được
sửa/gắn liên kết ở gói trước. Không cộng cơ học số dòng từng đợt.
Checksum candidate: `6ab3667447e50eeab5f111b9d0352a232296732c5ecbbba7f4361e36ba4b777e`.
Baseline Unit 5: `c27dcb5a94ff72681667d457bcbd8afa09ac63ec64d2d9763fe1e532264a1db8`.
Snapshot gốc: `f6179bfab8b0180c4e1a98fa6aab4fe944454593319f3ecf6c491a9c54b7788f`.
Danh sách sửa: `scripts/n5-unit6-corrections.mjs`; before/after trong `docs/N5-CONTENT-REVIEW.json`.

## Kiểm tra và bước tiếp theo

Website chính: http://127.0.0.1:8787/learning?moduleId=11. Từ vựng/Kanji/ngữ pháp/Quiz
có thể kiểm tra; hội thoại/nghe/đọc/viết/bài tập vẫn ẩn với học viên do DRAFT.
Port 5180 là fixture luyện viết Unit 1, không phải Unit 6. Chưa kiểm tra TTS/luồng
học trên thiết bị thật, chưa xuất bản hoặc deploy remote. Khi tới giai đoạn TTS, cần
kiểm tra cả nút đọc từ/Kanji: helper của chúng hiện khác phần phát bài nghe, gồm
cách chờ giọng Nhật và fallback khi thiết bị không có giọng; chưa nghiệm thu nhánh này.

Dừng sau Unit 6 để người dùng kiểm tra, sau đó:

1. Rà **Unit 7–12**, từng gói.
2. Kiểm tra TTS và học/lưu tiến độ trên PC/mobile web thực tế.
3. Duyệt/xuất bản từng bài; 120 section trong 12 bài N5 mở vẫn DRAFT.
4. Cloudflare staging: D1, hostname, secrets, đăng nhập/cookie HTTPS.
5. CPU/chi phí, backup–khôi phục, rollback và kiểm tra vận hành.
