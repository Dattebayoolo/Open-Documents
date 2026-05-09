import type { EditorThemeClasses } from 'lexical';

const theme: EditorThemeClasses = {
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'editor-p',
  quote: 'editor-quote',
  heading: { h1: 'editor-h1', h2: 'editor-h2', h3: 'editor-h3', h4: 'editor-h4', h5: 'editor-h5', h6: 'editor-h6' },
  list: {
    nested: { listitem: 'editor-nested-listitem' },
    ol: 'editor-ol',
    ul: 'editor-ul',
    listitem: 'editor-listitem',
    listitemChecked: 'editor-listitem-checked',
    listitemUnchecked: 'editor-listitem-unchecked',
  },
  link: 'editor-link',
  text: {
    bold: 'editor-bold',
    italic: 'editor-italic',
    underline: 'editor-underline',
    strikethrough: 'editor-strikethrough',
    subscript: 'editor-subscript',
    superscript: 'editor-superscript',
    code: 'editor-code-text',
    underlineStrikethrough: 'editor-underline-strikethrough',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'tok-atrule', attr: 'tok-attr', boolean: 'tok-bool',
    builtin: 'tok-builtin', cdata: 'tok-cdata', char: 'tok-char',
    comment: 'tok-comment', constant: 'tok-const', deleted: 'tok-del',
    doctype: 'tok-doctype', entity: 'tok-entity', function: 'tok-func',
    important: 'tok-important', inserted: 'tok-ins', keyword: 'tok-kw',
    namespace: 'tok-ns', number: 'tok-num', operator: 'tok-op',
    prolog: 'tok-prolog', property: 'tok-prop', punctuation: 'tok-punc',
    regex: 'tok-regex', selector: 'tok-sel', string: 'tok-str',
    symbol: 'tok-sym', tag: 'tok-tag', url: 'tok-url', variable: 'tok-var',
  },
  table: 'editor-table',
  tableCell: 'editor-table-cell',
  tableCellHeader: 'editor-table-cell-header',
  tableRow: 'editor-table-row',
  tableScrollableWrapper: 'editor-table-wrapper',
};

export default theme;
