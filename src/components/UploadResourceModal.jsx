import { useState, useRef } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { Field, Input, Button } from './ui';
import { ALL_CLASSES } from '../data/mock';

const SUBJECTS = ['Mathematics', 'Science', 'Literature', 'History', 'Geography', 'Physical Education'];

export default function UploadResourceModal({ onClose, onUpload }) {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [title, setTitle] = useState('');
  const [restricted, setRestricted] = useState(true);
  const [allowedClasses, setAllowedClasses] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef();

  function toggleClass(cls) {
    setAllowedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  }

  function handleFile(f) {
    if (!f) return;
    setFile(f);
    if (!title) setTitle(f.name);
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError('File name is required.'); return; }
    if (!file) { setError('Please select a file to upload.'); return; }
    if (restricted && allowedClasses.length === 0) { setError('Select at least one class for restricted access.'); return; }
    setError('');
    onUpload?.({
      subject,
      title: title.trim(),
      access: restricted ? 'restricted' : 'open',
      classes: restricted ? allowedClasses : [...ALL_CLASSES],
      fileName: file.name,
      size: file.size > 1_000_000
        ? `${(file.size / 1_000_000).toFixed(1)} MB`
        : `${(file.size / 1000).toFixed(0)} KB`,
    });
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
          {/* File drop zone */}
          <div
            className="rounded-2xl border border-dashed flex flex-col items-center justify-center gap-2 py-7 cursor-pointer"
            style={{ borderColor: 'var(--sh-border-strong)', color: 'var(--sh-ink-faint)' }}
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {file ? (
              <>
                <FileText size={20} />
                <span className="text-xs font-medium" style={{ color: 'var(--sh-ink-soft)' }}>{file.name}</span>
                <span className="text-xs">{(file.size / 1_000_000).toFixed(2)} MB</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span className="text-xs">Drag a file here, or click to browse</span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* File name */}
          <Field label="File name">
            <Input
              placeholder="e.g. Chapter 4 — Quadratic Equations.pdf"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>

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
              onChange={(e) => { setRestricted(e.target.checked); setAllowedClasses([]); }}
            />
            Restrict access to specific classes
          </label>

          {/* Per-class toggles — only shown when restricted */}
          {restricted && (
            <div className="rounded-2xl border p-4 space-y-2" style={{ borderColor: 'var(--sh-border)' }}>
              <span className="sh-label block mb-1">Allow access to</span>
              {ALL_CLASSES.map((cls) => (
                <label key={cls} className="flex items-center gap-2.5 text-sm select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowedClasses.includes(cls)}
                    onChange={() => toggleClass(cls)}
                  />
                  {cls}
                </label>
              ))}
            </div>
          )}

          {error && <p className="text-xs" style={{ color: '#c0392b' }}>{error}</p>}

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
