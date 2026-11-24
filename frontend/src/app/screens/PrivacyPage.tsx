import { contactEmail, policyUpdated } from '../data/siteInfo';

const sections: { title: string; items: string[] }[] = [
  {
    title: 'Khi bạn học không cần tài khoản',
    items: [
      'Bạn có thể xem bài học, tra từ điển và làm bài kiểm tra mà không cần đăng nhập. Khi đó tiến độ, bản nháp bài viết và các lựa chọn của bạn chỉ được lưu trong trình duyệt của chính bạn (localStorage), không gửi lên máy chủ.',
      'Xóa dữ liệu trang web trong trình duyệt sẽ xóa các thông tin này.',
    ],
  },
  {
    title: 'Khi bạn tạo tài khoản',
    items: [
      'LearnJP lưu địa chỉ email, tên hiển thị, ảnh đại diện (nếu đăng nhập bằng Google) và mật khẩu ở dạng đã băm. LearnJP không bao giờ lưu mật khẩu gốc.',
      'Để đồng bộ giữa các thiết bị, LearnJP lưu tiến độ học, kết quả bài kiểm tra và đề thi thử, thẻ ôn tập, chuỗi ngày học và lịch sử tra từ của bạn.',
      'Phiên đăng nhập được giữ bằng một cookie bảo mật (HttpOnly). Cookie này chỉ dùng để đăng nhập, không dùng để theo dõi.',
    ],
  },
  {
    title: 'Dịch vụ bên thứ ba',
    items: [
      'Cloudflare: lưu trữ trang web và cơ sở dữ liệu, đồng thời ghi nhận số liệu truy cập ẩn danh (số lượt xem, trang được xem, quốc gia, loại thiết bị). Số liệu này không dùng cookie và không nhận diện từng người.',
      'Google: phông chữ (Google Fonts) và đăng nhập bằng Google nếu bạn chọn cách này.',
      'Supabase: gửi email xác nhận và đặt lại mật khẩu khi bạn đăng ký bằng email.',
      'Jisho.org: từ bạn tra trong từ điển được máy chủ LearnJP gửi tới Jisho để lấy kết quả; Jisho không nhận được thông tin tài khoản hay địa chỉ IP của bạn.',
    ],
  },
  {
    title: 'Những điều LearnJP không làm',
    items: [
      'Không bán hay chia sẻ dữ liệu cá nhân của bạn cho bên khác.',
      'Hiện không hiển thị quảng cáo và không dùng cookie theo dõi. Nếu điều này thay đổi, trang này sẽ được cập nhật trước.',
    ],
  },
  {
    title: 'Quyền của bạn',
    items: [
      `Bạn có thể yêu cầu xem, sửa hoặc xóa tài khoản và toàn bộ dữ liệu học tập bằng cách gửi email tới ${contactEmail} từ địa chỉ đã đăng ký.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto py-12 px-6 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs tracking-widest uppercase text-accent font-medium">Chính sách</p>
        <h1 className="text-3xl md:text-4xl font-medium text-foreground">Quyền riêng tư</h1>
        <p className="text-sm text-muted-foreground">Cập nhật lần cuối: {policyUpdated}</p>
      </header>
      <p className="text-foreground/80 leading-relaxed">
        LearnJP là trang học tiếng Nhật miễn phí. Trang này giải thích LearnJP lưu những thông tin gì về bạn và dùng
        chúng để làm gì.
      </p>
      {sections.map(section => (
        <section key={section.title} className="flex flex-col gap-3">
          <h2 className="text-xl font-medium text-foreground">{section.title}</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5 text-foreground/80 leading-relaxed">
            {section.items.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-medium text-foreground">Liên hệ</h2>
        <p className="text-foreground/80 leading-relaxed">
          Mọi câu hỏi về quyền riêng tư xin gửi tới{' '}
          <a className="text-accent underline underline-offset-4" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          .
        </p>
      </section>
    </article>
  );
}
