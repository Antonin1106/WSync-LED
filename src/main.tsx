import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerServiceWorker } from './lib/registerServiceWorker';
import './styles/app.scss';
import './config/langConfig';

ReactDOM.createRoot(document.getElementById('root') as ReactDOM.Container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

window.addEventListener('load', () => {
  registerServiceWorker();
});
