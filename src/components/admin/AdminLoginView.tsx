import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminLoginView() {
  const { user, isAdmin, authBusy, authError, clearAuthError, signInWithGoogle, signInWithEmail, logout } =
    useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    await signInWithEmail(email, password);
  };

  // Signed in, but not an authorized clinic administrator
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
                Access Restricted
              </p>
              <h1 className="text-xl font-bold text-slate-900 mt-0.5">
                Administrator Privileges Required
              </h1>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700 space-y-1.5">
            <p>
              Signed in as:{' '}
              <span className="font-semibold text-slate-900">{user.email || user.uid}</span>
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              This account is not listed in the authorized clinic administrator registry or has an unverified email address.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => void logout()}
              disabled={authBusy}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-md w-full mx-auto pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Mittal Dental Clinic Website</span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-8 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-6 sm:px-8 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-400/35 text-teal-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-300">
                Mittal Dental Clinic · Prayagraj
              </p>
              <h1 className="text-lg font-bold text-white">Clinic Admin Portal</h1>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <p className="text-sm text-slate-600 leading-relaxed">
            Sign in with your authorized clinic administrator account to manage appointments, doctor profile, gallery media, clinic details, and branch hours.
          </p>

          {authError && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 text-xs text-red-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            disabled={authBusy}
            className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 min-h-[46px] rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.98h5.33c-.23 1.32-1.01 2.44-2.16 3.19v2.64h3.49c2.04-1.88 3.21-4.65 3.21-7.95 0-.6-.05-1.19-.15-1.76z"
              />
              <path
                fill="currentColor"
                opacity="0.85"
                d="M12.18 21c2.92 0 5.37-.96 7.16-2.61l-3.49-2.64c-.97.65-2.21 1.04-3.67 1.04-2.82 0-5.21-1.9-6.06-4.46H2.51v2.79C4.29 18.65 7.95 21 12.18 21z"
              />
              <path
                fill="currentColor"
                opacity="0.7"
                d="M6.12 12.33a5.54 5.54 0 0 1 0-3.54V6H2.51a9.89 9.89 0 0 0 0 8.88l3.61-2.55z"
              />
              <path
                fill="currentColor"
                opacity="0.9"
                d="M12.18 5.21c1.59 0 3.01.55 4.13 1.62l3.1-3.1C17.54 1.99 15.1 1 12.18 1 7.95 1 4.29 3.35 2.51 6.91l3.61 2.8c.85-2.56 3.24-4.5 6.06-4.5z"
              />
            </svg>
            <span>{authBusy ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-slate-200" />
            <button
              type="button"
              onClick={() => {
                clearAuthError();
                setShowEmailForm((v) => !v);
              }}
              className="mx-3 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              {showEmailForm ? 'Hide Email Sign-In' : 'Or sign in with Email & Password'}
            </button>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {showEmailForm && (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5 pt-1">
              <div>
                <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@domain.com"
                    className="w-full pl-9 pr-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authBusy}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{authBusy ? 'Authenticating...' : 'Sign In'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 pb-4">
        Protected by Firebase Authentication &amp; Firestore Security Rules
      </p>
    </div>
  );
}
