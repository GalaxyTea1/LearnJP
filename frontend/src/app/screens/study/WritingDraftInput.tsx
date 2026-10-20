import { useEffect, useRef, useState } from 'react';
import { createWritingDraftStore, writingDraftKey, type WritingDraft } from './writingDraft';

const drafts = createWritingDraftStore(() => window.localStorage);
let guardInstalled = false;
function installUnloadGuard() {
  if (guardInstalled) return;
  guardInstalled = true;
  // Keep this guard for the page lifetime, including after leaving the exercise
  // tab: failed writes remain in the shared in-memory store until retried.
  window.addEventListener('pagehide', () => { drafts.retryPending(); });
  window.addEventListener('beforeunload', event => {
    if (!drafts.retryPending()) { event.preventDefault(); event.returnValue = ''; }
  });
}

interface Props {
  moduleId: number;
  taskId: number;
  userId?: number;
  checking: boolean;
  prompt: string;
}

export function WritingDraftInput({ moduleId, taskId, userId, checking, prompt }: Props) {
  const key = writingDraftKey(moduleId, taskId, userId);
  const [state, setState] = useState<{ key: string; draft: WritingDraft } | null>(null);
  const currentKey = useRef(key);
  currentKey.current = key;
  useEffect(() => {
    installUnloadGuard();
    if (!checking) setState({ key, draft: drafts.read(key) });
  }, [key, checking]);

  const ready = !checking && state?.key === key;
  const draft = ready ? state.draft : null;
  const update = (text: string) => {
    if (!ready || currentKey.current !== key) return;
    // Save synchronously with input. There is no debounce/unmount window that
    // can discard the last characters, and Japanese IME text is not transformed.
    setState({ key, draft: drafts.save(key, text) });
  };
  const id = `writing-${moduleId}-${taskId}`;
  const warning = draft?.status === 'unsaved' || draft?.status === 'unavailable' || draft?.status === 'invalid';
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">Bài viết của bạn<span className="sr-only">: {prompt}</span></label>
      <textarea
        id={id}
        rows={4}
        value={draft?.text ?? ''}
        disabled={!ready}
        onChange={event => update(event.target.value)}
        aria-describedby={`${id}-status`}
        placeholder="Gõ bài viết hoặc tự luyện tập viết tay ra giấy..."
        className="w-full p-3 bg-background border border-border rounded-xl text-sm focus:outline-hidden focus:border-accent transition-colors disabled:opacity-50"
      />
      <p id={`${id}-status`} role="status" className={`text-xs leading-relaxed ${warning ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground'}`}>
        {!draft ? 'Đang mở bản nháp…'
          : draft.status === 'unsaved' ? 'Chưa lưu được vào trình duyệt. Bản nháp vẫn còn khi đổi phần học trong trang này; đừng tải lại hoặc đóng trang. Hãy sao chép bài viết để giữ lại.'
          : draft.status === 'unavailable' ? 'Không đọc được bộ nhớ trình duyệt. Bạn vẫn có thể viết; nếu không lưu được, hãy sao chép bài trước khi tải lại hoặc đóng trang.'
          : draft.status === 'invalid' ? 'Bản lưu cũ không hợp lệ nên chưa khôi phục được. Khi bạn nhập nội dung mới, bản lưu cũ sẽ được thay thế.'
          : draft.status === 'saved' ? 'Đã lưu bản nháp trên trình duyệt này.'
          : 'Bản nháp tự lưu khi bạn nhập.'}
      </p>
      {draft?.status === 'unsaved' && (
        <button type="button" onClick={() => update(draft.text)} className="self-start text-xs text-accent hover:underline">Thử lưu lại</button>
      )}
    </div>
  );
}
