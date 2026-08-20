import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const KEYS = {
  schools: 'shuleni_schools',
  users: 'shuleni_users',
  currentUser: 'shuleni_currentUser',
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function randomId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/**
 * Stand-in for a real backend. Stores schools/users/current session in
 * localStorage so registration, adding people, and login actually work
 * end-to-end for demos — until this gets swapped for real Flask API calls.
 *
 * Keith's area: authentication, routing & school-owner dashboard.
 */
export function AuthProvider({ children }) {
  const [schools, setSchools] = useState(() => load(KEYS.schools, []));
  const [users, setUsers] = useState(() => load(KEYS.users, []));
  const [currentUser, setCurrentUser] = useState(() => load(KEYS.currentUser, null));

  useEffect(() => save(KEYS.schools, schools), [schools]);
  useEffect(() => save(KEYS.users, users), [users]);
  useEffect(() => save(KEYS.currentUser, currentUser), [currentUser]);

  function registerSchool({ schoolName, ownerName, email, username, password }) {
    const schoolId = randomId('SCH');
    const school = { id: schoolId, name: schoolName };
    const owner = {
      id: randomId('U'),
      schoolId,
      role: 'owner',
      name: ownerName,
      email,
      username,
      password,
    };
    setSchools((s) => [...s, school]);
    setUsers((u) => [...u, owner]);
    setCurrentUser(owner);
    return owner;
  }

  // Auto-generates a username/password so a newly added student or educator
  // can immediately log back in during the demo (e.g. "amara.osei" / "welcome123").
  function addUser({ role, name, email, classGroup }) {
    if (!currentUser) return null;
    const username = name.trim().toLowerCase().replace(/\s+/g, '.');
    const newUser = {
      id: randomId('U'),
      schoolId: currentUser.schoolId,
      role,
      name,
      email,
      classGroup,
      username,
      password: 'welcome123',
    };
    setUsers((u) => [...u, newUser]);
    return newUser;
  }

  function login({ school, username, password }) {
    const target = school.trim().toLowerCase();
    const match = users.find((u) => {
      const theirSchool = schools.find((s) => s.id === u.schoolId);
      const schoolMatches =
        theirSchool?.name.toLowerCase() === target || u.schoolId.toLowerCase() === target;
      return (
        schoolMatches &&
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password
      );
    });
    if (match) setCurrentUser(match);
    return match || null;
  }

  function logout() {
    setCurrentUser(null);
  }

  function usersForCurrentSchool() {
    if (!currentUser) return [];
    return users.filter((u) => u.schoolId === currentUser.schoolId && u.role !== 'owner');
  }

  const value = {
    schools,
    users,
    currentUser,
    registerSchool,
    addUser,
    login,
    logout,
    usersForCurrentSchool,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
