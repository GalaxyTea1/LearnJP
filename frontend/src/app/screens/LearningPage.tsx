import { useBrowserUrl, moduleFromUrl, navigateUrl, openStudyModule } from '../services/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Flag,
  GraduationCap,
  Headphones,
  Layers3,
  Play,
  Sparkles,
  Target,
} from 'lucide-react';
import type { Page } from '../data/basicData';
import { roadmapPlans, weeklyRhythm, type JLPTLevel } from '../data/roadmapPlan';
import { ModuleStudyViewer } from './study/ModuleStudyViewer';
import { GuestNotice, useAuth } from '../components/auth/AuthProvider';

import { openLevels, summarizeCourse } from '../services/courseSummary';
import { useCourseCatalog } from '../services/useCourseCatalog';
import { testsApi } from '../services/api';

type View = 'overview' | 'curriculum' | 'schedule' | 'assessment';

const views: { id: View; label: string; icon: typeof Target }[] = [
  { id: 'overview', label: 'Tổng quan', icon: Target },
  { id: 'curriculum', label: 'Chương trình', icon: Layers3 },
  { id: 'schedule', label: 'Hướng dẫn', icon: CalendarDays },
  { id: 'assessment', label: 'Tự đánh giá', icon: BarChart3 },
];

export default function LearningPage({ setPage }: { setPage: (p: Page) => void }) {
  const { user, checking } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [view, setView] = useState<View>('overview');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [openModule, setOpenModule] = useState<string | null>(null);
  const activeStudyModuleId = moduleFromUrl(useBrowserUrl());

  const catalog = useCourseCatalog(user?.id, checking, activeStudyModuleId);
  const course = summarizeCourse(catalog.modules, selectedLevel);
  const open = openLevels(catalog.modules);

  const plan = useMemo(() => roadmapPlans.find(item => item.level === selectedLevel)!, [selectedLevel]);
  const selectLevel = (level: JLPTLevel) => {
    setSelectedLevel(level);
    setView('overview');
    setOpenModule(null);
  };

  // If a module study view is open, render the study viewer
  if (activeStudyModuleId !== null) {
    return (
      <ModuleStudyViewer
        key={activeStudyModuleId}
        moduleId={activeStudyModuleId}
        onBack={() => navigateUrl('/learning')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/40">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
                <GraduationCap size={16} /> Lộ trình học tiếng Nhật
              </div>
              <h1 className="text-3xl md:text-4xl font-medium text-foreground">
                {open.length ? `Từ ${open[0]} đến ${open[open.length - 1]}` : 'Học theo từng cấp độ'}
              </h1>
              <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                Học lần lượt từng bài: từ vựng, Hán tự, ngữ pháp, hội thoại, rồi làm bài kiểm tra ngắn để hoàn thành
                bài. Đã có nền tảng? Chọn cấp độ phù hợp bên dưới.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-background sticky top-14 z-30">
        <div className="max-w-6xl mx-auto px-6 py-3 overflow-x-auto">
          <div className="flex min-w-[680px] items-stretch">
            {roadmapPlans.map((item, index) => {
              const active = item.level === selectedLevel;
              return (
                <button
                  key={item.level}
                  onClick={() => selectLevel(item.level)}
                  className="flex-1 text-left group"
                  aria-pressed={active}
                >
                  <div className="flex items-center">
                    <span
                      className={`w-9 h-9 flex items-center justify-center text-xs font-bold border-2 bg-background transition-colors ${active ? 'text-white' : 'text-muted-foreground'}`}
                      style={{ borderColor: item.color, backgroundColor: active ? item.color : undefined }}
                    >
                      {item.level}
                    </span>
                    {index < roadmapPlans.length - 1 && <span className="h-px flex-1 bg-border" />}
                  </div>
                  <div className="mt-2 pr-4">
                    <p
                      className={`text-xs font-semibold ${active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}
                    >
                      {item.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {catalog.loading || catalog.error ? ' ' : open.includes(item.level) ? 'Đã mở' : 'Sắp ra mắt'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-8 md:py-10">
        <div className="mb-6">
          <GuestNotice />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-60 shrink-0">
            <div className="lg:sticky lg:top-36">
              <div className="border-l-4 pl-4" style={{ borderColor: plan.color }}>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Cấp độ hiện tại</p>
                <h2 className="text-3xl font-semibold mt-1">{plan.level}</h2>
                <p className="text-sm font-medium mt-1">{plan.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{plan.japaneseLabel}</p>
              </div>
              <div className="mt-6 border-y border-border divide-y divide-border">
                <SideStat label="Thời lượng gợi ý" value={`${plan.durationWeeks} tuần`} />
                <SideStat label="Cường độ" value={plan.hoursPerWeek} />
                {course.count > 0 && <SideStat label="Bài học" value={String(course.count)} />}
                <SideStat label="Từ vựng (JLPT)" value={`~${plan.vocabulary.toLocaleString('vi-VN')}`} />
                <SideStat label="Hán tự (JLPT)" value={`~${plan.kanji.toLocaleString('vi-VN')}`} />
              </div>
              <button
                onClick={() => setView('curriculum')}
                className="mt-6 w-full h-10 bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Play size={15} fill="currentColor" /> Xem bài học
              </button>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div
              className="flex overflow-x-auto border-b border-border mb-8"
              role="tablist"
              aria-label="Nội dung lộ trình"
            >
              {views.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    role="tab"
                    aria-selected={view === item.id}
                    className={`h-11 px-4 inline-flex items-center gap-2 text-sm whitespace-nowrap border-b-2 transition-colors ${view === item.id ? 'border-accent text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    <Icon size={15} /> {item.label}
                  </button>
                );
              })}
            </div>

            {view === 'overview' && (
              <Overview
                plan={plan}
                course={course}
                catalog={catalog}
                signedIn={!!user}
                onCurriculum={() => setView('curriculum')}
              />
            )}
            {view === 'curriculum' && (
              <Curriculum
                catalog={catalog}
                levelName={selectedLevel}
                openModule={openModule}
                setOpenModule={setOpenModule}
                onStartStudy={openStudyModule}
              />
            )}
            {view === 'schedule' && <Schedule level={selectedLevel} hours={plan.hoursPerWeek} />}
            {view === 'assessment' && <Assessment plan={plan} checked={checked} setChecked={setChecked} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 basis-1/2 sm:basis-0 min-w-0 px-4 py-4 text-center border-r border-border last:border-r-0">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function SideStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 flex justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Overview({
  plan,
  onCurriculum,
  course,
  catalog,
  signedIn,
}: {
  plan: (typeof roadmapPlans)[number];
  onCurriculum: () => void;
  course: ReturnType<typeof summarizeCourse>;
  catalog: ReturnType<typeof useCourseCatalog>;
  signedIn: boolean;
}) {
  return (
    <div className="space-y-8">
      <section aria-live="polite">
        <h3 className="text-lg font-semibold">Khóa học {plan.level}</h3>
        {catalog.loading ? (
          <p className="mt-4">Đang tải nội dung…</p>
        ) : catalog.error ? (
          <p className="mt-4">
            Không tải được khóa học.{' '}
            <button onClick={catalog.retry} className="text-accent underline underline-offset-4 hover:opacity-70">
              Thử lại
            </button>
          </p>
        ) : (
          <>
            <div className="flex flex-wrap mt-5 border border-border">
              <Metric value={String(course.count)} label="bài học" />
              <Metric value={course.vocabulary.toLocaleString('vi-VN')} label="từ vựng" />
              <Metric value={course.kanji.toLocaleString('vi-VN')} label="Hán tự" />
              <Metric value={String(course.grammar)} label="mẫu ngữ pháp" />
            </div>
            {course.count === 0 ? (
              <p className="mt-4">Bài học cho cấp độ này sắp ra mắt.</p>
            ) : catalog.progressLoading ? (
              <p className="mt-4">Đang tải tiến độ…</p>
            ) : catalog.progressError ? (
              <p className="mt-4" role="status">
                Không tải được tiến độ của bạn.{' '}
                <button
                  onClick={catalog.retryProgress}
                  className="text-accent underline underline-offset-4 hover:opacity-70"
                >
                  Thử lại
                </button>
              </p>
            ) : signedIn ? (
              <p className="mt-4">
                Bạn đã hoàn thành {course.completed}/{course.count} bài.
              </p>
            ) : null}
          </>
        )}
        <button onClick={onCurriculum} className="mt-5 text-accent inline-flex items-center gap-2">
          Xem bài học <ArrowRight size={14} />
        </button>
      </section>
      <section>
        <h3 className="text-lg font-semibold">Mục tiêu cấp độ</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Theo số liệu tham khảo phổ biến, người đỗ {plan.level} thường biết khoảng{' '}
          {plan.vocabulary.toLocaleString('vi-VN')} từ và {plan.kanji.toLocaleString('vi-VN')} Hán tự
          {plan.level === 'N5' ? '' : ', tính cả các cấp dưới'}.
          {course.count > 0 &&
            ` Khóa học ${plan.level} dạy ${course.vocabulary.toLocaleString('vi-VN')} từ, ${course.kanji.toLocaleString('vi-VN')} Hán tự và ${course.grammar} mẫu ngữ pháp trọng tâm; phần còn lại bạn tích lũy thêm qua đọc, nghe và luyện đề.`}
        </p>
        <div className="flex flex-col md:flex-row mt-5 border border-border">
          {plan.phases.map((phase, index) => (
            <article key={phase.title} className="flex-1 min-w-0 p-5 border-b md:border-b-0 border-border">
              <p className="text-xs text-accent">
                Giai đoạn {index + 1} · {phase.weeks}
              </p>
              <h4 className="font-semibold mt-3">{phase.title}</h4>
              <p className="text-sm text-muted-foreground mt-2">{phase.focus}</p>
              <ul className="mt-4 space-y-2">
                {phase.outcomes.map(item => (
                  <li key={item} className="text-xs flex gap-2">
                    <Check size={13} className="shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="border-l-4 border-accent bg-muted/40 p-5">
        <p className="text-xs text-muted-foreground">Bài tập tự luyện gợi ý</p>
        <p className="mt-2 text-sm">{plan.capstone}</p>
      </section>
    </div>
  );
}

function Curriculum({
  catalog,
  levelName,
  openModule,
  setOpenModule,
  onStartStudy,
}: {
  catalog: ReturnType<typeof useCourseCatalog>;
  levelName: JLPTLevel;
  openModule: string | null;
  setOpenModule: (id: string | null) => void;
  onStartStudy: (moduleId: number) => void;
}) {
  const { loading, error, retry } = catalog;
  const realModules = summarizeCourse(catalog.modules, levelName).modules;

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Chương trình học</p>
          <h3 className="text-2xl font-medium mt-1">Các bài học {levelName}</h3>
        </div>
      </div>

      {catalog.progressLoading && (
        <p className="mb-4" role="status">
          Đang tải tiến độ…
        </p>
      )}
      {catalog.progressError && (
        <p className="mb-4" role="status">
          Không tải được tiến độ của bạn.{' '}
          <button onClick={catalog.retryProgress} className="text-accent underline underline-offset-4 hover:opacity-70">
            Thử lại
          </button>
        </p>
      )}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>Đang tải bài học...</p>
          </div>
        ) : error ? (
          <p>
            Không tải được bài học.{' '}
            <button onClick={retry} className="text-accent underline underline-offset-4 hover:opacity-70">
              Thử lại
            </button>
          </p>
        ) : realModules.length > 0 ? (
          realModules.map((module, index) => {
            const moduleIdStr = `real-${module.id}`;
            const expanded = openModule === moduleIdStr;
            // map user status: NOT_STARTED -> ready, IN_PROGRESS -> in-progress, COMPLETED -> completed, LOCKED -> locked
            const statusMap: Record<string, string> = {
              NOT_STARTED: 'ready',
              IN_PROGRESS: 'in-progress',
              COMPLETED: 'completed',
              LOCKED: 'locked',
              UNKNOWN: 'unknown',
            };
            const mappedStatus = statusMap[module.status] || 'unknown';

            return (
              <article key={module.id} className="border border-border bg-card">
                <button
                  onClick={() => setOpenModule(expanded ? null : moduleIdStr)}
                  className="w-full p-5 text-left flex gap-4 items-start"
                  aria-expanded={expanded}
                >
                  <span
                    className={`w-9 h-9 shrink-0 flex items-center justify-center text-xs font-bold ${mappedStatus === 'completed' ? 'bg-green-700 text-white' : mappedStatus === 'locked' ? 'bg-muted text-muted-foreground' : 'bg-foreground text-background'}`}
                  >
                    {mappedStatus === 'completed' ? <Check size={16} /> : module.unitNumber || index + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <strong className="text-sm md:text-base">{module.title}</strong>
                      <Status status={mappedStatus} progress={module.progressPercent} />
                    </span>
                    <span className="block text-xs text-muted-foreground mt-1">{module.titleJp}</span>
                    <span className="block text-xs text-foreground/70 mt-2 leading-relaxed">
                      {module.description || 'Bài học cung cấp kiến thức nền tảng.'}
                    </span>
                  </span>
                  <ChevronRight
                    size={17}
                    className={`mt-2 shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
                  />
                </button>
                {expanded && (
                  <div className="border-t border-border px-5 py-5 flex flex-wrap gap-6 bg-background/50">
                    <ModuleColumn
                      icon={<BookOpen size={15} />}
                      title="Tổng quan"
                      items={module.topics?.length ? module.topics : ['Từ vựng', 'Hán tự', 'Ngữ pháp']}
                    />
                    <ModuleColumn
                      icon={<Sparkles size={15} />}
                      title="Số lượng"
                      items={[
                        `${module._count?.vocabulary || 0} từ vựng`,
                        `${module._count?.kanji || 0} Hán tự`,
                        `${module._count?.grammarPatterns || 0} mẫu ngữ pháp`,
                        `${module._count?.quizQuestions || 0} câu kiểm tra`,
                      ]}
                    />
                    <div className="w-full flex justify-end">
                      <button
                        disabled={mappedStatus === 'locked'}
                        onClick={() => onStartStudy(module.id)}
                        className="h-9 px-4 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg text-xs font-medium inline-flex items-center gap-2 disabled:opacity-40 transition-colors shadow-xs"
                      >
                        <Play size={13} fill="currentColor" />{' '}
                        {mappedStatus === 'in-progress'
                          ? 'Tiếp tục học'
                          : mappedStatus === 'completed'
                            ? 'Ôn lại bài'
                            : mappedStatus === 'unknown'
                              ? 'Mở bài học'
                              : 'Bắt đầu học'}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <div className="p-8 border border-dashed border-border rounded bg-muted/20 text-center">
            <p className="text-muted-foreground mb-2">Bài học {levelName} sắp ra mắt.</p>
            <p className="text-xs text-muted-foreground">Trong lúc chờ, bạn có thể học các cấp độ đã mở.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Status({ status, progress }: { status: string; progress: number }) {
  const displayProgress = progress || 0;
  const map: Record<string, string> = {
    unknown: '',
    completed: 'Hoàn thành',
    'in-progress': `Đang học ${displayProgress}%`,
    ready: 'Sẵn sàng',
    locked: 'Chưa mở',
  };
  if (!map[status]) return null;
  return (
    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 border border-border text-muted-foreground">
      {map[status]}
    </span>
  );
}

function ModuleColumn({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="flex-1 min-w-40">
      <h4 className="text-xs font-semibold flex items-center gap-2">
        {icon}
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {items.slice(0, 4).map(item => (
          <li key={item} className="text-xs text-muted-foreground flex gap-2">
            <Circle size={7} fill="currentColor" className="mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Schedule({ level, hours }: { level: JLPTLevel; hours: string }) {
  const totalMinutes = weeklyRhythm.reduce((sum, day) => sum + day.minutes, 0);
  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Nhịp học khuyến nghị</p>
          <h3 className="text-2xl font-medium mt-1">Một tuần cân bằng cho {level}</h3>
        </div>
        <span className="text-sm font-semibold">Gợi ý: {hours} / tuần</span>
      </div>
      <p className="-mt-4 mb-6 text-sm text-muted-foreground">
        Lịch dưới đây là một tuần mẫu. Tăng hoặc giảm thời lượng mỗi ngày cho khớp với cường độ gợi ý của cấp độ.
      </p>
      <div className="border-y border-border divide-y divide-border">
        {weeklyRhythm.map((day, index) => (
          <div
            key={day.day}
            className="grid grid-cols-[70px_1fr_auto] sm:grid-cols-[100px_1fr_100px] items-center gap-4 py-4"
          >
            <span className="text-xs font-semibold">{day.day}</span>
            <div>
              <p className="text-sm">{day.focus}</p>
              <div className="h-1 bg-muted mt-2 max-w-md">
                <div className="h-full bg-accent" style={{ width: `${Math.min(100, day.minutes / 1.2)}%` }} />
              </div>
            </div>
            <span className="text-xs text-muted-foreground text-right">{day.minutes} phút</span>
          </div>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap border border-border">
        <Metric value={`~${Math.round(totalMinutes / 60)} giờ`} label="theo lịch mẫu / tuần" />
        <Metric value="20%" label="thời gian ôn bài cũ" />
        <Metric value="1" label="bài viết hoặc nói / tuần" />
      </div>
    </section>
  );
}

function Assessment({
  plan,
  checked,
  setChecked,
}: {
  plan: (typeof roadmapPlans)[number];
  checked: Record<string, boolean>;
  setChecked: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  // Levels that have published mock tests; null while loading or if the list is unavailable.
  const [mockLevels, setMockLevels] = useState<string[] | null>(null);
  useEffect(() => {
    let active = true;
    testsApi
      .list()
      .then(r => {
        if (active) setMockLevels(r.data.map(t => t.level));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  const done = plan.checkpoint.filter(item => checked[`${plan.level}-${item}`]).length;
  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-7">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Tự đánh giá</p>
          <h3 className="text-2xl font-medium mt-1">Sẵn sàng rời {plan.level}?</h3>
        </div>
        <span className="text-sm font-semibold">
          {done}/{plan.checkpoint.length}
        </span>
      </div>
      <div className="h-2 bg-muted mb-8">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${(done / plan.checkpoint.length) * 100}%` }}
        />
      </div>
      <div className="space-y-3">
        {plan.checkpoint.map(item => {
          const key = `${plan.level}-${item}`;
          const active = !!checked[key];
          return (
            <button
              key={item}
              onClick={() => setChecked(prev => ({ ...prev, [key]: !prev[key] }))}
              className={`w-full border p-4 flex items-center gap-3 text-left transition-colors ${active ? 'border-green-700 bg-green-700/5' : 'border-border hover:border-foreground/30'}`}
            >
              {active ? (
                <CheckCircle2 size={20} className="text-green-700 shrink-0" />
              ) : (
                <Circle size={20} className="text-muted-foreground shrink-0" />
              )}
              <span className="text-sm flex-1">{item}</span>
              {active && <span className="text-[10px] uppercase text-green-700 font-semibold">Đạt</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex flex-col md:flex-row border border-border md:divide-x divide-border">
        <Gate
          icon={<BookOpen size={18} />}
          title="Kiến thức"
          text="Nắm từ vựng, Hán tự và ngữ pháp của các bài trong cấp độ"
        />
        <Gate
          icon={<Headphones size={18} />}
          title="Kỹ năng"
          text="Đọc, nghe, viết và nói được trong tình huống thực tế"
        />
        <Gate
          icon={<Flag size={18} />}
          title="Thi thử"
          text={
            mockLevels === null
              ? 'Làm bài kiểm tra tổng hợp cuối cấp độ, đạt từ 70%'
              : mockLevels.includes(plan.level)
                ? `Làm đề thi thử ${plan.level} ở mục Thi thử, đạt từ 70% trong thời gian quy định`
                : 'Làm bài tổng ôn cuối cấp độ, đạt từ 70% trước khi học cấp tiếp theo'
          }
        />
      </div>
    </section>
  );
}

function Gate({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex-1 min-w-0 p-5">
      <span className="text-accent">{icon}</span>
      <h4 className="text-sm font-semibold mt-3">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed mt-2">{text}</p>
    </div>
  );
}
