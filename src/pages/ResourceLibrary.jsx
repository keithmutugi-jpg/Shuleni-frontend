import { useMemo, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Card, Input } from '../components/ui';
import FolderCard from '../components/FolderCard';
import UploadResourceModal from '../components/UploadResourceModal';
import { useAuth } from '../store/AuthContext';
import { listResources, addResourceFile } from '../store/db';

const TABS = ['All Subjects', 'Shared with me', 'Recently edited', 'Archived'];

function summarize(folder) {
  const totalKb = folder.files.reduce((sum, f) => sum + f.sizeKb, 0);
  const lastEdited = folder.files.length
    ? new Date(Math.max(...folder.files.map((f) => new Date(f.uploadedAt).getTime()))).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  return {
    id: folder.id,
    subject: folder.subject,
    files: folder.files.length,
    size: totalKb > 1024 ? `${(totalKb / 1024).toFixed(1)} MB` : `${totalKb} KB`,
    edited: lastEdited,
    access: folder.access,
  };
}

export default function ResourceLibrary() {
  const { session } = useAuth();
  const [tab, setTab] = useState(TABS[0]);
  const [query, setQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [folders, setFolders] = useState(() => listResources(session.schoolId));

  const visible = useMemo(
    () => folders.filter((f) => f.subject.toLowerCase().includes(query.toLowerCase())),
    [folders, query]
  );
  const totalFiles = folders.reduce((sum, f) => sum + f.files.length, 0);

  function handleUpload({ subject, fileName, restricted }) {
    addResourceFile(session.schoolId, { subject, fileName, restricted });
    setFolders(listResources(session.schoolId));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Resources</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--sh-ink-faint)' }}>
            {folders.length} subject folders &middot; {totalFiles} files
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 rounded-xl border px-3.5 py-2.5 w-64"
            style={{ borderColor: 'var(--sh-border-strong)', background: 'var(--sh-surface)' }}
          >
            <Search size={15} style={{ color: 'var(--sh-ink-faint)' }} />
            <Input placeholder="Search resources…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ background: 'var(--sh-black)' }}
          >
            <Plus size={15} /> Add Resource
          </button>
        </div>
      </div>

      <Card padded={false} className="overflow-hidden">
        <div className="flex items-center gap-1 px-4 pt-4">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium"
              style={{
                background: tab === t ? 'var(--sh-black)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--sh-ink-soft)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_32px] gap-3 px-5 pt-5 pb-2 sh-label">
          <span>Subject</span>
          <span>Files</span>
          <span>Size</span>
          <span>Last edited</span>
          <span>Access</span>
          <span />
        </div>

        {visible.length === 0 ? (
          <p className="px-5 py-8 text-sm text-center" style={{ color: 'var(--sh-ink-faint)' }}>
            {folders.length === 0 ? 'No resources yet — add the first one.' : `No folders match "${query}".`}
          </p>
        ) : (
          visible.map((f, i) => (
            <FolderCard key={f.id} folder={summarize(f)} isLast={i === visible.length - 1} />
          ))
        )}
      </Card>

      {showUpload && <UploadResourceModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />}
    </div>
  );
}
