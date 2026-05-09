import { useEffect, useState, useMemo } from 'react';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { providerFactory, getRandomColor, getRandomName } from '../../../services/collab';
import { Users } from 'lucide-react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HocuspocusProvider } from '@hocuspocus/provider';

interface CollabProps {
  docId: string;
}

export default function CollabPluginWrapper({ docId }: CollabProps) {
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
  const color = useMemo(() => getRandomColor(), []);
  const name = useMemo(() => getRandomName(), []);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  // The cursor rendering is handled automatically by LexicalCollaborationPlugin
  // We just need to render the presence avatars

  useEffect(() => {
    if (!provider) return;
    
    // Connect to websocket when mounted
    provider.connect();
    
    const updateAwareness = () => {
      // Hocuspocus maps awareness states to provider.awareness
      const states = Array.from(provider.awareness.getStates().values());
      const users = states.map((state: any) => state.user).filter(Boolean);
      setActiveUsers(users);
    };

    provider.awareness.on('change', updateAwareness);
    
    // Set our own presence
    provider.awareness.setLocalStateField('user', { name, color });

    return () => {
      provider.awareness.off('change', updateAwareness);
      provider.destroy();
    };
  }, [provider, name, color]);

  return (
    <>
      <CollaborationPlugin
        id={docId}
        providerFactory={(id, yjsDocMap) => {
          const newProvider = providerFactory(id, yjsDocMap) as unknown as HocuspocusProvider;
          setProvider(newProvider);
          return newProvider as any;
        }}
        shouldBootstrap={true}
        username={name}
        cursorColor={color}
        cursorsContainerRef={null as any}
      />
      {/* Absolute positioned presence bar for the editor header */}
      <div style={{
        position: 'absolute', top: 12, right: 12, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 8px', background: 'var(--bg-surface)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Users size={12} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
          {activeUsers.length} online
        </span>
        <div style={{ display: 'flex', marginLeft: 4 }}>
          {activeUsers.slice(0, 3).map((u, i) => (
            <div key={i} title={u.name} style={{
              width: 20, height: 20, borderRadius: '50%',
              background: u.color || 'var(--text-primary)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, marginLeft: i > 0 ? -6 : 0,
              border: '2px solid var(--bg-surface)'
            }}>
              {u.name?.[0]?.toUpperCase()}
            </div>
          ))}
          {activeUsers.length > 3 && (
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--bg-overlay)', color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, marginLeft: -6,
              border: '2px solid var(--bg-surface)'
            }}>
              +{activeUsers.length - 3}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
