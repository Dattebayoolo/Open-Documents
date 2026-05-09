import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { $isHeadingNode } from '@lexical/rich-text';
import type { HeadingTagType } from '@lexical/rich-text';
import { X, Hash } from 'lucide-react';
import useAppStore from '../../../store/useAppStore';

interface OutlineItem { key: string; text: string; tag: HeadingTagType; }

export default function OutlinePlugin() {
  const [editor] = useLexicalComposerContext();
  const { outlineOpen, setOutlineOpen } = useAppStore();
  const [items, setItems] = useState<OutlineItem[]>([]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const headings: OutlineItem[] = [];
        $getRoot().getChildren().forEach(node => {
          if ($isHeadingNode(node)) {
            headings.push({ key: node.getKey(), text: node.getTextContent(), tag: node.getTag() });
          }
        });
        setItems(headings);
      });
    });
  }, [editor]);

  const scrollTo = (key: string) => {
    editor.getEditorState().read(() => {
      const el = editor.getElementByKey(key);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  if (!outlineOpen) return null;

  const indentMap: Record<HeadingTagType, number> = { h1: 0, h2: 8, h3: 16, h4: 24, h5: 32, h6: 40 };
  const sizeMap: Record<HeadingTagType, number> = { h1: 13, h2: 12, h3: 12, h4: 11, h5: 11, h6: 11 };
  const weightMap: Record<HeadingTagType, number> = { h1: 700, h2: 600, h3: 600, h4: 500, h5: 500, h6: 500 };

  return (
    <div style={{
      position: 'fixed', top: 80, right: 24, zIndex: 140,
      width: 260, background: 'var(--bg-base)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
      display: 'flex', flexDirection: 'column', maxHeight: 400, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Document Outline</span>
        <button className="icon-btn" onClick={() => setOutlineOpen(false)}><X size={15} /></button>
      </div>
      <div style={{ overflowY: 'auto', padding: 8 }}>
        {items.length === 0 && (
          <div style={{ padding: '20px 8px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            No headings found.<br />Add H1–H6 headings to build an outline.
          </div>
        )}
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => scrollTo(item.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              width: '100%', textAlign: 'left', background: 'none', border: 'none',
              padding: `5px 8px 5px ${8 + indentMap[item.tag]}px`,
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontSize: sizeMap[item.tag], fontWeight: weightMap[item.tag],
              color: 'var(--text-secondary)', transition: 'background 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <Hash size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text || '(empty heading)'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
