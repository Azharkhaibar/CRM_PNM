import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Mainpage from './pages/mainpage/home';
import LoginPage from './features/auth/pages/loginform';

import DashboardLayout from './features/Dashboard/main.jsx';
import Dashboard from './features/Dashboard/layout/dashboard.jsx';

// Semua halaman Risk Form
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Mainpage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />

        {/* Risk Form Main Page */}
        <Route path="risk-form" element={<Investasi />} />

        {/* Semua kategori Risk Form */}
        <Route path="risk-form/investasi" element={<Investasi />} />
        <Route path="risk-form/pasar" element={<Pasar />} />
        <Route path="risk-form/likuiditas" element={<Likuiditas />} />
        <Route path="risk-form/operasional" element={<Operational />} />
        <Route path="risk-form/hukum" element={<Hukum />} />
        <Route path="risk-form/stratejik" element={<Stratejik />} />
        <Route path="risk-form/kepatuhan" element={<Kepatuhan />} />
        <Route path="risk-form/reputasi" element={<Reputasi />} />

        <Route path="report" element={<Report />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
