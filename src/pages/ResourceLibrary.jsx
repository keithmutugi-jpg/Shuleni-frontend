import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Card, Input } from '../components/ui';
import FolderCard from '../components/FolderCard';
import UploadResourceModal from '../components/UploadResourceModal';
import { resourceFolders } from '../data/mock';

const TABS = ['All Subjects', 'Shared with me', 'Recently edited', 'Archived'];

export default function ResourceLibrary() {
  const [tab, setTab] = useState(TABS[0]);
  const [query, setQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const folders = resourceFolders.filter((f) =>
    f.subject.toLowerCase().includes(query.toLowerCase())
  );
  const totalFiles = resourceFolders.reduce((sum, f) => sum + f.files, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Resources</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--sh-ink-faint)' }}>
            {resourceFolders.length} subject folders &middot; {totalFiles} files
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

        <div
          className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_32px] gap-3 px-5 pt-5 pb-2 sh-label"
        >
          <span>Subject</span>
          <span>Files</span>
          <span>Size</span>
          <span>Last edited</span>
          <span>Access</span>
          <span />
        </div>

        {folders.map((f, i) => (
          <FolderCard key={f.id} folder={f} isLast={i === folders.length - 1} />
        ))}

        {folders.length === 0 && (
          <p className="px-5 py-8 text-sm text-center" style={{ color: 'var(--sh-ink-faint)' }}>
            No folders match “{query}”.
          </p>
        )}
      </Card>

      {showUpload && <UploadResourceModal onClose={() => setShowUpload(false)} />}
    </div>
  );
}
