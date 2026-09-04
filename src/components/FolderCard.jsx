import { useState } from 'react';
import { Folder, Lock, Globe, MoreHorizontal, ChevronDown, ChevronRight, FileText } from 'lucide-react';

function formatSize(sizeKb) {
  return sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * One row of the "Resources" table — a subject folder with its
 * file count, size, last-edited date and access level. Click a
 * row to expand and see the real files inside it.
 */
export default function FolderCard({ folder, files, isLast }) {
  const [open, setOpen] = useState(false);
  const isOpenAccess = folder.access === 'open';
  const hasFiles = files && files.length > 0;

  return (
    <>
      <div
        className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_32px] items-center gap-3 px-5 py-4 text-sm ${hasFiles ? 'cursor-pointer hover:bg-[var(--sh-bg)]' : ''} ${!isLast || open ? 'border-b' : ''}`}
        style={{ borderColor: 'var(--sh-border)' }}
        onClick={() => hasFiles && setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {hasFiles ? (
            open ? <ChevronDown size={14} style={{ color: 'var(--sh-ink-faint)' }} /> : <ChevronRight size={14} style={{ color: 'var(--sh-ink-faint)' }} />
          ) : (
            <span style={{ width: 14 }} />
          )}
          <Folder size={16} style={{ color: 'var(--sh-ink-faint)' }} />
          <span className="font-semibold truncate">{folder.subject}</span>
        </div>
        <span style={{ color: 'var(--sh-ink-soft)' }}>{folder.files} files</span>
        <span style={{ color: 'var(--sh-ink-soft)' }}>{folder.size}</span>
        <span style={{ color: 'var(--sh-ink-soft)' }}>{folder.edited}</span>
        <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--sh-ink-faint)' }}>
          {isOpenAccess ? <Globe size={13} /> : <Lock size={13} />}
          {folder.access}
        </span>
        <button
          type="button"
          aria-label={`More options for ${folder.subject}`}
          className="flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--sh-bg)]"
          style={{ color: 'var(--sh-ink-faint)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={15} />
        </button>
      </div>

      {open && hasFiles && (
        <div
          className={`px-5 pb-3 pt-1 ${!isLast ? 'border-b' : ''}`}
          style={{ borderColor: 'var(--sh-border)', background: 'var(--sh-bg)' }}
        >
          <div className="rounded-2xl border overflow-hidden mt-1" style={{ borderColor: 'var(--sh-border)' }}>
            {files.map((file, i) => (
              <div
                key={file.id}
                className={`flex items-center gap-3 px-4 py-3 text-sm ${i < files.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: 'var(--sh-border)', background: 'var(--sh-surface)' }}
              >
                <FileText size={14} style={{ color: 'var(--sh-ink-faint)', flexShrink: 0 }} />
                {file.url ? (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 truncate font-medium underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {file.name}
                  </a>
                ) : (
                  <span className="flex-1 truncate font-medium">{file.name}</span>
                )}
                <span style={{ color: 'var(--sh-ink-faint)', fontSize: '0.75rem' }}>{formatSize(file.sizeKb)}</span>
                <span style={{ color: 'var(--sh-ink-faint)', fontSize: '0.75rem' }}>{formatDate(file.uploadedAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
