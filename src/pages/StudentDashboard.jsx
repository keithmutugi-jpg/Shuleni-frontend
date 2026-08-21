import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Pill, Button } from '../components/ui';
import { useAuth } from '../store/AuthContext';
import { listExamResults, listExams } from '../store/db';
import { studentSchedule } from '../data/mock';
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
  const examBank = schoolExams.length > 0 ? schoolExams[0] : fallbackExamBank;
  const today = new Date();

  return (
    <div className="space-y-6">
      <Card className="flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="sh-label mb-2">{today.toDateString()}</p>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome, {session.name.split(' ')[0]}!</h1>
          <p className="text-sm mt-1.5" style={{ color: 'var(--sh-ink-soft)' }}>
            You have <span className="font-semibold" style={{ color: 'var(--sh-ink)' }}>{studentSchedule.length} classes</span> today and{' '}
            <span className="font-semibold" style={{ color: 'var(--sh-ink)' }}>1 exam</span> ready to take.
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
            {studentSchedule.map((c, i) => (
              <li
                key={c.id}
                className={`flex items-center gap-3 px-5 py-4 ${i !== studentSchedule.length - 1 ? 'border-b' : ''}`}
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

        <Card>
          <h3 className="font-bold mb-4">{examBank.title}</h3>
          <p className="text-sm mb-5" style={{ color: 'var(--sh-ink-faint)' }}>
            {examBank.questions.length} questions &middot; {examBank.minutes} minutes &middot; one attempt is graded automatically when you submit.
          </p>
          <Link to="/student/exam">
            <Button className="w-full">Start when ready</Button>
          </Link>

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
