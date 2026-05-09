import { useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Editor from './components/Editor/Editor';
import useAppStore from './store/useAppStore';
import { useLiveQuery } from 'dexie-react-hooks';
import db from './db/db';
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

  return (
    <Layout>
      {activeDocumentId
        ? <Editor docId={activeDocumentId} initialState={activeDoc?.lexicalState || undefined} key={activeDocumentId} />
        : <Dashboard />
      }
    </Layout>
  );
}
