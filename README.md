# Open Documents

Open Documents is a free, open-source Google Docs alternative built with modern web technologies. It features a strict monochromatic black-and-white UI, rich text editing, AI writing assistance, and an offline-first architecture.

![Open Documents UI](https://via.placeholder.com/1200x630/000000/FFFFFF?text=Open+Documents)

## 🚀 Features

*   **Offline-First & Fast:** Data is persisted locally using IndexedDB (Dexie.js). You can create, edit, and manage documents without an internet connection.
*   **Rich Text Editing:** Powered by Lexical, the editor supports headings, bold, italic, code blocks, checklists, text alignment, and markdown shortcuts.
*   **AI Writing Assistant:** Built-in AI panel and floating prompt bar to help you summarize, improve, expand, or rewrite text. (Supports real OpenAI API keys or a simulated fallback).
*   **Document Management:** Organize documents with folders, star important files, and manage your trash.
*   **Templates:** Start quickly with built-in templates for résumés, letters, meeting notes, proposals, and essays.
*   **Monochromatic Design:** A distraction-free, professional black-and-white UI with support for both Light and Dark modes.
*   **Advanced Tools:** Find & Replace, Document Outline generation, and real-time Word/Character counts.

## 🛠️ Tech Stack

*   **Frontend Framework:** React 18 & Vite
*   **Language:** TypeScript
*   **Editor Engine:** Lexical (by Meta)
*   **State Management:** Zustand
*   **Local Database:** Dexie.js (IndexedDB)
*   **Icons:** Lucide React
*   **Styling:** Pure CSS (CSS Variables for theming)

## 📦 Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/open-documents.git
    cd open-documents
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in your browser:**
    Navigate to `http://localhost:5173` (or the port specified in your terminal).

## 🤖 Configuring AI (Optional)

By default, the AI features use a simulated fallback for demonstration purposes. To use real AI:

1. Open the app and click the **AI** button or open the AI sidebar (`⌘⇧A`).
2. Click the **Settings (gear)** icon in the AI panel.
3. Enter your OpenAI API key and click **Save**.

## 🗺️ Roadmap

- [x] Phase 1: Foundation & Design System
- [x] Phase 2: Dashboard & Document Management
- [x] Phase 3: Core Editor Engine
- [x] Phase 4: Data Persistence & Auto-Save
- [x] Phase 5: Advanced Editor Features (Find/Replace, Outline, Word Count, Comments)
- [x] Phase 6: AI Integration (Chat Panel & Floating Bar)
- [ ] Phase 7: Real-Time Collaboration (Yjs & WebSockets)
- [ ] Phase 8: Export, Import & Search (PDF, DOCX, Markdown)
- [ ] Phase 9: Polish & Production Deployment

## 📜 License

MIT License. See `LICENSE` for more information.
