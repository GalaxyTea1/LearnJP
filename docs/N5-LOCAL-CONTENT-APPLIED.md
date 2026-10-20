# N5 — đã áp dụng nội dung vào database local chính

> Biên bản lịch sử của đợt Quiz. Database hiện đã nhận thêm đợt bài tập/phiên âm;
> xem [trạng thái và backup mới](N5-EXERCISE-REVIEW-2026-10-18.md). Không dùng backup
> đợt cũ để rollback gói mới: công cụ sẽ từ chối checksum khác phiên bản.

Cập nhật 18/10/2026 (Asia/Bangkok). Lệnh apply hoàn tất lúc
2026-10-17T16:58:42.131Z, tức 23:58:42 ngày 17/10 theo giờ địa phương.

## Kết quả thực tế

- Workspace: D:/SumaryJapanese-cloudflare.
- Database: binding DB của wrangler.local.jsonc, lưu tại .wrangler/state/v3.
- Đã ghi **145 dòng nội dung**, tương ứng 151 thay đổi biên tập; gồm **18 câu Quiz**.
- Đã đối chiếu đủ 18 bảng nội dung và chỉ mục tìm kiếm sau ghi: khớp candidate.
- Chạy lại công cụ cập nhật: 0 dòng cần ghi, không cập nhật lặp.
- Bảng tài khoản, tiến độ và các bảng ngoài nội dung giữ nguyên; database hiện có 0 user.
- Khóa ngoại: 0 lỗi. Không thay đổi N4, module mock hoặc publication.
- Website chạy bằng lệnh dev ở workspace này đọc được dữ liệu mới. Đã kiểm tra qua HTTP.

Candidate SHA256:
`dce0ec17693c55cc0edd4319da1c2de5e9ed4c5e55a49f31d1c2a6436e1aabb7`.

Snapshot gốc CF2 vẫn giữ nguyên để đối chiếu lịch sử. Gói candidate hiện là dữ liệu
được dùng mặc định khi chạy import vào database local mới, không còn dùng snapshot cũ.

## Kiểm chứng

- **10/10 test D1 tạm**: áp dụng, chạy lại, bảo toàn tài khoản/tiến độ, xung đột
  version, rollback khi lỗi ở cuối batch, khôi phục nội dung và chấm Quiz.
- **15/15 test HTTP** trên website dùng database local chính: đủ 12 module N5,
  đề Quiz và revision mới, dữ liệu draft bị ẩn đúng, API không lộ đáp án.
- `node scripts/import-d1-local.mjs`: verified:true, imported:0, 18 bảng khớp.
- `node scripts/apply-n5-content-local.mjs`: already current, rows:0.
- Log: .local/n5-apply-tests.log và .local/n5-applied-http-tests.log.
- Không thay giao diện/runtime FE trong lượt này; không chạy lại build, không coi
  kiểm tra HTTP là kiểm chứng thao tác/âm thanh trên browser thật.

Lần apply đầu dừng trước ghi vì API D1 không cho đọc bảng nội bộ _cf_METADATA.
Đã loại bảng nội bộ này khỏi phép đối chiếu, giữ kiểm tra các bảng ứng dụng và chạy
lại thành công. Lần kiểm thử HTTP trong sandbox bị chặn kết nối local; lần chạy
được cấp quyền truy cập localhost đạt 15/15.

## Backup và cách khôi phục

Backup trước lần apply thành công:
`.local/content-backups/n5-1792256320304-aa10182b-e16f-4f63-8ec3-4ca36c19a380.json`.

Biên nhận: `.local/content-backups/latest-result.json`.

Backup chứa đầy đủ các bảng nội dung trước cập nhật và checksum để kiểm tra tính
toàn vẹn. Đây là backup **nội dung**, không phải bản sao toàn bộ tài khoản/database.
Script chỉ ghi bốn bảng nội dung; đối chiếu trạng thái các bảng ứng dụng còn lại.

Dừng server và thao tác admin trước khi chạy cập nhật hoặc khôi phục. Dry-run:

```powershell
node scripts/apply-n5-content-local.mjs
node scripts/apply-n5-content-local.mjs --rollback .local/content-backups/n5-1792256320304-aa10182b-e16f-4f63-8ec3-4ca36c19a380.json
```

Thêm `--apply` mới thực thi. Công cụ tự lưu backup trước khi ghi. Rollback từ chối
nếu nội dung đã bị sửa tiếp; version nội dung tăng thay vì quay về số cũ để tránh
chấp nhận thao tác sửa từ phiên bản lỗi thời. Không rollback số revision Quiz.
Không tự chạy rollback trên database chính chỉ để thử.

Mỗi dòng được kiểm tra toàn bộ giá trị cũ ngay trong cùng D1 batch với UPDATE.
Một dòng bị sửa đồng thời hoặc một statement lỗi làm rollback toàn bộ batch.

## Cách dùng bản local đã cập nhật

```powershell
cd D:\SumaryJapanese-cloudflare
npm run dev
```

Mở http://127.0.0.1:8787/learning?moduleId=6 để xem Unit 2 hoặc
http://127.0.0.1:8787/learning?moduleId=19 để xem Unit 12; chọn phần Quiz.
Không dùng preview-cf5.mjs để xác nhận database chính: script preview tạo database
thử riêng và chế độ CF5 lịch sử có thể dùng snapshot cũ.

Database mới: migrate rồi chạy `npm run db:import:local`, công cụ nạp candidate
đã kiểm tra checksum. Database cũ: `npm run db:review:check`, rồi
`npm run db:review:apply`; không reset hoặc import đè nội dung khác.

## Giới hạn còn lại

- Chỉ bản Cloudflare ở ổ D đã được cập nhật. PostgreSQL/bản cũ ở ổ C không đổi.
- 120 section vẫn DRAFT. Nội dung nghe/đọc/bài tập đã cập nhật trong database nhưng
  chỉ hiển thị khi được duyệt xuất bản; Quiz public đã nhận các sửa đổi mới.
- Các bài tập mơ hồ và phiên âm khác trong audit chưa được xử lý ở lượt này.
- Chưa deploy remote, chưa tạo database production. Khi thực hiện CF6 phải nạp
  đúng candidate và xác minh remote; chỉ deploy code không cập nhật dữ liệu D1.
- Health vẫn 503 ready:false theo trạng thái migration hiện tại.

Dừng sau bước áp dụng local để người dùng kiểm tra. Không kết luận toàn bộ N5 đã
sẵn sàng production từ kết quả kiểm tra này.
