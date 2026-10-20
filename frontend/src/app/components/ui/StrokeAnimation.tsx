import { RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import WritingGrid from "./WritingGrid";
import kanaData from "../../utils/kanaData.json";

export default function StrokeAnimation({ char, strokes }: { char: string; strokes: number }) {
    const [step, setStep] = useState(0);
    const [running, setRunning] = useState(false);

    // Load SVG paths from our KanjiVG data if available
    const svgPaths: string[] = (kanaData as Record<string, string[]>)[char] || [];
    const totalStrokes = svgPaths.length > 0 ? svgPaths.length : strokes;

    const start = () => {
        setStep(0);
        setRunning(true);
    };

    useEffect(() => {
        if (!running) return;
        if (step >= totalStrokes) { setRunning(false); return; }
        const t = setTimeout(() => setStep(s => s + 1), 600);
        return () => clearTimeout(t);
    }, [running, step, totalStrokes]);

    const progress = totalStrokes > 0 ? step / totalStrokes : 1;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative" style={{ width: 200, height: 200 }}>
                <WritingGrid size={200} />

                {/* ghost character / background paths */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {svgPaths.length > 0 ? (
                        <svg viewBox="0 0 109 109" width="160" height="160" className="opacity-15">
                            {svgPaths.map((d, i) => (
                                <path key={i} d={d} fill="none" stroke="#1C1712" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            ))}
                        </svg>
                    ) : (
                        <span className="text-8xl select-none" style={{
                            fontFamily: "'Noto Serif JP', serif",
                            color: "rgba(28,23,18,0.08)",
                        }}>{char}</span>
                    )}
                </div>

                {/* animated strokes */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {svgPaths.length > 0 ? (
                        <svg viewBox="0 0 109 109" width="160" height="160">
                            {svgPaths.map((d, i) => {
                                const isDrawn = i < step;
                                const isAnimating = i === step && running;
                                return (
                                    <path
                                        key={i}
                                        d={d}
                                        fill="none"
                                        stroke="#1C1712"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        pathLength="1"
                                        strokeDasharray="1"
                                        strokeDashoffset={isDrawn ? 0 : (isAnimating ? 0 : 1)}
                                        style={{
                                            transition: isAnimating ? "stroke-dashoffset 0.5s ease-out" : (isDrawn ? "none" : "none"),
                                            opacity: (isDrawn || isAnimating) ? 1 : 0
                                        }}
                                    />
                                );
                            })}
                        </svg>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{
                            clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
                            transition: "clip-path 0.35s ease-out",
                        }}>
                            <span className="text-8xl select-none" style={{
                                fontFamily: "'Noto Serif JP', serif",
                                color: "#1C1712",
                            }}>{char}</span>
                        </div>
                    )}
                </div>

                {/* stroke counter badge */}
                <div className="absolute bottom-2 right-2 bg-accent/10 border border-accent/20 text-accent text-xs px-2 py-0.5 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {step}/{totalStrokes}
                </div>
            </div>

            {/* stroke dots */}
            <div className="flex gap-1.5">
                {Array.from({ length: totalStrokes }).map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i < step ? "bg-accent" : "bg-border"}`} />
                ))}
            </div>

            <button
                onClick={start}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent border border-border px-3 py-1.5 transition-colors"
            >
                <RotateCcw size={11} /> {running ? "Animating…" : "Replay stroke order"}
            </button>
        </div>
    );
}
