import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, X } from 'lucide-react';
import Logo from '../components/Logo';
import { Card, Button } from '../components/ui';
import { examQuestions } from '../data/mock';

const EXAM_MINUTES = 30;

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Timed, distraction-free exam screen. No top nav or chrome —
 * just the question, a countdown, and forward-only navigation to
 * discourage tab-switching while a test is in progress.
 */
export default function ExamInterface() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_MINUTES * 60);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [violations, setViolations] = useState(0);
  const timerRef = useRef(null);

  const question = examQuestions[index];
  const answered = Object.keys(answers).length;
  const low = secondsLeft <= 60;

  useEffect(() => {
    if (!started) return;
    if (secondsLeft <= 0) {
      // auto-submit when time's up
      handleSubmit();
      return;
    }
    timerRef.current = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timerRef.current);
  }, [started, secondsLeft]);

  useEffect(() => {
    if (!started) return undefined;

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setViolations((v) => {
          const nv = v + 1;
          if (nv >= 3) handleSubmit();
          return nv;
        });
      }
    };

    const handleBlur = () => {
      setViolations((v) => {
        const nv = v + 1;
        if (nv >= 3) handleSubmit();
        return nv;
      });
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [started]);

  function handleStart() {
    setAnswers({});
    setIndex(0);
    setSecondsLeft(EXAM_MINUTES * 60);
    setViolations(0);
    setStarted(true);
  }

  function handleSubmit() {
    // save a quick local result snapshot
    const result = {
      takenAt: new Date().toISOString(),
      durationSeconds: EXAM_MINUTES * 60 - secondsLeft,
      answers,
      violations,
    };
    try {
      const prev = JSON.parse(localStorage.getItem('examResults') || '[]');
      prev.push(result);
      localStorage.setItem('examResults', JSON.stringify(prev));
    } catch (e) {
      localStorage.setItem('examResults', JSON.stringify([result]));
    }
    clearInterval(timerRef.current);
    setStarted(false);
    navigate('/student/home');
  }

  if (!started) {
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
          <Link to=".." className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--sh-ink-faint)' }}>
            <X size={15} /> Exit
          </Link>
        </div>

        <Card className="w-full max-w-2xl text-center">
          <h2 className="text-lg font-bold mb-2">Ready to start your exam?</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--sh-ink-faint)' }}>
            This exam is timed for {EXAM_MINUTES} minutes. Once you start, the timer will begin and switching tabs
            or leaving the window may be recorded and could lead to auto-submission.
          </p>
          <div className="flex justify-center">
            <Button onClick={handleStart}>Start exam</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="sh-canvas flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
        <Logo size="sm" withName={false} />
        <div className="space-y-1">
          <div
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold"
            style={{ background: low ? '#c0392b' : 'var(--sh-black)', color: '#fff' }}
          >
            <Clock size={15} /> {formatTime(secondsLeft)}
          </div>
          {violations > 0 && (
            <div className="text-[12px] font-medium" style={{ color: '#c0392b' }}>
              Warning: {violations} potential policy {violations === 1 ? 'violation' : 'violations'} detected
            </div>
          )}
        </div>
        <Link to=".." className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--sh-ink-faint)' }}>
          <X size={15} /> Exit
        </Link>
      </div>

      <div className="w-full max-w-2xl mb-4 flex items-center gap-1.5">
        {examQuestions.map((q, i) => (
          <span
            key={q.id}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: i <= index ? 'var(--sh-black)' : 'var(--sh-border-strong)' }}
          />
        ))}
      </div>

      <Card className="w-full max-w-2xl">
        <p className="sh-label mb-3">
          Question {index + 1} of {examQuestions.length} &middot; {answered} answered
        </p>
        <h2 className="text-lg font-bold mb-6">{question.prompt}</h2>

        <div className="space-y-3">
          {question.options.map((opt) => {
            const checked = answers[question.id] === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, [question.id]: opt }))}
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
          {index < examQuestions.length - 1 ? (
            <Button onClick={() => setIndex((i) => Math.min(examQuestions.length - 1, i + 1))}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit exam</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
