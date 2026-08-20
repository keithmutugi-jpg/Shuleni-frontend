import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School, Mail, User, Lock, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';
import { Card, Field, Input, Button } from '../components/ui';
import { useAuth } from '../store/AuthContext';
import { findSchool } from '../store/db';

/**
 * Onboarding for a brand-new, isolated school. Actually creates a
 * school + owner record in the store — every new school gets its
 * own id and its own user/attendance/resource/chat data, so it can
 * never see or collide with another school's records.
 */
export default function RegisterSchoolScreen() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    schoolName: '',
    ownerName: '',
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (findSchool(form.schoolName)) {
      setError('A school with that name already exists — try a more specific name.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    register(form);
    setSubmitting(false);
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
              required
            />
          </Field>

          <Field label="Owner full name" icon={User}>
            <Input
              placeholder="Your full name"
              value={form.ownerName}
              onChange={handleChange('ownerName')}
              required
            />
          </Field>

          <Field label="Owner email" icon={Mail}>
            <Input
              type="email"
              placeholder="you@school.ac.ke"
              value={form.email}
              onChange={handleChange('email')}
              required
            />
          </Field>

          <Field label="Username" icon={User}>
            <Input
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange('username')}
              required
            />
          </Field>

          <Field label="Password" icon={Lock}>
            <Input
              type="password"
              placeholder="At least 6 characters"
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
            <ArrowRight size={16} /> {submitting ? 'Creating…' : 'Create school'}
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
