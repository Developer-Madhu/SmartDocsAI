import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/editor/RichTextEditor';
import AIPromptInput from '../components/ai/AIPromptInput';
import Navbar from '../components/layout/Navbar';

const DocumentEditor = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAIPrompt = useCallback(async (prompt) => {
    setIsLoading(true);
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, currentContent: content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || `HTTP error! status: ${response.status}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Update content with the generated text
      setContent(data.content);
      setSuccessMessage('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  }, [content]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setSuccessMessage('Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      setError(error.message || 'Failed to save document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 text-2xl font-bold border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              placeholder="Enter document title..."
            />
          </div>
          <div className="bg-white rounded-lg shadow">
            <RichTextEditor 
              content={content} 
              onChange={setContent} 
              onSave={handleSave}
              isSaving={isSaving}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>

      <AIPromptInput onSubmit={handleAIPrompt} isLoading={isLoading} />
    </div>
  );
};

export default DocumentEditor; 