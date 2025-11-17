import React, { useState, useEffect } from 'react';
import InputField from '../components/inputField';
import { useNavigate, Navigate } from 'react-router-dom';
import bgImage from '../../../assets/Gedung-PNM-Banner.jpg';
import fileIMG from '../../../assets/LogoRIMS.png';
import { useAuth } from '../hooks/useAuth.hook';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';
import PinDialog from '../components/pinDialog';
import { useUserNotifications } from '../../Dashboard/pages/notification/hooks/notification.hook';

export default function LoginPage() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();
  const { user, loading, error, login } = useAuth();
  const { refreshNotifications } = useUserNotifications();
  const { darkMode } = useDarkMode();

  // Jika user sudah login, redirect otomatis ke dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    if (!userID || !password) {
      setDialogMessage('UserID dan Password harus diisi');
      setShowDialog(true);
      setIsLoggingIn(false);
      return;
    }

    try {
      await login(userID, password);

      try {
        await refreshNotifications();
      } catch (err) {
        console.log('Notification refresh optional:', err.message);
      }

      setDialogMessage(`✅ Login berhasil! Selamat datang di RIMS, ${userID} 👋`);
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
        navigate('/dashboard', {
          state: { fromLogin: true, welcomeMessage: `Selamat datang, ${userID}!` },
        });
      }, 2000);
    } catch (err) {
      setDialogMessage(err.message || 'Login gagal, silakan coba lagi');
      setShowDialog(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePinVerified = () => {
    setShowPinDialog(false);
    navigate('/register');
  };

  const containerClass = `min-h-screen flex relative transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-blue-200'}`;

  const formCardClass = `w-full max-w-md backdrop-blur-md shadow-2xl rounded-2xl p-8 border transition-all duration-300 ${darkMode ? 'bg-gray-800/80 border-gray-700/50 text-white' : 'bg-white/50 border-white/40 text-gray-800'}`;

  const textClass = darkMode ? 'text-gray-300' : 'text-gray-600';
  const buttonClass = `w-full mt-6 py-3 font-semibold rounded-xl transition-all duration-300 shadow-lg ${
    isLoggingIn ? 'bg-gray-500 cursor-not-allowed text-gray-300' : darkMode ? 'bg-blue-700 hover:bg-blue-600 active:scale-[.98] text-white' : 'bg-blue-600 hover:bg-blue-700 active:scale-[.98] text-white'
  }`;

  const loadingOverlayClass = `fixed inset-0 flex items-center justify-center z-50 ${darkMode ? 'bg-black/50' : 'bg-black/40'}`;

  const loadingCardClass = `rounded-xl p-6 flex flex-col items-center justify-center shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`;

  return (
    <div className={containerClass}>
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={formCardClass}>
          <div className="text-center mb-8">
            <img src={fileIMG} alt="PNM Logo" className="mx-auto w-64 h-auto drop-shadow-lg transition-opacity duration-300" />
            <h1 className={`text-3xl font-semibold mt-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Selamat Datang</h1>
            <p className={`${textClass} text-sm mt-2 transition-colors duration-300`}>Silahkan login untuk mengakses dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <InputField label="UserID" type="text" value={userID} onChange={(e) => setUserID(e.target.value)} darkMode={darkMode} disabled={isLoggingIn} />
              <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} darkMode={darkMode} disabled={isLoggingIn} />
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  disabled={isLoggingIn}
                  className={`text-sm font-medium hover:underline transition-colors duration-300 ${isLoggingIn ? 'text-gray-500 cursor-not-allowed' : darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`text-sm text-center mt-2 transition-colors duration-300 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={isLoggingIn} className={buttonClass}>
              {isLoggingIn ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>

            <p className={`mt-4 text-center text-sm transition-colors duration-300 ${textClass}`}>
              Not already have an account?{' '}
              <button
                type="button"
                onClick={() => setShowPinDialog(true)}
                disabled={isLoggingIn}
                className={`font-medium hover:underline transition-colors duration-300 ${isLoggingIn ? 'text-gray-500 cursor-not-allowed' : darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                Register here
              </button>
            </p>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className={`mt-6 p-3 rounded-lg text-xs text-center ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
            <p>💡 Setelah login, Anda akan menerima notifikasi welcome</p>
          </motion.div>
        </motion.div>
      </div>

      <div className="hidden md:block w-1/2 relative bg-cover bg-center transition-all duration-300" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className={`absolute inset-0 transition-all duration-300 ${darkMode ? 'bg-gradient-to-t from-black/60 to-transparent' : 'bg-gradient-to-t from-black/40 to-transparent'}`} />
      </div>
      <AnimatePresence>
        {showDialog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`relative rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            >
              <div className="text-center">
                {dialogMessage.includes('✅') && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
                <p className="font-medium">{dialogMessage}</p>
                {dialogMessage.includes('✅') && <p className="text-sm mt-2 opacity-75">Mengarahkan ke dashboard...</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(loading || isLoggingIn) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={loadingOverlayClass}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className={loadingCardClass}>
              <svg className="animate-spin h-10 w-10 mb-4 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke={darkMode ? '#60A5FA' : '#2563EB'} strokeWidth="4"></circle>
                <path className="opacity-75" fill={darkMode ? '#60A5FA' : '#2563EB'} d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <p className="font-medium">Logging in...</p>
              <p className="text-sm mt-2 opacity-75">Membuat notifikasi welcome...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PinDialog isOpen={showPinDialog} onClose={() => setShowPinDialog(false)} onPinVerified={handlePinVerified} />
    </div>
  );
}
