import { Search, Loader2, Info, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import useWordModal from "../components/ui/useWordModal";
import WordModal from "../components/ui/WordModal";
import { localDictionary } from "../utils/localDictionary";
import { dictionaryApi } from "../services/api";
import { speak } from "../utils/helpers";

export default function DictionaryPage() {
    const { word, openVocab, close } = useWordModal();
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<typeof localDictionary[0] | null>(null);

    const [results, setResults] = useState<typeof localDictionary>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [error, setError] = useState(false);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        const q = query.trim().toLowerCase();
        setError(false);
        const matches = !q ? localDictionary : localDictionary.filter(w =>
            w.jp.includes(q) || w.rom.toLowerCase().includes(q) || w.en.toLowerCase().includes(q)
        );
        if (matches.length > 0 || !q) {
            setResults(matches);
            setIsSearching(false);
            return;
        }
        const controller = new AbortController();
        setResults([]);
        setIsSearching(true);
        // Include the browser-to-backend connection in the deadline as well.
        const deadline = setTimeout(() => {
            controller.abort();
            setError(true);
            setIsSearching(false);
        }, 12000);
        const debounce = setTimeout(async () => {
            try {
                const response = await dictionaryApi.searchRemote(q, controller.signal);
                if (!controller.signal.aborted) setResults(response.data);
            } catch {
                if (!controller.signal.aborted) setError(true);
            } finally {
                clearTimeout(deadline);
                if (!controller.signal.aborted) setIsSearching(false);
            }
        }, 600);
        return () => {
            clearTimeout(debounce);
            clearTimeout(deadline);
            controller.abort();
        };
    }, [query, retry]);

    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            {word && <WordModal word={word} onClose={close} />}
            <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-accent font-medium mb-2">Dictionary</p>
                <h2 className="text-4xl text-foreground mb-2" style={{ fontFamily: "'Noto Serif JP', serif", fontWeight: 300 }}>Vocabulary Search</h2>
                <p className="text-muted-foreground text-sm">Search Japanese, reading, romaji or English. Additional results are provided by Jisho.</p>
            </div>

            <div className="relative mb-8">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input maxLength={100} aria-label="Search Japanese dictionary" className="w-full bg-card border border-border pl-10 pr-4 py-3 text-foreground outline-none focus:border-accent/60 transition-colors text-base"
                    placeholder="Search… e.g. たべる, eat, tomodachi"
                    value={query} onChange={e => { setQuery(e.target.value); setSelected(null); }} />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="min-w-0 md:flex-[3] space-y-1 relative min-h-[150px]">
                    {isSearching && (
                        <div role="status" className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center pt-8 z-10">
                            <Loader2 size={24} className="text-accent animate-spin mb-2" />
                            <span className="text-sm text-muted-foreground">Searching dictionary…</span>
                        </div>
                    )}
                    {!isSearching && error && (
                        <div role="alert" className="border border-border bg-card p-5 text-sm">
                            <p>Unable to connect to the dictionary. Please try again.</p>
                            <button onClick={() => setRetry(value => value + 1)} className="mt-3 border border-border px-4 py-2 hover:border-accent">Try again</button>
                        </div>
                    )}
                    {!isSearching && !error && results.length === 0 && <p className="text-muted-foreground text-sm py-8 text-center">No results found. Try Japanese, a reading or an English keyword.</p>}
                    {!isSearching && results.map((w, idx) => (
                        <button key={`${w.jp}-${idx}`} onClick={() => { setSelected(w); openVocab(w as any); }}
                            className={`w-full text-left px-4 py-3 border transition-colors flex items-center gap-4 ${selected?.jp === w.jp ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-accent/40"}`}>
                            <span className="text-2xl max-w-[40%] break-words" style={{ fontFamily: "'Noto Serif JP', serif" }}>{w.jp}</span>
                            <div className="min-w-0">
                                <p className={`text-sm font-medium truncate ${selected?.jp === w.jp ? "text-primary-foreground" : "text-foreground"}`}>{w.en}</p>
                                <p className={`text-xs truncate ${selected?.jp === w.jp ? "text-primary-foreground/50" : "text-muted-foreground"}`} style={{ fontFamily: "'DM Mono', monospace" }}>{w.rom}</p>
                            </div>
                            <span className={`ml-auto text-xs flex-shrink-0 px-1.5 py-0.5 ${selected?.jp === w.jp ? "bg-white/15 text-white" : "bg-secondary text-muted-foreground"}`}>{w.level}</span>
                            <Info size={13} className={selected?.jp === w.jp ? "text-white/40" : "text-muted-foreground/30"} />
                        </button>
                    ))}
                </div>
                <div className="min-w-0 md:flex-[2]">
                    <div className="border border-border bg-card p-6 sticky top-20">
                        {selected ? (
                            <>
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-4xl min-w-0 break-words text-foreground" style={{ fontFamily: "'Noto Serif JP', serif" }}>{selected.jp}</span>
                                    <button aria-label="Listen to pronunciation" onClick={() => speak(selected.jp)} className="text-muted-foreground hover:text-accent transition-colors mt-2"><Volume2 size={18} /></button>
                                </div>
                                <p className="text-muted-foreground text-sm mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>{selected.rom}</p>
                                <p className="text-foreground font-medium text-lg mb-3">{selected.en}</p>
                                <div className="flex gap-2 mb-4">
                                    <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 capitalize">{selected.type}</span>
                                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5">{selected.level}</span>
                                </div>
                                {selected.example && (
                                    <div className="border-t border-border pt-4">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Example</p>
                                        <p className="text-foreground mb-1" style={{ fontFamily: "'Noto Serif JP', serif" }}>{selected.example}</p>
                                        <p className="text-sm text-muted-foreground italic">{selected.exampleEn}</p>
                                    </div>
                                )}
                                <button onClick={() => openVocab(selected as any)} className="mt-4 w-full border border-border text-sm text-muted-foreground py-2 hover:border-accent/40 hover:text-accent transition-colors flex items-center justify-center gap-1.5">
                                    <Info size={12} /> Full details & writing
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <span className="text-5xl text-muted-foreground/20 mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>辞</span>
                                <p className="text-muted-foreground text-sm">Select a word to see details</p>
                                <p className="text-muted-foreground/50 text-xs mt-1">Click for full popup with writing guide</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
