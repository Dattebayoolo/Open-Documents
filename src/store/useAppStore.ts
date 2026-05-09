import { create } from 'zustand';

type Theme = 'light' | 'dark';
type View = 'grid' | 'list';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AppState {
  theme: Theme;
  toggleTheme: () => void;
  activeDocumentId: string | null;
  setActiveDocument: (id: string | null) => void;
  view: View;
  setView: (v: View) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  cmdOpen: boolean;
  setCmdOpen: (open: boolean) => void;
  aiPanelOpen: boolean;
  setAiPanelOpen: (open: boolean) => void;
  findOpen: boolean;
  setFindOpen: (open: boolean) => void;
  outlineOpen: boolean;
  setOutlineOpen: (open: boolean) => void;
  wordCountOpen: boolean;
  setWordCountOpen: (open: boolean) => void;
  commentSidebarOpen: boolean;
  setCommentSidebarOpen: (open: boolean) => void;
  isCollabMode: boolean;
  setIsCollabMode: (collab: boolean) => void;
  saveStatus: SaveStatus;
  setSaveStatus: (s: SaveStatus) => void;
  toasts: { id: string; msg: string }[];
  addToast: (msg: string) => void;
  removeToast: (id: string) => void;
}

const useAppStore = create<AppState>((set, get) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    set({ theme: next });
  },
  activeDocumentId: null,
  setActiveDocument: (id) => set({ activeDocumentId: id }),
  view: 'grid',
  setView: (v) => set({ view: v }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  cmdOpen: false,
  setCmdOpen: (open) => set({ cmdOpen: open }),
  aiPanelOpen: false,
  setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
  findOpen: false,
  setFindOpen: (open) => set({ findOpen: open }),
  outlineOpen: false,
  setOutlineOpen: (open) => set({ outlineOpen: open }),
  wordCountOpen: false,
  setWordCountOpen: (open) => set({ wordCountOpen: open }),
  commentSidebarOpen: false,
  setCommentSidebarOpen: (open) => set({ commentSidebarOpen: open }),
  isCollabMode: false,
  setIsCollabMode: (c) => set({ isCollabMode: c }),
  saveStatus: 'idle',
  setSaveStatus: (s) => set({ saveStatus: s }),
  toasts: [],
  addToast: (msg) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, msg }] }));
    setTimeout(() => get().removeToast(id), 3000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export default useAppStore;
