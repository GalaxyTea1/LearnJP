# P3 — Khôi phục phiên học

Hoàn thành ngày 2026-10-11. Phạm vi P3 trong lượt này là phiên Quiz và vị trí phần học, trên PC và responsive web.

## Thay đổi

- Tự lưu đáp án, câu đang xem, thời gian và kết quả Quiz trong trình duyệt; khôi phục khi đổi phần học hoặc tải lại.
- Lưu phần học đang mở theo module/tài khoản. Đăng nhập ngay trong Quiz giữ bài khách đang làm; bản nháp khách chỉ chuyển một lần.
- Tách dữ liệu theo tài khoản và module. Nội dung hoặc thứ tự câu hỏi/lựa chọn thay đổi sẽ vô hiệu hóa bản cũ.
- Kết quả được khôi phục chỉ để xem lại, không gọi lại API nộp bài hoặc callback hoàn thành. Hoàn thành Unit vẫn do server xác nhận.
- Đồng hồ tạm dừng khi rời Quiz hoặc trang bị ẩn; không chạy ở màn hình kết quả.
- Bỏ bài/làm lại cần xác nhận trong giao diện. Hủy xác nhận giữ nguyên bài.
- Nếu storage lỗi, giữ bản nháp trong bộ nhớ khi đổi phần học, hiển thị cảnh báo và yêu cầu trình duyệt cảnh báo trước khi đóng/tải lại nếu còn bài chưa nộp.

## Kiểm tra

- TypeScript noEmit: PASS.
- 22/22 tests: auth-client, study-answers, quiz-session.
- Production build: PASS với VITE_API_URL=https://api.example.test (cấu hình kiểm tra, không deploy).
- N5 Unit 01 thật: chọn hai câu, sang Ngữ pháp rồi quay lại, F5 vẫn ở Quiz/câu 2 và giữ lựa chọn.
- Fixture dùng component thật với API/tài khoản giả: chuyển guest → A giữ đáp án; A → B không lẫn; quay A khôi phục; logout rồi B không nhận bản nháp khách đã chuyển cho A.
- Fixture: kết quả đạt phục hồi sau remount, callback hoàn thành vẫn chỉ chạy một lần; sửa câu hỏi xóa bản cũ có thông báo; storage lỗi vẫn giữ lựa chọn sau remount; hủy bắt đầu lại giữ đáp án.
- Fixture có thể chạy bằng `node scripts/quiz-session-preview.mjs` tại localhost:5177; không ghi tài khoản hoặc kết quả vào database.

## Bạn kiểm tra

1. Vào Quiz, chọn 2–3 câu rồi sang Ngữ pháp và quay lại.
2. F5: kiểm tra đáp án, câu đang xem, đồng hồ và phần Quiz được khôi phục.
3. Chọn bỏ bài rồi “Giữ bài hiện tại”; sau đó thử xác nhận bắt đầu lại.
4. Đăng nhập và thử với hai tài khoản khác nhau.

Bản nháp hiện chỉ phục hồi trên cùng trình duyệt, chưa đồng bộ giữa thiết bị. Chưa hỗ trợ đồng bộ chỉnh sửa đồng thời cùng một Quiz ở nhiều tab trình duyệt. Kiểm thử nộp bài bằng tài khoản thật trên production chưa thực hiện. Audio và đồng bộ tiến độ chi tiết server là các phần riêng, chưa xử lý trong P3 này.
