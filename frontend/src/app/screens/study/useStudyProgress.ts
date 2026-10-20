import { useEffect, useRef, useState } from 'react';
import { progressApi } from '../../services/api';
import { browserStorage } from '../../services/browserStorage';
import { createStudySync, emptyDetails, localDetails, type SyncView } from './studyProgressSync';

export function useStudyProgress(moduleId: number, userId: number | null, checking: boolean) {
  const scope = `${moduleId}:${userId}:${checking}`;
  const blank: SyncView = { ...emptyDetails(), ready: false, saving: false, error: false, storageError: false, pending: false };
  const [state, setState] = useState({ scope: '', view: blank });
  const sync = useRef<{ scope: string; controller: ReturnType<typeof createStudySync> } | null>(null);
  useEffect(() => {
    if (checking) return;
    const controller = createStudySync({ moduleId, userId, storage: browserStorage,
      read: async () => (await progressApi.getStudyProgress(moduleId)).data,
      write: async patch => {
        const response = await progressApi.saveStudyProgress(moduleId, patch);
        window.dispatchEvent(new Event('study-progress-saved'));
        return response.data;
      },
      notify: view => setState({ scope, view }),
    });
    sync.current = { scope, controller }; void controller.start();
    const refresh = () => { if (userId !== null) void controller.retry(); };
    const onStorage = (event: StorageEvent) => {
      if (event.key?.startsWith(`study_ops_v2_${moduleId}_user_${userId}_`)) refresh();
    };
    window.addEventListener('online', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      controller.dispose(); sync.current = null;
      window.removeEventListener('online', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, [scope]);
  const current = () => sync.current?.scope === scope ? sync.current.controller : null;
  return { ...(state.scope === scope ? state.view : blank),
    complete: (tab: string) => current()?.change({ completedTabs: [tab], vocabulary: [] }),
    word: (id: number, mastered: boolean) => current()?.change({ completedTabs: [], vocabulary: [{ id, mastered }] }),
    retry: () => current()?.retry(), confirmQuiz: () => current()?.confirmQuiz(),
    importLocal: (validIds: number[]) => {
      const own = localDetails(browserStorage, moduleId, String(userId));
      const guest = localDetails(browserStorage, moduleId, 'guest');
      current()?.change({ completedTabs: [...new Set([...own.completedTabs, ...guest.completedTabs])],
        vocabulary: [...new Set([...own.masteredVocabularyIds, ...guest.masteredVocabularyIds])].filter(id => validIds.includes(id)).map(id => ({ id, mastered: true })) });
    },
  };
}
