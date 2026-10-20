import React from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { type ModuleFromApi, type ContentStatus, STATUS_META } from "./types";

interface AdminModuleListProps {
  loading: boolean;
  modules: ModuleFromApi[];
  filterStatus: ContentStatus | "ALL";
  setFilterStatus: (status: ContentStatus | "ALL") => void;
  filteredModules: ModuleFromApi[];
  selectedModuleId: number | null;
  setSelectedModuleId: (id: number) => void;
  fetchModules: () => void;
}

export function AdminModuleList({
  loading,
  modules,
  filterStatus,
  setFilterStatus,
  filteredModules,
  selectedModuleId,
  setSelectedModuleId,
  fetchModules
}: AdminModuleListProps) {
  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold">Status Filter</label>
        <button onClick={fetchModules} className="text-xs text-accent hover:underline flex items-center gap-1" disabled={loading}>
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>
      <select
        className="border border-border rounded-md p-2 bg-background text-sm"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as ContentStatus | "ALL")}
      >
        <option value="ALL">All Statuses ({modules.length})</option>
        <option value="DRAFT">Draft ({modules.filter(m => m.contentStatus === "DRAFT").length})</option>
        <option value="IN_REVIEW">In Review ({modules.filter(m => m.contentStatus === "IN_REVIEW").length})</option>
        <option value="PUBLISHED">Published ({modules.filter(m => m.contentStatus === "PUBLISHED").length})</option>
        <option value="ARCHIVED">Archived ({modules.filter(m => m.contentStatus === "ARCHIVED").length})</option>
      </select>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-2" /> Loading modules...
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] pr-1">
          {filteredModules.map((m) => {
            const meta = STATUS_META[m.contentStatus] || STATUS_META.DRAFT;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModuleId(m.id)}
                className={`text-left p-4 rounded-xl border transition-colors ${
                  selectedModuleId === m.id
                    ? "border-accent bg-accent/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm">{m.level.level}-{String(m.unitNumber).padStart(2, "0")}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.bg} ${meta.text}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-sm line-clamp-1 text-foreground/80">{m.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  V:{m._count.vocabulary} K:{m._count.kanji} G:{m._count.grammarPatterns} Q:{m._count.quizQuestions}
                </p>
              </button>
            );
          })}
          {filteredModules.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground text-center py-4">No modules found.</p>
          )}
        </div>
      )}
    </div>
  );
}