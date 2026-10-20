// Refresh credentials are HttpOnly cookies. Access tokens are shared between
// tabs; a session revision prevents old requests from changing a new identity.
const BASE_URL = `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/v1`;
export interface ApiResponse<T = any> { success: boolean; message: string; data: T; meta?: any; }
export const SESSION_CHANGED = 'nihongo-session-changed';
const SESSION_REVISION = 'nihongo-session-revision';
export const STORAGE_UNAVAILABLE = 'Trình duyệt đang chặn hoặc hết dung lượng lưu trữ. Hãy cho phép lưu dữ liệu trang web rồi tải lại để đăng nhập. Bạn vẫn có thể học thử.';
export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
let storageFailed = false;
let localRevision = 0;
function notifySession() { if (typeof window !== 'undefined') window.dispatchEvent(new Event(SESSION_CHANGED)); }
function storageFailure() {
  if (!storageFailed) { storageFailed = true; localRevision++; notifySession(); }
}
export function readSessionValue(key: string): string | null {
  if (storageFailed) return null;
  try { return localStorage.getItem(key); }
  catch { storageFailure(); return null; }
}
export function cacheSessionUser(user: unknown) {
  if (storageFailed) return false;
  try { localStorage.setItem('user', JSON.stringify(user)); return true; }
  catch { storageFailure(); return false; }
}
function revision() { const saved = readSessionValue(SESSION_REVISION); return `${localRevision}:${saved ?? ''}`; }
function requireSessionStorage() {
  if (storageFailed) throw new ApiError(STORAGE_UNAVAILABLE, 503);
  try {
    const key = `nihongo-storage-check-${crypto.randomUUID()}`;
    localStorage.setItem(key, '1');
    if (localStorage.getItem(key) !== '1') throw new Error('Storage write failed');
    localStorage.removeItem(key);
  } catch { storageFailure(); throw new ApiError(STORAGE_UNAVAILABLE, 503); }
}
function clearSession() {
  localRevision++;
  try { localStorage.setItem(SESSION_REVISION, crypto.randomUUID()); } catch { storageFailure(); }
  for (const key of ['accessToken', 'refreshToken', 'user']) {
    try { localStorage.removeItem(key); } catch { storageFailure(); }
  }
  notifySession();
}
function assertSession(expected: string) {
  if (revision() !== expected) throw new ApiError('Session changed; request cancelled', 409);
}
async function withAuthLock<T>(work: () => Promise<T>): Promise<T> {
  if (!globalThis.navigator?.locks) {
    return Promise.reject(new ApiError('Authentication requires a current browser and HTTPS (or localhost)', 503));
  }
  return await navigator.locks.request('sumaryjp-auth', { mode: 'exclusive' }, work);
}

// A deployment using cookies requires signing in again once. Remove credentials
// written by older builds without ever sending the old refresh token in JSON.
if (readSessionValue('refreshToken')) clearSession();

async function refreshTokens(expiredToken: string, expected: string, signal?: AbortSignal | null): Promise<void> {
  await withAuthLock(async () => {
    signal?.throwIfAborted();
    assertSession(expected);
    requireSessionStorage();
    if (readSessionValue('accessToken') !== expiredToken) return; // Another tab refreshed.
    try {
      const res = await apiFetch<{ accessToken: string }>('/auth/refresh', {
        method: 'POST', body: '{}', signal: signal ?? AbortSignal.timeout(15000),
      }, false);
      assertSession(expected);
      try { localStorage.setItem('accessToken', res.data.accessToken); }
      catch { storageFailure(); throw new ApiError(STORAGE_UNAVAILABLE, 503); }
    } catch (error) {
      // Network errors, 429 and server errors must not erase a valid session.
      if (error instanceof ApiError && error.status === 401 && revision() === expected) clearSession();
      throw error;
    }
  });
}

async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}, allowRefresh = true): Promise<ApiResponse<T>> {
  options.signal?.throwIfAborted();
  const expected = revision();
  const token = readSessionValue('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json', 'X-Requested-With': 'SumaryJP',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, signal: options.signal ?? AbortSignal.timeout(15000), headers, credentials: 'include' });
  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: false, message: `Invalid server response (${response.status})`, data: undefined as T,
  }));
  assertSession(expected);
  if (!response.ok || !data.success) {
    if (response.status === 401 && allowRefresh && token) {
      await refreshTokens(token, expected, options.signal);
      assertSession(expected);
      return apiFetch<T>(endpoint, options, false);
    }
    throw new ApiError(data.message || `HTTP error! status: ${response.status}`, response.status);
  }
  return data;
}

// Bound the whole operation, including waiting for a cross-tab auth refresh.
async function timedApiFetch<T = any>(endpoint: string, options: RequestInit = {}) {
  const signal = AbortSignal.timeout(15000);
  let onAbort: () => void = () => {};
  const timeout = new Promise<never>((_, reject) => {
    onAbort = () => reject(signal.reason);
    signal.addEventListener('abort', onAbort, { once: true });
  });
  try { return await Promise.race([apiFetch<T>(endpoint, { ...options, signal }), timeout]); }
  finally { signal.removeEventListener('abort', onAbort); }
}

async function establishSession(endpoint: string, payload: unknown) {
  const expected = revision();
  return withAuthLock(async () => {
    assertSession(expected);
    requireSessionStorage();
    const res = await apiFetch<{ user: any; accessToken: string }>(endpoint, {
      method: 'POST', signal: AbortSignal.timeout(15000), body: JSON.stringify(payload),
    }, false);
    assertSession(expected);
    try {
      localStorage.setItem(SESSION_REVISION, crypto.randomUUID());
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.removeItem('refreshToken');
    } catch {
      storageFailure(); clearSession();
      // A cookie may already have arrived. Revoke it under the same auth lock.
      try { await apiFetch('/auth/logout', { method: 'POST', body: '{}', signal: AbortSignal.timeout(15000) }, false); } catch { /* Local identity remains blocked. */ }
      throw new ApiError(STORAGE_UNAVAILABLE, 503);
    }
    notifySession();
    return res.data;
  });
}
export const authApi = {
  login(login: string, password: string) { return establishSession('/auth/login', { login, password }); },
  register(payload: { email: string; username: string; password: string; displayName?: string }) {
    return establishSession('/auth/register', payload);
  },
  async logout() {
    // Invalidate immediately, then wait for in-flight Set-Cookie responses before
    // revoking the resulting cookie. No stale response can restore local tokens.
    clearSession();
    return withAuthLock(async () => {
      await apiFetch('/auth/logout', { method: 'POST', body: '{}', signal: AbortSignal.timeout(15000) }, false);
    });
  },
  getMe() { return apiFetch('/auth/me', { signal: AbortSignal.timeout(15000) }); },
};

// ─── 2. Content API ──────────────────────────────────────────────────────────

export const contentApi = {
  // Public catalog must not depend on stored credentials or token refresh.
  async getPublicModules() {
    const response = await fetch(`${BASE_URL}/modules`, {
      credentials: 'omit', signal: AbortSignal.timeout(15000),
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.success || !Array.isArray(data.data)) {
      throw new ApiError('Không tải được danh sách bài học', response.status);
    }
    return data as ApiResponse;
  },
  async getLevels() {
    return apiFetch('/levels');
  },

  async getLevelByCode(levelCode: string) {
    return apiFetch(`/levels/${levelCode}`);
  },

  async getModules(levelCode?: string) {
    const query = levelCode ? `?level=${encodeURIComponent(levelCode)}` : '';
    return apiFetch(`/modules${query}`);
  },

  async getModuleById(id: number) {
    return apiFetch(`/modules/${id}`);
  },

  async getModuleFullContent(id: number) {
    return timedApiFetch(`/modules/${id}/full`);
  },

  async getVocabulary(params: { level?: string; moduleId?: number; q?: string; page?: number; limit?: number } = {}) {
    const searchParams = new URLSearchParams();
    if (params.level) searchParams.append('level', params.level);
    if (params.moduleId) searchParams.append('moduleId', String(params.moduleId));
    if (params.q) searchParams.append('q', params.q);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));
    return apiFetch(`/vocabulary?${searchParams.toString()}`);
  },

  async getKanji(params: { level?: string; moduleId?: number; q?: string; page?: number; limit?: number } = {}) {
    const searchParams = new URLSearchParams();
    if (params.level) searchParams.append('level', params.level);
    if (params.moduleId) searchParams.append('moduleId', String(params.moduleId));
    if (params.q) searchParams.append('q', params.q);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));
    return apiFetch(`/kanji?${searchParams.toString()}`);
  },

  async getGrammar(params: { level?: string; moduleId?: number; q?: string; page?: number; limit?: number } = {}) {
    const searchParams = new URLSearchParams();
    if (params.level) searchParams.append('level', params.level);
    if (params.moduleId) searchParams.append('moduleId', String(params.moduleId));
    if (params.q) searchParams.append('q', params.q);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));
    return apiFetch(`/grammar?${searchParams.toString()}`);
  },
};

// ─── 3. Dictionary API ───────────────────────────────────────────────────────

export const dictionaryApi = {
  async searchRemote(query: string, signal: AbortSignal) {
    return apiFetch<Array<{ jp: string; rom: string; en: string; type: string; level: string; example: string; exampleEn: string }>>(
      `/dictionary/jisho?q=${encodeURIComponent(query)}`, { signal },
    );
  },
  async search(query: string, limit = 20) {
    return apiFetch(`/dictionary/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  },
};

// ─── 4. Quiz & Progress API ──────────────────────────────────────────────────

export const progressApi = {
  async getStudyProgress(moduleId: number) {
    return apiFetch<{ completedTabs: string[]; masteredVocabularyIds: number[]; quizCompleted: boolean }>(`/progress/module/${moduleId}/study`, { signal: AbortSignal.timeout(15000) });
  },
  async saveStudyProgress(moduleId: number, patch: { completedTabs: string[]; vocabulary: { id: number; mastered: boolean }[] }) {
    return apiFetch<{ completedTabs: string[]; masteredVocabularyIds: number[]; quizCompleted: boolean }>(`/progress/module/${moduleId}/study`, {
      method: 'PATCH', body: JSON.stringify(patch), signal: AbortSignal.timeout(15000),
    });
  },
  async getMyProgress() {
    return apiFetch('/progress/me', { signal: AbortSignal.timeout(15000) });
  },

  async getReviewItems(limit: number = 20) {
    return apiFetch(`/progress/review-items?limit=${limit}`);
  },

  async updateModuleProgress(moduleId: number, status?: string, progressPercent?: number) {
    return apiFetch('/progress/module', {
      method: 'POST',
      body: JSON.stringify({ moduleId, status, progressPercent }),
    });
  },

  async getQuizQuestions(moduleId: number) {
    return timedApiFetch(`/quizzes/module/${moduleId}`);
  },

  async submitQuizAttempt(moduleId: number, answers: Array<{ questionId: number; selectedIndex: number }>, timeTaken?: number, quizRevision?: string, requestId?: string) {
    return timedApiFetch('/quizzes/submit', {
      method: 'POST',
      body: JSON.stringify({ moduleId, answers, timeTaken, quizRevision, requestId }),
    });
  },
};

// ─── 5. Gamification & User Dashboard API ────────────────────────────────────

export const userApi = {
  async getDashboard() {
    return apiFetch('/users/dashboard');
  },

  async getSettings() {
    return apiFetch('/users/settings');
  },

  async updateSettings(settings: any) {
    return apiFetch('/users/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  async getLeaderboard(limit = 10) {
    return apiFetch(`/gamification/leaderboard?limit=${limit}`);
  },

  async recordDailyCheckIn() {
    return apiFetch('/gamification/checkin', { method: 'POST' });
  },
};

// ─── 6. Admin Content API ────────────────────────────────────────────────────

export const adminApi = {
  /** Lấy danh sách module (cần ADMIN/MODERATOR, xem cả bản nháp) */
  async getModules() {
    return apiFetch('/modules?preview=true');
  },

  /** Lấy thông tin chi tiết module */
  async getModuleById(id: number) {
    return apiFetch(`/modules/${id}?preview=true`);
  },

  /** Lấy nội dung đầy đủ module (sections, vocab, kanji, grammar, quiz) */
  async getModuleFullContent(id: number) {
    return apiFetch(`/modules/${id}/full?preview=true`);
  },

  /** Lấy quiz questions của module */
  async getQuizByModule(moduleId: number) {
    return apiFetch(`/quizzes/module/${moduleId}?preview=true`);
  },

  /** Cập nhật module (admin only - cần token) */
  async updateModule(id: number, data: Record<string, any>) {
    return apiFetch(`/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
