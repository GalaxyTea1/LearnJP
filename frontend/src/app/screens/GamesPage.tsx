import { Target, Layers, Zap } from "lucide-react";
import { useState } from "react";
import { GameType } from "../data/basicData";
import MatchGame from "./MatchGame";
import QuizGame from "./QuizGame";
import SpeedGame from "./SpeedGame";

export default function GamesPage() {
    const [game, setGame] = useState<GameType>("quiz");
    const [key, setKey] = useState(0);

    const games = [
        { id: "quiz" as GameType, label: "Character Quiz", icon: <Target size={16} />, desc: "Identify hiragana from 4 choices" },
        { id: "match" as GameType, label: "Memory Match", icon: <Layers size={16} />, desc: "Pair hiragana with their romaji" },
        { id: "speed" as GameType, label: "Speed Typing", icon: <Zap size={16} />, desc: "Translate as many words as possible in 30s" },
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-accent font-medium mb-2">Games</p>
                <h2 className="text-4xl text-foreground mb-2" style={{ fontFamily: "'Noto Serif JP', serif", fontWeight: 300 }}>Practice Through Play</h2>
                <p className="text-muted-foreground text-sm">Learning sticks better when it's fun. Choose a game to drill your Japanese.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-10">
                {games.map(g => (
                    <button key={g.id} onClick={() => { setGame(g.id); setKey(k => k + 1); }}
                        className={`text-left p-4 border transition-all ${game === g.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-foreground/30"}`}>
                        <div className={`mb-2 ${game === g.id ? "text-accent" : "text-muted-foreground"}`}>{g.icon}</div>
                        <p className={`text-sm font-medium mb-1 ${game === g.id ? "text-primary-foreground" : "text-foreground"}`}>{g.label}</p>
                        <p className={`text-xs ${game === g.id ? "text-primary-foreground/50" : "text-muted-foreground"}`}>{g.desc}</p>
                    </button>
                ))}
            </div>
            <div className="border border-border bg-card p-8">
                <div key={key}>
                    {game === "quiz" && <QuizGame />}
                    {game === "match" && <MatchGame />}
                    {game === "speed" && <SpeedGame />}
                </div>
            </div>
        </div>
    );
}
