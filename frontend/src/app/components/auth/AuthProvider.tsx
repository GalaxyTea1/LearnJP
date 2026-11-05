import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Loader2, LogIn, LogOut, UserRound } from 'lucide-react';
import {
  ApiError,
  authApi,
  SESSION_CHANGED,
  readSessionValue,
  cacheSessionUser,
  STORAGE_UNAVAILABLE,
} from '../../services/api';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { EmailAuthForm, type EmailMode } from './EmailAuthForm';

// Page to return to after a full-page Google sign-in (see authApi.googleRedirect).
const GOOGLE_RETURN_KEY = 'learnjp-google-return';
type User = { id: number; email?: string; username: string; displayName?: string; role: string };
type AuthContextValue = {
  user: User | null;
  checking: boolean;
  openLogin: () => void;
};
const AuthContext = createContext<AuthContextValue | null>(null);
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider is required');
  return value;
}

function storedUser(): User | null {
  try {
    if (!readSessionValue('accessToken')) return null;
    const user = JSON.parse(readSessionValue('user') || 'null');
    return typeof user?.id === 'number' ? user : null;
  } catch {
    return null;
  }
}

function errorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.';
  if (error.message === STORAGE_UNAVAILABLE) return STORAGE_UNAVAILABLE;
  if (error.message === 'Existing account requires verified linking')
    return 'Không thể kết nối Google với tài khoản này. Vui lòng liên hệ hỗ trợ.';
  if (error.message === 'Current password is incorrect') return 'Mật khẩu hiện tại chưa đúng. Vui lòng thử lại.';
  if (error.message === 'Google email must match your account email')
    return 'Hãy chọn tài khoản Google có cùng email với tài khoản LearnJP hiện tại.';
  if (error.message === 'Account already linked or changed; restart linking')
    return 'Tài khoản đã được liên kết hoặc đã thay đổi. Vui lòng đóng rồi mở lại mục Tài khoản để kiểm tra.';
  if (error.message === 'Linking session changed')
    return 'Phiên đăng nhập đã thay đổi. Vui lòng đăng nhập lại trước khi liên kết Google.';
  if (error.message.startsWith('Google sign-in'))
    return 'Đăng nhập Google chưa hoàn tất hoặc đã hết thời gian. Vui lòng thử lại.';
  if (error.status === 429) return 'Bạn đã thử quá nhiều lần. Vui lòng chờ một lát rồi thử lại.';
  if (error.status === 401) return 'Email, tên đăng nhập hoặc mật khẩu không đúng, hoặc tài khoản không hoạt động.';
  if (error.message === 'Email is already registered')
    return 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.';
  if (error.message === 'Username is already taken') return 'Tên đăng nhập đã được sử dụng. Vui lòng chọn tên khác.';
  if (error.status === 400) return 'Thông tin chưa hợp lệ. Vui lòng kiểm tra lại các trường bên dưới.';
  return 'Máy chủ chưa thể xử lý yêu cầu. Vui lòng thử lại sau.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(storedUser);
  const [checking, setChecking] = useState(true);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<EmailMode>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const requestRunning = useRef(false);
  const googleAbort = useRef<AbortController | null>(null);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    authApi
      .googleConfig()
      .then(res => {
        if (active) setGoogleEnabled(res.data.enabled);
      })
      .catch(() => {});
    authApi
      .emailConfig()
      .then(res => {
        if (active) setEmailEnabled(res.data.enabled);
      })
      .catch(() => {});
    return () => {
      active = false;
      googleAbort.current?.abort();
    };
  }, []);

  const googleLogin = async () => {
    if (requestRunning.current) return;
    const popup = window.open('about:blank', 'learnjp-google', 'popup,width=500,height=680');
    if (!popup) {
      // Popups are blocked (common in Zalo/Messenger in-app browsers): sign in on this page instead.
      requestRunning.current = true;
      setBusy(true);
      setGoogleBusy(true);
      setError('');
      try {
        sessionStorage.setItem(
          GOOGLE_RETURN_KEY,
          window.location.pathname + window.location.search + window.location.hash,
        );
      } catch {
        /* Return to home instead. */
      }
      try {
        await authApi.googleRedirect();
      } catch (err) {
        setError(errorMessage(err));
        requestRunning.current = false;
        setBusy(false);
        setGoogleBusy(false);
      }
      return;
    }
    const controller = new AbortController();
    googleAbort.current = controller;
    const timeout = setTimeout(() => controller.abort(), 300000);
    requestRunning.current = true;
    setBusy(true);
    setGoogleBusy(true);
    setError('');
    try {
      await authApi.google(popup, controller.signal);
      setOpen(false);
      setNotice('Đăng nhập Google thành công. Bạn có thể tiếp tục học.');
    } catch (err) {
      setError(controller.signal.aborted ? 'Đã dừng đăng nhập Google. Bạn có thể thử lại.' : errorMessage(err));
    } finally {
      clearTimeout(timeout);
      popup.close();
      googleAbort.current = null;
      requestRunning.current = false;
      setBusy(false);
      setGoogleBusy(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search),
      result = params.get('google');
    if (result !== 'success' && result !== 'failed') return;
    let target = '/';
    try {
      target = sessionStorage.getItem(GOOGLE_RETURN_KEY) || '/';
      sessionStorage.removeItem(GOOGLE_RETURN_KEY);
    } catch {
      /* Stay on home. */
    }
    if (!target.startsWith('/') || target.startsWith('//')) target = '/';
    params.delete('google');
    window.history.replaceState(
      null,
      '',
      window.location.pathname + (params.size ? '?' + params : '') + window.location.hash,
    );
    if (result === 'failed') {
      setOpen(true);
      setError('Không thể xác thực Google. Vui lòng thử lại.');
      return;
    }
    requestRunning.current = true;
    setBusy(true);
    setGoogleBusy(true);
    authApi
      .googleResume()
      .then(() => {
        if (target !== '/') window.location.replace(target);
        else setNotice('Đăng nhập Google thành công. Bạn có thể tiếp tục học.');
      })
      .catch(err => {
        setOpen(true);
        setError(errorMessage(err));
      })
      .finally(() => {
        requestRunning.current = false;
        setBusy(false);
        setGoogleBusy(false);
      });
  }, []);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const sync = () => {
      revision++;
      setUser(storedUser());
      setChecking(false);
    };
    window.addEventListener(SESSION_CHANGED, sync);
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === 'user' || event.key === 'accessToken') sync();
    };
    window.addEventListener('storage', onStorage);
    if (readSessionValue('accessToken')) {
      const initialRevision = revision;
      authApi
        .getMe()
        .then(res => {
          if (active && revision === initialRevision) {
            setUser(cacheSessionUser(res.data) ? res.data : null);
          }
        })
        .catch(() => {
          if (active) setUser(storedUser());
        })
        .finally(() => {
          if (active) setChecking(false);
        });
    } else setChecking(false);
    return () => {
      active = false;
      window.removeEventListener(SESSION_CHANGED, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const openLogin = () => {
    setMode('login');
    setError('');
    setOpen(true);
  };

  return (
    <AuthContext.Provider value={{ user, checking, openLogin }}>
      {children}
      <div className="sr-only" role="status" aria-live="polite">
        {notice}
      </div>
      <Dialog
        open={open}
        onOpenChange={value => {
          if (!busy) setOpen(value);
        }}
      >
        <DialogContent
          className="flex flex-col gap-5 max-h-[90dvh] overflow-y-auto sm:max-w-md"
          onEscapeKeyDown={event => {
            if (busy) event.preventDefault();
          }}
        >
          <div className="flex flex-col gap-2 pr-6">
            <DialogTitle>
              {
                {
                  login: 'Chào mừng trở lại',
                  register: 'Tạo tài khoản',
                  confirm: 'Xác nhận email',
                  recover: 'Quên mật khẩu?',
                  reset: 'Đặt mật khẩu mới',
                }[mode]
              }
            </DialogTitle>
            <DialogDescription>
              {mode === 'recover' || mode === 'reset'
                ? 'Nhận mã qua email để đặt lại mật khẩu.'
                : mode === 'confirm'
                  ? 'Nhập mã xác nhận được gửi đến email của bạn.'
                  : 'Tiếp tục hành trình học tiếng Nhật của bạn.'}
            </DialogDescription>
          </div>
          {error && (
            <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}
          {googleEnabled && (mode === 'login' || mode === 'register') && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={googleLogin}
                className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold disabled:opacity-60 enabled:hover:bg-muted enabled:hover:border-foreground/40"
              >
                {googleBusy && <Loader2 size={16} className="animate-spin" />}Tiếp tục với Google
              </button>
              {googleBusy && (
                <>
                  <p role="status" className="text-sm text-muted-foreground">
                    Hoàn tất đăng nhập trong cửa sổ Google, rồi quay lại bài học này.
                  </p>
                  <button
                    type="button"
                    onClick={() => googleAbort.current?.abort()}
                    className="min-h-11 text-sm underline"
                  >
                    Hủy đăng nhập Google
                  </button>
                </>
              )}
            </div>
          )}
          {emailEnabled ? (
            <>
              {googleEnabled && (mode === 'login' || mode === 'register') && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  hoặc dùng email
                  <span className="h-px flex-1 bg-border" />
                </div>
              )}
              <EmailAuthForm
                disabled={googleBusy}
                onModeChange={value => {
                  setMode(value);
                  setError('');
                }}
                onBusyChange={value => {
                  requestRunning.current = value;
                  setBusy(value);
                }}
                onSuccess={() => {
                  setOpen(false);
                  setNotice('Đăng nhập thành công. Bạn có thể tiếp tục học.');
                }}
              />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Đăng nhập bằng email hiện chưa khả dụng.</p>
          )}
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  );
}

export function AccountButton() {
  const { user, checking, openLogin } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  return (
    <>
      <button
        disabled={checking}
        onClick={() => (user ? setOpen(true) : openLogin())}
        className="btn-outline min-h-11 gap-1.5 px-3 text-sm font-medium disabled:opacity-50"
      >
        {checking ? (
          <Loader2 size={16} className="animate-spin" />
        ) : user ? (
          <UserRound size={16} />
        ) : (
          <LogIn size={16} />
        )}
        {user ? 'Tài khoản' : 'Đăng nhập'}
      </button>
      <Dialog
        open={open}
        onOpenChange={value => {
          if (!busy) {
            setOpen(value);
            setMessage('');
            setEmailOpen(false);
          }
        }}
      >
        <DialogContent className="flex max-h-[90dvh] flex-col gap-4 overflow-y-auto sm:max-w-md">
          <DialogTitle>{emailOpen ? 'Đặt lại mật khẩu' : 'Tài khoản của bạn'}</DialogTitle>
          <DialogDescription className="break-words">
            {user?.email || 'Bạn đã đăng xuất trên thiết bị này.'}
          </DialogDescription>
          {message && (
            <p role="status" className="text-sm text-muted-foreground">
              {message}
            </p>
          )}
          {user?.email && (
            <>
              {emailOpen ? (
                <EmailAuthForm
                  initialMode="recover"
                  initialEmail={user.email}
                  onBusyChange={setBusy}
                  onSuccess={() => setOpen(false)}
                />
              ) : (
                <button
                  disabled={busy}
                  className="min-h-11 rounded-lg border border-border text-sm"
                  onClick={() => setEmailOpen(true)}
                >
                  Đặt lại mật khẩu qua email
                </button>
              )}
            </>
          )}
          {user && (
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await authApi.logout();
                  setOpen(false);
                  setEmailOpen(false);
                } catch {
                  setMessage('Không thể kết nối máy chủ để thu hồi phiên. Vui lòng thử lại.');
                } finally {
                  setBusy(false);
                }
              }}
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border text-sm"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}Đăng xuất
            </button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function GuestNotice() {
  const { user, checking, openLogin } = useAuth();
  if (user || checking) return null;
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm leading-relaxed">
        Đăng nhập để lưu tiến độ, nộp bài kiểm tra và học tiếp trên thiết bị khác.
      </p>
      <button onClick={openLogin} className="btn-accent min-h-11 shrink-0 px-4 text-sm font-medium">
        Đăng nhập
      </button>
    </div>
  );
}
