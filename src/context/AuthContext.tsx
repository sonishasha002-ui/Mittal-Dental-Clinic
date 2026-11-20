import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

export const PRIMARY_ADMIN_EMAIL = 'sonishasha002@gmail.com';

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  authReady: boolean;
  authBusy: boolean;
  authError: string;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function resolveAdminStatus(currentUser: User | null): Promise<boolean> {
  if (!currentUser || !currentUser.emailVerified) {
    return false;
  }
  if (currentUser.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }
  try {
    const snap = await getDoc(doc(db, 'admins', currentUser.uid));
    return snap.exists() && snap.data()?.role === 'admin';
  } catch {
    return false;
  }
}

function mapFirebaseAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completion. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
    case 'auth/cancelled-popup-request':
      return 'Previous sign-in request was cancelled. Please try again.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Authentication Console. Please sign in with Google or enable Email/Password in Firebase Console.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email address or password.';
    case 'auth/too-many-requests':
      return 'Too many sign-in attempts. Please wait a moment before trying again.';
    case 'auth/network-request-failed':
      return 'Network error while contacting Firebase Authentication. Please check your internet connection.';
    default:
      return error instanceof Error ? error.message : 'Authentication failed. Please try again.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return;
      setUser(currentUser);
      if (currentUser) {
        const adminFlag = await resolveAdminStatus(currentUser);
        if (!active) return;
        setIsAdmin(adminFlag);
      } else {
        setIsAdmin(false);
      }
      setAuthReady(true);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const clearAuthError = useCallback(() => setAuthError(''), []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError('');
    setAuthBusy(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const adminFlag = await resolveAdminStatus(cred.user);
      setUser(cred.user);
      setIsAdmin(adminFlag);
    } catch (err) {
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setAuthError('');
    setAuthBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const adminFlag = await resolveAdminStatus(cred.user);
      setUser(cred.user);
      setIsAdmin(adminFlag);
    } catch (err) {
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthError('');
    setAuthBusy(true);
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setAuthBusy(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        authReady,
        authBusy,
        authError,
        clearAuthError,
        signInWithGoogle,
        signInWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
