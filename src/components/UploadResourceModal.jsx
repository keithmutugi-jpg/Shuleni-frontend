import { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { Field, Input, Button } from './ui';
import { ALL_CLASSES } from '../data/mock';

const SUBJECTS = ['Mathematics', 'Science', 'Literature', 'History', 'Geography', 'Physical Education'];

/**
 * Lets an educator upload a file into a subject folder and choose
 * whether it's open to everyone or restricted to specific classes.
 * onUpload persists the record via the store (see ResourceLibrary).
 */
export default function UploadResourceModal({ onClose, onUpload }) {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [title, setTitle] = useState('');
  const [restricted, setRestricted] = useState(true);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  function handleFilePick(e) {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const name = fileName || title;
    if (!name.trim()) {
      setError('Choose a file or give it a name.');
      return;
    }
    onUpload?.({ subject, fileName: name, restricted });
    onClose?.();
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center px-4"
      style={{ background: 'rgba(12,13,14,0.45)' }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="w-full max-w-md rounded-3xl border p-6"
        style={{ background: 'var(--sh-surface)', borderColor: 'var(--sh-border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Add resource</h2>
          <button type="button" onClick={onClose} aria-label="Close" style={{ color: 'var(--sh-ink-faint)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="sh-label block mb-2">File</span>
            <label
              className="rounded-2xl border border-dashed flex flex-col items-center justify-center gap-2 py-8 cursor-pointer"
              style={{ borderColor: 'var(--sh-border-strong)', color: 'var(--sh-ink-faint)' }}
            >
              <Upload size={20} />
              <span className="text-xs">{fileName || 'Click to choose a file'}</span>
              <input type="file" onChange={handleFilePick} className="hidden" />
            </label>
          </div>

          {!fileName && (
            <Field label="Or just give it a name">
              <Input placeholder="e.g. Chapter 4 — Quadratic Equations.pdf" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
          )}

          {/* Subject folder */}
          <label className="block">
            <span className="sh-label block mb-2">Subject folder</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border px-3.5 py-3 text-sm bg-transparent outline-none"
              style={{ borderColor: 'var(--sh-border-strong)', color: 'var(--sh-ink)' }}
            >
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          {/* Access toggle */}
          <label className="flex items-center gap-2.5 text-sm select-none cursor-pointer">
            <input
              type="checkbox"
              checked={restricted}
              onChange={(e) => setRestricted(e.target.checked)}
            />
            Restrict access to specific classes
          </label>

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
              Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
