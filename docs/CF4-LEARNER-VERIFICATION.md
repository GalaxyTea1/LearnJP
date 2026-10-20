# CF4 — Nhóm nghiệp vụ học viên trên D1

Ngày kiểm tra: 15/10/2026. Bản làm việc: `D:/SumaryJapanese-cloudflare`.

## Trạng thái chính xác

**Nhóm học viên trong CF4 đã triển khai và đạt kiểm tra local ngày 15/10/2026.**
Cập nhật 16/10/2026: nhóm quản trị/chỉnh nội dung/preview cũng đã hoàn thành local;
CF4 đã đóng phạm vi chuyển API dự kiến. Xem [báo cáo quản trị](CF4-ADMIN-VERIFICATION.md).
Chưa bắt đầu CF5 và chưa đủ điều kiện production. Các số kiểm thử bên dưới là
kết quả của riêng lượt hoàn tất nhóm học viên; kết quả mới được ghi ở báo cáo quản trị.

Không thay source ổ C, database PostgreSQL hoặc tài nguyên Cloudflare remote.
Migration `0004_learning_writes.sql` đã áp dụng cho D1 local, không reset dữ liệu.

## Đã triển khai

| Nhóm | API/hành vi |
|---|---|
| Tiến trình | GET/PATCH `/progress/module/:id/study`, POST `/progress/module`, GET `/progress/me`, `/progress/review-items` |
| Quiz | POST `/quizzes/submit`: chấm ở server, revision, request ID, kết quả lưu để retry |
| SRS | `/flashcards/due`, `/flashcards/review`, `/flashcards/stats`; SM-2 và XP cho lượt đến hạn |
| Test | GET/POST `/tests/attempts`, POST `/tests/attempts/:id/submit`; phân quyền chủ attempt và retry kết quả |
| Tài khoản học tập | `/users/dashboard`, GET/PUT `/users/settings`, `/gamification/me`, `/gamification/checkin`, `/gamification/leaderboard` |
| Kana/game | GET/POST `/kana/progress`; `/games/score`, `/games/history`, `/games/leaderboard`; điểm game client gửi không cộng XP |
| Lịch sử | GET/DELETE `/history/search`, GET/POST/DELETE `/history/translation`, GET `/dictionary/history`; search local ghi lịch sử của tài khoản |

Giao diện không được sửa trong lượt này. Kiểm tra UI thật trên PC/mobile và rà các
endpoint mà từng màn hình dùng vẫn nằm ở CF5. Dataset N5 hiện **chưa có test template**;
test/SRS/quiz concurrency dùng fixture biệt lập, không thêm nội dung giả vào N5 chính.

## Quy tắc giữ dữ liệu nhất quán

- Các bảng liên kết lưu tab đã học và từng từ đã thuộc. PATCH chỉ thêm tab, thêm/xóa
  đúng từng từ; không lấy snapshot client đè toàn bộ tiến trình. Không nhận từ của bài khác.
- Tiến trình hoàn thành chỉ đến từ quiz đạt; PATCH hoặc POST progress không hạ trạng thái
  COMPLETED. Percent không giảm bởi request cũ; GET không tự tạo progress.
- Quiz dùng tất cả câu hỏi làm mẫu số; câu bỏ trống sai. Đạt khi số đúng thực tế >=70%,
  không dùng số hiển thị làm tròn để quyết định. 16/23 câu vẫn không đạt.
- Cùng user/requestId và payload trả cùng response/attemptId; payload khác trả 409.
  Nhiều request ID cùng đạt chỉ nhận XP hoàn thành module một lần.
- `xp_events` có khóa duy nhất; trigger cập nhật XP, tổng XP và XP trong ngày trong
  cùng giao dịch. Ngày dùng UTC; XP ngày cũ không cộng sang ngày mới.
- `mutation_guards` dùng CHECK để abort cả batch nếu điều kiện ghi không còn đúng;
  guard bị xóa trước commit. Không giữ lock ở biến global Worker.
- `assessment_revision` tăng bằng trigger khi đề thay đổi. Đọc đề + version trong
  một batch, kiểm tra lại version trong batch ghi. Nếu đề đổi giữa lúc chấm và commit,
  không lưu attempt/progress/XP. Counter chung hiện có thể trả 409 bảo thủ khi một đề
  khác vừa đổi; request chưa ghi gì và có thể tải lại/retry.
- SRS dùng version và ngày đến hạn. Các request đồng thời chỉ cập nhật SM-2 và cộng
  2 XP một lần; lượt chưa đến hạn trả trạng thái hiện tại, XP bằng 0.
- Test lưu snapshot đề riêng trong DB và kiểm tra đề hiện tại khớp trước khi chấm.
  Snapshot có đáp án không xuất ra API. Cùng attempt + cùng answers được replay;
  cùng attempt + answers khác trả 409. Start hỗ trợ requestId để chống tạo trùng khi retry.
- Test attempt tạo trước migration không có snapshot: yêu cầu bắt đầu attempt mới,
  không suy đoán đề cũ. Không có tài khoản/attempt cũ trong D1 chính khi kiểm tra.
- Check-in đồng thời chỉ tăng streak một lần trong ngày UTC. Số ngày liên tiếp lấy
  từ dữ liệu đã lưu; không cộng XP từ check-in.
- Summary/dashboard/SRS/review-items chỉ dùng bài N5 đã public. Trung bình tiến trình
  tính cả bài chưa học là 0 để không báo quá cao.
- Endpoint riêng yêu cầu auth; các mutation có kiểm tra Origin và header SumaryJP,
  JSON body giới hạn 128 KiB, validation và userId lấy từ phiên đã xác thực.

Tính nguyên tử dựa trên [D1 batch transactions](https://developers.cloudflare.com/d1/worker-api/d1-database/),
và đã kiểm chứng với lỗi chủ động trong SQLite/workerd local.

## Kết quả kiểm tra

| Nhóm | Kết quả |
|---|---|
| Learning logic với D1 biệt lập | 17/17 |
| Learning qua HTTP workerd thật | 1/1 |
| Auth logic + HTTP workerd | 17/17 |
| API đọc nội dung N5 | 15/15 |
| Routing, SPA, health | 5/5 |
| Schema, FK, rollback, publication | 1/1 |
| Cấu hình build sai bị từ chối | 3/3 |
| Tổng bộ kiểm tra root | **59/59** |
| Regression frontend | **64/64** |
| Typecheck Worker + frontend | Đạt |
| Build frontend Cloudflare | Đạt |
| Wrangler bundle dry-run | Đạt; không upload |

HTTP smoke thực thi: đăng ký → lưu tiến trình → nộp quiz đồng thời/retry → SRS
→ start/submit test/retry → tổng XP 252 (=100+2+150) → check-in → dashboard/history.

Lỗi chủ động: ghi mastered vocabulary, trigger XP khi quiz/test/SRS. Kết quả:
không có attempt/answer/progress/ledger bị commit dở. Có kiểm tra đổi đề ngay giữa
read và commit, đổi publication, user khác truy cập attempt, thay answers khi retry,
đề sai đáp án/điểm và mass assignment settings.

Đối chiếu D1 chính sau migration: 18 bảng nội dung khớp snapshot, 0 FK lỗi,
0 user test; checksum nội dung vẫn
`f6179bfab8b0180c4e1a98fa6aab4fe944454593319f3ecf6c491a9c54b7788f`.
Các server kiểm tra đã dừng. D1 thử HTTP nằm trong `.local/cf4-http-*`; không dùng
cho deploy hoặc làm dữ liệu nguồn. Không kiểm tra tải/CPU/quota Cloudflare remote.

## Kiểm tra thủ công phần học viên

Tại thư mục gốc:

```powershell
npm run db:migrate:local
npm run build
npm run dev
```

Mở `http://127.0.0.1:8787`:

1. Đăng ký tài khoản local, mở một bài N5, đánh dấu từ đã thuộc và hoàn thành vài tab.
2. Reload/mở lại bài: dữ liệu đã lưu phải được phục hồi cho đúng tài khoản.
3. Làm quiz đạt: bài hoàn thành, XP tăng; làm lại không nhận thêm XP hoàn thành.
4. Đăng xuất, dùng tài khoản khác: không thấy tiến trình của tài khoản trước.

`npm run test:learning` chạy độc lập, không cần server dev. Toàn bộ root test cần
server 8787: `node --test --test-concurrency=2 scripts/*.test.mjs`.
Frontend: từ `frontend`, `node --test scripts/*.test.mjs`.

## Còn lại theo thứ tự

1. **CF4 nhóm quản trị/API còn lại — đã hoàn thành local ngày 16/10/2026:** preview,
   chỉnh nội dung, user/admin/site settings, thông báo. Xem [báo cáo quản trị](CF4-ADMIN-VERIFICATION.md).
   Bảng 59/59 phía trên là kết quả tại thời điểm hoàn tất nhóm học viên; tổng hiện tại là 74/74.
2. **CF5:** lỗi storage, trải nghiệm PC/mobile, rà endpoint UI và luồng học end-to-end;
   tính năng chưa hỗ trợ cần xử lý rõ trên giao diện trước beta.
3. **CF6:** staging HTTPS, secrets/domain/D1 remote, CPU/quota/chi phí, backup/restore,
   giám sát và rollback. Health hiện vẫn trả 503 `ready:false` có chủ đích.

Dừng sau CF4 để người dùng kiểm tra trước CF5.
