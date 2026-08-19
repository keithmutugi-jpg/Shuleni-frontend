/**
 * Shared low-fidelity UI primitives shared by every screen.
 * Keeping these in one file makes it easy for every teammate to
 * build new screens that automatically match the Figma style.
 */

export function Avatar({ initials, size = 36, dark = true, online }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-semibold"
        style={{
          background: dark ? 'var(--sh-black)' : '#eceef1',
          color: dark ? '#fff' : 'var(--sh-ink-soft)',
          fontSize: size * 0.36,
        }}
      >
        {initials}
      </div>
      {online !== undefined && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full border-2"
          style={{
            width: size * 0.32,
            height: size * 0.32,
            borderColor: 'var(--sh-surface)',
            background: online ? '#22252a' : '#c7cbd2',
          }}
        />
      )}
    </div>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    primary: 'text-white rounded-xl px-5 py-3 text-sm',
    secondary: 'rounded-xl px-4 py-2.5 text-sm border',
    ghost: 'rounded-lg px-3 py-2 text-sm',
    dark: 'rounded-lg px-3.5 py-2 text-sm text-white',
  };
  const style =
    variant === 'primary' || variant === 'dark'
      ? { background: 'var(--sh-black)' }
      : variant === 'secondary'
      ? { borderColor: 'var(--sh-border-strong)', color: 'var(--sh-ink)', background: 'var(--sh-surface)' }
      : { color: 'var(--sh-ink-soft)' };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} style={style} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = '', padded = true }) {
  return (
    <div
      className={`rounded-3xl border ${padded ? 'p-6' : ''} ${className}`}
      style={{ background: 'var(--sh-surface)', borderColor: 'var(--sh-border)' }}
    >
      {children}
    </div>
  );
}

export function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="sh-label block mb-2">{label}</span>
      <div
        className="flex items-center gap-2.5 rounded-xl border px-3.5 py-3 focus-within:border-[var(--sh-black)]"
        style={{ borderColor: 'var(--sh-border-strong)', background: 'var(--sh-surface)' }}
      >
        {Icon && <Icon size={16} style={{ color: 'var(--sh-ink-faint)' }} />}
        {children}
      </div>
    </label>
  );
}

export function Input(props) {
  return (
    <input
      className="w-full bg-transparent outline-none text-sm placeholder:text-[var(--sh-ink-faint)]"
      style={{ color: 'var(--sh-ink)' }}
      {...props}
    />
  );
}

export function Pill({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${className}`}
      style={{ borderColor: 'var(--sh-border-strong)', color: 'var(--sh-ink-soft)' }}
    >
      {children}
    </span>
  );
}
