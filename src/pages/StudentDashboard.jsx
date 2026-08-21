import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Pill, Button } from '../components/ui';
import { useAuth } from '../store/AuthContext';
import { listExamResults, listExams, listTimetable, listClasses, listUsers } from '../store/db';
import { examBank as fallbackExamBank } from '../data/examBank';

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

export default function StudentDashboard() {
  const { session } = useAuth();
  const results = listExamResults(session.schoolId, session.userId);
  const schoolExams = listExams(session.schoolId);
  const student = listUsers(session.schoolId).find((user) => user.id === session.userId);
  const assignedClassIds = new Set(listClasses(session.schoolId).filter((item) => item.name === student?.classGroup).map((item) => item.id));
  const exams = schoolExams.length > 0 ? schoolExams.filter((exam) => !exam.classId || assignedClassIds.has(exam.classId)) : [fallbackExamBank];
  const schedule = listTimetable(session.schoolId, session.userId);
  const today = new Date();

  return (
    <div className="space-y-6">
      <Card className="flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="sh-label mb-2">{today.toDateString()}</p>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome, {session.name.split(' ')[0]}!</h1>
          <p className="text-sm mt-1.5" style={{ color: 'var(--sh-ink-soft)' }}>
            You have <span className="font-semibold" style={{ color: 'var(--sh-ink)' }}>{schedule.length} classes</span> in your timetable and{' '}
            <span className="font-semibold" style={{ color: 'var(--sh-ink)' }}>{exams.length} exams</span> available.
          </p>
        </div>
        <DateBadge month={today.toLocaleString('en-GB', { month: 'short' }).toUpperCase()} day={today.getDate()} />
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 rounded-t-2xl" style={{ background: 'var(--sh-black)', color: '#fff' }}>
            <span className="text-sm font-semibold">Today's Schedule</span>
            <ChevronRight size={16} />
          </div>
          <ul>
            {schedule.length === 0 && <li className="px-5 py-6 text-sm" style={{ color: 'var(--sh-ink-faint)' }}>Your timetable is empty.</li>}
            {schedule.map((c, i) => (
              <li
                key={c.id}
                className={`flex items-center gap-3 px-5 py-4 ${i !== schedule.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: 'var(--sh-border)' }}
              >
                <span className="w-1 self-stretch rounded-full" style={{ background: 'var(--sh-border-strong)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{c.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--sh-ink-faint)' }}>{c.day} · {c.startsAt} – {c.endsAt}</p>
                </div>
                <Pill>{c.room}</Pill>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="font-bold mb-4">Available exams</h3>
          <div className="space-y-3">
            {exams.map((exam) => <div key={exam.id} className="border rounded-xl p-3" style={{ borderColor: 'var(--sh-border)' }}>
              <p className="font-semibold text-sm">{exam.title}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--sh-ink-faint)' }}>{exam.questions.length} questions &middot; {exam.minutes} minutes</p>
              <Link to={`/student/exam/${exam.id}`}><Button className="w-full mt-3">Start exam</Button></Link>
            </div>)}
          </div>

          {results.length > 0 && (
            <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--sh-border)' }}>
              <p className="sh-label mb-2">Your results</p>
              {results.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm py-1.5">
                  <span style={{ color: 'var(--sh-ink-soft)' }}>{new Date(r.submittedAt).toLocaleDateString()}</span>
                  <span className="font-semibold">{r.score} / {r.total}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
