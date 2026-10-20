import React, { useState } from "react";
import { BookOpen, PenTool, CheckCircle, HelpCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import type { SectionItem, ReadingPassage, WritingTask, ExerciseItem } from "../types";
import { speakJapanese } from "../ttsHelper";
import { answerDisplay } from '../answerDisplay';
import { SentenceOrderPractice } from '../SentenceOrderPractice';
import { WritingDraftInput } from '../WritingDraftInput';

interface ExerciseStudyTabProps {
  moduleId: number;
  userId?: number;
  checking: boolean;
  sections: SectionItem[];
  onCompleteTab?: () => void;
  isCompleted?: boolean;
  progressReady?: boolean;
}

export function ExerciseStudyTab({ moduleId, userId, checking, sections, onCompleteTab, isCompleted, progressReady = true }: ExerciseStudyTabProps) {
  const readingPassages: ReadingPassage[] = [];
  const writingTasks: WritingTask[] = [];
  const exercises: ExerciseItem[] = [];

  sections.forEach(s => {
    if (s.readingPassages) readingPassages.push(...s.readingPassages);
    if (s.writingTasks) writingTasks.push(...s.writingTasks);
    if (s.exercises) exercises.push(...s.exercises);
  });
  // The full-content API includes reading questions both under their passage
  // and under the section. Render them only once, alongside their passage.
  const readingIds = new Set(readingPassages.flatMap(p => (p.exercises || []).map(e => e.id)));
  const practiceExercises = exercises.filter(e => !readingIds.has(e.id));
  const listeningById = new Map(sections.flatMap(s => s.listeningContent || []).map(item => [item.id, item]));

  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const toggleReveal = (key: string) => {
    setRevealedAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectOption = (key: string, option: string) => {
    setSelectedOptions(prev => ({ ...prev, [key]: option }));
  };

  if (readingPassages.length === 0 && writingTasks.length === 0 && exercises.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
        <p>Chưa có bài tập thực hành bổ trợ cho bài học này.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Đọc hiểu (Reading Passages) */}
      {readingPassages.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-accent" size={20} />
            <h3 className="text-lg font-bold text-foreground">Luyện đọc hiểu (Dokkai - 読解)</h3>
          </div>

          <div className="space-y-6">
            {readingPassages.map((rp, idx) => {
              const revealKey = `reading-${rp.id || idx}`;
              const isRevealed = revealedAnswers[revealKey];

              return (
                <div key={rp.id || idx} className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h4 className="text-base font-bold text-foreground">{rp.title || `Bài đọc ${idx + 1}`}</h4>
                    <button
                      onClick={() => toggleReveal(revealKey)}
                      className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors"
                    >
                      {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                      {isRevealed ? "Ẩn dịch nghĩa" : "Xem dịch nghĩa"}
                    </button>
                  </div>

                  {/* Japanese Content */}
                  <div className="p-4 sm:p-5 bg-background border border-border/80 rounded-xl leading-loose text-base text-foreground font-medium whitespace-pre-wrap" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                    {rp.content}
                  </div>

                  {/* Translation */}
                  {isRevealed && rp.translation && (
                    <div className="mt-3 p-4 bg-muted/40 border border-border/60 rounded-xl text-xs text-foreground/80 leading-relaxed italic whitespace-pre-wrap">
                      {rp.translation}
                    </div>
                  )}

                  {/* Questions under reading */}
                  {rp.exercises && rp.exercises.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-border space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Câu hỏi đọc hiểu:</p>
                      {rp.exercises.map((ex, exIdx) => {
                        const exKey = `reading-q-${ex.id || exIdx}`;
                        const isExRevealed = revealedAnswers[exKey];
                        return (
                          <div key={ex.id || exIdx} className="p-3 bg-muted/20 border border-border/60 rounded-lg text-xs space-y-2">
                            <p className="font-medium text-foreground">{exIdx + 1}. {ex.prompt}</p>
                            {ex.options && (
                              <div className="flex flex-wrap gap-1.5 pl-2">
                                {ex.options.map((opt, optIdx) => (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleSelectOption(exKey, opt)}
                                    className={`w-full sm:w-[calc(50%-0.1875rem)] min-h-11 p-2 text-left rounded-md border text-sm transition-colors ${
                                      selectedOptions[exKey] === opt
                                        ? "border-accent bg-accent/10 font-semibold"
                                        : "border-border/60 hover:bg-muted/40"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            )}
                            <div className="flex flex-col items-start gap-2 pt-1">
                              <button
                                onClick={() => toggleReveal(exKey)}
                                className="text-[11px] text-accent hover:underline flex items-center gap-1"
                              >
                                {isExRevealed ? "Ẩn đáp án" : "Xem đáp án"}
                              </button>
                              {isExRevealed && (
                                <span className="text-sm text-green-700 font-semibold break-words">
                                  Đáp án: {answerDisplay(ex.correctAnswer, ex.options)} {ex.explanation && `(${ex.explanation})`}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Bài tập thực hành tổng hợp (Exercises) */}
      {practiceExercises.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-accent" size={20} />
            <h3 className="text-lg font-bold text-foreground">Bài tập vận dụng ({practiceExercises.length} câu)</h3>
          </div>

          <div className="flex flex-wrap gap-4">
            {practiceExercises.map((ex, idx) => {
              const exKey = `exercise-${ex.id || idx}`;
              const isRevealed = revealedAnswers[exKey];
              const selected = selectedOptions[exKey];

              return (
                <div key={ex.id || idx} role="group" aria-label={ex.prompt} className="w-full md:w-[calc(50%-0.5rem)] min-w-0 bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-muted-foreground">Câu {idx + 1}</span>
                      {ex.exerciseType && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                          {ex.exerciseType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground mb-3">{ex.prompt}</p>
                    {ex.listeningId && listeningById.has(ex.listeningId) && <p className="text-xs text-muted-foreground mb-3">
                      Ngữ cảnh: bài nghe “{listeningById.get(ex.listeningId)!.title}” trong phần Hội thoại &amp; Nghe.
                    </p>}

                    {ex.options && (ex.exerciseType === 'SENTENCE_ORDERING' ? <SentenceOrderPractice key={ex.id} options={ex.options} /> : (
                      <div className="space-y-1.5 mb-3">
                        {ex.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(exKey, opt)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                              selected === opt 
                                ? "border-accent bg-accent/10 font-semibold text-foreground" 
                                : "border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border/60 flex flex-col items-start gap-2 text-sm">
                    <button
                      onClick={() => toggleReveal(exKey)}
                      className="text-accent hover:underline font-medium"
                    >
                      {isRevealed ? "Ẩn đáp án" : "Xem đáp án & giải thích"}
                    </button>
                    {isRevealed && (
                      <span className="text-green-600 font-semibold">
                        Đáp án: {answerDisplay(ex.correctAnswer, ex.options)}
                      </span>
                    )}
                  </div>

                  {isRevealed && ex.explanation && (
                    <p className="mt-2 p-2 bg-muted/40 rounded text-[11px] text-muted-foreground leading-normal">
                      💡 {ex.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Luyện viết (Writing Tasks) */}
      {writingTasks.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <PenTool className="text-accent" size={20} />
            <h3 className="text-lg font-bold text-foreground">Thực hành luyện viết (Sakubun - 作文)</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">Bản nháp chỉ lưu trên trình duyệt này, tách riêng theo tài khoản và chế độ khách. Bài viết chưa đồng bộ sang thiết bị khác.</p>

          <div className="space-y-4">
            {writingTasks.map((wt, idx) => {
              const wtKey = `writing-${wt.id || idx}`;
              const isRevealed = revealedAnswers[wtKey];

              return (
                <div key={wt.id || idx} className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-base font-bold text-foreground">Chủ đề: {wt.prompt}</h4>
                    <button
                      onClick={() => toggleReveal(wtKey)}
                      className="text-xs text-accent hover:underline shrink-0"
                    >
                      {isRevealed ? "Ẩn bài mẫu" : "Xem bài mẫu gợi ý"}
                    </button>
                  </div>

                  {wt.instructions && (
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      📝 Yêu cầu: {wt.instructions}
                    </p>
                  )}

                  <WritingDraftInput
                    moduleId={moduleId}
                    taskId={wt.id}
                    userId={userId}
                    checking={checking}
                    prompt={wt.prompt}
                  />

                  {isRevealed && wt.sampleAnswer && (
                    <div className="mt-3 p-4 bg-accent/5 border border-accent/20 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-accent uppercase text-[11px]">Bài viết mẫu:</p>
                      <p className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                        {wt.sampleAnswer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hoàn thành tab button */}
      {!isCompleted && onCompleteTab && (
        <div className="mt-8 flex justify-center pb-8">
          <button
            disabled={!progressReady}
            onClick={() => { if (progressReady) onCompleteTab(); }}
            className="disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-medium shadow-xs flex items-center gap-2 transition-transform active:scale-95"
          >
            <CheckCircle2 size={18} /> Đánh dấu đã hoàn thành phần này
          </button>
        </div>
      )}
    </div>
  );
}
