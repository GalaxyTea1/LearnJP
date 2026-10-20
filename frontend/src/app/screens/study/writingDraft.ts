export type DraftStatus = 'empty' | 'saved' | 'unavailable' | 'invalid' | 'unsaved';
export interface WritingDraft { text: string; status: DraftStatus }
type DraftStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function writingDraftKey(moduleId: number, taskId: number, userId?: number) {
  return `writing_draft_v1_${moduleId}_${taskId}_${userId === undefined ? 'guest' : `user_${userId}`}`;
}

// Failed writes (including clearing a draft) survive component unmounts. Successful
// reads still consult storage, so returning to a task sees another tab's saved edit.
export function createWritingDraftStore(storage: () => DraftStorage) {
  const cache = new Map<string, string>();
  const pending = new Map<string, string>();
  const read = (key: string): WritingDraft => {
    if (pending.has(key)) return { text: pending.get(key)!, status: 'unsaved' };
    try {
      const raw = storage().getItem(key);
      if (raw === null) { cache.delete(key); return { text: '', status: 'empty' }; }
      let value: unknown;
      try { value = JSON.parse(raw); } catch { return { text: cache.get(key) ?? '', status: 'invalid' }; }
      if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1 ||
          !('text' in value) || typeof value.text !== 'string') {
        return { text: cache.get(key) ?? '', status: 'invalid' };
      }
      cache.set(key, value.text);
      return { text: value.text, status: 'saved' };
    } catch { return { text: cache.get(key) ?? '', status: 'unavailable' }; }
  };
  const save = (key: string, text: string): WritingDraft => {
    cache.set(key, text);
    pending.set(key, text);
    try {
      // Store empty text too: a failed clear must never restore an older draft.
      storage().setItem(key, JSON.stringify({ version: 1, text }));
      pending.delete(key);
      return { text, status: 'saved' };
    } catch { return { text, status: 'unsaved' }; }
  };
  const retryPending = () => {
    for (const [key, text] of pending) save(key, text);
    return pending.size === 0;
  };
  return { read, save, retryPending, hasPending: () => pending.size > 0 };
}
