# N5 — gói sửa nội dung và TTS beta

Cập nhật 19/10/2026, sau CF5. Người dùng chọn dùng giọng đọc tự động TTS cho beta,
ghi nhãn rõ ràng. Gói 424 thay đổi / 385 dòng đã áp dụng vào D1 local chính;
chưa chuyển sang CF6, chưa deploy remote hoặc xuất bản các section DRAFT.

## Trạng thái chính xác

Đã hoàn thiện code TTS và gói sửa nội dung có thể tái tạo, kiểm tra trên D1 biệt lập.
**Chưa coi toàn bộ khóa N5 đã được duyệt xuất bản.** 120 section vẫn là DRAFT trong
snapshot gốc và database chính. Candidate đã áp dụng vào database local chính qua
backup + batch có guard; snapshot gốc được kiểm tra checksum của CF2 vẫn giữ nguyên.
Chi tiết: [N5-LOCAL-CONTENT-APPLIED.md](N5-LOCAL-CONTENT-APPLIED.md).

## Đã sửa trong candidate

- 23 bài sắp xếp: thay chỉ số một mảnh câu bằng đáp án nguyên câu đã đối chiếu với
  các mảnh. Giao diện cho phép chọn nhiều mảnh theo thứ tự, bỏ mảnh và làm lại;
  hiển thị câu ghép để tự đối chiếu đáp án mẫu, không tự chấm sai câu có cách xếp khác.
- 36 liên kết bài nghe và 35 liên kết bài đọc được xác định tường minh theo ngữ cảnh.
  Các câu phụ thuộc bản nháp được server ẩn; câu đọc chuyển về bên dưới bài đọc,
  không xuất hiện trùng trong danh sách bài tập chung.
- Bổ sung bản dịch hai bài đọc Unit 1 (ID 9, 10). Giữ xuống dòng ở hồ sơ, bản dịch
  và bài viết mẫu để nội dung không dính thành một dòng.
- Sửa câu nghe 361: B muốn đọc sách, A mới là người muốn mượn sách; đáp án đúng là Sai.
- Sửa tình huống mơ hồ ở Unit 1, cách hỏi ở câu 109/468, nghĩa quá khứ câu 474 và
  nghĩa khớp mảnh câu ở 293/437. Danh sách before/after có trong JSON.
- 24 bài nghe chọn `audioUrl: "TTS:ja-JP"`, bỏ thời lượng giả (`durationSeconds:null`).
  Đây là marker nội bộ, không phải URL media; không đưa vào thẻ `<audio>`.

Tổng cộng **424 thay đổi trên 385 dòng nội dung**, gồm **66 câu Quiz chấm điểm**
được sửa qua các đợt. Không sửa N4, đề mock hoặc tự đổi trạng thái publication.
Quiz được sửa đáp án/lời giải, bổ sung ngữ cảnh và đưa đoạn trích vào đề để không
phụ thuộc bài đọc DRAFT. Chi tiết: [N5-QUIZ-REVIEW.md](N5-QUIZ-REVIEW.md).
Đợt tiếp theo đã sửa và áp dụng 19 bài tập + 3 phiên âm; xem
[N5-EXERCISE-REVIEW-2026-10-18.md](N5-EXERCISE-REVIEW-2026-10-18.md).
Đợt Unit 1 áp dụng thêm 10 dòng, gồm 4 Quiz, 3 bài tập,
2 cách đọc và 1 ví dụ từ vựng: [báo cáo Unit 1](N5-UNIT1-REVIEW-2026-10-18.md).
Đợt Unit 2 và áp dụng 16 dòng, gồm 4 Quiz, 4 bài tập, bài viết, hội thoại,
phiên âm, ví dụ và chủ đề: [báo cáo Unit 2](N5-UNIT2-REVIEW-2026-10-18.md).
Đợt Unit 3, áp dụng 19 dòng và đồng bộ 3 mục tìm kiếm:
[báo cáo Unit 3](N5-UNIT3-REVIEW-2026-10-18.md).
Đợt Unit 4, áp dụng 21 dòng và đồng bộ 2 mục tìm kiếm:
[báo cáo Unit 4](N5-UNIT4-REVIEW-2026-10-18.md).
Đợt Unit 5, áp dụng 19 dòng và đồng bộ 4 mục tìm kiếm:
[báo cáo Unit 5](N5-UNIT5-REVIEW-2026-10-18.md).
Đợt Unit 6, áp dụng 24 dòng và đồng bộ 6 mục tìm kiếm:
[báo cáo Unit 6](N5-UNIT6-REVIEW-2026-10-18.md).
Đợt Unit 7, áp dụng 18 dòng và đồng bộ 3 mục tìm kiếm:
[báo cáo Unit 7](N5-UNIT7-REVIEW-2026-10-18.md).
Đợt Unit 8, áp dụng 26 dòng và đồng bộ 7 mục tìm kiếm:
[báo cáo Unit 8](N5-UNIT8-REVIEW-2026-10-18.md).
Đợt Unit 9, áp dụng 23 dòng và đồng bộ 5 mục tìm kiếm:
[báo cáo Unit 9](N5-UNIT9-REVIEW-2026-10-18.md).
Đợt Unit 10, áp dụng 25 dòng và đồng bộ 5 mục tìm kiếm:
[báo cáo Unit 10](N5-UNIT10-REVIEW-2026-10-19.md).
Đợt Unit 11, áp dụng 29 dòng và đồng bộ 7 mục tìm kiếm:
[báo cáo Unit 11](N5-UNIT11-REVIEW-2026-10-19.md).
Đợt mới nhất rà Unit 12, áp dụng 21 dòng và đồng bộ 5 mục tìm kiếm:
[báo cáo Unit 12](N5-UNIT12-REVIEW-2026-10-19.md).

## Code TTS

- Nhãn “Bản beta · Giọng đọc tự động (TTS), chưa có bản thu người thật”.
- Dùng giọng Nhật của thiết bị, giữ lời thoại cho trường hợp không có giọng.
  Chờ danh sách giọng tối đa 2 giây; không chọn giọng ngôn ngữ khác để đọc tiếng Nhật.
- Có nút dừng, hủy hàng đợi khi đổi phần/rời trang. Bỏ nhãn người nói A/B/店員/男…
  trước khi đọc từng dòng; vẫn giữ nguyên nội dung hiển thị.
- Không phản hồi bắt đầu trong 10 giây hoặc không kết thúc trong 180 giây thì dừng
  và báo lỗi, tránh treo trạng thái phát. Người dùng có thể thử lại.
- Guard xuất bản ở server và admin UI chấp nhận marker Nhật có lời thoại không rỗng.
  `PENDING_AUDIO`, marker TTS khác ngôn ngữ và TTS không có lời thoại vẫn bị chặn.
  Kiểm tra lại trong batch để chặn race xóa lời thoại trong lúc xuất bản.

TTS phụ thuộc giọng và khả năng của thiết bị. Chưa chứng nhận âm thanh thực nghe,
chất lượng ngữ điệu, hay Safari iOS/Chrome Android trên máy thật.

## Kiểm chứng

- Đợt Unit 12: **32/32 D1 và 25/25 HTTP** đạt; cập nhật 21 dòng/4 Quiz và 5 mục tìm
  kiếm, có backup. Kiểm tra đề/rubric khớp nguồn, đáp án, publication guard và rollback;
  chạy lại không ghi thêm, 18 bảng và chỉ mục khớp candidate.

- Đợt Unit 11: **30/30 D1 và 24/24 HTTP** đạt; cập nhật 29 dòng/4 Quiz và 7 mục tìm
  kiếm, có backup. Kiểm tra ví dụ ngữ pháp, bộ thủ, đề một đáp án, guard và rollback;
  chạy lại không ghi thêm, 18 bảng và chỉ mục khớp candidate.

- Đợt Unit 10: **28/28 D1 và 23/23 HTTP** đạt; cập nhật 25 dòng/5 Quiz và 5 mục tìm
  kiếm, có backup. Kiểm tra kana hội thoại, version cha, nguồn nghe/đọc, đáp án,
  guard và rollback. Chạy lại không ghi thêm, 18 bảng và chỉ mục khớp candidate.

- Đợt Unit 9: **26/26 D1 và 22/22 HTTP** đạt; cập nhật 23 dòng/5 Quiz và 5 mục tìm
  kiếm, có backup. Sửa transport ECONNRESET khi chuẩn bị batch lớn ở script local;
  giữ một batch, guard và rollback. Chạy lại không ghi thêm, 18 bảng và chỉ mục khớp.

- Đợt Unit 8: **24/24 D1 và 21/21 HTTP** đạt; cập nhật 26 dòng/3 Quiz và 7 mục tìm
  kiếm, có backup. Kiểm tra nguồn lời thoại, giới hạn câu viết, guard và rollback;
  chạy lại không ghi thêm, 18 bảng và chỉ mục khớp candidate.

- Đợt Unit 7: **22/22 D1 và 20/20 HTTP** đạt; cập nhật 18 dòng/3 Quiz và 3 mục tìm
  kiếm, có backup. Lỗi transport ở lần chạy cũ không tái hiện khi chạy lại tuần tự;
  không nới guard hoặc tách batch. Chạy lại công cụ áp dụng không ghi thêm.

- Đợt Unit 6: **20/20 D1 và 19/19 HTTP** đạt; cập nhật 24 dòng/4 Quiz và 6 mục tìm
  kiếm, có backup. Kiểm tra âm Kanji, guard/rollback; chạy lại không ghi thêm.

- Đợt Unit 5: **18/18 D1 và 18/18 HTTP** đạt; cập nhật 19 dòng/4 Quiz và 4 mục tìm
  kiếm, có backup. Chạy lại không ghi thêm; 18 bảng nội dung và chỉ mục khớp candidate.

- Đợt Unit 4: **17/17 D1 và 17/17 HTTP** đạt; cập nhật 21 dòng/4 Quiz và 2 mục tìm
  kiếm, có backup. Chạy lại không ghi thêm; toàn bộ 18 bảng và chỉ mục khớp candidate.

- Đợt Unit 3: **16/16 D1 và 16/16 HTTP** đạt; áp dụng 19 dòng/4 Quiz và 3 mục tìm
  kiếm cùng batch, có backup nội dung/chỉ mục. Chạy lại không ghi thêm; 18 bảng và
  696 mục tìm kiếm khớp. Unit 2 trước đó đạt 14/14 D1 và 15/15 HTTP.

- Đợt Unit 1: **12/12 D1 và 15/15 HTTP** đạt; đã áp dụng 10 dòng vào database local
  chính, backup đầy đủ nội dung và chạy lại không ghi thêm.
- Đợt bài tập/phiên âm: **11/11** test D1, chạy lại riêng kiểm thử nâng cấp sau sửa
  cách diễn đạt câu 441 **1/1**, và **15/15 HTTP** trên database chính đạt.
- Các số kiểm thử ở các mục dưới là lịch sử của từng gói, không cộng dồn thành một suite mới.
- Sau áp dụng: **10/10** test cập nhật/nội dung trên D1 tạm và **15/15** test HTTP
  trên website dùng database local chính đạt. Đối chiếu đủ 18 bảng nội dung và
  search index; chạy lại công cụ cập nhật trả 0 dòng cần ghi.
- Gói Quiz mới: **24/24** kiểm thử đạt (7 nội dung/candidate + 17 nghiệp vụ học viên).
  Đã kiểm tra chấm 18 câu sửa qua D1, revision cũ bị từ chối, context tự đủ khi bài
  đọc DRAFT và không cộng XP hoàn thành lần hai. Log: `.local/n5-quiz-review-tests.log`.
- Các kết quả frontend/admin/build dưới đây thuộc gói TTS trước; không chạy lại
  frontend/build trong lượt sửa dữ liệu Quiz này.
- Frontend: **74/74** test đạt, gồm token lặp, ghép câu và các trường hợp lỗi TTS.
- Nhóm D1 nội dung/admin: **19/19** test đạt. Bao gồm round-trip candidate, FK,
  draft ancestry, đáp án, liên kết nguồn và race khi xuất bản TTS.
- FE TypeScript + Vite build, Worker TypeScript: đạt.
- Các số 74 root / 70 frontend trong CF5 là kết quả lịch sử, không phải lần chạy
  toàn bộ root suite trong lượt này. Chạy các nhóm liên quan đến thay đổi mới.
- Lượt trước đã thao tác ghép câu 私はベトナム人です và mở đáp án đầy đủ trong UI
  xem thử Unit 1 không có bài nghe. Lượt này công cụ browser báo bị tắt trong Work
  settings, nên UI TTS/responsive sau thay đổi **chưa được xác nhận lại**.

## File và cách tái tạo

- `scripts/n5-review-corrections.mjs`: danh sách đáp án/liên kết/editorial tường minh.
- `scripts/n5-content-review.mjs`: kiểm tra checksum, tạo candidate và báo cáo; không
  thực thi SQL hay truy cập remote.
- [N5-CONTENT-REVIEW.json](N5-CONTENT-REVIEW.json): danh sách module/ID và before/after.
- `.local/content-review/n5-candidate.json`: toàn bộ snapshot đề xuất sau sửa.

```powershell
node scripts/n5-content-review.mjs
node --test scripts/n5-content-review.test.mjs scripts/cloudflare-admin.test.mjs
node scripts/build-cloudflare.mjs
node scripts/preview-cf5.mjs --review-unit1
```

Lệnh cuối tạo database mới `.local/n5-review-preview-*`, mở riêng Unit 1 ở database
thử gồm TTS trên `http://127.0.0.1:8787/learning?moduleId=7`. Nó không phải lệnh áp
dụng candidate hay xuất bản ở database chính. Tài khoản giả: `cf5_learner`, mật khẩu
`CF5-local-only-123`; chỉ dùng ở môi trường localhost tạm này. Ctrl+C để dừng.

Checksum gốc:
`f6179bfab8b0180c4e1a98fa6aab4fe944454593319f3ecf6c491a9c54b7788f`.
Checksum candidate:
`60353ac086dc7196a596e07de330355618e88e50686b4ab482388496e196c6e6`.

## Việc còn lại theo ưu tiên

1. **Đã rà nội dung ở local:** Unit 1–12 trong 12 module N5 mở đều có báo cáo riêng,
   bao gồm bài tập/từ vựng/Kanji/ngữ pháp/hội thoại/bài viết/bản dịch.
   **Còn duyệt xuất bản:** người dùng kiểm tra các gói sửa; chưa tự công khai section.
   Lỗi mất bản nháp bài viết đã sửa, xem [biên bản](N5-WRITING-DRAFT-2026-10-18.md).
2. **P0 trước beta:** kiểm tra UI TTS trên browser/thiết bị thật, ghép câu trên mobile,
   nghe/đọc có dữ liệu và lưu tiến độ; chốt danh sách section được xuất bản theo bài.
   Unit 1 là bản xem thử đầu tiên, không mặc định 12 bài đều đã duyệt.
3. **Đã xong ở local:** áp dụng nội dung với backup và guard checksum/version,
   xác nhận API từ database chính. **Còn lại:** dùng quy trình tương ứng khi chuẩn
   bị database staging/production tại CF6; không coi local là đã deploy remote.

Dừng sau gói này để người dùng kiểm tra; giữ nguyên ranh giới giữa sửa code,
candidate nội dung, database local chính và môi trường Cloudflare thực tế.
