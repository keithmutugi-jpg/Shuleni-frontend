import { createContext, useContext, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import * as db from './db';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => db.getSession());

  const login = useCallback(async (credentials) => {
    const result = await db.login(credentials);
    if (result.session) setSession(result.session);
    return result;
  }, []);

  const register = useCallback(async (form) => {
    const result = await db.createSchool(form);
    if (result.owner) setSession(result.owner);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await db.logout();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function RequireRole({ role, children }) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session || session.role !== role) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}
