import { useEffect, useRef, useState } from 'react';
import type { QuizQuestionItem } from './types';
import { decodeQuizSession, emptyQuizSession, encodeQuizSession, quizRevision, quizSessionKey, type QuizSession } from './quizSession';

// Keep same-page navigation safe even when browser storage is unavailable.
const sessionCache = new Map<string, QuizSession>();

export function useQuizSession(moduleId: number, userId: number | undefined, checking: boolean, questions: QuizQuestionItem[], serverRevision?: string) {
  const key = quizSessionKey(moduleId, userId);
  const revision = quizRevision(questions, serverRevision);
  const context = `${key}:${revision}`;
  const [state, setState] = useState<{ context: string; key: string; revision: string; session: QuizSession } | null>(null);
  const [notice, setNotice] = useState('');
  const [storageError, setStorageError] = useState(false);
  const current = useRef(state);
  current.current = state;

  useEffect(() => {
    if (checking || current.current?.context === context) return;
    let session = emptyQuizSession();
    let restored = false;
    try {
      const raw = localStorage.getItem(key);
      const saved = decodeQuizSession(raw, revision, questions);
      if (saved) { session = saved; restored = true; }
      setNotice(raw && !saved ? 'Nội dung Quiz đã thay đổi hoặc bản lưu không hợp lệ. Bài kiểm tra được bắt đầu lại.' : '');
      setStorageError(false);
    } catch { setStorageError(true); }
    const cached = sessionCache.get(context);
    if (cached) { session = cached; restored = true; }
    // Preserve only the guest attempt currently on screen during sign-in.
    // A different account always restores its own session.
    const previous = current.current;
    if (userId !== undefined && previous?.key === quizSessionKey(moduleId) && previous.revision === revision &&
      !previous.session.result && Object.keys(previous.session.answers).length > 0) {
      session = previous.session;
      restored = true;
      // The active guest draft is transferred once, never copied to later accounts.
      sessionCache.set(previous.context, emptyQuizSession());
      try { localStorage.removeItem(previous.key); } catch { /* The memory entry prevents reuse in this page. */ }
    }
    if (restored) setNotice(session.result ? 'Đã khôi phục kết quả lần làm gần nhất trên trình duyệt này.' : 'Đã khôi phục bài đang làm trên trình duyệt này.');
    setState({ context, key, revision, session });
  }, [context, key, revision, checking, moduleId, userId, questions]);

  const persist = (value: NonNullable<typeof state>) => {
    sessionCache.set(value.context, value.session);
    try { localStorage.setItem(value.key, encodeQuizSession(value.session, value.revision)); return true; }
    catch { return false; }
  };
  useEffect(() => {
    if (state && state.context === context && !checking) setStorageError(!persist(state));
  }, [state, context, checking]);
  useEffect(() => {
    const flush = () => { if (current.current) persist(current.current); };
    const beforeUnload = (event: BeforeUnloadEvent) => {
      const value = current.current;
      if (value && !value.session.result && Object.keys(value.session.answers).length && !persist(value)) {
        event.preventDefault(); event.returnValue = '';
      }
    };
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', beforeUnload);
    return () => { flush(); window.removeEventListener('pagehide', flush); window.removeEventListener('beforeunload', beforeUnload); };
  }, []);

  const ready = !checking && state?.context === context;
  const update = (change: (session: QuizSession) => QuizSession) => {
    const prev = current.current;
    if (prev?.context !== context) return;
    const next = { ...prev, session: change(prev.session) };
    current.current = next;
    setStorageError(!persist(next));
    setState(next);
  };
  return { session: ready ? state.session : emptyQuizSession(), ready, update, notice, storageError };
}
