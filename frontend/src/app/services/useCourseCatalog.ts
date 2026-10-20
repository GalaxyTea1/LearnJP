import { useEffect, useState } from 'react';
import { contentApi, progressApi } from './api';
import { mergeCatalogProgress, type CatalogProgress, type CourseModule } from './courseSummary';

export function useCourseCatalog(userId: number | string | undefined, checking: boolean, refreshKey?: number | null) {
  const scope = `${userId ?? 'guest'}:${checking}`;
  const [attempt, setAttempt] = useState(0);
  const [progressAttempt, setProgressAttempt] = useState(0);
  const [content, setContent] = useState({ modules: [] as CourseModule[], loading: true, error: false });
  const [progress, setProgress] = useState({ scope: '', data: null as CatalogProgress[] | null, loading: true, error: false });
  useEffect(() => {
    let active = true;
    let request = 0;
    const refresh = async () => {
      const id = ++request;
      setContent({ modules: [], loading: true, error: false });
      try {
        const res = await contentApi.getPublicModules();
        if (active && id === request) setContent({ modules: res.data, loading: false, error: false });
      } catch {
        if (active && id === request) setContent({ modules: [], loading: false, error: true });
      }
    };
    void refresh();
    window.addEventListener('focus', refresh);
    return () => { active = false; window.removeEventListener('focus', refresh); };
  }, [attempt, refreshKey]);
  useEffect(() => {
    if (checking || userId === undefined) return;
    let active = true;
    let request = 0;
    const refresh = async () => {
      const id = ++request;
      setProgress({ scope, data: null, loading: true, error: false });
      try {
        const res = await progressApi.getMyProgress();
        if (!res.success || !Array.isArray(res.data?.allModuleProgress)) throw new Error('Invalid progress');
        if (active && id === request) setProgress({ scope, data: res.data.allModuleProgress, loading: false, error: false });
      } catch {
        if (active && id === request) setProgress({ scope, data: null, loading: false, error: true });
      }
    };
    void refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('study-progress-saved', refresh);
    return () => {
      active = false;
      window.removeEventListener('focus', refresh);
      window.removeEventListener('study-progress-saved', refresh);
    };
  }, [scope, userId, checking, progressAttempt, refreshKey]);
  const guest = !checking && userId === undefined;
  const current = progress.scope === scope ? progress : { data: null, loading: true, error: false };
  return {
    ...content, modules: mergeCatalogProgress(content.modules, current.data, guest),
    progressLoading: !guest && (checking || current.loading), progressError: !guest && current.error,
    retry: () => setAttempt(n => n + 1), retryProgress: () => setProgressAttempt(n => n + 1),
  };
}
