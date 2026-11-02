import React from 'react';
import type { SpeechState } from './ttsHelper';

export function SpeechStatus({ playing, error, stop }: SpeechState & { stop: () => void }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      {playing && (
        <button type="button" onClick={stop} className="self-start rounded-lg border border-border px-3 py-2">
          Dừng giọng đọc
        </button>
      )}
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
