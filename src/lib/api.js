/**
 * Thin wrapper around the real Django backend for authentication.
 * Only auth (register / login / logout) and users talk to the network
 * so far — every other domain (resources, attendance, chats, exams,
 * etc.) still runs on the localStorage store in src/store/db.js until
 * those get their own backend endpoints in a later pass.
 */

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Token ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Could not reach the server. Is the backend running?');
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
  return request('/users/', { token });
}

export function apiAddUser(token, payload) {
  return request('/users/', { method: 'POST', body: payload, token });
}