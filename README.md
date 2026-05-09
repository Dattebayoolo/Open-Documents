<div align="center">

<img src="public/favicon.svg" alt="Open Documents Logo" width="96" height="96" />

# Open Documents

### A free, open-source, offline-first alternative to Google Docs.

**Beautiful monochromatic design · Rich text editing · Real-time collaboration · AI writing assistant**

[![License: MIT](https://img.shields.io/badge/License-MIT-000000.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-000000?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-000000?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-000000?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Lexical](https://img.shields.io/badge/Lexical-Editor-000000?style=for-the-badge)](https://lexical.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-000000.svg?style=for-the-badge)](https://github.com/Dattebayoolo/Open-Documents/pulls)

[**Live Demo**](#) · [**Documentation**](#-documentation) · [**Report Bug**](https://github.com/Dattebayoolo/Open-Documents/issues) · [**Request Feature**](https://github.com/Dattebayoolo/Open-Documents/issues)

<br />

<img src="https://via.placeholder.com/1200x630/000000/FFFFFF?text=Open+Documents" alt="Open Documents Preview" width="100%" />

</div>

---

## ✨ Overview

**Open Documents** is a production-grade, browser-first document editor that rivals Google Docs in capability while being **fully open source** and **privacy-first**. Built with a strict black-and-white monochromatic design language — clean, typographic, high-contrast, zero color distraction — it pairs a beautiful UI with a deeply functional engine powering real-time collaboration, AI writing assistance, offline-first persistence, and rich import/export.

> **Your documents. Your data. Your control.**

---

## 🌟 Highlights

<table>
  <tr>
    <td width="33%" valign="top">
      <h3>🪶 Offline-First</h3>
      Built on IndexedDB via Dexie.js. Create, edit, and manage documents without an internet connection — sync seamlessly when you're back online.
    </td>
    <td width="33%" valign="top">
      <h3>🤖 AI-Powered</h3>
      A native AI panel and floating prompt bar to summarize, improve, expand, or rewrite text. Bring your own OpenAI key, or use the simulated fallback.
    </td>
    <td width="33%" valign="top">
      <h3>🤝 Real-Time Collab</h3>
      Powered by Yjs CRDTs and WebSockets. Multiple users, live cursors, conflict-free editing — just like the docs you know and love.
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <h3>📝 Rich Editing</h3>
      Lexical-powered editor with headings, lists, tables, code blocks, checklists, markdown shortcuts, find &amp; replace, and a live document outline.
    </td>
    <td width="33%" valign="top">
      <h3>🎨 Monochromatic UI</h3>
      A distraction-free, professional black-and-white design system — fully responsive with first-class light and dark modes.
    </td>
    <td width="33%" valign="top">
      <h3>🗂️ Document Management</h3>
      Folders, stars, trash, templates, and a fast command palette. Everything you need to keep a large library organized.
    </td>
  </tr>
</table>

---

## 🚀 Features

### Editor
- ✅ Rich text formatting — **bold**, *italic*, underline, strikethrough, code
- ✅ Headings (H1–H6), paragraphs, blockquotes, horizontal rules
- ✅ Bullet, numbered, and check lists with nesting
- ✅ Code blocks with syntax highlighting
- ✅ Text alignment (left, center, right, justify)
- ✅ Markdown shortcuts (`#`, `**`, `` ` `` etc.)
- ✅ Find & Replace (`⌘F` / `⌘H`)
- ✅ Document outline auto-generated from headings
- ✅ Live word count, character count & reading time

### Workspace
- ✅ Document dashboard with grid & list views
- ✅ Folders with drag-and-drop organization
- ✅ Starred documents and trash with restore
- ✅ Built-in templates (Résumé, Letter, Meeting Notes, Proposal, Essay)
- ✅ Command palette for blazing-fast navigation
- ✅ Light & dark mode toggle

### AI Assistant
- ✅ AI side panel for chat-style interaction
- ✅ Floating "Ask AI" prompt bar over selected text
- ✅ Quick actions: Summarize · Improve · Expand · Rewrite
- ✅ Bring-your-own OpenAI API key
- ✅ Graceful simulated fallback for demos

### Collaboration *(in progress)*
- 🔄 Yjs CRDT-based shared editing
- 🔄 WebSocket sync server (`server.js`)
- 🔄 Live presence and cursor labels

---

## 🛠️ Tech Stack

| Layer              | Technology                                                                 |
| :----------------- | :------------------------------------------------------------------------- |
| **Framework**      | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)               |
| **Language**       | [TypeScript](https://www.typescriptlang.org/)                              |
| **Editor Engine**  | [Lexical](https://lexical.dev/) by Meta                                    |
| **State**          | [Zustand](https://zustand-demo.pmnd.rs/)                                   |
| **Local DB**       | [Dexie.js](https://dexie.org/) (IndexedDB)                                 |
| **Realtime**       | [Yjs](https://yjs.dev/) + [y-websocket](https://github.com/yjs/y-websocket) / [Hocuspocus](https://tiptap.dev/hocuspocus) |
| **Routing**        | [React Router v7](https://reactrouter.com/)                                |
| **Drag & Drop**    | [@dnd-kit](https://dndkit.com/)                                            |
| **Icons**          | [Lucide](https://lucide.dev/)                                              |
| **Styling**        | Pure CSS with CSS Variables for theming                                    |
| **Server**         | Node.js + `ws` WebSocket sync server                                       |

---

## 📸 Screenshots

<div align="center">

| Dashboard | Editor | AI Panel |
| :---: | :---: | :---: |
| <img src="https://via.placeholder.com/400x250/ffffff/000000?text=Dashboard" alt="Dashboard" /> | <img src="https://via.placeholder.com/400x250/ffffff/000000?text=Editor" alt="Editor" /> | <img src="https://via.placeholder.com/400x250/000000/ffffff?text=AI+Panel" alt="AI Panel" /> |

</div>

---

## 📦 Getting Started

### Prerequisites

- **Node.js** 20 LTS or later
- **npm** 10+ (or your preferred package manager)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Dattebayoolo/Open-Documents.git
cd Open-Documents

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **[http://localhost:5173](http://localhost:5173)**.

### Available Scripts

| Command           | Description                                          |
| :---------------- | :--------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR                   |
| `npm run build`   | Type-check and produce a production build            |
| `npm run preview` | Preview the production build locally                 |
| `npm run lint`    | Run ESLint across the project                        |

### Running the Collaboration Server (optional)

For real-time collaboration, start the bundled WebSocket server:

```bash
node server.js
```

Then connect the editor to it — see `src/services/collab.ts` for configuration.

---

## 🤖 Configuring AI

By default, AI features run in **simulated mode** so you can explore them with no setup. To enable real AI completions:

1. Launch the app and open the **AI panel** (`⌘⇧A`) — or click the ✦ AI button in the toolbar.
2. Click the ⚙️ **Settings** icon in the panel header.
3. Paste your **OpenAI API key** and click **Save**.

> 🔒 Your API key is stored locally in your browser. It never touches our servers.

---

## ⌨️ Keyboard Shortcuts

| Action                | Shortcut         |
| :-------------------- | :--------------- |
| New Document          | `⌘N`             |
| Command Palette       | `⌘K`             |
| Save                  | `⌘S`             |
| Find                  | `⌘F`             |
| Find & Replace        | `⌘H`             |
| Bold / Italic / Underline | `⌘B` / `⌘I` / `⌘U` |
| Toggle Sidebar        | `⌘⇧B`            |
| Open AI Assistant     | `⌘⇧A`            |
| Export PDF            | `⌘⇧E`            |
| Shortcuts Help        | `⌘?`             |

---

## 🗂️ Project Structure

```
open-documents/
├── public/                 # Static assets (icons, favicon)
├── server.js               # Yjs WebSocket collaboration server
├── src/
│   ├── components/
│   │   ├── AI/             # AI panel & floating prompt bar
│   │   ├── Editor/         # Lexical editor, plugins & nodes
│   │   ├── Layout/         # App shell, sidebar, command palette
│   │   └── ...
│   ├── db/                 # Dexie schema (IndexedDB)
│   ├── services/           # AI, collab, export, sync services
│   ├── store/              # Zustand stores
│   ├── App.tsx
│   └── main.tsx
├── plan.md                 # Comprehensive product & technical plan
└── package.json
```

---

## 🗺️ Roadmap

- [x] **Phase 1** — Foundation & Design System
- [x] **Phase 2** — Dashboard & Document Management
- [x] **Phase 3** — Core Editor Engine
- [x] **Phase 4** — Data Persistence & Auto-Save
- [x] **Phase 5** — Advanced Editor Features (Find/Replace, Outline, Word Count)
- [x] **Phase 6** — AI Integration (Chat Panel & Floating Bar)
- [ ] **Phase 7** — Real-Time Collaboration (Yjs & WebSockets)
- [ ] **Phase 8** — Export, Import & Search (PDF, DOCX, Markdown)
- [ ] **Phase 9** — Polish & Production Deployment

See [`plan.md`](./plan.md) for the full technical roadmap.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. **Any contributions you make are greatly appreciated.**

1. **Fork** the project
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a **Pull Request**

Please ensure your PR:
- Passes `npm run lint` and `npm run build`
- Includes a clear description of the change
- References any related issue (e.g. `Closes #42`)

> Don't forget to give the project a ⭐ — it really helps!

---

## 📚 Documentation

- [`plan.md`](./plan.md) — Full architecture, data schemas, and phased roadmap
- [Lexical Docs](https://lexical.dev/docs/intro) — Editor framework
- [Yjs Docs](https://docs.yjs.dev/) — CRDT-based collaboration
- [Dexie Docs](https://dexie.org/docs/) — IndexedDB wrapper

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

## 🙏 Acknowledgements

- [Lexical](https://lexical.dev/) — for the incredible editor framework
- [Yjs](https://yjs.dev/) — for making real-time collaboration tractable
- [Dexie.js](https://dexie.org/) — for delightful IndexedDB ergonomics
- [Lucide](https://lucide.dev/) — for the beautiful icon set
- Everyone building in the open. 🖤

---

<div align="center">

**Built with 🖤 by the Open Documents community.**

If this project helped you, please consider giving it a ⭐ on [GitHub](https://github.com/Dattebayoolo/Open-Documents)!

</div>
