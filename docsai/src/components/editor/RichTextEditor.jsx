import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing or use AI to generate content...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto">
      <EditorContent editor={editor} className="min-h-[500px] p-4 border rounded-lg shadow-sm" />
    </div>
  );
};

export default RichTextEditor; 