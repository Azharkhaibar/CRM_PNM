import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import InputField from '../components/inputField';
import fileIMG from '../../../assets/logo_pnm.png';
import bgImage from '../../../assets/Gedung-PNM-Banner.jpg';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';

export default function ForgotPassword() {
  const [userID, setUserID] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const { darkMode } = useDarkMode();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!userID) {
      setDialogMessage('UserID wajib diisi.');
      setShowDialog(true);
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setDialogMessage('Link reset password telah dikirim. Silakan cek email Anda.');
      setShowDialog(true);
      setUserID('');
    } catch (err) {
      setDialogMessage('Terjadi kesalahan. Silakan coba lagi.');
      setShowDialog(true);
    } finally {
      setLoading(false);
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
            <h1 className={`text-3xl font-semibold mt-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Lupa Password</h1>
            <p className={`${textClass} text-sm mt-2 transition-colors duration-300`}>Masukkan UserID Anda untuk menerima link reset password</p>
          </div>

          <form onSubmit={handleForgotPassword}>
            <div className="space-y-4">
              <InputField label="UserID" type="text" value={userID} onChange={(e) => setUserID(e.target.value)} darkMode={darkMode} required />
            </div>

            <button type="submit" disabled={loading} className={buttonClass}>
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>

            <p className={`mt-4 text-center text-sm transition-colors duration-300 ${textClass}`}>
              Kembali ke{' '}
              <Link to="/login" className={`font-medium hover:underline transition-colors duration-300 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                Halaman Login
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
              <button
                onClick={() => setShowDialog(false)}
                className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors duration-300 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Tutup
              </button>
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
              <p className="font-medium">Mengirim...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
