/** Event-driven speech queue. Cancellation settles the current wait immediately. */
export function createDialoguePlayer(
  synth: SpeechSynthesis,
  createUtterance: (text: string) => SpeechSynthesisUtterance,
  timeouts = { voices: 2000, start: 10000, playback: 180000 },
) {
  let generation = 0;
  let finishCurrent: ((completed: boolean) => void) | undefined;
  const stop = () => {
    generation++;
    finishCurrent?.(false);
    synth.cancel();
  };
  const play = async (texts: string[], onLine: (index: number) => void) => {
    stop();
    const session = generation;
    let voices = synth.getVoices();
    if (!voices.length) {
      await new Promise<void>(resolve => {
        const done = () => { clearTimeout(timer); synth.removeEventListener('voiceschanged', changed); if (finishCurrent === cancelled) finishCurrent = undefined; resolve(); };
        const changed = () => { if (synth.getVoices().length) done(); };
        const cancelled = () => done();
        const timer = setTimeout(done, timeouts.voices);
        finishCurrent = cancelled;
        synth.addEventListener('voiceschanged', changed);
        changed();
      });
      if (session !== generation) return false;
      voices = synth.getVoices();
    }
    const voice = voices.find(v => /^ja(?:[-_]|$)/i.test(v.lang));
    if (!voice) throw new Error('Chưa có giọng tiếng Nhật trên trình duyệt. Hãy bật hoặc cài giọng tiếng Nhật trong thiết bị rồi thử lại. Bạn vẫn có thể đọc lời thoại.');
    for (let index = 0; index < texts.length; index++) {
      if (session !== generation) return false;
      const text = texts[index].replace(/\s*[(（][^)）]*[)）]/g, '').trim();
      if (!text) continue;
      onLine(index);
      const completed = await new Promise<boolean>((resolve, reject) => {
        const utterance = createUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9;
        utterance.voice = voice;
        let settled = false;
        let timer: ReturnType<typeof setTimeout>;
        const settle = (value: boolean, error?: Error) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          utterance.onstart = null;
          utterance.onend = null;
          utterance.onerror = null;
          if (finishCurrent === settle) finishCurrent = undefined;
          if (error) reject(error); else resolve(value);
        };
        finishCurrent = settle;
        const expired = () => { settle(false, new Error('Giọng đọc không phản hồi. Hãy thử lại hoặc kiểm tra giọng tiếng Nhật trên thiết bị.')); synth.cancel(); };
        timer = setTimeout(expired, timeouts.start);
        utterance.onstart = () => { clearTimeout(timer); timer = setTimeout(expired, timeouts.playback); };
        utterance.onend = () => settle(true);
        utterance.onerror = event => {
          if (event.error === 'canceled' || event.error === 'interrupted') settle(false);
          else settle(false, new Error('Không phát được giọng đọc. Hãy thử lại hoặc kiểm tra giọng tiếng Nhật trên trình duyệt.'));
        };
        // Let the browser load its voice list; no delayed voiceschanged listener can
        // resurrect speech after Stop/unmount.
        try { synth.speak(utterance); } catch { settle(false, new Error('Trình duyệt không phát được giọng đọc. Vui lòng thử lại.')); }
      });
      if (!completed || session !== generation) return false;
    }
    return session === generation;
  };
  return { play, stop };
}

export function hasListeningAudio(url?: string | null): boolean {
  const value = url?.trim() || '';
  return /^https:\/\/[^/\s]+(?:\/|$)/i.test(value) || /^\/(?!\/)/.test(value);
}

export const isTtsListening = (url?: string | null) => url?.trim() === 'TTS:ja-JP';
export const listeningReady = (url?: string | null, transcript?: string | null) =>
  hasListeningAudio(url) || (isTtsListening(url) && !!transcript?.trim());

/** Speaker labels are visual context, not Japanese speech. */
export function listeningSpeechLines(transcript: string): string[] {
  return transcript.split(/\r?\n/).map(line => line.replace(/^\s*(?:[A-ZＡ-Ｚ]|男|女|男性|女性|店員|客|警官|先生|学生)\s*[:：]\s*/u, '').trim()).filter(Boolean);
}
