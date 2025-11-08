import React, { useState } from 'react';
import InputField from '../components/inputField';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../../../assets/Gedung-PNM-Banner.jpg';
import fileIMG from '../../../assets/LogoRIMS.png';
import { useAuth } from '../hooks/useAuth.hook';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';

export default function LoginPage() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const nvg = useNavigate();
  const { loading, error, login } = useAuth();
  const { darkMode } = useDarkMode(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userID || !password) {
      setDialogMessage('UserID dan Password harus diisi');
      setShowDialog(true);
      return;
    }

    try {
      await login(userID, password);

      setDialogMessage('✅ Login berhasil! Selamat datang 👋');
      setShowDialog(true);

      setTimeout(() => {
        setShowDialog(false);
        nvg('/dashboard', { state: { fromLogin: true } });
      }, 1500);
    } catch (err) {
      setDialogMessage(err.message || 'Login gagal, coba lagi');
      setShowDialog(true);
    }
  };

  const containerClass = `min-h-screen flex relative transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-blue-200'}`;

  const formCardClass = `w-full max-w-md backdrop-blur-md shadow-2xl rounded-2xl p-8 border transition-all duration-300 ${darkMode ? 'bg-gray-800/80 border-gray-700/50 text-white' : 'bg-white/50 border-white/40 text-gray-800'}`;

  const textClass = darkMode ? 'text-gray-300' : 'text-gray-600';
  const buttonClass = `w-full mt-6 py-3 font-semibold rounded-xl transition-all duration-300 shadow-lg ${
    loading ? 'bg-gray-500 cursor-not-allowed text-gray-300' : darkMode ? 'bg-blue-700 hover:bg-blue-600 active:scale-[.98] text-white' : 'bg-blue-600 hover:bg-blue-700 active:scale-[.98] text-white'
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
              <InputField label="UserID" type="text" value={userID} onChange={(e) => setUserID(e.target.value)} darkMode={darkMode} />
              <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} darkMode={darkMode} />
            </div>

            {error && <p className={`text-sm text-center mt-2 transition-colors duration-300 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>}

            <button type="submit" disabled={loading} className={buttonClass}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className={`mt-4 text-center text-sm transition-colors duration-300 ${textClass}`}>
              Not already have an account?{' '}
              <Link to="/register" className={`font-medium hover:underline transition-colors duration-300 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                Register here
              </Link>
            </p>
          </form>
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
              <p className="text-center font-medium">{dialogMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={loadingOverlayClass}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className={loadingCardClass}>
              <svg className="animate-spin h-10 w-10 mb-4 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke={darkMode ? '#60A5FA' : '#2563EB'} strokeWidth="4"></circle>
                <path className="opacity-75" fill={darkMode ? '#60A5FA' : '#2563EB'} d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <p className="font-medium">Logging in...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
