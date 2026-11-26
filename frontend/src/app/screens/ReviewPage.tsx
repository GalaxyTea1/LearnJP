import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Flame, Loader2, RotateCcw, Volume2 } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import { reviewApi, type ReviewStats } from '../services/api';
import { navigateUrl } from '../services/navigation';
import { speak } from '../utils/helpers';
import { answerCard, buildQueue, cardFace, GRADES, NEW_CARDS_PER_ROUND, type QueuedCard } from './review/reviewSession';

type Phase = 'loading' | 'error' | 'studying' | 'done';

export default function ReviewPage() {
  const { user, checking, openLogin } = useAuth();
  const [phase, setPhase] = useState<Phase>('loading');
  const [queue, setQueue] = useState<QueuedCard[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState({ total: 0, remembered: 0, xp: 0 });
  const [sendError, setSendError] = useState(false);
  const [sending, setSending] = useState(false);
  const [noMoreNew, setNoMoreNew] = useState(false);

  const load = useCallback(async (onlyNew = false) => {
    setPhase('loading');
    setRevealed(false);
    try {
      const [due, fresh, statsRes, learner] = await Promise.all([
        onlyNew ? Promise.resolve({ data: [] }) : reviewApi.due(),
        reviewApi.fresh(NEW_CARDS_PER_ROUND),
        reviewApi.stats(),
        reviewApi.learner(),
      ]);
      setStats(statsRes.data);
      setStreak(learner.data.currentStreak);
      const next = buildQueue(due.data, fresh.data);
      setNoMoreNew(fresh.data.length < NEW_CARDS_PER_ROUND);
      setQueue(next);
      setPhase(next.length ? 'studying' : 'done');
    } catch {
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    if (checking || !user) return;
    setAnswered({ total: 0, remembered: 0, xp: 0 });
    load();
  }, [user?.id, checking, load]);

  // Each answered card already counts toward today's streak on the server; refresh what it shows.
  const finish = useCallback(async () => {
    setPhase('done');
    try {
      const [learner, statsRes] = await Promise.all([reviewApi.learner(), reviewApi.stats()]);
      setStreak(learner.data.currentStreak);
      setStats(statsRes.data);
    } catch {
      // The summary still shows this session's own counts.
    }
  }, []);

  const grade = useCallback(
    async (quality: number) => {
      const head = queue[0];
      if (!head || !revealed || sending) return;
      const { queue: next, submit } = answerCard(queue, quality);
      if (submit) {
        setSending(true);
        try {
          const res = await reviewApi.review(head.card.itemType, head.card.itemId, quality);
          setAnswered(a => ({
            total: a.total + 1,
            remembered: a.remembered + (quality >= 3 ? 1 : 0),
            xp: a.xp + (res.data.xpEarned || 0),
          }));
          setSendError(false);
        } catch {
          setSendError(true);
          setSending(false);
          return;
        }
        setSending(false);
      }
      setQueue(next);
      setRevealed(false);
      if (!next.length) finish();
    },
    [queue, revealed, sending, finish],
  );

  const current = queue[0];
  const face = current ? cardFace(current.card) : null;

  useEffect(() => {
    if (phase !== 'studying') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      const g = GRADES.find(x => x.key === e.key);
      if (g && revealed) grade(g.quality);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, revealed, grade]);

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <p className="text-xs tracking-widest uppercase text-accent font-medium mb-2">Ôn tập hôm nay</p>
        <h1 className="text-3xl md:text-4xl font-medium text-foreground">Ôn đúng lúc sắp quên</h1>
      </div>
      {user && (
        <div
          className="flex items-center gap-2 text-sm border border-border bg-card px-3 py-2 rounded-md"
          title="Số ngày học liên tiếp"
        >
          <Flame size={16} className={streak ? 'text-accent' : 'text-muted-foreground'} />
          <span className="font-semibold">{streak}</span>
          <span className="text-muted-foreground">ngày liên tiếp</span>
        </div>
      )}
    </div>
  );

  if (checking)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );

  if (!user)
    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        {header}
        <div className="border border-border bg-card p-6 md:p-8 rounded-lg flex flex-col gap-4">
          <p className="leading-relaxed">
            Mỗi ngày, LearnJP chọn ra những từ vựng và Hán tự bạn sắp quên từ các bài đã học, để bạn ôn trong khoảng 5
            phút. Từ nào nhớ chắc sẽ giãn lịch ôn ra, từ nào hay quên sẽ gặp lại sớm hơn.
          </p>
          <p className="text-sm text-muted-foreground">Cần đăng nhập để lưu lịch ôn và chuỗi ngày học của bạn.</p>
          <div>
            <button onClick={openLogin} className="btn-accent px-5 py-3">
              Đăng nhập để bắt đầu <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {header}

      {phase === 'loading' && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-accent" size={28} />
        </div>
      )}

      {phase === 'error' && (
        <div className="border border-border bg-card p-6 rounded-lg" role="alert">
          <p>Không tải được thẻ ôn tập. Hãy kiểm tra kết nối mạng.</p>
          <button onClick={() => load()} className="mt-4 text-accent underline underline-offset-4 hover:opacity-70">
            Thử lại
          </button>
        </div>
      )}

      {phase === 'studying' && current && face && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Còn {queue.length} thẻ
              {current.isNew && !current.retry && <span className="ml-2 text-accent font-medium">· Thẻ mới</span>}
              {current.retry && <span className="ml-2 font-medium">· Ôn lại</span>}
            </span>
            <span>{face.lesson}</span>
          </div>

          <div className="border border-border bg-card rounded-lg shadow-sm p-6 md:p-10 min-h-72 flex flex-col items-center justify-center text-center gap-4">
            <p
              className="text-5xl md:text-6xl font-medium break-all"
              style={{ fontFamily: 'var(--font-jp)' }}
              lang="ja"
            >
              {face.prompt}
            </p>
            {revealed ? (
              <div className="flex flex-col items-center gap-3 w-full fade-up">
                {(face.reading || face.romaji) && (
                  <p className="text-lg text-muted-foreground">
                    {face.reading && (
                      <span lang="ja" style={{ fontFamily: 'var(--font-jp)' }}>
                        {face.reading}
                      </span>
                    )}
                    {face.reading && face.romaji && ' · '}
                    {face.romaji}
                  </p>
                )}
                {face.hanViet && (
                  <p className="text-sm font-semibold tracking-widest text-accent" title="Âm Hán Việt">
                    {face.hanViet}
                  </p>
                )}
                <p className="text-xl font-semibold">{face.meaning}</p>
                {face.details.map(d => (
                  <p key={d.label} className="text-sm">
                    <span className="text-muted-foreground">{d.label}: </span>
                    <span lang="ja">{d.value}</span>
                  </p>
                ))}
                {face.example && (
                  <div className="text-sm border-t border-border pt-3 mt-1 w-full max-w-md">
                    <p lang="ja" style={{ fontFamily: 'var(--font-jp)' }}>
                      {face.example.jp}
                    </p>
                    {face.example.vi && <p className="text-muted-foreground mt-1">{face.example.vi}</p>}
                  </div>
                )}
                <button
                  onClick={() => speak(face.speakText)}
                  className="flex items-center gap-1.5 text-sm text-accent hover:opacity-70"
                  aria-label="Nghe phát âm"
                >
                  <Volume2 size={16} /> Nghe
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nhớ nghĩa và cách đọc trước khi lật thẻ.</p>
            )}
          </div>

          {sendError && (
            <p className="text-sm text-destructive" role="alert">
              Không lưu được câu trả lời. Hãy chọn lại.
            </p>
          )}

          {revealed ? (
            <div className="flex gap-2">
              {GRADES.map(g => (
                <button
                  key={g.quality}
                  onClick={() => grade(g.quality)}
                  disabled={sending}
                  className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 border border-border rounded-md py-3 transition-colors disabled:opacity-50 ${g.quality < 3 ? 'hover:border-destructive hover:text-destructive' : 'hover:border-accent hover:text-accent'}`}
                >
                  <span className="font-semibold">{g.label}</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {g.hint} · phím {g.key}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <button onClick={() => setRevealed(true)} className="btn-solid px-5 py-3 justify-center">
              Lật thẻ <span className="text-xs opacity-70 hidden sm:inline">(phím cách)</span>
            </button>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="border border-border bg-card p-6 md:p-8 rounded-lg flex flex-col gap-5">
          {answered.total > 0 ? (
            <>
              <h2 className="text-2xl font-semibold">Xong phần ôn hôm nay!</h2>
              <div className="flex flex-wrap gap-6">
                {[
                  [answered.total, 'thẻ đã ôn'],
                  [`${Math.round((answered.remembered / answered.total) * 100)}%`, 'nhớ được'],
                  [`+${answered.xp}`, 'XP'],
                  [streak, 'ngày liên tiếp'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-semibold">{value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </>
          ) : stats && stats.totalTracked > 0 ? (
            <>
              <h2 className="text-2xl font-semibold">Hôm nay không còn thẻ nào đến hạn</h2>
              <p className="text-muted-foreground">Quay lại vào ngày mai để giữ chuỗi ngày học nhé.</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">Chưa có thẻ để ôn</h2>
              <p className="text-muted-foreground">
                Mở một bài học, từ vựng và Hán tự trong bài sẽ được đưa vào lịch ôn tập của bạn.
              </p>
            </>
          )}
          {stats && stats.totalTracked > 0 && (
            <p className="text-sm text-muted-foreground">
              Đang theo dõi {stats.totalTracked} thẻ: {stats.learning} đang học, {stats.reviewing} đang ôn,{' '}
              {stats.mastered} đã thuộc.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {!noMoreNew && (
              <button onClick={() => load(true)} className="btn-outline px-5 py-3">
                <RotateCcw size={16} /> Học thêm thẻ mới
              </button>
            )}
            <button onClick={() => navigateUrl('/learning')} className="btn-solid px-5 py-3">
              Học bài tiếp theo <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
