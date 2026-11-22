/** Minimal audio element surface, so tests can pass a fake. */
export type ClipElement = Pick<HTMLAudioElement, 'src' | 'play' | 'pause'> & {
  onended: ((this: GlobalEventHandlers, ev: Event) => unknown) | null;
  onerror: OnErrorEventHandler;
};

/**
 * Plays recorded clips one after another on a single audio element. Reusing one element keeps
 * mobile browsers' autoplay permission from the first tap for the whole dialogue.
 * Resolves true when every clip finished, false when stopped; rejects when a clip cannot play.
 */
export function createClipPlayer(createElement: () => ClipElement) {
  let element: ClipElement | undefined;
  let generation = 0;
  let finishCurrent: ((completed: boolean) => void) | undefined;
  const stop = () => {
    generation++;
    element?.pause();
    finishCurrent?.(false);
  };
  const play = async (urls: string[], onLine: (index: number) => void) => {
    stop();
    const session = generation;
    element ??= createElement();
    const audio = element;
    for (let index = 0; index < urls.length; index++) {
      if (session !== generation) return false;
      onLine(index);
      const completed = await new Promise<boolean>((resolve, reject) => {
        let settled = false;
        const settle = (value: boolean, error?: Error) => {
          if (settled) return;
          settled = true;
          audio.onended = null;
          audio.onerror = null;
          if (finishCurrent === settle) finishCurrent = undefined;
          if (error) reject(error);
          else resolve(value);
        };
        finishCurrent = settle;
        const failed = () => settle(false, new Error('Không tải được bản ghi âm.'));
        audio.onended = () => settle(true);
        audio.onerror = failed;
        audio.src = urls[index];
        audio.play().catch((error: unknown) => {
          // A pause() from stop() rejects play() with AbortError; that is not a failure.
          if (error instanceof Error && error.name === 'AbortError') settle(false);
          else failed();
        });
      });
      if (!completed || session !== generation) return false;
    }
    return session === generation;
  };
  return { play, stop };
}
