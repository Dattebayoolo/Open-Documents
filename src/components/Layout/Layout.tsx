import React, { useEffect } from 'react';
import { Moon, Sun, Menu, PanelLeftClose, Sparkles, ChevronLeft } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import useAppStore from '../../store/useAppStore';
import Sidebar from './Sidebar';
import db from '../../db/db';

interface LayoutProps { children: React.ReactNode; }

export default function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen, activeDocumentId, setActiveDocument, addToast, toasts, setCmdOpen } = useAppStore();

  const activeDoc = useLiveQuery(
    () => activeDocumentId ? db.documents.get(activeDocumentId) : Promise.resolve(undefined),
    [activeDocumentId]
  );

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ⌘K command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(true); }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setCmdOpen]);

  const renameDoc = async (title: string) => {
    if (!activeDocumentId) return;
    await db.documents.update(activeDocumentId, { title });
  };

  return (
    <div className="app-root">
      {sidebarOpen && <Sidebar />}

      <div className="main-area">
        {/* Header */}
        <header className="app-header">
          <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle sidebar">
            {sidebarOpen ? <PanelLeftClose size={18} /> : <Menu size={18} />}
          </button>

          {activeDocumentId ? (
            <>
              <button className="icon-btn" title="Back to dashboard" onClick={() => setActiveDocument(null)}>
                <ChevronLeft size={18} />
              </button>
              <input
                className="header-title-input"
                value={activeDoc?.title ?? ''}
                onChange={e => renameDoc(e.target.value)}
                onBlur={e => { if (!e.target.value.trim()) renameDoc('Untitled document'); }}
                placeholder="Untitled document"
              />
            </>
          ) : (
            <div className="header-spacer" />
          )}

          <div className="header-spacer" />
          <div className="header-actions">
            <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="btn btn-ghost" style={{ gap: 6, fontSize: 13 }} onClick={() => useAppStore.getState().setAiPanelOpen(true)}>
              <Sparkles size={15} /> AI
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
      </div>
    </div>
  );
}
