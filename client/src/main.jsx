import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Intercept global fetch to support custom VITE_API_URL backend host when deployed separately
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  if (apiUrl) {
    if (typeof input === 'string') {
      if (input.startsWith('/api') || input.startsWith('/uploads')) {
        input = `${apiUrl}${input}`;
      }
    } else if (input instanceof URL) {
      if (input.pathname.startsWith('/api') || input.pathname.startsWith('/uploads')) {
        input = new URL(`${apiUrl}${input.pathname}${input.search}${input.hash}`);
      }
    } else if (input && typeof input === 'object' && 'url' in input) {
      // Handle Request objects
      const url = input.url;
      const origin = window.location.origin;
      if (url.startsWith('/') && (url.startsWith('/api') || url.startsWith('/uploads'))) {
        input = new Request(`${apiUrl}${url}`, input);
      } else if (url.startsWith(origin)) {
        const relativePath = url.slice(origin.length);
        if (relativePath.startsWith('/api') || relativePath.startsWith('/uploads')) {
          input = new Request(`${apiUrl}${relativePath}`, input);
        }
      }
    }
  }
  return originalFetch(input, init);
};



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
