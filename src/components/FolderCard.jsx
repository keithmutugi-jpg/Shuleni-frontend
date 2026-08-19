import { Folder, Lock, Globe, MoreHorizontal } from 'lucide-react';

/**
 * One row of the "Resources" table — a subject folder with its
 * file count, size, last-edited date and access level.
 */
export default function FolderCard({ folder, isLast }) {
  const isOpen = folder.access === 'open';

  return (
    <div
      className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_32px] items-center gap-3 px-5 py-4 text-sm ${!isLast ? 'border-b' : ''}`}
      style={{ borderColor: 'var(--sh-border)' }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Folder size={16} style={{ color: 'var(--sh-ink-faint)' }} />
        <span className="font-semibold truncate">{folder.subject}</span>
      </div>
      <span style={{ color: 'var(--sh-ink-soft)' }}>{folder.files} files</span>
      <span style={{ color: 'var(--sh-ink-soft)' }}>{folder.size}</span>
      <span style={{ color: 'var(--sh-ink-soft)' }}>{folder.edited}</span>
      <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--sh-ink-faint)' }}>
        {isOpen ? <Globe size={13} /> : <Lock size={13} />}
        {folder.access}
      </span>
      <button
        type="button"
        aria-label={`More options for ${folder.subject}`}
        className="flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--sh-bg)]"
        style={{ color: 'var(--sh-ink-faint)' }}
      >
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
}
