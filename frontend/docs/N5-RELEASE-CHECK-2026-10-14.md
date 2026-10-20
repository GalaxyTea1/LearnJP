# Kiểm tra trước production N5 — 14/10/2026

## Kết luận

Chưa chốt GO cho public production. Luồng chính và kiểm thử local đạt, nhưng còn một lỗi khởi tạo khi storage bị chặn và chưa có cấu hình/kiểm chứng môi trường Cloudflare đích. Không phát hiện hồi quy trong các ca đã chạy; kết quả này không chứng minh website không còn lỗi. Lượt này chỉ kiểm tra, không sửa logic, không deploy, không thay dữ liệu N4.

## Các việc còn lại theo ưu tiên

1. **Điều kiện phát hành — chốt nơi chạy API/PostgreSQL và domain.** User chọn Cloudflare, ưu tiên chi phí thấp. Repo hiện là Vite static frontend và Node Express/Prisma PostgreSQL backend; chưa có Wrangler/Worker entrypoint. `vercel.json` không phải cấu hình Cloudflare. Cần cấu hình SPA fallback theo dịch vụ Cloudflare được chọn, HTTPS frontend/API, exact FRONTEND_URL, VITE_API_URL, cookie SameSite và proxy phù hợp. Chưa có domain để kiểm chứng DNS/TLS/CORS/cookie thật.
2. **P2 — localStorage bị chặn có thể làm trang trắng ngay khi khởi tạo.** `src/app/services/api.ts:28` gọi localStorage.getItem ở top level không try/catch. Khi quyền đọc storage ném SecurityError, import App thất bại trước createRoot/ErrorBoundary trong `src/main.tsx`. Tái hiện bằng transform api.ts thật rồi import với Storage giả ném SecurityError; nhận lỗi ở bước import. AuthProvider effect cũng đọc storage trực tiếp. Cần cho học guest trong bộ nhớ hoặc ít nhất hiển thị thông báo có thể phục hồi; kiểm tra cả đọc/ghi storage và luồng auth. Chưa sửa trong lượt audit này. Không suy diễn mọi chế độ ẩn danh đều gặp lỗi.
3. **Điều kiện phát hành — smoke trên môi trường HTTPS đích.** Migrate toàn bộ 6 migration, generate/build backend, publish frontend/backend tương thích, build lại origin thật. Kiểm tra đăng ký/đăng nhập, refresh/logout, tiến độ sau reload, nộp lại quiz khi mất response và deep link /learning?moduleId=7 trên PC/mobile. PostgreSQL đích cần bản sao lưu và quy trình rollback. Dữ liệu production phải giữ các đề N5 mẫu chưa hoàn chỉnh ở DRAFT; local đã đúng nhưng chưa chứng minh production.

## Kết quả chạy lại

- Frontend: 64/64 tests, tsc --noEmit đạt, Vite production build đạt với origin kiểm thử https://api.example.test. Build thiếu VITE_API_URL bị chặn đúng như thiết kế. Không dùng dist kiểm thử để phát hành.
- Backend: 27/27 tests; TypeScript build đạt.
- auth-smoke: register, permissions, cookie/CSRF, refresh rotation/replay/race, logout, migration token và PostgreSQL rate limit đạt.
- publication-smoke: public/draft filtering, preview quyền hạn, sample mocks và study-progress merge/isolation đạt.
- quiz-retry-smoke: submit đồng thời cùng requestId, replay sau commit, một attempt/một XP award, khác payload, thiếu key và đổi revision đạt.
- Các smoke dùng schema PostgreSQL local riêng; đã dọn schema test. Migration status local: 6 migration, up to date.
- Đọc dữ liệu local: 12 bài N5 PUBLISHED, mỗi bài 45 vocab/8 kanji/5 grammar/15 quiz; tổng 540/96/60/180. Không có bài công khai ngoài N5 trong kết quả truy vấn. Không có quiz thiếu options/hay correctIndex ngoài phạm vi. Đây là kiểm tra cấu trúc, chưa phải đánh giá sư phạm/chất lượng từng câu.
- Browser thật với Vite + API local (guest): Home hiển thị đúng số liệu, mở module 7, chọn đáp án quiz, mở/đóng dialog đăng nhập tại chỗ, reload vẫn giữ đáp án và URL, menu mobile Roadmap thoát đúng về /learning. Viewport 390px: pageWidth=390 khi dialog mở. Không gửi đăng ký tài khoản thật qua UI. Các luồng auth có kiểm chứng HTTP/database riêng nêu trên.
- Không chạy kiểm thử tải, không xác minh email khôi phục tài khoản, không kiểm chứng hosting production hoặc mọi thiết bị/phiên bản trình duyệt.

Ảnh: [Dialog đăng nhập trên mobile local](./preproduction-2026-10-14/mobile-auth.png).

## Cloudflare và chi phí

Để giữ chi phí chuyển đổi thấp trong đợt beta, có thể đặt frontend tĩnh trên Cloudflare và giữ backend Node + PostgreSQL trên môi trường tương thích. Phí request static assets trên Workers là miễn phí/không giới hạn theo tài liệu hiện hành; điều này không bao gồm chi phí API, database hoặc domain.

Nếu muốn chạy API trên Workers, Cloudflare có hỗ trợ Express qua httpServerHandler, nhưng repo này chưa được chuyển đổi/kiểm chứng runtime và Prisma kết nối PostgreSQL. Không coi việc upload dist backend hiện tại là đủ. Chưa thể khẳng định tổng chi phí thấp nhất khi chưa biết nơi có thể đặt database/API, lưu lượng và yêu cầu uptime. Không tự đổi PostgreSQL sang D1 trong audit.

Nguồn chính thức, đọc 14/10/2026:
- https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- https://developers.cloudflare.com/workers/tutorials/deploy-an-express-app/
- https://developers.cloudflare.com/workers/platform/pricing/
