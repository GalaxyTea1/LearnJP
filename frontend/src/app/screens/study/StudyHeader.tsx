import React from "react";
import { ArrowLeft, BookOpen, CheckCircle, Award } from "lucide-react";
import type { StudyModuleData } from "./types";

interface StudyHeaderProps {
  module: StudyModuleData;
  onBack: () => void;
  completedTabsCount: number;
  totalTabsCount: number;
}

export function StudyHeader({ module, onBack, completedTabsCount, totalTabsCount }: StudyHeaderProps) {
  const percent = Math.round((completedTabsCount / totalTabsCount) * 100);

  return (
    <header className="bg-card border-b border-border sticky top-14 z-20 backdrop-blur-md bg-card/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl border border-border hover:border-foreground/40 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            title="Quay lại danh sách lộ trình"
            aria-label="Quay lại lộ trình"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span 
                className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider text-background"
                style={{ backgroundColor: module.level?.color || "#b5382a" }}
              >
                {module.level?.level || "N5"}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Unit {String(module.unitNumber).padStart(2, "0")}
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
              {module.title}
            </h1>
            <p className="text-xs text-muted-foreground truncate font-light" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              {module.titleJp}
            </p>
          </div>
        </div>

        {/* Right: Progress indicator */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-foreground">
              Tiến độ bài học: <span className="text-accent font-bold">{completedTabsCount}/{totalTabsCount}</span> phần
            </p>
            <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-accent transition-all duration-300 rounded-full" 
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="sm:hidden flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-accent">{percent}%</span> hoàn thành
          </div>
        </div>
      </div>
    </header>
  );
}
