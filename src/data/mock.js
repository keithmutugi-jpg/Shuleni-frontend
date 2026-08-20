export const todaysClasses = [
  { id: 1, title: 'Mathematics — Grade 8A', time: '08:00 – 09:30', room: 'Room 12' },
  { id: 2, title: 'Physics — Grade 9B', time: '10:00 – 11:30', room: 'Room 07' },
  { id: 3, title: 'Mathematics — Grade 7C', time: '13:00 – 14:30', room: 'Room 12' },
];

export const upcomingExams = [
  { id: 1, day: 'Mo', date: 25, title: 'Mathematics — Grade 8A', when: 'Mon, 25 Aug', tag: 'Mid-term' },
  { id: 2, day: 'We', date: 27, title: 'Physics — Grade 9B', when: 'Wed, 27 Aug', tag: 'CAT' },
  { id: 3, day: 'Fr', date: 29, title: 'Mathematics — Grade 7C', when: 'Fri, 29 Aug', tag: 'End-term' },
];

export const ALL_CLASSES = ['Grade 7C', 'Grade 8A', 'Grade 9B'];

export const resourceFolders = [
  {
    id: 1,
    subject: 'Mathematics',
    size: '118 MB',
    edited: '15 Aug 2026',
    access: 'restricted',
    classes: ['Grade 8A', 'Grade 9B'],
    items: [
      { id: 101, name: 'Chapter 4 — Quadratic Equations.pdf', size: '4.2 MB', uploaded: '15 Aug 2026' },
      { id: 102, name: 'Grade 8A Mid-term Notes.pdf', size: '2.1 MB', uploaded: '12 Aug 2026' },
      { id: 103, name: 'Algebra Workbook.pdf', size: '8.7 MB', uploaded: '10 Aug 2026' },
    ],
  },
  {
    id: 2,
    subject: 'Science',
    size: '84 MB',
    edited: '12 Aug 2026',
    access: 'open',
    classes: ['Grade 7C', 'Grade 8A', 'Grade 9B'],
    items: [
      { id: 201, name: 'Lab Safety Guidelines.pdf', size: '1.1 MB', uploaded: '12 Aug 2026' },
      { id: 202, name: 'Physics — Forces & Motion.pdf', size: '5.3 MB', uploaded: '09 Aug 2026' },
    ],
  },
  {
    id: 3,
    subject: 'Literature',
    size: '52 MB',
    edited: '10 Aug 2026',
    access: 'restricted',
    classes: ['Grade 8A'],
    items: [
      { id: 301, name: 'Things Fall Apart — Study Guide.pdf', size: '3.4 MB', uploaded: '10 Aug 2026' },
      { id: 302, name: 'Essay Writing Tips.docx', size: '0.8 MB', uploaded: '07 Aug 2026' },
      { id: 303, name: 'Poetry Anthology.pdf', size: '6.2 MB', uploaded: '05 Aug 2026' },
    ],
  },
  {
    id: 4,
    subject: 'History',
    size: '23 MB',
    edited: '08 Aug 2026',
    access: 'open',
    classes: ['Grade 7C', 'Grade 8A', 'Grade 9B'],
    items: [
      { id: 401, name: 'African Independence Movements.pdf', size: '4.8 MB', uploaded: '08 Aug 2026' },
    ],
  },
  {
    id: 5,
    subject: 'Geography',
    size: '67 MB',
    edited: '05 Aug 2026',
    access: 'restricted',
    classes: ['Grade 9B'],
    items: [
      { id: 501, name: 'Climate Zones Map.pdf', size: '2.9 MB', uploaded: '05 Aug 2026' },
      { id: 502, name: 'Population & Urbanisation.pdf', size: '3.7 MB', uploaded: '03 Aug 2026' },
    ],
  },
  {
    id: 6,
    subject: 'Physical Education',
    size: '11 MB',
    edited: '01 Aug 2026',
    access: 'open',
    classes: ['Grade 7C', 'Grade 8A', 'Grade 9B'],
    items: [
      { id: 601, name: 'Term 3 Fitness Schedule.pdf', size: '1.0 MB', uploaded: '01 Aug 2026' },
    ],
  },
];

export const rosterStudents = [
  { id: 'STU-041', initials: 'AO', name: 'Amara Osei', status: 'present' },
  { id: 'STU-042', initials: 'BM', name: 'Brian Mwangi', status: 'absent' },
  { id: 'STU-043', initials: 'CA', name: 'Cynthia Achieng', status: 'present' },
  { id: 'STU-044', initials: 'DK', name: 'David Kariuki', status: 'late' },
  { id: 'STU-045', initials: 'EN', name: 'Esther Nalwoga', status: 'present' },
  { id: 'STU-046', initials: 'FO', name: 'Felix Otieno', status: 'present' },
  { id: 'STU-047', initials: 'GW', name: 'Grace Wambui', status: 'absent' },
  { id: 'STU-048', initials: 'HM', name: 'Hassan Mohamed', status: 'late' },
];

export const chatRooms = [
  { id: 1, name: 'Form 3B Mathematics', preview: 'See you at 10am', time: '10:42', unread: 3 },
  { id: 2, name: 'General Announcements', preview: 'School closes Friday at …', time: '09:15', unread: 0 },
  { id: 3, name: 'Science Club', preview: 'Lab report due tomorr…', time: 'Yesterday', unread: 1 },
  { id: 4, name: 'Form 3B English', preview: 'Essay feedback upload…', time: 'Yesterday', unread: 0 },
  { id: 5, name: 'Form 2A History', preview: 'Good discussion today!', time: 'Mon', unread: 0 },
  { id: 6, name: 'Staff Notices', preview: 'Meeting rescheduled t…', time: 'Mon', unread: 0 },
];

export const chatParticipants = {
  online: [
    { initials: 'TJ', name: 'Teacher John', role: 'Educator' },
    { initials: 'AO', name: 'Amara Osei', role: 'STU-041' },
    { initials: 'BM', name: 'Brian Mwangi', role: 'STU-042' },
    { initials: 'CA', name: 'Cynthia Achieng', role: 'STU-043' },
    { initials: 'EN', name: 'Esther Nalwoga', role: 'STU-045' },
    { initials: 'FO', name: 'Felix Otieno', role: 'STU-046' },
  ],
  away: [
    { initials: 'DK', name: 'David Kariuki', role: 'STU-044' },
    { initials: 'GW', name: 'Grace Wambui', role: 'STU-047' },
  ],
};

export const chatMessages = [
  { id: 1, from: 'Teacher John', role: 'Educator', initials: 'TJ', dark: true, time: '09:58', text: 'Good morning everyone. Please open your textbooks to page 47 — we are covering quadratic equations today.' },
  { id: 2, from: 'Amara Osei', initials: 'AO', dark: false, time: '10:01', text: 'Good morning, Teacher! My textbook is at home. Can I share with Brian?' },
  { id: 3, from: 'Teacher John', role: 'Educator', initials: 'TJ', dark: true, time: '10:02', text: 'Yes, that is fine. I have also uploaded a PDF to the Resources folder under Mathematics.' },
  { id: 4, from: 'Brian Mwangi', initials: 'BM', dark: false, time: '10:03', text: 'Thanks, I found it!' },
  { id: 5, from: 'Teacher John', role: 'Educator', initials: 'TJ', dark: true, time: '10:05', text: 'Great. We will have a short quiz at the end of the period. Please pay close attention to the worked examples.' },
  { id: 6, from: 'Cynthia Achieng', initials: 'CA', dark: false, time: '10:07', text: 'Teacher, can you explain example 3 again? I did not understand how you factored it.' },
  { id: 7, from: 'Teacher John', role: 'Educator', initials: 'TJ', dark: true, time: '10:09', text: 'Of course, Cynthia. Look for two numbers that multiply to give the constant term and add to give the middle coefficient. Let me write it out step by step.' },
  { id: 8, from: 'Felix Otieno', initials: 'FO', dark: false, time: '10:11', text: 'That makes sense now, thank you!' },
];

export const studentSchedule = [
  { id: 1, title: 'Mathematics — Grade 8A', time: '08:00 – 09:30', room: 'Room 12' },
  { id: 2, title: 'Physics — Grade 9B', time: '10:00 – 11:30', room: 'Room 07' },
  { id: 3, title: 'English — Grade 8A', time: '13:00 – 14:00', room: 'Room 04' },
];

export const examQuestions = [
  {
    id: 1,
    prompt: 'Solve for x: 2x² − 8 = 0',
    options: ['x = 2 or x = −2', 'x = 4 or x = −4', 'x = 2 only', 'x = 8'],
  },
  {
    id: 2,
    prompt: 'Which of the following is a factor of x² − 9?',
    options: ['x + 3', 'x + 9', 'x − 1', 'x + 1'],
  },
  {
    id: 3,
    prompt: 'The sum of the roots of x² − 5x + 6 = 0 is:',
    options: ['5', '6', '−5', '1'],
  },
];
