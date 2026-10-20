import { Trophy, Zap } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import useWordModal from "../components/ui/useWordModal";
import WordModal from "../components/ui/WordModal";
import { hiragana } from "../data/basicData";
import { shuffle } from "../utils/helpers";

export default function QuizGame() {
    const { word, openHiragana, close } = useWordModal();
    const pool = hiragana.filter(h => h.rom !== "");
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [total, setTotal] = useState(0);
    const [q, setQ] = useState(() => pool[Math.floor(Math.random() * pool.length)]);
    const [options, setOptions] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [finished, setFinished] = useState(false);

    const generate = useCallback((question: typeof pool[0]) => {
        const wrong = shuffle(pool.filter(h => h.rom !== question.rom)).slice(0, 3).map(h => h.rom);
        setOptions(shuffle([question.rom, ...wrong]));
        setSelected(null);
    }, []);

    useEffect(() => { generate(q); }, [q]);

    const answer = (opt: string) => {
        if (selected) return;
        setSelected(opt);
        const correct = opt === q.rom;
        setTotal(t => t + 1);
        if (correct) { setScore(s => s + 1); setStreak(s => s + 1); }
        else setStreak(0);
        setTimeout(() => {
            if (total + 1 >= 10) { setFinished(true); return; }
            const next = pool[Math.floor(Math.random() * pool.length)];
            setQ(next);
        }, 900);
    };

    const restart = () => { setScore(0); setStreak(0); setTotal(0); setFinished(false); const next = pool[Math.floor(Math.random() * pool.length)]; setQ(next); generate(next); };

    if (finished) return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <Trophy size={40} className="text-accent mb-4" />
            <h3 className="text-3xl font-medium mb-2" style={{ fontFamily: "'Noto Serif JP', serif" }}>結果</h3>
            <p className="text-muted-foreground mb-1">Your score</p>
            <p className="text-6xl font-medium text-foreground mb-1">{score}<span className="text-2xl text-muted-foreground">/10</span></p>
            <p className="text-sm text-muted-foreground mb-8">{score >= 8 ? "Excellent! 素晴らしい！" : score >= 5 ? "Good effort! 頑張った！" : "Keep practicing! もっと練習！"}</p>
            <button onClick={restart} className="bg-primary text-primary-foreground px-6 py-2.5 text-sm hover:bg-accent transition-colors">Play Again</button>
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-8">
            {word && <WordModal word={word} onClose={close} />}
            <div className="flex gap-6 text-sm text-muted-foreground w-full justify-center">
                <span>Question <span className="text-foreground font-medium">{Math.min(total + 1, 10)}</span>/10</span>
                <span>Score <span className="text-foreground font-medium">{score}</span></span>
                {streak >= 2 && <span className="text-accent flex items-center gap-1"><Zap size={12} />{streak} streak</span>}
            </div>
            <div className="relative group">
                <div className="w-48 h-48 bg-card border-2 border-border flex items-center justify-center cursor-pointer hover:border-accent/40 transition-colors"
                    onClick={() => openHiragana(q.char, q.rom)}>
                    <span className="text-8xl text-foreground" style={{ fontFamily: "'Noto Serif JP', serif" }}>{q.char}</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    click for details
                </div>
            </div>
            <p className="text-sm text-muted-foreground">What is the romaji for this character?</p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {options.map(opt => {
                    const isCorrect = opt === q.rom;
                    const isSelected = selected === opt;
                    let cls = "py-3 text-base border transition-colors font-medium ";
                    if (!selected) cls += "border-border bg-card hover:border-accent hover:text-accent cursor-pointer";
                    else if (isCorrect) cls += "border-green-600 bg-green-600/10 text-green-700";
                    else if (isSelected) cls += "border-destructive bg-destructive/10 text-destructive";
                    else cls += "border-border bg-card text-muted-foreground opacity-50";
                    return <button key={opt} onClick={() => answer(opt)} className={cls} style={{ fontFamily: "'DM Mono', monospace" }}>{opt}</button>;
                })}
            </div>
        </div>
    );
}
