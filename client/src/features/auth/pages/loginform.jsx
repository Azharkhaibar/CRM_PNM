import React, { useState } from 'react';
import InputField from '../components/inputField';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../../../assets/Gedung-PNM-Banner.jpg';
import fileIMG from '../../../assets/LogoRIMS.png';
import { useAuth } from '../hooks/useAuth.hook';
export default function LoginPage() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const nvg = useNavigate();
  const { loading, error, login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userID || !password) {
      alert('UserID dan Password harus diisi');
      return;
    }

    try {
      const resUserDt = await login(userID, password);
      console.log('Login berhasil', resUserDt);
      nvg('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      alert(err instanceof Error ? err.message : 'Login gagal, silahkan coba lagi');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="flex-1 flex items-center justify-center p-6">
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

      <div
        className="hidden md:block w-1/2 relative bg-cover bg-center grayscale-[20%] brightness-75"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </div>
  );
}
