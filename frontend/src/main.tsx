// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';       
import './index.css';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
      <App />
      </ErrorBoundary>
      <Toaster
        richColors
        theme="dark"
        position="top-right"
        duration={3500}
      />
    </BrowserRouter>
  </StrictMode>
);
