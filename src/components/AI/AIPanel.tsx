import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, RotateCcw, Copy, Settings } from 'lucide-react';
import { streamCompletion, type ChatMessage, AI_ACTIONS, setApiKey } from '../../services/ai';
import useAppStore from '../../store/useAppStore';

interface AIPanelProps { docContext?: string; onInsert?: (text: string) => void; }

export default function AIPanel({ docContext, onInsert }: AIPanelProps) {
  const { aiPanelOpen, setAiPanelOpen } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<boolean>(false);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (prompt?: string) => {
    const text = (prompt ?? input).trim();
    if (!text || streaming) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setStreaming(true);
    abortRef.current = false;

    const assistantMsg: ChatMessage = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const gen = streamCompletion(text, docContext, messages);
      for await (const token of gen) {
        if (abortRef.current) break;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: updated[updated.length - 1].content + token };
          return updated;
        });
      }
    } catch (e) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: 'Something went wrong. Please try again.' };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  const stop = () => { abortRef.current = true; setStreaming(false); };
  const clear = () => { setMessages([]); abortRef.current = true; setStreaming(false); };
  const copyMsg = (text: string) => { navigator.clipboard.writeText(text); };
  const insertMsg = (text: string) => { onInsert?.(text); };
  const saveKey = () => { setApiKey(apiKeyInput); setShowSettings(false); };

  if (!aiPanelOpen) return null;

  return (
    <div style={{
      width: 320, borderLeft: '1px solid var(--border)', background: 'var(--bg-surface)',
      display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={15} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>AI Assistant</span>
          <span className="badge" style={{ fontSize: 9 }}>BETA</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="icon-btn" title="Settings" onClick={() => setShowSettings(s => !s)}><Settings size={14} /></button>
          <button className="icon-btn" title="Clear chat" onClick={clear}><RotateCcw size={14} /></button>
          <button className="icon-btn" title="Close" onClick={() => setAiPanelOpen(false)}><X size={15} /></button>
        </div>
      </div>

      {/* API Key settings */}
      {showSettings && (
        <div style={{ padding: 12, borderBottom: '1px solid var(--border)', background: 'var(--bg-raised)', flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
            Enter your OpenAI API key to use real AI. Leave blank for simulated responses.
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="password"
              placeholder="sk-..."
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              style={{ flex: 1, height: 28, padding: '0 8px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none' }}
            />
            <button className="btn btn-primary" style={{ height: 28, padding: '0 10px', fontSize: 11 }} onClick={saveKey}>Save</button>
          </div>
        </div>
      )}

      {/* Quick actions */}
      {messages.length === 0 && (
        <div style={{ padding: 12, borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Quick actions</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {AI_ACTIONS.map(a => (
              <button
                key={a.id}
                onClick={() => send(a.prompt + (docContext?.slice(0, 300) || 'my document'))}
                style={{
                  height: 26, padding: '0 10px', fontSize: 11, fontWeight: 500,
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-base)', color: 'var(--text-secondary)', cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-fg)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-base)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 32 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Sparkles size={20} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Ask me anything</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              I can help you write, improve, summarize, or expand your document content.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '88%', padding: '9px 12px', borderRadius: 'var(--radius-lg)',
              fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap',
              background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-base)',
              color: msg.role === 'user' ? 'var(--accent-fg)' : 'var(--text-primary)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
            }}>
              {msg.content || (streaming && i === messages.length - 1
                ? <span style={{ display: 'inline-flex', gap: 3 }}>
                    {[0, 1, 2].map(j => <span key={j} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: `pulse 1.2s ${j * 0.2}s infinite` }} />)}
                  </span>
                : ''
              )}
            </div>
            {msg.role === 'assistant' && msg.content && (
              <div style={{ display: 'flex', gap: 4, paddingLeft: 4 }}>
                <button className="icon-btn" style={{ width: 22, height: 22 }} title="Copy" onClick={() => copyMsg(msg.content)}><Copy size={11} /></button>
                {onInsert && <button className="icon-btn" style={{ width: 22, height: 22, fontSize: 11 }} title="Insert at cursor" onClick={() => insertMsg(msg.content)}>↵</button>}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid var(--border)', padding: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          <textarea
            placeholder="Ask AI anything about your document…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={2}
            style={{
              flex: 1, resize: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              padding: '7px 10px', fontSize: 13, background: 'var(--bg-base)', color: 'var(--text-primary)',
              outline: 'none', fontFamily: 'var(--font-ui)', lineHeight: 1.5,
            }}
          />
          {streaming
            ? <button className="btn btn-outline" style={{ height: 36, padding: '0 10px', fontSize: 12, flexShrink: 0 }} onClick={stop}>Stop</button>
            : <button className="btn btn-primary" style={{ height: 36, width: 36, padding: 0, flexShrink: 0 }} onClick={() => send()} disabled={!input.trim()}>
                <Send size={14} />
              </button>
          }
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5, textAlign: 'center' }}>
          Press Enter to send · Shift+Enter for newline
        </p>
      </div>

      <style>{`@keyframes pulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}
