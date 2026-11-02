import { useCallback, useEffect, useRef, useState } from 'react';
import { createJapaneseSpeech, type SpeechState } from './ttsHelper';

export function useJapaneseSpeech(scope: string) {
  const [state, setState] = useState<SpeechState>({ playing: false, error: '' });
  const player = useRef<ReturnType<typeof createJapaneseSpeech> | null>(null);
  const stop = useCallback(() => player.current?.stop(), []);

  useEffect(() => {
    let active = true;
    if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      player.current = createJapaneseSpeech(
        window.speechSynthesis,
        text => new SpeechSynthesisUtterance(text),
        next => {
          if (active) setState(next);
        },
      );
    }
    setState({ playing: false, error: '' });
    const hide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('pagehide', stop);
    return () => {
      active = false;
      player.current?.stop();
      player.current = null;
      document.removeEventListener('visibilitychange', hide);
      window.removeEventListener('pagehide', stop);
    };
  }, [scope, stop]);

  const speakJapanese = (text: string) => {
    if (!player.current) {
      setState({
        playing: false,
        error: 'Trình duyệt này chưa hỗ trợ giọng đọc. Bạn vẫn có thể đọc nội dung bài học.',
      });
      return;
    }
    void player.current.speak(text);
  };
  return { ...state, speakJapanese, stop };
}
