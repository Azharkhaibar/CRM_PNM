import React, { useState } from 'react';
import InputField from '../components/inputField';
import fileIMG from '../../../assets/LogoRIMS.png';
import bgImage from '../../../assets/Gedung-PNM-Banner.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.hook';
import GenderToggleSignupDialog from '../../../shared/components/genderToggle';
export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [genderForm, setGenderForm] = useState('male');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userID || !password) {
      console.warn('[Register] UserID atau Password kosong');
      return alert('UserID dan Password wajib diisi');
    }
    const payload = { userID, password, role, gender: genderForm };
    console.log('[Register] Payload dikirim:', payload);

    try {
      const result = await register(payload);
      console.log('[Register] Response:', result);

      alert('Registrasi berhasil! Silakan login');
      navigate('/login');
    } catch (err) {
      console.error('[Register] Register failed:', err);

      if (err?.response) {
        console.error('[Register] Response data:', err.response.data);
        const msg = err.response.data?.message;
        if (Array.isArray(msg)) {
          alert(msg.join('\n'));
        } else {
          alert(msg || 'Registrasi gagal, cek input dan backend');
        }
      } else if (err?.request) {
        alert('Backend tidak merespon, cek server');
      } else {
        alert(err.message || 'Registrasi gagal, cek console');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md backdrop-blur-md bg-white/50 shadow-2xl rounded-2xl p-8 border border-white/40">
          <div className="text-center mb-8">
            <img src={fileIMG} alt="PNM Logo" className="mx-auto w-64 mt-[-50px] drop-shadow-lg" />
            <h1 className="text-2xl font-semibold text-gray-800 mt-[-40px]">Register Akun Baru</h1>
            <p className="text-gray-600 text-sm mt-2">Silahkan isi form di bawah untuk membuat akun</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <InputField label="UserID" type="text" value={userID} onChange={(e) => setUserID(e.target.value)} />
            <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div>
              <label className="text-gray-700 font-medium">Role</label>
              <select className="w-full mt-1 border p-2 rounded-lg" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">admin</option>
                <option value="user">user</option>
              </select>
            </div>

            <div>
              <label className="text-gray-700 font-medium">Gender</label>
              <GenderToggleSignupDialog genderForm={genderForm} setGenderForm={setGenderForm} />
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
          </form>
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative bg-cover bg-center grayscale-[20%] brightness-75" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </div>
  );
}
