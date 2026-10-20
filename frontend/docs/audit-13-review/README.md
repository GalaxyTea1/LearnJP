# Review mục 13 — Nội dung và tiến độ độc lập

Đã sửa local ngày 12/10/2026, chưa deploy production.

## Các ca review

1. Guest mở Home/Roadmap: nội dung N5 vẫn có 12 bài, 540 mục từ vựng, 96 Hán tự, 60 ngữ pháp theo database local hiện tại. Không gọi progress/me.
2. Tài khoản đang xác thực: catalog tải độc lập; tiến độ có trạng thái đang tải.
3. Nếu progress/me lỗi: nội dung và số lượng vẫn hiện, có Thử lại tiến độ; không gán các bài là chưa học. Danh sách cho Mở bài học.
4. Nếu modules lỗi: báo lỗi nội dung, có Thử lại; không dùng mục tiêu mẫu hay hiện 0 như dữ liệu đã tải.
5. Thử lại sau khi kết nối phục hồi; đổi tài khoản khi đang tải không được hiện tiến độ tài khoản cũ.

## Bằng chứng

- 25/25 tests: `node --test scripts/auth-client.test.mjs scripts/course-summary.test.mjs`.
- `tsc --noEmit` và Vite production build đạt.
- Browser guest: Home tải được số liệu thật.
- Ca lỗi/đổi phiên được kiểm thử bằng response giả ở tầng API và hàm merge. Chưa kiểm tra E2E tài khoản thật hoặc offline browser; các bước 2–5 cần review thêm trên trình duyệt.
- Build kiểm chứng dùng API origin giả; cần build lại với origin thật khi phát hành.

Dừng tại mục 13 để user kiểm tra. Không đồng nghĩa toàn bộ website đã đủ điều kiện production.
