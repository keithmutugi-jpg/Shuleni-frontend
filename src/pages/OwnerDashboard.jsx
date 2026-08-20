import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, Button, Avatar, Pill } from '../components/ui';
import UserManagementModal from '../components/UserManagementModal';
import { useAuth } from '../context/AuthContext';

function initialsOf(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Owner's home base: a snapshot of the school plus quick access to
 * adding students and educators. Each school that registers only
 * ever sees its own data here — never another school's.
 */
export default function OwnerDashboard() {
  const [showAddUser, setShowAddUser] = useState(false);
  const { currentUser, usersForCurrentSchool, addUser } = useAuth();
  const people = usersForCurrentSchool();
  const students = people.filter((u) => u.role === 'student');
  const educators = people.filter((u) => u.role === 'educator');

  const stats = [
    { label: 'Students', value: students.length },
    { label: 'Educators', value: educators.length },
    { label: 'Classes', value: new Set(students.map((s) => s.classGroup)).size },
    { label: 'Resources', value: '101 files' },
  ];

  function handleCreate(newPerson) {
    const created = addUser(newPerson);
    // In a real build this would show a toast; for the demo, the new
    // login credentials (username: "welcome123") are visible in the list below.
    return created;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="sh-label mb-2">
            {currentUser ? `${currentUser.name} · ${currentUser.schoolId}` : 'No school loaded'}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">School overview</h1>
        </div>
        <Button onClick={() => setShowAddUser(true)}>
          <Plus size={15} /> Add person
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
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
        {people.length === 0 ? (
          <p className="px-5 py-6 text-sm" style={{ color: 'var(--sh-ink-faint)' }}>
            No students or educators yet — add one to get started. New logins use
            their name (lowercase, dot-separated) as username and "welcome123" as password.
          </p>
        ) : (
          <ul>
            {people.map((u, i) => (
              <li
                key={u.id}
                className={`flex items-center gap-3 px-5 py-4 ${i !== people.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: 'var(--sh-border)' }}
              >
                <Avatar initials={initialsOf(u.name)} size={34} dark={false} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{u.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--sh-ink-faint)' }}>
                    {u.classGroup} · login: {u.username}
                  </p>
                </div>
                <Pill>{u.role}</Pill>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {showAddUser && (
        <UserManagementModal onClose={() => setShowAddUser(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}
