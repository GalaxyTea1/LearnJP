# Review mục 9 — Hai đề N5 mẫu

Đã áp dụng trên PostgreSQL local ngày 12/10/2026. Dừng tại mục này để người dùng kiểm tra.

## Kiểm tra giao diện

1. Mở `/learning`, chọn N5 → Chương trình: có 12 bài, không có `JLPT N5 Mock Test 01/02`. Bài số 12 `Review and Mock Test` vẫn có.
2. Mở `/learning?moduleId=20` hoặc `moduleId=21`: hiển thị bài chưa mở/tạm ẩn và nút Quay lại lộ trình; không vào trang từ vựng rỗng.
3. Tab Đánh giá: `Bài kiểm tra N5 chưa mở` bị khóa ngay cả khi đánh dấu đủ 4 mục. Checklist là tự kiểm tra, không phải chứng nhận năng lực.
4. Admin vẫn xem được hai bản nháp. Nội dung và lịch sử làm bài được giữ lại.

## Triển khai database đích

Tại backend, với DATABASE_URL đúng môi trường:

```powershell
npm run content:hide-n5-sample-mocks
npm run content:hide-n5-sample-mocks -- --apply
```

Lệnh đầu chỉ đọc. Kiểm tra `matched` và `candidateIds` trước khi chạy lệnh thứ hai. Script dùng cấp độ N5, unit 13/14 và tên chính xác, không phụ thuộc ID local. Nếu đề đã bổ sung quá 2 quiz hoặc có vocab/kanji/grammar, script dừng toàn bộ để review; không tự ẩn bản nội dung mới. Nếu tên/unit khác, không tự sửa; cần đối chiếu riêng. Chạy lại khi đã DRAFT không thay đổi gì.

Log trạng thái trước khi áp dụng local nằm tại backend `docs/audit-09-review/local-withdrawal.json`. Chỉ chứa metadata của hai module. Muốn mở lại, hoàn thiện và kiểm duyệt nội dung rồi publish bằng luồng quản trị; không tự khôi phục trạng thái PUBLISHED của hai đề mẫu.

## Kiểm thử đã chạy

- `node scripts/publication-smoke.cjs`: bao gồm regression publication và kiểm thử mục 9 trên schema PostgreSQL riêng; dữ liệu thử đã dọn.
- Frontend `tsc --noEmit` và Vite production build với origin mẫu HTTPS.
- HTTP local: danh sách/cấp độ N5 trả 12 module; hai URL full trả 404.
- Trình duyệt: danh sách 12 bài, thông báo link cũ, quay lại lộ trình, kiểm tra nút khóa sau khi tick đủ checklist.

Chưa deploy production; chưa xây đề thi đầy đủ. Các mục còn lại trong audit giữ trạng thái riêng, không tính lượt này là hoàn tất toàn bộ N5.

![Đường dẫn bài đã ẩn](./hidden-module.png)

![Đánh giá N5](./assessment.png)
