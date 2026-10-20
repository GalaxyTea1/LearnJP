import { listeningReady, isTtsListening } from './study/dialoguePlayer';
import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle, AlertTriangle, AlertCircle, FileText,
  ChevronRight, Database, RefreshCw, Loader2, Archive, LogOut
} from "lucide-react";
import { adminApi, authApi } from "../services/api";
import { AdminAuthForm } from "./admin/AdminAuthForm";
import { AdminModuleList } from "./admin/AdminModuleList";
import { 
  type ContentStatus, type ModuleFromApi, type ModuleFullContent, 
  type SectionData, STATUS_META 
} from "./admin/types";

// ─── Component ───────────────────────────────────────────────────────────────

function getModuleLevelData(sectionType: string, fullContent: ModuleFullContent): { count: number } | null {
  switch (sectionType) {
    case "VOCABULARY": return fullContent.vocabulary ? { count: fullContent.vocabulary.length } : null;
    case "KANJI": return fullContent.kanji ? { count: fullContent.kanji.length } : null;
    case "GRAMMAR": return fullContent.grammarPatterns ? { count: fullContent.grammarPatterns.length } : null;
    case "SUMMARY": return fullContent.quizQuestions ? { count: fullContent.quizQuestions.length } : null;
    default: return null;
  }
}

export default function AdminPage() {
  const [modules, setModules] = useState<ModuleFromApi[]>([]);
  const [filterStatus, setFilterStatus] = useState<ContentStatus | "ALL">("ALL");
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [fullContent, setFullContent] = useState<ModuleFullContent | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auth states
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (err) {
        // Not logged in or invalid token
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setAuthLoading(true);
    try {
      const res = await authApi.login(loginUsername, loginPassword);
      if (res.user) {
        setUser(res.user);
      }
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // ignore
    }
    setUser(null);
    setModules([]);
    setFullContent(null);
    setSelectedModuleId(null);
    setActionMessage(null);
  };

  // ─── Fetch modules from API ──────────────────────────────────────────────
  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getModules();
      setModules(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch modules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "ADMIN" || user?.role === "MODERATOR") {
      fetchModules();
    }
  }, [user, fetchModules]);

  // ─── Fetch full content when selecting a module ──────────────────────────
  useEffect(() => {
    if (selectedModuleId === null) {
      setFullContent(null);
      return;
    }
    let cancelled = false;
    const loadFull = async () => {
      setLoadingFull(true);
      setActionMessage(null);
      try {
        const res = await adminApi.getModuleFullContent(selectedModuleId);
        if (!cancelled) setFullContent(res.data);
      } catch (err: any) {
        if (!cancelled) setActionMessage({ type: "error", text: `Load content failed: ${err.message}` });
      } finally {
        if (!cancelled) setLoadingFull(false);
      }
    };
    loadFull();
    return () => { cancelled = true; };
  }, [selectedModuleId]);

  // ─── Update module status ────────────────────────────────────────────────
  const updateStatus = async (newStatus: ContentStatus) => {
    if (!selectedModuleId || !fullContent || fullContent.id !== selectedModuleId) return;

    // Enforce Publish Guard at logic level (not just UI)
    if (newStatus === "PUBLISHED" && !isValidToPublish) {
      setActionMessage({ type: "error", text: "Publish Guard chưa pass. Không thể publish module này." });
      return;
    }

    setActionLoading(true);
    setActionMessage(null);
    try {
      const updateData = { contentStatus: newStatus, version: fullContent.version };
      await adminApi.updateModule(selectedModuleId, updateData);
      setActionMessage({ type: "success", text: `Status updated to ${newStatus}` });
      // Refresh data
      await fetchModules();
      const res = await adminApi.getModuleFullContent(selectedModuleId);
      setFullContent(res.data);
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Update failed" });
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Derived data ────────────────────────────────────────────────────────
  const filteredModules = modules.filter(
    (m) => filterStatus === "ALL" || m.contentStatus === filterStatus
  );

  const selectedModuleBasic = modules.find((m) => m.id === selectedModuleId);

  // Publish Guard checks
  const publishGuard = fullContent ? {
    sectionsOk: (fullContent.sections?.filter(s => s.status === "PUBLISHED").length || 0) >= 10,
    vocabOk: (fullContent.vocabulary?.length || 0) >= 45,
    kanjiOk: (fullContent.kanji?.length || 0) >= 8,
    grammarOk: (fullContent.grammarPatterns?.length || 0) >= 5,
    quizOk: (fullContent.quizQuestions?.length || 0) >= 15,
    audioOk: !(fullContent.sections || []).some((s: SectionData) =>
      s.status === "PUBLISHED" && s.listeningContent?.some((l: any) => l.status === "PUBLISHED" && !listeningReady(l.audioUrl, l.transcript))
    ),
  } : null;

  const isValidToPublish = publishGuard
    ? publishGuard.sectionsOk && publishGuard.vocabOk && publishGuard.kanjiOk
      && publishGuard.grammarOk && publishGuard.quizOk && publishGuard.audioOk
    : false;

  const canPublish = isValidToPublish;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 size={32} className="animate-spin mr-3" />
        <p className="text-lg">Checking authentication...</p>
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
    return (
      <AdminAuthForm 
        user={user} 
        onLoginSuccess={setUser} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-serif">Admin Content Dashboard</h1>
            <p className="text-muted-foreground text-sm">Quản lý vòng đời module: DRAFT → IN_REVIEW → PUBLISHED / ARCHIVED</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Hello, {user.displayName || user.username} ({user.role})</span>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm flex items-center gap-2">
          <AlertTriangle size={18} /> {error}
          <button onClick={fetchModules} className="ml-auto underline">Retry</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <AdminModuleList
          loading={loading}
          modules={modules}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filteredModules={filteredModules}
          selectedModuleId={selectedModuleId}
          setSelectedModuleId={setSelectedModuleId}
          fetchModules={fetchModules}
        />

        {/* ─── Right Column: Module Detail ────────────────────────────────── */}
        <div className="w-full md:w-2/3">
          {selectedModuleId && selectedModuleBasic ? (
            loadingFull ? (
              <div className="flex items-center justify-center border border-border rounded-xl p-12 text-muted-foreground">
                <Loader2 size={24} className="animate-spin mr-2" /> Loading full content...
              </div>
            ) : fullContent ? (
              <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-5">
                {/* Header */}
                <div>
                  <h2 className="text-xl font-bold">
                    {fullContent.level.level}-{String(fullContent.unitNumber).padStart(2, "0")}: {fullContent.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{fullContent.titleJp}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_META[fullContent.contentStatus].bg} ${STATUS_META[fullContent.contentStatus].text}`}>
                      {fullContent.contentStatus}
                    </span>
                    <span className="text-xs text-muted-foreground">v{fullContent.version}</span>
                    {fullContent.publishedAt && (
                      <span className="text-xs text-muted-foreground">• Published: {new Date(fullContent.publishedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    {STATUS_META[fullContent.contentStatus].description}
                  </p>
                </div>

                {/* Validator / Publish Guard */}
                {publishGuard && (
                  <div className="bg-muted/30 border border-border rounded-lg p-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-sm">
                      <AlertCircle size={16} /> Validator Report (Publish Guard)
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        { ok: publishGuard.sectionsOk, label: `Sections: ${fullContent.sections?.length || 0}/10` },
                        { ok: publishGuard.vocabOk, label: `Vocabulary: ${fullContent.vocabulary?.length || 0}/45+` },
                        { ok: publishGuard.kanjiOk, label: `Kanji: ${fullContent.kanji?.length || 0}/8` },
                        { ok: publishGuard.grammarOk, label: `Grammar: ${fullContent.grammarPatterns?.length || 0}/5` },
                        { ok: publishGuard.quizOk, label: `Quiz: ${fullContent.quizQuestions?.length || 0}/15` },
                        { ok: publishGuard.audioOk, label: `Audio: ${publishGuard.audioOk ? "Ready" : "PENDING"}` },
                      ].map((check, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {check.ok ? (
                            <CheckCircle size={14} className="text-green-500 shrink-0" />
                          ) : (
                            <AlertTriangle size={14} className="text-red-500 shrink-0" />
                          )}
                          <span className={check.ok ? "text-foreground" : "text-red-600"}>{check.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sections Preview */}
                <div>
                  <h3 className="font-bold mb-2 flex items-center gap-2 text-sm">
                    <FileText size={16} /> Sections ({fullContent.sections?.length || 0})
                  </h3>
                  <div className="border border-border rounded-lg overflow-hidden divide-y divide-border max-h-[500px] overflow-y-auto">
                    {(fullContent.sections || []).map((sec: SectionData) => {
                      // Map section type to module-level data for VOCABULARY, KANJI, GRAMMAR
                      const moduleData = getModuleLevelData(sec.sectionType, fullContent);
                      const hasNestedContent = sec.conversations.length > 0 || sec.listeningContent.length > 0
                        || sec.readingPassages.length > 0 || sec.writingTasks.length > 0 || sec.exercises.length > 0;
                      const hasModuleData = moduleData !== null;

                      return (
                        <details key={sec.id} className="group">
                          <summary className="flex items-center justify-between p-3 cursor-pointer bg-muted/20 hover:bg-muted/40 text-sm">
                            <span className="flex items-center gap-2 font-medium">
                              <span className="text-xs text-muted-foreground w-6">#{sec.sortOrder}</span>
                              {sec.sectionType}
                              <span className={`text-xs px-1.5 py-0.5 rounded ${STATUS_META[sec.status]?.bg || "bg-gray-100"} ${STATUS_META[sec.status]?.text || "text-gray-600"}`}>
                                {sec.status}
                              </span>
                              {hasModuleData && (
                                <span className="text-xs text-accent font-normal">({moduleData.count} items)</span>
                              )}
                            </span>
                            <ChevronRight size={14} className="transition-transform group-open:rotate-90 text-muted-foreground" />
                          </summary>
                          <div className="p-3 text-xs bg-background border-t border-border space-y-2">
                            {/* Module-level data: VOCABULARY */}
                            {sec.sectionType === "VOCABULARY" && fullContent.vocabulary?.length > 0 && (
                              <div>
                                <p className="font-semibold mb-1">📚 Vocabulary ({fullContent.vocabulary.length} từ)</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-[400px] overflow-y-auto pr-1">
                                  {fullContent.vocabulary.map((v: any, i: number) => (
                                    <div key={i} className="flex items-center gap-1 py-0.5 px-1 rounded bg-muted/30">
                                      <span className="font-medium">{v.japanese}</span>
                                      <span className="text-muted-foreground">({v.hiragana})</span>
                                      <span className="text-muted-foreground ml-auto truncate" title={v.english}>{v.english}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Module-level data: KANJI */}
                            {sec.sectionType === "KANJI" && fullContent.kanji?.length > 0 && (
                              <div>
                                <p className="font-semibold mb-1">🈲 Kanji ({fullContent.kanji.length} chữ)</p>
                                <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto pr-1">
                                  {fullContent.kanji.map((k: any, i: number) => (
                                    <div key={i} className="flex items-center gap-1 py-1 px-2 rounded bg-muted/30 border border-border">
                                      <span className="text-lg font-bold">{k.character}</span>
                                      <span className="text-muted-foreground text-[10px]">{k.meaning}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Module-level data: GRAMMAR */}
                            {sec.sectionType === "GRAMMAR" && fullContent.grammarPatterns?.length > 0 && (
                              <div>
                                <p className="font-semibold mb-1">📐 Grammar ({fullContent.grammarPatterns.length} mẫu)</p>
                                <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
                                  {fullContent.grammarPatterns.map((g: any, i: number) => (
                                    <div key={i} className="py-1 px-2 rounded bg-muted/30">
                                      <p className="font-medium">{g.pattern} <span className="text-muted-foreground ml-2 font-normal">{g.meaningVi || g.meaningEn || ""}</span></p>
                                      {g.examples?.length > 0 && (
                                        <div className="ml-2 mt-1 space-y-1 border-l-2 border-border pl-2">
                                          {g.examples.map((ex: any, ei: number) => (
                                            <div key={ei}>
                                              <p className="text-foreground">{ex.japanese}</p>
                                              <p className="text-muted-foreground">{ex.translation}</p>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Module-level data: SUMMARY (Quiz overview) */}
                            {sec.sectionType === "SUMMARY" && (
                              <div>
                                <p className="font-semibold mb-1">📊 Module Quiz: {fullContent.quizQuestions?.length || 0} câu hỏi</p>
                                {fullContent.quizQuestions?.length > 0 && (
                                  <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
                                    {fullContent.quizQuestions.map((q: any, i: number) => (
                                      <div key={i} className="py-1 px-2 rounded bg-muted/30">
                                        <p className="font-medium mb-1"><span className="text-muted-foreground mr-1">Q{i + 1}:</span> {q.question}</p>
                                        <div className="ml-5 grid grid-cols-1 sm:grid-cols-2 gap-1 text-muted-foreground">
                                          {(q.options as string[]).map((opt, oi) => (
                                            <div key={oi} className="flex items-start gap-1">
                                              <span className="w-4 inline-block text-right">{String.fromCharCode(65 + oi)}.</span> 
                                              <span>{opt}</span>
                                            </div>
                                          ))}
                                        </div>
                                        {q.explanation && (
                                          <p className="ml-5 mt-1 text-green-700 italic border-l-2 border-green-200 pl-2">Giải thích: {q.explanation}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Section-level nested: Conversations */}
                            {sec.conversations.length > 0 && (
                              <div>
                                <p className="font-semibold mb-1">🗣️ Conversations ({sec.conversations.length})</p>
                                {sec.conversations.map((conv: any, ci: number) => (
                                  <div key={ci} className="ml-2 mb-2 p-2 rounded bg-muted/10 border border-border">
                                    <p className="font-medium mb-1">{conv.title || `Conversation ${ci + 1}`}</p>
                                    <div className="ml-2 space-y-1 max-h-[300px] overflow-y-auto pr-1">
                                      {(conv.lines || []).map((line: any, li: number) => (
                                        <div key={li} className="text-muted-foreground">
                                          <p><span className="font-medium text-foreground">{line.speaker}:</span> {line.japanese}</p>
                                          <p className="text-muted-foreground text-[11px] ml-4">{line.romaji} — {line.translation}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Section-level nested: Listening */}
                            {sec.listeningContent.length > 0 && (
                              <div>
                                <p className="font-semibold mb-1">🎧 Listening ({sec.listeningContent.length})</p>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                                  {sec.listeningContent.map((l: any, i: number) => (
                                    <div key={i} className="ml-2 py-1 px-2 rounded bg-muted/30">
                                      <p className="font-medium">{l.title}</p>
                                      <p className="text-muted-foreground">Duration: {l.durationSeconds}s | Speed: {l.playbackSpeed}x</p>
                                      <p className={`${(l.audioUrl || "").startsWith("PENDING") ? "text-red-500 font-medium" : "text-green-600"}`}>
                                        Audio: {isTtsListening(l.audioUrl) ? "TTS (beta) — giọng đọc thiết bị" : listeningReady(l.audioUrl, l.transcript) ? "✓ Ready" : "Chưa sẵn sàng"}
                                      </p>
                                      {l.transcriptJp && (
                                        <div className="mt-1 border-t border-border pt-1">
                                          <p className="text-foreground">{l.transcriptJp}</p>
                                          <p className="text-muted-foreground">{l.transcriptVi || l.transcriptEn}</p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section-level nested: Reading */}
                            {sec.readingPassages.length > 0 && (
                              <div>
                                <p className="font-semibold mb-1">📖 Reading ({sec.readingPassages.length})</p>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                                  {sec.readingPassages.map((r: any, i: number) => (
                                    <div key={i} className="ml-2 py-1 px-2 rounded bg-muted/30">
                                      <p className="font-medium mb-1">{r.title}</p>
                                      <div className="bg-background p-2 rounded border border-border whitespace-pre-wrap font-serif text-sm">
                                        {r.passage}
                                      </div>
                                      {r.exercises?.length > 0 && (
                                        <div className="mt-2 ml-2">
                                          <p className="font-medium text-muted-foreground">{r.exercises.length} câu hỏi đọc hiểu:</p>
                                          <ul className="list-disc list-inside text-muted-foreground">
                                            {r.exercises.map((e: any, ei: number) => (
                                              <li key={ei}>{e.question}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section-level nested: Writing */}
                            {sec.writingTasks.length > 0 && (
                              <div>
                                <p className="font-semibold mb-1">✍️ Writing ({sec.writingTasks.length})</p>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                                  {sec.writingTasks.map((w: any, i: number) => (
                                    <div key={i} className="ml-2 py-1 px-2 rounded bg-muted/30">
                                      <p className="font-medium">{w.prompt}</p>
                                      <p className="text-muted-foreground">Độ dài: {w.minLength}-{w.maxLength} {w.unit}</p>
                                      {w.sampleAnswer && (
                                        <p className="mt-1 text-muted-foreground italic border-l-2 border-border pl-2">Mẫu: {w.sampleAnswer}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section-level nested: Exercises */}
                            {sec.exercises.length > 0 && (
                              <div>
                                <p className="font-semibold mb-1">📝 Exercises ({sec.exercises.length})</p>
                                <div className="max-h-[400px] overflow-y-auto pr-1 space-y-1 ml-2">
                                  {sec.exercises.map((e: any, i: number) => (
                                    <div key={i} className="py-1 px-2 rounded bg-muted/30 text-muted-foreground">
                                      <span className="font-medium text-foreground mr-1">[{e.exerciseType}]</span>
                                      {e.question}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Overview section */}
                            {sec.sectionType === "OVERVIEW" && (
                              <p className="text-muted-foreground">📋 Mục tiêu bài học, cách học, tự kiểm tra đầu vào.</p>
                            )}

                            {/* Fallback: truly empty */}
                            {!hasNestedContent && !hasModuleData && sec.sectionType !== "OVERVIEW" && sec.sectionType !== "SUMMARY" && (
                              <p className="text-muted-foreground italic">Không có dữ liệu cho section này.</p>
                            )}

                            {sec.reviewNotes && <p className="text-yellow-600 mt-1 border-t border-border pt-1">📋 Notes: {sec.reviewNotes}</p>}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>

                {/* Action Messages */}
                {actionMessage && (
                  <div className={`text-sm rounded-lg px-4 py-2 ${actionMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {actionMessage.text}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                  <button
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
                    onClick={() => updateStatus("DRAFT")}
                    disabled={actionLoading || fullContent.contentStatus === "DRAFT"}
                  >
                    Set DRAFT
                  </button>

                  <button
                    className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
                    onClick={() => updateStatus("IN_REVIEW")}
                    disabled={actionLoading || fullContent.contentStatus === "IN_REVIEW"}
                  >
                    Submit IN_REVIEW
                  </button>

                  <button
                    className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => updateStatus("PUBLISHED")}
                    disabled={actionLoading || fullContent.contentStatus === "PUBLISHED" || !canPublish}
                    title={!canPublish ? "Publish Guard: chưa đủ điều kiện" : "Publish module cho người học"}
                  >
                    {actionLoading ? <Loader2 size={14} className="animate-spin inline mr-1" /> : null}
                    PUBLISH
                  </button>

                  <button
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ml-auto"
                    onClick={() => updateStatus("ARCHIVED")}
                    disabled={actionLoading || fullContent.contentStatus === "ARCHIVED"}
                  >
                    <Archive size={14} className="inline mr-1" /> ARCHIVE
                  </button>
                </div>

                {!isValidToPublish && fullContent.contentStatus !== "PUBLISHED" && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-xs text-red-500">
                      * PUBLISH bị khoá vì Publish Guard chưa pass. Kiểm tra lại Validator Report.
                    </p>
                  </div>
                )}
              </div>
            ) : null
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl p-12 text-muted-foreground text-center bg-card min-h-[300px]">
              <div>
                <Database size={32} className="mx-auto mb-3 opacity-50" />
                <p>Chọn một module từ danh sách bên trái để xem chi tiết và quản lý trạng thái.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
