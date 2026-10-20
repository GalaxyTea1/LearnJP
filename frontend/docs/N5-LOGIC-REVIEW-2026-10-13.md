# Rà soát logic N5 — 13/10/2026

Phạm vi rà soát ban đầu: đọc code frontend/backend của đăng nhập, catalog, học bài, lưu tiến độ, quiz, publication và điều hướng. Chỉ rà soát, không sửa logic hoặc dữ liệu, không deploy. Không thay thế snapshot audit 02/10 hoặc đổi số thứ tự 13 mục trước.

## Kiểm tra phát hành tiếp theo — 14/10/2026

L1–L5 đã sửa local; kiểm tra phát hành mới tìm thấy P2 storage bị chặn và các điều kiện Cloudflare chưa xác minh. Xem [N5 release check 14/10](./N5-RELEASE-CHECK-2026-10-14.md). Chưa chốt GO production.

## Trạng thái hiện tại — sau L5, 13/10/2026

**L1–L5 đã sửa local**, có kiểm chứng tương ứng bên dưới; dừng để user review L5. Chưa deploy production. Các cập nhật cũ và phát hiện gốc là snapshot tại thời điểm ghi, không phải số lỗi còn mở hiện tại. Vẫn cần kiểm tra môi trường triển khai và luồng tài khoản thật trước beta.

## Cập nhật L5 — 13/10/2026

- Tải module full, tải quiz và nộp quiz có deadline 15 giây, bao gồm chờ auth refresh; timeout thoát trạng thái chờ. Viewer hiển thị lỗi dễ hiểu và nút Thử lại tải bài tại chỗ.
- Mỗi lượt nộp tạo requestId UUID, lưu đồng bộ vào bản nháp trước khi gửi. Giữ nguyên đáp án/thời gian, tạm khóa sửa/bỏ bài khi chưa nhận kết quả; người học vẫn xem qua các câu và bấm Thử lại lượt nộp. Reload cùng phiên bản đề và cùng tài khoản khôi phục mã cũ. Có kết quả mới cho phép làm lượt mới.
- Backend yêu cầu requestId ở POST submit. Unique theo user/requestId; hash ràng buộc module, revision, đáp án và thời gian. Replay cùng payload trả response đã lưu; khác payload trả 409 QUIZ_REQUEST_CONFLICT. Attempt, response, progress và XP ghi cùng transaction Serializable; retry tối đa 2 lần khi xung đột transaction/unique.
- Migration 20261013000000_quiz_idempotency thêm cột nullable và unique index, giữ các attempt cũ. Đã generate client và áp dụng trên PostgreSQL localhost. Khi production: migrate deploy, generate/build backend và phát hành frontend/backend cùng đợt; client cũ không có requestId bị trả 400, cần tải lại trang.
- Kiểm chứng: frontend 64/64, backend 27/27; TypeScript/build hai bên đạt. PostgreSQL schema cô lập áp dụng toàn bộ migration: hai submit đồng thời cùng key và replay sau commit chỉ có 1 attempt, XP=10; payload khác bị từ chối; thiếu key bị từ chối; replay trả kết quả cũ sau đổi đề, key mới với revision cũ bị từ chối. Publication/study-progress integration cũng đạt; schema thử đã dọn.
- Browser fixture: lỗi tải bài → Thử lại tải bài mở được nội dung; quiz giả lập mất response sau khi lưu → reload giữ 2/2 đáp án, thời gian 00:19 và khóa chỉnh sửa → thử lại trả 100%, callback hoàn thành đúng 1 lần. API deadline được kiểm thử bằng abort giả, không bắt browser chờ đủ 15 giây.
- Giới hạn: browser dùng API giả, chưa E2E mạng chậm với tài khoản thật. Không cam kết khôi phục sau đóng tab nếu storage bị chặn/xóa; cảnh báo lưu nháp vẫn hiển thị. Bản nháp khác revision vẫn theo chính sách L2 bắt đầu lại; replay server chỉ bảo đảm cùng requestId/payload. Chưa triển khai production; build frontend kiểm chứng dùng origin giả.

Ảnh fixture: [Chờ xác nhận sau reload](./logic-l5-review/pending-after-reload.png), [Kết quả thử lại](./logic-l5-review/retry-result.png), [Lỗi tải bài](./logic-l5-review/lesson-timeout.png).

Review: thử chặn mạng khi tải bài, khôi phục rồi bấm tải lại; nộp quiz với phản hồi gián đoạn, sau đó thử lại và xác nhận lịch sử chỉ có một attempt. Dừng sau L5.

## Cập nhật L4 — 13/10/2026

**Đã sửa điều hướng Roadmap; dừng để user review trước L5.**

- App và LearningPage cùng đọc URL qua useSyncExternalStore; cập nhật khi điều hướng nội bộ, popstate và hashchange. Không còn state moduleId riêng ghi ngược đè URL.
- Roadmap luôn đi tới /learning và bỏ query của bài hiện tại, kể cả đang ở pathname /learning. Mở bài thêm history entry; Back/Forward khôi phục đúng bài/lộ trình. Không thêm entry khi URL không đổi.
- Home mở bài trực tiếp qua cùng hàm điều hướng, tránh xóa moduleId sau khi chuyển trang. Viewer có key theo moduleId để tách trạng thái giữa bài. ID sai định dạng hoặc ngoài safe integer không mở viewer.
- Kiểm chứng: toàn bộ frontend 61/61 tests; TypeScript và production build đạt. Browser fixture dùng App/Home/LearningPage thật, catalog/auth/viewer giả: URL bài 7 → Roadmap → Back → Forward đúng; Home bắt đầu học và nút Quay lại lộ trình đúng. Mobile 390px bấm Roadmap thoát bài và đóng menu.
- Giới hạn: browser kiểm tra điều hướng cô lập, chưa E2E với tài khoản/API thật; không xác nhận hosting rewrite URL trên production. Build dùng origin giả để kiểm chứng, phải build lại với origin thật khi phát hành.

Ảnh: [PC](./logic-l4-review/roadmap-desktop.png), [mobile](./logic-l4-review/roadmap-mobile.png). Dữ liệu khóa học trong ảnh là fixture.

Review: mở một bài thật, bấm Roadmap trên nav PC/menu điện thoại; URL phải thành /learning. Dùng Back/Forward, thử nút bắt đầu/tiếp tục học từ Home và tải lại URL bài.

## Cập nhật L3 — 13/10/2026

**Đã sửa và kiểm tra lại trước khi làm L4.**

- Bỏ disabled fieldset bao toàn bộ tab học. Chỉ khóa nút đánh dấu hoàn thành/đã thuộc khi chưa tải được tiến độ; callback hoàn thành cũng kiểm tra ready.
- Thông báo phân biệt tải tiến độ với lưu tiến độ lỗi, giải thích vẫn có thể đọc/nghe/luyện tập và cho thử lại tại chỗ.
- 5 tests mới cho Kanji/Grammar/Dialogue/Exercise/Vocab: chỉ nút ghi tiến độ bị khóa khi chưa ready, mở lại khi ready. Tổng frontend tại L3 59/59; TypeScript/build đạt.
- Browser fixture dùng viewer và bộ đồng bộ thật, API giả: ẩn/hiện nghĩa và chọn đáp án/xem giải thích hoạt động khi GET tiến độ lỗi; nút nghe enabled (không xác nhận âm thanh phát ra); Writes=0. Khôi phục API và thử lại giữ phần giải thích đang mở, nút hoàn thành bật; bấm ghi đúng một lần, tiến độ 1/6.
- Không ghi database thật hoặc sửa dữ liệu N4. Chưa kiểm thử lỗi mạng với tài khoản thật.

Ảnh: [Học khi lỗi tiến độ](./logic-l3-review/progress-error-learning.png), [Phục hồi](./logic-l3-review/progress-recovered.png).

## Cập nhật L2 — 13/10/2026

**Đã sửa local kiểm tra phiên bản đề quiz; chờ user review. Chưa deploy.** L3–L5 chưa sửa.

- Server tạo quizRevision bằng HMAC từ moduleId và toàn bộ dữ liệu đề, gồm nội dung, options theo thứ tự, correctIndex, giải thích, loại câu và điểm. Không đưa đáp án hoặc giải thích vào response public. HMAC dùng secret hiện có, không cần migration; các backend instance phải dùng cùng secret.
- GET module full trả quizRevision; GET quizzes/module giữ data dạng array và thêm meta.quizRevision. POST submit nhận quizRevision; thiếu/sai phiên bản của đề đang có câu hỏi trả 409 QUIZ_REVISION_CHANGED trước mọi ghi attempt/progress/XP. Module không công khai/không còn câu hỏi giữ 404.
- Đọc đề, kiểm tra phiên bản, chấm và ghi kết quả dùng cùng transaction Serializable, tránh kiểm tra một bản nhưng chấm một bản khác. Không tự động thử lại transaction xung đột trong thay đổi này.
- UI báo rõ khi đề đã đổi, giữ các lựa chọn hiện tại và không đánh dấu hoàn thành. Nút Tải đề mới và làm lại yêu cầu xác nhận trước reload. Bản nháp/kết quả local gắn cả revision server, nên đổi riêng đáp án cũng không phục hồi bản cũ vào đề mới.
- Kiểm chứng: frontend 54/54, backend 27/27; TypeScript và build hai bên đạt. Tests bao gồm đảo options, đổi đáp án/nội dung/giải thích, thêm/bớt câu, thiếu revision và revision module khác; không ghi kết quả/XP khi mismatch. Browser fixture dùng component thật và API giả xác nhận 2/2 câu được giữ, cảnh báo hiện, completion callback bằng 0.
- GET API local thật module 7: 15 câu; revision full và endpoint quiz giống nhau, dài 64; không có correctIndex trong cả hai response. Không sửa dữ liệu N4 hoặc nội dung bài thật để thử.
- Giới hạn: chưa E2E nộp bài với tài khoản thật hoặc kiểm tra admin cập nhật đồng thời trên PostgreSQL. Cần deploy frontend/backend cùng đợt và tải lại tab cũ; client cũ thiếu revision sẽ bị từ chối. Bản nháp local trước nâng cấp chưa có revision server sẽ bắt đầu lại; kết quả đã lưu server không bị xóa. Build frontend kiểm chứng dùng origin giả, cần build lại với origin thật khi phát hành.

Ảnh kiểm chứng: [Fixture báo đề đổi](./logic-l2-review/quiz-revision-conflict-fixture.png). Đây là màn hình kiểm thử cô lập, không phải thay thiết kế website.

Review đề xuất: mở quiz, chọn đáp án, cập nhật thứ tự lựa chọn/đáp án ở môi trường thử nghiệm rồi nộp. Phải thấy thông báo đề đổi, chưa có attempt/XP mới; chỉ khi chủ động tải đề mới mới bắt đầu lại. Dừng tại L2 trước khi sang L3.

## Cập nhật L1 — 13/10/2026

**Đã sửa local hàng đợi tiến độ của tài khoản; chờ user review. Chưa deploy.** L2–L5 chưa sửa trong lượt này. Các phát hiện gốc phía dưới được giữ để truy vết.

- Mỗi thao tác lưu vào key v2 riêng có ID, không ghi đè cả hàng đợi user/module. Cùng một từ được áp dụng theo thứ tự thao tác trong hàng đợi; thao tác phát sinh sau không bị ACK cũ xóa.
- Web Locks tuần tự hóa gửi/ACK theo tài khoản và bài giữa các tab cùng origin. Chỉ xóa đúng operation khi server xác nhận; ACK vẫn được xử lý cho request đang chạy dù component đã unmount, không cập nhật UI đã đóng.
- Tab mới đọc lại toàn bộ operation còn chờ. Tự thử lại khi có mạng, focus hoặc storage event; vẫn có nút thử lại hiện tại. Không có Web Locks thì không gửi theo đường thiếu khóa; hiển thị lỗi tiến độ qua UI hiện có.
- Bản pending v1 được chuyển sang operation riêng dưới cùng khóa. Ghi bản mới trước khi xóa bản cũ. Lỗi storage giữ thông báo và dữ liệu trong bộ nhớ nếu có thể; không cam kết phục hồi sau đóng tab khi trình duyệt từ chối lưu.
- Kiểm chứng: 11/11 tests bộ đồng bộ, toàn bộ frontend 52/52; TypeScript và production build đạt. Hai controller thật dùng chung Storage và lock giả để kiểm tra offline, đóng/mở lại, lưu đồng thời, thao tác ngược chiều, ACK sau unmount, migration, cách ly user/module và thiếu khóa.
- Giới hạn: chưa chạy E2E hai tab với tài khoản thật/Web Locks thật trong lượt này. Không thay cơ chế học thử guest hoặc xử lý xung đột giữa thiết bị khác nhau. Khi phát hành cần tải lại các tab đang dùng phiên bản cũ để tránh client cũ tiếp tục ghi key v1. Build kiểm chứng dùng API origin giả; không dùng artifact đó để deploy.

Review: đăng nhập cùng tài khoản, mở cùng bài ở hai tab, chặn request API, đánh dấu hai từ khác nhau, đóng/mở lại rồi nối mạng; cả hai từ phải được giữ. Sau đó thử đánh dấu/bỏ thuộc cùng một từ khi request trước chưa trả về. Dừng tại L1 để user review trước L2.

## Kết luận gốc trước khi sửa L1–L4

Còn 2 lỗi P1 nên xử lý trước beta và 3 lỗi P2 ảnh hưởng trải nghiệm. Các sửa trước đã cải thiện luồng chính nhưng test pass chưa bao phủ các tình huống dưới đây.

### L1 — P1: Mất bản tiến độ chờ lưu giữa nhiều tab

`src/app/screens/study/studyProgressSync.ts:36` ghi toàn bộ pending vào cùng key theo user/module. Mỗi controller giữ một pending riêng và không merge/khóa hoặc nhận storage event. Khi hai tab cùng mở một bài, mất mạng, tab A đánh dấu từ 101 rồi tab B đánh dấu từ 102, localStorage cuối chỉ còn từ 102. Đóng cả hai tab sẽ mất thay đổi 101 chưa lên server.

Đã tái hiện bằng hai instance createStudySync thật, chung Storage giả và write trả lỗi offline: `{"completedTabs":[],"vocabulary":[{"id":102,"mastered":true}]}`. Không ghi database. Đây là lỗi hàng đợi frontend; transaction lock server không bảo vệ localStorage.

Đề xuất: hàng đợi theo operation/tab với ID riêng, đồng bộ/khóa lúc merge và ACK; test nhiều tab offline, save chồng nhau và đóng/mở lại.

### L2 — P1: Quiz không gắn phiên bản đề lúc nộp

`backend/src/services/quiz.service.ts:30` đọc câu hỏi hiện tại; dòng 69 chấm selectedIndex với correctIndex hiện tại. Frontend gửi moduleId/answers/timeTaken (`src/app/services/api.ts:215`), không có revision đề. Khi admin/import đổi thứ tự lựa chọn nhưng giữ questionId trong lúc học viên đang làm, lựa chọn đúng trên màn hình cũ có thể bị chấm sai. Thêm câu mới cũng thay đổi mẫu số điểm của lượt đang làm.

Đã gọi QuizService thật với Prisma stub: người học chọn A ở index 0; dữ liệu lúc nộp đổi A sang index 1. Service nhận và trả score 0/passed false, không báo đề đã đổi. Không ghi database. quizRevision phía client chỉ so với dữ liệu đang có trong bộ nhớ, không so phiên bản server khi nộp.

Đề xuất: server phát hành revision/snapshot đề; submit kèm revision và trả 409 nếu không còn khớp, hoặc chấm theo snapshot của attempt.

### L3 — P2: Lỗi tải tiến độ khóa cả công cụ học

`src/app/screens/study/ModuleStudyViewer.tsx:211` đặt disabled trên fieldset bao toàn bộ tab học khi study.ready=false (trừ Quiz). Nếu nội dung đã tải nhưng GET study progress lỗi, nút phát giọng đọc, đổi hội thoại, hiện nghĩa và bài tập cũng bị vô hiệu hóa, dù chỉ cần chặn thao tác ghi tiến độ. Xác nhận từ code, chưa chạy browser giả lập lỗi trong lượt này.

Đề xuất: chỉ khóa nút ghi tiến độ/đánh dấu đã thuộc; giữ thao tác đọc/nghe/xem ví dụ hoạt động.

### L4 — P2: Nút Roadmap trên thanh điều hướng không thoát bài hiện tại

`src/app/App.tsx:67`: navigate('learning') giữ nguyên page nếu đã là learning, và không đổi URL khi pathname đã /learning. `LearningPage.tsx:30` chỉ lấy moduleId lúc khởi tạo, activeStudyModuleId tiếp tục trỏ bài hiện tại. Vì vậy trong /learning?moduleId=7, bấm Roadmap trên nav không quay về tổng quan. Nút Quay lại lộ trình bên trong bài vẫn có tác dụng. Xác nhận từ luồng state/code, chưa browser E2E lượt này.

Đề xuất: điều hướng dùng pathname + query làm nguồn trạng thái thống nhất; bấm Roadmap xóa moduleId và reset activeStudyModuleId, đồng thời xử lý back/forward.

### L5 — P2: Tải bài và nộp quiz chưa có timeout ứng dụng

`src/app/services/api.ts:137` và `:215` không truyền AbortSignal timeout, khác các API catalog/study progress đã có 15 giây. Nếu kết nối treo mà fetch chưa reject, màn hình tải bài hoặc isSubmitting có thể chờ lâu không có cơ chế thoát của ứng dụng. Viewer lỗi cũng chỉ có nút quay lại, không có tải lại tại chỗ. Xác nhận từ code, chưa mô phỏng kết nối treo trên browser.

Đề xuất: timeout + lỗi dễ hiểu + retry giữ nguyên đáp án. Khi retry quiz cần tính cả trường hợp server đã ghi nhưng response thất lạc; nên có khóa idempotency cho attempt để tránh tạo lịch sử trùng.

## Phần đã kiểm chứng

- Frontend: `node --test scripts/*.test.mjs` — 47/47 đạt.
- Backend: `npm test` — 25/25 đạt khi cho phép test HTTP loopback. Trong sandbox test Jisho HTTP endpoint báo fetch failed; chạy ngoài sandbox đạt, không kết luận đó là lỗi sản phẩm.
- Frontend và backend `tsc --noEmit` không báo lỗi.
- Luồng chấm quiz ngưỡng 70%, câu bỏ trống, ID sai/lặp, index ngoài lựa chọn và giữ COMPLETED khi thi lại trượt đã có test đạt.
- Catalog công khai tách tiến độ; trạng thái UNKNOWN không bị gán thành chưa học; lọc published và phân quyền preview được đối chiếu code.
- Không chạy lại PostgreSQL smoke hoặc E2E tài khoản thật/nhiều thiết bị trong lượt này. Không xác nhận production origin/cookie/migration hoặc Jisho hosting hoạt động từ kết quả unit test.

Thứ tự đề xuất: L1 → L2 → L3 → L4 → L5. Giữ cách làm từng phần rồi dừng để user review.
