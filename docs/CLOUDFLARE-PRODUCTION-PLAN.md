# Kế hoạch Cloudflare production — 14/10/2026

Phạm vi: bản sao `D:/SumaryJapanese-cloudflare`, web PC và responsive điện thoại,
N5 beta trước. Làm từng phần và dừng để người dùng kiểm tra.

## Kiến trúc

Người dùng đã chọn **Cloudflare D1**. Đích triển khai: một Worker phục vụ static
frontend và `/api/v1` cùng origin; D1 chứa dữ liệu; R2 bổ sung khi có media cần lưu.
Cloudflare hiện khuyến nghị Workers cho dự án mới. Giữ contract API cũ để tái sử dụng FE.

## Phát hiện từ code

- **35 Prisma models** (comment cũ ghi 26); **6 interactive transactions** trong
  auth (2), studyProgress, quiz, flashcard và test.
- Prisma client đang dùng PostgreSQL. Node entrypoint có listen/process handlers;
  config đọc dotenv và process.exit. Không import server cũ vào Worker rồi coi là đã chuyển.
- completedTabs và masteredVocabularyIds là scalar arrays; nên chuyển thành bảng
  liên kết có unique key để merge/remove nguyên tử. Quan hệ `Model[]` không phải scalar array.
- Chuyển UUID, Date, Timestamptz, enum/JSON sang biểu diễn SQLite nhất quán;
  giữ định dạng ngày UTC và JSON trong response. Migration PostgreSQL không chạy trên D1.
- studyProgress dùng pg_advisory_xact_lock; quiz/flashcard/test dùng Serializable;
  auth cần đăng ký và refresh token nguyên tử.
- databaseRateLimit dùng clock_timestamp/interval; progress dùng cast `::int`.
  Cần chuyển SQL và giữ đúng phép làm tròn, thời điểm reset.
- bcryptjs cost 10 cần đo CPU trên Workers. Không giảm độ mạnh hash để vừa free tier.
- FE build cũ bắt buộc API origin riêng; cần chế độ cùng origin tường minh.
- Lỗi localStorage SecurityError ở bản sao ban đầu có thể làm import api.ts thất
  bại trước ErrorBoundary. Đã xử lý và thêm regression test trong CF5.

## Thứ tự và tiêu chí hoàn thành

| Phần | Ưu tiên | Công việc | Điều kiện hoàn thành |
|---|---|---|---|
| CF1 | P0 | Workers, static assets, D1 local, build cùng origin | Typecheck/build, bundle dry-run, HTTP local: D1 kết nối, SPA deep link, API JSON |
| CF2 | P0 | Schema/migration D1, import N5 và API đọc | FK/unique/index, ID/ngày/JSON đúng, so sánh dữ liệu nguồn, không lộ draft/N4 |
| CF3 | P0 | Auth/session/quyền/rate limit D1 | Cookie/CSRF, đăng ký/login, refresh race/replay/logout, role checks, đo CPU |
| CF4 | P0 | Progress/quiz/XP/SRS/test và API ghi còn lại | Không mất tiến trình, không cộng điểm lặp, stale revision bị chặn, rollback khi lỗi |
| CF5 | P1 | Hoàn thiện FE, sửa storage, rà soát API đang gọi | Guest/auth PC-mobile, reload/back/offline/retry; đủ endpoint hoặc ẩn tính năng có chủ đích |
| CF6 | P0 trước phát hành | Staging HTTPS rồi production | Secrets/domain/DB riêng, backup-restore, smoke thật, theo dõi quota/lỗi và rollback |

P0 nghĩa là chặn phát hành. R2 và tối ưu bundle thực hiện theo nhu cầu media và kết quả đo.

### CF2: dữ liệu

Giữ schema/migration PostgreSQL để đối chiếu; tạo migration SQLite riêng.
Import theo khóa ngoại, giữ ID để URL và quan hệ bài học không đổi. Kiểm tra
foreign_key_check, unique, options/correctIndex, null/JSON null; xuất manifest số bản ghi
và checksum nội dung. Không mặc định seed cũ là dữ liệu local mới nhất.
Xác định rõ production nhận nội dung hay cả tài khoản/tiến trình; không mang user thử nghiệm
lên prod. Script cần validate/dry-run, không reset database. N4/draft không public.

### CF3–CF4: đồng thời

D1 batch có rollback toàn bộ khi statement lỗi. Không thay interactive transaction
bằng chuỗi await độc lập. Dùng conditional SQL, constraint và batch; kiểm chứng các
điều kiện tranh chấp trong database. Chỉ chọn ORM/adapter sau khi chứng minh các thao tác
ghi cần thiết chạy đúng; không mặc định Prisma transaction hiện tại giữ nguyên với D1.

- Refresh token cũ chỉ tiêu thụ một lần; giữ contract revoke/replay.
- Quiz unique user/requestId + fingerprint + saved response; attempt, XP và completion
  phải cùng thành công hoặc rollback. Cùng key khác payload phải conflict.
- Revision quiz phải gắn với thao tác ghi để tránh thay đề giữa đọc và commit.
- Tiến trình merge theo operation, tránh đọc rồi ghi đè snapshot cũ.
- SRS/test chống double-submit; rate limit dùng primitive chia sẻ, không dùng global counter.
- Giữ chấm điểm, phân quyền và publication filter ở server.

### CF6: remote và chi phí

Cần tài khoản Cloudflare, domain/hostname staging, binding ID và secrets khi làm remote.
Không đưa secret/token vào Git hoặc VITE_*. Dùng D1 staging/prod riêng, kiểm tra cookie
HttpOnly/Secure/SameSite và Origin/CSRF qua HTTPS thật. Localhost không chứng minh cấu hình prod.
Migration tiến về trước; có export/backup và diễn tập restore. Rollback Worker không tự
rollback schema/data; giữ tương thích schema giữa phiên bản trong thời gian đổi bản.
Theo tài liệu hiện hành, Workers Free có CPU 10 ms/request: bcryptjs là điểm cần đo.
Không hứa miễn phí toàn bộ, không tự nâng gói; đo CPU, số dòng đọc/ghi, dung lượng rồi chọn ngân sách.

## Trạng thái

CF1–CF5 đã có code và đạt kiểm tra local (cập nhật 17/10/2026).
**CF5 đã hoàn thành phạm vi sửa code/local:** storage, API tìm kiếm, luồng học
guest/auth, mất kết nối/thử lại và bố cục mobile. Translate tạm ẩn trong beta.
Chưa sẵn sàng production: nội dung N5 chưa xuất bản đầy đủ và CF6 chưa chạy.
D1 có 4 migration, 1.803 bản ghi nội dung N5
và 696 dòng chỉ mục tìm kiếm. API đọc N5 và auth/session đã hoạt động;
API ghi học viên (progress/quiz/XP/SRS/test, check-in, settings/kana/game/history) đã chuyển.
API quản trị, chỉnh nội dung, thông báo và preview đã chuyển; phân quyền, rollback,
thu hồi session, version khi sửa và điều kiện xuất bản được kiểm tra ở server.
CF3 chưa chứng minh CPU/quota Workers production:
mẫu Node local cho hash + verify bcrypt cost 10 là 125–172 ms CPU tổng;
cần đo riêng request đăng ký/login trên staging ở CF6 trước khi chốt gói chi phí.
Health trả 503 với `ready:false`; API chưa chuyển trả 503 `API_MIGRATION_PENDING`.
Chưa được deploy cho học viên. Source tại ổ C và database PostgreSQL không bị sửa.
Chi tiết: [CF1](CF1-VERIFICATION.md), [CF2](CF2-VERIFICATION.md), [CF3](CF3-VERIFICATION.md).
Chi tiết phần mới: [CF4 — nghiệp vụ học viên](CF4-LEARNER-VERIFICATION.md).
Chi tiết mới: [CF4 — quản trị và preview](CF4-ADMIN-VERIFICATION.md).
Chi tiết mới: [CF5 — frontend và PC/mobile](CF5-VERIFICATION.md).
Kiểm tra hiện tại: 74/74 root test, 70/70 frontend, typecheck/build/dry-run đạt.
Nội dung N5 chính giữ nguyên checksum, 0 FK lỗi, không thêm user thử nghiệm.
Phát hiện CF5: 120/120 section bên trong 12 module PUBLISHED vẫn là DRAFT, cùng
24 hội thoại, 24 bài nghe, 24 bài đọc, 24 bài viết và 432 bài tập. Không tính các mục
này là public; API đang ẩn đúng quyền. Các bài nghe cũng chưa có bản thu âm.
Sau lượt rà 12 unit, tiếp theo kiểm tra trải nghiệm thực tế và danh sách xuất bản trước beta đầy đủ, sau đó
CF6 (staging HTTPS, cấu hình thật, CPU/quota, backup/restore).
Đã tiếp tục [gói sửa nội dung và TTS beta](N5-CONTENT-REVIEW.md): 424 thay đổi trên
385 dòng ở candidate, gồm 66 câu Quiz; đợt mới nhất rà Unit 12, sửa 21 dòng và 5 mục tìm kiếm.
Đã áp dụng database local chính. [Trạng thái mới và phần còn lại](N5-UNIT12-REVIEW-2026-10-19.md).
Chi tiết Quiz: [N5-QUIZ-REVIEW.md](N5-QUIZ-REVIEW.md). Người dùng chọn TTS cho beta.
Kết quả mới: 74 frontend test và 19 test D1 nội dung/admin; browser TTS cần kiểm tra lại.
Gói Quiz tiếp theo đạt 24/24 test (7 nội dung + 17 nghiệp vụ học viên); các số
frontend/admin ở dòng trên thuộc gói TTS trước, không phải lần chạy lại cùng lượt.
Dừng để kiểm tra gói nội dung trước khi xuất bản từng bài.
Biên bản mới: [áp dụng local](N5-LOCAL-CONTENT-APPLIED.md), 10/10 test D1 cập nhật/nội dung
và 15/15 HTTP trên database chính. Có backup, không thay đổi publication hoặc remote.

Cập nhật 18/10 — [bản nháp luyện viết](N5-WRITING-DRAFT-2026-10-18.md) đã sửa:
84/84 frontend test, typecheck và build Cloudflare đạt. Chưa kiểm thử browser thật
do công cụ bị tắt; có trang thử riêng port 5180. Không thay đổi D1/publication.
Đơn vị câu của hai bài viết Unit 2 đã được ghi rõ trong hướng dẫn và min/max đã khớp.
Unit 3: 16/16 D1 và 16/16 HTTP đạt; nội dung/chỉ mục cập nhật cùng batch, backup đã lưu.
Unit 4: 17/17 D1 và 17/17 HTTP đạt; đã áp dụng local với backup, chưa xuất bản.
Unit 5: 18/18 D1 và 18/18 HTTP đạt; đã áp dụng local với backup, chưa xuất bản.
Unit 6: 20/20 D1 và 19/19 HTTP đạt; đã áp dụng local với backup, chưa xuất bản.
Unit 7: 22/22 D1 và 20/20 HTTP đạt; đã áp dụng local với backup, chưa xuất bản.
Unit 8: 24/24 D1 và 21/21 HTTP đạt; đã áp dụng local với backup, chưa xuất bản.
Unit 9: 26/26 D1 và 22/22 HTTP đạt; đã áp dụng local với backup, chưa xuất bản.
Đã sửa transport local khi chuẩn bị batch lớn, giữ guard/rollback trong một transaction.
Unit 10 (19/10): 28/28 D1 và 23/23 HTTP đạt; đã áp dụng local với backup, chưa xuất bản.
Unit 11 (19/10): 30/30 D1 và 24/24 HTTP đạt; đã áp dụng local với backup, chưa xuất bản.
Unit 12 (19/10): 32/32 D1 và 25/25 HTTP đạt; đã áp dụng local với backup, chưa xuất bản.
Đã rà nội dung Unit 1–12. Tiếp theo: kiểm tra TTS/luồng học PC/mobile → duyệt
xuất bản từng bài → Cloudflare staging → CPU/chi phí, backup/restore/rollback.

## Tài liệu chính thức

- https://developers.cloudflare.com/pages/framework-guides/
- https://developers.cloudflare.com/workers/static-assets/routing/worker-script/
- https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/
- https://developers.cloudflare.com/d1/reference/migrations/
- https://developers.cloudflare.com/d1/worker-api/d1-database/
- https://www.prisma.io/docs/orm/v6/overview/databases/cloudflare-d1
- https://developers.cloudflare.com/workers/platform/limits/
