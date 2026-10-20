import React, { useState } from "react";
import { Volume2, ChevronDown, BookMarked, Sparkles, Lightbulb, CheckCircle2 } from "lucide-react";
import type { GrammarPattern } from "../types";
import { speakJapanese } from "../ttsHelper";

interface GrammarStudyTabProps {
  grammarPatterns: GrammarPattern[];
  onCompleteTab?: () => void;
  isCompleted?: boolean;
  progressReady?: boolean;
}

export function GrammarStudyTab({ grammarPatterns, onCompleteTab, isCompleted, progressReady = true }: GrammarStudyTabProps) {
  const [activePatternId, setActivePatternId] = useState<number>(
    grammarPatterns && grammarPatterns.length > 0 ? grammarPatterns[0].id : 0
  );

  if (!grammarPatterns || grammarPatterns.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
        <p>Chưa có dữ liệu ngữ pháp cho bài học này.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Overview & Quick Picker */}
      <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
        <div className="mb-3">
          <h3 className="text-base font-bold text-foreground">Ngữ pháp trọng tâm ({grammarPatterns.length} mẫu câu)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Nắm chắc công thức, ý nghĩa, ngữ cảnh sử dụng và các câu ví dụ mẫu.
          </p>
        </div>

        {/* Quick jump pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
          {grammarPatterns.map((gp, idx) => (
            <button
              key={gp.id}
              onClick={() => setActivePatternId(gp.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePatternId === gp.id
                  ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                  : "bg-muted/60 hover:bg-muted text-foreground border border-border/60"
              }`}
            >
              #{idx + 1}. {gp.pattern}
            </button>
          ))}
        </div>
      </div>

      {/* Grammar Cards List */}
      <div className="flex flex-col gap-6">
        {grammarPatterns.map((pattern, index) => {
          const isActive = activePatternId === pattern.id;
          return (
            <div
              key={pattern.id}
              id={`grammar-${pattern.id}`}
              className={`bg-card border rounded-2xl transition-all duration-200 shadow-xs overflow-hidden ${
                isActive ? "border-accent ring-1 ring-accent/30" : "border-border"
              }`}
            >
              {/* Pattern Header */}
              <div 
                onClick={() => setActivePatternId(pattern.id)}
                className="p-5 sm:p-6 bg-gradient-to-r from-card via-card to-accent/5 border-b border-border/80 cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-accent/10 text-accent font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div>
                    <h3 
                      className="text-xl sm:text-2xl font-bold text-foreground tracking-wide"
                      style={{ fontFamily: "'Noto Serif JP', serif" }}
                    >
                      {pattern.pattern}
                    </h3>
                    <p className="text-sm font-semibold text-accent mt-1">
                      Ý nghĩa: {pattern.meaning}
                    </p>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 bg-muted rounded-md text-muted-foreground font-mono shrink-0">
                  {pattern.lesson || `N5-0${index + 1}`}
                </span>
              </div>

              {/* Detailed Content */}
              <div className="p-5 sm:p-6 flex flex-col gap-6">
                {/* Explanation */}
                <div className="p-4 bg-muted/30 border border-border/80 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                    <Lightbulb size={14} className="text-amber-500" /> Giải thích cấu trúc:
                  </h4>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                    {pattern.explanation}
                  </p>
                </div>

                {/* Example Sentences */}
                {pattern.examples && pattern.examples.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
                      <BookMarked size={14} className="text-accent" /> Các câu ví dụ ({pattern.examples.length}):
                    </h4>

                    <div className="space-y-3">
                      {pattern.examples.map((ex, exIdx) => (
                        <div
                          key={ex.id || exIdx}
                          className="p-4 bg-background border border-border/80 rounded-xl hover:border-accent/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <p 
                              className="text-base sm:text-lg font-medium text-foreground leading-relaxed"
                              style={{ fontFamily: "'Noto Serif JP', serif" }}
                            >
                              {ex.japanese}
                            </p>
                            {ex.romaji && (
                              <p className="text-xs font-mono text-muted-foreground">
                                {ex.romaji}
                              </p>
                            )}
                            <p className="text-sm text-foreground/80 font-normal">
                              {ex.english}
                            </p>
                          </div>

                          <button
                            onClick={() => speakJapanese(ex.japanese)}
                            className="w-9 h-9 rounded-lg bg-accent/10 hover:bg-accent text-accent hover:text-accent-foreground flex items-center justify-center shrink-0 transition-all self-end sm:self-center"
                            title="Nghe phát âm câu ví dụ"
                            aria-label={`Nghe ví dụ ${ex.japanese}`}
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
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
