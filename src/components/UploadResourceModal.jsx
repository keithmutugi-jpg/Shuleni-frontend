import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Field, Input, Button } from './ui';

const SUBJECTS = ['Mathematics', 'Science', 'Literature', 'History', 'Geography', 'Physical Education'];

/**
 * Lets an educator upload a file into a subject folder and choose
 * whether it's open to everyone or restricted to specific classes.
 */
export default function UploadResourceModal({ onClose, onUpload }) {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [title, setTitle] = useState('');
  const [restricted, setRestricted] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    onUpload?.({ subject, title, restricted });
    onClose?.();
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center px-4" style={{ background: 'rgba(12,13,14,0.45)' }}>
      <div className="w-full max-w-md rounded-3xl border p-6" style={{ background: 'var(--sh-surface)', borderColor: 'var(--sh-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Add resource</h2>
          <button type="button" onClick={onClose} aria-label="Close" style={{ color: 'var(--sh-ink-faint)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="File name">
            <Input placeholder="e.g. Chapter 4 — Quadratic Equations.pdf" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>

          <label className="block">
            <span className="sh-label block mb-2">Subject folder</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border px-3.5 py-3 text-sm bg-transparent outline-none"
              style={{ borderColor: 'var(--sh-border-strong)' }}
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2.5 text-sm select-none">
            <input type="checkbox" checked={restricted} onChange={(e) => setRestricted(e.target.checked)} />
            Restrict access to specific classes
          </label>

          <div
            className="rounded-2xl border border-dashed flex flex-col items-center justify-center gap-2 py-8"
            style={{ borderColor: 'var(--sh-border-strong)', color: 'var(--sh-ink-faint)' }}
          >
            <Upload size={20} />
            <span className="text-xs">Drag a file here, or click to browse</span>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
