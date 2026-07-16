import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../auth/hooks/useAuth.hook';
import { useDarkMode } from '../../../../../shared/components/Darkmodecontext';
import RIMS_API from '../../../../auth/api/auth.api';
const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    language: 'en',
    timeZone: 'UTC',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { user, updating, changePassword, updateProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [pinData, setPinData] = useState({
    newPin: '',
    confirmPin: '',
  });
  const [dbPin, setDbPin] = useState('••••••');
  const [showDbPin, setShowDbPin] = useState(false);
  const [isLoadingPin, setIsLoadingPin] = useState(false);

  const fetchPin = async () => {
    try {
      setIsLoadingPin(true);
      const res = await RIMS_API.get('/system-settings/registration-pin');
      setDbPin(res.data.pin);
    } catch (err) {
      console.error('Failed to fetch PIN:', err);
    } finally {
      setIsLoadingPin(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pin' && user?.role === 'ADMIN') {
      fetchPin();
    }
  }, [activeTab, user?.role]);

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Numbers only
    const { name } = e.target;
    setPinData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();

    if (pinData.newPin !== pinData.confirmPin) {
      alert('PIN Baru dan Konfirmasi PIN tidak cocok!');
      return;
    }

    if (pinData.newPin.length !== 6 || !/^\d+$/.test(pinData.newPin)) {
      alert('PIN harus terdiri dari 6 digit angka!');
      return;
    }

    try {
      setIsLoadingPin(true);
      await RIMS_API.put('/system-settings/registration-pin', { pin: pinData.newPin });
      alert('PIN Registrasi berhasil diperbarui!');
      setDbPin(pinData.newPin);
      setPinData({
        newPin: '',
        confirmPin: '',
      });
    } catch (err) {
      alert('Gagal memperbarui PIN: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoadingPin(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(settings);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirmation password do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long!');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const containerClass = `min-h-screen p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`;

  const cardClass = `rounded-lg shadow-md p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`;

  const tabButtonClass = (isActive) =>
    `py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
      isActive
        ? darkMode
          ? 'border-blue-500 text-blue-400'
          : 'border-blue-500 text-blue-600'
        : darkMode
        ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

  const labelClass = `block text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  const inputClass = `w-full p-2 border rounded-md transition-colors duration-300 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
  }`;

  const buttonClass = `px-4 py-2 rounded-md font-medium transition-colors duration-300 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} ${
    updating ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  const descriptionClass = `text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`;

  const borderClass = `border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`;

  return (
    <div className={containerClass}>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className={`mb-6 ${borderClass}`}>
        <nav className="flex space-x-8">
          <button onClick={() => setActiveTab('general')} className={tabButtonClass(activeTab === 'general')}>
            General Settings
          </button>

          <button onClick={() => setActiveTab('password')} className={tabButtonClass(activeTab === 'password')}>
            Change Password
          </button>

          {user?.role === 'ADMIN' && (
            <button onClick={() => setActiveTab('pin')} className={tabButtonClass(activeTab === 'pin')}>
              Configure PIN
            </button>
          )}
        </nav>
      </div>

      <div className={cardClass}>
        {activeTab === 'general' && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Notifications</h3>
                    <p className={descriptionClass}>Receive notifications for risk updates</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" name="notifications" checked={settings.notifications} onChange={handleInputChange} />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto Save</h3>
                    <p className={descriptionClass}>Automatically save your work</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" name="autoSave" checked={settings.autoSave} onChange={handleInputChange} />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className={descriptionClass}>Enable dark theme</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" name="darkMode" checked={darkMode} onChange={toggleDarkMode} />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div>
                  <label className={labelClass}>Language</label>
                  <select name="language" value={settings.language} onChange={handleInputChange} className={inputClass}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Time Zone</label>
                  <select name="timeZone" value={settings.timeZone} onChange={handleInputChange} className={inputClass}>
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={updating} className={buttonClass}>
                {updating ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Current Password</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className={inputClass} required />
                </div>

                <div>
                  <label className={labelClass}>New Password</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className={inputClass} required minLength="6" />
                  <p className={`text-sm mt-1 ${descriptionClass}`}>Password must be at least 6 characters long</p>
                </div>

                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className={inputClass} required />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={updating} className={buttonClass}>
                {updating ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'pin' && user?.role === 'ADMIN' && (
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Configure Registration PIN</h2>
              <p className={descriptionClass}>
                Atur atau ubah PIN pengaman yang harus dimasukkan calon pengguna sebelum dapat mengakses halaman registrasi.
              </p>
            </div>

            <div className={`p-4 rounded-lg flex items-center justify-between border transition-all duration-300 ${
              darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div>
                <h3 className="text-sm font-medium">PIN Registrasi Aktif</h3>
                <p className="text-2xl font-bold font-mono tracking-widest mt-1">
                  {showDbPin ? dbPin : '••••••'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDbPin(!showDbPin)}
                className={`p-2 rounded-md transition-colors hover:bg-gray-500/20`}
                title={showDbPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showDbPin ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>PIN Baru</label>
                <input
                  type="password"
                  name="newPin"
                  value={pinData.newPin}
                  onChange={handlePinChange}
                  className={inputClass}
                  maxLength={6}
                  placeholder="Masukkan 6 digit angka"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Konfirmasi PIN Baru</label>
                <input
                  type="password"
                  name="confirmPin"
                  value={pinData.confirmPin}
                  onChange={handlePinChange}
                  className={inputClass}
                  maxLength={6}
                  placeholder="Konfirmasi 6 digit angka"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={isLoadingPin} className={buttonClass}>
                {isLoadingPin ? 'Menyimpan...' : 'Perbarui PIN'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
