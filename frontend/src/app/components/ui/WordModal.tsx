import { X, Volume2 } from "lucide-react";
import { useEffect } from "react";
import { WordDetail } from "../../utils/localDictionary";
import StrokeAnimation from "./StrokeAnimation";
import WritingGrid from "./WritingGrid";
import kanaData from "../../utils/kanaData.json";
import { speak } from "../../utils/helpers";

export default function WordModal({ word, onClose }: { word: WordDetail; onClose: () => void }) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const typeLabel: Record<WordDetail["type"], string> = {
        hiragana: "Hiragana", katakana: "Katakana", kanji: "Kanji", vocab: "Vocabulary",
    };

    const typeBadgeColor: Record<WordDetail["type"], string> = {
        hiragana: "#2E6B8A", katakana: "#7B5EA7", kanji: "#B5650A", vocab: "#4A7C59",
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose} role="presentation">
            {/* backdrop */}
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />

            <div
                className="relative bg-card border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={`${word.char} details`}
                style={{ scrollbarWidth: "none" }}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-0.5 font-medium text-white"
                            style={{ background: typeBadgeColor[word.type] }}>
                            {typeLabel[word.type]}
                        </span>
                        {word.level && (
                            <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 font-medium">{word.level}</span>
                        )}
                        {(word.strokes || (kanaData as Record<string, string[]>)[word.char]?.length > 0) && (
                            <span className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                                {word.strokes || (kanaData as Record<string, string[]>)[word.char].length} strokes
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} aria-label="Close word details" className="text-muted-foreground hover:text-foreground transition-colors p-1">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 flex flex-col md:flex-row gap-8">
                    {/* Left — character display + animation */}
                    <div className="flex flex-1 min-w-0 flex-col items-center gap-6">
                        {(word.strokes || (kanaData as Record<string, string[]>)[word.char]?.length > 0) ? (
                            <StrokeAnimation char={word.char} strokes={word.strokes || 0} />
                        ) : Array.from(word.char).length > 1 ? (
                            <p className="w-full break-all text-center text-4xl leading-relaxed py-6 select-none text-foreground" style={{ fontFamily: "'Noto Serif JP', serif" }}>{word.char}</p>
                        ) : (
                            <div className="relative" style={{ width: 200, height: 200 }}>
                                <WritingGrid size={200} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-8xl select-none text-foreground" style={{ fontFamily: "'Noto Serif JP', serif" }}>{word.char}</span>
                                </div>
                            </div>
                        )}
                        {/* Audio */}
                        <button
                            onClick={() => speak(word.char)}
                            className="flex items-center gap-2 border border-border px-4 py-2 text-sm text-muted-foreground hover:border-accent/50 hover:text-accent transition-colors w-full justify-center"
                        >
                            <Volume2 size={14} /> Hear pronunciation
                        </button>

                        {/* Practice area */}
                        <div className="w-full">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Practice writing</p>
                            <div className="relative bg-secondary border border-border" style={{ height: 120 }}>
                                <WritingGrid size={120} />
                                <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none">
                                    <span className="max-w-full max-h-full overflow-y-auto px-3 break-all text-center text-3xl leading-relaxed text-foreground" style={{ fontFamily: "'Noto Serif JP', serif" }}>{word.char}</span>
                                </div>
                                <div className="absolute bottom-1.5 right-2 text-xs text-muted-foreground/40">trace above</div>
                            </div>
                        </div>
                    </div>

                    {/* Right — details */}
                    <div className="flex flex-1 min-w-0 flex-col gap-5 break-words">
                        {/* Main reading */}
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Reading</p>
                            <p className="text-3xl text-foreground font-light mb-0.5" style={{ fontFamily: "'Noto Serif JP', serif" }}>{word.char}</p>
                            {word.romaji && (
                                <p className="text-lg text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{word.romaji}</p>
                            )}
                        </div>

                        {/* Meaning */}
                        {word.meaning && (
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Meaning</p>
                                <p className="text-foreground font-medium text-lg">{word.meaning}</p>
                            </div>
                        )}

                        {/* On/Kun yomi for kanji */}
                        {word.onyomi && (
                            <div className="flex gap-3">
                                <div className="flex-1 min-w-0 bg-secondary p-3">
                                    <p className="text-xs text-muted-foreground mb-1">On'yomi (音読み)</p>
                                    <p className="text-foreground font-medium text-sm" style={{ fontFamily: "'Noto Serif JP', serif" }}>{word.onyomi}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Chinese reading</p>
                                </div>
                                <div className="flex-1 min-w-0 bg-secondary p-3">
                                    <p className="text-xs text-muted-foreground mb-1">Kun'yomi (訓読み)</p>
                                    <p className="text-foreground font-medium text-sm" style={{ fontFamily: "'Noto Serif JP', serif" }}>{word.kunyomi}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Japanese reading</p>
                                </div>
                            </div>
                        )}

                        {/* Mnemonic */}
                        {word.mnemonic && (
                            <div className="border-l-2 border-accent/40 pl-3">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Memory tip</p>
                                <p className="text-sm text-foreground italic">{word.mnemonic}</p>
                            </div>
                        )}

                        {/* Examples */}
                        {word.examples && word.examples.length > 0 && (
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Examples</p>
                                <div className="space-y-2">
                                    {word.examples.map((ex, i) => (
                                        <div key={i} className="flex flex-col border-b border-border pb-2 last:border-0 last:pb-0">
                                            <button
                                                onClick={() => speak(ex.jp.split(" ")[0])}
                                                className="flex items-center gap-2 group text-left"
                                            >
                                                <span className="text-foreground text-base group-hover:text-accent transition-colors" style={{ fontFamily: "'Noto Serif JP', serif" }}>{ex.jp}</span>
                                                <Volume2 size={11} className="text-muted-foreground/40 group-hover:text-accent transition-colors flex-shrink-0" />
                                            </button>
                                            <span className="text-sm text-muted-foreground">{ex.en}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related */}
                        {word.related && word.related.length > 0 && (
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Related characters</p>
                                <div className="flex gap-2 flex-wrap">
                                    {word.related.map(r => (
                                        <div key={r} className="w-10 h-10 bg-secondary border border-border flex items-center justify-center text-xl text-foreground hover:border-accent/50 transition-colors cursor-default" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                                            {r}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
