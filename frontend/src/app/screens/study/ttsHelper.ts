/**
 * Utility to pronounce Japanese text using native browser SpeechSynthesis API.
 * Falls back gracefully if SpeechSynthesis is not supported.
 */
let cachedJaVoice: SpeechSynthesisVoice | null = null;

export function speakJapanese(text: string, rate: number = 0.9) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this environment");
    return;
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Strip furigana parentheses (both half-width and full-width), e.g. 日本語 (にほんご) or 日本語（にほんご）
    const cleanText = text.replace(/\s*[\(（][^)）]*[\)）]/g, "").trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ja-JP";
    utterance.rate = rate; // slightly slower for language learners

    // Handle voice assignment robustly
    if (cachedJaVoice) {
      utterance.voice = cachedJaVoice;
      window.speechSynthesis.speak(utterance);
    } else {
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => v.lang.startsWith("ja") || v.lang.includes("JP"));
      
      if (jaVoice) {
        cachedJaVoice = jaVoice;
        utterance.voice = jaVoice;
        window.speechSynthesis.speak(utterance);
      } else {
        // Voices might not be loaded yet in Chrome
        const onVoicesChanged = () => {
          const freshVoices = window.speechSynthesis.getVoices();
          const freshJaVoice = freshVoices.find(v => v.lang.startsWith("ja") || v.lang.includes("JP"));
          if (freshJaVoice) {
            cachedJaVoice = freshJaVoice;
            utterance.voice = freshJaVoice;
          }
          window.speechSynthesis.speak(utterance);
          window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        };
        
        if (voices.length === 0) {
          window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
        } else {
          // Fallback to default voice if no Japanese voice exists on device
          window.speechSynthesis.speak(utterance);
        }
      }
    }
  } catch (err) {
    console.error("Speech synthesis error:", err);
  }
}
