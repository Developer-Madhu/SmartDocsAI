import { 
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  ListBulletIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];
const FONT_FAMILIES = [
  'Arial',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Impact',
  'Comic Sans MS',
  'Lucida Console',
];
const SYMBOLS = ['©', '®', '™', '§', '¶', '•', '†', '‡', '±', '°'];

const EditorToolbar = ({ editor, onExport, onSave, isSaving }) => {
  const [color, setColor] = useState('#22223b');
  const [showSymbols, setShowSymbols] = useState(false);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-blue-200 bg-gradient-to-r from-blue-50 via-pink-50 to-yellow-50 p-2 flex flex-wrap items-center justify-between rounded-t-lg shadow-md animate-fade-in gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* Bold/Italic */}
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
        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-blue-100 transition-all duration-150 ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-blue-200 text-blue-700 scale-110' : 'text-gray-700'
          }`}
          title="Align Left"
        >
          <span className="font-bold">L</span>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-pink-100 transition-all duration-150 ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-pink-200 text-pink-700 scale-110' : 'text-gray-700'
          }`}
          title="Align Center"
        >
          <span className="font-bold">C</span>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-yellow-100 transition-all duration-150 ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-yellow-200 text-yellow-700 scale-110' : 'text-gray-700'
          }`}
          title="Align Right"
        >
          <span className="font-bold">R</span>
        </button>
        {/* Color Picker */}
        <input
          type="color"
          value={color}
          onChange={e => {
            setColor(e.target.value);
            editor.chain().focus().setColor(e.target.value).run();
          }}
          className="w-8 h-8 p-0 border-2 border-blue-200 rounded-full cursor-pointer hover:border-blue-400"
          title="Text Color"
          style={{ background: 'none' }}
        />
        {/* Font Size */}
        <select
          className="rounded px-2 py-1 border border-blue-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={editor.getAttributes('textStyle').fontSize || '16'}
          onChange={e => editor.chain().focus().setFontSize(e.target.value + 'px').run()}
          title="Font Size"
        >
          {FONT_SIZES.map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
        {/* Font Family */}
        <select
          className="rounded px-2 py-1 border border-blue-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={editor.getAttributes('textStyle').fontFamily || 'Arial'}
          onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
          title="Font Family"
        >
          {FONT_FAMILIES.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        {/* Symbols */}
        <div className="relative">
          <button
            onClick={() => setShowSymbols(v => !v)}
            className="p-2 rounded hover:bg-yellow-100 text-yellow-700 font-bold transition-all duration-150"
            title="Insert Symbol"
            type="button"
          >
            Ω
          </button>
          {showSymbols && (
            <div className="absolute z-10 left-0 mt-2 bg-white border border-blue-200 rounded shadow-lg p-2 flex flex-wrap gap-2 w-56">
              {SYMBOLS.map(symbol => (
                <button
                  key={symbol}
                  className="text-lg p-2 hover:bg-blue-100 rounded transition-all duration-150"
                  onClick={() => {
                    editor.chain().focus().insertContent(symbol).run();
                    setShowSymbols(false);
                  }}
                  type="button"
                >
                  {symbol}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Lists */}
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