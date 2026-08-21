import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { Card, Field, Input, Button } from '../components/ui';
import { useAuth } from '../store/AuthContext';
import { createClass } from '../store/db';

export default function CreateClassScreen() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [form, setForm] = useState({ name: '', subject: '', room: '', startsAt: '', endsAt: '' });
  const [error, setError] = useState('');
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.subject.trim()) return setError('Class name and subject are required.');
    if (!form.startsAt || !form.endsAt) return setError('Set a start and end time for this class.');
    if (form.endsAt <= form.startsAt) return setError('The end time must be after the start time.');
    createClass(session.schoolId, { ...form, name: form.name.trim(), subject: form.subject.trim(), educatorId: session.userId });
    navigate('/educator/timetable');
  }

  return <div className="max-w-xl space-y-6"><div><h1 className="text-2xl font-extrabold">Add class</h1><p className="text-sm mt-1" style={{ color: 'var(--sh-ink-faint)' }}>Create a class separately from its exams and set its teaching time.</p></div>
    <form onSubmit={submit}><Card className="space-y-4"><Field label="Class name"><Input placeholder="e.g. Form 3B" value={form.name} onChange={update('name')} /></Field><Field label="Subject"><Input placeholder="e.g. Mathematics" value={form.subject} onChange={update('subject')} /></Field><Field label="Room"><Input placeholder="e.g. Room 12" value={form.room} onChange={update('room')} /></Field><div className="grid sm:grid-cols-2 gap-4"><Field label="Start"><Input type="datetime-local" value={form.startsAt} onChange={update('startsAt')} /></Field><Field label="End"><Input type="datetime-local" value={form.endsAt} onChange={update('endsAt')} /></Field></div>{error && <p className="text-sm rounded-xl px-3 py-2" style={{ background: '#fdecea', color: '#c0392b' }}>{error}</p>}<div className="flex gap-3"><Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/educator/timetable')}>Cancel</Button><Button type="submit" className="flex-1"><Save size={15} /> Save class</Button></div></Card></form>
  </div>;
}
