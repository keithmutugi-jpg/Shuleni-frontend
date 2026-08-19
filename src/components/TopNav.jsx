import { NavLink } from 'react-router-dom';
import { Home, FileText, ClipboardCheck, MessageSquare } from 'lucide-react';
import Logo from './Logo';
import { Avatar } from './ui';

const NAV_ITEMS = [
  { to: 'home', label: 'Home', icon: Home },
  { to: 'resources', label: 'Resources', icon: FileText },
  { to: 'attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: 'chats', label: 'Chats', icon: MessageSquare },
];

export default function TopNav({ base, userInitials = 'TJ' }) {
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

        <Avatar initials={userInitials} size={38} />
      </div>
    </header>
  );
}
