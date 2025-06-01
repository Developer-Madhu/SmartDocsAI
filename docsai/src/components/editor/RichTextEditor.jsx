import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const RichTextEditor = ({ content, onChange, onSave }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing or use AI to generate content...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleExport = async () => {
    if (!editor) return;

    const element = document.querySelector('.ProseMirror');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('document.pdf');
    } catch (error) {
      console.error('Error exporting document:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar 
        editor={editor} 
        onExport={handleExport}
        onSave={onSave}
      />
      <div className="flex-1 overflow-auto">
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto">
          <EditorContent 
            editor={editor} 
            className="min-h-[500px] p-4 border rounded-lg shadow-sm focus:outline-none" 
          />
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor; 