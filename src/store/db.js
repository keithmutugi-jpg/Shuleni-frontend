/**
 * Lightweight persistence layer standing in for a real backend.
 *
 * PHASE 1 UPDATE: authentication (school registration, login, logout,
 * session) now talks to the real Django backend — see src/lib/api.js
 * and src/store/AuthContext.jsx. Every other domain below (users,
 * resources, attendance, chats, exams, classes, timetables) still
 * runs on localStorage until those get their own backend endpoints.
 * Everything remaining here is namespaced by schoolId so two schools'
 * data can never mix, mirroring the isolation the real backend will
 * enforce with tenant-scoped queries once it grows to cover these
 * domains too.
 */

import { examBank } from '../data/examBank';

const KEYS = {
  users: 'shuleni.users',
  attendance: 'shuleni.attendance',
  resources: 'shuleni.resources',
  chats: 'shuleni.chats',
  exams: 'shuleni.exams',
  classes: 'shuleni.classes',
  timetables: 'shuleni.timetables',
  examResults: 'shuleni.examResults',
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

function seedIfEmpty() {
  const users = read(KEYS.users, null);
  if (users) return;

  const schoolId = 'SCH-004';

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
  write(KEYS.exams, { [schoolId]: [
    { ...examBank, id: 'exam-mathematics', classId: 'class-3b', availableFrom: null, availableUntil: null, createdAt: new Date().toISOString() },
    { ...examBank, id: 'exam-science', title: 'Science — Form 3B Quiz', classId: 'class-physics', availableFrom: null, availableUntil: null, createdAt: new Date().toISOString() },
  ] });
  write(KEYS.classes, { [schoolId]: [
    { id: 'class-3b', name: 'Form 3B', subject: 'Mathematics', room: 'Room 12', educatorId: 'teacher.john' },
    { id: 'class-physics', name: 'Form 3B', subject: 'Physics', room: 'Room 07', educatorId: 'teacher.john' },
  ] });
  write(KEYS.timetables, { [schoolId]: Object.fromEntries(['STU-041', 'STU-042', 'STU-043', 'STU-044', 'STU-045'].map((studentId) => [studentId, [
      { id: 'slot-math', title: 'Mathematics — Form 3B', day: 'Monday', startsAt: '08:00', endsAt: '09:30', room: 'Room 12' },
      { id: 'slot-physics', title: 'Physics — Form 3B', day: 'Wednesday', startsAt: '10:00', endsAt: '11:30', room: 'Room 07' },
    ]])) });
}

seedIfEmpty();

function migrateDemoData() {
  const schoolId = 'SCH-004';
  if (!read(KEYS.users, {})[schoolId]) return;
  const classes = read(KEYS.classes, {});
  if (!classes[schoolId]) {
    classes[schoolId] = [
      { id: 'class-3b', name: 'Form 3B', subject: 'Mathematics', room: 'Room 12', educatorId: 'teacher.john' },
      { id: 'class-physics', name: 'Form 3B', subject: 'Physics', room: 'Room 07', educatorId: 'teacher.john' },
    ];
    write(KEYS.classes, classes);
  }
  const exams = read(KEYS.exams, {});
  if (!exams[schoolId]?.length) {
    exams[schoolId] = [
      { ...examBank, id: 'exam-mathematics', classId: 'class-3b', availableFrom: null, availableUntil: null, createdAt: new Date().toISOString() },
      { ...examBank, id: 'exam-science', title: 'Science — Form 3B Quiz', classId: 'class-physics', availableFrom: null, availableUntil: null, createdAt: new Date().toISOString() },
    ];
    write(KEYS.exams, exams);
  }
  const timetables = read(KEYS.timetables, {});
  if (!timetables[schoolId]) {
    const slots = [
      { id: 'slot-math', title: 'Mathematics — Form 3B', day: 'Monday', startsAt: '08:00', endsAt: '09:30', room: 'Room 12' },
      { id: 'slot-physics', title: 'Physics — Form 3B', day: 'Wednesday', startsAt: '10:00', endsAt: '11:30', room: 'Room 07' },
    ];
    timetables[schoolId] = Object.fromEntries(['STU-041', 'STU-042', 'STU-043', 'STU-044', 'STU-045'].map((id) => [id, slots]));
    write(KEYS.timetables, timetables);
  }
}

migrateDemoData();

function listUsers(schoolId) {
  return read(KEYS.users, {})[schoolId] || [];
}

export function listResources(schoolId) {
  return read(KEYS.resources, {})[schoolId] || [];
}

export function addResourceFile(schoolId, { subject, fileName, restricted, dataUrl, mimeType }) {
  const resources = read(KEYS.resources, {});
  const list = resources[schoolId] || [];
  let folder = list.find((f) => f.subject === subject);
  if (!folder) {
    folder = { id: uid('res'), subject, access: restricted ? 'restricted' : 'open', files: [] };
    list.push(folder);
  } else {
    folder.access = restricted ? 'restricted' : 'open';
  }
  folder.files.push({ id: uid('file'), name: fileName, sizeKb: Math.round(50 + Math.random() * 900), uploadedAt: new Date().toISOString(), dataUrl: dataUrl || null, mimeType: mimeType || '' });
  resources[schoolId] = list;
  write(KEYS.resources, resources);
  return folder;
}

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

export function listChatRooms(schoolId) {
  // Ensure chat rooms are initialized for this schoolId
  ensureChatRoomsInitialized(schoolId);
  return read(KEYS.chats, {})[schoolId] || [];
}

function ensureChatRoomsInitialized(schoolId) {
  const chats = read(KEYS.chats, {});
  if (chats[schoolId] && chats[schoolId].length > 0) {
    return; // Already initialized
  }
  
  // Create sample chat rooms for this schoolId
  chats[schoolId] = [
    {
      id: uid('room'),
      name: 'General Announcements',
      classGroup: null,
      messages: [
        { id: uid('msg'), authorName: 'Admin', authorRole: 'owner', text: 'Welcome to the chat! This is where you can communicate with your class.', at: new Date().toISOString() },
      ],
    },
    {
      id: uid('room'),
      name: 'Class Discussion',
      classGroup: 'Form 3B',
      messages: [
        { id: uid('msg'), authorName: 'Teacher', authorRole: 'educator', text: 'Feel free to ask questions here!', at: new Date().toISOString() },
      ],
    },
  ];
  write(KEYS.chats, chats);
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

export function listExams(schoolId) {
  return read(KEYS.exams, {})[schoolId] || [];
}

export function getExam(schoolId, examId) {
  return listExams(schoolId).find((e) => e.id === examId) || null;
}

export function createExam(schoolId, { title, minutes, questions, classId, availableFrom, availableUntil }) {
  const exams = read(KEYS.exams, {});
  const list = exams[schoolId] || [];
  const entry = {
    id: uid('exm'),
    title,
    minutes,
    questions,
    classId: classId || null,
    availableFrom: availableFrom || null,
    availableUntil: availableUntil || null,
    createdAt: new Date().toISOString(),
  };
  list.unshift(entry);
  exams[schoolId] = list;
  write(KEYS.exams, exams);
  return entry;
}

export function listClasses(schoolId) {
  return read(KEYS.classes, {})[schoolId] || [];
}

export function createClass(schoolId, entry) {
  const classes = read(KEYS.classes, {});
  const list = classes[schoolId] || [];
  const created = { id: uid('class'), createdAt: new Date().toISOString(), ...entry };
  list.unshift(created);
  classes[schoolId] = list;
  write(KEYS.classes, classes);

  const users = listUsers(schoolId);
  const timetables = read(KEYS.timetables, {});
  const schoolTimetables = timetables[schoolId] || {};
  const startsAt = entry.startsAt ? new Date(entry.startsAt) : null;
  const publishedEntry = {
    classId: created.id,
    title: `${created.subject} — ${created.name}`,
    day: startsAt && !Number.isNaN(startsAt.getTime()) ? startsAt.toLocaleDateString('en-GB', { weekday: 'long' }) : 'Monday',
    startsAt: startsAt && !Number.isNaN(startsAt.getTime()) ? startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
    endsAt: entry.endsAt ? new Date(entry.endsAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
    room: created.room || '',
  };
  users.filter((user) => user.role === 'student' && user.classGroup === created.name).forEach((student) => {
    const existing = schoolTimetables[student.id] || [];
    schoolTimetables[student.id] = [{ id: uid('slot'), ...publishedEntry }, ...existing];
  });
  timetables[schoolId] = schoolTimetables;
  write(KEYS.timetables, timetables);
  return created;
}

export function listTimetable(schoolId, userId) {
  return read(KEYS.timetables, {})[schoolId]?.[userId] || [];
}

export function addTimetableEntry(schoolId, userId, entry) {
  const timetables = read(KEYS.timetables, {});
  const school = timetables[schoolId] || {};
  const list = school[userId] || [];
  const created = { id: uid('slot'), ...entry };
  school[userId] = [created, ...list];
  timetables[schoolId] = school;
  write(KEYS.timetables, timetables);
  return created;
}

export function removeTimetableEntry(schoolId, userId, entryId) {
  const timetables = read(KEYS.timetables, {});
  const school = timetables[schoolId] || {};
  school[userId] = (school[userId] || []).filter((entry) => entry.id !== entryId);
  timetables[schoolId] = school;
  write(KEYS.timetables, timetables);
}

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