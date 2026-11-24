import { Heart } from 'lucide-react';
import { contactEmail, donateQr, donateUrl, supportEnabled } from '../data/siteInfo';

const sources: { name: string; href: string; note: string }[] = [
  {
    name: 'Jisho.org · JMdict',
    href: 'https://jisho.org/about',
    note: 'Kết quả tra từ điển trực tuyến. Dữ liệu JMdict thuộc Electronic Dictionary Research and Development Group, giấy phép CC BY-SA 4.0.',
  },
  {
    name: 'KanjiVG',
    href: 'https://kanjivg.tagaini.net/',
    note: 'Dữ liệu thứ tự nét chữ, © Ulrich Apel, giấy phép CC BY-SA 3.0.',
  },
  {
    name: 'kanji-data',
    href: 'https://github.com/davidluzgouveia/kanji-data',
    note: 'Danh sách 2.136 Hán tự thường dùng (joyo) dùng để lập kế hoạch bài học, giấy phép MIT.',
  },
  {
    name: 'Google Fonts',
    href: 'https://fonts.google.com/',
    note: 'Phông chữ Be Vietnam Pro, Noto Sans JP, Noto Serif JP, Fraunces và JetBrains Mono, giấy phép SIL Open Font License.',
  },
];

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto py-12 px-6 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs tracking-widest uppercase text-accent font-medium">Giới thiệu</p>
        <h1 className="text-3xl md:text-4xl font-medium text-foreground">Về LearnJP</h1>
      </header>
      <section className="flex flex-col gap-3 text-foreground/80 leading-relaxed">
        <p>
          LearnJP là trang học tiếng Nhật miễn phí dành cho người Việt, đi theo lộ trình JLPT từ N5 đến N1. Mỗi bài học
          gồm từ vựng, Hán tự, ngữ pháp, hội thoại, bài nghe, bài đọc, bài viết và một bài kiểm tra; mỗi cấp độ có thêm
          đề thi thử.
        </p>
        <p>
          Nội dung bài học do LearnJP tự biên soạn. Đây là tài liệu luyện tập, không phải đề thi JLPT chính thức và
          không liên kết với đơn vị tổ chức kỳ thi JLPT.
        </p>
      </section>

      <section id="ung-ho" className="flex flex-col gap-3 scroll-mt-20">
        <h2 className="text-xl font-medium text-foreground">Ủng hộ LearnJP</h2>
        <p className="text-foreground/80 leading-relaxed">
          LearnJP không thu phí và hiện không có quảng cáo. Chi phí tên miền và vận hành do người làm trang tự chi trả.
          {supportEnabled
            ? ' Nếu trang giúp ích cho bạn, bạn có thể ủng hộ để trang tiếp tục hoạt động.'
            : ' Cách đơn giản nhất để ủng hộ lúc này là giới thiệu trang cho người đang học tiếng Nhật.'}
        </p>
        {donateUrl && (
          <a
            href={donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-5 py-3 flex items-center gap-2 self-start"
          >
            <Heart size={16} /> Ủng hộ LearnJP
          </a>
        )}
        {donateQr && (
          <figure className="flex flex-col items-start gap-2">
            <img
              src={donateQr}
              alt="Mã QR chuyển khoản ủng hộ LearnJP"
              width={264}
              height={318}
              loading="lazy"
              className="w-64 h-auto border border-border bg-white"
            />
            <figcaption className="text-sm text-muted-foreground">
              Quét bằng ứng dụng ngân hàng hoặc ví điện tử. Cảm ơn bạn!
            </figcaption>
          </figure>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-medium text-foreground">Nguồn dữ liệu và ghi công</h2>
        <ul className="flex flex-col gap-3">
          {sources.map(source => (
            <li key={source.name} className="flex flex-col gap-1 border-l-2 border-border pl-4">
              <a
                className="text-accent underline underline-offset-4 self-start"
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.name}
              </a>
              <span className="text-sm text-foreground/80 leading-relaxed">{source.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-medium text-foreground">Liên hệ</h2>
        <p className="text-foreground/80 leading-relaxed">
          Góp ý, báo lỗi nội dung hoặc đề nghị hợp tác xin gửi tới{' '}
          <a className="text-accent underline underline-offset-4" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          .
        </p>
      </section>
    </article>
  );
}
