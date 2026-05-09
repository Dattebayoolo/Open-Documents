import React, { useState, useCallback, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { $getRoot } from 'lexical';
import type { EditorState } from 'lexical';
import EditorTheme from './EditorTheme';
import './Editor.css';
import ToolbarPlugin from './Toolbar/ToolbarPlugin';
import AutoSavePlugin from './Plugins/AutoSavePlugin';
import FindReplacePlugin from './Plugins/FindReplacePlugin';
import OutlinePlugin from './Plugins/OutlinePlugin';
import WordCountPlugin from './Plugins/WordCountPlugin';
import CollabPluginWrapper from './Plugins/CollabPlugin';
import CommentSidebar, { type Comment } from '../Comments/CommentSidebar';
import { exportToPlainText, exportToMarkdown, exportToPDF } from '../../services/export';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import AIPanel from '../AI/AIPanel';
import AIPromptBar from '../AI/AIPromptBar';
import useAppStore from '../../store/useAppStore';

interface EditorProps { docId: string; initialState?: string; }

export default function Editor({ docId, initialState }: EditorProps) {
  const { aiPanelOpen, commentSidebarOpen, isCollabMode } = useAppStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [docContext, setDocContext] = useState('');
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);

  // Capture selection for AI floating bar
  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (sel && sel.toString().trim().length > 10) {
        const range = sel.getRangeAt(0).getBoundingClientRect();
        setSelection({ text: sel.toString().trim(), x: range.left, y: range.bottom });
      } else {
        setSelection(null);
      }
    };
    document.addEventListener('mouseup', handler);
    return () => document.removeEventListener('mouseup', handler);
  }, []);

  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const text = $getRoot().getTextContent();
      setDocContext(text.slice(0, 1500));
    });
  }, []);

  const initialConfig = {
    namespace: 'OpenDocuments',
    theme: EditorTheme,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, CodeNode, CodeHighlightNode],
    editorState: isCollabMode ? null : (initialState || null),
    onError: (err: Error) => console.error(err),
  };

  return (
    <div className="editor-page">
      <LexicalComposer initialConfig={initialConfig} key={`${docId}-${isCollabMode}`}>
        <MenuBar docId={docId} />
        <ToolbarPlugin onAIClick={() => useAppStore.getState().setAiPanelOpen(true)} />

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div className="editor-body" style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <RichTextPlugin
                contentEditable={<ContentEditable className="editor-paper" style={{ fontFamily: localStorage.getItem('default_font') || 'Merriweather' }} spellCheck />}
                placeholder={<div className="editor-placeholder" style={{ top: 96, left: 96 }}>Start typing…</div>}
                ErrorBoundary={LexicalErrorBoundary}
              />
            </div>
          </div>

          {/* AI Panel sidebar */}
          {aiPanelOpen && (
            <AIPanel
              docContext={docContext}
              onInsert={(text) => {
                document.execCommand('insertText', false, text);
              }}
            />
          )}

          {/* Comments sidebar */}
          {commentSidebarOpen && <CommentSidebar comments={comments} setComments={setComments} />}
        </div>

        {/* Only render local HistoryPlugin if not in collab mode */}
        {!isCollabMode && <HistoryPlugin />}
        {isCollabMode && <CollabPluginWrapper docId={docId} />}

        <AutoFocusPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <TabIndentationPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <AutoSavePlugin docId={docId} />
        <OnChangePlugin onChange={handleChange} />
        <FindReplacePlugin />
        <OutlinePlugin />
        <WordCountPlugin />
        <StatusBar />
      </LexicalComposer>

      {/* Floating AI bar on text selection */}
      {selection && (
        <AIPromptBar
          selectedText={selection.text}
          position={{ x: selection.x, y: selection.y }}
          onReplace={(text) => { document.execCommand('insertText', false, text); setSelection(null); }}
          onDismiss={() => setSelection(null)}
        />
      )}
    </div>
  );
}

function MenuBar({ docId: _docId }: { docId: string }) {
  const { addToast, setFindOpen, setOutlineOpen, setWordCountOpen, setCommentSidebarOpen, commentSidebarOpen, setAiPanelOpen, aiPanelOpen, isCollabMode, setIsCollabMode } = useAppStore();
  const [open, setOpen] = React.useState<string | null>(null);
  const [editor] = useLexicalComposerContext();

  const menus = [
    {
      label: 'File', items: [
        { label: 'New Document', shortcut: '⌘N', action: () => addToast('Use sidebar "New Document"') },
        { label: 'separator' },
        { label: 'Download as PDF', action: () => exportToPDF('.editor-paper', 'OpenDocument').catch(() => addToast('Error exporting PDF')) },
        { label: 'Download as Markdown', action: () => exportToMarkdown(editor, 'OpenDocument') },
        { label: 'Download as Plain Text', action: () => exportToPlainText(editor, 'OpenDocument') },
      ]
    },
    {
      label: 'Edit', items: [
        { label: 'Undo', shortcut: '⌘Z', action: () => document.execCommand('undo') },
        { label: 'Redo', shortcut: '⌘⇧Z', action: () => document.execCommand('redo') },
        { label: 'separator' },
        { label: 'Find', shortcut: '⌘F', action: () => setFindOpen(true) },
        { label: 'Find & Replace', shortcut: '⌘H', action: () => setFindOpen(true) },
        { label: 'separator' },
        { label: 'Select All', shortcut: '⌘A', action: () => document.execCommand('selectAll') },
      ]
    },
    {
      label: 'View', items: [
        { label: 'Document Outline', action: () => setOutlineOpen(true) },
        { label: 'Word Count', action: () => setWordCountOpen(true) },
        { label: `${commentSidebarOpen ? 'Hide' : 'Show'} Comments`, action: () => setCommentSidebarOpen(!commentSidebarOpen) },
        { label: `${aiPanelOpen ? 'Hide' : 'Show'} AI Panel`, action: () => setAiPanelOpen(!aiPanelOpen) },
      ]
    },
    {
      label: 'Insert', items: [
        { label: 'Comment', shortcut: '⌘⌥M', action: () => setCommentSidebarOpen(true) },
        { label: 'Link', shortcut: '⌘K', action: () => addToast('Select text then use toolbar link button') },
        { label: 'Table', action: () => addToast('Table — Phase 5 coming') },
        { label: 'Image', action: () => addToast('Image upload — Phase 5 coming') },
      ]
    },
    {
      label: 'Format', items: [
        { label: 'Bold', shortcut: '⌘B', action: () => document.execCommand('bold') },
        { label: 'Italic', shortcut: '⌘I', action: () => document.execCommand('italic') },
        { label: 'Underline', shortcut: '⌘U', action: () => document.execCommand('underline') },
        { label: 'separator' },
        { label: 'Clear Formatting', action: () => { } },
      ]
    },
    {
      label: 'Tools', items: [
        { label: 'Word Count', action: () => setWordCountOpen(true) },
        { label: 'Document Outline', action: () => setOutlineOpen(true) },
        { label: 'Find & Replace', shortcut: '⌘H', action: () => setFindOpen(true) },
        { label: 'separator' },
        { label: 'AI Assistant', shortcut: '⌘⇧A', action: () => setAiPanelOpen(true) },
      ]
    },
    {
      label: 'Help', items: [
        { label: 'Keyboard Shortcuts', action: () => addToast('⌘B Bold · ⌘I Italic · ⌘U Underline · ⌘F Find · ⌘⇧A AI') },
        { label: 'About Open Documents', action: () => addToast('Open Documents — Phase 7 ✦ Collaboration active') },
      ]
    },
  ];

  return (
    <>
      {open && <div className="dropdown-overlay" onClick={() => setOpen(null)} />}
      <div className="menubar">
        {menus.map(menu => (
          <div key={menu.label} style={{ position: 'relative' }}>
            <button className={`menu-btn ${open === menu.label ? 'active' : ''}`} onClick={() => setOpen(open === menu.label ? null : menu.label)}>
              {menu.label}
            </button>
            {open === menu.label && (
              <div className="dropdown-menu" style={{ top: '100%', left: 0 }}>
                {menu.items.map((item, i) =>
                  item.label === 'separator'
                    ? <div key={i} className="dropdown-sep" />
                    : <div key={i} className="dropdown-item" onClick={() => { item.action?.(); setOpen(null); }}>
                      {item.label}
                      {item.shortcut && <span className="dropdown-shortcut">{item.shortcut}</span>}
                    </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="btn btn-outline"
            style={{ height: 26, fontSize: 11, padding: '0 10px', borderColor: isCollabMode ? 'var(--accent)' : 'var(--border)', color: isCollabMode ? 'var(--accent)' : 'var(--text-secondary)' }}
            onClick={() => {
              if (!isCollabMode) addToast('Connecting to collaboration server...');
              setIsCollabMode(!isCollabMode);
            }}
          >
            {isCollabMode ? 'Stop Sharing' : 'Share (Collab Mode)'}
          </button>
        </div>
      </div>
    </>
  );
}

function StatusBar() {
  const { saveStatus } = useAppStore();
  const label = saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'All changes saved' : saveStatus === 'error' ? 'Error saving' : '';
  return (
    <div className="status-bar">
      <span className="status-item">Page 1</span>
      <div className={`status-save ${saveStatus}`}>{label}</div>
    </div>
  );
}
