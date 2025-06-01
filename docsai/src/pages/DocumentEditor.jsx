import { useState } from 'react';
import RichTextEditor from '../components/editor/RichTextEditor';
import AIPromptInput from '../components/ai/AIPromptInput';
import Navbar from '../components/layout/Navbar';

const DocumentEditor = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAIPrompt = async (prompt) => {
    setIsLoading(true);
    try {
      // TODO: Implement AI API call
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, currentContent: content }),
      });
      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      console.error('Error generating content:', error);
      // TODO: Add error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <div className="px-4 py-6 sm:px-0">
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