import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, Field, Input, Button } from '../components/ui';
import { useAuth } from '../store/AuthContext';
import { addTimetableEntry, listClasses, listTimetable, removeTimetableEntry } from '../store/db';

export default function Timetable() {
  const { session } = useAuth();
  const [entries, setEntries] = useState(() => listTimetable(session.schoolId, session.userId));
  const classes = listClasses(session.schoolId);
  const [form, setForm] = useState({ title: '', day: 'Monday', startsAt: '08:00', endsAt: '09:00', room: '' });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  function addEntry(event) {
    event.preventDefault();
    if (!form.title.trim()) return;
    const entry = addTimetableEntry(session.schoolId, session.userId, { ...form, title: form.title.trim() });
    setEntries((current) => [entry, ...current]);
    setForm((current) => ({ ...current, title: '', room: '' }));
  }
  function remove(id) { removeTimetableEntry(session.schoolId, session.userId, id); setEntries((current) => current.filter((item) => item.id !== id)); }
  return <div className="space-y-6"><div><h1 className="text-2xl font-extrabold">My timetable</h1><p className="text-sm mt-1" style={{ color: 'var(--sh-ink-faint)' }}>Plan your own week. Add or remove classes without changing the school class list.</p></div>
    <Card><form onSubmit={addEntry} className="grid md:grid-cols-6 gap-3 items-end"><Field label="Class"><select value={form.title} onChange={update('title')} className="w-full rounded-xl border px-3 py-3 text-sm bg-transparent" style={{ borderColor: 'var(--sh-border-strong)' }}><option value="">Choose a class</option>{classes.map((item) => <option key={item.id} value={`${item.subject} — ${item.name}`}>{item.subject} — {item.name}</option>)}</select></Field><Field label="Day"><select value={form.day} onChange={update('day')} className="w-full rounded-xl border px-3 py-3 text-sm bg-transparent" style={{ borderColor: 'var(--sh-border-strong)' }}>{['Monday','Tuesday','Wednesday','Thursday','Friday'].map((day) => <option key={day}>{day}</option>)}</select></Field><Field label="Starts"><Input type="time" value={form.startsAt} onChange={update('startsAt')} /></Field><Field label="Ends"><Input type="time" value={form.endsAt} onChange={update('endsAt')} /></Field><Field label="Room"><Input value={form.room} onChange={update('room')} placeholder="Optional" /></Field><Button type="submit"><Plus size={15} /> Add</Button></form></Card>
    <Card padded={false} className="overflow-hidden"><div className="grid grid-cols-[1fr_1fr_1fr_1fr_32px] gap-3 px-5 py-3 sh-label border-b" style={{ borderColor: 'var(--sh-border)' }}><span>Class</span><span>Day</span><span>Time</span><span>Room</span><span /></div>{entries.length === 0 ? <p className="p-6 text-sm" style={{ color: 'var(--sh-ink-faint)' }}>No classes added yet.</p> : entries.map((entry) => <div key={entry.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_32px] gap-3 items-center px-5 py-4 text-sm border-b" style={{ borderColor: 'var(--sh-border)' }}><span className="font-semibold">{entry.title}</span><span>{entry.day}</span><span>{entry.startsAt} – {entry.endsAt}</span><span>{entry.room || '—'}</span><button type="button" aria-label="Remove class" onClick={() => remove(entry.id)}><Trash2 size={15} style={{ color: 'var(--sh-ink-faint)' }} /></button></div>)}</Card>
  </div>;
}
