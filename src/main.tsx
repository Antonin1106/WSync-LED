// main.tsx
// Entry app point

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import { registerServiceWorker } from './lib/registerServiceWorker';
import './styles/global.scss';
import './config/langConfig';

// Create root
ReactDOM.createRoot(document.getElementById('root') as ReactDOM.Container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Request registration of SW
window.addEventListener('load', () => {
  registerServiceWorker();
});
