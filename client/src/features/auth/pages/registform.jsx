import React, { useState } from 'react';
import InputField from '../components/inputField';
import fileIMG from '../../../assets/LogoRIMS.png';
import bgImage from '../../../assets/Gedung-PNM-Banner.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.hook';

export default function RegisterPage() {
  const nvg = useNavigate();
  const { register, loading, error } = useAuth(); // ✅ gunakan hook auth

  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [gender, setGender] = useState('MALE');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register({ userID, password, role, gender });

      alert('Registrasi berhasil! Silakan login');
      nvg('/login');
    } catch (err) {
      console.error('Register failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md backdrop-blur-md bg-white/50 shadow-2xl rounded-2xl p-8 border border-white/40">
          <div className="text-center mb-8">
            <img src={fileIMG} alt="PNM Logo" className="mx-auto w-64 drop-shadow-lg" />
            <h1 className="text-3xl font-semibold text-gray-800 mt-4">Register Akun Baru</h1>
            <p className="text-gray-600 text-sm mt-2">Silahkan isi form di bawah untuk membuat akun</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <InputField label="UserID" type="text" value={userID} onChange={(e) => setUserID(e.target.value)} />

            <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div>
              <label className="text-gray-700 font-medium">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-gray-300">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div>
              <label className="text-gray-700 font-medium">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-gray-300">
                <option value="MALE">Laki-laki</option>
                <option value="FEMALE">Perempuan</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-3 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg
              ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-[.98]'}`}
            >
              {loading ? 'Processing...' : 'Register'}
            </button>

            <p className="text-center text-sm mt-3 text-gray-700">
              Sudah punya akun?{' '}
              <span onClick={() => nvg('/login')} className="text-blue-600 hover:underline cursor-pointer">
                Login
              </span>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative bg-cover bg-center grayscale-[20%] brightness-75" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </div>
  );
}
