import { Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../components/auth/AuthProvider';

interface AdminAuthFormProps {
  user: any;
  onLogout: () => void;
}

// Staff sign in like everyone else (Google or email); access depends on the account's role.
export function AdminAuthForm({ user, onLogout }: AdminAuthFormProps) {
  const { openLogin } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center">
            <Lock size={24} />
          </div>
        </div>
        <h2 className="text-2xl font-bold font-serif text-center mb-2">Admin Login</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Sign in with Google or email using an account that has the Admin or Moderator role.
        </p>

        {user ? (
          <div className="bg-yellow-50 text-yellow-700 text-sm p-3 rounded-lg border border-yellow-200 text-center">
            Logged in as {user.username} ({user.role}). Access Denied.
            <button onClick={onLogout} className="underline ml-2">
              Log out
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={openLogin}
            className="w-full bg-accent text-accent-foreground py-2.5 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={18} /> Sign In
          </button>
        )}
      </div>
    </div>
  );
}
