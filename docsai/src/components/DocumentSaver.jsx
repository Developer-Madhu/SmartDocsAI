import { useState } from 'react';
import { DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const DocumentSaver = ({ onSave, isSaving, documentTitle, onTitleChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-blue-100">
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditing(false);
              }
            }}
            className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter document title..."
            autoFocus
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <DocumentTextIcon className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
              {documentTitle || 'Untitled Document'}
            </h2>
          </div>
        )}
      </div>
      <button
        onClick={onSave}
        disabled={isSaving}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
          isSaving
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isSaving ? (
          <>
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <DocumentTextIcon className="h-5 w-5" />
            <span>Save Document</span>
          </>
        )}
      </button>
    </div>
  );
};

export default DocumentSaver; 