import { Clock, Zap, Trophy } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { localDictionary } from "../utils/localDictionary";

export default function SpeedGame() {
    const pool = localDictionary.filter(d => d.type !== "phrase").slice(0, 15);
    const [gameState, setGameState] = useState<"idle" | "playing" | "done">("idle");
    const [current, setCurrent] = useState(0);
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (gameState !== "playing") return;
        const t = setInterval(() => setTimeLeft(tl => { if (tl <= 1) { clearInterval(t); setGameState("done"); return 0; } return tl - 1; }), 1000);
        return () => clearInterval(t);
    }, [gameState]);

    const start = () => { setCurrent(0); setInput(""); setScore(0); setTimeLeft(30); setGameState("playing"); setTimeout(() => inputRef.current?.focus(), 50); };

    const handleInput = (val: string) => {
        setInput(val);
        const w = pool[current % pool.length];
        if (val.toLowerCase().trim() === w.en.toLowerCase() || val.toLowerCase().trim() === w.rom.toLowerCase()) {
            setScore(s => s + 1); setInput(""); setCurrent(c => c + 1);
        }
    };

    if (gameState === "idle") return (
        <div className="flex flex-col items-center py-12 text-center gap-4">
            <Clock size={36} className="text-accent" />
            <h3 className="text-2xl font-medium" style={{ fontFamily: "'Noto Serif JP', serif" }}>Speed Typing</h3>
            <p className="text-muted-foreground text-sm max-w-xs">Type the English meaning or romaji of the displayed Japanese word. You have 30 seconds.</p>
            <button onClick={start} className="mt-4 bg-accent text-accent-foreground px-6 py-2.5 text-sm hover:bg-accent/90 transition-colors flex items-center gap-2"><Zap size={14} /> Start Game</button>
        </div>
    );

    if (gameState === "done") return (
        <div className="flex flex-col items-center py-12 text-center">
            <Trophy size={36} className="text-accent mb-4" />
            <h3 className="text-2xl font-medium mb-1" style={{ fontFamily: "'Noto Serif JP', serif" }}>時間切れ！</h3>
            <p className="text-muted-foreground mb-2">Time's up!</p>
            <p className="text-6xl font-medium text-foreground mb-1">{score}</p>
            <p className="text-muted-foreground mb-8">words answered</p>
            <button onClick={start} className="bg-primary text-primary-foreground px-6 py-2.5 text-sm hover:bg-accent transition-colors">Play Again</button>
        </div>
    );

    const w = pool[current % pool.length];
    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex gap-6 text-sm text-muted-foreground">
                <span className={`flex items-center gap-1 font-medium ${timeLeft <= 10 ? "text-destructive" : "text-foreground"}`}><Clock size={13} />{timeLeft}s</span>
                <span>Score <span className="text-foreground font-medium">{score}</span></span>
            </div>
            <div className="w-48 h-48 bg-card border-2 border-border flex flex-col items-center justify-center">
                <span className="text-5xl text-foreground" style={{ fontFamily: "'Noto Serif JP', serif" }}>{w.jp}</span>
                <span className="text-xs text-muted-foreground mt-2 capitalize">{w.type}</span>
            </div>
            <p className="text-sm text-muted-foreground">Type the English meaning or romaji</p>
            <input ref={inputRef} className="border-b-2 border-border focus:border-accent outline-none bg-transparent text-center text-xl text-foreground py-2 w-48 transition-colors"
                value={input} onChange={e => handleInput(e.target.value)} placeholder="type here…" autoComplete="off" />
        </div>
    );
}
