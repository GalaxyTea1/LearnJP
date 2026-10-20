# Kiểm tra trước thử nghiệm N5 — 02/10/2026

## Cập nhật mục 13 — 12/10/2026

**Đã tách tải nội dung công khai và tiến độ tài khoản trên Home/Roadmap; chưa deploy production.**

- Lỗi Promise.all trong snapshot ban đầu đã được gỡ ở các mục trước. Lượt này xử lý phần phụ thuộc còn lại: catalog không chờ kiểm tra phiên và không dùng phản hồi trộn nội dung/tiến độ.
- Danh sách công khai gọi GET /modules không gửi Authorization/cookie, không refresh token và không bị hủy vì đổi phiên. Chỉ gọi /progress/me khi có user và đã xong kiểm tra phiên. Hai request có timeout 15 giây.
- Lỗi tiến độ không xóa nội dung công khai; có thông báo riêng và Thử lại tiến độ. Chưa tải được tiến độ thì hiển thị Chưa xác định tiến độ/Mở bài học, không tự gán chưa học, hoàn thành 0 bài hoặc đề xuất bắt đầu lại. Home vẫn có nút xem khóa học.
- Ghép tiến độ theo moduleId vào bài công khai; không bổ sung bài ngoài catalog. Kết quả request cũ được bỏ qua khi đổi tài khoản hoặc unmount. Thử lại tiến độ không tải lại catalog.
- Kiểm chứng: 25/25 tests auth-client + course-summary; TypeScript và production build đạt. Tests bao gồm public không gửi credentials, không bị đổi phiên hủy, lỗi progress độc lập, HTML fallback/503/offline, catalog rỗng hợp lệ, unknown progress và ghép theo moduleId. Browser guest xác minh Home hiển thị số liệu thực.
- Giới hạn: các ca lỗi mạng/phiên được giả lập ở tầng API và hàm ghép dữ liệu, chưa chạy E2E tài khoản thật hoặc mất mạng trong browser ở lượt này. Không thay đổi backend hay dữ liệu khóa học.

Hướng dẫn review: [Mục 13 — Nội dung và tiến độ độc lập](./audit-13-review/README.md).

## Cập nhật mục 12 — 12/10/2026

**Đã sửa dữ liệu mẫu và cách trình bày Home/Roadmap trên local; chưa deploy production.**

- Home bỏ số học viên cố định, thẻ ký tự mẫu, điểm trung bình gắn nhầm với tiến độ và quảng bá tính năng chưa mở. Nội dung trang đầu tập trung N5 beta bằng tiếng Việt.
- Home và Roadmap dùng chung danh sách module công khai để đếm. Local hiện có 12 bài N5, 540 mục từ vựng, 96 mục Hán tự, 60 mục ngữ pháp. Đây là số bản ghi trong bài, có thể lặp giữa các bài; không phải số từ duy nhất.
- Mục tiêu 800/100/80 và lịch/giai đoạn được ghi rõ tham khảo, không phải nội dung đã có hoặc chuẩn JLPT chính thức. Bỏ thanh năng lực giả và lời hứa lịch tự điều chỉnh. N4 local có 0 bài công khai, không thay bằng mục tiêu mẫu.
- Home ưu tiên bài IN_PROGRESS chưa hoàn thành; nếu chưa học thì mở bài NOT_STARTED đầu tiên theo unit; học xong thì xem lại. Roadmap dùng “Xem bài học”, bài COMPLETED có “Ôn lại bài”. Guest không có nhãn tiếp tục dựa vào tiến độ mẫu.
- Loading/lỗi có trạng thái riêng và nút thử lại ở Home/tổng quan/danh sách. Kết quả request của tài khoản cũ không ghi đè tài khoản mới. Tải lại khi focus, lưu tiến độ hoặc quay từ bài học.
- Kiểm chứng: 5/5 test tính số liệu/chọn bài; TypeScript và production build đạt. Browser guest xác nhận số liệu N5/N4, mở bài đầu tiên module 7, quay lại, tab chương trình và đánh giá. Home/Roadmap không tràn ngang toàn trang ở 375/390/768/1440px; thanh chọn cấp độ cuộn ngang riêng. Bố cục chỉnh sửa dùng flex.
- Giới hạn: luồng tiếp tục của tài khoản được kiểm thử ở hàm chọn bài, chưa chạy E2E tài khoản thật trong lượt này; nhánh lỗi mạng có xử lý trong code nhưng chưa giả lập trên browser. Chưa Việt hóa toàn bộ menu hay nội dung khóa học; phần nghĩa chủ yếu tiếng Anh và đã được ghi rõ. Không chỉnh dữ liệu N4.

Hướng dẫn review và ảnh: [Mục 12 — Dữ liệu thực](./audit-12-review/README.md).

## Cập nhật mục 11 — 12/10/2026

**Đã triển khai và kiểm thử local: lưu/phục hồi tiến độ từng phần và từ đã thuộc qua server. Chưa deploy production.**

- Thêm `completed_tabs` và `mastered_vocabulary_ids` vào `user_module_progress`, mặc định rỗng để giữ dữ liệu cũ. Migration `20261012000000_study_progress_details` đã chạy trên PostgreSQL local.
- GET/PATCH `/progress/module/:moduleId/study` yêu cầu đăng nhập, xác định người học từ phiên; chỉ nhận module công khai và từ thuộc module đó. Phần hoàn thành được gộp; từng từ được đánh dấu/bỏ đánh dấu riêng, không thay toàn bộ danh sách. Các PATCH cùng user/module được tuần tự hóa bằng transaction lock.
- Quiz không được nhận từ dữ liệu tự đánh dấu hoặc bản lưu guest; trạng thái đạt Quiz vẫn lấy từ server. Lưu chi tiết không hạ trạng thái COMPLETED/100% đã có. Hoàn thành một phần là dấu đã học; bỏ thuộc một từ không xóa lịch sử đã học phần đó.
- Frontend tải tiến độ server khi mở bài với tài khoản, chặn đánh dấu khi chưa tải được và có nút thử lại. Thay đổi chờ lưu được giữ theo tài khoản/module trong trình duyệt và thử gửi lại khi mở bài; có thông báo đang lưu/lỗi lưu/lỗi localStorage. Phản hồi của màn hình hoặc tài khoản cũ không cập nhật UI mới.
- Guest tiếp tục học local. Người học chủ động bấm “Nhập tiến độ học thử và bản lưu cũ trên máy vào tài khoản” để gộp các phần/từ của bài hiện tại; không tự nhập và không nhập dấu đạt Quiz. Từ không còn trong bài bị loại khi nhập.
- Lộ trình tải lại tiến độ khi thoát bài, sau khi server xác nhận lưu và khi cửa sổ lấy lại focus. Các request cũ không ghi đè kết quả mới hơn.
- Kiểm chứng: backend regression 25/25; frontend tiến độ/auth/quiz-session 25/25; PostgreSQL smoke schema riêng đạt các ca lưu/đọc lại, gộp đồng thời, bỏ thuộc từ, lặp request, cách ly tài khoản, từ sai module, bản nháp và giữ hoàn thành Quiz. Typecheck/build đạt. UI guest đã xác nhận đánh dấu từ, tải lại và lọc từ đã thuộc.
- Giới hạn xác minh: chưa chạy luồng đăng nhập trên hai trình duyệt/thiết bị thật hoặc production; khả năng phục hồi tài khoản hiện được kiểm tra ở tầng API và bộ đồng bộ frontend. Tab đang mở và bản nháp câu trả lời Quiz vẫn theo trình duyệt như mục 10. Dữ liệu chi tiết cũ chưa từng gửi lên server chỉ phục hồi được từ máy còn bản lưu; không suy diễn toàn bộ phần đã học từ 100% tổng.

Hướng dẫn review và deploy: [Mục 11 — Tiến độ chi tiết](./audit-11-review/README.md).

## Cập nhật mục 9 — 12/10/2026

**Đã xử lý theo phương án tạm ẩn hai đề mẫu khỏi beta trên local; chưa áp dụng production.** Không triển khai chế độ thi/chứng nhận đầy đủ trong mục này.

- Xác nhận module 20/21 là N5 unit 13/14, tên `JLPT N5 Mock Test 01/02`; mỗi đề có 2 câu quiz, không có vocabulary/kanji/grammar. Đã chuyển PUBLISHED → DRAFT, version 1 → 2 và xóa mốc publishedAt. Giữ toàn bộ nội dung, kết quả và lịch sử học.
- API danh sách và cấp độ N5 hiện trả **12 bài công khai**, giảm từ 14 trong snapshot cũ. URL trực tiếp `/modules/20/full` và `/modules/21/full` trả 404. Bài unit 12 `Review and Mock Test` vẫn công khai và không bị thay đổi.
- Lộ trình N5 ghi rõ chưa có đề thi thử đầy đủ, quiz chỉ phục vụ ôn từng bài. Bỏ lời hứa có 2 đề mô phỏng; nút kiểm tra N5 luôn khóa, kể cả tự đánh dấu đủ 4 mục checklist. Link bài đã ẩn có thông báo tiếng Việt và nút quay lại lộ trình.
- Backend có script `npm run content:hide-n5-sample-mocks` (dry-run), thêm `-- --apply` để áp dụng. Chỉ chọn đúng cấp độ + unit + tên; kiểm tra nội dung trước khi sửa; transaction Serializable; chạy lại không tăng version khi đã là DRAFT. Hai seed JSON đã ở DRAFT từ trước, không cần sửa/import lại.
- Đã chạy PostgreSQL smoke trên schema riêng: dry-run không ghi, chặn nếu đề đã có thêm câu, chỉ sửa hai đề đích, chạy lại an toàn, giữ 4 câu hỏi/2 lịch sử thử/2 tiến độ fixture, chặn public và giữ admin preview. Schema thử đã dọn. Frontend typecheck/build đạt; UI danh sách, link cũ, quay lại và khóa đề đã xác minh.
- Chưa xây bộ đề đầy đủ/chế độ thi. Khi deploy cần áp dụng script vào đúng database đích; chỉ deploy frontend không thay đổi trạng thái dữ liệu production.

Hướng dẫn review và triển khai: [Mục 9 — Mock Test](./audit-09-review/README.md).

## Cập nhật mục 7 — 12/10/2026

**Đã sửa mã và kiểm thử local; chưa xác nhận tra từ online trên production.** Đây là mục số 7 của audit, không phải một giai đoạn ưu tiên mới.

- Frontend gọi `/api/v1/dictionary/jisho` qua `VITE_API_URL`; xóa proxy `/api/jisho` chỉ dùng được ở Vite dev.
- Backend gọi cố định Jisho, kiểm tra từ khóa tối đa 100 ký tự, chuẩn hóa tối đa 15 kết quả và giới hạn thời gian 8 giây. Lỗi upstream/JSON trả 502, timeout trả 504.
- Giao diện phân biệt lỗi kết nối với kết quả rỗng, có Try again; hủy request cũ khi đổi từ khóa/rời trang và giới hạn chờ phía trình duyệt 12 giây. Layout dùng flex.
- Typecheck frontend, build frontend production với origin mẫu HTTPS, build backend đều đạt. Frontend API/auth tests 16/16; backend tests 25/25, gồm HTTP thành công dùng upstream giả lập.
- Kiểm tra UI local: tìm từ có sẵn, lỗi dịch vụ, thử lại rồi đổi từ khóa; responsive ở 375/390/1440px không tràn ngang. Chưa kiểm tra Safari hoặc thiết bị thật.
- **Điểm chưa xác minh:** gọi Jisho thật từ môi trường hiện tại nhận HTTP 403 (HTML “Request forbidden by administrative rules”); chưa xác định lớp chặn. Backend trả 502 và UI hiện lỗi đúng. Không coi kết quả giả lập là xác nhận Jisho hoạt động trên hosting thật.
- Trước khi đóng mục 7: deploy đồng thời frontend/backend, đặt `VITE_API_URL` và CORS theo domain thật, xác nhận keyword ngoài danh sách local trả dữ liệu từ hosting. Không deploy hoặc đổi dữ liệu khóa học trong lượt này.

Hướng dẫn review: [Mục 7 — Dictionary](./audit-07-review/README.md).

## Cập nhật mục 6 — 11/10/2026

**Đã sửa mã và kiểm thử local; chưa deploy production.** Phần báo cáo bên dưới là snapshot 02/10, không phải trạng thái hiện tại của tất cả các mục.

- API học viên chỉ trả module PUBLISHED; truy cập chi tiết module DRAFT/ARCHIVED trả 404.
- Section và nội dung con có trạng thái riêng chỉ hiện khi chính nó và các cấp cha được phát hành. Câu hỏi gắn bài đọc/bài nghe nháp cũng bị ẩn.
- Từ vựng/kanji/ngữ pháp/Quiz kế thừa trạng thái module. Bản ghi từ vựng/kanji/ngữ pháp chưa gắn module không công khai.
- Bộ lọc áp dụng cho danh sách cấp độ, tìm kiếm/chi tiết nội dung, Quiz, tiến độ, mục ôn và flashcard. Không cho nộp Quiz hoặc cập nhật tiến độ module nháp.
- `preview=true` yêu cầu tài khoản ADMIN/MODERATOR đang hoạt động; public mode vẫn lọc ngay cả khi người gọi là admin. Frontend admin đã chuyển sang preview. Response API dùng no-store.
- Đã chạy 20/20 backend tests, build backend, typecheck frontend và HTTP smoke test với PostgreSQL schema riêng. Smoke test xác minh guest/USER/ADMIN/MODERATOR, nested draft, direct ID, search, submission, progress/review và preview; dữ liệu thử đã được dọn.
- **Ảnh hưởng dữ liệu vừa kiểm đếm:** 14 module PUBLISHED, 140 section trong các module đó đều DRAFT. Sau khi áp dụng, học viên không thấy các section này cho đến khi nội dung được kiểm duyệt/phát hành. Không tự publish hoặc sửa dữ liệu khóa học trong lượt này.

Hướng dẫn review: [Mục 6 — Publication API](./audit-06-review/README.md).

## Kết luận

Chưa nên mở thử nghiệm cho học viên thật. Cần sửa luồng tài khoản, các lỗi runtime, kết quả bài tập và lưu tiến độ trước. Đây là báo cáo kiểm tra; không thay đổi mã ứng dụng hoặc dữ liệu khóa học.

## Phạm vi và bằng chứng

- Đọc frontend và backend hiện tại; kiểm tra API local được khởi động từ cấu hình backend sẵn có, không phải môi trường production đã triển khai.
- Frontend TypeScript: 8 lỗi. Vite production build: PASS. Script build chỉ chạy Vite nên không ngăn các lỗi TypeScript/runtime này.
- Backend TypeScript build: PASS. Backend tests: 6/6 PASS (JWT, validation, rate limit, SRS); chưa có test end-to-end luồng học.
- ESLint chưa được khai báo/cài trong package frontend dù có script lint; chưa có cấu hình ESLint trong các file được kiểm tra.
- Trình duyệt tải được Home, Roadmap và URL trực tiếp bài N5 số 1. Console xác nhận `/progress/me` trả 401 cho khách và làm Promise.all của Roadmap thất bại. Một số thao tác click qua công cụ không phản ánh thay đổi trạng thái, nên không dùng chúng làm bằng chứng tái hiện lỗi runtime.
- Chưa xác minh đầy đủ responsive ở 375/390/768/1440, Safari/iOS, tài khoản học viên, tải đồng thời, backup/restore hoặc cấu hình hosting thật. Chưa kiểm duyệt chuyên môn toàn bộ tiếng Nhật.
- Chỉ gọi GET để kiểm tra nội dung; không seed/import/publish, không đăng nhập tài khoản quản trị.

## Dữ liệu thực tế qua API

API đang trả 14 module, tất cả là N5/PUBLISHED. Trong snapshot này chưa có N4 trong API.

| Nội dung | Kết quả |
|---|---:|
| Bài học thường | 12 |
| Bài mang tên Mock Test | 2 |
| Bản ghi từ vựng | 540, gồm 505 chuỗi japanese khác nhau |
| Kanji | 96 ký tự khác nhau |
| Ngữ pháp | 60 bản ghi, 59 chuỗi pattern khác nhau |
| Quiz bài thường | 15 câu/bài |
| Quiz mỗi Mock Test | 2 câu |
| Mục nghe | 26/26 có PENDING_AUDIO |
| Section bên trong module công khai | 140/140 vẫn DRAFT |

Số chuỗi khác nhau không đồng nghĩa số kiến thức đã được kiểm định; từ vựng lặp lại có thể là chủ ý ôn tập.

## Vấn đề cần sửa trước beta

### 1. P1 — Không có luồng đăng nhập/đăng ký dành cho học viên

UI đăng nhập đang dùng `src/app/screens/admin/AdminAuthForm.tsx:22`, chỉ nhận ADMIN/MODERATOR; tài khoản USER đăng nhập bị logout ngay. Không tìm thấy UI gọi authApi.register. Trong khi đó backend yêu cầu authenticate cho toàn bộ progress routes và POST quiz submit.

**Ảnh hưởng:** khách học hết bài rồi không nộp được quiz/lưu tiến độ. Quiz báo lỗi kết nối thay vì giải thích cần đăng nhập.

**Sửa:** cung cấp đăng ký/đăng nhập học viên, giữ đích quay lại và câu trả lời; guest mode phải thông báo rõ giới hạn lưu. Không cấp quyền admin cho người thử nghiệm.

### 2. P1 — Callback hoàn thành từ vựng và quiz bị thiếu biến

- `src/app/screens/study/tabs/VocabStudyTab.tsx:14` không nhận onCompleteTab từ props nhưng gọi nó ở dòng 60. Đánh dấu thuộc từ cuối gây ReferenceError.
- `src/app/screens/study/tabs/QuizStudyTab.tsx:56` cũng không nhận callback nhưng gọi ở dòng 97–98 khi passed. Backend có thể đã lưu kết quả, frontend vẫn rơi vào catch và báo lỗi mạng.

**Sửa:** truyền/nhận callback đúng; kiểm tra thuộc đủ từ, quiz đạt và quiz không đạt. Không dùng build Vite thay typecheck.

### 3. P1 — Danh sách khóa học rỗng gây lỗi render toàn trang

`src/app/screens/LearningPage.tsx:346` dùng `content.level` nhưng content không tồn tại. Nhánh này xảy ra khi chọn cấp độ chưa có bài công khai, hoặc tải danh sách thất bại lúc ban đầu. N4–N1 vẫn chọn được trong lộ trình.

**Sửa:** dùng levelName; tách empty/error/loading, có thử lại; N4–N1 hiển thị sắp ra mắt và không dẫn vào luồng chưa sẵn sàng.

### 4. P1 — Báo hoàn thành Unit khi chưa đạt bài kiểm tra

`src/app/screens/study/ModuleStudyViewer.tsx:291` gọi markTabCompleted('quiz'), alert chúc mừng rồi quay về chỉ bằng nút cuối trang. Không kiểm tra passed. MarkTabCompleted gửi IN_PROGRESS và có thể gửi 100%, trong khi backend từ chối client gửi 100% (`../backend-figma/src/services/progress.service.ts:57`). Lỗi đồng bộ chỉ được ghi console.

**Ảnh hưởng:** trạng thái local, lời chúc mừng và kết quả server không khớp; học viên không biết đã hoàn thành thật hay chưa.

**Sửa:** kết quả server là nguồn xác nhận hoàn thành; nút cuối phải phản ánh đúng kết quả quiz; lỗi lưu phải hiển thị và cho thử lại. Roadmap cần tải lại tiến độ sau khi thoát bài.

### 5. P1 — Đáp án bài đọc/bài tập hiển thị sai định dạng

`src/app/screens/study/tabs/ExerciseStudyTab.tsx:116` và `:187` kiểm tra truthy `ex.correctAnswer` và in thẳng giá trị. Import lưu chỉ số lựa chọn dạng số bắt đầu từ 0 (`../backend-figma/scripts/content-import.ts`). API bài đầu tiên thực tế có 2 câu đọc hiểu với correctAnswer=0.

**Ảnh hưởng:** lựa chọn đầu tiên không hiển thị đáp án đúng/giải thích; các đáp án khác hiển thị số chỉ mục thay vì nội dung lựa chọn.

**Sửa:** phân biệt null/undefined với 0; chuyển chỉ số sang options[index], giữ xử lý riêng cho đáp án văn bản và dạng bài khác.

### 6. P1 — Nháp chưa được bảo vệ ở API

`../backend-figma/src/routes/module.routes.ts` cho phép GET công khai. `../backend-figma/src/services/module.service.ts:78` truy vấn theo id, không lọc contentStatus hoặc role; danh sách cũng không lọc publication. Frontend chỉ ẩn module chưa PUBLISHED khỏi Curriculum. API hiện còn trả cả 140 section DRAFT bên trong module đã public.

**Ảnh hưởng:** khi N4 nháp được nhập, người dùng có thể lấy danh sách/id/full trực tiếp, bỏ qua bộ lọc giao diện. Tiến độ tổng còn đếm cả module nháp (`progress.service.ts:36`).

**Sửa:** quy định publication rõ ràng cho module và nội dung con, lọc phía server; admin preview tách quyền; chỉ đếm nội dung được phát hành trong tiến độ học viên.

### 7. P1 khi dùng cấu hình Vercel hiện tại — Từ điển remote chỉ có proxy dev

**Trạng thái 12/10:** đã sửa đường gọi và xử lý lỗi; còn xác minh nguồn Jisho trên hosting thật. Mô tả dưới đây là lỗi trong snapshot 02/10.

`src/app/screens/DictionaryPage.tsx:37` gọi `/api/jisho/search/words`. Proxy chỉ nằm trong vite.config.ts; vercel.json rewrite mọi đường dẫn về index.html. Khi dùng cấu hình này mà không có proxy khác, từ ngoài từ điển local nhận HTML thay vì JSON. VITE_API_URL không sửa endpoint này vì URL được hardcode riêng.

**Sửa:** gọi endpoint từ điển của backend hoặc thêm route proxy production; kiểm tra trên production preview. API chính cũng cần VITE_API_URL đúng hoặc reverse proxy /api/v1.

## Vấn đề ảnh hưởng chất lượng học

### 8. P2 — Phát hội thoại bị cắt câu và không dừng vòng phát

`DialogueStudyTab.tsx:61` gọi speakJapanese mỗi 2200ms; helper luôn cancel âm thanh trước. Câu dài có thể bị cắt. Nút dừng chỉ cancel câu hiện tại/set state, không hủy vòng for đang chờ; vòng cũ tiếp tục đọc câu sau, kể cả đổi hội thoại/rời tab.

**Sửa:** đợi speech onend, có mã phiên phát/hủy và cleanup khi unmount. File audio thật cần player thực sự: UI hiện vẫn đọc transcript bằng TTS ngay cả khi audioUrl có giá trị thật. Không coi PENDING_AUDIO là lỗi không có tiếng hoàn toàn vì vẫn có TTS fallback.

### 9. P2 — Hai Mock Test chưa phù hợp làm đánh giá cuối khóa

**Trạng thái 12/10:** đã ẩn hai đề mẫu trên local theo phương án beta; còn áp dụng dữ liệu trên production. Nội dung dưới đây là snapshot trước sửa.

Module 20/21 có 2 câu quiz mỗi bài, không có vocabulary/kanji/grammar nhưng viewer vẫn mở tab Từ vựng đầu tiên và đếm cố định 6 phần. Người học vào đề thấy trang rỗng trước; kết quả 2 câu không phản ánh đầy đủ mục tiêu khóa học.

**Sửa:** ẩn hai đề khỏi beta hoặc đổi nhãn thành bài mẫu; tạo chế độ đề kiểm tra riêng trước khi dùng làm chứng nhận đạt cấp độ.

### 10. P2 — Mất bài quiz đang làm khi đổi tab

Viewer render từng tab có điều kiện; QuizStudyTab giữ answers/result/timer trong state nội bộ. Sang ngữ pháp rồi quay lại sẽ mount quiz mới, mất câu trả lời và thời gian. ActiveTab cũng luôn về vocab khi mở lại module.

**Sửa:** lưu bản nháp theo user/module và phiên bản bài; phục hồi khi quay lại, xác nhận trước khi bỏ bài đang làm.

### 11. P2 — Tiến độ chi tiết phụ thuộc trình duyệt, không phục hồi từ server

**Trạng thái 12/10:** đã sửa mã và migrate local; cần deploy cả backend/frontend và kiểm tra trên thiết bị thật. Nội dung sau là snapshot trước sửa.

CompletedTabs và mastered vocab chỉ đọc localStorage. Viewer nhận userProgress từ API nhưng không dùng để phục hồi các tab đã học. Đổi máy/xóa storage có thể hiện 0/6 dù server đã hoàn thành; roadmap load progress một lần nên có thể còn số cũ sau khi thoát bài.

**Sửa:** định nghĩa dữ liệu tiến độ từng phần/từng từ trên server; tải lại đúng thời điểm; guest data cần chiến lược chuyển vào tài khoản.

### 12. P2 — Dữ liệu mẫu tạo kỳ vọng sai

**Trạng thái 12/10:** phần dữ liệu mẫu Home/Roadmap đã sửa local; xem cập nhật mục 12 phía trên. Nội dung dưới đây là phát hiện ban đầu.

Home khách hiển thị số học viên cố định (12,840 cho N5) và quảng bá Spaced Repetition, trong khi đường vào flashcards đang ẩn. Roadmap ghi 800 từ/100 kanji/80 mẫu câu; API snapshot có 540 bản ghi từ, 96 kanji, 60 ngữ pháp. Đây có thể là mục tiêu, nhưng cần phân biệt với nội dung hiện có. Nút Tiếp tục học dựa readiness mẫu, xuất hiện cả với khách mới.

**Sửa:** bỏ thống kê mẫu, tách mục tiêu và hiện có, tập trung trang đầu vào N5 beta. Đồng nhất tiếng Việt nếu người dùng mục tiêu là người Việt; hiện nghĩa từ vựng chủ yếu tiếng Anh.

### 13. P2 — Khách không nhận được metadata cấp độ dù API công khai hoạt động

**Trạng thái 12/10:** đã sửa local, xem cập nhật mục 13 phía trên. Đoạn dưới giữ nguyên phát hiện ban đầu.

LearningPage.tsx:40 gộp getLevels với getMyProgress trong Promise.all. Progress 401 khiến bỏ cả kết quả levels, lặng lẽ dùng fallback mẫu. Đã thấy lỗi này trong console trình duyệt.

**Sửa:** tải nội dung công khai độc lập; chỉ lấy progress khi có phiên phù hợp, hiển thị trạng thái lỗi rõ ràng.

## Lỗi TypeScript đã ghi nhận

1. roadmapPlan.ts:1 — thiếu module ./jlptRoadmaps.
2. LearningPage.tsx:8 — JLPTLevel chưa được export.
3. LearningPage.tsx:346 — content không tồn tại.
4. ModuleStudyViewer.tsx:192 — so sánh string | number với number.
5–6. QuizStudyTab.tsx:97,98 — onCompleteTab không tồn tại trong scope.
7–8. VocabStudyTab.tsx:60 — onCompleteTab không tồn tại trong scope.

## Thứ tự triển khai đề xuất

1. Sửa P1, đưa typecheck vào điều kiện build/deploy; test luồng học viên từ đăng ký đến hoàn thành bài, tải lại và tiếp tục học.
2. Chỉ công khai bài N5 đã kiểm duyệt; chặn nháp ở API; tạm ẩn mock chưa hoàn thiện và cấp độ chưa sẵn sàng.
3. Sửa audio, đáp án và phục hồi phiên học; chia 45 từ thành các phiên ngắn, cho ôn lại câu sai, giảm phụ thuộc romaji theo lựa chọn học viên.
4. Xác minh production preview: API, CORS, deep link, refresh token, mất mạng, mobile 375/390/768/1440 và iOS audio.
5. Mở beta nhóm nhỏ với nút báo lỗi nội dung có module/câu hỏi, ghi nhận lỗi tải/lưu và tỷ lệ hoàn thành bài. Chỉ tăng số người dùng sau khi không còn lỗi mất tiến độ hoặc phản hồi đáp án sai.
