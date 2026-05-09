import { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, UNDO_COMMAND, REDO_COMMAND,
  $getSelection, $isRangeSelection, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND,
  $createParagraphNode,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND, $isListNode, ListNode } from '@lexical/list';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { $setBlocksType, $patchStyleText } from '@lexical/selection';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo, List, ListOrdered, ListChecks, Indent, Outdent, Sparkles, Link2,
  Subscript, Superscript, Code, RemoveFormatting,
} from 'lucide-react';

const FONT_FAMILIES = ['Merriweather', 'Inter', 'JetBrains Mono', 'Arial', 'Georgia', 'Times New Roman', 'Courier New'];
const FONT_SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '24', '30', '36', '48', '60', '72'];

const HEADING_MAP: Record<string, string> = {
  'Normal': 'paragraph', 'Heading 1': 'h1', 'Heading 2': 'h2',
  'Heading 3': 'h3', 'Heading 4': 'h4', 'Heading 5': 'h5', 'Heading 6': 'h6', 'Quote': 'quote',
};

interface ToolbarProps { onAIClick?: () => void; }

export default function ToolbarPlugin({ onAIClick }: ToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isSub, setIsSub] = useState(false);
  const [isSup, setIsSup] = useState(false);
  const [blockType, setBlockType] = useState('Normal');
  const [fontSize, setFontSize] = useState('11');
  const [fontFamily, setFontFamily] = useState('Merriweather');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsUnderline(selection.hasFormat('underline'));
    setIsStrike(selection.hasFormat('strikethrough'));
    setIsCode(selection.hasFormat('code'));
    setIsSub(selection.hasFormat('subscript'));
    setIsSup(selection.hasFormat('superscript'));

    const anchorNode = selection.anchor.getNode();
    const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
    if ($isHeadingNode(element)) {
      const tag = element.getTag();
      setBlockType('Heading ' + tag.replace('h', ''));
    } else if ($isListNode(element)) {
      const nearest = $getNearestNodeOfType(anchorNode, ListNode);
      setBlockType(nearest?.getListType() === 'number' ? 'Heading 1' : 'Normal');
    } else {
      setBlockType('Normal');
    }
  }, []);

  useEffect(() => mergeRegister(
    editor.registerUpdateListener(({ editorState }) => editorState.read(updateToolbar)),
  ), [editor, updateToolbar]);

  const applyBlockType = (label: string) => {
    const tag = HEADING_MAP[label];
    if (!tag) return;
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (tag === 'paragraph') {
        $setBlocksType(selection, () => $createParagraphNode());
      } else if (tag === 'quote') {
        $setBlocksType(selection, () => $createQuoteNode());
      } else {
        $setBlocksType(selection, () => $createHeadingNode(tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'));
      }
    });
    setBlockType(label);
  };

  const handleLinkInsert = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  return (
    <div className="toolbar">
      <button className="toolbar-btn" title="Undo (⌘Z)" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}><Undo size={14} /></button>
      <button className="toolbar-btn" title="Redo (⌘⇧Z)" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}><Redo size={14} /></button>
      <div className="toolbar-divider" />

      <select className="toolbar-select" style={{ width: 128 }} value={fontFamily} onChange={e => {
        const val = e.target.value;
        setFontFamily(val);
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) $patchStyleText(sel, { 'font-family': val });
        });
      }} title="Font family">
        {FONT_FAMILIES.map(f => <option key={f}>{f}</option>)}
      </select>

      <select className="toolbar-select" style={{ width: 52 }} value={fontSize} onChange={e => {
        const val = e.target.value;
        setFontSize(val);
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) $patchStyleText(sel, { 'font-size': val + 'px' });
        });
      }} title="Font size">
        {FONT_SIZES.map(s => <option key={s}>{s}</option>)}
      </select>

      <div className="toolbar-divider" />

      <select className="toolbar-select" style={{ width: 108 }} value={blockType} onChange={e => applyBlockType(e.target.value)} title="Block type">
        {Object.keys(HEADING_MAP).map(h => <option key={h}>{h}</option>)}
      </select>

      <div className="toolbar-divider" />

      <button className={`toolbar-btn ${isBold ? 'active' : ''}`} title="Bold (⌘B)" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}><Bold size={14} /></button>
      <button className={`toolbar-btn ${isItalic ? 'active' : ''}`} title="Italic (⌘I)" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}><Italic size={14} /></button>
      <button className={`toolbar-btn ${isUnderline ? 'active' : ''}`} title="Underline (⌘U)" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}><Underline size={14} /></button>
      <button className={`toolbar-btn ${isStrike ? 'active' : ''}`} title="Strikethrough" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}><Strikethrough size={14} /></button>
      <button className={`toolbar-btn ${isCode ? 'active' : ''}`} title="Inline Code" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}><Code size={14} /></button>
      <button className={`toolbar-btn ${isSub ? 'active' : ''}`} title="Subscript" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}><Subscript size={14} /></button>
      <button className={`toolbar-btn ${isSup ? 'active' : ''}`} title="Superscript" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}><Superscript size={14} /></button>

      <div className="toolbar-divider" />

      <button className="toolbar-btn" title="Align left" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}><AlignLeft size={14} /></button>
      <button className="toolbar-btn" title="Align center" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}><AlignCenter size={14} /></button>
      <button className="toolbar-btn" title="Align right" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}><AlignRight size={14} /></button>
      <button className="toolbar-btn" title="Justify" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}><AlignJustify size={14} /></button>

      <div className="toolbar-divider" />

      <button className="toolbar-btn" title="Bullet list" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}><List size={14} /></button>
      <button className="toolbar-btn" title="Numbered list" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}><ListOrdered size={14} /></button>
      <button className="toolbar-btn" title="Checklist" onClick={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)}><ListChecks size={14} /></button>
      <button className="toolbar-btn" title="Indent" onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}><Indent size={14} /></button>
      <button className="toolbar-btn" title="Outdent" onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}><Outdent size={14} /></button>

      <div className="toolbar-divider" />
      <button className="toolbar-btn" title="Insert link" onClick={handleLinkInsert}><Link2 size={14} /></button>
      <button className="toolbar-btn" title="Clear formatting" onClick={() => {
        editor.update(() => {
          const sel = $getSelection();
          if (!$isRangeSelection(sel)) return;
          (sel as any).formatBold = false;
          (sel as any).formatItalic = false;
          (sel as any).formatUnderline = false;
          (sel as any).formatStrikethrough = false;
          (sel as any).formatCode = false;
          (sel as any).formatSubscript = false;
          (sel as any).formatSuperscript = false;
          $patchStyleText(sel, {
            'font-family': '',
            'font-size': '',
            'background-color': '',
            'color': '',
          });
        });
      }}><RemoveFormatting size={14} /></button>

      <button className="ai-pill" onClick={onAIClick}><Sparkles size={12} /> Ask AI</button>
    </div>
  );
}