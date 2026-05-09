import { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import { Settings, X, Moon, Sun, Key, Type, Save } from 'lucide-react';
import { setApiKey } from '../../services/ai';

export default function SettingsPage() {
  const { theme, toggleTheme, settingsOpen, setSettingsOpen } = useAppStore();
  const [apiKey, setLocalApiKey] = useState('');
  const [font, setFont] = useState('Merriweather');

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    setLocalApiKey(savedKey || '');
    setFont(localStorage.getItem('default_font') || 'Merriweather');
  }, [settingsOpen]);

  if (!settingsOpen) return null;

  const saveSettings = () => {
    setApiKey(apiKey);
    localStorage.setItem('default_font', font);
    setSettingsOpen(false);
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'var(--bg-base)', zIndex: 200, display: 'flex', flexDirection: 'column'
    }}>
      <header style={{ height: 48, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', flexShrink: 0, background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Settings size={16} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Settings</span>
        </div>
        <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={() => setSettingsOpen(false)}>
          <X size={18} />
        </button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 32 }}>

          <section>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Appearance</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Theme</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Toggle between light and dark mode.</div>
                </div>
              </div>
              <button className="btn btn-outline" onClick={toggleTheme}>
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Editor</h3>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', overflow: 'hidden' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Type size={18} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Default Font</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>The default font family for new documents.</div>
                  </div>
                </div>
                <select
                  value={font}
                  onChange={e => setFont(e.target.value)}
                  style={{ height: 32, padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}
                >
                  <option value="Merriweather">Merriweather (Serif)</option>
                  <option value="Inter">Inter (Sans-serif)</option>
                  <option value="JetBrains Mono">JetBrains Mono (Monospace)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Save size={18} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Auto-Save</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Documents are automatically saved to local storage.</div>
                  </div>
                </div>
                <div className="badge">Always On (1.5s)</div>
              </div>
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>AI Integration</h3>
            <div style={{ padding: '16px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Key size={18} style={{ marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>OpenAI API Key</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>
                    Enter your OpenAI API key to power the AI assistant. If left blank, Open Documents will use a simulated fallback for demonstration purposes. Your key is stored securely in your browser's local storage.
                  </div>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={e => setLocalApiKey(e.target.value)}
                    style={{ width: '100%', maxWidth: 360, height: 36, padding: '0 12px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16 }}>
            <button className="btn btn-primary" onClick={saveSettings}>Save Preferences</button>
          </div>
        </div>
      </div>
    </div>
  );
}
