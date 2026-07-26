// main.tsx
// Entry app point

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import './styles/global.scss';
import './config/langConfig';
import './lib/loadAssets';

// Create root
ReactDOM.createRoot(document.getElementById('root') as ReactDOM.Container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);