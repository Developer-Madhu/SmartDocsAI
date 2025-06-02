import { useState } from 'react';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/solid';

const AIPromptInput = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-4xl mx-auto px-2 pb-4 w-full flex flex-col items-center">
        <div className="mb-2 text-sm text-gray-500 pointer-events-auto w-full hidden sm:block">
          
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex gap-2 pointer-events-auto"
          style={{ background: 'none', boxShadow: 'none' }}
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to help with your document..."
            className="flex-1 p-3 rounded-full border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-base bg-white/90 shadow-md transition-all duration-150"
            disabled={isLoading}
            style={{ minWidth: 0 }}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={`px-5 py-2 rounded-full font-semibold flex items-center space-x-2 text-white transition-colors text-base shadow-lg ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600'
            }`}
            style={{ minWidth: '90px' }}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-5 w-5" />
                <span>Send</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIPromptInput; 