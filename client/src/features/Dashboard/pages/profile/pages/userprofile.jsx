import { useAuth } from '../../../../auth/hooks/useAuth.hook';
import { useProfile } from '../hooks/profile.hook';
import Avatar from 'react-avatar';
import { FaSave } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../../../../shared/components/Darkmodecontext';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, updating, error, updateProfile } = useProfile(user?.user_id);
  const { darkMode } = useDarkMode(); 

  const [showNotif, setShowNotif] = useState(false);
  const [formData, setFormData] = useState({ role: '', gender: '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        role: profile.role,
        gender: profile.gender,
      });
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile({
      role: formData.role,
      gender: formData.gender,
    });

    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 2500);
  };

  const containerClass = `min-h-screen p-6 relative transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`;

  const cardClass = `w-full rounded-2xl p-8 border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`;

  const infoCardClass = `p-5 rounded-xl border shadow-sm w-full transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`;

  const labelClass = `block font-medium mb-1 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  const selectClass = `w-full border rounded-lg px-3 py-2 shadow-sm transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`;

  const textMutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-600' : 'border-gray-200';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={containerClass}>
      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-24 right-10 px-4 py-3 rounded-lg shadow-lg z-50 transition-colors duration-300 ${darkMode ? 'bg-green-700 text-white' : 'bg-green-600 text-white'}`}
          >
            ✅ Profile diUpdate!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`text-3xl font-bold mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        My Profile
      </motion.h1>

      {loading || !profile ? (
        <div className="w-full space-y-6">
          <div className={`flex flex-wrap items-center gap-6 border-b pb-6 ${borderClass}`}>
            <div className={`rounded-full h-20 w-20 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="flex-1 space-y-2">
              <div className={`h-6 rounded w-32 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`h-4 rounded w-24 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-5 rounded-xl h-28 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`p-5 rounded-xl h-28 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          </div>

          <div className="mt-10 space-y-4">
            <div className={`h-6 rounded w-40 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`h-12 rounded animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`h-12 rounded animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>
            <div className={`h-12 rounded w-40 animate-pulse mt-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cardClass}>
          <div className={`flex flex-wrap items-center gap-6 border-b pb-6 ${borderClass}`}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Avatar name={profile.userID} size="85" round color={darkMode ? '#60A5FA' : '#1E3A8A'} />
            </motion.div>

            <div>
              <h2 className={`text-2xl font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{profile.userID}</h2>
              <p className={textMutedClass + ' text-sm'}>User Identifier</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={infoCardClass}>
              <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account Details</p>
              <p>
                <strong>Role:</strong> {profile.role}
              </p>
              <p>
                <strong>Gender:</strong> {profile.gender}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={infoCardClass}>
              <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>System Info</p>
              <p>
                <strong>Dibuat:</strong> {new Date(profile.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Diupdate:</strong> {new Date(profile.updated_at).toLocaleDateString()}
              </p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10 w-full">
            <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Profile</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div>
                <label className={labelClass}>Role</label>
                <select className={selectClass} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Gender</label>
                <select className={selectClass} value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={updating}
              className={`mt-6 px-7 py-3 rounded-lg shadow-md font-medium flex items-center gap-2 transition-colors duration-300 ${
                darkMode ? 'bg-blue-700 text-white hover:bg-blue-600 disabled:bg-blue-800' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
              }`}
            >
              <FaSave /> {updating ? 'Saving...' : 'Save Changes'}
            </motion.button>

            {error && <p className={`mt-3 transition-colors duration-300 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
