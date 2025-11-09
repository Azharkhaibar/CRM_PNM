import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';

const PinDialog = ({ isOpen, onClose, onPinVerified }) => {
  const [pin, setPin] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { darkMode } = useDarkMode();

  const showErrorToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validPin = '123456';

    if (pin === validPin) {
      onPinVerified();
      setPin('');
    } else {
      showErrorToast('PIN tidak valid. Inget2 Pak/Bu');
      setPin('');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Hanya angka
    setPin(value);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50" onClick={handleOverlayClick}>
            <div className={`absolute inset-0 backdrop-blur-md transition-colors duration-300 ${darkMode ? 'bg-black/40' : 'bg-black/20'}`}></div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`relative rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 border backdrop-blur-lg transition-colors duration-300 ${
                darkMode ? 'bg-gray-800/80 border-gray-700/50 text-white' : 'bg-white/80 border-white/40 text-gray-800'
              }`}
            >
              <h2 className="text-xl font-semibold mb-4 text-center">Masukkan PIN</h2>
              <p className={`text-sm mb-4 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Masukkan PIN untuk melanjutkan registrasi</p>

              <form onSubmit={handleSubmit}>
                <input
                  type="password"
                  value={pin}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg text-center text-xl font-mono transition-colors duration-300 ${
                    darkMode ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                  placeholder="••••••"
                  maxLength={6}
                  required
                  autoFocus
                />

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`flex-1 py-3 border rounded-lg font-medium transition-colors duration-300 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50' : 'border-gray-300 text-gray-700 hover:bg-gray-100/50'}`}
                  >
                    Batal
                  </button>
                  <button type="submit" className={`flex-1 py-3 font-semibold rounded-lg transition-colors duration-300 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                    Verifikasi
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className={`fixed bottom-4 right-4 z-50 rounded-lg shadow-lg border backdrop-blur-lg transition-colors duration-300 ${darkMode ? 'bg-red-600/90 border-red-700 text-white' : 'bg-red-500/90 border-red-400 text-white'}`}
          >
            <div className="flex items-center p-4">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{toastMessage}</p>
              </div>
              <button onClick={() => setShowToast(false)} className="ml-auto inline-flex text-white hover:text-gray-200 transition-colors duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <motion.div initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 3, ease: 'linear' }} className={`h-1 ${darkMode ? 'bg-red-700' : 'bg-red-400'} origin-left`} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PinDialog;
