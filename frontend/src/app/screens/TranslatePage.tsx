import { ArrowLeftRight, ImageIcon, Loader2, Volume2 } from "lucide-react";
import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { speak } from "../utils/helpers";

export default function TranslatePage() {
    const [text, setText] = useState("");
    const [direction, setDirection] = useState<"en-jp" | "jp-en">("en-jp");
    const [result, setResult] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isOcrLoading, setIsOcrLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const translate = async () => {
        const q = text.trim();
        if (!q) return;
        setIsTranslating(true);
        setResult(null);
        try {
            const sl = direction === "en-jp" ? "en" : "ja";
            const tl = direction === "en-jp" ? "ja" : "en";
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(q)}`);
            const data = await res.json();
            if (data && data[0]) {
                const translatedText = data[0].map((item: any) => item[0]).join("");
                setResult(translatedText);
            } else {
                setResult("Translation failed.");
            }
        } catch (error) {
            console.error(error);
            setResult("Error connecting to translation service.");
        } finally {
            setIsTranslating(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsOcrLoading(true);
        setText("");
        setResult(null);
        try {
            const lang = direction === "en-jp" ? "eng" : "jpn"; // tesseract uses eng / jpn
            const result = await Tesseract.recognize(file, lang);
            setText(result.data.text.trim());
        } catch (error) {
            console.error(error);
            setText("Could not read text from image.");
        } finally {
            setIsOcrLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-accent font-medium mb-2">Translate</p>
                <h2 className="text-4xl text-foreground mb-2" style={{ fontFamily: "'Noto Serif JP', serif", fontWeight: 300 }}>Japanese ↔ English</h2>
                <p className="text-muted-foreground text-sm">Type a word, paste a sentence, or upload an image to translate.</p>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <span className={`text-sm font-medium ${direction === "en-jp" ? "text-foreground" : "text-muted-foreground"}`}>English</span>
                <button onClick={() => { setDirection(d => d === "en-jp" ? "jp-en" : "en-jp"); setText(""); setResult(null); }}
                    className="flex items-center justify-center w-8 h-8 border border-border hover:border-accent/50 hover:text-accent transition-colors">
                    <ArrowLeftRight size={14} />
                </button>
                <span className={`text-sm font-medium ${direction === "jp-en" ? "text-foreground" : "text-muted-foreground"}`} style={{ fontFamily: "'Noto Serif JP', serif" }}>日本語</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-border bg-card relative">
                    <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground font-medium flex justify-between items-center">
                        <span>{direction === "en-jp" ? "English" : "Japanese"}</span>
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-accent hover:text-accent/80 transition-colors">
                            <ImageIcon size={13} /> <span className="hidden sm:inline">Upload Image</span>
                        </button>
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                    </div>
                    <div className="relative">
                        <textarea className="w-full p-4 bg-transparent resize-none text-foreground outline-none text-lg min-h-36"
                            placeholder={direction === "en-jp" ? "Type in English or upload image…" : "日本語を入力、または画像をアップロード…"}
                            value={text} onChange={e => { setText(e.target.value); setResult(null); }}
                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), translate())}
                            disabled={isOcrLoading}
                        />
                        {isOcrLoading && (
                            <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center">
                                <Loader2 size={24} className="text-accent animate-spin mb-2" />
                                <span className="text-sm text-foreground">Reading image...</span>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-border px-4 py-2 flex justify-end">
                        <button onClick={translate} disabled={!text.trim() || isTranslating || isOcrLoading}
                            className="bg-primary text-primary-foreground text-sm px-4 py-1.5 hover:bg-accent transition-colors disabled:opacity-50 flex items-center gap-2">
                            {isTranslating ? <><Loader2 size={14} className="animate-spin" /> Translating</> : "Translate"}
                        </button>
                    </div>
                </div>

                <div className="border border-border bg-secondary relative">
                    <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground font-medium flex items-center justify-between">
                        <span>{direction === "en-jp" ? "Japanese" : "English"}</span>
                        {result && direction === "en-jp" && (
                            <button onClick={() => speak(result)} className="text-muted-foreground hover:text-accent transition-colors"><Volume2 size={13} /></button>
                        )}
                    </div>
                    <div className="p-4 min-h-36 flex items-start">
                        {isTranslating ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground pt-8">
                                <Loader2 size={24} className="animate-spin mb-2 text-accent" />
                                <span className="text-sm">Connecting to Google Translate...</span>
                            </div>
                        ) : result ? (
                            <p className="text-2xl text-foreground leading-relaxed" style={{ fontFamily: direction === "en-jp" ? "'Noto Serif JP', serif" : "inherit" }}>{result}</p>
                        ) : (
                            <p className="text-muted-foreground/40 text-sm mt-2">Translation appears here…</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Quick phrases</p>
                <div className="flex flex-wrap gap-2">
                    {["hello", "thank you", "excuse me", "i love you", "delicious", "beautiful", "help"].map(p => (
                        <button key={p} onClick={() => { setText(p); setDirection("en-jp"); setResult(null); }}
                            className="text-sm border border-border px-3 py-1.5 bg-card hover:border-accent/50 hover:text-accent transition-colors capitalize">{p}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}
