import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Loader2, LogIn, LogOut, UserRound } from 'lucide-react';
import { ApiError, authApi, SESSION_CHANGED, readSessionValue, cacheSessionUser, STORAGE_UNAVAILABLE } from '../../services/api';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';

type User = { id: number; username: string; displayName?: string; role: string };
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
  } catch { return null; }
}

function errorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.';
  if (error.message === STORAGE_UNAVAILABLE) return STORAGE_UNAVAILABLE;
  if (error.status === 429) return 'Bạn đã thử quá nhiều lần. Vui lòng chờ một lát rồi thử lại.';
  if (error.status === 401) return 'Email, tên đăng nhập hoặc mật khẩu không đúng, hoặc tài khoản không hoạt động.';
  if (error.message === 'Email is already registered') return 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.';
  if (error.message === 'Username is already taken') return 'Tên đăng nhập đã được sử dụng. Vui lòng chọn tên khác.';
  if (error.status === 400) return 'Thông tin chưa hợp lệ. Vui lòng kiểm tra lại các trường bên dưới.';
  return 'Máy chủ chưa thể xử lý yêu cầu. Vui lòng thử lại sau.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(storedUser);
  const [checking, setChecking] = useState(true);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const requestRunning = useRef(false);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const sync = () => { revision++; setUser(storedUser()); setChecking(false); };
    window.addEventListener(SESSION_CHANGED, sync);
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === 'user' || event.key === 'accessToken') sync();
    };
    window.addEventListener('storage', onStorage);
    if (readSessionValue('accessToken')) {
      const initialRevision = revision;
      authApi.getMe().then(res => {
        if (active && revision === initialRevision) {
          setUser(cacheSessionUser(res.data) ? res.data : null);
        }
      }).catch(() => {
        if (active) setUser(storedUser());
      }).finally(() => { if (active) setChecking(false); });
    } else setChecking(false);
    return () => {
      active = false;
      window.removeEventListener(SESSION_CHANGED, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const openLogin = () => { setMode('login'); setError(''); setShowPassword(false); setOpen(true); };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requestRunning.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const password = String(fields.get('password') || '');
    setError('');
    if (new TextEncoder().encode(password).length > 72) {
      setError('Mật khẩu quá dài (tối đa 72 byte UTF-8; chữ có dấu có thể dùng nhiều byte).');
      return;
    }
    if (mode === 'register' && password !== fields.get('confirmPassword')) {
      setError('Mật khẩu nhập lại chưa khớp.');
      return;
    }
    requestRunning.current = true;
    setBusy(true);
    try {
      if (mode === 'register') {
        await authApi.register({
          email: String(fields.get('email')).trim(),
          username: String(fields.get('username')).trim(),
          password,
        });
      } else await authApi.login(String(fields.get('login')).trim(), password);
      form.reset();
      setOpen(false);
      setNotice(mode === 'register' ? 'Tạo tài khoản thành công. Bạn có thể tiếp tục học.' : 'Đăng nhập thành công. Bạn có thể tiếp tục học.');
    } catch (err) { setError(errorMessage(err)); }
    finally { requestRunning.current = false; setBusy(false); }
  };

  return <AuthContext.Provider value={{ user, checking, openLogin }}>
    {children}
    <div className="sr-only" role="status" aria-live="polite">{notice}</div>
    <Dialog open={open} onOpenChange={value => { if (!busy) setOpen(value); }}>
      <DialogContent className="flex flex-col gap-5 max-h-[90dvh] overflow-y-auto sm:max-w-md" onEscapeKeyDown={event => { if (busy) event.preventDefault(); }}>
        <div className="flex flex-col gap-2 pr-6">
          <DialogTitle>{mode === 'login' ? 'Đăng nhập để tiếp tục học' : 'Tạo tài khoản học viên'}</DialogTitle>
          <DialogDescription>Lưu tiến độ và kết quả bài kiểm tra vào tài khoản của bạn.</DialogDescription>
        </div>
        <div className="flex rounded-lg bg-muted p-1" aria-label="Chọn đăng nhập hoặc đăng ký">
          {(['login', 'register'] as const).map(value => <button key={value} type="button" disabled={busy} aria-pressed={mode === value}
            onClick={() => { setMode(value); setError(''); setShowPassword(false); }}
            className={`flex-1 min-h-11 rounded-md text-sm font-medium ${mode === value ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
            {value === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>)}
        </div>
        {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <form key={mode} onSubmit={submit} className="flex flex-col gap-4">
          <fieldset disabled={busy} className="flex min-w-0 flex-col gap-4">
            {mode === 'register' ? <>
              <label className="flex flex-col gap-1.5 text-sm font-medium">Email
                <input name="email" type="email" autoComplete="email" maxLength={254} required className="min-h-11 rounded-lg border border-border bg-background px-3 text-base" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">Tên đăng nhập
                <input name="username" autoComplete="username" minLength={3} maxLength={30} pattern="[a-zA-Z0-9_]+" aria-describedby="username-hint" required className="min-h-11 rounded-lg border border-border bg-background px-3 text-base" />
                <span id="username-hint" className="text-xs font-normal text-muted-foreground">3–30 ký tự: chữ không dấu, số hoặc dấu gạch dưới.</span>
              </label>
            </> : <label className="flex flex-col gap-1.5 text-sm font-medium">Email hoặc tên đăng nhập
              <input name="login" autoComplete="username" maxLength={254} required className="min-h-11 rounded-lg border border-border bg-background px-3 text-base" />
            </label>}
            <label className="flex flex-col gap-1.5 text-sm font-medium">Mật khẩu
              <input name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 8 : 1} maxLength={72} required className="min-h-11 rounded-lg border border-border bg-background px-3 text-base" />
              {mode === 'register' && <span className="text-xs font-normal text-muted-foreground">Ít nhất 8 ký tự, tối đa 72 byte UTF-8.</span>}
            </label>
            {mode === 'register' && <label className="flex flex-col gap-1.5 text-sm font-medium">Nhập lại mật khẩu
              <input name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} maxLength={72} required className="min-h-11 rounded-lg border border-border bg-background px-3 text-base" />
            </label>}
            <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} />Hiện mật khẩu</label>
            <button type="submit" className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-60">
              {busy && <Loader2 size={16} className="animate-spin" />}{busy ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          </fieldset>
          <p className="text-xs leading-relaxed text-muted-foreground">Bạn vẫn có thể đóng cửa sổ để học thử. Tiến độ học thử chỉ lưu trên trình duyệt này và chưa được chuyển vào tài khoản.</p>
        </form>
      </DialogContent>
    </Dialog>
  </AuthContext.Provider>;
}

export function AccountButton() {
  const { user, checking, openLogin } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  return <>
    <button disabled={checking} onClick={() => user ? setOpen(true) : openLogin()} className="flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium disabled:opacity-50">
      {checking ? <Loader2 size={16} className="animate-spin" /> : user ? <UserRound size={16} /> : <LogIn size={16} />}
      {user ? 'Tài khoản' : 'Đăng nhập'}
    </button>
    <Dialog open={open} onOpenChange={value => { if (!busy) { setOpen(value); setMessage(''); } }}>
      <DialogContent className="flex flex-col gap-4 sm:max-w-md">
        <DialogTitle>Tài khoản học viên</DialogTitle>
        <DialogDescription className="break-words">{user ? `Đang đăng nhập: ${user.displayName || user.username}` : 'Bạn đã đăng xuất trên thiết bị này.'}</DialogDescription>
        {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
        {user && <button disabled={busy} onClick={async () => {
          setBusy(true);
          try { await authApi.logout(); setOpen(false); }
          catch { setMessage('Đã đăng xuất trên trình duyệt này. Không thể kết nối máy chủ để thu hồi phiên; vui lòng thử lại khi có mạng.'); }
          finally { setBusy(false); }
        }} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border text-sm">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}Đăng xuất
        </button>}
      </DialogContent>
    </Dialog>
  </>;
}

export function GuestNotice() {
  const { user, checking, openLogin } = useAuth();
  if (user || checking) return null;
  return <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm leading-relaxed"><strong>Bạn đang học thử.</strong> Tiến độ chỉ lưu trên trình duyệt này. Đăng nhập để lưu vào tài khoản và nộp bài kiểm tra. Tiến độ học thử chưa được chuyển vào tài khoản.</p>
    <button onClick={openLogin} className="min-h-11 shrink-0 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground">Đăng nhập / Đăng ký</button>
  </div>;
}
