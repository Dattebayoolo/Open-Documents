import { useState, useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isTextNode } from 'lexical';
import type { TextNode } from 'lexical';
import { X, Search, Replace, ChevronUp, ChevronDown } from 'lucide-react';
import useAppStore from '../../../store/useAppStore';

export default function FindReplacePlugin() {
  const [editor] = useLexicalComposerContext();
  const { findOpen, setFindOpen } = useAppStore();
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [matches, setMatches] = useState(0);

  const countMatches = useCallback(() => {
    if (!find) { setMatches(0); return; }
    editor.getEditorState().read(() => {
      const text = $getRoot().getTextContent();
      const flags = matchCase ? 'g' : 'gi';
      const re = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
      const found = text.match(re);
      setMatches(found ? found.length : 0);
    });
  }, [editor, find, matchCase]);

  useEffect(() => { countMatches(); }, [countMatches]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); setFindOpen(true); }
      if (e.key === 'Escape') setFindOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setFindOpen]);

  const doReplace = () => {
    if (!find) return;
    editor.update(() => {
      const root = $getRoot();
      const allText = root.getTextContent();
      const flags = matchCase ? '' : 'i';
      const re = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
      if (!re.test(allText)) return;
    });
  };

  const doReplaceAll = () => {
    if (!find) return;
    editor.update(() => {
      const root = $getRoot();
      const descendants = root.getAllTextNodes ? (root as any).getAllTextNodes() : [];
      const flags = matchCase ? 'g' : 'gi';
      const re = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
      descendants.forEach((node: TextNode) => {
        if ($isTextNode(node)) {
          const newText = node.getTextContent().replace(re, replace);
          node.setTextContent(newText);
        }
      });
    });
    countMatches();
  };

  if (!findOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 80, right: 24, zIndex: 150,
      background: 'var(--bg-base)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
      width: 340, padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Find & Replace</span>
        <button className="icon-btn" onClick={() => setFindOpen(false)}><X size={15} /></button>
      </div>

      {/* Find row */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            autoFocus
            placeholder="Find…"
            value={find}
            onChange={e => setFind(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && countMatches()}
            style={{ width: '100%', height: 32, paddingLeft: 30, paddingRight: 8, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13, background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        <button className="icon-btn" title="Previous match"><ChevronUp size={15} /></button>
        <button className="icon-btn" title="Next match"><ChevronDown size={15} /></button>
      </div>

      {/* Replace row */}
      <div style={{ position: 'relative' }}>
        <Replace size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          placeholder="Replace with…"
          value={replace}
          onChange={e => setReplace(e.target.value)}
          style={{ width: '100%', height: 32, paddingLeft: 30, paddingRight: 8, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13, background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      {/* Options & actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={matchCase} onChange={e => setMatchCase(e.target.checked)} />
          Match case
        </label>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
          {find ? `${matches} match${matches !== 1 ? 'es' : ''}` : ''}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn btn-outline" style={{ flex: 1, height: 28, fontSize: 12 }} onClick={doReplace}>Replace</button>
        <button className="btn btn-primary" style={{ flex: 1, height: 28, fontSize: 12 }} onClick={doReplaceAll}>Replace All</button>
      </div>
    </div>
  );
}
