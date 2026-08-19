import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School, Mail, User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import { Card, Field, Input, Button } from '../components/ui';

/**
 * Onboarding for a brand-new, isolated school. Each school that
 * registers here gets its own owner account and never sees another
 * school's students, staff or data.
 */
export default function RegisterSchoolScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    schoolName: '',
    ownerName: '',
    email: '',
    username: '',
    password: '',
  });

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire up to the "create school" API, then land the owner on their dashboard.
    navigate('/owner/home');
  }

  return (
    <div className="sh-canvas flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md" padded={false}>
        <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center">
          <Logo size="lg" withName={false} className="mb-5" />
          <h1 className="text-2xl font-extrabold tracking-tight">Register your school</h1>
          <p className="sh-label mt-1.5">A new, private workspace for your school</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          <Field label="School name" icon={School}>
            <Input
              placeholder="e.g. Greenfield Academy"
              value={form.schoolName}
              onChange={handleChange('schoolName')}
            />
          </Field>

          <Field label="Owner full name" icon={User}>
            <Input
              placeholder="Your full name"
              value={form.ownerName}
              onChange={handleChange('ownerName')}
            />
          </Field>

          <Field label="Owner email" icon={Mail}>
            <Input
              type="email"
              placeholder="you@school.ac.ke"
              value={form.email}
              onChange={handleChange('email')}
            />
          </Field>

          <Field label="Username" icon={User}>
            <Input
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange('username')}
            />
          </Field>

          <Field label="Password" icon={Lock}>
            <Input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange('password')}
            />
          </Field>

          <Button type="submit" className="w-full mt-2">
            <ArrowRight size={16} /> Create school
          </Button>

          <p className="text-center text-sm" style={{ color: 'var(--sh-ink-faint)' }}>
            <Link to="/" className="underline font-medium inline-flex items-center gap-1" style={{ color: 'var(--sh-ink)' }}>
              <ArrowLeft size={13} /> Back to login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
