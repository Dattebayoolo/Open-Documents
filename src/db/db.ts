import Dexie, { type EntityTable } from 'dexie';

export interface OpenDocument {
  id: string;
  title: string;
  lexicalState: string;
  folderId: string | null;
  tags: string[];
  isPinned: boolean;
  isStarred: boolean;
  isTrashed: boolean;
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  charCount: number;
  readingTimeMin: number;
  version: number;
}

export interface OpenFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
}

class OpenDocumentsDB extends Dexie {
  documents!: EntityTable<OpenDocument, 'id'>;
  folders!: EntityTable<OpenFolder, 'id'>;

  constructor() {
    super('OpenDocumentsDB');
    this.version(1).stores({
      documents: 'id, title, folderId, isStarred, isTrashed, updatedAt, createdAt',
      folders: 'id, name, parentId, createdAt',
    });
  }
}

const db = new OpenDocumentsDB();
export default db;
