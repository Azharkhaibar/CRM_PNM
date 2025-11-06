import React, { useState } from 'react';
import InputField from '../components/inputField';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../../assets/Gedung-PNM-Banner.jpg';
import fileIMG from '../../../assets/LogoRIMS.png';
import { useAuth } from '../hooks/useAuth.hook';
export default function LoginPage() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const nvg = useNavigate()
  const { loading, error, login} = useAuth();

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
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-4 mt-[-170px]">
            <img src={fileIMG} alt="PNM Logo" className="mx-auto w-[400px] h-auto rounded-lg" />
          </div>
          <form onSubmit={handleLogin} className="mt-[-90px]">
            <InputField label="UserID" type="text" value={userID} onChange={(e) => setUserID(e.target.value)} />
            <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading} className={`w-full text-white py-2 rounded-lg  transition duration-300 cursor-pointer ${loading ? 'bg bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? 'Logging in' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      <div className="hidden md:block w-1/2 relative bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}></div> 
    </div>
  );
}
