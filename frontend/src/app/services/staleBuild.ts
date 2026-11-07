import { lazy, type ComponentType } from 'react';

const RELOAD_KEY = 'learnjp-chunk-reload';

// After a deploy, a tab opened earlier still asks for the previous build's chunks, which no
// longer exist. Reload once to pick up the new build. The timestamp stops a reload loop when
// a chunk is genuinely unavailable; the error boundary then shows its reload button instead.
function reloadForNewBuild(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < 30_000) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

// React.lazy for route screens that reloads instead of failing when the chunk is gone.
export function lazyScreen<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(() =>
    load().catch(error => {
      // Keep the Suspense fallback on screen while the page reloads.
      if (reloadForNewBuild()) return new Promise<never>(() => {});
      throw error;
    }),
  );
}
