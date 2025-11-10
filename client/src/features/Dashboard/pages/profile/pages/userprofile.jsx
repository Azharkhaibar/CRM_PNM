import { useAuth } from '../../../../auth/hooks/useAuth.hook';
import { useProfile } from '../hooks/profile.hook';
import Avatar from 'react-avatar';
import { FaSave, FaRedo, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../../../../shared/components/Darkmodecontext';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { profile, loading, updating, error, fetchProfile, updateProfile } = useProfile(authUser?.user_id);
  const { darkMode } = useDarkMode();

  const [showNotif, setShowNotif] = useState(false);
  const [formData, setFormData] = useState({ role: '', gender: '' });
  const [hasChanges, setHasChanges] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const previousProfileRef = useRef(null);

  const normalizeData = (data) => {
    return {
      role: data?.role || '',
      gender: data?.gender || '',
    };
  };

  useEffect(() => {
    if (profile && !previousProfileRef.current) {
      const normalized = normalizeData(profile);
      console.log('🎯 Initializing form data:', normalized);
      setFormData(normalized);
      previousProfileRef.current = profile;
    }
  }, [profile]);


  useEffect(() => {
    if (profile) {
      const normalizedProfile = normalizeData(profile);
      const hasRoleChanged = formData.role !== normalizedProfile.role;
      const hasGenderChanged = formData.gender !== normalizedProfile.gender;
      const changesExist = hasRoleChanged || hasGenderChanged;

      console.log('🔄 Changes check:', {
        formData,
        normalizedProfile,
        hasChanges: changesExist,
      });

      setHasChanges(changesExist);
    }
  }, [formData, profile]);

  useEffect(() => {
    if (profile && previousProfileRef.current !== profile) {
      console.log('🔄 Profile updated, syncing form data');
      const normalized = normalizeData(profile);
      setFormData(normalized);
      previousProfileRef.current = profile;
    }
  }, [profile]);

  const handleSave = async () => {
    if (!hasChanges) {
      console.log('No changes to save');
      return;
    }

    // Validation
    if (!formData.role || !formData.gender) {
      setSaveError('Role dan Gender harus diisi');
      return;
    }

    try {
      setSaveError(null);
      console.log('💾 Saving changes:', formData);

      const result = await updateProfile({
        role: formData.role, 
        gender: formData.gender, 
      });

      console.log('✅ Save successful:', result);
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveError(err.message || 'Gagal menyimpan perubahan');
    }
  };

  const handleRetry = () => {
    setSaveError(null);
    fetchProfile();
  };

  const handleFormChange = (field, value) => {
    console.log(`📝 Form change: ${field} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (saveError) setSaveError(null);
  };

  const handleResetForm = () => {
    if (profile) {
      console.log('🔄 Resetting form to profile data');
      const normalized = normalizeData(profile);
      setFormData(normalized);
      setSaveError(null);
    }
  };

  const displayUserID = profile?.userID || authUser?.userID || 'Loading...';
  const displayRole = profile?.role || authUser?.role || 'N/A';
  const displayGender = profile?.gender || authUser?.gender || 'N/A';
  const displayDivisi = profile?.divisi?.name || authUser?.divisi?.name || 'Tidak ada divisi';

  const containerClass = `min-h-screen p-6 relative transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`;
  const cardClass = `w-full rounded-2xl p-8 border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`;
  const infoCardClass = `p-5 rounded-xl border shadow-sm w-full transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`;
  const labelClass = `block font-medium mb-1 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;
  const selectClass = `w-full border rounded-lg px-3 py-2 shadow-sm transition-colors duration-300 ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
  }`;
  const textMutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-600' : 'border-gray-200';

  if (error && !profile && !authUser) {
    return (
      <div className={containerClass}>
        <div className={cardClass}>
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Gagal Memuat Profil</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={handleRetry} className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
              <FaRedo /> Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-2">
              <FaCheckCircle />
              <span>Profile berhasil diupdate!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && profile && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${darkMode ? 'bg-yellow-900/50 border-yellow-700 text-yellow-200' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}
        >
          <FaExclamationTriangle className="flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold">Mode Data Sementara</div>
            <div className="text-sm">Perubahan disimpan secara lokal</div>
          </div>
          <button onClick={handleRetry} className={`px-3 py-1 rounded text-sm ${darkMode ? 'bg-yellow-700 hover:bg-yellow-600' : 'bg-yellow-200 hover:bg-yellow-300'}`}>
            Refresh
          </button>
        </motion.div>
      )}

      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`text-3xl font-bold mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        My Profile
      </motion.h1>

      {loading && !profile ? (
        <div className="w-full space-y-6">
          <div className={`flex flex-wrap items-center gap-6 border-b pb-6 ${borderClass}`}>
            <div className={`rounded-full h-20 w-20 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="flex-1 space-y-2">
              <div className={`h-6 rounded w-32 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`h-4 rounded w-24 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cardClass}>
          <div className={`flex flex-wrap items-center gap-6 border-b pb-6 ${borderClass}`}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Avatar name={displayUserID} size="85" round color={darkMode ? '#60A5FA' : '#1E3A8A'} />
            </motion.div>

            <div>
              <h2 className={`text-2xl font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{displayUserID}</h2>
              <p className={textMutedClass + ' text-sm'}>User Identifier</p>
              {error && profile && <p className={`text-xs mt-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>● Perubahan disimpan secara lokal</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={infoCardClass}>
              <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account Details</p>
              <p>
                <strong>Role:</strong> {displayRole}
              </p>
              <p>
                <strong>Gender:</strong> {displayGender}
              </p>
              <p>
                <strong>Divisi:</strong> {displayDivisi}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={infoCardClass}>
              <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>System Info</p>
              <p>
                <strong>Dibuat:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID') : 'N/A'}
              </p>
              <p>
                <strong>Diupdate:</strong> {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('id-ID') : 'N/A'}
              </p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10 w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Profile</h3>
              {hasChanges && (
                <button onClick={handleResetForm} className={`text-sm px-3 py-1 rounded border ${darkMode ? 'text-gray-300 border-gray-600 hover:bg-gray-600' : 'text-gray-600 border-gray-300 hover:bg-gray-100'}`}>
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div>
                <label className={labelClass}>Role</label>
                <select className={selectClass} value={formData.role} onChange={(e) => handleFormChange('role', e.target.value)}>
                  <option value="">Pilih Role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Current: {displayRole}</p>
              </div>

              <div>
                <label className={labelClass}>Gender</label>
                <select className={selectClass} value={formData.gender} onChange={(e) => handleFormChange('gender', e.target.value)}>
                  <option value="">Pilih Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Current: {displayGender}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <motion.button
                whileHover={{ scale: hasChanges ? 1.03 : 1 }}
                whileTap={{ scale: hasChanges ? 0.95 : 1 }}
                onClick={handleSave}
                disabled={updating || !hasChanges || !formData.role || !formData.gender}
                className={`px-7 py-3 rounded-lg shadow-md font-medium flex items-center gap-2 transition-all duration-300 ${
                  hasChanges ? (darkMode ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700') : darkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaSave />
                {updating ? 'Menyimpan...' : hasChanges ? 'Simpan Perubahan' : 'Tidak ada perubahan'}
              </motion.button>

              {hasChanges && <div className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>● Ada perubahan yang belum disimpan</div>}
            </div>

            {saveError && (
              <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-600'}`}>
                <strong>Error:</strong> {saveError}
              </div>
            )}

            {error && !profile && (
              <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-600'}`}>
                <strong>Error:</strong> {error}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
