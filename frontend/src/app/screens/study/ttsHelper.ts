import { createDialoguePlayer } from './dialoguePlayer';

export type SpeechState = { playing: boolean; error: string };

/** Each study tab owns its player; stale completions cannot overwrite a newer request. */
export function createJapaneseSpeech(
  synth: SpeechSynthesis,
  utterance: (text: string) => SpeechSynthesisUtterance,
  notify: (state: SpeechState) => void,
) {
  const player = createDialoguePlayer(synth, utterance);
  let request = 0;
  const stop = () => {
    request++;
    player.stop();
    notify({ playing: false, error: '' });
  };
  const speak = async (text: string) => {
    const current = ++request;
    notify({ playing: true, error: '' });
    try {
      await player.play([text], () => {});
      if (current === request) notify({ playing: false, error: '' });
    } catch (error) {
      if (current === request)
        notify({
          playing: false,
          error: error instanceof Error ? error.message : 'Không phát được giọng đọc. Vui lòng thử lại.',
        });
    }
  };
  return { speak, stop };
}
