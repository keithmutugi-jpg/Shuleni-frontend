import { ChevronRight } from 'lucide-react';
import { Card, Pill } from '../components/ui';
import { todaysClasses, upcomingExams } from '../data/mock';

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
  return (
    <div className="space-y-6">
      <Card className="flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="sh-label mb-2">Monday, 18 Aug 2026</p>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome, Teacher John!</h1>
          <p className="text-sm mt-1.5" style={{ color: 'var(--sh-ink-soft)' }}>
            You have <span className="font-semibold" style={{ color: 'var(--sh-ink)' }}>3 classes</span> and{' '}
            <span className="font-semibold" style={{ color: 'var(--sh-ink)' }}>2 exams</span> coming up this week.
          </p>
        </div>
        <DateBadge month="AUG" day="18" />
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
          <SectionHeader title="Upcoming Exams" />
          <ul>
            {upcomingExams.map((ex, i) => (
              <li
                key={ex.id}
                className={`flex items-center gap-3 px-5 py-4 ${i !== upcomingExams.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: 'var(--sh-border)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl border flex flex-col items-center justify-center shrink-0"
                  style={{ borderColor: 'var(--sh-border-strong)' }}
                >
                  <span className="text-[9px] font-bold" style={{ color: 'var(--sh-ink-faint)' }}>{ex.day}</span>
                  <span className="text-sm font-extrabold leading-none">{ex.date}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{ex.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--sh-ink-faint)' }}>{ex.when}</p>
                </div>
                <Pill>{ex.tag}</Pill>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
