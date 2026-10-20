# P2 — Bài tập, Quiz và hoàn thành Unit

Ngày kiểm tra: 2026-10-11. Phạm vi: PC và responsive mobile web.

## Đã sửa

- Đáp án bài tập kiểu chỉ số được đổi thành nội dung lựa chọn, kể cả chỉ số 0. Có thông báo khi thiếu hoặc sai định dạng đáp án.
- Câu hỏi thuộc bài đọc chỉ xuất hiện trong bài đọc, không lặp ở bài tập vận dụng.
- Server trả chi tiết chấm điểm cho tất cả câu, kể cả câu bỏ trống; kiểm tra lựa chọn ngoài phạm vi và ngưỡng đạt chính xác 70%.
- Không trả giải thích Quiz trong API nội dung bài học trước khi nộp.
- Quiz khóa lựa chọn khi đang nộp, chặn nộp kép trong component, giữ lựa chọn khi lỗi mạng, và bỏ qua kết quả trả về sau khi đổi tài khoản/rời tab.
- Hoàn thành Unit dựa trên kết quả Quiz và trạng thái server. Nút cuối bài không còn tự hoàn thành hoặc gửi tiến độ 100%.
- Rời bài về lộ trình sẽ tải lại tiến độ. Callback hoàn thành từ vựng không còn chạy bên trong state updater.
- Bố cục đáp án dùng flex, có một cột trên điện thoại và hai cột trên PC.

## Kiểm tra đã chạy

- Frontend: typecheck thành công; 17/17 tests (14 auth-client + 3 study-answers).
- Backend: 20/20 tests; sau điều chỉnh hiển thị phần trăm, chạy lại 7/7 quiz tests và TypeScript build thành công.
- Frontend production build thành công với VITE_API_URL=https://api.example.test (chỉ là giá trị kiểm tra cấu hình, chưa deploy).
- Trình duyệt với API local và dữ liệu N5 Unit 01 thật: đáp án đầu tiên hiển thị “Chào buổi sáng”; phần đọc không lặp; chọn đáp án Quiz được; nút “Chưa đạt Quiz” bị khóa khi học thử.
- Kiểm tra chiều rộng 375, 390, 768, 1440px cho bài tập và Quiz: không tràn ngang toàn trang. Ảnh PC/mobile nằm cùng thư mục.
- Các trường hợp đạt/trượt, bỏ trống, làm lại, XP và đáp án không hợp lệ được kiểm tra ở service bằng database stub. Chưa xác nhận end-to-end nộp Quiz bằng tài khoản thật trong lượt này.

## Người dùng kiểm tra trước P3

1. Mở N5 Unit 01 → Bài tập & Đọc → xem đáp án câu đầu và một câu đọc hiểu.
2. Đăng nhập, làm một Quiz dưới 70%: có kết quả sai/bỏ trống, giải thích; Unit chưa hoàn thành.
3. Làm lại đạt từ 70%: Unit hoàn thành, quay về lộ trình thấy tiến độ mới; tải lại bài vẫn nhận trạng thái đã hoàn thành.
4. Làm lại Unit đã đạt: không nhận XP hoàn thành lần hai, lần trượt không xóa hoàn thành trước đó.
5. Thử trên PC và điện thoại. Khi API lỗi lúc nộp, đáp án đã chọn vẫn còn để thử lại.

P2 dừng tại đây để review. Lưu/khôi phục bản nháp khi chuyển tab hoặc tải lại chưa thuộc phạm vi đã xử lý; chưa triển khai production.
