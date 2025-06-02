import { useState } from 'react';
// Remove jsPDF and html2canvas imports
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';
import { API_ENDPOINTS } from '../../config';
import html2pdf from 'html2pdf.js'; // Import html2pdf.js

const DocumentSaver = ({ content = '', onSave, isSaving }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!content) {
      setError('No content to save');
      return;
    }

    try {
      setError(null);
      await onSave(content);
    } catch (err) {
      setError(err.message || 'Failed to save document');
    } finally {

    }
  };

  const handleExport = async () => {
    if (!content) {
      setError('No content to export');
      return;
    }

    try {
      setError(null);
      setIsExporting(true);

      // Create a temporary div to render the content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      // Apply styles for rendering, similar to how it would appear in the editor
      tempDiv.style.fontFamily = 'Arial, sans-serif'; // Ensure font consistency
      tempDiv.style.fontSize = '12pt'; // Ensure font size consistency
      tempDiv.style.lineHeight = '1.5'; // Ensure line height consistency
      tempDiv.style.color = '#000000'; // Ensure color consistency
      // You might need to add more styles here to match editor defaults

      // Append to body temporarily for rendering
      document.body.appendChild(tempDiv);

      // html2pdf options for A4, ~10mm margins, and quality
      const options = {
        margin: [10, 10, 10, 10], // Top, left, bottom, right margins in mm
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true }, // Increased scale and DPI for better quality
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] } // Enable CSS and legacy page breaks
      };

      // Generate PDF from the temporary div
      await html2pdf().from(tempDiv).set(options).save();

      // Remove temporary div
      document.body.removeChild(tempDiv);

    } catch (err) {
      console.error('PDF export failed:', err);
      setError(err.message || 'Failed to export document');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <button
        onClick={handleSave}
        disabled={isSaving || !content}
        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors
          ${isSaving || !content
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {isSaving ? 'Saving...' : 'Save Document'}
      </button>
      <button
        onClick={handleExport}
        disabled={isExporting || !content}
        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors
          ${isExporting || !content
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
          }`}
      >
        {isExporting ? 'Exporting...' : 'Export PDF'}
      </button>
    </div>
  );
};

export default DocumentSaver; 