# Review mục 7 — Từ điển production

Ngày kiểm tra: 12/10/2026. Chỉ sửa mục 7; chờ người dùng review trước mục tiếp theo.

## Kiểm tra thủ công

1. Mở `/dictionary`; nhập `taberu` hoặc `食べる`: kết quả có sẵn xuất hiện, mở được chi tiết.
2. Nhập `astronomy`: có trạng thái đang tìm. Nếu Jisho/backend lỗi, phải hiện thông báo và Try again, không hiện No results found.
3. Bấm Try again, sau đó đổi ngay về `taberu` hoặc xóa ô tìm kiếm: danh sách có sẵn trở lại, request cũ không ghi đè kết quả.
4. Kiểm tra PC và điện thoại: ô tìm kiếm, nút thử lại và danh sách không tràn ngang. Đã kiểm tra local ở 375/390/1440px; chưa kiểm tra trình duyệt trên thiết bị thật.
5. Trên hosting preview thật: từ ngoài danh sách local phải gọi origin backend đã cấu hình + `/api/v1/dictionary/jisho?q=...`, trả JSON. Kết quả rỗng chỉ được hiển thị khi API trả thành công với mảng rỗng.

## Bằng chứng và giới hạn

- Backend: `node --import tsx --test test/*.test.ts` (25/25).
- Frontend: `node --test scripts/dictionary-api.test.mjs scripts/auth-client.test.mjs` (16/16).
- Backend build, frontend typecheck và production build đạt. Origin mẫu `https://api.example.test` chỉ dùng kiểm tra build, không phải deployment.
- Kiểm thử HTTP thành công dùng Jisho giả lập; kiểm tra thật nhận upstream 403, backend 502. Cần kiểm tra lại từ hosting trước khi mở tính năng tra từ online cho beta.
- Không thay đổi dữ liệu N4/N5, không deploy.

![PC — lỗi có nút thử lại](./desktop-error.png)

![Điện thoại — lỗi có nút thử lại](./mobile-error.png)
