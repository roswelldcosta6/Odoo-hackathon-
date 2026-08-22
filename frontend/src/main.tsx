import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HRMSProvider } from './context/HRMSContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HRMSProvider>
      <App />
    </HRMSProvider>
  </React.StrictMode>,
);
