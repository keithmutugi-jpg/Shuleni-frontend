/**
 * Lightweight persistence layer standing in for the Flask/PostgreSQL
 * backend until it's ready. Everything is namespaced by schoolId so
 * two different schools' data can never mix — the same isolation
 * rule the real backend will enforce with tenant-scoped queries.
 *
 * Swap the bodies of these functions for real `fetch()` calls to the
 * Flask API later; every page already talks to this file only, never
 * to localStorage directly, so that swap won't touch the UI code.
 */

const KEYS = {
  schools: 'shuleni.schools',
  users: 'shuleni.users',
  attendance: 'shuleni.attendance',
  resources: 'shuleni.resources',
  chats: 'shuleni.chats',
  exams: 'shuleni.exams',
  examResults: 'shuleni.examResults',
  session: 'shuleni.session',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------
// Seed a demo school on first run so the app is usable immediately,
// without forcing everyone to register before they can see anything.
// ---------------------------------------------------------------------
function seedIfEmpty() {
  const schools = read(KEYS.schools, null);
  if (schools) return;

  const schoolId = 'SCH-004';
  write(KEYS.schools, {
    [schoolId]: { id: schoolId, name: 'Greenfield Academy', createdAt: new Date().toISOString() },
  });

  write(KEYS.users, {
    [schoolId]: [
      { id: uid('usr'), role: 'owner', name: 'Kevin Wanjiru', username: 'owner', password: 'owner123', email: 'owner@greenfield.ac.ke' },
      { id: uid('usr'), role: 'educator', name: 'Teacher John', username: 'teacher.john', password: 'teacher123', email: 'john@greenfield.ac.ke', subjects: 'Mathematics, Physics' },
      { id: 'STU-041', role: 'student', name: 'Amara Osei', username: 'amara.osei', password: 'student123', email: 'amara@greenfield.ac.ke', classGroup: 'Form 3B' },
      { id: 'STU-042', role: 'student', name: 'Brian Mwangi', username: 'brian.mwangi', password: 'student123', email: 'brian@greenfield.ac.ke', classGroup: 'Form 3B' },
      { id: 'STU-043', role: 'student', name: 'Cynthia Achieng', username: 'cynthia.achieng', password: 'student123', email: 'cynthia@greenfield.ac.ke', classGroup: 'Form 3B' },
      { id: 'STU-044', role: 'student', name: 'David Kariuki', username: 'david.kariuki', password: 'student123', email: 'david@greenfield.ac.ke', classGroup: 'Form 3B' },
      { id: 'STU-045', role: 'student', name: 'Esther Nalwoga', username: 'esther.nalwoga', password: 'student123', email: 'esther@greenfield.ac.ke', classGroup: 'Form 3B' },
    ],
  });

  write(KEYS.resources, {
    [schoolId]: [
      { id: uid('res'), subject: 'Mathematics', access: 'restricted', files: [
        { id: uid('file'), name: 'Chapter 4 — Quadratic Equations.pdf', sizeKb: 820, uploadedAt: new Date().toISOString() },
      ] },
      { id: uid('res'), subject: 'Science', access: 'open', files: [] },
      { id: uid('res'), subject: 'Literature', access: 'restricted', files: [] },
      { id: uid('res'), subject: 'History', access: 'open', files: [] },
      { id: uid('res'), subject: 'Geography', access: 'restricted', files: [] },
      { id: uid('res'), subject: 'Physical Education', access: 'open', files: [] },
    ],
  });

  write(KEYS.chats, {
    [schoolId]: [
      {
        id: uid('room'),
        name: 'Form 3B Mathematics',
        classGroup: 'Form 3B',
        messages: [
          { id: uid('msg'), authorName: 'Teacher John', authorRole: 'educator', text: 'Good morning everyone. Please open your textbooks to page 47 — we are covering quadratic equations today.', at: new Date().toISOString() },
          { id: uid('msg'), authorName: 'Amara Osei', authorRole: 'student', text: 'Good morning, Teacher! My textbook is at home. Can I share with Brian?', at: new Date().toISOString() },
        ],
      },
      { id: uid('room'), name: 'General Announcements', classGroup: null, messages: [] },
    ],
  });

  write(KEYS.attendance, { [schoolId]: [] });
  write(KEYS.examResults, { [schoolId]: [] });
  write(KEYS.exams, { [schoolId]: [] });
}

seedIfEmpty();

// ---------------------------------------------------------------------
// Schools
// ---------------------------------------------------------------------
export function findSchool(nameOrId) {
  const schools = read(KEYS.schools, {});
  const needle = nameOrId.trim().toLowerCase().replace(/^#/, '');
  return Object.values(schools).find(
    (s) => s.id.toLowerCase() === needle || s.name.toLowerCase() === needle
  );
}

export function createSchool({ schoolName, ownerName, email, username, password }) {
  const schools = read(KEYS.schools, {});
  const id = uid('SCH').toUpperCase();
  schools[id] = { id, name: schoolName, createdAt: new Date().toISOString() };
  write(KEYS.schools, schools);

  const users = read(KEYS.users, {});
  const owner = { id: uid('usr'), role: 'owner', name: ownerName, username, password, email };
  users[id] = [owner];
  write(KEYS.users, users);

  const resources = read(KEYS.resources, {});
  resources[id] = [];
  write(KEYS.resources, resources);

  const chats = read(KEYS.chats, {});
  chats[id] = [{ id: uid('room'), name: 'General Announcements', classGroup: null, messages: [] }];
  write(KEYS.chats, chats);

  const attendance = read(KEYS.attendance, {});
  attendance[id] = [];
  write(KEYS.attendance, attendance);

  const examResults = read(KEYS.examResults, {});
  examResults[id] = [];
  write(KEYS.examResults, examResults);

  const exams = read(KEYS.exams, {});
  exams[id] = [];
  write(KEYS.exams, exams);

  return { school: schools[id], owner };
}

// ---------------------------------------------------------------------
// Auth / session
// ---------------------------------------------------------------------
export function login({ schoolNameOrId, username, password }) {
  const school = findSchool(schoolNameOrId);
  if (!school) return { error: 'No school matches that name or ID.' };

  const users = read(KEYS.users, {})[school.id] || [];
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) return { error: 'Incorrect username or password for this school.' };

  const session = { schoolId: school.id, schoolName: school.name, userId: user.id, name: user.name, role: user.role };
  write(KEYS.session, session);
  return { session };
}

export function logout() {
  localStorage.removeItem(KEYS.session);
}

export function getSession() {
  return read(KEYS.session, null);
}

// ---------------------------------------------------------------------
// Users (students / educators) — scoped to a school
// ---------------------------------------------------------------------
export function listUsers(schoolId) {
  return read(KEYS.users, {})[schoolId] || [];
}

export function addUser(schoolId, { role, name, email, classGroup, username, password }) {
  const users = read(KEYS.users, {});
  const list = users[schoolId] || [];
  const id = role === 'student' ? uid('STU').toUpperCase() : uid('usr');
  const user = {
    id,
    role,
    name,
    email,
    classGroup: role === 'student' ? classGroup : undefined,
    subjects: role === 'educator' ? classGroup : undefined,
    username: username || email?.split('@')[0] || name.toLowerCase().replace(/\s+/g, '.'),
    password: password || 'changeme123',
  };
  list.push(user);
  users[schoolId] = list;
  write(KEYS.users, users);
  return user;
}

// ---------------------------------------------------------------------
// Resources — scoped to a school
// ---------------------------------------------------------------------
export function listResources(schoolId) {
  return read(KEYS.resources, {})[schoolId] || [];
}

export function addResourceFile(schoolId, { subject, fileName, restricted }) {
  const resources = read(KEYS.resources, {});
  const list = resources[schoolId] || [];
  let folder = list.find((f) => f.subject === subject);
  if (!folder) {
    folder = { id: uid('res'), subject, access: restricted ? 'restricted' : 'open', files: [] };
    list.push(folder);
  } else {
    folder.access = restricted ? 'restricted' : 'open';
  }
  folder.files.push({ id: uid('file'), name: fileName, sizeKb: Math.round(50 + Math.random() * 900), uploadedAt: new Date().toISOString() });
  resources[schoolId] = list;
  write(KEYS.resources, resources);
  return folder;
}

// ---------------------------------------------------------------------
// Attendance — scoped to a school
// ---------------------------------------------------------------------
export function listAttendance(schoolId) {
  return read(KEYS.attendance, {})[schoolId] || [];
}

export function submitAttendance(schoolId, record) {
  const attendance = read(KEYS.attendance, {});
  const list = attendance[schoolId] || [];
  const entry = { id: uid('att'), submittedAt: new Date().toISOString(), ...record };
  list.unshift(entry);
  attendance[schoolId] = list;
  write(KEYS.attendance, attendance);
  return entry;
}

// ---------------------------------------------------------------------
// Chats — scoped to a school
// ---------------------------------------------------------------------
export function listChatRooms(schoolId) {
  return read(KEYS.chats, {})[schoolId] || [];
}

export function sendMessage(schoolId, roomId, { authorName, authorRole, text }) {
  const chats = read(KEYS.chats, {});
  const rooms = chats[schoolId] || [];
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return null;
  const message = { id: uid('msg'), authorName, authorRole, text, at: new Date().toISOString() };
  room.messages.push(message);
  chats[schoolId] = rooms;
  write(KEYS.chats, chats);
  return message;
}

// ---------------------------------------------------------------------
// Exams — created by educators, taken by students, scoped to a school
export function listExams(schoolId) {
  return read(KEYS.exams, {})[schoolId] || [];
}

export function getExam(schoolId, examId) {
  return listExams(schoolId).find((e) => e.id === examId) || null;
}

export function createExam(schoolId, { title, minutes, questions }) {
  const exams = read(KEYS.exams, {});
  const list = exams[schoolId] || [];
  const entry = {
    id: uid('exm'),
    title,
    minutes,
    questions,
    createdAt: new Date().toISOString(),
  };
  list.unshift(entry);
  exams[schoolId] = list;
  write(KEYS.exams, exams);
  return entry;
}

// Exam results — scoped to a school
// ---------------------------------------------------------------------
export function listExamResults(schoolId, studentId) {
  const all = read(KEYS.examResults, {})[schoolId] || [];
  return studentId ? all.filter((r) => r.studentId === studentId) : all;
}

export function submitExamResult(schoolId, result) {
  const examResults = read(KEYS.examResults, {});
  const list = examResults[schoolId] || [];
  const entry = { id: uid('exam'), submittedAt: new Date().toISOString(), ...result };
  list.unshift(entry);
  examResults[schoolId] = list;
  write(KEYS.examResults, examResults);
  return entry;
}
