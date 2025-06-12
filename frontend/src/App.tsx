import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Generator from './pages/Generator';
import CodeExport from './pages/CodeExport';

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ 
        backgroundColor: 'var(--md-sys-color-background)', 
        color: 'var(--md-sys-color-on-background)' 
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/export" element={<CodeExport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
