# Review mục 12 — Dữ liệu thực trên Home/Roadmap

Đã sửa local ngày 12/10/2026, chưa deploy production. Không thay đổi dữ liệu khóa N4.

## Kiểm tra thủ công

1. Mở Home khi chưa đăng nhập: không còn số học viên mẫu; có 12 bài, 540 mục từ vựng, 96 mục Hán tự, 60 mục ngữ pháp theo database local hiện tại.
2. Bấm Bắt đầu học N5: vào bài 1 (module 7). Quay lại lộ trình: tổng quan có cùng số liệu; 800/100/80 nằm trong mục tiêu tham khảo.
3. Chọn N4: hiển thị 0 bài công khai, không dùng số mục tiêu thay thế. Chọn Chương trình để xem trạng thái chưa có nội dung.
4. Với tài khoản có bài đang học: Home ưu tiên bài IN_PROGRESS; học xong tất cả thì hiện ôn lại. Đây là ca cần user review thêm; lượt này chỉ xác minh logic chọn bài bằng test.
5. Tắt mạng rồi mở lại Home/Roadmap: kiểm tra thông báo lỗi và Thử lại; không được hiện số mẫu. Nhánh mạng lỗi chưa giả lập trên browser trong lượt này.
6. Kiểm tra PC và điện thoại. Đã đo 375/390/768/1440px, không có tràn ngang toàn trang; dải cấp độ có cuộn ngang riêng.

## Kiểm chứng tự động

- `node --test scripts/course-summary.test.mjs`: 5/5.
- `node node_modules/typescript/bin/tsc --noEmit`: đạt.
- Vite production build với VITE_API_URL giả dùng riêng cho kiểm chứng: đạt. Không deploy artifact này; build lại với API origin thật khi phát hành.

Ảnh: [Home PC](./home-desktop.png), [Home mobile](./home-mobile.png), [Roadmap PC](./roadmap-desktop.png), [Roadmap mobile](./roadmap-mobile.png).

Giới hạn: chưa Việt hóa toàn bộ menu hoặc dữ liệu khóa học. Chưa kiểm tra E2E tài khoản thật/giả lập lỗi mạng ở lượt này. Dừng sau mục 12 để user review.
