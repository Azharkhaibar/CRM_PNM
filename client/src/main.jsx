import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import { AuthProvider } from './features/auth/provider/AuthProvider.jsx';
import {NotificationProvider} from './features/Dashboard/pages/notification/provider/notifcation.provider.jsx';
import { DarkModeProvider } from './shared/components/Darkmodecontext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <DarkModeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DarkModeProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
