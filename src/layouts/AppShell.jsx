import { Outlet, Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import TopNav from '../components/TopNav';

export default function AppShell({ base, userInitials, footerLabel }) {
  return (
    <div className="sh-canvas flex flex-col">
      <TopNav base={base} userInitials={userInitials} />

      <main className="flex-1 mx-auto w-full max-w-[1400px] px-6 py-8">
        <Outlet />
      </main>

      <footer className="text-center py-6">
        <p className="text-xs tracking-widest" style={{ color: 'var(--sh-ink-faint)' }}>
          <Link to="/" className="hover:underline">
            &larr; BACK TO LOGIN
          </Link>
          {footerLabel && <> &nbsp;&middot;&nbsp; SHULENI &mdash; {footerLabel.toUpperCase()} &mdash; LOW FIDELITY</>}
        </p>
      </footer>

      <button
        type="button"
        aria-label="Help"
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'var(--sh-black)', color: '#fff' }}
      >
        <HelpCircle size={20} />
      </button>
    </div>
  );
}
