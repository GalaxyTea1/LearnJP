# CF5 — Frontend, API và PC/mobile web

Cập nhật 17/10/2026. Bản làm việc: `D:\SumaryJapanese-cloudflare`.

## Kết luận

CF5 đã hoàn tất phạm vi sửa code và kiểm tra local nêu dưới đây. Đây không phải
chứng nhận production: nội dung N5 chưa xuất bản đầy đủ và CF6 chưa thực hiện.
Không deploy remote, không sửa source ổ C hay database PostgreSQL.

## Thay đổi

- Đọc localStorage an toàn ngay khi import API/AuthProvider; trình duyệt chặn storage
  không còn làm hỏng toàn bộ trang. Học thử vẫn mở được, có cảnh báo không giữ được
  tiến độ sau khi đóng/tải lại trang.
- Login/refresh kiểm tra khả năng lưu session. Lỗi quota sau login không để UI nhận
  identity lưu dở; cố gắng thu hồi cookie vừa tạo. Logout vẫn gọi server nếu thao tác
  xóa storage thất bại. Giữ revision và khóa auth giữa các tab.
- Adapter storage truy cập lười cho study progress, tránh SecurityError trước khối
  xử lý lỗi. Thông báo guest không còn khẳng định đã lưu khi storage thất bại.
- Các API chưa có signal được giới hạn fetch 15 giây; luồng học dùng timeout bao
  trùm cả refresh như trước. Không coi timeout là bằng chứng server chưa ghi dữ liệu.
- Worker chấp nhận tham số tìm kiếm `q` FE đang gửi, đồng thời giữ `search` cũ.
  Kiểm tra từ vựng, kanji và ngữ pháp với kết quả thật, rỗng và đầu vào quá dài.
- Hộp chi tiết từ dùng flex, chữ nhiều ký tự tự xuống dòng theo vùng nội dung;
  sửa lỗi chữ lớn đè lên nút phát âm trên mobile. Chữ đơn vẫn có hướng dẫn nét.
- Trong build Cloudflare, ẩn Translate ở menu và trang chủ. `/translate` giải thích
  tính năng chưa mở và dẫn tới từ điển. Chưa coi endpoint dịch Google không có
  contract ổn định và OCR thiếu hủy/giới hạn là dịch vụ beta đã được kiểm chứng.
  Bản build thường giữ hành vi cũ. Không xóa mã tính năng.
- Thêm `scripts/preview-cf5.mjs` để tạo database UI biệt lập, chỉ bind localhost,
  có tài khoản giả dành riêng cho thử nghiệm; không dùng database chính/remote.

## Kiểm tra đạt

| Kiểm tra | Kết quả |
|---|---|
| Root `node --test --test-concurrency=2 scripts/*.test.mjs` | 74/74 |
| Frontend `node --test scripts/*.test.mjs` | 70/70 |
| Worker `tsc --noEmit` | Đạt |
| `node scripts/build-cloudflare.mjs` (FE TypeScript + Vite) | Đạt |
| Wrangler deploy `--dry-run`, cấu hình local | Đạt, không upload |
| Main local D1, kiểm tra import không có `--apply` | 18 bảng đúng snapshot, 0 lỗi FK, 0 user |

Checksum nội dung chính:
`f6179bfab8b0180c4e1a98fa6aab4fe944454593319f3ecf6c491a9c54b7788f`.
Log test/build ở `.local/cf5-root.log`, `.local/cf5-frontend.log`,
`.local/cf5-build.log`, `.local/cf5-bundle.log`.

### Luồng UI đã chạy trong trình duyệt

Database biệt lập `.local/cf5-preview-CQi5Ow`, Unit 01, moduleId=7:

1. Guest mở bài, chọn đáp án; mở login ngay trong Quiz ở mobile. Sau login giữ URL,
   tab Quiz và đáp án. Tiến độ guest không bị tự động nhập vào tài khoản.
2. Đánh dấu từ bằng tài khoản, reload vẫn giữ. Nộp đủ 15 câu, nhận 100% và +150 XP;
   trạng thái hoàn thành lưu vào tài khoản, reload giữ kết quả. Chống cộng XP lặp
   được kiểm tra ở bộ test backend, không suy ra chỉ từ số XP hiển thị sau reload.
3. Dừng API local khi trang đang mở, đánh dấu thêm từ: UI giữ thao tác và báo chưa
   lưu, có nút thử lại. Khởi động lại cùng database, thử lại thành công; reload còn
   cả hai từ đã đánh dấu. Đây là kiểm tra mất kết nối API, không phải chứng nhận
   app hoạt động offline hoàn toàn hay có service worker.
4. Sáu tab học ở 375/390/768/1440px: không tràn ngang document. Hội thoại/nghe và
   bài tập/đọc hiện là **trạng thái rỗng** vì publication filter; không tính là đã
   kiểm tra phát audio hay làm bài đọc trên nội dung công khai.
5. Từ điển tra `arigatou`, mở chi tiết ở mobile. Sau sửa, hộp từ nằm trong viewport
   ở bốn kích thước; chữ không đè nút phát âm. Back về bài học, Forward về từ điển.
6. Trang Writing tải bảng kana, mở chi tiết あ và nút replay thứ tự nét. Chưa chứng
   nhận chất lượng âm thanh hoặc thao tác chạm/vẽ trên thiết bị điện thoại thật.
7. Build mới: menu/trang chủ không có Translate; mở trực tiếp URL có thông báo rõ.

Ảnh minh chứng sửa mobile: [cf5-dictionary-mobile.jpg](../.local/cf5-dictionary-mobile.jpg).
Storage bị chặn/quota được mô phỏng bằng unit test, không giả nhận đã bật chính sách
chặn storage trong trình duyệt thật. Đây là responsive desktop-browser testing;
Safari iOS/Chrome Android và thiết bị thật còn cần smoke ở staging.

## Phát hiện nội dung cần xử lý tiếp

Snapshot đang có 12 module PUBLISHED nhưng **120/120 section của chúng là DRAFT**.
API public không được bỏ điều kiện này để làm UI có dữ liệu.

| Dữ liệu bên trong 12 module mở | Có trong snapshot | Học viên truy cập được |
|---|---:|---:|
| Section | 120 | 0 |
| Hội thoại | 24 | 0 |
| Bài nghe | 24 | 0 |
| Bài đọc | 24 | 0 |
| Bài viết | 24 | 0 |
| Bài tập | 432 | 0 |

Các dòng con trên cũng đang DRAFT. Số 24 bài nghe là số mục **thuộc module đã mở**,
không phải 24 bài nghe public. Cả 24 còn dùng `PENDING_AUDIO`; giọng đọc tự động
trong code là fallback phụ thuộc trình duyệt, chưa thay thế chất lượng bản thu âm.
Không tự xuất bản hàng loạt bản nháp chưa qua rà nội dung.

Vocab 540, kanji 96, grammar 60 và 180 câu Quiz của 12 module vẫn truy cập được.
UI hiện hiển thị 6 phần/bài trong khi 2 phần còn rỗng; phải rà nội dung và điều kiện
hoàn thành trước khi mời học viên thử toàn bộ N5. Đây là blocker về trải nghiệm,
không phải lỗi import hay lý do nới quyền public.

## Thứ tự tiếp theo

1. **P0 trước beta đầy đủ:** rà từng section/nội dung N5, sửa nội dung cần thiết,
   chuẩn bị danh sách xuất bản có kiểm chứng; chốt cách cung cấp bài nghe. Sau đó
   kiểm tra luồng nghe/đọc/bài tập thực sự có dữ liệu và tiến độ các phần.
2. **CF6/P0:** cấu hình staging HTTPS, D1 và secrets riêng; smoke cookie/CSRF,
   ghi tiến độ/Quiz, đo CPU bcrypt/quota, backup/restore và rollback.
3. **P1 sau nền tảng beta:** provider dịch và OCR có hủy/timeout; bật lại tính năng
   sau khi kiểm tra. Chất lượng TTS cần thử trên thiết bị/giọng tiếng Nhật thực tế.

Dừng để người dùng kiểm tra CF5 trước phần tiếp theo theo cách làm đã thống nhất.
