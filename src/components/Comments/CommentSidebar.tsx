import { useState } from 'react';
import { MessageSquare, X, CheckCircle, Circle, Trash2, Plus } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: number;
  resolved: boolean;
  replies: { id: string; text: string; author: string; createdAt: number }[];
}

interface Props {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export default function CommentSidebar({ comments, setComments }: Props) {
  const { commentSidebarOpen, setCommentSidebarOpen } = useAppStore();
  const [newText, setNewText] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const addComment = () => {
    if (!newText.trim()) return;
    setComments(prev => [...prev, {
      id: crypto.randomUUID(), text: newText.trim(), author: 'You',
      createdAt: Date.now(), resolved: false, replies: [],
    }]);
    setNewText('');
  };

  const resolveComment = (id: string) =>
    setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c));

  const deleteComment = (id: string) =>
    setComments(prev => prev.filter(c => c.id !== id));

  const addReply = (id: string) => {
    const text = replyText[id];
    if (!text?.trim()) return;
    setComments(prev => prev.map(c => c.id === id
      ? { ...c, replies: [...c.replies, { id: crypto.randomUUID(), text: text.trim(), author: 'You', createdAt: Date.now() }] }
      : c
    ));
    setReplyText(prev => ({ ...prev, [id]: '' }));
  };

  const fmt = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const active = comments.filter(c => !c.resolved);
  const resolved = comments.filter(c => c.resolved);

  if (!commentSidebarOpen) return null;

  return (
    <div style={{
      width: 280, borderLeft: '1px solid var(--border)', background: 'var(--bg-surface)',
      display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageSquare size={15} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Comments</span>
          {active.length > 0 && <span className="badge">{active.length}</span>}
        </div>
        <button className="icon-btn" onClick={() => setCommentSidebarOpen(false)}><X size={15} /></button>
      </div>

      {/* New comment */}
      <div style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
        <textarea
          placeholder="Add a comment…"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          rows={2}
          style={{ width: '100%', resize: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 8px', fontSize: 12, background: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-ui)' }}
        />
        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 6, height: 28, fontSize: 12 }}
          onClick={addComment}
        >
          <Plus size={13} /> Add Comment
        </button>
      </div>

      {/* Comments list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {comments.length === 0 && (
          <div className="empty-state" style={{ padding: '32px 12px' }}>
            <div className="empty-state-icon"><MessageSquare size={18} style={{ color: 'var(--text-muted)' }} /></div>
            <div className="empty-state-text">No comments yet</div>
          </div>
        )}

        {active.length > 0 && <div className="sidebar-label" style={{ marginBottom: 4 }}>Open</div>}
        {active.map(c => <CommentCard key={c.id} c={c} onResolve={resolveComment} onDelete={deleteComment} replyText={replyText[c.id] || ''} setReplyText={t => setReplyText(p => ({ ...p, [c.id]: t }))} onReply={() => addReply(c.id)} fmt={fmt} />)}

        {resolved.length > 0 && <div className="sidebar-label" style={{ marginTop: 12, marginBottom: 4 }}>Resolved</div>}
        {resolved.map(c => <CommentCard key={c.id} c={c} onResolve={resolveComment} onDelete={deleteComment} replyText={replyText[c.id] || ''} setReplyText={t => setReplyText(p => ({ ...p, [c.id]: t }))} onReply={() => addReply(c.id)} fmt={fmt} />)}
      </div>
    </div>
  );
}

function CommentCard({ c, onResolve, onDelete, replyText, setReplyText, onReply, fmt }: {
  c: Comment; onResolve: (id: string) => void; onDelete: (id: string) => void;
  replyText: string; setReplyText: (t: string) => void; onReply: () => void;
  fmt: (ts: number) => string;
}) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: 8,
      background: 'var(--bg-base)', opacity: c.resolved ? 0.6 : 1,
    }}>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
              {c.author[0]}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{c.author}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmt(c.createdAt)}</span>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            <button className="icon-btn" style={{ width: 22, height: 22 }} title={c.resolved ? 'Reopen' : 'Resolve'} onClick={() => onResolve(c.id)}>
              {c.resolved ? <Circle size={13} /> : <CheckCircle size={13} />}
            </button>
            <button className="icon-btn" style={{ width: 22, height: 22 }} title="Delete" onClick={() => onDelete(c.id)}>
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5 }}>{c.text}</p>
      </div>

      {c.replies.map(r => (
        <div key={r.id} style={{ borderTop: '1px solid var(--border)', padding: '8px 12px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--bg-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>{r.author[0]}</div>
            <span style={{ fontSize: 11, fontWeight: 600 }}>{r.author}</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{fmt(r.createdAt)}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.text}</p>
        </div>
      ))}

      <div style={{ borderTop: '1px solid var(--border)', padding: '6px 8px' }}>
        {!showReply ? (
          <button style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowReply(true)}>
            Reply…
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 4 }}>
            <input
              autoFocus
              placeholder="Reply…"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { onReply(); setShowReply(false); } if (e.key === 'Escape') setShowReply(false); }}
              style={{ flex: 1, height: 26, padding: '0 6px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none' }}
            />
            <button className="btn btn-primary" style={{ height: 26, padding: '0 8px', fontSize: 11 }} onClick={() => { onReply(); setShowReply(false); }}>↵</button>
          </div>
        )}
      </div>
    </div>
  );
}
