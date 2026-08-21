import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, Button } from '../components/ui';
import StudentRosterTable from '../components/StudentRosterTable';
import { useAuth } from '../store/AuthContext';
import { listUsers, submitAttendance, listAttendance } from '../store/db';

const SUBJECTS = ['Mathematics', 'Physics', 'Science', 'English', 'History', 'Geography'];

function initialsOf(name) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function AttendanceView() {
  const { session } = useAuth();
  const isEducator = session.role === 'educator' || session.role === 'owner';
  const allStudents = useMemo(() => listUsers(session.schoolId).filter((u) => u.role === 'student'), [session.schoolId]);
  const classGroups = useMemo(
    () => [...new Set(allStudents.map((s) => s.classGroup).filter(Boolean))],
    [allStudents]
  );

  const [classGroup, setClassGroup] = useState(classGroups[0] || '');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState({});
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [history, setHistory] = useState(() => listAttendance(session.schoolId));

  // Rebuild the roster whenever the selected class changes.
  useEffect(() => {
    const roster = allStudents
      .filter((s) => s.classGroup === classGroup)
      .map((s) => ({ id: s.id, initials: initialsOf(s.name), name: s.name, status: 'present', note: '' }));
    setStudents(roster);
    setJustSubmitted(false);
  }, [classGroup, allStudents]);

  const counts = useMemo(
    () => ({
      present: students.filter((s) => s.status === 'present').length,
      absent: students.filter((s) => s.status === 'absent').length,
      late: students.filter((s) => s.status === 'late').length,
    }),
    [students]
  );

  function setStatus(id, status) {
    setStudents((list) => list.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  function setNote(id, note) {
    setStudents((list) => list.map((s) => (s.id === id ? { ...s, note } : s)));
  }

  function toggleSelect(id) {
    setSelected((sel) => ({ ...sel, [id]: !sel[id] }));
  }

  function handleSubmit() {
    if (students.length === 0) return;
    const record = submitAttendance(session.schoolId, {
      date,
      classGroup,
      subject,
      counts,
      roster: students,
      submittedBy: session.name,
    });
    setHistory((h) => [record, ...h]);
    setJustSubmitted(true);
  }

  if (classGroups.length === 0) {
    return (
      <Card>
        <h1 className="text-xl font-bold mb-2">Attendance Register</h1>
        <p className="text-sm" style={{ color: 'var(--sh-ink-faint)' }}>
          No classes yet — ask your school owner to add students with a class/form before taking attendance.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Attendance Register</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--sh-ink-faint)' }}>Mark and submit daily attendance</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium" style={{ color: 'var(--sh-ink-soft)' }}>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--sh-black)' }} /> {counts.present} Present
          </span>
          <span>{counts.absent} Absent</span>
          <span>{counts.late} Late</span>
        </div>
      </div>

      <Card padded={false} className="overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--sh-border)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium" style={{ borderColor: 'var(--sh-border-strong)' }}>
              <Calendar size={14} style={{ color: 'var(--sh-ink-faint)' }} />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent outline-none" />
            </label>
            <select
              value={classGroup}
              onChange={(e) => setClassGroup(e.target.value)}
              className="rounded-xl border px-3.5 py-2.5 text-sm font-medium bg-transparent outline-none"
              style={{ borderColor: 'var(--sh-border-strong)' }}
            >
              {classGroups.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-xl border px-3.5 py-2.5 text-sm font-medium bg-transparent outline-none"
              style={{ borderColor: 'var(--sh-border-strong)' }}
            >
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <span
            className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm"
            style={{ borderColor: 'var(--sh-border)', color: 'var(--sh-ink-faint)' }}
          >
            <Clock size={14} /> {students.length} students
          </span>
        </div>

        <div className="grid grid-cols-[28px_2fr_1fr_1fr_1fr_1.4fr] gap-3 px-5 pt-4 pb-2 sh-label">
          <span />
          <span>Student</span>
          <span>Present</span>
          <span>Absent</span>
          <span>Late</span>
          <span>Note</span>
        </div>

        <StudentRosterTable
          students={students}
          onStatusChange={isEducator ? setStatus : undefined}
          onNoteChange={isEducator ? setNote : undefined}
          selected={selected}
          onToggleSelect={isEducator ? toggleSelect : undefined}
          isLast
        />

        <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: 'var(--sh-border)' }}>
          {justSubmitted ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--sh-ink-soft)' }}>
              <CheckCircle2 size={16} /> Submitted and signed by {session.name}
            </span>
          ) : <span />}
          {isEducator && <Button onClick={handleSubmit}>Submit &amp; sign off</Button>}
        </div>
      </Card>

      {history.length > 0 && (
        <Card padded={false} className="overflow-hidden">
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--sh-border)' }}>
            <span className="text-sm font-semibold">Submission history</span>
          </div>
          <ul>
            {history.slice(0, 5).map((h, i) => (
              <li
                key={h.id}
                className={`flex items-center justify-between px-5 py-3 text-sm ${i !== Math.min(history.length, 5) - 1 ? 'border-b' : ''}`}
                style={{ borderColor: 'var(--sh-border)' }}
              >
                <span>{h.classGroup} &middot; {h.subject} &middot; {h.date}</span>
                <span style={{ color: 'var(--sh-ink-faint)' }}>
                  {h.counts.present} present, {h.counts.absent} absent, {h.counts.late} late &middot; signed by {h.submittedBy}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
