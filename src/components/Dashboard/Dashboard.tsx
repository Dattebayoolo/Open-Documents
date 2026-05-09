import React, { useState } from 'react';
import { Plus, Grid, List, Star, MoreVertical, FileText, Trash2, Copy, Search } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import db, { type OpenDocument } from '../../db/db';
import useAppStore from '../../store/useAppStore';

const TEMPLATES = [
  { id: 'blank', label: 'Blank', lines: [3, 5, 8, 5, 7, 4, 6, 9, 5] },
  { id: 'resume', label: 'Résumé', lines: [10, 4, 6, 4, 6, 4] },
  { id: 'letter', label: 'Letter', lines: [4, 8, 6, 8, 6, 4, 8, 4] },
  { id: 'notes', label: 'Meeting Notes', lines: [8, 4, 5, 4, 5, 4, 5] },
  { id: 'proposal', label: 'Proposal', lines: [10, 6, 4, 6, 4, 6] },
  { id: 'essay', label: 'Essay', lines: [8, 6, 5, 6, 5, 6, 5] },
];

export default function Dashboard() {
  const { view, setView, setActiveDocument, addToast } = useAppStore();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'updatedAt' | 'createdAt' | 'title'>('updatedAt');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const docs = useLiveQuery(async () => {
    let query = db.documents.where('isTrashed').equals(0);
    const all = await query.toArray();
    const term = search.toLowerCase();
    const filtered = search ? all.filter(d => 
      d.title.toLowerCase().includes(term) || 
      (d.plainText && d.plainText.toLowerCase().includes(term))
    ) : all;
    return filtered.sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : (b[sort] as number) - (a[sort] as number));
  }, [search, sort]);

  const createDoc = async (templateId = 'blank') => {
    const id = crypto.randomUUID();
    const titles: Record<string, string> = { blank: 'Untitled document', resume: 'My Résumé', letter: 'Letter', notes: 'Meeting Notes', proposal: 'Project Proposal', essay: 'Essay' };
    await db.documents.add({
      id, title: titles[templateId] || 'Untitled document', lexicalState: '',
      folderId: null, tags: [], isPinned: false, isStarred: false,
      isTrashed: false, createdAt: Date.now(), updatedAt: Date.now(),
      wordCount: 0, charCount: 0, readingTimeMin: 0, version: 1,
    });
    setActiveDocument(id);
    addToast('Document created');
  };

  const handleContext = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuOpen(id);
  };

  const starDoc = async (id: string, val: boolean) => { await db.documents.update(id, { isStarred: val }); addToast(val ? 'Starred' : 'Unstarred'); setMenuOpen(null); };
  const duplicateDoc = async (doc: OpenDocument) => { await db.documents.add({ ...doc, id: crypto.randomUUID(), title: doc.title + ' (copy)', createdAt: Date.now(), updatedAt: Date.now() }); addToast('Duplicated'); setMenuOpen(null); };
  const trashDoc = async (id: string) => { await db.documents.update(id, { isTrashed: true }); addToast('Moved to trash'); setMenuOpen(null); };

  const fmt = (ts: number) => {
    const d = new Date(ts), now = Date.now(), diff = now - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="dashboard">
      {/* Context menu */}
      {menuOpen && (
        <>
          <div className="dropdown-overlay" onClick={() => setMenuOpen(null)} />
          <div className="dropdown-menu" style={{ top: menuPos.y, left: menuPos.x }}>
            {(() => {
              const doc = docs?.find(d => d.id === menuOpen);
              if (!doc) return null;
              return <>
                <div className="dropdown-item" onClick={() => { setActiveDocument(doc.id); setMenuOpen(null); }}><FileText size={14} /> Open</div>
                <div className="dropdown-item" onClick={() => starDoc(doc.id, !doc.isStarred)}><Star size={14} /> {doc.isStarred ? 'Unstar' : 'Star'}</div>
                <div className="dropdown-item" onClick={() => duplicateDoc(doc)}><Copy size={14} /> Duplicate</div>
                <div className="dropdown-sep" />
                <div className="dropdown-item danger" onClick={() => trashDoc(doc.id)}><Trash2 size={14} /> Move to Trash</div>
              </>;
            })()}
          </div>
        </>
      )}

      {/* Hero / Template Gallery */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-top">
          <h1 className="dashboard-hero-title">Open Documents</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                placeholder="Search documents…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ height: 32, paddingLeft: 32, paddingRight: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, background: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none', width: 220 }}
              />
            </div>
          </div>
        </div>
        <div className="templates-row">
          {TEMPLATES.map(t => (
            <div key={t.id} className="template-card" onClick={() => createDoc(t.id)} title={`Create from ${t.label}`}>
              <div className="template-card-thumb">
                {t.id === 'blank'
                  ? <div style={{ flex: 1, border: '1px dashed var(--border)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={20} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  : <>
                      <div className="template-line dark" style={{ width: '50%' }} />
                      {t.lines.map((w, i) => <div key={i} className="template-line" style={{ width: `${w * 11}%` }} />)}
                    </>
                }
              </div>
              <div className="template-card-label">{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div className="dashboard-content">
        <div className="dashboard-toolbar">
          <div className="dashboard-toolbar-left">
            <span className="docs-section-title">Recent documents</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
              style={{ height: 28, padding: '0 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 12, background: 'var(--bg-base)', color: 'var(--text-secondary)', outline: 'none' }}
            >
              <option value="updatedAt">Last modified</option>
              <option value="createdAt">Created</option>
              <option value="title">Name</option>
            </select>
          </div>
          <div className="view-toggle">
            <button className={`view-toggle-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} title="Grid view"><Grid size={14} /></button>
            <button className={`view-toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title="List view"><List size={14} /></button>
          </div>
        </div>

        {(!docs || docs.length === 0) && (
          <div className="empty-state">
            <div className="empty-state-icon"><FileText size={20} style={{ color: 'var(--text-muted)' }} /></div>
            <div className="empty-state-text">No documents yet</div>
            <div className="empty-state-sub">Pick a template above or click "New Document" to get started</div>
          </div>
        )}

        {view === 'grid' ? (
          <div className="docs-grid">
            {docs?.map(doc => (
              <div key={doc.id} className="doc-card" onClick={() => setActiveDocument(doc.id)}>
                <div className="doc-card-thumb">
                  <div className="doc-thumb-line title" />
                  {[60, 80, 50, 90, 70].map((w, i) => <div key={i} className="doc-thumb-line" style={{ width: `${w}%` }} />)}
                </div>
                <div className="doc-card-meta">
                  <div>
                    <div className="doc-card-title">{doc.title}</div>
                    <div className="doc-card-date">{fmt(doc.updatedAt)}</div>
                  </div>
                  <button className="icon-btn" style={{ flexShrink: 0 }} onClick={e => handleContext(e, doc.id)}><MoreVertical size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="docs-list">
            {docs?.map(doc => (
              <div key={doc.id} className="doc-list-row" onClick={() => setActiveDocument(doc.id)}>
                <FileText size={16} className="doc-list-icon" />
                <span className="doc-list-title">{doc.title}</span>
                {doc.isStarred && <Star size={13} style={{ color: 'var(--text-muted)' }} />}
                <span className="doc-list-date">{fmt(doc.updatedAt)}</span>
                <button className="icon-btn" onClick={e => handleContext(e, doc.id)}><MoreVertical size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
