import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';

export default function Dashboard() {
  const loc = useLocation();
  const { darkMode } = useDarkMode();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    if (loc.state?.fromLogin) {
      setDialogMessage('✅ Login berhasil! Selamat datang di Dashboard 👋');
      setShowDialog(true);
      setTimeout(() => setShowDialog(false), 2500);
    }
  }, [loc.state]);

  // Style objects untuk manual styling
  const welcomeCardStyle = {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  const statCardStyle = {
    backgroundColor: darkMode ? 'var(--card-bg)' : '#ffffff',
    border: `1px solid ${darkMode ? 'var(--border-color)' : '#e5e7eb'}`,
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: darkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  };

  const activityCardStyle = {
    backgroundColor: darkMode ? 'var(--card-bg)' : '#ffffff',
    border: `1px solid ${darkMode ? 'var(--border-color)' : '#e5e7eb'}`,
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginTop: '1.5rem',
    boxShadow: darkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  };

  const activityItemStyle = {
    padding: '0.75rem',
    border: `1px solid ${darkMode ? 'var(--border-color)' : '#e5e7eb'}`,
    borderRadius: '0.5rem',
    backgroundColor: darkMode ? 'var(--bg-secondary)' : '#f9fafb',
    marginBottom: '0.75rem',
  };

  const dialogStyle = {
    backgroundColor: darkMode ? 'var(--card-bg)' : '#ffffff',
    color: darkMode ? 'var(--text-primary)' : '#1f2937',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    maxWidth: '320px',
    width: '90%',
    border: `1px solid ${darkMode ? 'var(--border-color)' : '#e5e7eb'}`,
  };

  return (
    <div className={`p-6 min-h-screen ${darkMode ? 'dark-mode-bg' : 'bg-gray-50'}`}>
      <motion.h1 initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={`text-3xl font-bold mb-6 ${darkMode ? 'dark-mode-text' : 'text-gray-900'}`}>
        Dashboard
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={welcomeCardStyle}>
        <h2 className="text-2xl font-semibold">Welcome Back 👋</h2>
        <p className="text-blue-100 mt-1">Senang melihat Anda kembali. Semoga hari Anda produktif!</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={statCardStyle}>
          <p className={`font-semibold ${darkMode ? 'dark-mode-text-secondary' : 'text-gray-600'}`}>Total Risks</p>
          <h3 className="text-3xl font-bold text-blue-600 mt-2">125</h3>
          <p className={`text-sm mt-1 ${darkMode ? 'dark-mode-text-secondary' : 'text-gray-500'}`}>Semua risiko tercatat</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} style={statCardStyle}>
          <p className={`font-semibold ${darkMode ? 'dark-mode-text-secondary' : 'text-gray-600'}`}>Mitigated</p>
          <h3 className="text-3xl font-bold text-green-600 mt-2">58</h3>
          <p className={`text-sm mt-1 ${darkMode ? 'dark-mode-text-secondary' : 'text-gray-500'}`}>Sudah terselesaikan</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} style={statCardStyle}>
          <p className={`font-semibold ${darkMode ? 'dark-mode-text-secondary' : 'text-gray-600'}`}>In Progress</p>
          <h3 className="text-3xl font-bold text-yellow-600 mt-2">32</h3>
          <p className={`text-sm mt-1 ${darkMode ? 'dark-mode-text-secondary' : 'text-gray-500'}`}>Dalam proses</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} style={activityCardStyle}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'dark-mode-text' : 'text-gray-900'}`}>Recent Activity</h2>

        <div className="space-y-3">
          <div style={activityItemStyle}>
            ✅ Risk mitigation completed for <b>Operational Risk</b>
          </div>
          <div style={activityItemStyle}>
            📌 New risk assessment added in <b>Market Risk</b>
          </div>
          <div style={activityItemStyle}>
            🔄 Credit risk data updated for <b>Q4</b>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDialog && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }} style={dialogStyle}>
              <p className="text-lg font-semibold">Welcome</p>
              <p className="mt-2">{dialogMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
