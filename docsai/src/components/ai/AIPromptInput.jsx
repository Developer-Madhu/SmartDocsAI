import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

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
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
      <div className="max-w-4xl mx-auto flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI to help with your document..."
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default AIPromptInput; 