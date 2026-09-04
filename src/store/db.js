const API_URL = (import.meta.env.VITE_API_URL || 'https://shuleni-backend.onrender.com/api').replace(/\/$/, '');
const TOKEN_KEY = 'shuleni.apiToken';
const SESSION_KEY = 'shuleni.session';

function token() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (token()) headers.set('Authorization', `Token ${token()}`);
  if (!(options.body instanceof FormData) && options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.body);
  }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  let data = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

function saveAuth(data) {
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  if (data.session) localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export async function login(credentials) {
  try {
    const data = await request('/auth/login/', { method: 'POST', body: credentials });
    saveAuth(data);
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

export async function createSchool(form) {
  const data = await request('/schools/register/', { method: 'POST', body: form });
  saveAuth(data);
  return { school: data.school, owner: data.session };
}

export async function logout() {
  try {
    await request('/auth/logout/', { method: 'POST' });
  } finally {
    clearAuth();
  }
}

export async function listUsers() {
  return request('/users/');
}

export async function addUser(_schoolId, payload) {
  return request('/users/', { method: 'POST', body: payload });
}

export async function listResources() {
  const data = await request('/resources/');
  return data.map((folder) => ({
    ...folder,
    files: (folder.files || []).map((file) => ({
      ...file,
      url: file.url ? (file.url.startsWith('http') ? file.url : `${API_URL.replace(/\/api$/, '')}${file.url}`) : null,
    })),
  }));
}

export async function addResourceFile(_schoolId, { subject, fileName, restricted, file }) {
  const form = new FormData();
  form.append('subject', subject);
  form.append('fileName', fileName || '');
  form.append('restricted', restricted ? 'true' : 'false');
  if (file) form.append('file', file);
  return request('/resources/', { method: 'POST', body: form });
}

export async function listAttendance() {
  return request('/attendance/');
}

export async function submitAttendance(_schoolId, record) {
  return request('/attendance/submit/', { method: 'POST', body: record });
}

export async function listChatRooms() {
  return request('/chats/');
}

export async function sendMessage(_schoolId, roomId, { text }) {
  return request(`/chats/${roomId}/messages/`, { method: 'POST', body: { text } });
}

export async function listExams() {
  return request('/exams/');
}

export async function getExam(_schoolId, examId) {
  const exams = await listExams();
  return exams.find((exam) => String(exam.id) === String(examId)) || null;
}

export async function createExam(_schoolId, payload) {
  return request('/exams/', { method: 'POST', body: payload });
}

export async function listExamResults() {
  return request('/exam-results/');
}

export async function submitExamResult(_schoolId, result) {
  return request(`/exams/${result.examId}/submit/`, {
    method: 'POST',
    body: {
      answers: result.answers,
      timeTakenSeconds: result.timeTakenSeconds,
      violations: result.violations,
    },
  });
}
