import { createContext, useContext, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import * as db from './db';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => db.getSession());

  const login = useCallback((credentials) => {
    const result = db.login(credentials);
    if (result.session) setSession(result.session);
    return result;
  }, []);

  const register = useCallback((form) => {
    const { school, owner } = db.createSchool(form);
    const newSession = { schoolId: school.id, schoolName: school.name, userId: owner.id, name: owner.name, role: owner.role };
    // Reuse db.login's session write so getSession() stays consistent.
    db.login({ schoolNameOrId: school.id, username: owner.username, password: owner.password });
    setSession(newSession);
    return { school, owner };
  }, []);

  const logout = useCallback(() => {
    db.logout();
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

/** Redirects to login unless the current session matches `role`. */
export function RequireRole({ role, children }) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session || session.role !== role) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}
