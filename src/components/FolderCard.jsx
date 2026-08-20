import { useState } from 'react';
import { Folder, Lock, Globe, ChevronDown, ChevronRight, FileText } from 'lucide-react';

export default function FolderCard({ folder, isLast }) {
  const [open, setOpen] = useState(false);
  const isRestricted = folder.access === 'restricted';

  return (
    <>
      <div
        className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-3 px-5 py-4 text-sm cursor-pointer hover:bg-[var(--sh-bg)] transition-colors ${!isLast || open ? 'border-b' : ''}`}
        style={{ borderColor: 'var(--sh-border)' }}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {open ? <ChevronDown size={14} style={{ color: 'var(--sh-ink-faint)' }} /> : <ChevronRight size={14} style={{ color: 'var(--sh-ink-faint)' }} />}
          <Folder size={16} style={{ color: 'var(--sh-ink-faint)' }} />
          <span className="font-semibold truncate">{folder.subject}</span>
        </div>
        <span style={{ color: 'var(--sh-ink-soft)' }}>{folder.items.length} files</span>
        <span style={{ color: 'var(--sh-ink-soft)' }}>{folder.size}</span>
        <span style={{ color: 'var(--sh-ink-soft)' }}>{folder.edited}</span>
        <span className="inline-flex items-center gap-1.5" style={{ color: isRestricted ? 'var(--sh-ink-soft)' : 'var(--sh-ink-faint)' }}>
          {isRestricted ? <Lock size={13} /> : <Globe size={13} />}
          {isRestricted ? 'Restricted' : 'Open'}
        </span>
      </div>

      {open && (
        <div
          className={`px-5 pb-3 ${!isLast ? 'border-b' : ''}`}
          style={{ borderColor: 'var(--sh-border)', background: 'var(--sh-bg)' }}
        >
          {/* Class access pills */}
          <div className="flex items-center gap-2 pt-3 pb-2 flex-wrap">
            <span className="sh-label">Access:</span>
            {folder.classes.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium"
                style={{ borderColor: 'var(--sh-border-strong)', color: 'var(--sh-ink-soft)' }}
              >
                {c}
              </span>
            ))}
          </div>

          {/* File rows */}
          <div className="rounded-2xl border overflow-hidden mt-1" style={{ borderColor: 'var(--sh-border)' }}>
            {folder.items.map((file, i) => (
              <div
                key={file.id}
                className={`flex items-center gap-3 px-4 py-3 text-sm ${i < folder.items.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: 'var(--sh-border)', background: 'var(--sh-surface)' }}
              >
                <FileText size={14} style={{ color: 'var(--sh-ink-faint)', flexShrink: 0 }} />
                <span className="flex-1 truncate font-medium">{file.name}</span>
                <span style={{ color: 'var(--sh-ink-faint)', fontSize: '0.75rem' }}>{file.size}</span>
                <span style={{ color: 'var(--sh-ink-faint)', fontSize: '0.75rem' }}>{file.uploaded}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
