import React, { useState, useMemo, useEffect } from "react";
import { 
  Volume2, Search, CheckCircle2, Bookmark, RotateCw, 
  ChevronLeft, ChevronRight, Shuffle, LayoutList, Layers
} from "lucide-react";
import type { VocabularyItem } from "../types";
import { speakJapanese } from "../ttsHelper";

interface VocabStudyTabProps {
  vocabulary: VocabularyItem[];
  onCompleteTab?: () => void;
  masteredIds: Set<number>;
  onToggleMastered: (id: number, mastered: boolean) => void;
  progressReady: boolean;
}

export function VocabStudyTab({ vocabulary, onCompleteTab, masteredIds, onToggleMastered, progressReady }: VocabStudyTabProps) {
  const [viewMode, setViewMode] = useState<"list" | "flashcard">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLearned, setFilterLearned] = useState<"all" | "mastered" | "learning">("all");
  
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const toggleMastered = (id: number) => {
    if (!progressReady) return;
    const next = new Set(masteredIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    onToggleMastered(id, next.has(id));
    if (vocabulary.length > 0 && vocabulary.every(item => next.has(item.id))) onCompleteTab?.();
  };

  const filteredVocab = useMemo(() => {
    return vocabulary.filter(item => {
      const sq = searchQuery.toLowerCase();
      const matchesSearch = 
        (item.japanese || "").toLowerCase().includes(sq) ||
        (item.hiragana || "").toLowerCase().includes(sq) ||
        (item.romaji || "").toLowerCase().includes(sq) ||
        (item.english || "").toLowerCase().includes(sq);
      
      if (!matchesSearch) return false;
      if (filterLearned === "mastered") return masteredIds.has(item.id);
      if (filterLearned === "learning") return !masteredIds.has(item.id);
      return true;
    });
  }, [vocabulary, searchQuery, filterLearned, masteredIds]);

  const currentCard = filteredVocab[cardIndex] || filteredVocab[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex(prev => (prev + 1) % (filteredVocab.length || 1));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex(prev => (prev - 1 + (filteredVocab.length || 1)) % (filteredVocab.length || 1));
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    if (filteredVocab.length > 1) {
      setCardIndex(Math.floor(Math.random() * filteredVocab.length));
    }
  };

  if (!vocabulary || vocabulary.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
        <p>Chưa có dữ liệu từ vựng cho bài học này.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-border p-0.5 bg-muted/40">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === "list" 
                  ? "bg-background text-foreground shadow-xs" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList size={14} /> Danh sách ({vocabulary.length})
            </button>
            <button
              onClick={() => setViewMode("flashcard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === "flashcard" 
                  ? "bg-background text-foreground shadow-xs" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers size={14} /> Flashcard
            </button>
          </div>

          <span className="text-xs text-muted-foreground hidden md:inline-block">
            Đã thuộc: <strong className="text-green-600">{masteredIds.size}</strong>/{vocabulary.length}
          </span>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm từ vựng, romaji, nghĩa..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCardIndex(0);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-hidden focus:border-accent"
            />
          </div>

          <select
            value={filterLearned}
            onChange={(e) => {
              setFilterLearned(e.target.value as any);
              setCardIndex(0);
            }}
            className="text-xs py-1.5 px-2 bg-background border border-border rounded-lg text-muted-foreground"
          >
            <option value="all">Tất cả</option>
            <option value="learning">Chưa thuộc ({vocabulary.length - masteredIds.size})</option>
            <option value="mastered">Đã thuộc ({masteredIds.size})</option>
          </select>
        </div>
      </div>

      {/* FLASHCARD VIEW */}
      {viewMode === "flashcard" && (
        <div className="flex flex-col items-center gap-6 py-4">
          {filteredVocab.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10">Không tìm thấy từ vựng phù hợp với bộ lọc.</p>
          ) : (
            <>
              {/* Counter and controls */}
              <div className="flex items-center justify-between w-full max-w-lg px-2 text-xs text-muted-foreground">
                <span>Thẻ {cardIndex + 1} / {filteredVocab.length}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleShuffle}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Xáo trộn thứ tự thẻ"
                  >
                    <Shuffle size={14} />
                  </button>
                  <button
                    onClick={() => toggleMastered(currentCard.id)}
                    aria-pressed={masteredIds.has(currentCard.id)}
                    disabled={!progressReady}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                      masteredIds.has(currentCard.id)
                        ? "bg-green-100 text-green-700 dark:bg-green-950/40"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    {masteredIds.has(currentCard.id) ? "Đã thuộc" : "Đánh dấu đã thuộc"}
                  </button>
                </div>
              </div>

              {/* 3D Flashcard Container */}
              <div 
                onClick={() => setIsFlipped(f => !f)}
                className="w-full max-w-lg min-h-[300px] sm:min-h-[340px] cursor-pointer perspective-1000 select-none"
              >
                <div 
                  className={`relative w-full h-full min-h-[300px] sm:min-h-[340px] rounded-2xl border-2 transition-all duration-300 transform-style-3d shadow-md ${
                    isFlipped 
                      ? "border-accent/40 bg-card" 
                      : "border-border bg-card hover:border-accent/60"
                  }`}
                >
                  {/* FRONT */}
                  {!isFlipped ? (
                    <div className="absolute inset-0 p-8 flex flex-col justify-between items-center text-center">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        {currentCard.type || "Vocabulary"}
                      </span>

                      <div className="flex flex-col items-center gap-3 my-auto">
                        <h2 
                          className="text-4xl sm:text-5xl font-medium text-foreground tracking-wide"
                          style={{ fontFamily: "'Noto Serif JP', serif" }}
                        >
                          {currentCard.japanese}
                        </h2>
                        {currentCard.japanese !== currentCard.hiragana && (
                          <p className="text-base text-muted-foreground font-light">
                            {currentCard.hiragana}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakJapanese(currentCard.japanese);
                          }}
                          className="mt-2 w-10 h-10 rounded-full bg-accent/10 hover:bg-accent/20 text-accent flex items-center justify-center transition-colors active:scale-95"
                          title="Nghe phát âm"
                        >
                          <Volume2 size={20} />
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <RotateCw size={12} className="animate-spin-slow" /> Chạm vào thẻ để lật xem nghĩa
                      </p>
                    </div>
                  ) : (
                    /* BACK */
                    <div className="absolute inset-0 p-8 flex flex-col justify-between items-center text-center bg-accent/5 rounded-2xl">
                      <span className="text-xs uppercase tracking-widest text-accent font-semibold">
                        Ý nghĩa & Ví dụ
                      </span>

                      <div className="flex flex-col items-center gap-4 my-auto max-w-sm">
                        <div>
                          <p className="text-sm font-mono text-muted-foreground mb-1">{currentCard.romaji}</p>
                          <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                            {currentCard.english}
                          </h3>
                        </div>

                        {currentCard.exampleJp && (
                          <div className="mt-2 p-3.5 bg-background/80 border border-border rounded-xl text-left w-full text-xs">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-semibold text-accent text-[11px] uppercase">Ví dụ:</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speakJapanese(currentCard.exampleJp!);
                                }}
                                className="text-muted-foreground hover:text-accent p-1"
                              >
                                <Volume2 size={13} />
                              </button>
                            </div>
                            <p className="text-sm font-medium leading-relaxed" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                              {currentCard.exampleJp}
                            </p>
                            {currentCard.exampleEn && (
                              <p className="text-muted-foreground mt-1 leading-normal italic">
                                {currentCard.exampleEn}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Chạm vào thẻ để lật lại
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={handlePrevCard}
                  className="h-11 px-5 rounded-xl border border-border bg-card hover:bg-muted text-sm font-medium flex items-center gap-2 active:scale-95 transition-all"
                >
                  <ChevronLeft size={16} /> Từ trước
                </button>
                <button
                  onClick={handleNextCard}
                  className="h-11 px-6 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-medium flex items-center gap-2 shadow-xs active:scale-95 transition-all"
                >
                  Từ tiếp theo <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredVocab.length === 0 ? (
            <div className="col-span-full text-center py-12 text-sm text-muted-foreground border border-dashed rounded-xl">
              Không tìm thấy từ vựng phù hợp với từ khóa "{searchQuery}".
            </div>
          ) : (
            filteredVocab.map((item, index) => {
              const isMastered = masteredIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-card border rounded-xl p-4 flex flex-col justify-between transition-all duration-150 hover:shadow-xs ${
                    isMastered ? "border-green-500/30 bg-green-50/20 dark:bg-green-950/10" : "border-border"
                  }`}
                >
                  <div>
                    {/* Header: Term & Actions */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded-sm">#{index + 1}</span>
                          {item.japanese !== item.hiragana && (
                            <span className="text-[11px] text-muted-foreground font-medium">
                              {item.hiragana}
                            </span>
                          )}
                        </div>
                        <h4 
                          className="text-2xl font-bold text-foreground leading-tight"
                          style={{ fontFamily: "'Noto Serif JP', serif" }}
                        >
                          {item.japanese}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 pt-1">
                        <button
                          onClick={() => speakJapanese(item.japanese)}
                          className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
                          title="Nghe phát âm"
                          aria-label={`Nghe phát âm ${item.japanese}`}
                        >
                          <Volume2 size={16} />
                        </button>
                        <button
                          onClick={() => toggleMastered(item.id)}
                          aria-pressed={isMastered}
                          disabled={!progressReady}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isMastered 
                              ? "text-green-600 bg-green-100 dark:bg-green-950/50" 
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                          title={isMastered ? "Đã thuộc" : "Đánh dấu đã thuộc"}
                          aria-label={isMastered ? "Bỏ đánh dấu đã thuộc" : "Đánh dấu đã thuộc"}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Romaji & Meaning */}
                    <div className="mb-3">
                      <p className="text-[11px] font-mono text-muted-foreground/80">{item.romaji}</p>
                      <p className="text-sm font-medium text-foreground mt-0.5">{item.english}</p>
                      {item.type && (
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase tracking-wider font-semibold">
                          {item.type}
                        </span>
                      )}
                    </div>

                    {/* Example Sentence */}
                    {item.exampleJp && (
                      <div className="p-2.5 bg-muted/30 border border-border/60 rounded-lg text-xs space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-medium text-foreground/90" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                            {item.exampleJp}
                          </p>
                          <button
                            onClick={() => speakJapanese(item.exampleJp!)}
                            className="text-muted-foreground hover:text-accent p-0.5 shrink-0"
                            title="Nghe câu ví dụ"
                          >
                            <Volume2 size={12} />
                          </button>
                        </div>
                        {item.exampleEn && (
                          <p className="text-[11px] text-muted-foreground italic">
                            {item.exampleEn}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
