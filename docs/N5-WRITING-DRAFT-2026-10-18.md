# Lưu bản nháp luyện viết — 18/10/2026

Đã sửa mục ưu tiên đầu tiên còn lại sau gói rà Unit 1: textarea trong phần Bài tập
không lưu nội dung, nên mất bài khi chuyển tab khiến component bị tháo.

## Thay đổi

- Ô viết có state và lưu localStorage ngay sau mỗi lần nhập, giữ nguyên tiếng Nhật,
  dấu cách và xuống dòng. Không áp giới hạn ký tự theo minLength/maxLength vì
  dữ liệu hiện mô tả số câu; vấn đề đơn vị độ dài vẫn là mục riêng chưa sửa.
- Khôi phục theo module, task và tài khoản hoặc chế độ khách. Đổi tài khoản đọc
  bản riêng; không tự ghép hay ghi đè bản của tài khoản bằng bài viết khách.
- Chờ xác định tài khoản trước khi mở ô viết; không hiển thị bản của danh tính
  trước trong lúc chuyển tài khoản. Bản nháp không thay đổi tiến độ/hoàn thành.
- Nếu quota/storage bị chặn: giữ nội dung trong bộ nhớ khi đổi phần học cùng
  trang, báo chưa lưu bền vững, có nút thử lại và hướng dẫn sao chép bài viết.
  Guard trước khi rời trang thử lưu lại và yêu cầu trình duyệt cảnh báo nếu vẫn lỗi.
  Cảnh báo beforeunload phụ thuộc trình duyệt, không bảo đảm trên thiết bị di động.
- Xóa hết chữ được lưu như bản rỗng; lỗi lưu khi xóa không khôi phục nhầm bài cũ
  khi quay lại tab trong cùng trang.
- Bản lưu lỗi định dạng được báo rõ, không tự ghi đè ngay khi mở bài.
- Label và mô tả trạng thái cho từng textarea; bố cục dùng flex.

Phạm vi: bản nháp **chỉ trên trình duyệt/origin hiện tại**, chưa đồng bộ D1 hay thiết
bị khác. Chuyển domain khi deploy không tự chuyển bản nháp local. Cùng một bài mở
đồng thời ở nhiều tab chưa có cơ chế ghép nội dung; lần ghi cuối được lưu. Quay lại
phần Bài tập đọc bản lưu mới nhất, trừ khi trang đang giữ một lần ghi bị lỗi cần thử lại.

## Kiểm chứng

- `node --test scripts/*.test.mjs` từ frontend: **84/84 đạt** (74 test cũ + 10 mới).
- Test mới: chuỗi Nhật/whitespace/ký tự cuối; khôi phục từ store mới mô phỏng reload;
  tách module/task/tài khoản/khách; xóa bài; quota và retry; xóa thất bại; getter/read
  storage bị chặn; dữ liệu hỏng; thay đổi/xóa từ store khác; retry nhiều tài khoản;
  SSR kiểm tra label/disabled khi chờ danh tính và không ép maxlength theo số câu.
- `node scripts/build-cloudflare.mjs`: TypeScript frontend và Vite Cloudflare đạt.
- Trang thử localhost:5180 trả HTTP 200 cho HTML, JavaScript và CSS. Đây là kiểm
  tra phục vụ tài nguyên, không chứng minh thao tác UI đã chạy đúng trên browser.
- Browser automation không khả dụng: `Local browser use is disabled in Work settings`.
  Chưa xác nhận thao tác thực, bàn phím IME hoặc responsive trên PC/điện thoại.
- Không sửa database, checksum candidate, trạng thái xuất bản hay cấu hình remote.

## Cách kiểm tra thủ công

Chạy từ frontend: `node scripts/writing-draft-preview.mjs`, mở
http://127.0.0.1:5180. Đây là trang thử riêng dùng component Bài tập thật và hai đề
viết Unit 1 từ candidate; tài khoản A/B là giả, không đăng nhập/gọi API/ghi D1.
Storage ở port 5180 tách khỏi app chính ở 8787. Nạp lại trang thử về chế độ khách.

1. Gõ bài tiếng Nhật có xuống dòng, đổi sang Phần học khác rồi quay lại: chữ còn.
2. Tải lại trang: bài khách còn. Viết bài cho tài khoản A, đổi B rồi quay lại A:
   bài A còn riêng. Khi reload chọn lại A để xem bản A.
3. Xóa hết chữ, đổi phần hoặc reload: bản cũ không xuất hiện lại.
4. Bật Giả lập lỗi lưu, gõ thêm rồi đổi phần/quay lại: chữ còn và báo chưa lưu.
   Tắt lỗi rồi bấm Thử lưu lại, reload: nội dung mới còn.
5. Bật Đang xác định tài khoản: ô viết khóa và không lộ bản cũ. Tắt để khôi phục.
6. Kiểm tra khung hẹp 390px và trình duyệt trên điện thoại thật; checkbox khung
   hẹp chỉ hỗ trợ xem bố cục, không mô phỏng bàn phím/viewport của điện thoại.

## Thứ tự còn lại

Người dùng đã chốt lại thứ tự sau gói này; không tách đơn vị độ dài thành một
giai đoạn riêng. Unit 2 đã có [gói rà và sửa tiếp theo](N5-UNIT2-REVIEW-2026-10-18.md).

1. Rà đầy đủ nội dung Unit 3–12, gồm các yêu cầu độ dài bài viết.
2. Kiểm thử TTS, ghép câu, bản nháp và tiến độ trên PC/mobile web.
3. Duyệt xuất bản từng bài; 120 section vẫn DRAFT.
4. Cloudflare staging HTTPS, D1/hostname/secrets và cookie thực tế.
5. CPU/chi phí, backup–restore, rollback và kiểm tra vận hành trước production.

Dừng sau phần lưu bản nháp để người dùng kiểm tra trước khi sửa mục kế tiếp.
