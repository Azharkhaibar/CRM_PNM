import React, { useState } from 'react';
import InputField from '../components/inputField';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../../../assets/Gedung-PNM-Banner.jpg';
import fileIMG from '../../../assets/LogoRIMS.png';
import { useAuth } from '../hooks/useAuth.hook';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const nvg = useNavigate();
  const { loading, error, login } = useAuth();

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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-200 relative">
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md backdrop-blur-md bg-white/50 shadow-2xl rounded-2xl p-8 border border-white/40">
          <div className="text-center mb-8">
            <img src={fileIMG} alt="PNM Logo" className="mx-auto w-64 h-auto drop-shadow-lg" />
            <h1 className="text-3xl font-semibold text-gray-800 mt-4">Selamat Datang</h1>
            <p className="text-gray-600 text-sm mt-2">Silahkan login untuk mengakses dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <InputField label="UserID" type="text" value={userID} onChange={(e) => setUserID(e.target.value)} />
              <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[.98]'}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="mt-4 text-center text-sm text-gray-700">
              Not already have an account?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative bg-cover bg-center grayscale-[20%] brightness-75" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-white rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
              <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <p className="text-gray-700 font-medium">Logging in...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
