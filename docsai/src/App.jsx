import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import RichTextEditor from './components/editor/RichTextEditor';
import DocumentSaver from './components/editor/DocumentSaver';
import Navbar from './components/Navbar';
import { API_ENDPOINTS } from './config';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentContent, setDocumentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(API_ENDPOINTS.AUTH.USER, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setUser(data);
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleSaveDocument = async (content) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.DOCUMENTS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              isAuthenticated={isAuthenticated}
              user={user}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/signin"
          element={
            isAuthenticated ? (
              <Navigate to="/editor" replace />
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/editor" replace />
            ) : (
              <SignUp onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/editor"
          element={
            isAuthenticated ? (
              <div className="container mx-auto px-4 py-8">
                <div className="mb-4">
                  <DocumentSaver
                    content={documentContent}
                    onSave={handleSaveDocument}
                    isSaving={isSaving}
                  />
                </div>
                <RichTextEditor
                  content={documentContent}
                  onChange={setDocumentContent}
                  onSave={handleSaveDocument}
                  isSaving={isSaving}
                />
              </div>
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route
          path="/saved"
          element={
            isAuthenticated ? (
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Saved Documents</h1>
                {/* Saved documents list will be implemented here */}
              </div>
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;