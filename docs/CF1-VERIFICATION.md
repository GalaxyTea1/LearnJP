# CF1 — nền Cloudflare local

Ngày kiểm tra: 14/10/2026. Chỉ trong bản sao ổ D.

## Kết quả

- npm ci frontend: đạt; root Wrangler 4.151.0 và TypeScript 5.9.3 đã có lockfile.
- npm run typecheck: Worker và frontend đạt.
- npm run build: đạt, mode cloudflare, API cùng origin; 23 file static.
- npm run check:bundle: đạt, Wrangler dry-run, không upload.
- npm run test:routing: **6/6 đạt** trên Wrangler/workerd + D1 local thật.
  Kiểm tra SELECT 1, health ready:false/503, API navigation không rơi vào SPA,
  login chưa chuyển trả JSON 503/không set cookie, deep link /learning?moduleId=7,
  trang index và asset JavaScript.
- npm run test:build-config: **3/3 đạt**: build thường thiếu origin hoặc dùng / bị
  chặn; mode cloudflare dùng origin bên ngoài bị chặn.
- Frontend node --test scripts/*.test.mjs: **64/64 đạt**. Đây là regression phía
  client, không chứng minh API đăng nhập/chấm điểm đã chuyển sang D1.

Windows sandbox chặn realpath/workerd lần đầu; kiểm tra build/runtime được chạy lại
ngoài sandbox và đạt. Không phải lỗi ứng dụng. Npm có cảnh báo deprecated Recharts 2;
chưa nâng major trong phần hạ tầng này. Wrangler types có thông báo gợi ý Node types;
typecheck vẫn đạt, Worker nền chưa import API Node.

## Giới hạn

Chưa có schema/nội dung ứng dụng trên D1, chưa port API nghiệp vụ. D1 health chỉ chứng
minh kết nối, cố ý trả 503 ready:false. Chưa kiểm tra giao diện bằng trình duyệt lần này,
chưa đo CPU/load, chưa cấu hình Cloudflare account, secrets, domain hay remote database.
Chưa deploy. CF2 là phần kế tiếp: schema D1, chuyển nội dung và API đọc.

File nguồn ở ổ C và database PostgreSQL không bị sửa. COPY-MANIFEST.json vẫn là
mốc sao chép ban đầu, không phải checksum của bản đã cập nhật.
