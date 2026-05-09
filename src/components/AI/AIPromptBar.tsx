import { useState } from 'react';
import { Sparkles, X, Loader } from 'lucide-react';
import { streamCompletion, AI_ACTIONS } from '../../services/ai';

interface AIPromptBarProps {
  selectedText: string;
  onReplace: (text: string) => void;
  onDismiss: () => void;
  position: { x: number; y: number };
}

export default function AIPromptBar({ selectedText, onReplace, onDismiss, position }: AIPromptBarProps) {
  const [result, setResult] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const runAction = async (prompt: string, actionId: string) => {
    setResult('');
    setStreaming(true);
    setActiveAction(actionId);
    let acc = '';
    try {
      const gen = streamCompletion(prompt + selectedText);
      for await (const token of gen) {
        acc += token;
        setResult(acc);
      }
    } finally {
      setStreaming(false);
    }
  };

  const runCustom = async () => {
    if (!customPrompt.trim()) return;
    await runAction(customPrompt + ': ', 'custom');
    setShowCustom(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: Math.min(position.y + 8, window.innerHeight - 400),
      left: Math.min(position.x, window.innerWidth - 360),
      zIndex: 180,
      width: 340,
      background: 'var(--bg-base)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
    }}>
      {/* Actions row */}
      <div style={{ padding: '8px 8px 6px', borderBottom: result ? '1px solid var(--border)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Sparkles size={12} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>AI — "{selectedText.slice(0, 40)}{selectedText.length > 40 ? '…' : ''}"</span>
          <button className="icon-btn" style={{ width: 20, height: 20, marginLeft: 'auto' }} onClick={onDismiss}><X size={12} /></button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {AI_ACTIONS.slice(0, 5).map(a => (
            <button
              key={a.id}
              onClick={() => runAction(a.prompt, a.id)}
              disabled={streaming}
              style={{
                height: 24, padding: '0 9px', fontSize: 11, fontWeight: 500,
                border: '1px solid var(--border)', borderRadius: 'var(--radius-full)',
                background: activeAction === a.id ? 'var(--accent)' : 'var(--bg-surface)',
                color: activeAction === a.id ? 'var(--accent-fg)' : 'var(--text-secondary)',
                cursor: streaming ? 'not-allowed' : 'pointer', opacity: streaming && activeAction !== a.id ? 0.5 : 1,
                transition: 'all 150ms',
              }}
            >
              {streaming && activeAction === a.id ? <Loader size={10} style={{ animation: 'spin 600ms linear infinite' }} /> : a.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(s => !s)}
            style={{ height: 24, padding: '0 9px', fontSize: 11, border: '1px dashed var(--border)', borderRadius: 'var(--radius-full)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            Custom…
          </button>
        </div>
        {showCustom && (
          <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
            <input
              autoFocus
              placeholder="Custom instruction…"
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runCustom()}
              style={{ flex: 1, height: 26, padding: '0 8px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none' }}
            />
            <button className="btn btn-primary" style={{ height: 26, padding: '0 10px', fontSize: 11 }} onClick={runCustom}>↵</button>
          </div>
        )}
      </div>

      {/* Result area */}
      {result && (
        <div>
          <div style={{ padding: '10px 14px', maxHeight: 180, overflowY: 'auto', fontSize: 13, lineHeight: 1.65, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
            {result}
            {streaming && <span style={{ display: 'inline-block', width: 2, height: 14, background: 'var(--text-primary)', marginLeft: 1, animation: 'blink 1s step-end infinite' }} />}
          </div>
          {!streaming && (
            <div style={{ display: 'flex', gap: 6, padding: '8px 10px', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-primary" style={{ flex: 1, height: 28, fontSize: 12 }} onClick={() => { onReplace(result); onDismiss(); }}>Replace selection</button>
              <button className="btn btn-outline" style={{ flex: 1, height: 28, fontSize: 12 }} onClick={() => { setResult(''); setActiveAction(null); }}>Discard</button>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
}
