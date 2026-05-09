import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { X, FileText, Clock, Hash } from 'lucide-react';
import useAppStore from '../../../store/useAppStore';

export default function WordCountPlugin() {
  const [editor] = useLexicalComposerContext();
  const { wordCountOpen, setWordCountOpen } = useAppStore();
  const [stats, setStats] = useState({ words: 0, chars: 0, charsNoSpaces: 0, paragraphs: 0, readingTime: 0 });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;
        const paragraphs = root.getChildrenSize();
        setStats({ words, chars, charsNoSpaces, paragraphs, readingTime: Math.max(1, Math.ceil(words / 200)) });
      });
    });
  }, [editor]);

  if (!wordCountOpen) return null;

  const rows = [
    { icon: <Hash size={14} />, label: 'Words', value: stats.words.toLocaleString() },
    { icon: <FileText size={14} />, label: 'Characters', value: stats.chars.toLocaleString() },
    { icon: <FileText size={14} />, label: 'Characters (no spaces)', value: stats.charsNoSpaces.toLocaleString() },
    { icon: <FileText size={14} />, label: 'Paragraphs', value: stats.paragraphs.toLocaleString() },
    { icon: <Clock size={14} />, label: 'Reading time', value: `~${stats.readingTime} min` },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={() => setWordCountOpen(false)}>
      <div style={{
        background: 'var(--bg-base)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)',
        width: 320, overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>Word Count</h2>
          <button className="icon-btn" onClick={() => setWordCountOpen(false)}><X size={15} /></button>
        </div>
        <div style={{ padding: '8px 0' }}>
          {rows.map(row => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', gap: 12 }}>
              <span style={{ color: 'var(--text-muted)' }}>{row.icon}</span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)' }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setWordCountOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
}
