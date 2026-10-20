import { useState } from "react";
import useWordModal from "../components/ui/useWordModal";
import WordModal from "../components/ui/WordModal";
import { hiragana, katakana, kanjiList } from "../data/basicData";

export default function WritingPage() {
    const { word, openHiragana, openKatakana, openKanji, close } = useWordModal();
    const [activeTab, setActiveTab] = useState<"hiragana" | "katakana" | "kanji">("hiragana");

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            {word && <WordModal word={word} onClose={close} />}
            <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-accent font-medium mb-2">Writing Systems</p>
            </div>
            <div className="flex gap-0 mb-8 border border-border w-fit">
                {/* {(["hiragana", "katakana", "kanji"] as const).map(tab => ( */}
                {(["hiragana", "katakana"] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 text-sm font-medium transition-colors duration-200 ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {activeTab === "hiragana" && (
                <div>
                    <p className="text-sm text-muted-foreground mb-6">Hiragana (ひらがな) — 46 phonetic characters. Click any to see stroke order and details.</p>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                        {hiragana.map((h, i) => (
                            <button key={i} onClick={() => h.rom && openHiragana(h.char, h.rom)}
                                className={`bg-card border border-border flex flex-col items-center justify-center py-3 transition-all duration-150 ${h.rom === "" ? "opacity-0 pointer-events-none" : "hover:border-accent hover:bg-accent/5 cursor-pointer group"}`}>
                                <span className="text-xl text-foreground leading-none mb-1 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Noto Serif JP', serif" }}>{h.char}</span>
                                <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{h.rom}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "katakana" && (
                <div>
                    <p className="text-sm text-muted-foreground mb-6">Katakana (カタカナ) — 46 characters for loanwords. Click any to explore.</p>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                        {katakana.map((k, i) => (
                            <button key={i} onClick={() => k.rom && openKatakana(k.char, k.rom)}
                                className={`bg-card border border-border flex flex-col items-center justify-center py-3 transition-all duration-150 ${k.rom === "" ? "opacity-0 pointer-events-none" : "hover:border-accent hover:bg-accent/5 cursor-pointer group"}`}>
                                <span className="text-xl text-foreground leading-none mb-1 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Noto Serif JP', serif" }}>{k.char}</span>
                                <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{k.rom}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* {activeTab === "kanji" && (
                <div>
                    <p className="text-sm text-muted-foreground mb-6">Kanji (漢字) — logographic characters. Click any for on/kun readings, strokes, and examples.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                        {kanjiList.map((k, i) => (
                            <button key={i} onClick={() => openKanji(k.char)}
                                className="bg-card border border-border p-4 hover:border-accent/50 transition-colors duration-150 cursor-pointer group text-left">
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-4xl text-foreground group-hover:scale-110 inline-block transition-transform origin-left" style={{ fontFamily: "'Noto Serif JP', serif" }}>{k.char}</span>
                                    <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 font-medium">{k.level}</span>
                                </div>
                                <p className="text-xs font-medium text-foreground mb-0.5">{k.meaning}</p>
                                <p className="text-[11px] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{k.reading}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )} */}
        </div>
    );
}
