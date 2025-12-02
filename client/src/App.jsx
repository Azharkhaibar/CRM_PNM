import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import { DarkModeProvider } from './shared/components/Darkmodecontext.jsx';
import DarkModeToggle from './shared/components/Toggledarkmode.jsx';
import KPMR from './features/Dashboard/pages/RiskProfile/pages/KPMR.jsx';
import Mainpage from './pages/mainpage/home.jsx';
import LoginPage from './features/auth/pages/loginform';
import RegisterPage from './features/auth/pages/registform.jsx';
import DashboardLayout from './features/Dashboard/main.jsx';
import Dashboard from './features/Dashboard/layout/dashboard.jsx';
import Investasi from './features/Dashboard/pages/RiskProfile/pages/Investasi.jsx';
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
            <Route path="risk-profile/investasi" element={<Investasi />} />
            <Route path="risk-profile/kpmr" element={<KPMR />} />
            <Route path="risk-profile/pasar" element={<Pasar />} />
            <Route path="risk-profile/likuiditas" element={<Likuiditas />} />
            <Route path="risk-profile/operasional" element={<Operational />} />
            <Route path="risk-profile/hukum" element={<Hukum />} />
            <Route path="risk-profile/stratejik" element={<Stratejik />} />
            <Route path="risk-profile/kepatuhan" element={<Kepatuhan />} />
            <Route path="risk-profile/reputasi" element={<Reputasi />} />

            {/* Other Pages */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="report" element={<Report />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </DarkModeProvider>
  );
}

export default App;
