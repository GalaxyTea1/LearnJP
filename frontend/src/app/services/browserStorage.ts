// Resolve localStorage inside each operation. Accessing the property itself can
// throw SecurityError; callers already handle operation failures and show a notice.
export const browserStorage: Storage = {
  get length() { return globalThis.localStorage.length; },
  key(index) { return globalThis.localStorage.key(index); },
  getItem(key) { return globalThis.localStorage.getItem(key); },
  setItem(key, value) { globalThis.localStorage.setItem(key, value); },
  removeItem(key) { globalThis.localStorage.removeItem(key); },
  clear() { globalThis.localStorage.clear(); },
};
