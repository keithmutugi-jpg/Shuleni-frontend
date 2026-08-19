import { BookOpen } from 'lucide-react';

/**
 * Shuleni wordmark: a rounded square "book" glyph next to the
 * school name. Two sizes are used across the wireframe — a larger
 * one on the login card, a compact one in the top nav.
 */
export default function Logo({ size = 'md', withName = true, className = '' }) {
  const box = size === 'lg' ? 'w-16 h-16 rounded-2xl' : 'w-9 h-9 rounded-xl';
  const icon = size === 'lg' ? 22 : 16;
  const name = size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${box} flex items-center justify-center border shrink-0`}
        style={{ borderColor: 'var(--sh-border-strong)', background: 'var(--sh-surface)' }}
      >
        <BookOpen size={icon} strokeWidth={1.75} style={{ color: 'var(--sh-black)' }} />
      </div>
      {withName && (
        <span className={`${name} font-extrabold tracking-tight`} style={{ color: 'var(--sh-ink)' }}>
          Shuleni
        </span>
      )}
    </div>
  );
}
