import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, Eye, EyeOff, MessageSquare, Headphones, 
  Play, Pause, Music, UserCheck, CheckCircle2 
} from "lucide-react";
import type { SectionItem, Conversation, ListeningItem } from "../types";
import { createDialoguePlayer, hasListeningAudio, isTtsListening, listeningSpeechLines } from '../dialoguePlayer';

interface DialogueStudyTabProps {
  sections: SectionItem[];
  onCompleteTab?: () => void;
  isCompleted?: boolean;
  progressReady?: boolean;
}

export function DialogueStudyTab({ sections, onCompleteTab, isCompleted, progressReady = true }: DialogueStudyTabProps) {
  // Find conversation and listening sections
  const conversations: Conversation[] = [];
  const listeningItems: ListeningItem[] = [];

  sections.forEach(s => {
    if (s.conversations && s.conversations.length > 0) {
      conversations.push(...s.conversations);
    }
    if (s.listeningContent && s.listeningContent.length > 0) {
      listeningItems.push(...s.listeningContent);
    }
  });

  const [activeConvIndex, setActiveConvIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [audioError, setAudioError] = useState('');
  const player = useRef<ReturnType<typeof createDialoguePlayer> | null>(null);
  const audioElements = useRef(new Map<number, HTMLAudioElement>());
  const audioRefs = useRef(new Map<number, (element: HTMLAudioElement | null) => void>());
  const audioRef = (id: number) => {
    if (!audioRefs.current.has(id)) audioRefs.current.set(id, element => {
      if (element) audioElements.current.set(id, element);
      else { audioElements.current.get(id)?.pause(); audioElements.current.delete(id); }
    });
    return audioRefs.current.get(id)!;
  };
  const playback = useRef(0);

  const stopPlayback = (except?: HTMLAudioElement) => {
    playback.current++;
    player.current?.stop();
    audioElements.current.forEach(audio => { if (audio !== except) audio.pause(); });
    setIsPlayingAll(false);
    setPlaying(false);
    setActiveLine(null);
  };
  useEffect(() => {
    const stopOnHide = () => { if (document.hidden) stopPlayback(); };
    document.addEventListener('visibilitychange', stopOnHide);
    window.addEventListener('pagehide', stopPlaybackOnPageHide);
    function stopPlaybackOnPageHide() { stopPlayback(); }
    const elements = audioElements.current;
    return () => {
      playback.current++;
      player.current?.stop();
      elements.forEach(audio => audio.pause());
      document.removeEventListener('visibilitychange', stopOnHide);
      window.removeEventListener('pagehide', stopPlaybackOnPageHide);
    };
  }, []);

  const playTexts = async (texts: string[], all = false, lineIndex?: number) => {
    stopPlayback();
    setAudioError('');
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setAudioError('Trình duyệt này chưa hỗ trợ giọng đọc. Bạn vẫn có thể đọc lời thoại bên dưới.');
      return;
    }
    player.current ??= createDialoguePlayer(window.speechSynthesis, text => new SpeechSynthesisUtterance(text));
    const session = playback.current;
    setPlaying(true);
    setIsPlayingAll(all);
    try {
      await player.current.play(texts, index => setActiveLine(all ? index : lineIndex ?? null));
    } catch (error) {
      if (session === playback.current) setAudioError(error instanceof Error ? error.message : 'Không phát được âm thanh.');
    } finally {
      if (session === playback.current) { setPlaying(false); setIsPlayingAll(false); setActiveLine(null); }
    }
  };

  const activeConv = conversations[activeConvIndex] || conversations[0];

  // Helper colors for different speakers
  const getSpeakerColor = (speaker: string) => {
    const colors = [
      "bg-blue-600 text-white",
      "bg-rose-600 text-white",
      "bg-amber-600 text-white",
      "bg-emerald-600 text-white",
      "bg-purple-600 text-white",
    ];
    let hash = 0;
    for (let i = 0; i < speaker.length; i++) {
      hash = speaker.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handlePlayAll = () => {
    if (!activeConv || !activeConv.lines) return;
    if (isPlayingAll) {
      stopPlayback();
      return;
    }

    void playTexts(activeConv.lines.map(line => line.japanese), true);
  };

  if (conversations.length === 0 && listeningItems.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
        <p>Chưa có dữ liệu hội thoại hay bài nghe cho module này.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {audioError && <p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{audioError}</p>}
      <p className="text-xs text-muted-foreground">Giọng đọc tự động (TTS) sử dụng giọng tiếng Nhật của thiết bị. Phát âm và ngữ điệu có thể khác bản thu người thật.</p>
      {playing && <button onClick={() => stopPlayback()} className="self-start min-h-11 px-4 border rounded-lg">Dừng giọng đọc</button>}
      {playing && !isPlayingAll && <button onClick={() => stopPlayback()} className="self-start min-h-11 rounded-lg border px-4 text-sm">Dừng giọng đọc</button>}
      {/* Dialogue Selection & Controls */}
      <div className="bg-card border border-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-accent" size={20} />
          <div>
            <h3 className="text-base font-bold text-foreground">Hội thoại thực tế (Kaiwa)</h3>
            <p className="text-xs text-muted-foreground">
              Luyện nghe, đọc theo vai và làm quen với ngữ cảnh giao tiếp tự nhiên.
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowRomaji(r => !r)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              showRomaji ? "bg-muted text-foreground border-border" : "bg-card text-muted-foreground border-border/60"
            }`}
            title="Bật / Tắt phiên âm Romaji"
          >
            {showRomaji ? <Eye size={13} /> : <EyeOff size={13} />} Romaji
          </button>

          <button
            onClick={() => setShowTranslation(t => !t)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              showTranslation ? "bg-muted text-foreground border-border" : "bg-card text-muted-foreground border-border/60"
            }`}
            title="Bật / Tắt bản dịch tiếng Việt"
          >
            {showTranslation ? <Eye size={13} /> : <EyeOff size={13} />} Dịch nghĩa
          </button>

          {activeConv && activeConv.lines && activeConv.lines.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {isPlayingAll ? <Pause size={13} /> : <Play size={13} />}
              {isPlayingAll ? "Dừng phát" : "Phát cả bài"}
            </button>
          )}
        </div>
      </div>

      {/* Switch multiple conversations if available */}
      {conversations.length > 1 && (
        <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto">
          {conversations.map((c, idx) => (
            <button
              key={c.id || idx}
              onClick={() => {
                stopPlayback();
                setAudioError('');
                setActiveConvIndex(idx);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeConvIndex === idx
                  ? "bg-foreground text-background font-semibold"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.title || `Hội thoại ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Conversation Chat Flow */}
      {activeConv && (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-4">
          {/* Scene description */}
          {activeConv.context && (
            <div className="p-3 bg-muted/30 border border-border/80 rounded-xl text-xs text-muted-foreground italic text-center">
              📍 Bối cảnh: {activeConv.context}
            </div>
          )}

          {/* Lines */}
          <div className="flex flex-col gap-4 my-2">
            {(activeConv.lines || []).map((line, lineIdx) => {
              const speaker = line.speaker || "?";
              const speakerBadge = getSpeakerColor(speaker);
              const isEven = lineIdx % 2 === 1;

              return (
                <div 
                  key={line.id || lineIdx}
                  className={`flex min-w-0 items-start gap-3 max-w-xl ${isEven ? "self-end flex-row-reverse" : "self-start"}`}
                >
                  {/* Speaker avatar */}
                  <div 
                    className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-xs ${speakerBadge}`}
                    title={speaker}
                  >
                    {speaker.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Speech Bubble */}
                  <div 
                    className={`min-w-0 break-words p-4 rounded-2xl border transition-all ${activeLine === lineIdx ? 'ring-2 ring-accent' : ''} ${
                      isEven 
                        ? "bg-accent/5 border-accent/30 rounded-tr-xs" 
                        : "bg-background border-border rounded-tl-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-xs font-bold text-foreground">
                        {speaker}
                      </span>
                      <button
                        onClick={() => void playTexts([line.japanese], false, lineIdx)}
                        className="min-h-11 min-w-11 flex items-center justify-center rounded-md text-muted-foreground hover:text-accent transition-colors"
                        title="Nghe câu này"
                        aria-label={`Nghe phát âm của ${speaker}`}
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>

                    {/* Japanese Text */}
                    <p 
                      className="text-base sm:text-lg font-medium text-foreground leading-relaxed"
                      style={{ fontFamily: "'Noto Serif JP', serif" }}
                    >
                      {line.japanese}
                    </p>

                    {/* Romaji */}
                    {showRomaji && line.romaji && (
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        {line.romaji}
                      </p>
                    )}

                    {/* English / Vietnamese Translation */}
                    {showTranslation && line.translation && (
                      <p className="text-xs text-foreground/80 mt-1.5 pt-1.5 border-t border-border/50">
                        {line.translation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Listening Section (nếu có audio hoặc bài tập nghe) */}
      {listeningItems.length > 0 && (
        <div className="mt-4 bg-card border border-border rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Headphones className="text-accent" size={20} />
            <div>
              <h3 className="text-base font-bold text-foreground">Bài luyện nghe hiểu (Listening)</h3>
              <p className="text-xs text-muted-foreground">Nghe kỹ audio và nắm bắt thông tin quan trọng.</p>
            </div>
          </div>

          <div className="space-y-4">
            {listeningItems.map((item, idx) => (
              <div key={item.id || idx} className="p-4 bg-background border border-border rounded-xl">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {item.title || `Bài nghe ${idx + 1}`}
                </h4>

                {/* Audio player / placeholder */}
                <div className="p-3 bg-muted/40 rounded-lg flex flex-col items-start gap-3 text-xs mb-3">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Music size={15} className="text-accent" />
                    {hasListeningAudio(item.audioUrl)
                      ? "File Audio bài học sẵn sàng"
                      : isTtsListening(item.audioUrl) ? "Bản beta · Giọng đọc tự động (TTS), chưa có bản thu người thật."
                      : "Chưa có bản thu âm. Có thể nghe giọng đọc tự động nếu bài có lời thoại."}
                  </span>
                  {hasListeningAudio(item.audioUrl) && <audio
                    ref={audioRef(item.id)}
                    controls preload="none" src={item.audioUrl!.trim()} className="w-full min-w-0"
                    aria-label={`Bản thu âm: ${item.title}`}
                    onPlay={event => { stopPlayback(event.currentTarget); setAudioError(''); }}
                    onError={() => setAudioError(`Không tải được bản thu âm “${item.title}”. Hãy thử lại hoặc nghe giọng đọc tự động bên dưới.`)}
                  />}
                  {item.transcript && <button
                    onClick={() => {
                      void playTexts(listeningSpeechLines(item.transcript!));
                    }}
                    className="min-h-11 px-3 py-1.5 rounded bg-accent text-accent-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-accent/90 transition-colors"
                  >
                    <Volume2 size={13} /> Nghe giọng đọc tự động (TTS)
                  </button>}
                  {playing && <button onClick={() => stopPlayback()} className="min-h-11 px-3 border rounded">Dừng giọng đọc</button>}
                  {audioError && <p className="text-amber-800">{audioError}</p>}
                </div>

                {/* Transcript & translation */}
                {item.transcript && (
                  <div className="p-3 bg-card border border-border rounded-lg text-xs space-y-1">
                    <p className="font-semibold text-muted-foreground text-[11px] uppercase">Lời thoại (Transcript):</p>
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                      {item.transcript}
                    </p>
                    {item.transcriptTranslation && (
                      <p className="text-muted-foreground mt-1 italic">
                        {item.transcriptTranslation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
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
