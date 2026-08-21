import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import Logo from '../components/Logo';
import { Card, Button } from '../components/ui';
import { useAuth } from '../store/AuthContext';
import { submitExamResult, listExams } from '../store/db';
import { examBank as fallbackExamBank } from '../data/examBank';

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Timed, distraction-free exam screen. No top nav or chrome — just
 * the question, a countdown, and forward-only navigation. Submitting
 * (by choice or when time runs out) actually grades the attempt
 * against the answer key and saves the result for this student.
 */
export default function ExamInterface() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const examId = window.location.pathname.split('/').pop();
  const schoolExams = listExams(session.schoolId);
  const examBank = schoolExams.find((exam) => exam.id === examId) || (examId === 'exam' ? schoolExams[0] : null) || fallbackExamBank;
  const [consented, setConsented] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(examBank.minutes * 60);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [violations, setViolations] = useState(0);
  const MAX_VIOLATIONS = 3;

  useEffect(() => {
    if (!consented || result || secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, result, consented]);

  useEffect(() => {
    if (secondsLeft === 0 && !result) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  // Basic anti-plagiarism: flag when the student leaves the exam tab/window.
  // After MAX_VIOLATIONS the exam auto-submits with whatever's answered so far.
  useEffect(() => {
    if (result) return undefined;

    function registerViolation() {
      setViolations((v) => v + 1);
    }
    function handleVisibility() {
      if (document.visibilityState === 'hidden') registerViolation();
    }
    function handleBlur() {
      registerViolation();
    }

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [result]);

  useEffect(() => {
    if (violations >= MAX_VIOLATIONS && !result) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [violations]);

  const question = examBank.questions[index];
  const answeredCount = Object.keys(answers).length;
  const low = secondsLeft <= 60;

  function handleSubmit() {
    const total = examBank.questions.length;
    const correct = examBank.questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const entry = submitExamResult(session.schoolId, {
      studentId: session.userId,
      studentName: session.name,
      examTitle: examBank.title,
      score: correct,
      total,
      timeTakenSeconds: examBank.minutes * 60 - secondsLeft,
    });
    setResult(entry);
  }

  if (result) {
    return (
      <div className="sh-canvas flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md text-center">
          <CheckCircle2 size={36} className="mx-auto mb-4" style={{ color: 'var(--sh-black)' }} />
          <h1 className="text-xl font-extrabold mb-1">Exam submitted</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--sh-ink-faint)' }}>{examBank.title}</p>
          <p className="text-4xl font-extrabold mb-1">{result.score} / {result.total}</p>
          <p className="text-sm mb-6" style={{ color: 'var(--sh-ink-soft)' }}>
            {Math.round((result.score / result.total) * 100)}% &middot; submitted in {formatTime(result.timeTakenSeconds)}
          </p>
          <Button className="w-full" onClick={() => navigate('/student/home')}>Back to dashboard</Button>
        </Card>
      </div>
    );
  }

  if (!consented) {
    return <div className="sh-canvas flex items-center justify-center px-4 py-8"><Card className="w-full max-w-xl">
      <AlertTriangle size={34} className="mb-4" style={{ color: '#c0392b' }} />
      <h1 className="text-xl font-extrabold mb-2">Before you begin</h1>
      <p className="text-sm leading-6" style={{ color: 'var(--sh-ink-soft)' }}>This assessment is monitored. Plagiarism, collusion, using unauthorised help, or leaving the exam window may be flagged and can lead to disciplinary consequences.</p>
      <label className="flex gap-3 items-start mt-6 text-sm"><input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} className="mt-1" /> I promise not to cheat or plagiarise, and I understand and accept the consequences if I do.</label>
      <Button className="w-full mt-6" disabled={!consented} onClick={() => setConsented(true)}>I understand, start exam</Button>
      <Button variant="secondary" className="w-full mt-2" onClick={() => navigate('/student/home')}>Cancel</Button>
    </Card></div>;
  }

  return (
    <div className="sh-canvas flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
        <Logo size="sm" withName={false} />
        <div
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold"
          style={{ background: low ? '#c0392b' : 'var(--sh-black)', color: '#fff' }}
        >
          <Clock size={15} /> {formatTime(secondsLeft)}
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/home')}
          className="inline-flex items-center gap-1 text-sm font-medium"
          style={{ color: 'var(--sh-ink-faint)' }}
        >
          <X size={15} /> Exit
        </button>
      </div>

      <div className="w-full max-w-2xl mb-4 flex items-center gap-1.5">
        {examBank.questions.map((q, i) => (
          <span
            key={q.id}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: i <= index ? 'var(--sh-black)' : 'var(--sh-border-strong)' }}
          />
        ))}
      </div>

      {violations > 0 && (
        <div
          className="w-full max-w-2xl mb-4 rounded-xl px-4 py-2.5 text-sm font-semibold"
          style={{ background: '#fdecea', color: '#c0392b' }}
        >
          Warning: leaving the exam tab is being tracked ({violations}/{MAX_VIOLATIONS}). The exam
          auto-submits after {MAX_VIOLATIONS} violations.
        </div>
      )}

      <Card className="w-full max-w-2xl">
        <p className="sh-label mb-3">
          Question {index + 1} of {examBank.questions.length} &middot; {answeredCount} answered
        </p>
        <h2 className="text-lg font-bold mb-6">{question.prompt}</h2>

        <div className="space-y-3">
          {question.options.map((opt, optIndex) => {
            const checked = answers[question.id] === optIndex;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, [question.id]: optIndex }))}
                className="w-full text-left flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm"
                style={{
                  borderColor: checked ? 'var(--sh-black)' : 'var(--sh-border-strong)',
                  background: checked ? '#f5f5f6' : 'transparent',
                }}
              >
                <span
                  className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                  style={{ borderColor: checked ? 'var(--sh-black)' : 'var(--sh-border-strong)' }}
                >
                  {checked && <span className="w-2 h-2 rounded-full" style={{ background: 'var(--sh-black)' }} />}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-8">
          <Button variant="secondary" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
            Previous
          </Button>
          {index < examBank.questions.length - 1 ? (
            <Button onClick={() => setIndex((i) => Math.min(examBank.questions.length - 1, i + 1))}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit exam</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
