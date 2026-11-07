import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  FileText,
  Headphones,
  Loader2,
  Play,
  RotateCcw,
  Send,
  Square,
  XCircle,
} from 'lucide-react';
import { ApiError, testsApi, type MockTestAttempt, type MockTestResult, type MockTestTemplate } from '../services/api';
import { browserStorage } from '../services/browserStorage';
import { useAuth } from '../components/auth/AuthProvider';
import { JLPT_LEVELS } from '../services/courseSummary';
import { useJapaneseSpeech } from './study/useJapaneseSpeech';

type Answers = Record<number, number>;
type Saved = { templateId: number; attemptId: number; startedAt: string; answers: Answers };
type History = Array<MockTestAttempt & { template: { id: number; title: string; level: string } }>;

const PASS_PERCENT = 70;
const sectionIcon = (type: string) => (type === 'LISTENING' ? <Headphones size={15} /> : <FileText size={15} />);
const storageKey = (userId: number) => `nihongo-mock-test-${userId}`;
const readSaved = (userId: number): Saved | null => {
  try {
    return JSON.parse(browserStorage.getItem(storageKey(userId)) || 'null');
  } catch {
    return null;
  }
};
const writeSaved = (userId: number, saved: Saved | null) => {
  try {
    saved
      ? browserStorage.setItem(storageKey(userId), JSON.stringify(saved))
      : browserStorage.removeItem(storageKey(userId));
  } catch {
    /* resume is a convenience only */
  }
};
const formatClock = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};
// Speaker labels such as 「店員：」 are shown in the transcript but not read aloud.
const speakable = (script: string) => script.replace(/^[^：\n]{1,8}：/gm, '');
const errorText = (error: unknown) =>
  error instanceof ApiError && error.status === 401
    ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    : 'Không kết nối được máy chủ. Vui lòng thử lại.';

export default function TestsPage() {
  const { user, checking, openLogin } = useAuth();
  const [chosen, setLevel] = useState<string | null>(null);
  const [templates, setTemplates] = useState<MockTestTemplate[] | null>(null);
  const [history, setHistory] = useState<History>([]);
  const [listError, setListError] = useState('');
  const [exam, setExam] = useState<{
    template: MockTestTemplate;
    attempt: { id: number; startedAt: string };
    answers: Answers;
  } | null>(null);
  const [result, setResult] = useState<{ template: MockTestTemplate; data: MockTestResult; answers: Answers } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const saved = user ? readSaved(user.id) : null;
  // Level tabs follow the published tests; the easiest level is selected first.
  const levels = JLPT_LEVELS.filter(l => templates?.some(t => t.level === l));
  const level = chosen ?? levels[0] ?? '';

  useEffect(() => {
    let active = true;
    setTemplates(null);
    setListError('');
    testsApi
      .list()
      .then(r => {
        if (active) setTemplates(r.data);
      })
      .catch(() => {
        if (active) setListError('Không tải được danh sách đề. Vui lòng thử lại.');
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    let active = true;
    testsApi
      .history()
      .then(r => {
        if (active) setHistory(r.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user?.id, result]);

  const begin = async (templateId: number, resume?: Saved) => {
    if (!user) {
      openLogin();
      return;
    }
    setBusy(true);
    setError('');
    try {
      const template = (await testsApi.get(templateId)).data;
      let attempt = resume ? { id: resume.attemptId, startedAt: resume.startedAt } : null;
      if (!attempt) {
        const started = (await testsApi.start(templateId, crypto.randomUUID())).data;
        attempt = { id: started.id, startedAt: started.startedAt };
      }
      const answers = resume?.answers ?? {};
      writeSaved(user.id, { templateId, attemptId: attempt.id, startedAt: attempt.startedAt, answers });
      setResult(null);
      setExam({ template, attempt, answers });
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  if (exam && user)
    return (
      <ExamView
        key={exam.attempt.id}
        exam={exam}
        userId={user.id}
        onFinished={(data, answers) => {
          writeSaved(user.id, null);
          setExam(null);
          setResult({ template: exam.template, data, answers });
          window.scrollTo({ top: 0 });
        }}
        onQuit={() => setExam(null)}
      />
    );
  if (result)
    return (
      <ResultView {...result} onBack={() => setResult(null)} onRetake={() => begin(result.template.id)} busy={busy} />
    );

  const shown = (templates ?? []).filter(t => t.level === level);
  const resumable = saved && history.some(h => h.id === saved.attemptId && h.status === 'IN_PROGRESS') ? saved : null;
  return (
    <section className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-accent font-semibold">Thi thử</p>
        <h1 className="text-3xl font-medium">Đề thi thử theo cấp độ</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Mỗi đề gồm bốn phần như kỳ thi JLPT: từ vựng và Hán tự, ngữ pháp, đọc hiểu, nghe hiểu. Đề do LearnJP biên soạn
          từ nội dung đã học, không phải đề thi chính thức. Mục tiêu là đạt từ {PASS_PERCENT}% trong thời gian quy định;
          phần nghe dùng giọng đọc của trình duyệt.
        </p>
      </header>
      {!checking && !user && (
        <div className="border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="text-sm text-muted-foreground">Bạn cần đăng nhập để làm bài, lưu điểm và xem lại kết quả.</p>
          <button onClick={openLogin} className="btn-solid min-h-11 px-5 text-sm font-medium">
            Đăng nhập
          </button>
        </div>
      )}
      {resumable && (
        <div className="border border-accent/50 bg-accent/5 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="text-sm">
            Bạn có một bài thi đang làm dở
            {templates ? `: ${templates.find(t => t.id === resumable.templateId)?.title ?? ''}` : ''}.
          </p>
          <button
            disabled={busy}
            onClick={() => begin(resumable.templateId, resumable)}
            className="min-h-11 px-5 bg-accent text-accent-foreground text-sm font-medium disabled:opacity-50 enabled:hover:bg-[#a53125] enabled:hover:-translate-y-0.5 enabled:hover:shadow-md"
          >
            Tiếp tục làm bài
          </button>
        </div>
      )}
      <div className="flex gap-2" role="tablist" aria-label="Chọn cấp độ">
        {levels.map(l => (
          <button
            key={l}
            role="tab"
            aria-selected={level === l}
            onClick={() => setLevel(l)}
            className={`min-h-11 px-5 border text-sm font-semibold ${level === l ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            {l}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}
      {listError ? (
        <p className="text-sm text-rose-700">{listError}</p>
      ) : !templates ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-accent" />
        </div>
      ) : !shown.length ? (
        <p className="text-sm text-muted-foreground">
          {level ? `Đề thi thử ${level} sắp ra mắt.` : 'Đề thi thử sắp ra mắt.'}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {shown.map(t => {
            const done = history.filter(h => h.templateId === t.id && h.status === 'COMPLETED');
            const best = done.reduce(
              (m, h) => Math.max(m, Math.round((h.totalScore / Math.max(1, h.maxScore)) * 100)),
              -1,
            );
            return (
              <article
                key={t.id}
                className="border border-border p-5 flex flex-col md:flex-row gap-5 md:items-center justify-between"
              >
                <div className="flex flex-col gap-2 min-w-0">
                  <h2 className="text-lg font-semibold">{t.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {t.durationMinutes} phút
                    </span>
                    <span>{t.totalQuestions} câu</span>
                    {t.sections.map(s => (
                      <span key={s.id} className="flex items-center gap-1">
                        {sectionIcon(s.sectionType)}
                        {s.title.split(' — ')[1] ?? s.title}
                      </span>
                    ))}
                  </div>
                  {best >= 0 && (
                    <p
                      className={`text-xs font-medium ${best >= PASS_PERCENT ? 'text-green-700' : 'text-muted-foreground'}`}
                    >
                      Điểm cao nhất: {best}% · {done.length} lần làm
                    </p>
                  )}
                </div>
                <button
                  disabled={busy || checking}
                  onClick={() => begin(t.id)}
                  className="btn-solid min-h-11 justify-center px-5 text-sm font-medium shrink-0 disabled:opacity-50"
                >
                  {busy ? <Loader2 size={15} className="animate-spin" /> : <Play size={14} fill="currentColor" />}{' '}
                  {user ? (done.length ? 'Làm lại' : 'Bắt đầu') : 'Đăng nhập để làm'}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ExamView({
  exam,
  userId,
  onFinished,
  onQuit,
}: {
  exam: { template: MockTestTemplate; attempt: { id: number; startedAt: string }; answers: Answers };
  userId: number;
  onFinished: (data: MockTestResult, answers: Answers) => void;
  onQuit: () => void;
}) {
  const { template, attempt } = exam;
  const [answers, setAnswers] = useState<Answers>(exam.answers);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState('');
  const submitted = useRef(false);
  const speech = useJapaneseSpeech(`mock-${attempt.id}`);
  const deadline = Date.parse(attempt.startedAt) + template.durationMinutes * 60000;
  const questions = template.sections.flatMap(s => s.questions ?? []);
  const answered = questions.filter(q => answers[q.id] !== undefined).length;
  const section = template.sections[sectionIndex];

  const submit = async () => {
    if (submitted.current) return;
    submitted.current = true;
    setSubmitting(true);
    setError('');
    speech.stop();
    try {
      const payload = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId: Number(questionId),
        selectedAnswer,
      }));
      onFinished((await testsApi.submit(attempt.id, payload)).data, answers);
    } catch (e) {
      submitted.current = false;
      setError(errorText(e));
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => {
    if (now >= deadline && !submitted.current) void submit();
  }, [now >= deadline]);
  const choose = (questionId: number, option: number) => {
    if (submitting) return;
    setAnswers(prev => {
      const next = { ...prev, [questionId]: option };
      writeSaved(userId, {
        templateId: template.id,
        attemptId: attempt.id,
        startedAt: attempt.startedAt,
        answers: next,
      });
      return next;
    });
  };
  const remaining = deadline - now;
  let number = template.sections.slice(0, sectionIndex).reduce((n, s) => n + (s.questions?.length ?? 0), 0);

  return (
    <section className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">
      <div className="sticky top-14 z-20 bg-background/95 backdrop-blur-sm border-b border-border py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{template.level}</p>
          <h1 className="text-base font-semibold truncate">{template.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1.5 text-sm font-mono font-semibold ${remaining < 5 * 60000 ? 'text-rose-700' : ''}`}
            aria-live="polite"
          >
            <Clock size={15} /> {formatClock(remaining)}
          </span>
          <span className="text-xs text-muted-foreground">
            {answered}/{questions.length} câu
          </span>
        </div>
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="Các phần thi">
        {template.sections.map((s, i) => {
          const done = (s.questions ?? []).filter(q => answers[q.id] !== undefined).length;
          return (
            <button
              key={s.id}
              onClick={() => {
                speech.stop();
                setSectionIndex(i);
              }}
              aria-current={i === sectionIndex ? 'step' : undefined}
              className={`min-h-11 px-3 border text-xs flex items-center gap-1.5 ${i === sectionIndex ? 'border-foreground font-semibold' : 'border-border text-muted-foreground'}`}
            >
              {sectionIcon(s.sectionType)} {s.title.split(' — ')[1] ?? s.title}{' '}
              <span className="text-muted-foreground">
                {done}/{s.questions?.length ?? 0}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium" style={{ fontFamily: 'var(--font-jp)' }}>
          {section.title}
        </h2>
        {section.sectionType === 'LISTENING' && (
          <p className="text-xs text-muted-foreground">
            Bấm nghe đoạn hội thoại hoặc thông báo rồi trả lời. Bản chép hiện sau khi nộp bài.
          </p>
        )}
        {(section.questions ?? []).map((q, i, list) => {
          number++;
          const newPassage = q.passage && q.passage !== list[i - 1]?.passage;
          return (
            <div key={q.id} className="flex flex-col gap-3">
              {newPassage && section.sectionType === 'READING' && (
                <div
                  className="border-l-4 border-accent/60 bg-muted/30 p-4 text-sm leading-loose whitespace-pre-line"
                  style={{ fontFamily: 'var(--font-jp)' }}
                >
                  {q.passage}
                </div>
              )}
              {newPassage && section.sectionType === 'LISTENING' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => (speech.playing ? speech.stop() : speech.speakJapanese(speakable(q.passage!)))}
                    className="min-h-11 px-4 border border-border text-sm flex items-center gap-2 enabled:hover:bg-muted enabled:hover:border-foreground/40"
                  >
                    {speech.playing ? <Square size={14} /> : <Play size={14} fill="currentColor" />}{' '}
                    {speech.playing ? 'Dừng' : 'Nghe đoạn này'}
                  </button>
                  {speech.error && <span className="text-xs text-rose-700">{speech.error}</span>}
                </div>
              )}
              <p className="text-base leading-relaxed whitespace-pre-line" style={{ fontFamily: 'var(--font-jp)' }}>
                <span className="font-semibold mr-2">{number}.</span>
                {q.questionText}
              </p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Câu ${number}`}>
                {q.options.map((option, o) => (
                  <button
                    key={o}
                    role="radio"
                    aria-checked={answers[q.id] === o}
                    onClick={() => choose(q.id, o)}
                    disabled={submitting}
                    className={`w-full sm:w-[calc(50%-0.25rem)] min-h-11 px-3 py-2 border text-left text-sm flex items-center gap-2 ${answers[q.id] === o ? 'border-accent bg-accent/10 font-medium' : 'border-border hover:border-foreground/40'}`}
                  >
                    <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-border text-xs">
                      {o + 1}
                    </span>
                    <span style={{ fontFamily: 'var(--font-jp)' }}>{option}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-between border-t border-border pt-5">
        <div className="flex gap-2">
          <button
            disabled={sectionIndex === 0}
            onClick={() => {
              speech.stop();
              setSectionIndex(i => i - 1);
              window.scrollTo({ top: 0 });
            }}
            className="min-h-11 px-4 border border-border text-sm disabled:opacity-40 enabled:hover:bg-muted enabled:hover:border-foreground/40"
          >
            Phần trước
          </button>
          <button
            disabled={sectionIndex === template.sections.length - 1}
            onClick={() => {
              speech.stop();
              setSectionIndex(i => i + 1);
              window.scrollTo({ top: 0 });
            }}
            className="min-h-11 px-4 border border-border text-sm disabled:opacity-40 enabled:hover:bg-muted enabled:hover:border-foreground/40"
          >
            Phần sau
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              speech.stop();
              onQuit();
            }}
            className="min-h-11 px-4 text-sm text-muted-foreground underline"
          >
            Tạm dừng
          </button>
          {confirm ? (
            <button
              disabled={submitting}
              onClick={submit}
              className="min-h-11 px-5 bg-rose-700 text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50 enabled:hover:bg-rose-800 enabled:hover:-translate-y-0.5"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />} Nộp dù còn{' '}
              {questions.length - answered} câu trống
            </button>
          ) : (
            <button
              disabled={submitting}
              onClick={() => (answered < questions.length ? setConfirm(true) : submit())}
              className="min-h-11 px-5 bg-accent text-accent-foreground text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />} Nộp bài
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Hết giờ, bài sẽ được nộp tự động. Bấm “Tạm dừng” để quay lại danh sách; đồng hồ vẫn chạy và bạn có thể tiếp tục
        trên trình duyệt này.
      </p>
    </section>
  );
}

function ResultView({
  template,
  data,
  answers,
  onBack,
  onRetake,
  busy,
}: {
  template: MockTestTemplate;
  data: MockTestResult;
  answers: Answers;
  onBack: () => void;
  onRetake: () => void;
  busy: boolean;
}) {
  const percent = Math.round((data.totalScore / Math.max(1, data.maxScore)) * 100);
  const byId = useMemo(() => new Map((data.results ?? []).map(r => [r.questionId, r])), [data]);
  let number = 0;
  return (
    <section className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-widest text-accent font-semibold">Kết quả · {template.level}</p>
        <h1 className="text-2xl font-medium">{template.title}</h1>
        <div className="flex flex-wrap items-end gap-4 mt-2">
          <span className="text-5xl font-semibold">{percent}%</span>
          <span className="text-sm text-muted-foreground pb-2">
            {data.totalScore}/{data.maxScore} câu đúng · +{data.xpEarned} XP
          </span>
          <span
            className={`text-sm font-semibold pb-2 ${percent >= PASS_PERCENT ? 'text-green-700' : 'text-rose-700'}`}
          >
            {percent >= PASS_PERCENT ? `Đạt mục tiêu ${PASS_PERCENT}%` : `Chưa đạt mục tiêu ${PASS_PERCENT}%`}
          </span>
        </div>
      </header>
      <div className="flex flex-wrap border border-border">
        {template.sections.map(s => {
          const qs = s.questions ?? [],
            ok = qs.filter(q => byId.get(q.id)?.isCorrect).length;
          return (
            <div
              key={s.id}
              className="flex-1 min-w-[45%] sm:min-w-0 p-4 border-b sm:border-b-0 sm:border-r last:border-r-0 border-border"
            >
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {sectionIcon(s.sectionType)}
                {s.title.split(' — ')[1] ?? s.title}
              </p>
              <p className="text-lg font-semibold mt-1">
                {ok}/{qs.length}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onBack}
          className="min-h-11 px-5 border border-border text-sm enabled:hover:bg-muted enabled:hover:border-foreground/40"
        >
          Về danh sách đề
        </button>
        <button
          disabled={busy}
          onClick={onRetake}
          className="min-h-11 px-5 bg-foreground text-background text-sm font-medium flex items-center gap-2 disabled:opacity-50 enabled:hover:bg-accent enabled:hover:-translate-y-0.5"
        >
          <RotateCcw size={14} /> Làm lại đề này
        </button>
      </div>
      {template.sections.map(s => (
        <div key={s.id} className="flex flex-col gap-5">
          <h2 className="text-lg font-medium border-b border-border pb-2" style={{ fontFamily: 'var(--font-jp)' }}>
            {s.title}
          </h2>
          {(s.questions ?? []).map((q, i, list) => {
            number++;
            const r = byId.get(q.id),
              chosen = answers[q.id];
            const newPassage = q.passage && q.passage !== list[i - 1]?.passage;
            return (
              <div key={q.id} className="flex flex-col gap-2">
                {newPassage && (
                  <details
                    className="border-l-4 border-border bg-muted/30 p-3 text-sm"
                    open={s.sectionType === 'LISTENING'}
                  >
                    <summary className="cursor-pointer text-xs text-muted-foreground">
                      {s.sectionType === 'LISTENING' ? 'Bản chép bài nghe' : 'Đoạn văn'}
                    </summary>
                    <p className="whitespace-pre-line leading-loose mt-2" style={{ fontFamily: 'var(--font-jp)' }}>
                      {q.passage}
                    </p>
                  </details>
                )}
                <p
                  className="text-sm leading-relaxed whitespace-pre-line flex gap-2"
                  style={{ fontFamily: 'var(--font-jp)' }}
                >
                  {r?.isCorrect ? (
                    <CheckCircle2 size={16} className="text-green-700 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={16} className="text-rose-700 shrink-0 mt-0.5" />
                  )}
                  <span>
                    <span className="font-semibold mr-1">{number}.</span>
                    {q.questionText}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2 pl-6">
                  {q.options.map((option, o) => {
                    const correct = r?.correctAnswer === o,
                      picked = chosen === o;
                    return (
                      <span
                        key={o}
                        className={`w-full sm:w-[calc(50%-0.25rem)] px-3 py-2 border text-sm flex justify-between gap-2 ${correct ? 'border-green-700 bg-green-700/10 font-medium' : picked ? 'border-rose-700 bg-rose-700/10' : 'border-border text-muted-foreground'}`}
                      >
                        <span style={{ fontFamily: 'var(--font-jp)' }}>{option}</span>
                        {correct ? (
                          <span className="text-[10px] uppercase font-semibold text-green-700">Đáp án</span>
                        ) : picked ? (
                          <span className="text-[10px] uppercase font-semibold text-rose-700">Bạn chọn</span>
                        ) : null}
                      </span>
                    );
                  })}
                </div>
                {chosen === undefined && (
                  <p className="pl-6 text-xs text-muted-foreground">Bạn chưa trả lời câu này.</p>
                )}
                {r?.explanation && (
                  <p className="pl-6 text-xs text-muted-foreground leading-relaxed">Giải thích: {r.explanation}</p>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}
