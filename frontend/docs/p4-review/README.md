# P4 — Hội thoại và nghe

Ngày 2026-10-11. Phạm vi: phát âm trong tab Hội thoại & Nghe, PC và responsive website.

## Đã sửa

- Bỏ vòng phát theo mốc 2,2 giây. Chờ sự kiện kết thúc câu trước khi đọc câu tiếp theo.
- Dừng/hủy chuỗi khi bấm dừng, chọn hội thoại khác, nghe câu riêng, bắt đầu file audio, rời phần học hoặc ẩn trang.
- Tô viền câu đang đọc; lỗi hoặc thiếu hỗ trợ giọng đọc được thông báo trên giao diện.
- Bài có audioUrl thật dùng audio controls của trình duyệt, hỗ trợ phát/tạm dừng/tua. Chỉ một nguồn âm thanh phát trong tab này.
- PENDING_AUDIO không được dùng làm URL media. Ghi rõ chưa có bản thu; giọng đọc tự động chỉ hiện khi có transcript.
- Dùng flex và nút nghe từng câu tối thiểu 44px.

## Kiểm tra

- TypeScript noEmit PASS.
- Bộ test auth/quiz/answer và 5 test audio ban đầu: 27/27 PASS. Bổ sung test render native audio, chạy lại bộ audio: 6/6 PASS.
- Production build PASS với API origin mẫu (không deploy).
- Unit test giả lập speech events: chờ onend, hủy khi dừng, callback muộn không tiếp tục, thay phiên phát nhanh, interruption/error, bỏ câu rỗng.
- Render test: chỉ URL thật có audio element; placeholder không tạo player; thiếu transcript không có nút TTS.
- Trình duyệt N5 Unit 01: Phát cả bài → Dừng phát; đổi hội thoại; chuyển Ngữ pháp rồi trở lại đều về trạng thái chưa phát.
- Chưa xác nhận chất lượng âm thanh bằng nghe trực tiếp, phát file audio thật, hoặc trình duyệt mobile thật. Unit đang kiểm tra chỉ có PENDING_AUDIO. Không thay đổi nội dung dữ liệu hay tạo bản thu mới.

## Bạn thử lại

1. N5 → Hội thoại & Nghe → Phát cả bài. Câu dài phải được đọc hết trước câu sau.
2. Bấm Dừng phát giữa câu, chờ vài giây: không tự đọc tiếp.
3. Đang phát, chọn hội thoại khác/nhấn loa một câu/sang Ngữ pháp: không còn chuỗi cũ.
4. Thử giọng đọc transcript rồi dừng. Khi bài có file thật, thử phát/tạm dừng/tua và chuyển sang TTS.
5. Thử các thao tác trên trình duyệt điện thoại và PC.

Dừng tại P4 để review. Những phần publication API, dữ liệu beta và đồng bộ tiến độ chi tiết vẫn cần xử lý riêng trước production.
