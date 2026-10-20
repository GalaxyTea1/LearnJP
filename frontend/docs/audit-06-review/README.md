# Mục 6 — Bảo vệ bản nháp ở API

Ngày 11/10/2026. Chỉ xử lý mục 6 của audit; không tự phát hành nội dung, ẩn mock test hoặc đổi trạng thái N4.

## Quy tắc

Module phải PUBLISHED để xuất hiện trong API học viên. Section và conversation/listening/reading/writing/exercise phải PUBLISHED, cùng với cha của chúng. ConversationLine kế thừa conversation; từ vựng/kanji/ngữ pháp và Quiz kế thừa module vì chưa có trạng thái riêng. Bản ghi không gắn module mặc định không công khai.

`?preview=true` trên các API GET nội dung yêu cầu ADMIN hoặc MODERATOR đang hoạt động, được xác thực bằng token. Guest/USER nhận 403. Chế độ mặc định luôn là public, kể cả admin. Preview full module không tự khởi tạo tiến độ. Frontend adminApi dùng tham số preview cho danh sách/module/full/quiz. API trả Cache-Control no-store và Vary Authorization.

Áp dụng bộ lọc cho module, level, vocabulary, kanji (gồm tìm theo ký tự), grammar, Quiz GET/submit, progress summary/review/update và flashcard due/review. Lịch sử tiến độ nháp được giữ trong DB nhưng không tính vào tổng module công khai.

## Bằng chứng

- Backend build và 20/20 tests PASS.
- Frontend TypeScript noEmit PASS.
- `node scripts/publication-smoke.cjs` trong backend: PASS trên PostgreSQL local, dùng schema publication_smoke ngẫu nhiên, migrate, tạo fixture và dọn chính schema đó.
- Smoke kiểm tra module PUBLISHED/DRAFT/ARCHIVED, section và bài con nháp, exercise đã publish gắn reading nháp; guest/USER bị chặn, ADMIN/MODERATOR preview được; inactive admin bị chặn; không ghi quiz attempt cho module nháp; số liệu progress chỉ tính module public.
- Kiểm đếm read-only DB hiện tại: 14 module PUBLISHED, 140 section DRAFT, không có vocab/kanji/grammar chưa gắn module. Không thay đổi dữ liệu thật.

## Bạn kiểm tra

1. Sau khi backend mới chạy, mở N5 bằng tài khoản học viên: từ vựng/kanji/ngữ pháp/Quiz của module public vẫn truy cập được. Các section còn DRAFT sẽ không xuất hiện.
2. Vào giao diện admin: vẫn xem được nội dung nháp qua preview. Guest hoặc học viên thêm preview=true trực tiếp phải bị 403.
3. Nội dung nháp chỉ được phát hành sau khi kiểm duyệt. Khi phát hành, cần xét cả module, section và từng nội dung con; chỉ publish module chưa đủ.

Không coi việc sửa bộ lọc là đã sẵn sàng mở beta: cần quyết định/kiểm duyệt và phát hành dữ liệu N5 trước. Chưa deploy production. Các mục 3/4 còn thiếu, 7, 9, 11, 12 và các kiểm thử môi trường thật vẫn được theo dõi riêng.
