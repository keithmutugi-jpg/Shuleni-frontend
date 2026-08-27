/**
 * Thin wrapper around the real Django backend for authentication.
 * Only auth (register / login / logout) and users talk to the network
 * so far — every other domain (resources, attendance, chats, exams,
 * etc.) still runs on the localStorage store in src/store/db.js until
 * those get their own backend endpoints in a later pass.
 */

const API_URL = import.meta.env.VITE_API_URL || '/api';
const USER_CACHE_TTL = 30_000;
const userCache = new Map();

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Token ${token}`;

  let res;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    if (path === '/users/' && token) userCache.delete(token);
    throw new Error('Could not reach the server. Is the backend running?');
  } finally {
    clearTimeout(timeout);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }
  return data;
}

export function apiRegisterSchool(form) {
  return request('/schools/register/', { method: 'POST', body: form });
}

export function apiLogin(credentials) {
  return request('/auth/login/', { method: 'POST', body: credentials });
}

export function apiLogout(token) {
  return request('/auth/logout/', { method: 'POST', token });
}

export function apiFetchSession(token) {
  return request('/auth/session/', { token });
}

export function apiListUsers(token) {
  const cached = userCache.get(token);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.users);

  return request('/users/', { token }).then((users) => {
    userCache.set(token, { users, expiresAt: Date.now() + USER_CACHE_TTL });
    return users;
  });
}

export async function apiAddUser(token, payload) {
  const user = await request('/users/', { method: 'POST', body: payload, token });
  userCache.delete(token);
  return user;
}