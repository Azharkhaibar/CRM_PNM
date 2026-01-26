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
import Pasar from './features/Dashboard/pages/RiskProfile/pages/pasar/Pasar.jsx';
import Likuiditas from './features/Dashboard/pages/RiskProfile/pages/likuiditas/Likuiditas.jsx';

import Hukum from './features/Dashboard/pages/RiskProfile/pages/hukum/Hukum.jsx';

import Kepatuhan from './features/Dashboard/pages/RiskProfile/pages/kepatuhan/Kepatuhan.jsx';
import Reputasi from './features/Dashboard/pages/RiskProfile/reputasi/Reputasi.jsx';
import Report from './features/Dashboard/report/report.jsx';
import Settings from './features/Dashboard/pages/RiskProfile/setting/setting.jsx';
import ProfilePage from './features/Dashboard/pages/profile/pages/userprofile.jsx';
import NotificationPage from './features/Dashboard/pages/notification/pages/notification.jsx';
import { useAuth } from './features/auth/hooks/useAuth.hook.js';
import { AuditLog } from './features/Dashboard/pages/audit-log/pages/audit-log-page.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Stratejik from './features/Dashboard/pages/RiskProfile/pages/stratejik/stratejik.jsx';
import Ras from './features/Dashboard/pages/RAS/pages/ras.jsx';
import Operational from './features/Dashboard/pages/RiskProfile/pages/operational/Operational.jsx';
import PasarProduk from './features/Dashboard/pages/RiskProfile-OJK/pages/pasar-produk/PasarProduk.jsx';
import LikuiditasProduk from './features/Dashboard/pages/RiskProfile-OJK/pages/likuiditas-produk/LikuiditasProduk';
import KonsentrasiProduk from './features/Dashboard/pages/RiskProfile-OJK/pages/konsentrasi-produk/KonsentrasiProduk';
import OperasionalRegulatory from './features/Dashboard/pages/RiskProfile-OJK/pages/operasional-regulatory/OperasionalRegulatory';
import InvestasiRegulatory from './features/Dashboard/pages/RiskProfile-OJK/pages/investasi-regulatory/InvestasiRegulatory';
import Ringkasan from './features/Dashboard/pages/RiskProfile-OJK/pages/ringkasan/ringkasan';
import RekapData from './features/Dashboard/pages/RiskProfile-OJK/pages/rekap-data/RekapData';
import RekapData1 from './features/Dashboard/pages/RiskProfile-OJK/pages/rekap-data-1/RekapData1';
import RekapData2 from './features/Dashboard/pages/RiskProfile-OJK/pages/rekap-data-2/RekapData2';
import PeringkatKomposit from './features/Dashboard/pages/RiskProfile-OJK/pages/peringkatkomposit/PeringkatKomposit';
import KreditProduk from './features/Dashboard/pages/RiskProfile-OJK/pages/kredit-produk/KreditProduk';
import HukumRegulatory from './features/Dashboard/pages/RiskProfile-OJK/pages/Hukum-regulatory/HukumRegulatory';
import ReputasiRegulatory from './features/Dashboard/pages/RiskProfile-OJK/pages/reputasi-regulatory/ReputasiRegulatory';
import KepatuhanRegulatory from './features/Dashboard/pages/RiskProfile-OJK/pages/kepatuhan-regulatory/KepatuhanRegulatory';
import RentabilitasRegulatory from './features/Dashboard/pages/RiskProfile-OJK/pages/rentabilitas-regulatory/RentabilitasRegulatory';
import PermodalanRegulatory from './features/Dashboard/pages/RiskProfile-OJK/pages/permodalan-regulatory/PermodalanRegulatory';
import TatakelolaRegulatory from './features/Dashboard/pages/RiskProfile-OJK/pages/tatakelola-regulatory/TatakelolaRegulatory';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
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
              <Route path="risk-form/hukum" element={<Hukum />} />
              <Route path="risk-form/operasional" element={<Operational />} />
              {/* <Route path="risk-form/hukum" element={<Hukum />} /> */}
              <Route path="risk-form/kepatuhan" element={<Kepatuhan />} />
              <Route path="risk-form/stratejik" element={<Stratejik />} />
              <Route path="risk-form/kepatuhan" element={<Kepatuhan />} />
              <Route path="risk-form/reputasi" element={<Reputasi />} />
              <Route path="profile" element={<ProfilePage />} />

              <Route path="ojk-risk/pasar-produk" element={<PasarProduk/>} />
              <Route path="ojk-risk/likuiditas-produk" element={<LikuiditasProduk/>} />
              <Route path="ojk-risk/kredit-produk" element={<KreditProduk/>} />
              <Route path="ojk-risk/konsentrasi-produk" element={<KonsentrasiProduk/>} />
              <Route path="ojk-risk/operasional-regulatory" element={<OperasionalRegulatory/>} />
              <Route path="ojk-risk/hukum-regulatory" element={<HukumRegulatory/>} />
              <Route path="ojk-risk/kepatuhan-regulatory" element={<KepatuhanRegulatory/>} />
              <Route path="ojk-risk/reputasi-regulatory" element={<ReputasiRegulatory/>} />
              <Route path="ojk-risk/investasi-regulatory" element={<InvestasiRegulatory/>} />
              <Route path="ojk-risk/rentabilitas-regulatory" element={<RentabilitasRegulatory/>} />
              <Route path="ojk-risk/permodalan-regulatory" element={<PermodalanRegulatory/>} />
              <Route path="ojk-risk/tatakelola-regulatory" element={<TatakelolaRegulatory/>} />

              <Route path="ojk-risk/ringkasan" element={<Ringkasan/>} />
              <Route path="ojk-risk/rekap-data" element={<RekapData/>} />
              <Route path="ojk-risk/rekap-data1" element={<RekapData1/>} />
              <Route path="ojk-risk/rekap-data2" element={<RekapData2/>} />
              <Route path="ojk-risk/peringkat-komposit" element={<PeringkatKomposit/>} />

              <Route path="report" element={<Report />} />
              <Route path="ras" element={<Ras />} />
              <Route path="notification" element={<NotificationPage />} />
              <Route path="audit-log" element={<AuditLog />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Mainpage />} />

            <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
          </Routes>
        </div>
      </DarkModeProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
