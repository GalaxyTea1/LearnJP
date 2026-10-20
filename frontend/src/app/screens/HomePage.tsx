import { openStudyModule } from "../services/navigation";
import { ArrowRight, BookOpen, Languages, PenTool, Search } from 'lucide-react';
import type { Page } from '../data/basicData';
import { useAuth } from '../components/auth/AuthProvider';
import { summarizeCourse } from '../services/courseSummary';
import { useCourseCatalog } from '../services/useCourseCatalog';
import { translationEnabled } from '../services/features';

export default function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const { user, checking } = useAuth();
  const catalog = useCourseCatalog(user?.id, checking);
  const course = summarizeCourse(catalog.modules, 'N5');
  const next = course.next;
  const continuing = !!user && next?.status === 'IN_PROGRESS';
  const start = () => {
    if (next) openStudyModule(next.id);
    else setPage('learning');
  };
  return <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 space-y-12">
    <section className="flex flex-col md:flex-row gap-8 md:gap-12">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold tracking-widest text-accent uppercase">Tiếng Nhật N5 · Bản thử nghiệm</p>
        <h1 className="text-3xl md:text-5xl font-medium leading-tight mt-4">Học từng bài, vững từng bước.</h1>
        <p className="text-muted-foreground leading-relaxed mt-5">Bắt đầu với từ vựng, Hán tự và ngữ pháp N5. Ôn kiến thức bằng quiz từng bài và luyện viết khi cần.</p>
        <div className="flex flex-wrap gap-3 mt-7">
          <button onClick={() => setPage('learning')} className="px-5 py-3 bg-foreground text-background flex items-center gap-2">Xem khóa học N5 <ArrowRight size={16} /></button>
          <button onClick={() => setPage('writing')} className="px-5 py-3 border border-border">Luyện viết</button>
        </div>
      </div>
      <div className="flex-1 min-w-0 border border-border bg-card p-6 md:p-8" aria-live="polite">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Bài học của bạn</p>
        {catalog.loading ? <p className="mt-5">Đang tải khóa học…</p> : catalog.error ? <div className="mt-5"><p>Chưa tải được khóa học và tiến độ.</p><button onClick={catalog.retry} className="mt-4 text-accent underline">Thử lại</button></div> : catalog.progressLoading ? <p className="mt-5">Đang tải tiến độ tài khoản… Bạn vẫn có thể xem khóa học bên dưới.</p> : catalog.progressError ? <div className="mt-5" role="status"><p>Chưa tải được tiến độ tài khoản. Nội dung khóa học vẫn có sẵn.</p><button onClick={catalog.retryProgress} className="mt-4 text-accent underline">Thử lại tiến độ</button></div> : next ? <>
          <h2 className="text-xl font-semibold mt-5">Bài {next.unitNumber}: {next.title}</h2>
          <p className="text-sm text-muted-foreground mt-3">{continuing ? `Tiến độ đã lưu: ${next.progressPercent}%` : 'Học theo thứ tự bài để xây dựng nền tảng N5.'}</p>
          <button onClick={start} className="mt-6 px-5 py-3 bg-accent text-accent-foreground flex items-center gap-2">{continuing ? 'Tiếp tục bài đang học' : 'Bắt đầu học N5'} <ArrowRight size={16} /></button>
        </> : <><h2 className="text-xl mt-5">{course.count ? 'Ôn lại các bài N5' : 'Nội dung N5 đang được chuẩn bị'}</h2>{course.count > 0 && <button onClick={() => setPage('learning')} className="mt-5 underline text-accent">Xem bài học</button>}</>}
        {!user && <p className="mt-5 text-xs text-muted-foreground leading-relaxed">Bạn có thể học thử. Tiến độ học thử nằm trên trình duyệt này; đăng nhập để lưu vào tài khoản. Mở lại bài đã học để tiếp tục bản lưu trên máy.</p>}
      </div>
    </section>
    <section>
      <h2 className="text-xl font-semibold">Nội dung N5 đang mở</h2>
      {catalog.loading ? <p className="mt-4 text-muted-foreground">Đang tải số lượng nội dung…</p> : catalog.error ? <p className="mt-4 text-muted-foreground">Chưa có số liệu. <button onClick={catalog.retry} className="underline text-accent">Thử lại</button></p> : <>
        <div className="flex flex-wrap border border-border mt-5">{[[course.count, 'Bài công khai'], [course.vocabulary, 'Mục từ vựng'], [course.kanji, 'Mục Hán tự'], [course.grammar, 'Mục ngữ pháp']].map(([value, label]) => <div key={label} className="flex-1 basis-1/2 sm:basis-0 min-w-0 p-5"><p className="text-2xl font-semibold">{value}</p><p className="text-sm text-muted-foreground mt-1">{label}</p></div>)}</div>
        <p className="text-xs text-muted-foreground mt-3">Đếm các mục trong bài công khai; một từ hoặc Hán tự có thể xuất hiện ở nhiều bài.</p>
        {user && !catalog.progressLoading && !catalog.progressError && <p className="text-sm mt-3">Đã hoàn thành {course.completed}/{course.count} bài công khai.</p>}
      </>}
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">Bản thử nghiệm tập trung vào N5; các cấp độ khác đang được chuẩn bị. Chưa có đề thi thử N5 đầy đủ hoặc chứng nhận. Phần nghĩa của nội dung học hiện chủ yếu bằng tiếng Anh.</p>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-5">Công cụ học tập</h2>
      <div className="flex flex-wrap gap-4">{([
        ['learning', BookOpen, 'Bài học', 'Từ vựng, Hán tự, ngữ pháp và quiz'],
        ['dictionary', Search, 'Từ điển', 'Tra cứu từ khi học'],
        ['translate', Languages, 'Dịch văn bản', 'Tham khảo nghĩa của câu'],
        ['writing', PenTool, 'Luyện viết', 'Luyện nét chữ tiếng Nhật'],
      ] as const).filter(([page]) => page !== 'translate' || translationEnabled).map(([page, Icon, title, description]) => <button key={page} onClick={() => setPage(page)} className="flex-1 basis-full sm:basis-[calc(50%-1rem)] min-w-0 text-left border border-border p-5 hover:bg-muted/40"><Icon size={22} className="text-accent" /><h3 className="font-semibold mt-3">{title}</h3><p className="text-sm text-muted-foreground mt-2">{description}</p></button>)}</div>
    </section>
  </div>;
}
