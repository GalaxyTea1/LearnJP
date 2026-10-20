# Review mục 11 — Tiến độ chi tiết

## Kiểm tra lại sau phiên bị gián đoạn — 12/10/2026

Đã xác nhận mã và migration của lượt trước còn đầy đủ. Chạy lại frontend typecheck và 25/25 tests tiến độ/auth/quiz-session, backend build, Prisma migration status (database local up to date), cùng PostgreSQL publication/study-progress smoke đều đạt; schema thử đã dọn. Chưa xác minh E2E tài khoản trên hai trình duyệt/thiết bị thật hoặc production. Dừng ở mục 11 để người dùng review, chưa chuyển sang mục tiếp theo.

## Luồng cần kiểm tra

1. Đăng nhập, mở một bài N5, đánh dấu một vài từ và hoàn thành phần kanji/ngữ pháp. Chờ “Tiến độ đã đồng bộ với tài khoản”.
2. Mở lại bài hoặc dùng trình duyệt khác đăng nhập cùng tài khoản: các phần/từ đã lưu phải được phục hồi. Thử bỏ đánh dấu một từ và mở lại bài.
3. Dùng tài khoản khác: không thấy tiến độ tài khoản trước. Guest vẫn có bản lưu riêng trên trình duyệt.
4. Học thử rồi đăng nhập: không tự gộp; bấm nút nhập tiến độ học thử/bản lưu cũ nếu muốn gộp vào tài khoản hiện tại. Chỉ nhập bài đang mở, không nhập kết quả Quiz.
5. Mất mạng sau khi đã tải tiến độ: đánh dấu một từ, phải thấy lỗi đồng bộ; có mạng lại bấm Thử lại hoặc mở lại bài. Dữ liệu chờ gửi còn trong trình duyệt nếu localStorage hoạt động. Không xóa storage khi còn thay đổi chưa đồng bộ.
6. Khi tải tiến độ tài khoản bị lỗi, các nút đánh dấu phần/từ bị khóa để tránh ghi đè trạng thái chưa biết; nút thử lại tải lại dữ liệu. Quiz vẫn giữ luồng riêng.
7. Hoàn thành Quiz rồi đánh dấu thêm phần: trạng thái hoàn thành và 100% server không bị hạ. Bỏ thuộc một từ không xóa dấu lịch sử đã học phần từ vựng.
8. Quay về lộ trình: các badge/tiến độ được đọc lại. Khi có nhiều thiết bị cùng sửa một từ, trạng thái của lần ghi đến server sau cùng có hiệu lực; các từ khác và phần đã hoàn thành được gộp.

## Kiểm thử đã thực hiện

- Backend `node --import tsx --test test/*.test.ts`: 25/25.
- Frontend `node --test scripts/study-progress.test.mjs scripts/quiz-session.test.mjs scripts/auth-client.test.mjs`: 25/25.
- `node scripts/publication-smoke.cjs`: migration trên schema riêng; auth/publication regression; tiến độ chi tiết lưu/đọc lại, PATCH đồng thời, bỏ thuộc, request lặp, cách ly tài khoản, chặn từ sai module và bản nháp; bảo toàn Quiz COMPLETED. Schema tạm đã dọn.
- Backend build, frontend typecheck và production build với origin HTTPS mẫu.
- Trình duyệt local: guest đánh dấu một từ, tải lại, lọc đúng 1 từ đã thuộc. Ảnh dưới là guest, không phải bằng chứng E2E tài khoản trên hai máy.

## Triển khai

Backend: chạy `prisma migrate deploy`, `prisma generate`, build và restart backend; triển khai frontend cùng phiên bản. Migration mới chỉ thêm hai cột có giá trị rỗng mặc định, không xóa dữ liệu hiện có. Đã áp dụng local; chưa chạy production.

Server cũ không có thông tin chi tiết để khôi phục các phần/từ chỉ từng nằm ở localStorage. Dữ liệu đó có thể nhập từ máy còn bản lưu, không tự suy diễn từ phần trăm tổng. Bản nháp đáp án Quiz và vị trí tab vẫn là chức năng local của mục 10; lượt này không chuyển chúng lên server.

![Guest phục hồi từ đã thuộc sau reload](./guest-restored.png)
