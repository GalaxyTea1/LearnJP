import { useSyncExternalStore } from 'react';
import type { Page } from '../data/basicData';

const navigationEvent = 'sumary:navigation';
const pages: Page[] = ['home', 'learning', 'translate', 'dictionary', 'writing', 'flashcards', 'games', 'admin'];
export const currentUrl = () => window.location.href;
export function subscribeNavigation(listener: () => void) {
  window.addEventListener(navigationEvent, listener);
  window.addEventListener('popstate', listener);
  window.addEventListener('hashchange', listener);
  return () => {
    window.removeEventListener(navigationEvent, listener);
    window.removeEventListener('popstate', listener);
    window.removeEventListener('hashchange', listener);
  };
}
export function useBrowserUrl() {
  return useSyncExternalStore(subscribeNavigation, currentUrl, currentUrl);
}
export function pageFromUrl(href: string): Page {
  const url = new URL(href);
  const path = url.pathname.slice(1).split('/')[0] as Page;
  if (pages.includes(path)) return path;
  const hash = url.hash.slice(1).split('?')[0] as Page;
  return pages.includes(hash) ? hash : 'home';
}
export function moduleFromUrl(href: string): number | null {
  if (pageFromUrl(href) !== 'learning') return null;
  const value = new URL(href).searchParams.get('moduleId');
  if (!value || !/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}
export function navigateUrl(target: string, replace = false) {
  const next = new URL(target, currentUrl());
  if (next.href === currentUrl()) return;
  window.history[replace ? 'replaceState' : 'pushState'](null, '', next.href);
  window.dispatchEvent(new Event(navigationEvent));
}
export function openStudyModule(id: number) {
  navigateUrl(`/learning?moduleId=${id}`);
}
