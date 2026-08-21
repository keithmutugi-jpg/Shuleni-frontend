import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, ClipboardCheck, MessageSquare, CalendarDays, LogOut } from 'lucide-react';
import Logo from './Logo';
import { Avatar } from './ui';

const NAV_ITEMS = [
  { to: 'home', label: 'Home', icon: Home },
  { to: 'resources', label: 'Resources', icon: FileText },
  { to: 'attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: 'chats', label: 'Chats', icon: MessageSquare },
  { to: 'timetable', label: 'Timetable', icon: CalendarDays },
];

export default function TopNav({ base, session, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = session?.name
    ? session.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '—';

  return (
    <header
      className="sticky top-0 z-10 border-b"
      style={{ background: 'var(--sh-surface)', borderColor: 'var(--sh-border)' }}
    >
      <div className="mx-auto max-w-[1400px] px-6 h-16 flex items-center justify-between gap-6">
        <Logo size="sm" />

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={`${base}/${to}`}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : ''
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'var(--sh-black)' : 'transparent',
                color: isActive ? '#fff' : 'var(--sh-ink-soft)',
              })}
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="relative">
          <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-label="Account menu">
            <Avatar initials={initials} size={38} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-11 w-48 rounded-xl border shadow-lg py-1.5 z-20"
              style={{ background: 'var(--sh-surface)', borderColor: 'var(--sh-border)' }}
            >
              <div className="px-3.5 py-2 border-b" style={{ borderColor: 'var(--sh-border)' }}>
                <p className="text-sm font-semibold truncate">{session?.name}</p>
                <p className="text-xs capitalize" style={{ color: 'var(--sh-ink-faint)' }}>{session?.role} &middot; {session?.schoolName}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-left"
                style={{ color: 'var(--sh-ink)' }}
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
