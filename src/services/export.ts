import { $convertToMarkdownString } from '@lexical/markdown';
import { TRANSFORMERS } from '@lexical/markdown';
import { $getRoot } from 'lexical';
import type { LexicalEditor } from 'lexical';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export document as Plain Text (.txt)
 */
export function exportToPlainText(editor: LexicalEditor, title: string) {
  editor.getEditorState().read(() => {
    const text = $getRoot().getTextContent();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${title || 'Untitled'}.txt`);
  });
}

/**
 * Export document as Markdown (.md)
 */
export function exportToMarkdown(editor: LexicalEditor, title: string) {
  editor.getEditorState().read(() => {
    const markdown = $convertToMarkdownString(TRANSFORMERS);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${title || 'Untitled'}.md`);
  });
}

/**
 * Export document as PDF
 * We capture the editor DOM element using html2canvas and convert it to a PDF using jsPDF.
 */
export async function exportToPDF(elementId: string, title: string) {
  const element = document.querySelector(elementId) as HTMLElement;
  if (!element) throw new Error('Editor element not found');

  // Add a temporary class to ensure the paper background is white and borders are hidden
  const originalBackground = element.style.background;
  const originalBoxShadow = element.style.boxShadow;

  element.style.background = '#ffffff';
  element.style.boxShadow = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    // A4 size: 210 x 297 mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${title || 'Untitled'}.pdf`);
  } finally {
    // Restore original styles
    element.style.background = originalBackground;
    element.style.boxShadow = originalBoxShadow;
  }
}
