import React, { useState } from "react";
import { Volume2, Sparkles, BookOpen, PenTool, CheckCircle2 } from "lucide-react";
import type { KanjiItem } from "../types";
import { speakJapanese } from "../ttsHelper";

interface KanjiStudyTabProps {
  kanjiList: KanjiItem[];
  onCompleteTab?: () => void;
  isCompleted?: boolean;
  progressReady?: boolean;
}

export function KanjiStudyTab({ kanjiList, onCompleteTab, isCompleted, progressReady = true }: KanjiStudyTabProps) {
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(
    kanjiList && kanjiList.length > 0 ? kanjiList[0] : null
  );

  if (!kanjiList || kanjiList.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
        <p>Chưa có dữ liệu Hán tự (Kanji) cho bài học này.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Intro banner */}
      <div className="bg-card border border-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-foreground">Hán tự cơ bản ({kanjiList.length} chữ)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ghi nhớ cách đọc Âm On, Âm Kun, số nét và từ ghép thực tế của từng chữ.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {kanjiList.map(k => (
            <button
              key={k.id}
              onClick={() => {
                setSelectedKanji(k);
                speakJapanese(k.character);
              }}
              className={`w-9 h-9 rounded-lg text-lg font-medium flex items-center justify-center transition-all ${
                selectedKanji?.id === k.id
                  ? "bg-accent text-accent-foreground font-bold shadow-xs scale-105"
                  : "bg-muted/50 hover:bg-muted text-foreground border border-border/60"
              }`}
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              {k.character}
            </button>
          ))}
        </div>
      </div>

      {/* Main Focus Card */}
      {selectedKanji && (
        <div className="bg-card border-2 border-accent/30 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Big Character + Stroke Grid */}
            <div className="lg:col-span-4 flex flex-col items-center text-center p-4 bg-background border border-border rounded-xl">
              <div className="relative w-36 h-36 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-card shadow-xs group">
                {/* Traditional cross guide lines */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-px bg-border/40" />
                  <div className="absolute h-full w-px bg-border/40" />
                </div>
                <span 
                  className="text-7xl text-foreground font-bold select-none"
                  style={{ fontFamily: "'Noto Serif JP', serif" }}
                >
                  {selectedKanji.character}
                </span>
                <button
                  onClick={() => speakJapanese(selectedKanji.character)}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-accent/10 hover:bg-accent text-accent hover:text-accent-foreground flex items-center justify-center transition-all"
                  title="Phát âm Kanji"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 bg-muted rounded-md font-mono">
                  {selectedKanji.strokeCount} nét
                </span>
                {selectedKanji.radical && (
                  <span className="px-2 py-0.5 bg-muted rounded-md">
                    Bộ: <strong className="text-foreground" style={{ fontFamily: "'Noto Serif JP', serif" }}>{selectedKanji.radical}</strong>
                  </span>
                )}
              </div>

              {/* Mnemonic / Gợi nhớ */}
              {selectedKanji.mnemonic && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left w-full">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold text-xs mb-1">
                    <Sparkles size={13} /> Mẹo nhớ mặt chữ:
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {selectedKanji.mnemonic}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Readings, Meaning & Compound Words */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Meaning Header */}
              <div>
                <span className="text-xs uppercase tracking-widest text-accent font-semibold">Ý nghĩa chính</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {selectedKanji.meaning}
                </h3>
              </div>

              {/* Readings: On & Kun */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-background border border-border rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      Âm On (Onyomi - 音読み)
                    </span>
                    <button
                      onClick={() => speakJapanese(selectedKanji.onyomi)}
                      className="text-muted-foreground hover:text-foreground p-0.5"
                      title="Nghe âm On"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                  <p className="text-lg font-medium text-foreground" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                    {selectedKanji.onyomi || "—"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Thường dùng khi ghép 2 chữ Hán trở lên</p>
                </div>

                <div className="p-4 bg-background border border-border rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Âm Kun (Kunyomi - 訓読み)
                    </span>
                    <button
                      onClick={() => speakJapanese(selectedKanji.kunyomi)}
                      className="text-muted-foreground hover:text-foreground p-0.5"
                      title="Nghe âm Kun"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                  <p className="text-lg font-medium text-foreground" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                    {selectedKanji.kunyomi || "—"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Thường dùng khi chữ đứng một mình hoặc kèm Okurigana</p>
                </div>
              </div>

              {/* Example Words (Từ ghép thực tế) */}
              {selectedKanji.exampleWords && selectedKanji.exampleWords.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <BookOpen size={14} /> Từ vựng chứa chữ này ({selectedKanji.exampleWords.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedKanji.exampleWords.map((ex, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-background border border-border/80 rounded-xl flex items-center justify-between gap-3 hover:border-accent/40 transition-colors"
                      >
                        <div>
                          <p 
                            className="text-base font-medium text-foreground"
                            style={{ fontFamily: "'Noto Serif JP', serif" }}
                          >
                            {ex.jp}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{ex.en}</p>
                        </div>
                        <button
                          onClick={() => speakJapanese(ex.jp)}
                          className="w-7 h-7 rounded-md bg-muted hover:bg-accent/10 hover:text-accent flex items-center justify-center text-muted-foreground shrink-0 transition-colors"
                          title="Nghe phát âm từ ghép"
                        >
                          <Volume2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid of all Kanji in module for quick reference */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Tất cả Kanji trong Unit:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {kanjiList.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedKanji(item);
                speakJapanese(item.character);
              }}
              className={`p-4 rounded-xl border bg-card cursor-pointer transition-all hover:shadow-xs ${
                selectedKanji?.id === item.id 
                  ? "border-accent ring-1 ring-accent" 
                  : "border-border hover:border-accent/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-3xl font-bold text-foreground"
                  style={{ fontFamily: "'Noto Serif JP', serif" }}
                >
                  {item.character}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{item.strokeCount} nét</span>
              </div>
              <p className="text-sm font-semibold text-foreground line-clamp-1">{item.meaning}</p>
              <div className="mt-2 text-xs text-muted-foreground flex flex-col gap-0.5">
                <span className="line-clamp-1">On: <span className="text-foreground">{item.onyomi || "—"}</span></span>
                <span className="line-clamp-1">Kun: <span className="text-foreground">{item.kunyomi || "—"}</span></span>
              </div>
            </div>
          ))}
        </div>
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
