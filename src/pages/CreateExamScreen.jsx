import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save } from 'lucide-react';
import { Card, Field, Input, Button } from '../components/ui';
import { useAuth } from '../store/AuthContext';
import { createExam } from '../store/db';

function blankQuestion() {
  return { prompt: '', options: ['', '', '', ''], correctIndex: 0 };
}

/**
 * Lets an educator build a real multiple-choice exam that students
 * can then take from their dashboard. Saved per-school via db.js.
 */
export default function CreateExamScreen() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(15);
  const [questions, setQuestions] = useState([blankQuestion()]);
  const [error, setError] = useState('');

  function updateQuestion(index, patch) {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function updateOption(qIndex, oIndex, value) {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIndex ? { ...q, options: q.options.map((o, j) => (j === oIndex ? value : o)) } : q
      )
    );
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, blankQuestion()]);
  }

  function removeQuestion(index) {
    setQuestions((qs) => qs.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return setError('Give the exam a title.');
    if (!minutes || minutes < 1) return setError('Set a valid time limit.');
    for (const q of questions) {
      if (!q.prompt.trim()) return setError('Every question needs a prompt.');
      if (q.options.some((o) => !o.trim())) return setError('Every question needs all 4 options filled in.');
    }
    setError('');
    createExam(session.schoolId, {
      title: title.trim(),
      minutes: Number(minutes),
      questions: questions.map((q, i) => ({ id: i + 1, ...q })),
    });
    navigate('/educator/home');
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Create exam</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--sh-ink-faint)' }}>
          Students will see this listed as their next exam on their dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card className="space-y-4">
          <Field label="Exam title">
            <Input
              placeholder="e.g. Mathematics — Grade 8A Mid-term"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field label="Time limit (minutes)">
            <Input
              type="number"
              min="1"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </Field>
        </Card>

        {questions.map((q, qi) => (
          <Card key={qi} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="sh-label">Question {qi + 1}</span>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qi)}
                  aria-label={`Remove question ${qi + 1}`}
                  style={{ color: 'var(--sh-ink-faint)' }}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
            <Field label="Question prompt">
              <Input
                placeholder="e.g. Solve for x: 2x² − 8 = 0"
                value={q.prompt}
                onChange={(e) => updateQuestion(qi, { prompt: e.target.value })}
              />
            </Field>
            <div className="space-y-2">
              <span className="sh-label block">Options — select the correct one</span>
              {q.options.map((opt, oi) => (
                <label key={oi} className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={q.correctIndex === oi}
                    onChange={() => updateQuestion(qi, { correctIndex: oi })}
                  />
                  <Input
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                  />
                </label>
              ))}
            </div>
          </Card>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold"
          style={{ borderColor: 'var(--sh-border-strong)', color: 'var(--sh-ink)' }}
        >
          <Plus size={15} /> Add another question
        </button>

        {error && (
          <p className="text-sm rounded-xl px-3.5 py-3" style={{ background: '#fdecea', color: '#c0392b' }}>
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/educator/home')}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            <Save size={15} /> Save exam
          </Button>
        </div>
      </form>
    </div>
  );
}
