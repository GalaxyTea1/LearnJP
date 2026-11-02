import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import ErrorBoundary from './app/components/ErrorBoundary';
import './styles/index.css';

// After a deploy, an open tab may request lazy chunks that no longer exist.
// Reload once to pick up the new build; the session flag prevents a reload loop.
window.addEventListener('vite:preloadError', event => {
  try {
    if (sessionStorage.getItem('learnjp-chunk-reload')) return;
    sessionStorage.setItem('learnjp-chunk-reload', '1');
  } catch {
    return;
  }
  event.preventDefault();
  window.location.reload();
});
window.addEventListener('load', () => {
  try {
    setTimeout(() => sessionStorage.removeItem('learnjp-chunk-reload'), 10000);
  } catch {
    /* storage blocked */
  }
});

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
