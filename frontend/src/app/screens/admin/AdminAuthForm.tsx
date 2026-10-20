import React, { useState } from "react";
import { Lock, AlertTriangle, Loader2 } from "lucide-react";
import { authApi } from "../../services/api";

interface AdminAuthFormProps {
  user: any;
  onLoginSuccess: (user: any) => void;
  onLogout: () => void;
}

export function AdminAuthForm({ user, onLoginSuccess, onLogout }: AdminAuthFormProps) {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setLoginError("");
    try {
      const res = await authApi.login(loginUsername, loginPassword);
      if (res.user && (res.user.role === "ADMIN" || res.user.role === "MODERATOR")) {
        onLoginSuccess(res.user);
      } else {
        await authApi.logout();
        setLoginError("Account does not have admin privileges.");
      }
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials.");
    } finally {
      setActionLoading(false);
    }
  };

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
          You must be an Admin or Moderator to access this dashboard.
        </p>

        {loginError && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} /> {loginError}
          </div>
        )}

        {user && user.role !== "ADMIN" && user.role !== "MODERATOR" && (
          <div className="bg-yellow-50 text-yellow-700 text-sm p-3 rounded-lg border border-yellow-200 mb-4 text-center">
            Logged in as {user.username} ({user.role}). Access Denied.
            <button onClick={onLogout} className="underline ml-2">Log out</button>
          </div>
        )}

        {(!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold mb-1 block">Username / Email</label>
              <input
                type="text"
                className="w-full border border-border rounded-lg p-2.5 bg-background"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Password</label>
              <input
                type="password"
                className="w-full border border-border rounded-lg p-2.5 bg-background"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={actionLoading}
              className="mt-2 w-full bg-accent text-accent-foreground py-2.5 rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {actionLoading ? <Loader2 size={18} className="animate-spin inline" /> : "Sign In"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
