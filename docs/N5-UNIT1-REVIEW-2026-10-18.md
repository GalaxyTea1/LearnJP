# Unit 1 — rà nội dung và áp dụng local, 18/10/2026

## Kết quả

Đã rà các nhóm nội dung Unit 1 (module 7) và sửa 10 dòng: 4 Quiz, 3 bài tập,
2 trường cách đọc của bài đọc và 1 ví dụ từ vựng. Đã áp dụng vào D1 local chính,
không chỉ dừng ở candidate. Không tự xuất bản section hoặc deploy remote.

Tổng gói tích lũy: 183 thay đổi / 174 dòng khác snapshot gốc; 22 Quiz đã sửa qua các đợt.

## Phạm vi đọc và đối chiếu

| Nhóm | Số mục | Ghi nhận |
|---|---:|---|
| Từ vựng | 45 | Sửa ví dụ 住みます để câu tiếng Nhật khớp nghĩa đang sống ở Tokyo |
| Kanji | 8 | Chưa phát hiện lỗi cần sửa trong cách đọc, số nét và ví dụ đã rà; mnemonic là gợi nhớ, không phải giải thích nguồn gốc chữ |
| Ngữ pháp | 5 mẫu + 15 ví dụ | Đã đọc giải thích/ví dụ; chưa thay dữ liệu trong đợt này |
| Hội thoại | 2 hội thoại / 19 dòng | Đối chiếu tiếng Nhật, kana, romaji, bản dịch; chưa chứng nhận phát âm TTS |
| Nghe | 2 | Đối chiếu lời thoại/câu hỏi; chưa thực nghe trên thiết bị |
| Đọc | 2 | Bổ sung kana và bỏ suy luận không đủ căn cứ ở câu hỏi phụ thuộc |
| Viết | 2 | Mẫu khớp yêu cầu cơ bản; còn vấn đề lưu bài nháp và đơn vị độ dài ở UI/data |
| Bài tập | 36 | Đối chiếu đáp án với đề và bài nguồn; sửa 3 câu |
| Quiz | 15 | Sửa 4 câu về ngữ cảnh/cách đọc |

Đây là rà biên tập nội bộ, không thay thế nghiệm thu giảng dạy hoặc kiểm tra thiết bị.
Các nội dung ngoài Unit 1 chưa được coi là duyệt đầy đủ theo bảng này.

## Kiểm chứng

- 12/12 test D1 nội dung/cập nhật đạt, gồm nâng cấp từ bản trước, chấm Quiz,
  từ chối revision cũ, rollback, bảo toàn tài khoản/tiến độ và lọc DRAFT.
- 15/15 test HTTP trên database local chính đạt.
- Đối chiếu 18 bảng nội dung và chỉ mục tìm kiếm: khớp candidate.
- Cập nhật đúng 10 dòng / 4 Quiz; chạy lại rows:0. Không có lỗi khóa ngoại.
- Các trường từ vựng được index không đổi; chỉ thay exampleJp nên index giữ nguyên.
- Không đổi frontend/runtime backend; không chạy lại build hoặc xác nhận UI/browser.

Log: `.local/n5-unit1-tests.log`, `.local/n5-unit1-http-tests.log`.

## Backup

Backup trước gói này: `D:\SumaryJapanese-cloudflare\.local\content-backups\n5-1792259979041-4c9868b8-206e-4e5b-9d0e-08a74ac2dee6.json`.
Checksum candidate: `a7b3634be9c78117001d709d0f0ade39c72db8e2b257c7257ee968ada8e3c27f`.
Backup là nội dung, không phải toàn bộ tài khoản/database. Dừng server và thao tác
admin trước khi dry-run rollback; thêm --apply mới ghi:

```powershell
node scripts/apply-n5-content-local.mjs --rollback D:\SumaryJapanese-cloudflare\.local\content-backups\n5-1792259979041-4c9868b8-206e-4e5b-9d0e-08a74ac2dee6.json
```

Không dùng backup đợt cũ cho gói hiện tại. Script kiểm tra checksum và trạng thái
từng dòng, tăng version khi rollback và không ghi đè chỉnh sửa ngoài gói đã duyệt.

## Chi tiết sau sửa

### quiz_questions/51

**question**

Điền trợ từ đánh dấu chủ đề khi tự giới thiệu “Tôi là Tanaka”: 私（　　）田中です。

**explanation**

は (đọc là wa) đánh dấu chủ đề. が dùng trong ngữ cảnh khác, chẳng hạn xác định ai là Tanaka; đề này yêu cầu trợ từ chủ đề.

### quiz_questions/53

**question**

Điền để hỏi “Bạn có phải là học sinh/sinh viên không?”: あなたは学生（　　）。

**explanation**

ですか tạo câu hỏi lịch sự. です tạo câu khẳng định, không khớp yêu cầu hỏi trong đề.

### quiz_questions/55

**explanation**

何ですか đọc là なんですか (nan desu ka), nghĩa là “là cái gì?”. あれは何ですか nghĩa là “Kia là cái gì?”.

### quiz_questions/58

**question**

Bạn đang khỏe. Chọn câu trả lời xác nhận điều đó khi được hỏi お元気ですか (Bạn khỏe không?).

**explanation**

はい、元気です nghĩa là “Vâng, tôi khỏe”, đúng với tình huống đã cho. Câu trả lời thực tế tùy sức khỏe của người nói.

### lesson_exercises/118

**prompt**

ジョンさんはどこから来ましたか。

**options**

["アメリカ","韓国"]

**correctAnswer**

0

**explanation**

アメリカから来ました nghĩa là đến từ Mỹ. Câu này cho biết nơi người nói đến từ, không tự xác nhận quốc tịch.

### lesson_exercises/119

**prompt**

Theo đoạn tự giới thiệu, John nêu nghề nghiệp của mình là gì?

**options**

["学生","エンジニア"]

**correctAnswer**

1

**explanation**

John nói 私はエンジニアです: tôi là kỹ sư. Chỉ hỏi nghề được nêu; không suy luận rằng người đi làm không thể đồng thời đi học.

### lesson_exercises/126

**prompt**

Trong câu 田中先生は日本語を教えます (Thầy/cô Tanaka dạy tiếng Nhật), 先生 dùng để gọi ai?

**explanation**

Trong ngữ cảnh dạy tiếng Nhật, 先生 dùng để gọi giáo viên. Từ này cũng được dùng để xưng hô với bác sĩ trong ngữ cảnh khác.

### reading_passages/9

**reading**

なまえ：キム・ミンジュン
くに：かんこく
しごと：がくせい
ねんれい：はたち
がっこう：さくらにほんごがっこう

### reading_passages/10

**reading**

はじめまして。わたしのなまえはジョンです。アメリカからきました。にじゅうごさいです。わたしはエンジニアです。アイエムシーのしゃいんです。どうぞよろしくおねがいします。

### vocabulary/264

**exampleJp**

東京に住んでいます。

**exampleEn**

I live in Tokyo.

## Việc tiếp theo

1. **Đã sửa ở gói kế tiếp:** [lưu bản nháp luyện viết](N5-WRITING-DRAFT-2026-10-18.md).
   Lưu riêng theo bài/tài khoản trên trình duyệt, khôi phục sau khi đổi tab hoặc
   reload, có cảnh báo và retry khi lưu lỗi. 84/84 test frontend và build đạt;
   thao tác PC/mobile thực tế còn cần kiểm tra thủ công.
2. Làm rõ đơn vị độ dài writing_tasks: task 10 yêu cầu 5–8 câu nhưng dữ liệu
   minLength/maxLength không có unit; AdminPage hiển thị w.unit không tồn tại.
   UI học viên hiện chỉ hiển thị instructions, không thực thi min/max; chưa phải lỗi chặn gõ.
3. Tiếp tục checklist nội dung Unit 2–12; các sửa chọn lọc trước đây không tương đương rà đầy đủ.
4. Kiểm tra TTS, ghép câu và lưu tiến độ trên PC/mobile web thật.
5. Duyệt xuất bản từng bài (120 section vẫn DRAFT), rồi CF6 staging HTTPS/D1/secrets,
   đo CPU/quota và backup–restore remote trước production.

Dừng sau gói Unit 1 để người dùng kiểm tra. Nguồn PostgreSQL ổ C không thay đổi.
