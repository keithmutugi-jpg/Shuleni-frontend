import { createContext, useContext, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiRegisterSchool, apiLogin, apiLogout } from '../lib/api';

const AuthContext = createContext(null);
const SESSION_KEY = 'shuleni.session'; // { session: {...}, token: '...' }

function readStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredSession(value) {
  if (value) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(value));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function AuthProvider({ children }) {
  const [stored, setStored] = useState(() => readStoredSession());
  const session = stored?.session || null;

  const login = useCallback(async (credentials) => {
    try {
      const { session, token } = await apiLogin(credentials);
      const next = { session, token };
      writeStoredSession(next);
      setStored(next);
      return { session };
    } catch (err) {
      return { error: err.message };
    }
  }, []);

  const register = useCallback(async (form) => {
    try {
      const { school, session, token } = await apiRegisterSchool(form);
      const next = { session, token };
      writeStoredSession(next);
      setStored(next);
      return { school };
    } catch (err) {
      return { error: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    if (stored?.token) {
      try {
        await apiLogout(stored.token);
      } catch {
        // Even if the network call fails, still clear the local session.
      }
    }
    writeStoredSession(null);
    setStored(null);
  }, [stored]);

  return (
    <AuthContext.Provider value={{ session, token: stored?.token || null, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** Redirects to login unless the current session matches `role`. */
export function RequireRole({ role, children }) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session || session.role !== role) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}