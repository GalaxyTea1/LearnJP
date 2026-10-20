import { RotateCcw, Trophy, Info, Volume2, X, Check } from "lucide-react";
import { useState } from "react";
import useWordModal from "../components/ui/useWordModal";
import WordModal from "../components/ui/WordModal";
import { localDictionary } from "../utils/localDictionary";
import { speak } from "../utils/helpers";

export default function FlashcardsPage() {
    const { word, openVocab, close } = useWordModal();
    const [cardIndex, setCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [knownCards, setKnownCards] = useState<number[]>([]);

    const vocab = localDictionary.filter(d => d.type !== "phrase").slice(0, 20);
    const currentCard = vocab[cardIndex];

    const nextCard = (known: boolean) => {
        if (known) setKnownCards(prev => prev.includes(cardIndex) ? prev : [...prev, cardIndex]);
        setFlipped(false);
        setTimeout(() => setCardIndex(i => (i + 1) % vocab.length), 100);
    };

    const reset = () => { setCardIndex(0); setFlipped(false); setKnownCards([]); };

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            {word && <WordModal word={word} onClose={close} />}
            <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-accent font-medium mb-2">Flashcards</p>
                <h2 className="text-4xl text-foreground mb-2" style={{ fontFamily: "'Noto Serif JP', serif", fontWeight: 300 }}>Vocabulary Practice</h2>
                <p className="text-muted-foreground text-sm">Flip cards to reveal meaning. Click the info button for full word details.</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-600" />{knownCards.length} known</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-foreground" />{Math.max(0, vocab.length - knownCards.length)} remaining</span>
                <button onClick={reset} className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors"><RotateCcw size={12} /> Reset</button>
            </div>
            <div className="h-1 bg-muted mb-8 overflow-hidden">
                <div className="h-full bg-accent transition-all duration-300" style={{ width: `${(knownCards.length / vocab.length) * 100}%` }} />
            </div>
            <div className="flex flex-col items-center gap-6">
                {knownCards.length >= vocab.length ? (
                    <div className="w-full h-60 bg-card border border-border flex flex-col items-center justify-center text-center px-8">
                        <Trophy size={48} className="text-accent mb-4" />
                        <h3 className="text-2xl text-foreground font-medium mb-2">Great job!</h3>
                        <p className="text-muted-foreground text-sm mb-4">You've reviewed all {vocab.length} cards.</p>
                        <button onClick={reset} className="bg-primary text-primary-foreground px-6 py-2 hover:bg-accent transition-colors text-sm">Practice Again</button>
                    </div>
                ) : (
                    <>
                        <div className="w-full h-60 bg-card border border-border cursor-pointer flex flex-col items-center justify-center text-center px-8 transition-all duration-150 hover:border-foreground/20 select-none relative"
                            role="button"
                            tabIndex={0}
                            aria-label="Flip flashcard"
                            onClick={() => setFlipped(!flipped)}
                            onKeyDown={e => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setFlipped(value => !value);
                                }
                            }}>
                            <button onClick={e => { e.stopPropagation(); openVocab(currentCard); }}
                                className="absolute top-3 right-3 text-muted-foreground/40 hover:text-accent transition-colors p-1">
                                <Info size={15} />
                            </button>
                            {!flipped ? (
                                <>
                                    <p className="text-5xl text-foreground mb-3" style={{ fontFamily: "'Noto Serif JP', serif" }}>{currentCard.jp}</p>
                                    <p className="text-base text-muted-foreground mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>{currentCard.rom}</p>
                                    <button onClick={e => { e.stopPropagation(); speak(currentCard.jp); }} className="text-muted-foreground hover:text-accent transition-colors"><Volume2 size={16} /></button>
                                    <p className="text-xs text-muted-foreground/40 mt-3">tap to reveal</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-3xl font-medium text-foreground mb-2">{currentCard.en}</p>
                                    <p className="text-base text-muted-foreground" style={{ fontFamily: "'Noto Serif JP', serif" }}>{currentCard.jp}</p>
                                    <span className="mt-3 text-xs bg-secondary text-muted-foreground px-2 py-0.5 capitalize">{currentCard.type}</span>
                                </>
                            )}
                        </div>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => nextCard(false)} className="flex-1 flex items-center justify-center gap-2 border border-border py-3 text-sm text-muted-foreground hover:border-destructive/40 hover:text-destructive transition-colors">
                                <X size={14} /> Missed it
                            </button>
                            <button onClick={() => nextCard(true)} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 text-sm hover:bg-accent transition-colors">
                                <Check size={14} /> Got it
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{cardIndex + 1} / {vocab.length}</p>
                    </>
                )}
            </div>
        </div>
    );
}
