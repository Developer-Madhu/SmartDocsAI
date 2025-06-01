import { 
  DocumentIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  ListBulletIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const EditorToolbar = ({ editor, onExport, onSave }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 bg-white p-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('bold') ? 'bg-gray-100 text-blue-600' : 'text-gray-600'
          }`}
          title="Bold"
        >
          <DocumentIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('italic') ? 'bg-gray-100 text-blue-600' : 'text-gray-600'
          }`}
          title="Italic"
        >
          <DocumentIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('bulletList') ? 'bg-gray-100 text-blue-600' : 'text-gray-600'
          }`}
          title="Bullet List"
        >
          <ListBulletIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('orderedList') ? 'bg-gray-100 text-blue-600' : 'text-gray-600'
          }`}
          title="Numbered List"
        >
          <DocumentTextIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          className="p-2 rounded hover:bg-gray-100 text-gray-600"
          title="Save Document"
        >
          <DocumentIcon className="h-5 w-5" />
        </button>
        <button
          onClick={onExport}
          className="p-2 rounded hover:bg-gray-100 text-gray-600"
          title="Export Document"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar; 