// =============================================================================
// Practical 2: React State Management and Multi-Page Navigation
// File: src/main.jsx
// Description: React DOM root entry point wrapping <App /> in <BrowserRouter>
//              exactly once from react-router-dom.
// =============================================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
