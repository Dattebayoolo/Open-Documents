import { useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Editor from './components/Editor/Editor';
import useAppStore from './store/useAppStore';
import SettingsPage from './components/Settings/SettingsPage';
import db from './db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import type { OpenDocument } from './db/db';
import './index.css';

export default function App() {
  const { activeDocumentId, theme } = useAppStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const activeDoc = useLiveQuery(
    () => activeDocumentId ? db.documents.get(activeDocumentId) : Promise.resolve(undefined),
    [activeDocumentId]
  );

  // Cast because useLiveQuery wraps in PromiseExtended but the value is actually OpenDocument | undefined
  const doc = activeDoc as OpenDocument | undefined;

  return (
    <Layout title={doc?.title}>
      {activeDocumentId
        ? <Editor docId={activeDocumentId} initialState={doc?.lexicalState || undefined} key={activeDocumentId} />
        : <Dashboard />
      }
      <SettingsPage />
    </Layout>
  );
}