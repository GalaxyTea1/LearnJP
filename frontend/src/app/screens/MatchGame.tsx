import { Trophy, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { hiragana } from "../data/basicData";
import { shuffle } from "../utils/helpers";
import { progressApi } from "../services/api";

type MatchCard = { id: number; val: string; type: "char" | "rom"; pairId: number };

function createFallbackCards(): MatchCard[] {
    const pairs = shuffle(hiragana.filter(h => h.rom !== "")).slice(0, 6);
    return shuffle([
        ...pairs.map((p, i) => ({ id: i * 2, val: p.char, type: "char" as const, pairId: i })),
        ...pairs.map((p, i) => ({ id: i * 2 + 1, val: p.rom, type: "rom" as const, pairId: i })),
    ]);
}

export default function MatchGame() {
    const [cards, setCards] = useState<MatchCard[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(true);

    const initGame = async () => {
        setLoading(true);
        try {
            const res = await progressApi.getReviewItems(6);
            if (res.success && res.data.vocab?.length >= 6) {
                const pairs = res.data.vocab.slice(0, 6);
                setCards(shuffle([
                    ...pairs.map((p: any, i: number) => ({ id: i * 2, val: p.word, type: "char" as const, pairId: i })),
                    ...pairs.map((p: any, i: number) => ({ id: i * 2 + 1, val: p.reading || p.translation, type: "rom" as const, pairId: i })),
                ]));
            } else {
                setCards(createFallbackCards());
            }
        } catch {
            setCards(createFallbackCards());
        } finally {
            setLoading(false);
        }
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setDone(false);
    };

    useEffect(() => { initGame(); }, []);

    const flip = (id: number) => {
        if (flipped.length === 2 || matched.includes(id) || flipped.includes(id)) return;
        const next = [...flipped, id];
        setFlipped(next);
        if (next.length === 2) {
            setMoves(m => m + 1);
            const [a, b] = next.map(i => cards.find(c => c.id === i)!);
            if (a.pairId === b.pairId) {
                const nm = [...matched, a.id, b.id];
                setMatched(nm);
                setFlipped([]);
                if (nm.length === cards.length) setDone(true);
            } else setTimeout(() => setFlipped([]), 900);
        }
    };

    const restart = () => {
        initGame();
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" /></div>;

    if (done) return (
        <div className="flex flex-col items-center py-12 text-center">
            <Trophy size={36} className="text-accent mb-4" />
            <h3 className="text-2xl font-medium mb-1" style={{ fontFamily: "'Noto Serif JP', serif" }}>完成！</h3>
            <p className="text-muted-foreground mb-6">Completed in <span className="text-foreground font-medium">{moves}</span> moves</p>
            <button onClick={restart} className="bg-primary text-primary-foreground px-6 py-2.5 text-sm hover:bg-accent transition-colors">Play Again</button>
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex gap-6 text-sm text-muted-foreground">
                <span>Moves <span className="text-foreground font-medium">{moves}</span></span>
                <span>Matched <span className="text-foreground font-medium">{matched.length / 2}</span>/6</span>
            </div>
            <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
                {cards.map(card => {
                    const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
                    const isMatched = matched.includes(card.id);
                    return (
                        <button key={card.id} onClick={() => flip(card.id)}
                            className={`h-16 border transition-all duration-150 flex items-center justify-center text-center ${isMatched ? "bg-green-600/10 border-green-600/40 text-green-700" : isFlipped ? "bg-card border-accent text-foreground" : "bg-primary/5 border-border hover:border-accent/50 cursor-pointer"}`}>
                            {isFlipped ? (
                                <span className={card.type === "char" ? "text-xl" : "text-sm"} style={{ fontFamily: card.type === "char" ? "'Noto Serif JP', serif" : "'DM Mono', monospace" }}>{card.val}</span>
                            ) : <span className="text-2xl text-foreground/10" style={{ fontFamily: "'Noto Serif JP', serif" }}>?</span>}
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-muted-foreground">Match each hiragana character to its romaji reading.</p>
        </div>
    );
}
