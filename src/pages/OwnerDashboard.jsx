import { useEffect, useMemo, useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Card, Button, Avatar, Pill } from '../components/ui';
import UserManagementModal from '../components/UserManagementModal';
import { useAuth } from '../store/AuthContext';
import { listResources } from '../store/db';
import { apiListUsers, apiAddUser } from '../lib/api';

/**
 * Owner's home base: a live snapshot of THIS school only (never
 * another school's data — everything is looked up by session.schoolId)
 * plus a working "add person" flow that actually creates accounts.
 */
export default function OwnerDashboard() {
  const { session, token, logout } = useAuth();
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [addError, setAddError] = useState('');
  const resources = listResources(session.schoolId);

  useEffect(() => {
    apiListUsers(token).then(setUsers).catch(() => setUsers([]));
  }, [token]);

  const stats = useMemo(() => {
    const students = users.filter((u) => u.role === 'student').length;
    const educators = users.filter((u) => u.role === 'educator').length;
    const classGroups = new Set(users.filter((u) => u.role === 'student').map((u) => u.classGroup).filter(Boolean));
    const totalFiles = resources.reduce((sum, r) => sum + r.files.length, 0);
    return [
      { label: 'Students', value: students },
      { label: 'Educators', value: educators },
      { label: 'Classes', value: classGroups.size },
      { label: 'Resources', value: `${totalFiles} files` },
    ];
  }, [users, resources]);

  async function handleCreate(payload) {
    setAddError('');
    try {
      const user = await apiAddUser(token, payload);
      setUsers((list) => [user, ...list]);
    } catch (err) {
      setAddError(err.message);
    }
  }

  const recent = users.slice(-6).reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="sh-label mb-2">{session.schoolName} &middot; #{session.schoolId}</p>
          <h1 className="text-2xl font-extrabold tracking-tight">School overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowAddUser(true)}>
            <Plus size={15} /> Add person
          </Button>
          <Button variant="secondary" onClick={logout}>
            <LogOut size={15} /> Log out
          </Button>
        </div>
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
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-sm text-center" style={{ color: 'var(--sh-ink-faint)' }}>
            No students or educators yet — add your first person to get started.
          </p>
        ) : (
          <ul>
            {recent.map((u, i) => (
              <li
                key={u.id}
                className={`flex items-center gap-3 px-5 py-4 ${i !== recent.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: 'var(--sh-border)' }}
              >
                <Avatar initials={u.name.split(' ').map((n) => n[0]).slice(0, 2).join('')} size={34} dark={false} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{u.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--sh-ink-faint)' }}>
                    {u.classGroup || u.subjects || u.email}
                  </p>
                </div>
                <Pill className="capitalize">{u.role}</Pill>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {addError && (
        <p className="text-sm rounded-xl px-3.5 py-3" style={{ background: '#fdecea', color: '#c0392b' }}>{addError}</p>
      )}

      {showAddUser && <UserManagementModal onClose={() => setShowAddUser(false)} onCreate={handleCreate} />}
    </div>
  );
}