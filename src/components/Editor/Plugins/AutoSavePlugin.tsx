import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import db from '../../../db/db';
import useAppStore from '../../../store/useAppStore';

interface AutoSavePluginProps { docId: string; }

export default function AutoSavePlugin({ docId }: AutoSavePluginProps) {
  const [editor] = useLexicalComposerContext();
  const { setSaveStatus } = useAppStore();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const docIdRef = useRef(docId);
  docIdRef.current = docId;

  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      if (timer.current) clearTimeout(timer.current);
      setSaveStatus('saving');
      timer.current = setTimeout(async () => {
        try {
          const state = JSON.stringify(editorState.toJSON());
          let wordCount = 0;
          let charCount = 0;
          let plainText = '';
          editorState.read(() => {
            const text = $getRoot().getTextContent();
            plainText = text;
            charCount = text.length;
            wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
          });
          await db.documents.update(docIdRef.current, {
            lexicalState: state,
            plainText,
            wordCount,
            charCount,
            readingTimeMin: Math.ceil(wordCount / 200),
            updatedAt: Date.now(),
          });
          setSaveStatus('saved');
        } catch {
          setSaveStatus('error');
        }
      }, 1500);
    });

    return () => {
      unregister();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [editor, setSaveStatus]);

  return null;
}
