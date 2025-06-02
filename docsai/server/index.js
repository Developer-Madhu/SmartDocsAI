const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Gemini AI configuration
const GEMINI_API_KEY = "AIzaSyAaNBPxwmC9E7WYklguCZdk47he1fU4H0c";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartdocs')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Document Schema
const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Document = mongoose.model('Document', documentSchema);

// API Endpoints

// Generate content using Gemini AI
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, currentContent } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Create a more focused system prompt
    const systemPrompt = `You are a document editor assistant. Your task is to generate content based on user requests.
    Important rules:
    1. ONLY generate the requested content, nothing else
    2. Do not add explanations, introductions, or conclusions
    3. Do not mention that you are an AI or assistant
    4. Use proper HTML formatting for the content
    5. Keep the tone professional and consistent
    6. If asked to modify existing content, only return the modified version
    7. If asked to add new content, only return the new content`;

    try {
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: systemPrompt,
          },
        ],
      });

      // Construct a focused prompt for the AI
      const fullPrompt = `
      Current document content:
      ${currentContent || 'No existing content'}

      User request: ${prompt}

      Instructions:
      1. Generate ONLY the requested content
      2. Use proper HTML formatting
      3. Do not add any explanations or additional text
      4. If modifying existing content, return only the modified version
      5. If adding new content, return only the new content`;

      const result = await chat.sendMessage(fullPrompt);
      const response = await result.response;
      let generatedContent = response.text();

      // Clean up the response: remove code block markers and language tags
      generatedContent = generatedContent
        .replace(/^```[a-zA-Z]*\n?/m, '') // Remove leading ``` or ```html
        .replace(/\n?```$/m, '')         // Remove trailing ```
        .replace(/^Here's|^Here is|^I'll|^I will|^Let me|^I can|^I've|^I have|^Here's what|^Here's the|^Here is the|^Here is what/gi, '')
        .replace(/^Generated content:|^Content:|^Response:|^Here's the content:|^Here's the response:/gi, '')
        .trim();

      // Ensure proper HTML formatting
      if (!generatedContent.includes('<')) {
        // If the content doesn't contain HTML tags, wrap it in appropriate tags
        generatedContent = `<p>${generatedContent.replace(/\n\n/g, '</p><p>')}</p>`;
      }

      // If there's existing content, append the new content
      const finalContent = currentContent 
        ? `${currentContent}\n\n${generatedContent}`
        : generatedContent;

      res.json({ content: finalContent });
    } catch (aiError) {
      console.error('AI Generation Error:', aiError);
      throw new Error(`AI Generation failed: ${aiError.message}`);
    }
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message || 'An unexpected error occurred'
    });
  }
});

// Save document
app.post('/api/documents', async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = new Document({ title, content });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({ error: 'Failed to save document' });
  }
});

// Get all documents
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.find().sort({ updatedAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get single document
app.get('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Update document
app.put('/api/documents/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// Delete document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 