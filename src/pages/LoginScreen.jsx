import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School, User, Lock, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';
import { Card, Field, Input, Button } from '../components/ui';

/**
 * Public entry point — school + user sign-in.
 * Owned by Keith: Authentication, routing & school-owner dashboard.
 */
export default function LoginScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ school: '', username: '', password: '' });

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire up to auth API — routes to the right dashboard by role.
    navigate('/educator/home');
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
            />
          </Field>

          <Field label="Username" icon={User}>
            <Input
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange('username')}
            />
          </Field>

          <Field label="Password" icon={Lock}>
            <Input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange('password')}
            />
          </Field>

          <Button type="submit" className="w-full mt-2">
            <ArrowRight size={16} /> Log in
          </Button>

          <p className="text-center text-sm" style={{ color: 'var(--sh-ink-faint)' }}>
            New school?{' '}
            <Link to="/register" className="underline font-medium" style={{ color: 'var(--sh-ink)' }}>
              Register your school
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
