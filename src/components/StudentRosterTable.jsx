import { Avatar, Input } from './ui';

function Radio({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      aria-label={label}
      className="w-5 h-5 rounded-full border flex items-center justify-center"
      style={{ borderColor: checked ? 'var(--sh-black)' : 'var(--sh-border-strong)' }}
    >
      {checked && <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--sh-black)' }} />}
    </button>
  );
}

/**
 * One row per student: present / absent / late radio group plus a
 * free-text note, submitted together as the teacher's sign-off.
 */
export default function StudentRosterTable({ students, onStatusChange, onNoteChange, selected, onToggleSelect, isLast }) {
  return (
    <>
      {students.map((s, i) => (
        <div
          key={s.id}
          className={`grid grid-cols-[28px_2fr_1fr_1fr_1fr_1.4fr] items-center gap-3 px-5 py-3.5 ${
            i !== students.length - 1 || !isLast ? 'border-b' : ''
          }`}
          style={{ borderColor: 'var(--sh-border)' }}
        >
          <input
            type="checkbox"
            checked={!!selected?.[s.id]}
            onChange={() => onToggleSelect?.(s.id)}
            aria-label={`Select ${s.name}`}
          />

          <div className="flex items-center gap-3 min-w-0">
            <Avatar initials={s.initials} size={32} dark={false} />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{s.name}</p>
              <p className="text-xs" style={{ color: 'var(--sh-ink-faint)' }}>{s.id}</p>
            </div>
          </div>

          <div className="flex justify-start">
            <Radio checked={s.status === 'present'} onChange={() => onStatusChange?.(s.id, 'present')} label={`Mark ${s.name} present`} />
          </div>
          <div className="flex justify-start">
            <Radio checked={s.status === 'absent'} onChange={() => onStatusChange?.(s.id, 'absent')} label={`Mark ${s.name} absent`} />
          </div>
          <div className="flex justify-start">
            <Radio checked={s.status === 'late'} onChange={() => onStatusChange?.(s.id, 'late')} label={`Mark ${s.name} late`} />
          </div>

          <div className="rounded-lg border px-2.5 py-1.5" style={{ borderColor: 'var(--sh-border)' }}>
            <Input
              placeholder="—"
              value={s.note || ''}
              onChange={(e) => onNoteChange?.(s.id, e.target.value)}
            />
          </div>
        </div>
      ))}
    </>
  );
}
