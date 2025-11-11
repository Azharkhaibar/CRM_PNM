import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import { DarkModeProvider } from './shared/components/Darkmodecontext.jsx';
import DarkModeToggle from './shared/components/Toggledarkmode.jsx';

import Mainpage from './pages/mainpage/home';
import LoginPage from './features/auth/pages/loginform';
import RegisterPage from './features/auth/pages/registform.jsx';
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
import ForgotPassword from './features/auth/pages/forgot-password.jsx';
import NotificationPage from './features/Dashboard/pages/notification/pages/notification.jsx';

function App() {
  return (
    <DarkModeProvider>
      {/* Toggle tetap di atas semua halaman */}
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      {/* Kontainer utama */}
      <div className="min-h-screen transition-colors">
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login/forgot-password" element={<ForgotPassword />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            {/* Risk Profile */}
            <Route path="risk-form" element={<Investasi />} />
            <Route path="risk-form/investasi" element={<Investasi />} />
            <Route path="risk-form/pasar" element={<Pasar />} />
            <Route path="risk-form/likuiditas" element={<Likuiditas />} />
            <Route path="risk-form/operasional" element={<Operational />} />
            <Route path="risk-form/hukum" element={<Hukum />} />
            <Route path="risk-form/stratejik" element={<Stratejik />} />
            <Route path="risk-form/kepatuhan" element={<Kepatuhan />} />
            <Route path="risk-form/reputasi" element={<Reputasi />} />

            {/* Other Pages */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="report" element={<Report />} />
            <Route path="notification" element={<NotificationPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </DarkModeProvider>
  );
}

export default App;
