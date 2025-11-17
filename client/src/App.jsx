// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { DarkModeProvider } from './shared/components/Darkmodecontext.jsx';
import DarkModeToggle from './shared/components/Toggledarkmode.jsx';
import ProtectedRoute from './features/Dashboard/routes/ProtectedAuthRoute.routes.jsx';
import PublicRoute from './features/Dashboard/routes/PublicRoute.jsx';
import Mainpage from './pages/mainpage/home';
import LoginPage from './features/auth/pages/loginform';
import RegisterPage from './features/auth/pages/registform.jsx';
import ForgotPassword from './features/auth/pages/forgot-password.jsx';
import DashboardLayout from './features/Dashboard/main.jsx';
import Dashboard from './features/Dashboard/layout/dashboard.jsx';
import Investasi from './features/Dashboard/pages/RiskProfile/pages/investasi/Investasi.jsx';
import Pasar from './features/Dashboard/pages/RiskProfile/pages/Pasar.jsx';
import Likuiditas from './features/Dashboard/pages/RiskProfile/pages/Likuiditas.jsx';
import Operational from './features/Dashboard/pages/RiskProfile/pages/Operational.jsx';
import Hukum from './features/Dashboard/pages/RiskProfile/pages/Hukum.jsx';
import Stratejik from './features/Dashboard/pages/RiskProfile/pages/Stratejik.jsx';
import Kepatuhan from './features/Dashboard/pages/RiskProfile/pages/Kepatuhan.jsx';
import Reputasi from './features/Dashboard/pages/RiskProfile/pages/Reputasi.jsx';
import Report from './features/Dashboard/report/report.jsx';
import Settings from './features/Dashboard/pages/RiskProfile/setting/setting.jsx';
import ProfilePage from './features/Dashboard/pages/profile/pages/userprofile.jsx';
import NotificationPage from './features/Dashboard/pages/notification/pages/notification.jsx';
import { useAuth } from './features/auth/hooks/useAuth.hook.js';
import { AuditLog } from './features/Dashboard/pages/audit-log/pages/audit-log-page.jsx';
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DarkModeProvider>
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      <div className="min-h-screen transition-colors">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="risk-form" element={<Investasi />} />
            <Route path="risk-form/investasi" element={<Investasi />} />
            <Route path="risk-form/pasar" element={<Pasar />} />
            <Route path="risk-form/likuiditas" element={<Likuiditas />} />
            <Route path="risk-form/operasional" element={<Operational />} />
            <Route path="risk-form/hukum" element={<Hukum />} />
            <Route path="risk-form/stratejik" element={<Stratejik />} />
            <Route path="risk-form/kepatuhan" element={<Kepatuhan />} />
            <Route path="risk-form/reputasi" element={<Reputasi />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="report" element={<Report />} />
            <Route path="notification" element={<NotificationPage />} />
            <Route path='audit-log' element={<AuditLog />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Mainpage />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </div>
    </DarkModeProvider>
  );
}

export default App;
