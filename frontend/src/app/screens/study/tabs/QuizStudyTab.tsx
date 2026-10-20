import React, { useState, useEffect, useRef } from "react";
import { 
  CheckCircle2, XCircle, Award, RotateCcw, Clock, 
  Send, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import type { QuizQuestionItem } from "../types";
import { ApiError, progressApi } from "../../../services/api";
import { useAuth } from '../../../components/auth/AuthProvider';
import { useQuizSession } from '../useQuizSession';
import { emptyQuizSession } from '../quizSession';

interface QuizStudyTabProps {
  moduleId: number;
  revision?: string;
  quizQuestions: QuizQuestionItem[];
  onCompleteTab?: () => void;
}

const formatTime = (totalSec: number) => {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function QuizStudyTab({ moduleId, quizQuestions, onCompleteTab, revision }: QuizStudyTabProps) {
  const { user, checking, openLogin } = useAuth();
  const { session, ready, update, notice, storageError } = useQuizSession(moduleId, user?.id, checking, quizQuestions, revision);
  const { answers: selectedAnswers, index: currentIndex, seconds, result } = session;
  const setCurrentIndex = (change: number | ((index: number) => number)) => update(s => ({ ...s, index: typeof change === 'function' ? change(s.index) : change }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [revisionConflict, setRevisionConflict] = useState(false);
  const [confirmRetake, setConfirmRetake] = useState(false);
  const submittingRef = useRef(false);
  const identityRef = useRef(user?.id);
  identityRef.current = user?.id;
  const mountedRef = useRef(true);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);
  
  useEffect(() => {
    setRevisionConflict(false);
    setSubmitError('');
  }, [moduleId, revision]);

  useEffect(() => {
    setSubmitError('');
    setConfirmRetake(false);
  }, [user?.id]);
  useEffect(() => {
    if (!ready || result || session.submission || isSubmitting) return;
    const timer = window.setInterval(() => {
      // Time spent in another tab, away from the page, or reviewing a result is paused.
      if (document.visibilityState === 'visible') update(s => ({ ...s, seconds: s.seconds + 1 }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [ready, result, session.submission, isSubmitting, moduleId, user?.id]);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (result || session.submission || submittingRef.current) return;
    update(s => ({ ...s, answers: { ...s.answers, [questionId]: optionIndex } }));
  };

  const handleSubmit = async () => {
    if (!ready || checking || submittingRef.current) return;
    if (!user) { openLogin(); return; }
    if (revisionConflict || !revision) {
      setRevisionConflict(true);
      setSubmitError('Đề đã thay đổi hoặc phiên bản đang mở không còn được hỗ trợ. Chưa chấm điểm hay lưu kết quả. Hãy tải đề mới để làm lại; câu trả lời hiện tại được giữ đến khi bạn tải lại.');
      return;
    }
    setSubmitError('');
    const answeredCount = Object.keys(selectedAnswers).length;
    if (!answeredCount) { setSubmitError('Hãy trả lời ít nhất một câu trước khi nộp bài.'); return; }
    if (!session.submission && answeredCount < quizQuestions.length) {
      const remaining = quizQuestions.length - answeredCount;
      if (!window.confirm(`Bạn còn ${remaining} câu chưa trả lời. Bạn có chắc muốn nộp bài?`)) {
        return;
      }
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    const submittedUserId = user.id;

    const answersPayload = quizQuestions
      .filter(q => selectedAnswers[q.id] !== undefined)
      .map(q => ({
        questionId: q.id,
        selectedIndex: selectedAnswers[q.id],
      }));

    const submission = session.submission ?? { requestId: crypto.randomUUID(), seconds };
    update(s => ({ ...s, submission }));
    try {
      const res = await progressApi.submitQuizAttempt(moduleId, answersPayload, submission.seconds, revision, submission.requestId);
      if (!mountedRef.current || identityRef.current !== submittedUserId) return;
      if (res && res.success && res.data) {
        update(s => ({ ...s, result: res.data }));
        if (res.data.passed && onCompleteTab) {
          onCompleteTab();
        }
      } else {
        setSubmitError('Chưa nhận được kết quả xác nhận. Câu trả lời được giữ nguyên; hãy thử lại lượt nộp.');
      }
    } catch (err) {
      if (!mountedRef.current || identityRef.current !== submittedUserId) return;
      console.warn("Could not submit quiz attempt to API:", err);
      if (err instanceof ApiError && err.status === 409 && err.message === 'QUIZ_REVISION_CHANGED') {
        setRevisionConflict(true);
        setSubmitError('Đề đã thay đổi trong lúc bạn làm bài. Chưa chấm điểm hay lưu kết quả. Câu trả lời hiện tại vẫn được giữ để xem lại; tải đề mới sẽ bắt đầu lượt làm mới.');
      } else if (err instanceof ApiError && err.status === 401) openLogin();
      else setSubmitError('Chưa nhận được kết quả xác nhận. Hãy thử lại lượt nộp này; câu trả lời được giữ nguyên để tránh ghi trùng.');
    } finally {
      submittingRef.current = false;
      if (mountedRef.current) setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    update(() => emptyQuizSession());
    setSubmitError('');
    setConfirmRetake(false);
  };

  if (!ready) return <p role="status" className="p-6 text-sm text-muted-foreground">Đang khôi phục bài kiểm tra...</p>;

  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
        <p>Chưa có câu hỏi kiểm tra Quiz cho bài học này.</p>
      </div>
    );
  }

  const currentQ = quizQuestions[currentIndex] || quizQuestions[0];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto" aria-busy={isSubmitting}>
      {storageError ? <p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Trình duyệt không lưu được bản nháp lâu dài. Bạn vẫn có thể đổi phần học, nhưng đừng tải lại hoặc đóng trang để tránh mất câu trả lời.</p> : <p role="status" className="text-xs text-muted-foreground">{notice || 'Bài đang làm được tự động lưu trên trình duyệt này.'} Thời gian tạm dừng khi rời Quiz.</p>}
      {confirmRetake && <div role="alert" className="flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <p>{result ? 'Bắt đầu lượt làm mới? Kết quả đã nộp vẫn được lưu trong tài khoản.' : 'Bỏ các câu trả lời đang làm và bắt đầu lại?'}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleRetake} className="min-h-11 rounded-lg border px-4">Xác nhận bắt đầu lại</button>
          <button onClick={() => setConfirmRetake(false)} className="min-h-11 rounded-lg border px-4">Giữ bài hiện tại</button>
        </div>
      </div>}
      {session.submission && !result && !revisionConflict && <p role="status" className="text-sm text-muted-foreground">Lượt nộp đang chờ xác nhận. Câu trả lời tạm khóa; dùng nút Thử lại lượt nộp để nhận kết quả.</p>}
      {submitError && <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800">{submitError}</p>}
      {revisionConflict && <button onClick={() => {
        if (window.confirm('Tải đề mới và bắt đầu lại? Câu trả lời của lượt đang làm sẽ không được chuyển sang đề mới.')) window.location.reload();
      }} className="self-start min-h-11 rounded-lg border border-border px-4 text-sm">Tải đề mới và làm lại</button>}
      {/* Top Header info */}
      <div className="bg-card border border-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-foreground">Bài kiểm tra tổng hợp (Unit Quiz)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gồm {quizQuestions.length} câu hỏi trắc nghiệm kiểm tra từ vựng, kanji và ngữ pháp. Đạt từ 70% trở lên để hoàn thành Unit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg font-mono text-xs text-foreground font-semibold">
            <Clock size={14} className="text-accent" />
            {formatTime(seconds)}
          </div>
          <span className="text-xs text-muted-foreground">
            Đã làm: <strong className="text-foreground">{answeredCount}</strong>/{quizQuestions.length}
          </span>
        </div>
      </div>

      {/* RESULT VIEW */}
      {result ? (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center gap-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-md ${
            result.passed ? "bg-green-100 text-green-600 dark:bg-green-950/40" : "bg-amber-100 text-amber-600 dark:bg-amber-950/40"
          }`}>
            <Award size={40} />
          </div>

          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              result.passed 
                ? "bg-green-100 text-green-700 dark:bg-green-950/60" 
                : "bg-amber-100 text-amber-700 dark:bg-amber-950/60"
            }`}>
              {result.passed ? "🎉 Chúc mừng bạn đã Vượt qua!" : "Cần ôn tập thêm"}
            </span>
            <h2 className="text-3xl font-bold text-foreground">
              {result.scorePercent}% ({result.score} / {result.totalQuestions} câu)
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Thời gian hoàn thành: {formatTime(seconds)}
              {result.xpEarned ? ` • Nhận được +${result.xpEarned} XP` : ""}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmRetake(true)}
              className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-medium flex items-center gap-2 shadow-xs transition-colors"
            >
              <RotateCcw size={15} /> Làm lại bài kiểm tra
            </button>
          </div>

          {/* Detailed Review */}
          <div className="w-full text-left mt-6 pt-6 border-t border-border space-y-4">
            <h4 className="text-sm font-bold text-foreground">Xem lại chi tiết từng câu:</h4>
            
            {quizQuestions.map((q, idx) => {
              const processed = result.results?.find(p => p.questionId === q.id);
              const isCorrect = processed?.isCorrect === true;
              const userSelected = processed ? processed.selected : selectedAnswers[q.id];

              return (
                <div 
                  key={q.id || idx}
                  className={`p-4 rounded-xl border ${
                    isCorrect 
                      ? "bg-green-50/20 border-green-500/30 dark:bg-green-950/10" 
                      : "bg-rose-50/20 border-rose-500/30 dark:bg-rose-950/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                      ) : (
                        <XCircle size={18} className="text-rose-600 shrink-0" />
                      )}
                      <p className="text-sm font-medium text-foreground">
                        Câu {idx + 1}: {q.question}
                      </p>
                    </div>
                  </div>

                  {/* Options display */}
                  {userSelected == null && <p className="pl-6 text-sm text-muted-foreground">Bạn chưa trả lời câu này.</p>}
                  {!processed && <p className="pl-6 text-sm text-muted-foreground">Chưa có chi tiết chấm điểm cho câu này.</p>}
                  <div className="flex flex-wrap gap-2 my-3 pl-6">
                    {q.options.map((opt, optIdx) => {
                      const isUserChoice = userSelected === optIdx;
                      const isActualCorrect = processed ? processed.correctIndex === optIdx : false;

                      return (
                        <div
                          key={optIdx}
                          className={`w-full sm:w-[calc(50%-0.25rem)] min-w-0 gap-2 p-2.5 rounded-lg border text-sm flex items-center justify-between ${
                            isActualCorrect
                              ? "bg-green-100/60 border-green-500 font-semibold text-green-900 dark:text-green-200"
                              : isUserChoice && !isCorrect
                              ? "bg-rose-100/60 border-rose-500 font-semibold text-rose-900 dark:text-rose-200"
                              : "border-border/60 bg-background/50 text-muted-foreground"
                          }`}
                        >
                          <span>{opt}</span>
                          {isActualCorrect && <span className="text-[10px] font-bold text-green-700 uppercase">Đúng</span>}
                          {isUserChoice && !isCorrect && <span className="text-[10px] font-bold text-rose-700 uppercase">Đã chọn</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {(q.explanation || processed?.explanation) && (
                    <div className="pl-6 pt-1 text-xs text-muted-foreground leading-relaxed">
                      💡 <strong>Giải thích:</strong> {processed?.explanation || q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* QUIZ IN PROGRESS */
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          {/* Question Stepper Indicator */}
          <div className="flex flex-wrap gap-1.5 justify-center pb-4 border-b border-border/60">
            {quizQuestions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = currentIndex === idx;

              return (
                <button
                  key={q.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    isCurrent 
                      ? "bg-accent text-accent-foreground shadow-xs ring-2 ring-accent/40 scale-105" 
                      : isAnswered
                      ? "bg-foreground/10 text-foreground font-semibold"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question */}
          <div className="py-2">
            <span className="text-xs uppercase font-bold text-accent tracking-wider">
              Câu hỏi {currentIndex + 1} / {quizQuestions.length} ({currentQ.points || 10} điểm)
            </span>
            <h3 
              className="text-xl sm:text-2xl font-bold text-foreground mt-2 leading-relaxed"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-3 my-2">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const optionLetters = ["A", "B", "C", "D"];

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  disabled={isSubmitting || !!session.submission}
                  aria-pressed={isSelected}
                  className={`w-full sm:w-[calc(50%-0.375rem)] min-w-0 p-4 rounded-xl border text-left flex items-center gap-3 transition-all min-h-[56px] active:scale-98 disabled:opacity-60 ${
                    isSelected
                      ? "border-accent bg-accent/10 text-foreground font-semibold shadow-xs ring-1 ring-accent"
                      : "border-border hover:border-foreground/30 hover:bg-muted/40 text-foreground"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {optionLetters[optIdx] || optIdx + 1}
                  </span>
                  <span className="text-sm md:text-base leading-normal">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Action Controls */}
          {answeredCount > 0 && <button onClick={() => setConfirmRetake(true)} disabled={isSubmitting || !!session.submission} className="self-start min-h-11 text-sm underline text-muted-foreground disabled:opacity-50">Bỏ bài đang làm và bắt đầu lại</button>}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="h-10 px-4 rounded-xl border border-border bg-card hover:bg-muted disabled:opacity-35 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft size={15} /> Câu trước
              </button>

              <button
                onClick={() => setCurrentIndex(i => Math.min(quizQuestions.length - 1, i + 1))}
                disabled={currentIndex === quizQuestions.length - 1}
                className="h-10 px-4 rounded-xl border border-border bg-card hover:bg-muted disabled:opacity-35 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                Câu sau <ChevronRight size={15} />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || checking}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-medium flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Đang chấm điểm...
                </>
              ) : (
                <>
                  <Send size={15} /> {user ? session.submission ? 'Thử lại lượt nộp' : `Nộp bài kiểm tra (${answeredCount}/${quizQuestions.length})` : 'Đăng nhập để nộp bài'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
