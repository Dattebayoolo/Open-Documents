import { useState } from 'react';
import { FileText, Plus, Star, Trash2, FolderOpen, ChevronDown, ChevronRight, Settings, Hash } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/db';
import useAppStore from '../../store/useAppStore';

export default function Sidebar() {
  const { setActiveDocument, addToast } = useAppStore();
  const [expandFolders, setExpandFolders] = useState(true);
  const [activeSection, setActiveSection] = useState<'all' | 'starred' | 'trash'>('all');

  const docs = useLiveQuery(() => db.documents.where('isTrashed').equals(0).sortBy('updatedAt'), []);
  const starred = useLiveQuery(() => db.documents.where('isStarred').equals(1).toArray(), []);
  const folders = useLiveQuery(() => db.folders.toArray(), []);

  const createDoc = async () => {
    const id = crypto.randomUUID();
    await db.documents.add({
      id, title: 'Untitled document', lexicalState: '',
      folderId: null, tags: [], isPinned: false, isStarred: false,
      isTrashed: false, createdAt: Date.now(), updatedAt: Date.now(),
      wordCount: 0, charCount: 0, readingTimeMin: 0, version: 1,
    });
    setActiveDocument(id);
    addToast('New document created');
  };

  const createFolder = async () => {
    const name = prompt('Folder name:');
    if (!name) return;
    await db.folders.add({ id: crypto.randomUUID(), name, parentId: null, createdAt: Date.now() });
    addToast(`Folder "${name}" created`);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="header-logo">
          <div className="header-logo-icon"><FileText size={14} /></div>
          Open Documents
        </div>
      </div>

      <div className="sidebar-section">
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start', gap: 8, marginBottom: 4 }} onClick={createDoc}>
          <Plus size={15} /> New Document
        </button>
      </div>

      <div className="sidebar-section">
        <div
          className={`sidebar-item ${activeSection === 'all' ? 'active' : ''}`}
          onClick={() => { setActiveSection('all'); setActiveDocument(null); }}
        >
          <FileText size={15} /> All Documents
          <span className="badge" style={{ marginLeft: 'auto' }}>{docs?.length ?? 0}</span>
        </div>
        <div
          className={`sidebar-item ${activeSection === 'starred' ? 'active' : ''}`}
          onClick={() => { setActiveSection('starred'); setActiveDocument(null); }}
        >
          <Star size={15} /> Starred
          <span className="badge" style={{ marginLeft: 'auto' }}>{starred?.length ?? 0}</span>
        </div>
        <div
          className={`sidebar-item ${activeSection === 'trash' ? 'active' : ''}`}
          onClick={() => { setActiveSection('trash'); setActiveDocument(null); }}
        >
          <Trash2 size={15} /> Trash
        </div>
      </div>

      <div className="divider" />

      <div className="sidebar-section" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="sidebar-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Folders</span>
          <button className="icon-btn" style={{ width: 20, height: 20 }} onClick={createFolder} title="New folder"><Plus size={12} /></button>
        </div>
        <div
          className="sidebar-item"
          onClick={() => setExpandFolders(f => !f)}
          style={{ marginBottom: 2 }}
        >
          {expandFolders ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <FolderOpen size={14} /> My Folders
        </div>
        {expandFolders && folders?.map(folder => (
          <div key={folder.id} className="sidebar-item" style={{ paddingLeft: 28 }}>
            <Hash size={13} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</span>
          </div>
        ))}
        {expandFolders && (!folders || folders.length === 0) && (
          <div style={{ padding: '4px 10px 4px 28px', fontSize: 12, color: 'var(--text-muted)' }}>No folders yet</div>
        )}
      </div>

      <div className="divider" />
      <div className="sidebar-section" style={{ paddingBottom: 12 }}>
        <div className="sidebar-item">
          <Settings size={15} /> Settings
        </div>
      </div>
    </aside>
  );
}
