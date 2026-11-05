import { useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { ApiError, authApi } from '../../services/api';

export type EmailMode = 'login' | 'register' | 'confirm' | 'recover' | 'reset';
const labels: Record<EmailMode, string> = {
  login: 'Đăng nhập',
  register: 'Tạo tài khoản',
  confirm: 'Xác nhận email',
  recover: 'Gửi mã khôi phục',
  reset: 'Lưu mật khẩu mới',
};
function message(error: unknown) {
  if (!(error instanceof ApiError)) return 'Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.';
  if (error.message === 'Email confirmation required')
    return 'Email chưa được xác nhận. Hãy nhập mã hoặc yêu cầu gửi lại mã.';
  if (error.message === 'Existing account requires verified linking')
    return 'Không thể sử dụng email với tài khoản này. Vui lòng liên hệ hỗ trợ.';
  if (error.message === 'Choose a different strong password')
    return 'Hãy chọn mật khẩu mạnh hơn và khác mật khẩu đang dùng.';
  if (error.status === 429) return 'Bạn đã thử quá nhiều lần. Vui lòng chờ rồi thử lại.';
  if (error.status === 401) return 'Email, mật khẩu hoặc mã xác nhận chưa đúng, hết hạn hoặc đã được sử dụng.';
  if (error.status === 400) return 'Kiểm tra lại email, mã và mật khẩu. Mật khẩu cần ít nhất 8 ký tự.';
  return 'Chưa thể xử lý yêu cầu. Vui lòng thử lại sau.';
}
export function EmailAuthForm({
  onSuccess,
  onBusyChange,
  onModeChange,
  disabled = false,
  initialMode = 'login',
  initialEmail = '',
}: {
  onSuccess: () => void;
  onBusyChange: (busy: boolean) => void;
  onModeChange?: (mode: EmailMode) => void;
  disabled?: boolean;
  initialMode?: EmailMode;
  initialEmail?: string;
}) {
  const [mode, setMode] = useState<EmailMode>(initialMode);
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const running = useRef(false);
  const locked = busy || disabled;
  const inputClass =
    'min-h-11 w-full rounded-lg border border-border bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
  const move = (value: EmailMode) => {
    setMode(value);
    onModeChange?.(value);
    setShowPassword(false);
  };
  const change = (value: EmailMode) => {
    move(value);
    setError('');
    setNotice('');
  };
  async function run(work: () => Promise<void>) {
    if (running.current || disabled) return;
    running.current = true;
    setBusy(true);
    onBusyChange(true);
    setError('');
    setNotice('');
    try {
      await work();
    } catch (err) {
      setError(message(err));
      if (err instanceof ApiError && err.message === 'Email confirmation required') move('confirm');
    } finally {
      running.current = false;
      setBusy(false);
      onBusyChange(false);
    }
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget,
      fields = new FormData(form);
    const password = String(fields.get('password') || ''),
      code = String(fields.get('code') || '').trim();
    void run(async () => {
      if ((mode === 'register' || mode === 'reset') && password !== fields.get('confirmation')) {
        setError('Mật khẩu nhập lại chưa khớp.');
        return;
      }
      if (new TextEncoder().encode(password).length > 72) {
        setError('Mật khẩu quá dài. Vui lòng dùng mật khẩu ngắn hơn.');
        return;
      }
      if (mode === 'login') {
        await authApi.emailLogin(email, password);
        form.reset();
        onSuccess();
        return;
      }
      await authApi.emailAction(mode, { email, ...(password ? { password } : {}), ...(code ? { code } : {}) });
      form.reset();
      if (mode === 'register') {
        move('confirm');
        setNotice('Kiểm tra hộp thư và thư rác để lấy mã xác nhận.');
      }
      if (mode === 'confirm') {
        move('login');
        setNotice('Email đã xác nhận. Bạn có thể đăng nhập.');
      }
      if (mode === 'recover') {
        move('reset');
        setNotice('Nếu email đã đăng ký, mã khôi phục sẽ được gửi đến hộp thư của bạn.');
      }
      if (mode === 'reset') {
        move('login');
        setNotice('Đã đổi mật khẩu. Hãy đăng nhập bằng mật khẩu mới.');
      }
    });
  };
  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="rounded-lg bg-muted p-3 text-sm">
          {notice}
        </p>
      )}
      <form key={mode} onSubmit={submit} className="flex flex-col gap-4">
        <fieldset disabled={locked} className="flex min-w-0 flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="ban@example.com"
              required
              maxLength={254}
              value={email}
              onChange={event => setEmail(event.target.value)}
              className={inputClass}
            />
          </label>
          {(mode === 'confirm' || mode === 'reset') && (
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Mã xác nhận
              <input
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6,10}"
                minLength={6}
                maxLength={10}
                required
                className={inputClass}
              />
            </label>
          )}
          {['login', 'register', 'reset'].includes(mode) && (
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              {mode === 'reset' ? 'Mật khẩu mới' : 'Mật khẩu'}
              <span className="relative flex items-center">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={mode === 'login' ? 1 : 8}
                  maxLength={72}
                  required
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 flex h-11 w-11 items-center justify-center text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
              {mode !== 'login' && (
                <span className="text-xs font-normal text-muted-foreground">Sử dụng ít nhất 8 ký tự.</span>
              )}
            </label>
          )}
          {(mode === 'register' || mode === 'reset') && (
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Nhập lại mật khẩu
              <input
                name="confirmation"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
                className={inputClass}
              />
            </label>
          )}
          {mode === 'login' && (
            <button
              type="button"
              onClick={() => change('recover')}
              className="-my-2 min-h-11 self-end text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              Quên mật khẩu?
            </button>
          )}
          <button type="submit" className="btn-accent min-h-11 justify-center px-4 font-semibold disabled:opacity-60">
            {busy && <Loader2 size={16} className="animate-spin" />}
            {busy ? 'Đang xử lý…' : labels[mode]}
          </button>
        </fieldset>
      </form>
      {(mode === 'confirm' || mode === 'reset') && (
        <button
          type="button"
          disabled={locked || !email.trim()}
          className="min-h-11 text-sm font-medium underline underline-offset-4"
          onClick={() =>
            void run(async () => {
              await authApi.emailAction(mode === 'confirm' ? 'resend' : 'recover', { email });
              setNotice('Đã yêu cầu gửi lại mã. Hãy dùng mã trong email mới nhất.');
            })
          }
        >
          Gửi lại mã
        </button>
      )}
      {mode === 'login' || mode === 'register' ? (
        <p className="text-center text-sm text-muted-foreground">
          {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button
            type="button"
            disabled={locked}
            onClick={() => change(mode === 'login' ? 'register' : 'login')}
            className="min-h-11 font-semibold text-foreground underline underline-offset-4"
          >
            {mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </p>
      ) : (
        <button
          type="button"
          disabled={locked}
          onClick={() => change('login')}
          className="flex min-h-11 items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <ArrowLeft size={16} />
          Quay lại đăng nhập
        </button>
      )}
    </div>
  );
}
