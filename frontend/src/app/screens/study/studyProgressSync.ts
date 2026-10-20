export const studyTabs = ['vocab', 'kanji', 'grammar', 'dialogue', 'exercise'];
export type StudyDetails = { completedTabs: string[]; masteredVocabularyIds: number[]; quizCompleted: boolean };
export type StudyPatch = { completedTabs: string[]; vocabulary: { id: number; mastered: boolean }[] };
export const emptyDetails = (): StudyDetails => ({ completedTabs: [], masteredVocabularyIds: [], quizCompleted: false });
export function localDetails(storage: Storage, moduleId: number, identity: string) {
  const result = emptyDetails();
  try {
    const tabs = JSON.parse(storage.getItem(`completed_tabs_mod_${moduleId}_user_${identity}`) || '[]');
    const words = JSON.parse(storage.getItem(`study_mastered_vocab_${moduleId}_user_${identity}`) || '[]');
    if (Array.isArray(tabs)) result.completedTabs = [...new Set<string>(tabs.filter(t => studyTabs.includes(t)))];
    if (Array.isArray(words)) result.masteredVocabularyIds = [...new Set<number>(words.filter(id => Number.isInteger(id) && id > 0))];
  } catch { /* Ignore invalid legacy storage. */ }
  return result;
}
export type SyncView = StudyDetails & { ready: boolean; saving: boolean; error: boolean; storageError: boolean; pending: boolean };

type Operation = { id: string; order: number; patch: StudyPatch };
const validPatch = (value: unknown): value is StudyPatch => {
  const p = value as StudyPatch;
  return !!p && Array.isArray(p.completedTabs) && p.completedTabs.every(t => studyTabs.includes(t)) &&
    Array.isArray(p.vocabulary) && p.vocabulary.length <= 1000 && p.vocabulary.every(w => w && Number.isInteger(w.id) && w.id > 0 && typeof w.mastered === 'boolean');
};

export function createStudySync(options: {
  storage: Storage; moduleId: number; userId: number | null;
  read: () => Promise<StudyDetails>; write: (patch: StudyPatch) => Promise<StudyDetails>;
  notify: (state: SyncView) => void;
  withLock?: (name: string, work: () => Promise<void>) => Promise<void>;
}) {
  const { storage, moduleId, userId } = options;
  const legacyKey = `study_pending_v1_${moduleId}_user_${userId}`;
  const prefix = `study_ops_v2_${moduleId}_user_${userId}_`;
  // Each edit owns its durable key. Another tab can neither replace it nor ACK it
  // accidentally. Only failed local writes remain in this controller's memory.
  const volatile = new Map<string, Operation>();
  let operations: Operation[] = [];
  let base = emptyDetails();
  let ready = false, saving = false, error = false, storageError = false, disposed = false;
  let running: Promise<void> | null = null;
  const withLock = options.withLock ?? (async (name, work) => {
    if (!globalThis.navigator?.locks) throw new Error('Cross-tab progress requires Web Locks');
    await navigator.locks.request(name, { mode: 'exclusive' }, work);
  });
  function scan() {
    const found = new Map<string, Operation>();
    try {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (!key?.startsWith(prefix)) continue;
        const op = JSON.parse(storage.getItem(key) || 'null') as Operation | null;
        if (!op || key !== prefix + op.id || !Number.isSafeInteger(op.order) || !validPatch(op.patch)) throw new Error('Invalid pending edit');
        found.set(op.id, op);
      }
    } catch {
      storageError = true;
      // Never silently drop the last known pending edits when storage is unreadable.
      for (const op of operations) found.set(op.id, op);
      throw new Error('Cannot read pending edits');
    } finally {
      for (const op of volatile.values()) found.set(op.id, op);
      operations = [...found.values()].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
    }
  }
  function value(): StudyDetails {
    const words = new Set(base.masteredVocabularyIds), completed = new Set(base.completedTabs);
    for (const op of operations) {
      op.patch.completedTabs.forEach(t => completed.add(t));
      op.patch.vocabulary.forEach(w => w.mastered ? words.add(w.id) : words.delete(w.id));
    }
    return { ...base, completedTabs: [...completed], masteredVocabularyIds: [...words] };
  }
  function emit() { if (!disposed) options.notify({ ...value(), ready, saving, error, storageError, pending: operations.length > 0 }); }
  function migrateLegacy() {
    const raw = storage.getItem(legacyKey);
    if (!raw) return;
    const patch = JSON.parse(raw);
    if (!validPatch(patch)) throw new Error('Invalid legacy pending edits');
    if (patch.completedTabs.length || patch.vocabulary.length) {
      const key = prefix + 'legacy';
      if (!storage.getItem(key)) storage.setItem(key, JSON.stringify({ id: 'legacy', order: 0, patch }));
    }
    // Runs under the same lock as sending/ACK. Crash before removal is safe:
    // migration detects the existing operation instead of appending a duplicate.
    storage.removeItem(legacyKey);
  }
  function persistVolatile() {
    for (const op of volatile.values()) {
      try { storage.setItem(prefix + op.id, JSON.stringify(op)); volatile.delete(op.id); }
      catch { storageError = true; }
    }
  }
  function sync(): Promise<void> {
    if (disposed) return Promise.resolve();
    if (running) return running;
    if (userId === null) {
      try { storage.getItem(`completed_tabs_mod_${moduleId}_user_guest`); storageError = false; }
      catch { storageError = true; }
      base = localDetails(storage, moduleId, 'guest'); ready = true; emit(); return Promise.resolve();
    }
    saving = true; error = false; emit();
    running = withLock(`study-progress:${moduleId}:${userId}`, async () => {
      if (disposed) return;
      storageError = false;
      try { migrateLegacy(); } catch { storageError = true; throw new Error('Cannot migrate pending edits'); }
      persistVolatile(); scan();
      const result = await options.read();
      if (disposed) return;
      base = { ...result, quizCompleted: base.quizCompleted || result.quizCompleted }; ready = true; emit();
      while (!disposed) {
        scan();
        const op = operations[0];
        if (!op) break;
        const result = await options.write(op.patch);
        // ACK even after unmount, while holding the lock. A new controller must
        // not replay this old edit after another tab has sent a newer edit.
        try { storage.removeItem(prefix + op.id); } catch { storageError = true; throw new Error('Cannot acknowledge edit'); }
        volatile.delete(op.id);
        base = { ...result, quizCompleted: base.quizCompleted || result.quizCompleted };
        scan(); emit();
      }
    }).catch(() => { error = true; }).finally(() => {
      saving = false; running = null; emit();
    });
    return running;
  }
  function change(patch: StudyPatch) {
    if (!ready || disposed) return;
    const clean = { completedTabs: patch.completedTabs.filter(t => studyTabs.includes(t)), vocabulary: patch.vocabulary };
    if (!validPatch(clean) || (!clean.completedTabs.length && !clean.vocabulary.length)) return;
    if (userId === null) {
      const words = new Set(base.masteredVocabularyIds);
      clean.vocabulary.forEach(w => w.mastered ? words.add(w.id) : words.delete(w.id));
      base = { ...base, completedTabs: [...new Set([...base.completedTabs, ...clean.completedTabs])], masteredVocabularyIds: [...words] };
      try {
        storage.setItem(`completed_tabs_mod_${moduleId}_user_guest`, JSON.stringify(base.completedTabs));
        storage.setItem(`study_mastered_vocab_${moduleId}_user_guest`, JSON.stringify(base.masteredVocabularyIds));
        storageError = false;
      } catch { storageError = true; }
      emit(); return;
    }
    try { scan(); } catch { error = true; emit(); return; }
    const op: Operation = { id: crypto.randomUUID(), order: Math.max(Date.now(), ...operations.map(o => o.order + 1)), patch: structuredClone(clean) };
    volatile.set(op.id, op); persistVolatile();
    try { scan(); } catch { error = true; emit(); return; }
    emit(); void sync();
  }
  return { start: sync, change, retry: sync, dispose: () => { disposed = true; },
    confirmQuiz: () => { base.quizCompleted = true; emit(); } };
}
