import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from './FontSize';
import EditorToolbar from './EditorToolbar';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import { API_ENDPOINTS } from '../../config';

const TYPING_SPEED = 18; // ms per character

const RichTextEditor = ({ content = '', onChange, onSave, isSaving, isGenerating }) => {
  const [animatedContent, setAnimatedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const editorRef = useRef(null);
  const scrollRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing or use AI to generate content...',
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      TextAlign.configure({ 
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML()
          .replace(/\n\s*\n\s*\n/g, '\n\n')
          .replace(/\s{2,}/g, ' ')
          .replace(/>\s+</g, '><')
          .replace(/\s+$/gm, '');
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: 'min-h-[500px] p-4 border rounded-lg shadow-sm focus:outline-none bg-white',
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === 'Tab') {
            event.preventDefault();
            if (event.shiftKey) {
              editor.commands.liftListItem('listItem');
            } else {
              editor.commands.sinkListItem('listItem');
            }
            return true;
          }
          return false;
        },
      },
    },
  });

  const handleGenerateContent = async () => {
    if (!aiPrompt.trim()) return;

    setIsGeneratingContent(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.AI.GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: aiPrompt }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      if (onChange) {
        onChange(data.content);
      }
      setAiPrompt('');
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Typing animation for AI-generated content
  useEffect(() => {
    if (isGenerating && content && content !== animatedContent) {
      setIsTyping(true);
      let i = 0;
      setAnimatedContent('');
      const interval = setInterval(() => {
        i++;
        const partialContent = content.slice(0, i);
        setAnimatedContent(partialContent);
        if (editor) {
          const cleanedContent = partialContent
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .replace(/\s{2,}/g, ' ')
            .replace(/>\s+</g, '><')
            .replace(/\s+$/gm, '');
          editor.commands.setContent(cleanedContent, false, {
            preserveWhitespace: 'full',
            preserveStyles: true
          });
        }
        if (i >= content.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, TYPING_SPEED);
      return () => clearInterval(interval);
    } else if (!isGenerating && !isTyping) {
      setAnimatedContent(content || '');
    }
  }, [content, isGenerating, editor, animatedContent, isTyping]);

  // Update editor content when content prop changes (except during typing)
  useEffect(() => {
    if (editor && !isTyping && content !== editor.getHTML()) {
      const cleanedContent = (content || '')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .replace(/\s{2,}/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+$/gm, '');
      editor.commands.setContent(cleanedContent, false, {
        preserveWhitespace: 'full',
        preserveStyles: true
      });
    }
  }, [content, editor, isTyping]);

  // Add keyboard shortcuts for formatting
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        editor.chain().focus().toggleBold().run();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
        event.preventDefault();
        editor.chain().focus().toggleItalic().run();
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '8') {
        event.preventDefault();
        editor.chain().focus().toggleBulletList().run();
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '7') {
        event.preventDefault();
        editor.chain().focus().toggleOrderedList().run();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  // Scroll to bottom when content grows
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [animatedContent, isTyping]);

  // Improved PDF export using jsPDF's html method
  const handleExport = async () => {
    const titleInput = document.querySelector('input[type="text"]');
    const fileName = titleInput ? `${titleInput.value || 'document'}.pdf` : 'document.pdf';
    const doc = new jsPDF('p', 'pt', 'a4');
    
    // Get the editor's content with all styles
    const editorElement = editorRef.current;
    if (!editorElement) return;
    
    // Create a container that will hold our content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '700px';
    container.style.padding = '32px';
    container.style.backgroundColor = '#ffffff';
    
    // Clone the editor content
    const contentClone = editorElement.cloneNode(true);
    
    // Get all computed styles from the original editor
    const originalStyles = window.getComputedStyle(editorElement);
    const computedStyles = {
      fontFamily: originalStyles.fontFamily,
      fontSize: originalStyles.fontSize,
      lineHeight: originalStyles.lineHeight,
      color: originalStyles.color,
      backgroundColor: originalStyles.backgroundColor,
    };
    
    // Apply computed styles to the container
    Object.entries(computedStyles).forEach(([property, value]) => {
      container.style[property] = value;
    });
    
    // Add the cloned content
    container.appendChild(contentClone);
    
    // Create a style element to ensure all editor styles are preserved
    const style = document.createElement('style');
    style.innerHTML = `
      .ProseMirror {
        all: inherit !important;
        font-family: ${computedStyles.fontFamily} !important;
        font-size: ${computedStyles.fontSize} !important;
        line-height: ${computedStyles.lineHeight} !important;
        color: ${computedStyles.color} !important;
        background-color: ${computedStyles.backgroundColor} !important;
      }
      .ProseMirror * {
        font-family: inherit !important;
        font-size: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
        background-color: inherit !important;
      }
      .ProseMirror p {
        margin: 0.5em 0 !important;
        white-space: pre-wrap !important;
      }
      .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
        margin: 1em 0 0.5em 0 !important;
        font-weight: bold !important;
      }
      .ProseMirror ul, .ProseMirror ol {
        margin: 0.5em 0 0.5em 2em !important;
        padding-left: 1em !important;
      }
      .ProseMirror li {
        margin: 0.3em 0 !important;
        display: list-item !important;
      }
      .ProseMirror blockquote {
        margin: 1em 0 !important;
        padding-left: 1em !important;
        border-left: 3px solid #ccc !important;
      }
      .ProseMirror pre {
        margin: 1em 0 !important;
        padding: 1em !important;
        background-color: #f5f5f5 !important;
        border-radius: 4px !important;
      }
      .ProseMirror code {
        font-family: monospace !important;
        background-color: #f5f5f5 !important;
        padding: 0.2em 0.4em !important;
        border-radius: 3px !important;
      }
      .ProseMirror img {
        max-width: 100% !important;
        height: auto !important;
        margin: 1em 0 !important;
      }
      .ProseMirror table {
        border-collapse: collapse !important;
        margin: 1em 0 !important;
        width: 100% !important;
      }
      .ProseMirror th, .ProseMirror td {
        border: 1px solid #ddd !important;
        padding: 0.5em !important;
      }
      .ProseMirror th {
        background-color: #f5f5f5 !important;
      }
    `;
    container.appendChild(style);
    document.body.appendChild(container);

    try {
      // Wait for fonts to load
      await document.fonts.ready;
      
      // Use html2canvas with improved settings
      const canvas = await html2canvas(container, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 800,
        onclone: (clonedDoc) => {
          // Ensure all styles are applied in the cloned document
          const clonedContainer = clonedDoc.querySelector('div');
          if (clonedContainer) {
            Object.entries(computedStyles).forEach(([property, value]) => {
              clonedContainer.style[property] = value;
            });
          }
        }
      });

      // Calculate dimensions to maintain aspect ratio
      const imgWidth = 530;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to the PDF
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 32, 32, imgWidth, imgHeight);
      doc.save(fileName);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      document.body.removeChild(container);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden border-2 border-blue-100 shadow-lg bg-gradient-to-br from-white via-blue-50 to-pink-50 animate-fade-in">
      <EditorToolbar 
        editor={editor} 
        onExport={handleExport}
        onSave={onSave}
        isSaving={isSaving}
      />
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Enter a prompt for AI to generate content..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGenerateContent}
            disabled={isGeneratingContent || !aiPrompt.trim()}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors
              ${isGeneratingContent || !aiPrompt.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isGeneratingContent ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto max-h-[70vh] relative px-2 py-2">
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto min-h-[500px]">
          {isGenerating || isTyping ? (
            <div className="whitespace-pre-line text-blue-900 font-mono text-lg animate-pulse">
              {animatedContent}
              <span className="bg-blue-300 rounded animate-blink ml-1">|</span>
            </div>
          ) : (
            <EditorContent 
              editor={editor} 
              ref={editorRef}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor; 