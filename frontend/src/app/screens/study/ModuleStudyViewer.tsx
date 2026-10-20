import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, Languages, ScrollText, MessageSquare, 
  PenTool, Award, Loader2, ArrowLeft, ArrowRight, CheckCircle2 
} from "lucide-react";
import type { StudyModuleData, StudyTabId } from "./types";
import { contentApi, progressApi } from "../../services/api";
import { useStudyProgress } from "./useStudyProgress";
import { StudyHeader } from "./StudyHeader";
import { VocabStudyTab } from "./tabs/VocabStudyTab";
import { KanjiStudyTab } from "./tabs/KanjiStudyTab";
import { GrammarStudyTab } from "./tabs/GrammarStudyTab";
import { DialogueStudyTab } from "./tabs/DialogueStudyTab";
import { ExerciseStudyTab } from "./tabs/ExerciseStudyTab";
import { QuizStudyTab } from "./tabs/QuizStudyTab";
import { GuestNotice, useAuth } from '../../components/auth/AuthProvider';

interface ModuleStudyViewerProps {
  moduleId: number;
  onBack: () => void;
}

export function ModuleStudyViewer({ moduleId, onBack }: ModuleStudyViewerProps) {
  const [moduleData, setModuleData] = useState<StudyModuleData | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StudyTabId>("vocab");

  const { user, checking } = useAuth();
  const positionKey = `study_tab_v1_${moduleId}_${user?.id ?? 'guest'}`;
  const previousPositionKey = useRef<string | null>(null);
  useEffect(() => {
    if (checking || previousPositionKey.current === positionKey) return;
    const wasGuest = previousPositionKey.current === `study_tab_v1_${moduleId}_guest`;
    previousPositionKey.current = positionKey;
    // Sign-in keeps the current lesson visible, including the guest's Quiz answers.
    if (wasGuest && user) {
      try { localStorage.setItem(positionKey, activeTab); } catch { /* Non-critical navigation preference. */ }
      return;
    }
    try {
      const saved = localStorage.getItem(positionKey);
      setActiveTab(['vocab', 'kanji', 'grammar', 'dialogue', 'exercise', 'quiz'].includes(saved || '') ? saved as StudyTabId : 'vocab');
    } catch { setActiveTab('vocab'); }
  }, [positionKey, checking, moduleId, user?.id]);
  const study = useStudyProgress(moduleId, user?.id ?? null, checking);
  const unitCompleted = !!user && study.quizCompleted;
  const completedTabs = new Set(study.completedTabs as StudyTabId[]);

  useEffect(() => {
    let isMounted = true;
    async function loadModuleContent() {
      setLoading(true);
      setError(null);
      try {
        const res = await contentApi.getModuleFullContent(moduleId);
        if (isMounted) {
          if (res && res.success && res.data) {
            setModuleData(res.data);
          } else {
            setError(res?.message || "Không thể tải nội dung bài học.");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("[ModuleStudyViewer] Fetch error:", err);
          setError(err.status === 404
            ? "Bài học này chưa được mở hoặc đã tạm ẩn. Bạn hãy quay lại lộ trình để chọn bài đang có sẵn."
            : err.name === "TimeoutError" ? "Tải bài quá lâu. Hãy kiểm tra kết nối rồi thử lại." : "Không tải được bài học. Hãy kiểm tra kết nối rồi thử lại.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadModuleContent();
    return () => { isMounted = false; };
  }, [moduleId, loadAttempt]);

  const markTabCompleted = (tabId: StudyTabId) => {
    if (study.ready && tabId !== 'quiz' && !completedTabs.has(tabId)) study.complete(tabId);
  };

  const tabsConfig: Array<{ id: StudyTabId; label: string; icon: React.ReactNode; count?: number }> = [
    { 
      id: "vocab", 
      label: "Từ vựng", 
      icon: <BookOpen size={16} />, 
      count: moduleData?.vocabulary?.length || 0 
    },
    { 
      id: "kanji", 
      label: "Hán tự", 
      icon: <Languages size={16} />, 
      count: moduleData?.kanji?.length || 0 
    },
    { 
      id: "grammar", 
      label: "Ngữ pháp", 
      icon: <ScrollText size={16} />, 
      count: moduleData?.grammarPatterns?.length || 0 
    },
    { 
      id: "dialogue", 
      label: "Hội thoại & Nghe", 
      icon: <MessageSquare size={16} /> 
    },
    { 
      id: "exercise", 
      label: "Bài tập & Đọc", 
      icon: <PenTool size={16} /> 
    },
    { 
      id: "quiz", 
      label: "Kiểm tra Quiz", 
      icon: <Award size={16} />, 
      count: moduleData?.quizQuestions?.length || 0 
    },
  ];

  const currentTabIndex = tabsConfig.findIndex(t => t.id === activeTab);
  const prevTab = currentTabIndex > 0 ? tabsConfig[currentTabIndex - 1] : null;
  const nextTab = currentTabIndex < tabsConfig.length - 1 ? tabsConfig[currentTabIndex + 1] : null;

  const handleSwitchTab = (tabId: StudyTabId) => {
    setActiveTab(tabId);
    if (!checking) {
      try { localStorage.setItem(positionKey, tabId); } catch { /* Quiz reports draft-storage errors separately. */ }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 size={36} className="animate-spin text-accent mb-4" />
        <h3 className="text-lg font-medium text-foreground">Đang tải nội dung bài học...</h3>
        <p className="text-xs text-muted-foreground mt-1">Đang chuẩn bị từ vựng, kanji và ngữ pháp</p>
      </div>
    );
  }

  if (error || !moduleData) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-card border border-border rounded-2xl text-center shadow-xs">
        <p className="text-sm text-rose-600 mb-4">{error || "Không tìm thấy dữ liệu module."}</p>
        <button onClick={() => setLoadAttempt(n => n + 1)} className="min-h-11 px-5 py-2.5 rounded-xl border border-border mr-3 mb-3">Thử lại tải bài</button>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Quay lại lộ trình
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 flex flex-col">
      {/* Sticky Header */}
      <StudyHeader 
        module={moduleData} 
        onBack={onBack} 
        completedTabsCount={completedTabs.size + (unitCompleted ? 1 : 0)}
        totalTabsCount={tabsConfig.length}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6 flex-1">
        <GuestNotice />
        <div className="flex flex-wrap items-center gap-3 text-sm" role="status">
          <span>{study.error ? (study.ready ? 'Chưa lưu được tiến độ. Hãy thử lại hoặc mở lại bài khi có mạng.' : 'Chưa tải được tiến độ tài khoản. Bạn vẫn có thể đọc, nghe và luyện tập; hãy thử lại để đánh dấu đã học.') : !study.ready ? 'Đang tải tiến độ học…' : study.saving || study.pending ? 'Đang lưu tiến độ…' : user ? 'Tiến độ đã đồng bộ với tài khoản.' : study.storageError ? 'Tiến độ học thử chỉ được giữ trong phiên đang mở.' : 'Tiến độ học thử lưu trên trình duyệt này.'}</span>
          {study.error && <button onClick={study.retry} className="border border-border rounded-lg px-3 py-2">{study.ready ? 'Thử lại lưu tiến độ' : 'Thử lại tải tiến độ'}</button>}
          {study.storageError && <span className="text-rose-600">{user ? 'Không ghi được bản lưu trên trình duyệt. Đừng đóng trang khi chưa đồng bộ xong.' : 'Trình duyệt không lưu được tiến độ học thử. Dữ liệu đang học có thể mất khi tải lại hoặc rời trang.'}</span>}
          {user && study.ready && <button onClick={() => study.importLocal((moduleData.vocabulary || []).map(v => v.id))} className="border border-border rounded-lg px-3 py-2">Nhập tiến độ học thử và bản lưu cũ trên máy vào tài khoản</button>}
        </div>
        {unitCompleted && <p role="status" className="rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-800">Bạn đã đạt bài kiểm tra. Kết quả hoàn thành Unit đã được lưu vào tài khoản.</p>}
        {/* Navigation Tabs Bar (Scrollable on mobile, horizontal pills on PC) */}
        <div className="bg-card border border-border p-1.5 rounded-2xl shadow-xs overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.id;
            const isCompleted = tab.id === 'quiz' ? unitCompleted : completedTabs.has(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => handleSwitchTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0 ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-accent-foreground/20 text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {tab.count}
                  </span>
                )}
                {isCompleted && !isActive && (
                  <CheckCircle2 size={13} className="text-green-600 ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 mt-2 min-w-0">
          {activeTab === "vocab" && (
            <VocabStudyTab 
              vocabulary={moduleData.vocabulary || []} 
              onCompleteTab={() => markTabCompleted("vocab")}
              masteredIds={new Set(study.masteredVocabularyIds)}
              onToggleMastered={(id, mastered) => study.word(id, mastered)}
              progressReady={study.ready}
            />
          )}

          {activeTab === "kanji" && (
            <KanjiStudyTab 
              kanjiList={moduleData.kanji || []} 
              onCompleteTab={() => markTabCompleted("kanji")}
              isCompleted={completedTabs.has("kanji")}
              progressReady={study.ready}
            />
          )}

          {activeTab === "grammar" && (
            <GrammarStudyTab 
              grammarPatterns={moduleData.grammarPatterns || []} 
              onCompleteTab={() => markTabCompleted("grammar")}
              isCompleted={completedTabs.has("grammar")}
              progressReady={study.ready}
            />
          )}

          {activeTab === "dialogue" && (
            <DialogueStudyTab 
              sections={moduleData.sections || []} 
              onCompleteTab={() => markTabCompleted("dialogue")}
              isCompleted={completedTabs.has("dialogue")}
              progressReady={study.ready}
            />
          )}

          {activeTab === "exercise" && (
            <ExerciseStudyTab 
              moduleId={moduleData.id}
              userId={user?.id}
              checking={checking}
              sections={moduleData.sections || []} 
              onCompleteTab={() => markTabCompleted("exercise")}
              isCompleted={completedTabs.has("exercise")}
              progressReady={study.ready}
            />
          )}

          {activeTab === "quiz" && (
            <QuizStudyTab 
              moduleId={moduleData.id} 
              quizQuestions={moduleData.quizQuestions || []}
              revision={moduleData.quizRevision} 
              onCompleteTab={study.confirmQuiz}
            />
          )}
        </div>
      </main>

      {/* Floating / Sticky Bottom Navigation Bar (Very friendly on Mobile & PC) */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-card/95 backdrop-blur-md border-t border-border py-3 px-4 sm:px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {prevTab ? (
            <button
              onClick={() => handleSwitchTab(prevTab.id)}
              className="h-10 px-4 rounded-xl border border-border hover:bg-muted text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors active:scale-98"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Phần trước:</span> {prevTab.label}
            </button>
          ) : (
            <button
              onClick={onBack}
              className="h-10 px-4 rounded-xl border border-border hover:bg-muted text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors text-muted-foreground"
            >
              <ArrowLeft size={16} /> Lộ trình
            </button>
          )}

          <div className="text-xs text-muted-foreground font-medium hidden md:block">
            Đang học: <strong className="text-foreground">{tabsConfig[currentTabIndex]?.label}</strong> ({currentTabIndex + 1}/{tabsConfig.length})
          </div>

          {nextTab ? (
            <button
              onClick={() => handleSwitchTab(nextTab.id)}
              className="h-10 px-5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs transition-colors active:scale-98"
            >
              <span className="hidden sm:inline">Tiếp theo:</span> {nextTab.label}
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={onBack}
              disabled={checking || !unitCompleted}
              title={unitCompleted ? 'Kết quả đã được lưu' : 'Cần đạt ít nhất 70% bài kiểm tra để hoàn thành Unit'}
              className="min-h-11 px-3 sm:px-5 rounded-xl bg-green-700 text-white hover:bg-green-800 disabled:opacity-50 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs transition-colors"
            >
              <CheckCircle2 size={16} /> {unitCompleted ? 'Về lộ trình' : 'Chưa đạt Quiz'}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
