import { useEffect, useState } from 'react';
import RIMS_API from '../../../auth/api/auth.api';
import { useAuth } from '../../../auth/hooks/useAuth.hook';
const ProfilePage = () => {
  const { user, loading, error } = useAuth();
  const [formData, setFormData] = useState({ role: '', gender: '' });

  useEffect(() => {
    if (user) {
      setFormData({ role: user.role || '', gender: user.gender || '' });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await RIMS_API.patch(`/users/${user.userID}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile berhasil diperbarui');
    } catch (err) {
      if (err instanceof Error) {
        alert('Update gagal');
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
      <input value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
