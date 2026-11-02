import { openStudyModule } from '../services/navigation';
import { ArrowRight, BookOpen, ClipboardCheck, Languages, PenTool, Search } from 'lucide-react';
import type { Page } from '../data/basicData';
import { useAuth } from '../components/auth/AuthProvider';
import { openLevels, summarizeCourse } from '../services/courseSummary';
import { useCourseCatalog } from '../services/useCourseCatalog';
import { translationEnabled } from '../services/features';

export default function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const { user, checking } = useAuth();
  const catalog = useCourseCatalog(user?.id, checking);
  const levels = openLevels(catalog.modules);
  const courses = levels.map(level => ({ level, ...summarizeCourse(catalog.modules, level) }));
  // Continue the lesson in progress; otherwise the first unstarted lesson in level order.
  const current = courses.find(c => c.modules.some(m => m.status === 'IN_PROGRESS')) ?? courses.find(c => c.next);
  const next = current?.next;
  const continuing = !!user && next?.status === 'IN_PROGRESS';
  const total = courses.reduce((n, c) => n + c.count, 0);
  const start = () => {
    if (next) openStudyModule(next.id);
    else setPage('learning');
  };
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 space-y-12">
      <section className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            {levels.length ? `Lộ trình ${levels.join(' → ')}` : 'Lộ trình theo cấp độ JLPT'}
          </p>
          <h1 className="text-3xl md:text-5xl font-medium leading-tight mt-4">Học từng bài, vững từng bước.</h1>
          <p className="text-muted-foreground leading-relaxed mt-5">
            {total > 0 && `${total} bài học từ ${levels[0]} đến ${levels[levels.length - 1]}. `}Mỗi bài gồm từ vựng, Hán
            tự, ngữ pháp, hội thoại, nghe và đọc, kết thúc bằng bài kiểm tra có giải thích. Học xong, bạn có thể làm đề
            thi thử bấm giờ như kỳ thi JLPT.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <button
              onClick={() => setPage('learning')}
              className="px-5 py-3 bg-foreground text-background flex items-center gap-2"
            >
              Xem lộ trình <ArrowRight size={16} />
            </button>
            <button onClick={() => setPage('tests')} className="px-5 py-3 border border-border flex items-center gap-2">
              <ClipboardCheck size={16} /> Làm đề thi thử
            </button>
          </div>
        </div>
        <div className="flex-1 min-w-0 border border-border bg-card p-6 md:p-8" aria-live="polite">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Bài học của bạn</p>
          {catalog.loading ? (
            <p className="mt-5">Đang tải khóa học…</p>
          ) : catalog.error ? (
            <div className="mt-5">
              <p>Không tải được khóa học. Hãy kiểm tra kết nối mạng.</p>
              <button onClick={catalog.retry} className="mt-4 text-accent underline">
                Thử lại
              </button>
            </div>
          ) : catalog.progressLoading ? (
            <p className="mt-5">Đang tải tiến độ…</p>
          ) : catalog.progressError ? (
            <div className="mt-5" role="status">
              <p>Không tải được tiến độ của bạn.</p>
              <button onClick={catalog.retryProgress} className="mt-4 text-accent underline">
                Thử lại
              </button>
            </div>
          ) : next && current ? (
            <>
              <p className="text-sm font-semibold text-accent mt-5">{current.level}</p>
              <h2 className="text-xl font-semibold mt-1">
                Bài {next.unitNumber}: {next.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-3">
                {continuing
                  ? `Bạn đã học được ${next.progressPercent}%`
                  : 'Học lần lượt từng bài để xây nền tảng vững chắc.'}
              </p>
              <button
                onClick={start}
                className="mt-6 px-5 py-3 bg-accent text-accent-foreground flex items-center gap-2"
              >
                {continuing ? 'Học tiếp' : 'Bắt đầu học'} <ArrowRight size={16} />
              </button>
              {!user && (
                <p className="mt-5 text-sm text-muted-foreground">
                  Đã có nền tảng?{' '}
                  <button onClick={() => setPage('learning')} className="underline text-accent">
                    Chọn cấp độ trong lộ trình
                  </button>
                </p>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl mt-5">{total ? 'Bạn đã học hết các bài hiện có' : 'Bài học sắp ra mắt'}</h2>
              {total > 0 && (
                <div className="flex flex-wrap gap-4 mt-5">
                  <button onClick={() => setPage('tests')} className="underline text-accent">
                    Làm đề thi thử
                  </button>
                  <button onClick={() => setPage('learning')} className="underline text-accent">
                    Ôn lại bài
                  </button>
                </div>
              )}
            </>
          )}
          {!user && (
            <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
              Học ngay không cần tài khoản. Đăng nhập để lưu tiến độ và học tiếp trên thiết bị khác.
            </p>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Khóa học có gì</h2>
        {catalog.loading ? (
          <p className="mt-4 text-muted-foreground">Đang tải…</p>
        ) : catalog.error ? (
          <p className="mt-4 text-muted-foreground">
            Không tải được.{' '}
            <button onClick={catalog.retry} className="underline text-accent">
              Thử lại
            </button>
          </p>
        ) : (
          <div className="flex flex-col md:flex-row border border-border mt-5">
            {courses.map(c => (
              <div
                key={c.level}
                className="flex-1 min-w-0 p-5 border-b md:border-b-0 md:border-r last:border-0 border-border"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-2xl font-semibold">{c.level}</p>
                  <p className="text-sm text-muted-foreground">{c.count} bài</p>
                </div>
                <div className="flex mt-4">
                  {[
                    [c.vocabulary.toLocaleString('vi-VN'), 'Từ vựng'],
                    [c.kanji.toLocaleString('vi-VN'), 'Hán tự'],
                    [c.grammar, 'Ngữ pháp'],
                  ].map(([value, label]) => (
                    <div key={label} className="flex-1 min-w-0">
                      <p className="font-semibold">{value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{label}</p>
                    </div>
                  ))}
                </div>
                {user && !catalog.progressLoading && !catalog.progressError && c.count > 0 && (
                  <p className="text-xs mt-4">
                    Đã hoàn thành {c.completed}/{c.count} bài
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-5">Công cụ học tập</h2>
        <div className="flex flex-wrap gap-4">
          {(
            [
              ['learning', BookOpen, 'Bài học', 'Từ vựng, Hán tự, ngữ pháp và bài kiểm tra'],
              ['tests', ClipboardCheck, 'Thi thử', 'Đề bốn phần như JLPT, bấm giờ, chấm điểm và giải thích'],
              ['dictionary', Search, 'Từ điển', 'Tra nghĩa, cách đọc và ví dụ'],
              ['translate', Languages, 'Dịch văn bản', 'Tham khảo nghĩa của câu'],
              ['writing', PenTool, 'Luyện viết', 'Tập viết Hiragana và Katakana theo nét'],
            ] as const
          )
            .filter(([page]) => page !== 'translate' || translationEnabled)
            .map(([page, Icon, title, description]) => (
              <button
                key={page}
                onClick={() => setPage(page)}
                className="flex-1 basis-full sm:basis-[calc(50%-1rem)] min-w-0 text-left border border-border p-5 hover:bg-muted/40"
              >
                <Icon size={22} className="text-accent" />
                <h3 className="font-semibold mt-3">{title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{description}</p>
              </button>
            ))}
        </div>
      </section>
    </div>
  );
}
