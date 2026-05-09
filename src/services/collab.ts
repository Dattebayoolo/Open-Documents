import type { Provider } from '@lexical/yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

export const WEBSOCKET_ENDPOINT = 'ws://localhost:1234';

const CURSOR_COLORS = [
  '#000000', '#333333', '#666666', '#999999', 
  '#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea'
];

export function getRandomColor() {
  return CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
}

export function getRandomName() {
  const adjectives = ['Anonymous', 'Silent', 'Swift', 'Bright', 'Clever', 'Wandering'];
  const nouns = ['Writer', 'Editor', 'Scholar', 'Poet', 'Author', 'Scribe'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
}

export function providerFactory(id: string, yjsDocMap: Map<string, Y.Doc>): Provider {
  const doc = new Y.Doc();
  yjsDocMap.set(id, doc);
  
  const provider = new HocuspocusProvider({
    url: WEBSOCKET_ENDPOINT,
    name: id,
    document: doc,
  });
  
  return provider as unknown as Provider;
}
