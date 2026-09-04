import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';
import { Card, Field, Input, Button } from '../components/ui';
import { useAuth } from '../store/AuthContext';

/**
 * Public entry point — school + user sign-in. Actually authenticates
 * against the school/user records in the store (see src/store/db.js)
 * and routes to the dashboard matching the signed-in user's role.
 *
 * Owned by Keith: Authentication, routing & school-owner dashboard.
 */
export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ school: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login({
      schoolNameOrId: form.school,
      username: form.username,
      password: form.password,
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate(`/${result.session.role}/home`);
  }

  return (
    <div className="sh-canvas flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md" padded={false}>
        <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
          <Logo size="lg" withName={false} className="mb-5" />
          <h1 className="text-2xl font-extrabold tracking-tight">Shuleni</h1>
          <p className="sh-label mt-1.5">School Management</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          <Field label="School name or ID" icon={School}>
            <Input
              placeholder="e.g. Greenfield Academy or #SCH-004"
              value={form.school}
              onChange={handleChange('school')}
              required
            />
          </Field>

          <Field label="Username" icon={User}>
            <Input
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange('username')}
              required
            />
          </Field>

          <Field label="Password" icon={Lock}>
            <Input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange('password')}
              required
            />
          </Field>

          {error && (
            <p className="flex items-center gap-2 text-sm rounded-xl px-3.5 py-3" style={{ background: '#fdecea', color: '#c0392b' }}>
              <AlertCircle size={15} className="shrink-0" /> {error}
            </p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={submitting}>
            <ArrowRight size={16} /> {submitting ? 'Signing in…' : 'Log in'}
          </Button>

          <p className="text-center text-sm" style={{ color: 'var(--sh-ink-faint)' }}>
            New school?{' '}
            <Link to="/register" className="underline font-medium" style={{ color: 'var(--sh-ink)' }}>
              Register your school
            </Link>
          </p>

          <div className="rounded-xl border px-3.5 py-3 text-xs" style={{ borderColor: 'var(--sh-border)', color: 'var(--sh-ink-faint)' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--sh-ink-soft)' }}>Try the demo school</p>
            School: <strong>Greenfield Academy</strong> (or #SCH-004)<br />
            Owner — owner / owner123 &middot; Educator — teacher.john / teacher123<br />
            Student — amara.osei / student123
          </div>
        </form>
      </Card>
    </div>
  );
}
