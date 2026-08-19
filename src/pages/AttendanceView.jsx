import { useMemo, useState } from 'react';
import { Calendar, ChevronDown, Clock } from 'lucide-react';
import { Card, Button } from '../components/ui';
import StudentRosterTable from '../components/StudentRosterTable';
import { rosterStudents } from '../data/mock';

function DropdownPill({ icon: Icon, children }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium"
      style={{ borderColor: 'var(--sh-border-strong)', color: 'var(--sh-ink)' }}
    >
      {Icon && <Icon size={14} style={{ color: 'var(--sh-ink-faint)' }} />}
      {children}
      <ChevronDown size={13} style={{ color: 'var(--sh-ink-faint)' }} />
    </button>
  );
}

export default function AttendanceView() {
  const [students, setStudents] = useState(rosterStudents);
  const [selected, setSelected] = useState({});

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
          <div className="flex items-center gap-3">
            <DropdownPill icon={Calendar}>Mon, 18 Aug 2026</DropdownPill>
            <DropdownPill>Form 3B</DropdownPill>
            <DropdownPill>Mathematics</DropdownPill>
          </div>
          <span
            className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm"
            style={{ borderColor: 'var(--sh-border)', color: 'var(--sh-ink-faint)' }}
          >
            <Clock size={14} /> Period 2 &middot; 10:00 &ndash; 11:30
          </span>
        </div>

        <div
          className="grid grid-cols-[28px_2fr_1fr_1fr_1fr_1.4fr] gap-3 px-5 pt-4 pb-2 sh-label"
        >
          <span />
          <span>Student</span>
          <span>Present</span>
          <span>Absent</span>
          <span>Late</span>
          <span>Note</span>
        </div>

        <StudentRosterTable
          students={students}
          onStatusChange={setStatus}
          onNoteChange={setNote}
          selected={selected}
          onToggleSelect={toggleSelect}
          isLast
        />

        <div className="flex justify-end px-5 py-4 border-t" style={{ borderColor: 'var(--sh-border)' }}>
          <Button>Submit &amp; sign off</Button>
        </div>
      </Card>
    </div>
  );
}
