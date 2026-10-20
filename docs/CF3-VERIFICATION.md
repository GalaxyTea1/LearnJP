# CF3 — Auth, session, quyền và rate limit D1

Ngày kiểm tra: 15/10/2026. Phạm vi: `D:/SumaryJapanese-cloudflare`, local.

## Kết luận

Code auth và kiểm thử local đã hoàn thành. Chưa đủ điều kiện production:
CF4–CF6 còn lại, đặc biệt CPU auth trên Workers thực tế và cookie qua HTTPS.
Không deploy, không tạo tài nguyên Cloudflare, không thay source ổ C hay PostgreSQL.

## Thay đổi

- Chuyển register/login/refresh/logout/me sang Worker + D1. Giữ cấu trúc response
  mà frontend đang dùng; không đưa refresh token hoặc password hash vào JSON.
- JWT HS256 bằng `jose`, kiểm tra issuer/audience/type/expiry/iat/jti/sid.
  Access 15 phút, refresh 7 ngày; refresh chỉ qua cookie HttpOnly, path `/api/v1/auth`.
  Production yêu cầu HTTPS origin, key đủ dài, `__Secure-` cookie với Secure/SameSite=Lax.
  Không dùng các key `local-only-*` trong production.
- Giữ bcrypt cost 10 và giới hạn 72 byte UTF-8; validation server không nhận role
  từ form. Đăng ký tạo user/settings/gamification/session trong một D1 batch;
  lỗi bất kỳ statement nào rollback toàn bộ.
- Migration `0003_auth_sessions.sql` thêm mã phiên ổn định, unique index và index expiry.
  Database lưu SHA-256 của refresh token. Rotation là một conditional UPDATE;
  một token cũ chỉ được đổi thành công một lần. Request thua không ghi Set-Cookie.
- Logout xóa theo mã phiên ổn định, nên cookie trước rotation cũng thu hồi được
  token kế tiếp. Access token được đối chiếu phiên còn sống, account active và role
  hiện tại trong DB; logout/khóa tài khoản có hiệu lực ngay với request tiếp theo.
  Logout một phiên không xóa phiên của thiết bị khác.
- CSRF: `X-Requested-With: SumaryJP`, Origin nếu có phải khớp chính xác,
  chặn Sec-Fetch-Site cross-site. JSON body tối đa 8 KiB. Kiến trúc cùng origin,
  không bật CORS cho domain ngoài.
- Rate limit dùng UPSERT trong D1: login 10/15 phút; register/refresh/logout chung
  30/15 phút mỗi IP. Production lấy CF-Connecting-IP; không lấy X-Forwarded-For.
  Local dùng một bucket chung, không giả định các header tự gửi là IP thật.
  DB lỗi trả 503; vượt ngưỡng trả 429 + Retry-After. Mỗi lần tiêu thụ dọn tối đa
  50 bucket và 50 session hết hạn, có index; không chứa IP thô trong key lưu DB.
- API đọc nội dung chấp nhận phiên hợp lệ, trả đúng tiến trình tài khoản và giữ
  lọc N5/publication. GET không tự ghi progress; phần khởi tạo/lưu tiến trình thuộc CF4.
  Số lượt làm test template giữ count tổng như backend cũ, không trả danh tính/đáp án.
- Route nghiệp vụ chưa chuyển có kiểm tra auth/role trước khi trả 503.
  Preview/admin chưa được triển khai: guest/user bị từ chối, ADMIN/MODERATOR hợp lệ
  nhận 503; không coi API quản trị là đã xong.
- Script kiểm tra/import nội dung chỉ chấp nhận 18 bảng nội dung và giữ nguyên số
  tài khoản đã có. Việc đăng ký local để thử CF3 không còn làm kiểm tra N5 thất bại
  chỉ vì database đã có user.

## Kết quả kiểm tra

| Nhóm | Kết quả |
|---|---|
| Auth logic + D1 biệt lập | 16/16 |
| HTTP chạy Worker thật trên workerd + D1 riêng | 1/1 |
| HTTP nội dung N5 | 15/15 |
| HTTP routing/SPA/health | 5/5 |
| Schema, FK, rollback và publication biệt lập | 1/1 |
| Regression frontend | 64/64 |
| TypeScript Worker + frontend | Đạt |
| Build Vite mode cloudflare | Đạt |
| Wrangler deploy --dry-run | Đạt, không upload |
| Đối chiếu snapshot sau migration | 18 bảng khớp, 0 FK lỗi, 0 tài khoản tại thời điểm kiểm tra |

Các case có kiểm chứng: đăng ký trùng đồng thời; lỗi tạo gamification rollback;
UTF-8 vượt 72 byte; JWT sai chữ ký/algorithm/issuer/audience/hết hạn; CSRF;
20 refresh đồng thời chỉ một winner; rotation lỗi vẫn giữ token cũ; replay;
logout tranh chấp refresh; cookie cũ thu hồi successor; nhiều thiết bị; khóa account;
đổi role không cần chờ token hết hạn; tách progress theo user; 40 lượt rate-limit
đồng thời chỉ cho qua 10; reset/cleanup; lỗi DB không mở quyền.

HTTP smoke thực thi code trong workerd, dùng D1 riêng dưới `.local/cf3-http-*`
và tự dừng server. Các fixture chỉ dùng dữ liệu giả. Bộ logic dùng D1 không persist.
Không copy tài khoản thật từ PostgreSQL. Server dùng cho kiểm tra N5 đã dừng.

## CPU và chi phí còn phải xác minh

Hai mẫu Node local cho **một hash cộng một verify** bcrypt cost 10: 125 và 172 ms
CPU toàn process; wall time tương ứng 163 và 190 ms. Đây không phải CPU/request
của Cloudflare Workers, không phải benchmark tải và không dùng để cam kết chi phí.
HTTP workerd xác nhận chức năng chạy được, không xác nhận vượt qua quota remote.

[Tài liệu Cloudflare](https://developers.cloudflare.com/workers/platform/limits/)
hiện ghi Free 10 ms CPU/request. Với bcrypt JavaScript, phải đo CPU của đăng ký/login
trên staging và chốt ngân sách trước beta; có khả năng cần Workers Paid.
Giữ cost 10, chưa nâng gói hoặc thay cơ chế mật khẩu để cố vừa free tier.

## Cách kiểm tra lại

Từ thư mục gốc:

```powershell
npm run db:migrate:local
npm run test:auth
npm run typecheck
npm run build
npm run check:bundle
npm run dev
```

Mở `http://127.0.0.1:8787` (đúng origin đã cấu hình). Thử đăng ký tài khoản local,
đăng nhập bằng username/email, reload, đăng xuất và đăng nhập lại. Server auth
đã hoạt động; dashboard/lưu tiến trình/submit quiz còn có thể báo chưa sẵn sàng
vì thuộc CF4. Không đánh giá trải nghiệm học hoàn chỉnh từ giai đoạn này.

Terminal khác chạy `npm run test:content` và `npm run test:routing`.
Chạy `node --test scripts/*.test.mjs` trong `frontend` cho regression frontend.
Dừng dev server trước `npm run db:check:local`.

## Phần chưa làm

- CF4: ghi progress, quiz + XP/idempotency, SRS/test và các endpoint nghiệp vụ khác.
- CF5: storage SecurityError đã ghi trước đó, rà API frontend còn gọi,
  kiểm tra trình duyệt PC/mobile và luồng học end-to-end.
- CF6: secrets/domain/D1 riêng trên Cloudflare, HTTPS/cookie thực, đo CPU/rows/quota,
  backup/restore, giám sát, rollback và quyết định gói chi phí.
- Phiên cũ từ backend PostgreSQL không chuyển sang JWT có sid: cần đăng nhập lại
  khi đổi backend. Chưa có kế hoạch import tài khoản/tiến trình production.

Dừng tại CF3 để người dùng kiểm tra, chưa triển khai CF4 trong lượt này.
