import { useAuth } from '../../../../auth/hooks/useAuth.hook';
import { useProfile } from '../hooks/profile.hook';
import Avatar from 'react-avatar';
import { FaSave } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, updating, error, updateProfile } = useProfile(user?.user_id);

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen p-6 relative bg-gradient-to-br from-gray-100 to-gray-200">
      <AnimatePresence>
        {showNotif && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="fixed top-24 right-10 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50">
            ✅ Profile diUpdate!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-bold text-gray-900 mb-6">
        My Profile
      </motion.h1>

      {loading || !profile ? (
        <div className="w-full space-y-6">
          <div className="flex flex-wrap items-center gap-6 border-b pb-6">
            <div className="rounded-full bg-gray-300 h-20 w-20 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-gray-300 h-28 animate-pulse"></div>
            <div className="p-5 rounded-xl bg-gray-300 h-28 animate-pulse"></div>
          </div>

          <div className="mt-10 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-300 rounded w-40 animate-pulse mt-4"></div>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-white rounded-2xl p-8 border border-gray-200">
          <div className="flex flex-wrap items-center gap-6 border-b pb-6">
            <motion.div whileHover={{ scale: 1.03 }}>
              <Avatar name={profile.userID} size="85" round color="#1E3A8A" />
            </motion.div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{profile.userID}</h2>
              <p className="text-gray-500 text-sm">User Identifier</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-gray-200 bg-gray-50 shadow-sm w-full">
              <p className="text-xs text-gray-500 font-semibold mb-2">Account Details</p>
              <p>
                <strong>Role:</strong> {profile.role}
              </p>
              <p>
                <strong>Gender:</strong> {profile.gender}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-gray-200 bg-gray-50 shadow-sm w-full">
              <p className="text-xs text-gray-500 font-semibold mb-2">System Info</p>
              <p>
                <strong>Dibuat:</strong> {new Date(profile.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Diupdate:</strong> {new Date(profile.updated_at).toLocaleDateString()}
              </p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10 w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Profile</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Role</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Gender</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={updating}
              className="mt-6 px-7 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <FaSave /> {updating ? 'Saving...' : 'Save Changes'}
            </motion.button>

            {error && <p className="text-red-500 mt-3">{error}</p>}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
