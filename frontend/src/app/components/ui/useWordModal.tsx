import { useState } from "react";
import { kanjiDetails, hiraganaDetails } from "../../data/basicData";
import { localDictionary, WordDetail } from "../../utils/localDictionary";

export default function useWordModal() {
    const [word, setWord] = useState<WordDetail | null>(null);

    const openKanji = (char: string) => {
        const d = kanjiDetails[char];
        if (d) setWord(d);
        else setWord({ char, type: "kanji", meaning: "Kanji character", strokes: undefined });
    };

    const openHiragana = (char: string, rom: string) => {
        const d = hiraganaDetails[char];
        if (d) setWord(d);
        else setWord({ char, type: "hiragana", romaji: rom });
    };

    const openKatakana = (char: string, rom: string) => {
        setWord({ char, type: "katakana", romaji: rom, meaning: `Katakana for "${rom}"` });
    };

    const openVocab = (w: typeof localDictionary[number]) => {
        setWord({
            char: w.jp,
            type: "vocab",
            romaji: w.rom,
            meaning: w.en,
            vocabType: w.type,
            level: w.level,
            examples: w.example ? [{ jp: w.example, en: w.exampleEn ?? "" }] : undefined,
        });
    };

    const close = () => setWord(null);

    return { word, openKanji, openHiragana, openKatakana, openVocab, close };
}
