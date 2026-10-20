# CF4 — quản trị, chỉnh nội dung và preview

Ngày: 16/10/2026. Workspace: `D:\SumaryJapanese-cloudflare`.

**Hoàn thành nhóm quản trị của CF4 ở local.** Cùng với nhóm học viên đã kiểm tra
trước đó, CF4 đã đạt phạm vi chuyển API dự kiến. Chưa đủ điều kiện production:
CF5 và CF6 vẫn còn. Không deploy remote, không sửa source ổ C/PostgreSQL.

## Phạm vi đã chuyển

| API | Hành vi |
|---|---|
| GET `/admin/dashboard`, `/admin/users`, `/admin/logs`, `/admin/settings` | ADMIN/MODERATOR; phân trang users/logs; không trả password/session |
| PUT `/admin/users/:id/status` | Chỉ ADMIN; kiểm tra role/isActive; bảo vệ admin hoạt động cuối cùng |
| PUT `/admin/settings` | Chỉ ADMIN; whitelist key/value/description, upsert |
| POST/PUT `/levels` | Tạo/cập nhật metadata; không đổi mã JLPT của level đã có |
| POST/PUT/DELETE `/modules` | Tạo nháp; cập nhật có version; bảo vệ lịch sử học khi xóa |
| POST/PUT/DELETE `/vocabulary`, `/kanji`, `/grammar` | Validation, FK, chỉ mục tìm kiếm Unicode và ví dụ ngữ pháp được cập nhật cùng giao dịch |
| POST `/vocabulary/bulk` | 1–10 items/request; toàn bộ cùng thành công hoặc rollback; client cần chia lô lớn |
| POST `/quizzes`, DELETE `/quizzes/:id` | Kiểm tra options/correctIndex/points; kích hoạt revision hiện có để chặn nộp đề cũ |
| GET `/announcements/all`, POST/PUT/DELETE `/announcements` | Quyền quản trị, tác giả lấy từ phiên, ngày hết hạn chuẩn hóa UTC |
| GET nội dung với `preview=true` | ADMIN/MODERATOR xem nháp/N4, sections và đáp án quiz; API học viên vẫn chỉ thấy N5 đã xuất bản |

Preview áp dụng cho levels, modules/full, vocabulary, kanji, grammar và quizzes/module.
Không thêm công cụ biên soạn nested sections hay test-template CRUD vốn không có
trong nhóm route quản trị cũ. Việc rà tính năng/endpoint còn thiếu trên UI thuộc CF5.

## Bảo vệ dữ liệu và phân quyền

- Mọi write kiểm tra role hiện tại trong cùng D1 batch với thay đổi và activity log.
  Tài khoản bị hạ quyền giữa lúc đọc và commit sẽ không ghi được.
- Moderator không thể nâng quyền tài khoản hoặc đổi site settings. Khi khóa tài khoản
  hoặc đổi role, refresh sessions bị thu hồi; bật lại tài khoản không khôi phục token cũ.
- Không thể vô hiệu hóa/hạ quyền admin hoạt động cuối cùng, kể cả hai request đồng thời.
- Giới hạn JSON 128 KiB, kiểm tra Origin/header SumaryJP, từ chối trường không cho phép.
- Bản ghi đang sửa có điều kiện so sánh snapshot ở commit; module PUT bắt buộc
  `version` từ preview và tăng version sau thay đổi. Sửa child content cũng tăng
  version module. Conflict trả 409, cần tải lại trước khi lưu.
- Khi chỉ thay ví dụ ngữ pháp, snapshot các ví dụ cũng được kiểm tra: parent không
  đổi vẫn phát hiện được hai request cùng thay danh sách ví dụ.
- Thay nội dung, search index, grammar examples và log trong cùng batch.
  Log chỉ lưu tên trường thay đổi, không ghi password, setting value hay toàn bộ payload.
- Module có module-progress/quiz-attempt không được xóa; nên chuyển ARCHIVED.
  Vocab/kanji/grammar có SRS không được xóa; từ vựng đã đánh dấu thuộc cũng được bảo vệ.
- Không thêm migration: tiếp tục dùng 4 migration CF1–CF4 hiện có.

Tính nguyên tử dùng [D1 batch transactions](https://developers.cloudflare.com/d1/worker-api/d1-database/)
và đã kiểm chứng bằng lỗi cố ý trong D1 local. ID bản ghi mới dùng sequence của
bảng AUTOINCREMENT ngay trong batch, trước lần insert kế tiếp vào bảng đó.

## Xuất bản

Điều kiện tối thiểu được kiểm tra ở API và kiểm tra lại khi commit:
10 sections PUBLISHED, 45 vocabulary, 8 kanji, 5 grammar, 15 quiz;
listening đã xuất bản không có audio rỗng hoặc `PENDING_AUDIO`.
Thiếu điều kiện trả 422 với thông báo cụ thể; client không được tự đặt publishedAt.

AdminPage gửi version lấy từ preview, bỏ Force Publish và dùng cùng điều kiện
sections/audio với server. Lần này không thay CSS/layout.
Đây là kiểm tra cấu trúc tối thiểu; chưa chứng minh chất lượng nội dung hoặc URL audio
phát được. Kiểm tra media và hành trình PC/mobile vẫn thuộc CF5.

## Kết quả kiểm tra

| Kiểm tra | Kết quả |
|---|---|
| Admin logic với D1 biệt lập | 14/14 |
| Admin HTTP workerd thật | 1/1 |
| Toàn bộ root regression, gồm auth/content/learning/routing/schema/build config | **74/74** |
| Frontend regression | **64/64** |
| Worker TypeScript + frontend TypeScript | Đạt |
| Frontend Cloudflare build | Đạt |
| Wrangler bundle dry-run | Đạt, không upload |
| Đối chiếu 18 bảng nội dung N5 chính | Khớp snapshot, 0 FK lỗi, 0 user thử nghiệm |

Có kiểm tra guest/user bị chặn preview, admin dùng URL thường vẫn không nhận đáp án,
N4/nháp không public; moderator tự nâng quyền; demotion trước commit; tranh chấp
admin cuối cùng; thu hồi session; version cũ; invalid bulk; rollback khi insert log/
grammar example lỗi; Unicode search; publication đổi giữa validation và commit.
Đã chạy bổ sung case audio rỗng/placeholder, đạt.

Dữ liệu chính không bị chỉnh trong test; checksum nội dung giữ nguyên:
`f6179bfab8b0180c4e1a98fa6aab4fe944454593319f3ecf6c491a9c54b7788f`.
HTTP test dùng `.local/cf4-admin-http-*`; không dùng các database tạm này làm nguồn deploy.
Các server kiểm thử đã dừng. Chưa kiểm tra tải hoặc CPU/quota trên Cloudflare remote.

## Cách kiểm tra lại

Tại root: `npm run test:admin` chạy độc lập trên database biệt lập, không cần mở server.
Toàn bộ regression root cần `npm run dev` tại 127.0.0.1:8787;
chạy `node --test --test-concurrency=2 scripts/*.test.mjs` ở terminal thứ hai.

Để thử UI: `npm run build`, `npm run dev`, đăng ký tài khoản local của bạn rồi gán
ADMIN cho đúng tài khoản trong D1 local (không có tài khoản admin mặc định).
Ví dụ thay email mẫu bằng email local vừa đăng ký:

```powershell
npx wrangler d1 execute DB --local --config wrangler.local.jsonc --command "UPDATE users SET role='ADMIN' WHERE email='your-local-email@example.com' AND is_active=1"
```

Đăng xuất/đăng nhập lại, vào `/admin`:
1. Xem cả bài nháp và public, kiểm tra full preview và đáp án quiz.
2. Đổi một bài nháp sang IN_REVIEW; reload kiểm tra trạng thái/version.
3. Thử PUBLISH bài thiếu nội dung: phải bị từ chối.
4. Mở hai tab cùng bài; lưu tab thứ nhất, lưu tab cũ phải báo conflict.
5. Dùng guest kiểm tra bài nháp vẫn không truy cập được.

Dừng ở đây để người dùng kiểm tra. Tiếp theo **CF5: storage, API/UI và trải nghiệm PC/mobile**.
CF6 vẫn cần staging HTTPS, domain/secrets/D1 remote, CPU/chi phí, backup/restore,
giám sát và rollback. Health tiếp tục trả 503 `ready:false` cho đến khi đủ release gate.
