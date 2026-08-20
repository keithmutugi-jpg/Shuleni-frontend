import { ChevronRight } from 'lucide-react';
import { Card, Pill } from '../components/ui';
import { useAuth } from '../store/AuthContext';
import { listUsers, listExamResults, listAttendance } from '../store/db';
import { todaysClasses } from '../data/mock';

function DateBadge({ month, day }) {
  return (
    <div
      className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
      style={{ background: 'var(--sh-black)', color: '#fff' }}
    >
      <span className="text-[10px] font-bold tracking-widest opacity-70">{month}</span>
      <span className="text-xl font-extrabold leading-none">{day}</span>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div
      className="flex items-center justify-between px-5 py-3.5 rounded-t-2xl"
      style={{ background: 'var(--sh-black)', color: '#fff' }}
    >
      <span className="text-sm font-semibold">{title}</span>
      <ChevronRight size={16} />
    </div>
  );
}

export default function EducatorDashboard() {
  const { session } = useAuth();
  const today = new Date();
  const students = listUsers(session.schoolId).filter((u) => u.role === 'student');
  const classCount = new Set(students.map((s) => s.classGroup).filter(Boolean)).size;
  const recentResults = listExamResults(session.schoolId).slice(0, 5);
  const recentAttendance = listAttendance(session.schoolId).slice(0, 5);

  return (
    <div className="space-y-6">
      <Card className="flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="sh-label mb-2">{today.toDateString()}</p>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome, {session.name.split(' ')[0]}!</h1>
          <p className="text-sm mt-1.5" style={{ color: 'var(--sh-ink-soft)' }}>
            You have <span className="font-semibold" style={{ color: 'var(--sh-ink)' }}>{classCount || todaysClasses.length} classes</span> and{' '}
            <span className="font-semibold" style={{ color: 'var(--sh-ink)' }}>{students.length} students</span> in your school.
          </p>
        </div>
        <DateBadge month={today.toLocaleString('en-GB', { month: 'short' }).toUpperCase()} day={today.getDate()} />
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card padded={false} className="overflow-hidden">
          <SectionHeader title="Today's Classes" />
          <ul>
            {todaysClasses.map((c, i) => (
              <li
                key={c.id}
                className={`flex items-center gap-3 px-5 py-4 ${i !== todaysClasses.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: 'var(--sh-border)' }}
              >
                <span className="w-1 self-stretch rounded-full" style={{ background: 'var(--sh-border-strong)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{c.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--sh-ink-faint)' }}>{c.time}</p>
                </div>
                <Pill>{c.room}</Pill>
              </li>
            ))}
          </ul>
        </Card>

        <Card padded={false} className="overflow-hidden">
          <SectionHeader title="Recent activity" />
          {recentResults.length === 0 && recentAttendance.length === 0 ? (
            <p className="px-5 py-8 text-sm text-center" style={{ color: 'var(--sh-ink-faint)' }}>
              No exam submissions or attendance records yet.
            </p>
          ) : (
            <ul>
              {recentResults.map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--sh-border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{r.studentName} &mdash; {r.examTitle}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--sh-ink-faint)' }}>
                      {new Date(r.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <Pill>{r.score}/{r.total}</Pill>
                </li>
              ))}
              {recentAttendance.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-5 py-4 border-b last:border-b-0" style={{ borderColor: 'var(--sh-border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{a.classGroup} &middot; {a.subject} attendance</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--sh-ink-faint)' }}>signed by {a.submittedBy}</p>
                  </div>
                  <Pill>{a.counts.present} present</Pill>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
