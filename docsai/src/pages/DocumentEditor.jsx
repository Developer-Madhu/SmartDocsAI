import { useState } from 'react';
import RichTextEditor from '../components/editor/RichTextEditor';
import AIPromptInput from '../components/ai/AIPromptInput';
import Navbar from '../components/layout/Navbar';

const DocumentEditor = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAIPrompt = async (prompt) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, currentContent: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setContent(data.content);
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="bg-white rounded-lg shadow">
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>
      </main>

      <AIPromptInput onSubmit={handleAIPrompt} isLoading={isLoading} />
    </div>
  );
};

export default DocumentEditor; 