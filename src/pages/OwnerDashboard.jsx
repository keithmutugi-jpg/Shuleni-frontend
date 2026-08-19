import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, Button, Avatar, Pill } from '../components/ui';
import UserManagementModal from '../components/UserManagementModal';

const STATS = [
  { label: 'Students', value: 412 },
  { label: 'Educators', value: 28 },
  { label: 'Classes', value: 19 },
  { label: 'Resources', value: '101 files' },
];

const RECENT_USERS = [
  { initials: 'AO', name: 'Amara Osei', role: 'Student', group: 'Form 3B' },
  { initials: 'TJ', name: 'Teacher John', role: 'Educator', group: 'Mathematics' },
  { initials: 'BM', name: 'Brian Mwangi', role: 'Student', group: 'Form 3B' },
  { initials: 'GW', name: 'Grace Wambui', role: 'Student', group: 'Form 2A' },
];

/**
 * Owner's home base: a snapshot of the school plus quick access to
 * adding students and educators. Each school that registers only
 * ever sees its own data here — never another school's.
 */
export default function OwnerDashboard() {
  const [showAddUser, setShowAddUser] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="sh-label mb-2">Greenfield Academy &middot; #SCH-004</p>
          <h1 className="text-2xl font-extrabold tracking-tight">School overview</h1>
        </div>
        <Button onClick={() => setShowAddUser(true)}>
          <Plus size={15} /> Add person
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <Card key={s.label}>
            <p className="sh-label mb-2">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card padded={false} className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 rounded-t-2xl" style={{ background: 'var(--sh-black)', color: '#fff' }}>
          <span className="text-sm font-semibold">Recently added</span>
        </div>
        <ul>
          {RECENT_USERS.map((u, i) => (
            <li
              key={u.name}
              className={`flex items-center gap-3 px-5 py-4 ${i !== RECENT_USERS.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'var(--sh-border)' }}
            >
              <Avatar initials={u.initials} size={34} dark={false} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{u.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--sh-ink-faint)' }}>{u.group}</p>
              </div>
              <Pill>{u.role}</Pill>
            </li>
          ))}
        </ul>
      </Card>

      {showAddUser && <UserManagementModal onClose={() => setShowAddUser(false)} />}
    </div>
  );
}
