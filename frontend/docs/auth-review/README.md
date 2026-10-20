# Phần 1: Tài khoản học viên — 03/10/2026

Đã triển khai đăng ký, đăng nhập, đăng xuất cho web PC và responsive trên điện thoại. Dừng ở phần này để người dùng kiểm tra trước khi sửa đáp án/quiz.

## Hành vi mới

- Nút Đăng nhập luôn có trên thanh điều hướng; sau đăng nhập đổi thành Tài khoản.
- Form tiếng Việt: email, username 3–30 ký tự, mật khẩu 8–128 ký tự, nhập lại mật khẩu, hiện/ẩn mật khẩu, trạng thái đang xử lý và lỗi có thể thử lại.
- Đăng ký dùng API hiện tại; backend tự gán USER, frontend không cấp quyền quản trị.
- Hộp thoại mở ngay trên trang; URL bài học và câu trả lời đang chọn không bị mất khi mở/đóng form. Sau đăng nhập có thể chủ động nộp quiz.
- Khách thấy thông báo học thử, không gửi request lưu tiến độ/nộp quiz yêu cầu xác thực. Home/Roadmap không gọi progress của khách nữa.
- Guest progress và progress từng tài khoản không trộn lẫn. Chưa chuyển dữ liệu học thử vào tài khoản; có thông báo rõ.
- Đăng xuất cập nhật UI ngay, xóa session kể cả khi lỗi kết nối và không để câu trả lời của tài khoản trước xuất hiện cho tài khoản sau.
- Menu Admin chỉ hiện với ADMIN/MODERATOR. Backend vẫn chịu trách nhiệm phân quyền.
- Đăng nhập sai không kích hoạt refresh session. Phiên hết hạn có thể refresh; xử lý cả trường hợp 401 khi còn là khách rồi đăng nhập sau đó.
- Các layout mới dùng flex. Menu thu gọn dưới 1024px để tránh chen chúc nút tài khoản.

## Đã kiểm tra

- 7/7 test API client bằng mock: đăng ký USER, đăng nhập USER, thông tin sai, logout mất mạng, refresh access token, refresh hết hạn, phục hồi sau guest 401. Không tạo tài khoản thật trong database để chạy bộ test này.
- Chạy bằng `node --test scripts/auth-client.test.mjs`.
- Browser: mở form, đổi đăng nhập/đăng ký, xác nhận mật khẩu không khớp, lỗi máy chủ không hoạt động, sai thông tin đăng nhập qua backend local.
- Browser: guest vào N5 module 7, chọn 1 đáp án quiz, mở đăng nhập từ nút nộp, đóng form: vẫn 1/15, URL giữ nguyên.
- Kiểm tra form tại 375, 390, 768 và 1440px; không thấy tràn ngang. Form dài có cuộn dọc. Ảnh PC/mobile nằm cùng thư mục.
- Production build chạy thành công. TypeScript vẫn có 8 lỗi có sẵn trong báo cáo audit, không có lỗi mới do phần tài khoản. Các lỗi callback/quiz/empty-state sẽ xử lý ở phần sau sau khi được xác nhận.

Chưa chạy đăng ký/đăng nhập thành công end-to-end với tài khoản thật trong database hiện tại; đường thành công đã được kiểm tra bằng API mock. Chưa xác minh bàn phím ảo trên thiết bị điện thoại thật.

## Cách kiểm tra thủ công

1. Mở website, chọn Đăng nhập → Đăng ký. Kiểm tra form trên PC và điện thoại.
2. Tạo tài khoản thử nghiệm của bạn; thanh điều hướng phải chuyển thành Tài khoản. Tài khoản này là USER và không có menu Admin.
3. Tải lại trang: vẫn nhận diện tài khoản. Mở Tài khoản → Đăng xuất; sau đó đăng nhập lại bằng username hoặc email.
4. Khi chưa đăng nhập, mở bài N5 → Quiz, chọn một đáp án → Đăng nhập để nộp bài. Đăng nhập xong phải còn đáp án đã chọn và vẫn ở bài đó.
5. Thử mật khẩu sai, username trùng/email trùng, mật khẩu xác nhận khác nhau; kiểm tra thông báo và khả năng sửa lại.

Chưa dùng việc nộp quiz đạt hoặc nút Hoàn thành Unit để đánh giá phần này: các lỗi đã ghi nhận ở hai luồng đó chưa thuộc phần sửa tài khoản.
