# Open Documents — Comprehensive Grade Plan
> **Open Source · Google Docs Alternative · Black & White Monochromatic UI · Extensive Backend**

---

## 1. Executive Summary

Open Documents is a production-grade, browser-first document editor that rivals Google Docs in capability while being fully open source. It uses a strict **black-and-white monochromatic design language** — clean, typographic, high-contrast, zero color distraction — with a deeply functional backend powering real-time collaboration, AI writing assistance, offline-first persistence, rich export, and a full document management system.

---

## 2. Design Philosophy — Monochromatic B&W System

### Color Tokens
| Token | Light Mode | Dark Mode |
|---|---|---|
| `--bg-base` | `#ffffff` | `#0a0a0a` |
| `--bg-surface` | `#f5f5f5` | `#141414` |
| `--bg-raised` | `#ebebeb` | `#1e1e1e` |
| `--bg-overlay` | `#e0e0e0` | `#2a2a2a` |
| `--text-primary` | `#0a0a0a` | `#f0f0f0` |
| `--text-secondary` | `#4a4a4a` | `#a0a0a0` |
| `--text-muted` | `#8a8a8a` | `#606060` |
| `--border` | `#d4d4d4` | `#2e2e2e` |
| `--border-strong` | `#9a9a9a` | `#4a4a4a` |
| `--accent` | `#000000` | `#ffffff` |
| `--accent-hover` | `#1a1a1a` | `#e0e0e0` |
| `--selection` | `rgba(0,0,0,0.12)` | `rgba(255,255,255,0.12)` |

### Typography Scale
- **Font Stack**: `'Inter'` (UI), `'Merriweather'` (document body), `'JetBrains Mono'` (code)
- **Size Scale**: 11 / 12 / 13 / 14 / 16 / 18 / 24 / 32 / 48px
- **Weight**: 400 / 500 / 600 / 700

### Spacing & Motion
- **Grid**: 4px base unit
- **Radius**: 4px (inputs) / 6px (cards) / 8px (modals) / 999px (pills)
- **Transitions**: `150ms ease` (micro), `250ms ease` (panels), `350ms cubic-bezier(0.4,0,0.2,1)` (modals)
- **Shadows**: Monochromatic — `0 1px 3px rgba(0,0,0,0.08)`, `0 4px 16px rgba(0,0,0,0.12)`

---

## 3. Technology Stack

### Frontend
| Layer | Choice | Rationale |
|---|---|---|
| Framework | React 18 + Vite + TypeScript | Speed, ecosystem, type safety |
| Editor Engine | Lexical (Meta) | Custom nodes, AI ghost text, extensible |
| State Management | Zustand | Lightweight, no boilerplate |
| Local DB | Dexie.js (IndexedDB) | Offline-first, reactive live queries |
| Real-time Sync | Yjs + WebSocket Provider | CRDT-based conflict-free collaboration |
| Styling | Vanilla CSS (CSS Variables) | Maximum control, zero runtime overhead |
| Icons | Lucide React | Consistent, tree-shakeable |
| Routing | React Router v6 | File-based-like routing |
| Drag & Drop | @dnd-kit | Accessible, headless |
| PDF Export | jsPDF + html2canvas | Client-side PDF generation |
| Markdown | unified / remark / rehype | Markdown import/export pipeline |
| Testing | Vitest + Testing Library | Unit + integration |

### Backend (Node.js Server)
| Layer | Choice |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Fastify |
| ORM | Drizzle ORM |
| Database | PostgreSQL 16 |
| Real-time | ws (WebSocket) + Yjs y-websocket |
| Auth | Lucia Auth (sessions) |
| File Storage | MinIO (S3-compatible, self-hosted) |
| AI Gateway | OpenAI SDK (swappable provider) |
| Queue | BullMQ + Redis |
| Cache | Redis |
| Search | Meilisearch |

---

## 4. File & Folder Structure

```
open-documents/
├── apps/
│   ├── web/                          # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Editor/
│   │   │   │   │   ├── Editor.tsx
│   │   │   │   │   ├── Editor.css
│   │   │   │   │   ├── Toolbar/
│   │   │   │   │   │   ├── ToolbarPlugin.tsx
│   │   │   │   │   │   ├── FontSizePicker.tsx
│   │   │   │   │   │   ├── FontFamilyPicker.tsx
│   │   │   │   │   │   ├── HeadingPicker.tsx
│   │   │   │   │   │   └── ColorPicker.tsx
│   │   │   │   │   ├── Plugins/
│   │   │   │   │   │   ├── AutoSavePlugin.tsx
│   │   │   │   │   │   ├── CollabPlugin.tsx
│   │   │   │   │   │   ├── AIGhostTextPlugin.tsx
│   │   │   │   │   │   ├── CommentPlugin.tsx
│   │   │   │   │   │   ├── TablePlugin.tsx
│   │   │   │   │   │   └── ImagePlugin.tsx
│   │   │   │   │   ├── Nodes/
│   │   │   │   │   │   ├── GhostTextNode.ts
│   │   │   │   │   │   ├── ImageNode.tsx
│   │   │   │   │   │   ├── TableNode.tsx
│   │   │   │   │   │   └── MentionNode.ts
│   │   │   │   │   └── EditorTheme.ts
│   │   │   │   ├── Dashboard/
│   │   │   │   │   ├── Dashboard.tsx
│   │   │   │   │   ├── DocumentCard.tsx
│   │   │   │   │   ├── TemplateGallery.tsx
│   │   │   │   │   └── FolderTree.tsx
│   │   │   │   ├── Layout/
│   │   │   │   │   ├── Layout.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── CommandPalette.tsx
│   │   │   │   │   └── MenuBar.tsx
│   │   │   │   ├── AI/
│   │   │   │   │   ├── AIPanel.tsx
│   │   │   │   │   ├── AIPromptBar.tsx
│   │   │   │   │   └── AISuggestionCard.tsx
│   │   │   │   └── Comments/
│   │   │   │       ├── CommentThread.tsx
│   │   │   │       └── CommentSidebar.tsx
│   │   │   ├── db/
│   │   │   │   └── db.ts                 # Dexie schema
│   │   │   ├── store/
│   │   │   │   ├── useAppStore.ts        # Global UI state
│   │   │   │   ├── useDocumentStore.ts   # Document state
│   │   │   │   └── useCollabStore.ts     # Collaboration state
│   │   │   ├── services/
│   │   │   │   ├── ai.ts                 # AI API calls
│   │   │   │   ├── export.ts             # PDF/DOCX/MD export
│   │   │   │   ├── sync.ts               # Yjs WebSocket sync
│   │   │   │   └── search.ts             # Full-text search
│   │   │   ├── hooks/
│   │   │   │   ├── useDocument.ts
│   │   │   │   ├── useAutoSave.ts
│   │   │   │   └── useKeyboardShortcuts.ts
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── EditorPage.tsx
│   │   │   │   ├── SharedPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   ├── App.tsx
│   │   │   └── index.css
│   │   └── index.html
│   └── server/                       # Fastify backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── documents.ts
│       │   │   ├── auth.ts
│       │   │   ├── ai.ts
│       │   │   ├── export.ts
│       │   │   └── search.ts
│       │   ├── db/
│       │   │   ├── schema.ts         # Drizzle schema
│       │   │   └── migrations/
│       │   ├── services/
│       │   │   ├── ai.service.ts
│       │   │   ├── export.service.ts
│       │   │   └── collab.service.ts
│       │   ├── ws/
│       │   │   └── collab.ws.ts      # Yjs WebSocket handler
│       │   └── index.ts
│       └── package.json
├── packages/
│   └── shared/                       # Shared types
│       └── src/types.ts
└── package.json                      # Monorepo root
```

---

## 5. Data Schemas

### IndexedDB (Dexie — Local)
```typescript
interface LocalDocument {
  id: string;                    // UUID
  title: string;
  lexicalState: string;          // JSON stringified EditorState
  folderId: string | null;
  tags: string[];
  isPinned: boolean;
  isStarred: boolean;
  isTrashed: boolean;
  syncStatus: 'local' | 'synced' | 'conflict';
  createdAt: number;             // Unix timestamp
  updatedAt: number;
  wordCount: number;
  charCount: number;
  readingTimeMin: number;
  version: number;               // For conflict detection
}

interface LocalFolder {
  id: string;
  name: string;
  parentId: string | null;
  color: string;                 // Monochrome shade
  createdAt: number;
}
```

### PostgreSQL (Drizzle — Server)
```sql
-- documents table
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
owner_id    UUID REFERENCES users(id)
title       TEXT NOT NULL DEFAULT 'Untitled'
content     JSONB                        -- Yjs document state
plain_text  TEXT                         -- For full-text search
folder_id   UUID REFERENCES folders(id)
is_public   BOOLEAN DEFAULT false
share_token TEXT UNIQUE
word_count  INT DEFAULT 0
version     INT DEFAULT 1
created_at  TIMESTAMPTZ DEFAULT NOW()
updated_at  TIMESTAMPTZ DEFAULT NOW()

-- collaborators table
document_id UUID REFERENCES documents(id)
user_id     UUID REFERENCES users(id)
role        ENUM('viewer', 'commenter', 'editor', 'owner')
invited_at  TIMESTAMPTZ

-- comments table
id          UUID PRIMARY KEY
document_id UUID REFERENCES documents(id)
user_id     UUID REFERENCES users(id)
anchor_key  TEXT                         -- Lexical node key
quote_text  TEXT                         -- Selected text
body        TEXT
resolved    BOOLEAN DEFAULT false
created_at  TIMESTAMPTZ

-- document_versions table
id          UUID PRIMARY KEY
document_id UUID REFERENCES documents(id)
snapshot    JSONB                        -- Full Lexical state
created_by  UUID REFERENCES users(id)
created_at  TIMESTAMPTZ
```

---

## 6. Component Tree

```
App
├── Router
│   ├── / → HomePage
│   │   └── Layout
│   │       ├── Sidebar (FolderTree, recent docs, starred)
│   │       ├── CommandPalette (⌘K)
│   │       └── Dashboard
│   │           ├── TemplateGallery
│   │           ├── DocumentGrid / DocumentList
│   │           │   └── DocumentCard (context menu)
│   │           └── FolderBreadcrumb
│   ├── /doc/:id → EditorPage
│   │   └── Layout (editor mode)
│   │       ├── MenuBar (File/Edit/View/Insert/Format/Tools/Help)
│   │       ├── Toolbar (formatting controls)
│   │       ├── Editor (Lexical)
│   │       │   ├── RichTextPlugin
│   │       │   ├── HistoryPlugin
│   │       │   ├── ListPlugin
│   │       │   ├── TablePlugin
│   │       │   ├── ImagePlugin
│   │       │   ├── AutoSavePlugin
│   │       │   ├── CollabPlugin (Yjs)
│   │       │   ├── AIGhostTextPlugin
│   │       │   ├── CommentPlugin
│   │       │   └── MarkdownShortcutPlugin
│   │       ├── AIPanel (right side drawer)
│   │       └── CommentSidebar (right side)
│   ├── /share/:token → SharedPage (read-only)
│   └── /settings → SettingsPage
└── Providers
    ├── ThemeProvider
    ├── ToastProvider
    └── ModalProvider
```

---

## 7. Implementation Phases

---

### ✅ Phase 1 — Foundation & Design System
**Goal**: Establish the monochromatic design system, project scaffold, and routing.

#### Tasks
- [ ] Initialize Vite + React + TypeScript monorepo
- [ ] Install core dependencies (Lexical, Zustand, Dexie, React Router, Lucide)
- [ ] Build complete CSS variable system (B&W tokens, typography, spacing, motion)
- [ ] Implement light/dark mode toggle with `data-theme` attribute
- [ ] Create `Layout.tsx` shell with sidebar + main content area
- [ ] Create `Sidebar.tsx` with folder tree, nav items, collapse/expand
- [ ] Create `CommandPalette.tsx` (⌘K) with fuzzy search over documents
- [ ] Set up React Router with `/`, `/doc/:id`, `/settings` routes
- [ ] Create `ToastProvider` and `ModalProvider` context
- [ ] Implement keyboard shortcut system (`useKeyboardShortcuts.ts`)
- [ ] Add Google Fonts (Inter, Merriweather, JetBrains Mono)
- [ ] Create reusable UI primitives: Button, Input, Select, Dropdown, Badge, Tooltip, Dialog

**Deliverable**: App shell renders with full B&W UI, navigable routes, dark mode toggle

---

### ✅ Phase 2 — Dashboard & Document Management
**Goal**: Full document management UI — create, rename, delete, folder, search, sort.

#### Tasks
- [ ] Build `Dashboard.tsx` with header (search, sort, view toggle)
- [ ] Build `TemplateGallery.tsx` — Blank, Resume, Letter, Meeting Notes, Project Proposal, Research, Invoice templates
- [ ] Build `DocumentCard.tsx` — grid and list variants, context menu (rename, duplicate, move, star, trash)
- [ ] Build `FolderTree.tsx` — nested folders with drag-and-drop reorder (dnd-kit)
- [ ] Implement `DocumentGrid` ↔ `DocumentList` toggle with animation
- [ ] Implement sort by: Last Modified, Created, Name, Size
- [ ] Implement filter by: Starred, Shared With Me, My Documents, Trashed
- [ ] Build `Trash` view with restore / permanent delete
- [ ] Connect all actions to Dexie local DB
- [ ] Animate card hover — subtle lift shadow, B&W micro effect
- [ ] Empty state illustrations (pure CSS, monochromatic)
- [ ] Implement document search with highlight matching text

**Deliverable**: Full dashboard, CRUD document management, folder organization

---

### ✅ Phase 3 — Core Editor Engine
**Goal**: Production-quality Lexical editor with full formatting toolbar.

#### Tasks
- [ ] Configure `LexicalComposer` with all required nodes
- [ ] Build `ToolbarPlugin.tsx` with:
  - Undo / Redo
  - Font family dropdown (Inter, Merriweather, JetBrains Mono, Arial, Georgia)
  - Font size input (8–96pt, with +/- nudge)
  - Heading picker (Normal / H1–H6)
  - Bold / Italic / Underline / Strikethrough / Subscript / Superscript / Code
  - Text color (monochrome swatches + custom)
  - Text highlight (grey shades)
  - Text alignment (Left / Center / Right / Justify)
  - Indent / Outdent
  - Bullet list / Numbered list / Check list
  - Insert link
  - Insert table
  - Insert image
  - Clear formatting
  - AI button (✦ Ask AI)
- [ ] Build `MenuBar.tsx` with full File / Edit / View / Insert / Format / Tools / Help dropdowns
- [ ] Implement `TablePlugin` with resizable columns, row/col add/delete
- [ ] Implement `ImagePlugin` — drag, resize, align, caption
- [ ] Implement `ChecklistPlugin` for interactive checklists
- [ ] Implement `MarkdownShortcutPlugin` (# → H1, ** → bold, ` → code, etc.)
- [ ] Style editor page: A4 paper canvas on grey background, ruler, margins
- [ ] Implement page break simulation
- [ ] Build word count / char count / reading time status bar
- [ ] Implement find & replace panel (⌘F / ⌘H)

**Deliverable**: Full-featured rich text editor matching Google Docs toolbar fidelity

---

### ✅ Phase 4 — Data Persistence & Auto-Save
**Goal**: Robust local-first persistence with cloud sync fallback.

#### Tasks
- [ ] Build Dexie schema (`db.ts`) with documents, folders, versions tables
- [ ] Implement `AutoSavePlugin.tsx` — debounced save (1.5s) on every change
- [ ] Show save status indicator: "Saving…" → "All changes saved" → "Offline"
- [ ] Implement document versioning — snapshot on every explicit save
- [ ] Build version history panel — list versions, preview diff, restore
- [ ] Implement `useLiveQuery` hooks for reactive document lists
- [ ] Build Fastify REST API: `GET/POST/PUT/DELETE /api/documents`
- [ ] Set up PostgreSQL + Drizzle ORM migrations
- [ ] Implement sync service (`sync.ts`) — push local changes → server on reconnect
- [ ] Implement conflict detection (version mismatch → show resolution UI)
- [ ] Implement offline indicator banner + queue

**Deliverable**: Documents persist locally, sync to server, never lose data

---

### ✅ Phase 5 — Advanced Editor Features
**Goal**: Power-user features that match or exceed Google Docs.

#### Tasks
- [ ] **Comments System**:
  - Highlight text → add comment (⌘+Alt+M)
  - `CommentPlugin` anchors comments to Lexical node keys
  - `CommentSidebar` threads panel
  - Resolve / reopen / delete threads
  - `@mention` users in comments
- [ ] **Suggestions Mode** (Track Changes):
  - Toggle suggestions mode
  - Insertions shown in lighter grey, deletions in strikethrough
  - Accept / Reject individual suggestions
- [ ] **Document Outline**:
  - Auto-generated TOC from headings
  - Click to jump to section
  - Collapsible heading sections
- [ ] **Smart Quotes & Autocorrect**:
  - Auto-curly quotes
  - Em dash on `--`
  - Spell-check underline (browser API)
- [ ] **Page Setup Modal**: Paper size (A4/Letter/Custom), margins, orientation
- [ ] **Bookmarks & Named Anchors**
- [ ] **Footnotes**
- [ ] **Table of Contents node**
- [ ] **Equation Editor** (basic LaTeX via KaTeX)
- [ ] **Keyboard shortcuts reference panel** (⌘?)

**Deliverable**: Power-user editor on par with Google Docs feature set

---

### ✅ Phase 6 — AI Integration
**Goal**: Deeply integrated, non-intrusive AI writing assistant.

#### Features & Tasks
- [ ] **AI Ghost Text Autocomplete**:
  - `GhostTextNode` custom Lexical node (non-serialized)
  - Trigger: pause typing for 800ms
  - Stream tokens into ghost text (grey, lighter weight)
  - Tab to accept, Escape to dismiss
- [ ] **"Help me write" Floating Bar**:
  - Select text → "Ask AI" pill appears
  - Options: Improve, Summarize, Expand, Shorten, Fix Grammar, Change Tone, Translate
  - Streams result inline with accept/reject buttons
- [ ] **AI Panel (Right Drawer)**:
  - Full chat interface
  - Document-aware context (sends current doc excerpt)
  - "Insert at cursor" button on responses
  - Chat history per document
- [ ] **AI Document Generation**:
  - From template prompt in dashboard
  - Streams content directly into new document
- [ ] **Backend AI Service**:
  - Fastify `/api/ai/complete`, `/api/ai/chat`, `/api/ai/generate`
  - OpenAI-compatible interface (swap to local LLM, Anthropic, etc.)
  - Rate limiting per user
  - BullMQ queue for long-running generation jobs
  - Token usage tracking
- [ ] **Configurable AI provider** in Settings (API key input)

**Deliverable**: Full AI writing assistant embedded in the editor

---

### ✅ Phase 7 — Real-Time Collaboration
**Goal**: Multiple users editing the same document simultaneously.

#### Tasks
- [ ] Set up `y-websocket` server on Fastify backend
- [ ] Integrate `CollabPlugin.tsx` using `yjs` + `y-lexical` binding
- [ ] Show real-time cursor positions with user name labels (B&W color-coded per user)
- [ ] Show real-time presence avatars in editor header
- [ ] Implement document sharing:
  - Share modal with link generation
  - Permission levels: Viewer / Commenter / Editor
  - Toggle public link on/off
- [ ] Build `SharedPage.tsx` — read-only view for share links
- [ ] Implement awareness protocol (who is online, cursor position)
- [ ] Handle reconnection gracefully with state reconciliation
- [ ] Build activity feed — see recent edits by collaborators

**Deliverable**: Live collaboration with cursor presence, like Google Docs

---

### ✅ Phase 8 — Export, Import & Search
**Goal**: Full document portability and discoverability.

#### Tasks
- [ ] **Export**:
  - PDF (jsPDF + html2canvas, A4 formatted)
  - Markdown (.md via Lexical → Markdown transformer)
  - Plain Text (.txt)
  - HTML (.html)
  - DOCX (server-side via docx npm package)
- [ ] **Import**:
  - Markdown file upload → parse → load into Lexical
  - Plain text upload
  - HTML paste clean-up
- [ ] **Print** (browser print with custom CSS `@media print`)
- [ ] **Full-Text Search**:
  - Meilisearch instance for server search
  - Search across all documents with highlighted excerpts
  - Filter by folder, date range, tag
  - Local Dexie search fallback (offline)
- [ ] **Tags System**:
  - Add/remove tags on documents
  - Tag cloud in sidebar
  - Filter dashboard by tag

**Deliverable**: Import/export to all major formats, powerful search

---

### ✅ Phase 9 — Polish, Settings & Production
**Goal**: Production-ready quality, performance, and configurability.

#### Tasks
- [ ] **Settings Page**:
  - Theme: Light / Dark / System
  - Font preference for document body
  - Default font size
  - AI provider & API key
  - Spell check toggle
  - Autosave interval
  - Keyboard shortcuts editor
- [ ] **Onboarding**:
  - First-run welcome modal
  - Interactive tutorial (highlight features step by step)
  - Sample documents pre-loaded
- [ ] **Performance**:
  - Virtualized document list (react-virtual)
  - Lazy-load editor components
  - Image optimization (WebP conversion)
  - Service worker for offline caching
- [ ] **Accessibility**:
  - ARIA labels on all toolbar buttons
  - Full keyboard navigation
  - Focus trap in modals
  - Reduced motion support
- [ ] **Error Boundaries** on editor and dashboard
- [ ] **Comprehensive test suite** (Vitest + Testing Library)
- [ ] **Docker Compose** for one-command server setup (Postgres + Redis + Meilisearch + Node)
- [ ] **README** with setup, architecture, contribution guide

**Deliverable**: Shippable, production-quality open source release

---

## 8. Keyboard Shortcuts Reference

| Action | Shortcut |
|---|---|
| New Document | ⌘N |
| Open Command Palette | ⌘K |
| Save | ⌘S |
| Find | ⌘F |
| Find & Replace | ⌘H |
| Bold | ⌘B |
| Italic | ⌘I |
| Underline | ⌘U |
| Strikethrough | ⌘⇧X |
| Link | ⌘K (in editor) |
| Comment | ⌘⌥M |
| Undo | ⌘Z |
| Redo | ⌘⇧Z |
| Select All | ⌘A |
| Print | ⌘P |
| Export PDF | ⌘⇧E |
| Toggle Sidebar | ⌘⇧B |
| AI Assistant | ⌘⇧A |
| Shortcuts help | ⌘? |

---

## 9. Phase Completion Tracker

| Phase | Name | Status | Priority |
|---|---|---|---|
| 1 | Foundation & Design System | 🔄 Partially Done | Critical |
| 2 | Dashboard & Document Management | 🔄 Partially Done | Critical |
| 3 | Core Editor Engine | 🔄 Partially Done | Critical |
| 4 | Data Persistence & Auto-Save | 🔄 Partially Done | Critical |
| 5 | Advanced Editor Features | ⬜ Not Started | High |
| 6 | AI Integration | 🔄 Scaffolded | High |
| 7 | Real-Time Collaboration | ✅ Done | Medium |
| 8 | Export, Import & Search | ✅ Done | Medium |
| 9 | Polish, Settings & Production | ✅ Done | Low |

> [!NOTE]
> Phases 1–4 were partially built in previous sessions but the source files were reset. The plan is designed to be executed from scratch with full context of prior work.

---

## 10. Build Order (Recommended Execution)

```
Phase 1 (CSS + Shell + Routing)
    ↓
Phase 2 (Dashboard + Dexie local CRUD)
    ↓
Phase 3 (Lexical Editor + Toolbar)
    ↓
Phase 4 (AutoSave + Versioning + Backend API)
    ↓
Phase 5 (Comments + Suggestions + Outline)
    ↓
Phase 6 (AI Ghost Text + AI Panel + Backend AI)
    ↓
Phase 7 (Yjs Collab + Share Links)
    ↓
Phase 8 (Export + Import + Search)
    ↓
Phase 9 (Settings + Tests + Docker + README)
```

---

*Plan version: 2.0 | Generated: 2026-05-09 | Conversation: e9405459*
