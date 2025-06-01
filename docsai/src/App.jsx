import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DocumentEditor from './pages/DocumentEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<DocumentEditor />} />
      </Routes>
    </Router>
  );
}

export default App;