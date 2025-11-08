import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/provider/AuthProvider.jsx';
import { DarkModeProvider } from './shared/components/Darkmodecontext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
