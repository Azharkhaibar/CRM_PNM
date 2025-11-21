import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css'

import { AuthProvider } from './features/auth/provider/AuthProvider.jsx';
import { NotificationProvider } from './features/Dashboard/pages/notification/provider/notifcation.provider.jsx';
import { DarkModeProvider } from './shared/components/Darkmodecontext.jsx';
import { AuditLogProvider } from './features/Dashboard/pages/audit-log/context/audit-log-context.js';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <DarkModeProvider>
          <BrowserRouter>
            <AuditLogProvider>
              <App />
            </AuditLogProvider>
          </BrowserRouter>
        </DarkModeProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
