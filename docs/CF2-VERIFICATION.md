# CF2 — Schema D1, nội dung N5 và API đọc

Hoàn thành kiểm tra local trong đợt 14–15/10/2026. Chưa deploy remote.

## Đã thực hiện

- 2 migration SQLite: 35 model nguồn, 2 bảng chuẩn hóa tiến trình và 1 bảng tìm kiếm.
  Giữ PK/FK/unique, enum CHECK, JSON validation, boolean 0/1. Ngày lưu UTC ISO TEXT.
  Schema auth/progress được chuẩn bị nhưng API ghi chưa triển khai/chưa chứng nhận.
- PostgreSQL nguồn được đọc bằng RepeatableRead + SET TRANSACTION READ ONLY.
  Không chạy seed, migration hay ghi dữ liệu trên PostgreSQL; không xuất secret.
- Snapshot nội dung N5 giữ nguyên ID, nằm trong `.local/content/n5.json` (gitignored).
  Metadata/đếm/hash ở [CF2-CONTENT-MANIFEST.json](CF2-CONTENT-MANIFEST.json).
  Không import tài khoản, refresh token, history hay tiến trình học. `createdBy` của
  test template được đặt null để không tham chiếu tài khoản nguồn.
- Import D1 local dùng batch nguyên tử. Script mặc định chỉ validate; `--apply` mới ghi.
  Nếu bảng đích có dữ liệu khác snapshot, script dừng, không upsert/ghi đè.
  Chạy lại snapshot giống hệt không tạo thêm bản ghi.
- API đọc: levels, modules/detail/full, vocabulary, kanji/char, grammar, quiz,
  danh mục/detail test public, dictionary search/Jisho và announcements active.
  Public chỉ mở nội dung N5 PUBLISHED; preview bị từ chối đến khi có auth.
  Request có Authorization chưa được xử lý như guest: trả 503 chờ CF3.
  `/announcements/all` yêu cầu quyền, không kế thừa route cũ công khai mọi thông báo.
- Quiz trả public fields, không có correctIndex/explanation. quizRevision HMAC
  tương thích thuật toán cũ, dùng QUIZ_REVISION_SECRET tách biệt. Giá trị trong config
  local chỉ dùng phát triển; production phải cấu hình secret riêng và không dùng khóa local.
- Tìm kiếm Unicode được chuẩn hóa bằng JavaScript lowercase vì SQLite lower() chỉ
  xử lý ASCII. API ghi nội dung sau này phải cập nhật content_search cùng dữ liệu chính.

## Dữ liệu thực tế

18 bảng nội dung được đối chiếu (có bảng rỗng), **1.803 bản ghi** và **696 dòng index**.
12 module N5 public + 2 module draft. 540 vocabulary, 96 kanji, 60 grammar,
112 grammar examples; 184 quiz gồm 180 thuộc module public và 4 thuộc draft.
140 sections, 24 conversations/106 lines, 26 listening, 26 readings,
24 writing tasks, 450 exercises. Chi tiết trạng thái child được lọc tại API.
Nguồn hiện không có dictionary N5 hoặc test template N5; API trả danh sách rỗng thật.
Không import announcements/tài khoản từ nguồn trong pha nội dung N5 này.

## Kiểm chứng

- Hai migration chạy bằng Wrangler local thành công.
- Import xong so sánh **từng trường của từng bản ghi** với snapshot, JSON/ngày/ID đúng.
- Foreign key check: **0 vi phạm**; users: **0**.
- Import lại: `imported:0`; checksum nguồn không đổi.
- Typecheck Worker + FE đạt. Wrangler dry-run đóng gói đạt, không upload.
- **15/15 content tests đạt** qua HTTP Worker local: catalog/counts, full content
  của 12 bài, HMAC revision, không lộ đáp án, draft/preview, phân trang, item detail,
  tìm kiếm Unicode và input không hợp lệ/SQL injection string.
- **5/5 routing tests đạt**. Ca modules vốn 503 ở CF1 đã được thay bằng content tests.
- **1 bộ kiểm thử D1 biệt lập đạt** gồm unique, FK, enum, JSON, rollback cả batch,
  cascade; public child dưới draft section, exercise gắn draft reading, N4 PUBLISHED
  và test template draft đều bị chặn. Jisho kiểm tra payload giả hợp lệ/lỗi; chưa gọi
  upstream thật trong lượt này.
- Test đầu có kỳ vọng thứ tự catalog theo ID khác contract unitNumber; sửa test theo
  contract và chạy lại đạt. Lỗi kết nối test trong sandbox được chạy lại ngoài sandbox.

## Chạy lại

Từ `D:/SumaryJapanese-cloudflare` (dừng server trước khi import):

```powershell
node scripts/prepare-d1.cjs C:/Users/GamingGear/Desktop/SumaryJapanese/backend-figma
npm run db:migrate:local
npm run db:check:local
npm run db:import:local
npm run test:schema
npm run dev
```

Terminal khác: `npm run test:content` và `npm run test:routing`.
Script prepare cần checkout nguồn có Prisma client đã generate và `.env` local;
không copy `.env` sang ổ D. Import không hỗ trợ remote; sẽ cần quy trình staging/prod ở CF6.
Không chạy lại prepare trên nguồn đã đổi nếu muốn giữ snapshot đang đối chiếu.
Không sửa baseline migration đã áp dụng; thay schema bằng migration mới.

## Chưa nằm trong kết luận CF2

Auth/session, submit quiz, XP/progress và các API ghi còn trả 503. Health ready:false
có chủ đích; D1 kết nối được không nghĩa ứng dụng đã sẵn sàng phát hành.
Chưa kiểm tra trình duyệt PC/mobile hoặc Jisho upstream thật trong lượt này; CF5 xử lý
trải nghiệm hoàn chỉnh và lỗi storage cũ. Chưa benchmark CPU/load, HTTPS/domain/secrets,
remote D1, R2 hay restore. Auth/concurrency cần kiểm thử riêng trên D1 trong CF3–CF4.
Không thay source ổ C, không thay dữ liệu N4. CF3 là phần tiếp theo.

Nguồn kỹ thuật:
- https://developers.cloudflare.com/d1/worker-api/prepared-statements/
- https://developers.cloudflare.com/d1/best-practices/import-export-data/
