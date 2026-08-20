import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Field, Input, Button } from './ui';

/**
 * Owner-only modal for adding a student or educator to the school.
 * Educators get extra permissions (attendance, resources) once added.
 * onCreate is expected to persist the record via the store.
 */
export default function UserManagementModal({ onClose, onCreate }) {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', classGroup: '' });
  const [error, setError] = useState('');

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    onCreate?.({ role, ...form });
    onClose?.();
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center px-4" style={{ background: 'rgba(12,13,14,0.45)' }}>
      <div className="w-full max-w-md rounded-3xl border p-6" style={{ background: 'var(--sh-surface)', borderColor: 'var(--sh-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Add person</h2>
          <button type="button" onClick={onClose} aria-label="Close" style={{ color: 'var(--sh-ink-faint)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex rounded-xl border p-1 mb-5" style={{ borderColor: 'var(--sh-border-strong)' }}>
          {['student', 'educator'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className="flex-1 rounded-lg py-2 text-sm font-semibold capitalize"
              style={{ background: role === r ? 'var(--sh-black)' : 'transparent', color: role === r ? '#fff' : 'var(--sh-ink-soft)' }}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name">
            <Input placeholder="Full name" value={form.name} onChange={handleChange('name')} />
          </Field>
          <Field label="Email">
            <Input type="email" placeholder="name@school.ac.ke" value={form.email} onChange={handleChange('email')} />
          </Field>
          <Field label={role === 'student' ? 'Class / Form' : 'Subject(s)'}>
            <Input
              placeholder={role === 'student' ? 'e.g. Form 3B' : 'e.g. Mathematics, Physics'}
              value={form.classGroup}
              onChange={handleChange('classGroup')}
            />
          </Field>

          {error && (
            <p className="flex items-center gap-2 text-sm rounded-xl px-3.5 py-3" style={{ background: '#fdecea', color: '#c0392b' }}>
              <AlertCircle size={15} className="shrink-0" /> {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add {role}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
