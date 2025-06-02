import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';

const TYPING_SPEED = 18; // ms per character

const RichTextEditor = ({ content, onChange, onSave, isSaving, isGenerating }) => {
  const [animatedContent, setAnimatedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const editorRef = useRef(null);
  const scrollRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing or use AI to generate content...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[500px] p-4 border rounded-lg shadow-sm focus:outline-none bg-white',
      },
    },
  });

  // Typing animation for AI-generated content
  useEffect(() => {
    if (isGenerating && content && content !== animatedContent) {
      setIsTyping(true);
      let i = 0;
      setAnimatedContent('');
      const interval = setInterval(() => {
        i++;
        setAnimatedContent(content.slice(0, i));
        if (i >= content.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, TYPING_SPEED);
      return () => clearInterval(interval);
    } else if (!isGenerating && !isTyping) {
      setAnimatedContent(content);
    }
    // eslint-disable-next-line
  }, [content, isGenerating]);

  // Update editor content when content prop changes (except during typing)
  useEffect(() => {
    if (editor && !isTyping && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
    // eslint-disable-next-line
  }, [content, editor, isTyping]);

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
    const htmlContent = editor ? editor.getHTML() : '';
    // Create a hidden container for styled export
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.padding = '32px';
    container.style.fontFamily = 'Inter, Arial, sans-serif';
    container.style.color = '#22223b';
    container.style.maxWidth = '700px';
    // Custom styles for headings, paragraphs, lists
    const style = document.createElement('style');
    style.innerHTML = `
      h1, h2, h3 { color: #3b82f6; font-family: inherit; margin-top: 1.5em; margin-bottom: 0.5em; }
      h1 { font-size: 2.2em; font-weight: bold; }
      h2 { font-size: 1.5em; font-weight: bold; }
      h3 { font-size: 1.2em; font-weight: bold; }
      p { font-size: 1.05em; margin: 0.5em 0; line-height: 1.7; }
      ul, ol { margin: 1em 0 1em 2em; }
      li { margin-bottom: 0.3em; }
      strong { color: #d72660; }
      em { color: #4361ee; }
      body { background: #fff; }
    `;
    container.appendChild(style);
    document.body.appendChild(container);
    await doc.html(container, {
      x: 32,
      y: 32,
      width: 530,
      windowWidth: 800,
      html2canvas: { scale: 0.8 },
      callback: function (doc) {
        doc.save(fileName);
        document.body.removeChild(container);
      },
    });
  };

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden border-2 border-blue-100 shadow-lg bg-gradient-to-br from-white via-blue-50 to-pink-50 animate-fade-in">
      <EditorToolbar 
        editor={editor} 
        onExport={handleExport}
        onSave={onSave}
        isSaving={isSaving}
      />
      <div ref={scrollRef} className="flex-1 overflow-y-auto max-h-[70vh] relative px-2 py-2">
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto min-h-[500px]">
          {/* Animated typing effect for AI generation */}
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