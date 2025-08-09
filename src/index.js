// File: AuraDrive/frontend/src/index.js
// This is the corrected version.
import { AppProvider } from './context/AppContext'; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 1. Import BrowserRouter and AuthProvider here
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider> {/* <-- Wrap here */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppProvider> {/* <-- And close here */}
    </BrowserRouter>
  </React.StrictMode>
);

