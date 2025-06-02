import { 
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  ListBulletIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const EditorToolbar = ({ editor, onExport, onSave, isSaving }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-blue-200 bg-gradient-to-r from-blue-50 via-pink-50 to-yellow-50 p-2 flex items-center justify-between rounded-t-lg shadow-md animate-fade-in">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-blue-100 transition-all duration-150 font-bold text-lg ${
            editor.isActive('bold') ? 'bg-blue-200 text-blue-700 scale-110' : 'text-gray-700'
          }`}
          title="Bold"
        >
          <span style={{fontWeight: 'bold', fontFamily: 'inherit'}}>B</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-pink-100 transition-all duration-150 italic text-lg ${
            editor.isActive('italic') ? 'bg-pink-200 text-pink-700 scale-110' : 'text-gray-700'
          }`}
          title="Italic"
        >
          <span style={{fontStyle: 'italic', fontFamily: 'inherit'}}>I</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-yellow-100 transition-all duration-150 ${
            editor.isActive('bulletList') ? 'bg-yellow-200 text-yellow-700 scale-110' : 'text-gray-700'
          }`}
          title="Bullet List"
        >
          <ListBulletIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-green-100 transition-all duration-150 ${
            editor.isActive('orderedList') ? 'bg-green-200 text-green-700 scale-110' : 'text-gray-700'
          }`}
          title="Numbered List"
        >
          <DocumentTextIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`p-2 rounded hover:bg-blue-100 text-blue-700 flex items-center space-x-1 font-semibold shadow transition-all duration-150 ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Save Document"
        >
          {isSaving ? (
            <>
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span className="font-bold">Save</span>
            </>
          )}
        </button>
        <button
          onClick={onExport}
          className="p-2 rounded hover:bg-yellow-100 text-yellow-700 flex items-center space-x-1 font-semibold shadow transition-all duration-150"
          title="Export Document"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar; 