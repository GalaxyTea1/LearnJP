import { useState } from 'react';
import useWordModal from '../components/ui/useWordModal';
import WordModal from '../components/ui/WordModal';
import { hiragana, katakana } from '../data/basicData';

export default function WritingPage() {
  const { word, openHiragana, openKatakana, close } = useWordModal();
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {word && <WordModal word={word} onClose={close} />}
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-accent font-medium mb-2">Luyện viết</p>
        <h1 className="text-3xl md:text-4xl font-medium text-foreground">Bảng chữ cái tiếng Nhật</h1>
      </div>
      <div className="flex gap-0 mb-8 border border-border w-fit">
        {(['hiragana', 'katakana'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-medium transition-colors duration-200 ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'hiragana' && (
        <div>
          <p className="text-sm text-muted-foreground mb-6">
            Hiragana (ひらがな) gồm 46 chữ cơ bản. Bấm vào một chữ để xem thứ tự nét.
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {hiragana.map((h, i) => (
              <button
                key={i}
                onClick={() => h.rom && openHiragana(h.char, h.rom)}
                className={`bg-card border border-border flex flex-col items-center justify-center py-3 transition-all duration-150 ${h.rom === '' ? 'opacity-0 pointer-events-none' : 'hover:border-accent hover:bg-accent/5 cursor-pointer group'}`}
              >
                <span
                  className="text-xl text-foreground leading-none mb-1 group-hover:scale-110 transition-transform"
                  style={{ fontFamily: "'DM Sans', 'Noto Serif JP', serif" }}
                >
                  {h.char}
                </span>
                <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {h.rom}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'katakana' && (
        <div>
          <p className="text-sm text-muted-foreground mb-6">
            Katakana (カタカナ) gồm 46 chữ, dùng cho từ mượn. Bấm vào một chữ để xem thứ tự nét.
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {katakana.map((k, i) => (
              <button
                key={i}
                onClick={() => k.rom && openKatakana(k.char, k.rom)}
                className={`bg-card border border-border flex flex-col items-center justify-center py-3 transition-all duration-150 ${k.rom === '' ? 'opacity-0 pointer-events-none' : 'hover:border-accent hover:bg-accent/5 cursor-pointer group'}`}
              >
                <span
                  className="text-xl text-foreground leading-none mb-1 group-hover:scale-110 transition-transform"
                  style={{ fontFamily: "'DM Sans', 'Noto Serif JP', serif" }}
                >
                  {k.char}
                </span>
                <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {k.rom}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
