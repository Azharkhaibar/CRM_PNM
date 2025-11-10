import React, { useState } from 'react';
import { useAuth } from '../../../../auth/hooks/useAuth.hook';
import { useDarkMode } from '../../../../../shared/components/Darkmodecontext';
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
      </div>
    </div>
  );
};

export default Settings;
